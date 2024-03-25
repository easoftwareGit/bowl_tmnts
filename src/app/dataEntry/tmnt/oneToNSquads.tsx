import React, { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { squadType, AcdnErrType, eventType } from "./types";
import { initSquad } from "./initVals";
import { Tabs, Tab } from "react-bootstrap";
import ModalConfirm, { delConfTitle } from "@/components/modal/confirmModal";
import { initModalObj } from "@/components/modal/modalObjType";
import { 
  objErrClassName,
  acdnErrClassName,
  getAcdnErrMsg,
  noAcdnErr,
  isDuplicateName,
  isDuplicateDateTime,
} from "./errors";
import { maxEventLength, minGames, maxGames } from "@/lib/validation";
import { dateTo_yyyyMMdd, todayStr, twelveHourto24Hour } from "@/lib/dateTools";
import { isValid } from "date-fns";
import { mockSquads } from "../../../../test/mocks/tmnts/singlesAndDoubles/mockSquads";

interface ChildProps {
  squads: squadType[];
  setSquads: (squads: squadType[]) => void;
  events: eventType[];
  setAcdnErr: (objAcdnErr: AcdnErrType) => void;
}
interface AddOrDelButtonProps {
  id: string;
  sortOrder: number;
}

const defaultTabKey = "squad1";

const getSquadErrMsg = (squad: squadType): string => {

  if (squad.event_id_err) return squad.event_id_err;
  if (squad.squad_name_err) return squad.squad_name_err;
  if (squad.games_err) return squad.squad_date_err;  
  if (squad.squad_date_err) return squad.games_err;
  if (squad.squad_time_err) return squad.squad_time_err;
  return "";
};

const getNextAcdnErrMsg = (
  updatedSquad: squadType | null,
  squads: squadType[]
): string => {
  let errMsg = "";
  let acdnErrMsg = "";
  let i = 0;
  let squad: squadType;
  while (i < squads.length && !errMsg) {
    if (squads[i].id === updatedSquad?.id) {
      squad = updatedSquad;
    } else {
      squad = squads[i];
    }
    errMsg = getSquadErrMsg(squad);
    if (errMsg) {
      acdnErrMsg = getAcdnErrMsg(squad.squad_name, errMsg);
    }
    i++;
  }
  return acdnErrMsg;
};

export const validateSquads = (
  squads: squadType[],
  setSquads: Dispatch<SetStateAction<squadType[]>>,
  events: eventType[],
  setAcdnErr: Dispatch<SetStateAction<AcdnErrType>>,
  minDateString: string = todayStr,
  maxDateString: string = todayStr
): boolean => {
  let areSquadsValid = true;
  let eventIdErr = "";
  let nameErr = "";
  let gameErr = "";
  let dateErr = "";
  let timeErr = "";
  let squadErrClassName = "";
  let squadMaxGames = maxGames
  const minDate = new Date(minDateString);
  const maxDate = new Date(maxDateString);
  
  const setError = (squadName: string, errMsg: string) => {
    if (areSquadsValid) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: getAcdnErrMsg(squadName, errMsg),
      });
    }
    areSquadsValid = false;
    squadErrClassName = objErrClassName;
  };

  setSquads(
    squads.map((squad) => {
      squadErrClassName = "";
      const event = events.find(ev => ev.id === squad.event_id);
      if (!event) {
        eventIdErr = "Event not found"
        setError(squad.squad_name, eventIdErr);
        squadMaxGames = maxGames
      } else {
        squadMaxGames = event.games
        eventIdErr = "";
      }
      if (!squad.squad_name.trim()) {
        nameErr = "Name is required";
        setError(squad.squad_name, nameErr);
      } else if (isDuplicateName(squads, squad)) {
        nameErr = `"${squad.squad_name}" has already been used.`;
        setError(squad.squad_name, nameErr);
      } else {
        nameErr = "";
      }
      if (squad.games < minGames) {
        gameErr = "Squad Games must be more than " + (minGames - 1);
        setError(squad.squad_name, gameErr);
      } else if (squad.games > squadMaxGames) {        
        gameErr = "Squad Games must be less than " + (squadMaxGames + 1);
        setError(squad.squad_name, gameErr);
      } else {
        gameErr = "";
      }
      if (!squad.squad_date.trim()) {
        dateErr = "Date is required";
        setError(squad.squad_name, dateErr);
      } else if (!isValid(new Date(squad.squad_date))) {
        dateErr = "Date is invalid";
        setError(squad.squad_name, dateErr);
      } else if ((new Date(squad.squad_date)) < minDate) {
        dateErr = "Earliest date is " + dateTo_yyyyMMdd(minDate);
        setError(squad.squad_name, dateErr);
      } else if ((new Date(squad.squad_date)) > maxDate) {
        dateErr = "Latest date is " + dateTo_yyyyMMdd(maxDate);
        setError(squad.squad_name, dateErr);
      } else {
        dateErr = "";
      }
      if (squads.length === 1) {
        if (!squad.squad_time) {
          timeErr = "";
        }
      } else {
        if (!squad.squad_time) {
          timeErr = 'Time is required'
        } else if (isDuplicateDateTime(squads, squad)) {
          timeErr = `"${squad.squad_date}" - ${squad.squad_time} has already been used.`;
          setError(squad.squad_name, timeErr);
        } else {
          timeErr = ""; 
        }
      }
      return {
        ...squad,
        event_id_err: eventIdErr,
        name_err: nameErr,
        games_err: gameErr,
        squad_date_err: dateErr,
        squad_time_err: timeErr,
        errClassName: squadErrClassName,
      };
    })
  );

  if (squads.length > 1) {
  }

  if (areSquadsValid) {
    setAcdnErr(noAcdnErr);
  }
  return areSquadsValid;
};

const OneToNSquads: React.FC<ChildProps> = ({
  squads,
  setSquads,
  events,
  setAcdnErr,
}) => {
  const [modalObj, setModalObj] = useState(initModalObj);
  const [tabKey, setTabKey] = useState(defaultTabKey);
  const [squadId, setSquadId] = useState(1); // id # used in initSquads in form.tsx

  const handleAdd = () => {
    const newSquad: squadType = {
      ...initSquad,
      id: '' + (squadId + 1),
      squad_name: "Squad " + (squadId + 1),
      tab_title: "Squad " + (squadId + 1),
      sort_order: squadId + 1,
    };
    setSquadId(squadId + 1);
    setSquads([...squads, newSquad]);
  };

  const confirmedDelete = () => {
    setModalObj(initModalObj); // reset modal object (hides modal)

    // filter out deleted squad
    const updatedData = squads.filter((squad) => squad.id !== modalObj.id);
    setSquads(updatedData);

    // deleted squad might have an acdn error, get next acdn error
    const acdnErrMsg = getNextAcdnErrMsg(null, updatedData);
    if (acdnErrMsg) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: acdnErrMsg
      })
    } else {
      setAcdnErr(noAcdnErr)
    }

    setTabKey(defaultTabKey); // refocus 1st event
  };

  const canceledDelete = () => {
    setModalObj(initModalObj); // reset modal object (hides modal)
  };

  const handleDelete = (id: string) => {
    const squadToDel = squads.find((squad) => squad.id === id);
    // if did not find event OR first event (must have at least 1 event)
    if (!squadToDel || squadToDel.sort_order === 1) return;

    const toDelName = squadToDel.squad_name;
    setModalObj({
      show: true,
      title: delConfTitle,
      message: `Do you want to delete Squad: ${toDelName}?`,
      id: id,
    }); // deletion done in confirmedDelete
  };

  const handleInputChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nameErr = name + "_err";
    setSquads(
      squads.map((squad) => {
        if (squad.id === id) {
          let updatedSquad: squadType;
          // set tabTitle changing name property value
          if (name === "name") {
            updatedSquad = {
              ...squad,
              squad_name: value,
              tab_title: value,
              squad_name_err: "",
            };
          } else if (name === "squad_time") {
            const valueAsDate = e.target.valueAsDate;
            let timeStr = "";
            if (valueAsDate) {
              const offset = valueAsDate.getTimezoneOffset();
              let currentDateTime = new Date(
                valueAsDate.getFullYear(),
                valueAsDate.getMonth() - 1,
                valueAsDate.getDate(),
                valueAsDate.getHours(),
                valueAsDate.getMinutes() + offset
              );
              timeStr = currentDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              timeStr = twelveHourto24Hour(timeStr);
            }
            updatedSquad = {
              ...squad,
              squad_time: timeStr,
              squad_time_err: "",
            };
          } else {
            updatedSquad = {
              ...squad,
              [name]: value,
              [nameErr]: "",
            };
          }
          const acdnErrMsg = getNextAcdnErrMsg(updatedSquad, squads);
          if (acdnErrMsg) {
            setAcdnErr({
              errClassName: acdnErrClassName,
              message: acdnErrMsg,
            });
          } else {
            setAcdnErr(noAcdnErr);
          }
          const errMsg = getSquadErrMsg(updatedSquad);
          if (errMsg) {
            return {
              ...updatedSquad,
              errClassName: objErrClassName,
            };
          } else {
            return {
              ...updatedSquad,
              errClassName: "",
            };
          }
        } else {
          return squad;
        }
      })
    );
  };

  const handleBlur = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!value.trim()) {
      setSquads(
        squads.map((squad) => {
          if (squad.id === id) {
            if (name === "name") {
              return {
                ...squad,
                name: "Squad " + squad.id,
                tab_title: "Squad " + squad.id,
                name_err: "",
              };
            } else if (name === "games") {
              return {
                ...squad,
                games: 3,
                games_err: "",
              };
            } else if (name === "squad_date") {
              return {
                ...squad,
                squad_date: todayStr,
                squad_date_err: "",
              };
            } else if (name === "squad_time") {
              const timeInput = document.getElementById(
                `inputSquadTime${id}`
              ) as HTMLInputElement;
              if (timeInput) {
                timeInput.value = "";
              }
              return {
                ...squad,
                squad_time: "",
                squad_time_err: "",
              };
            } else {
              return squad;
            }
          } else {
            return squad;
          }
        })
      );
    }
  };

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setTabKey(key);
    }
  };

  const handleEventSelectChange = (id: string) => (e: ChangeEvent<HTMLSelectElement>) => {
    const { selectedIndex } = e.target;
    setSquads(
      squads.map(squad => {
        if (squad.id === id) {
          // get event id # from selectedIndex of events
          const eventId = events[selectedIndex].id;
          return {
            ...squad, 
            event_id: eventId,
            event_nane_err: '',
          }
        } else {
          return squad
        }
      })
    )
  };

  const AddOrDelButton: React.FC<AddOrDelButtonProps> = ({ id, sortOrder }) => {
    if (sortOrder === 1) {
      return (
        <div className="col-sm-3">
          <label htmlFor="inputNumSquads" className="form-label">
            # Squads            
          </label>
          <div className="row g-0">
            <div className="col-sm-8">
              <input
                disabled
                type="text"
                className="form-control"
                id="inputNumSquads"
                data-testid="inputNumSquads"
                name="num_Squads"
                value={squads.length}
              />
            </div>
            <div className="d-grid col-sm-4">            
              <button
                className="btn btn-success"
                id="squadAdd"
                onClick={handleAdd}                
              >
                Add
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-sm-3 d-flex justify-content-center align-items-end">
          <button
            className="btn btn-danger"
            id="squadDel"
            data-testid={`id_${id}_sortOrder_${sortOrder}`}
            onClick={() => handleDelete(id)}
          >
            Delete Squad
          </button>
        </div>
      );
    }
  };

  const eventOptions = events.map(event => (
    <option key={event.id} value={event.id}>
      {event.event_name}
    </option>
  ));

  return (
    <>
      <ModalConfirm
        show={modalObj.show}
        title={modalObj.title}
        message={modalObj.message}
        onConfirm={confirmedDelete}
        onCancel={canceledDelete}
      />
      <Tabs
        defaultActiveKey={defaultTabKey}
        id="squad-tabs"
        className="mb-2"
        variant="pills"
        activeKey={tabKey}
        onSelect={handleTabSelect}
      >
        {squads.map((squad) => (
          <Tab
            key={squad.id}
            eventKey={`squad${squad.id}`}
            title={squad.tab_title}
            tabClassName={`${squad.errClassName}`}
          >
            <div className="row g-3 mb-3">
              {/* AddOrDelButton includes a <div className="col-sm-3">...</div> */}
              <AddOrDelButton id={squad.id} sortOrder={squad.sort_order} />
              <div className="col-sm-3">
                <label
                  htmlFor={`inputSquadName${squad.id}`}
                  className="form-label"
                >
                  Squad Name
                </label>
                <input
                  type="text"
                  className={`form-control ${squad.squad_name_err && "is-invalid"}`}
                  id={`inputSquadName${squad.id}`}
                  data-testid="inputSquadName"
                  name="name"
                  maxLength={maxEventLength}
                  value={squad.squad_name}
                  onChange={handleInputChange(squad.id)}
                  onBlur={handleBlur(squad.id)}
                />
                <div
                  className="text-danger"
                  data-testid="dangerSquadName"
                >
                  {squad.squad_name_err}
                </div>
              </div>
              <div className="col-sm-3">
                <label
                  htmlFor={`inputSquadGames${squad.id}`}
                  className="form-label"
                >
                  Squad Games
                </label>
                <input
                  type="number"
                  min={minGames}
                  max={maxGames}
                  step={1}
                  className={`form-control ${squad.games_err && "is-invalid"}`}
                  id={`inputSquadGames${squad.id}`}
                  data-testid="inputSquadGames"
                  name="games"
                  value={squad.games}
                  onChange={handleInputChange(squad.id)}
                  onBlur={handleBlur(squad.id)}
                />
                <div
                  className="text-danger"
                  data-testid="dangerSquadGames"
                >
                  {squad.games_err}
                </div>
              </div>
            </div>
            <div className="row g-3">              
              <div className="col-sm-3">
                <label
                  htmlFor={`inputSquadEvent${squad.id}`}
                  className="form-label"
                >
                  Event
                </label>
                <select
                  id={`inputSquadEvent${squad.id}`}
                  data-testid="inputSquadEvent"
                  className={`form-select ${squad.event_id_err && "is-invalid"}`}
                  onChange={handleEventSelectChange(squad.id)}
                  defaultValue={events[0].id}
                  value={squad.event_id}
                >
                  {eventOptions}
                </select>
                <div
                  className="text-danger"
                  data-testid="dangerSquadEvent"
                >
                  {squad.event_id_err}
                </div>
              </div>
              <div className="col-sm-3">
                <label
                  htmlFor={`inputSquadDate${squad.id}`}
                  className="form-label"
                >
                  Date
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    squad.squad_date_err && "is-invalid"
                  }`}
                  id={`inputSquadDate${squad.id}`}
                  data-testid="inputSquadDate"
                  name="squad_date"
                  value={squad.squad_date}
                  onChange={handleInputChange(squad.id)}
                  onBlur={handleBlur(squad.id)}
                />
                <div
                  className="text-danger"
                  data-testid="dangerSquadDate"
                >
                  {squad.squad_date_err}
                </div>
              </div>
              <div className="col-sm-3">
                <label
                  htmlFor={`inputSquadTime${squad.id}`}
                  className="form-label"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  className={`form-control ${
                    squad.squad_time_err && "is-invalid"
                  }`}
                  id={`inputSquadTime${squad.id}`}
                  data-testid="inputSquadTime"
                  name="squad_time"
                  value={squad.squad_time}
                  onChange={handleInputChange(squad.id)}
                  onBlur={handleBlur(squad.id)}
                />
                <div
                  className="text-danger"
                  data-testid="dangerSquadTime"
                >
                  {squad.squad_time_err}
                </div>
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

export default OneToNSquads;
