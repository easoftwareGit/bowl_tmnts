import React, { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { eventType, AcdnErrType, featsParamsType, squadType } from "./types";
import { initEvent } from "./initVals";
import { Tabs, Tab } from "react-bootstrap";
import ModalConfirm, { initModalObj, delConfTitle } from "@/components/modal/confirmModel";
import { formatValue2Dec, formatValueSymbSep2Dec } from "@/lib/currency/formatValue";
import { 
  objErrClassName,
  acdnErrClassName,
  getAcdnErrMsg,
  noAcdnErr,
  isDuplicateName,
} from "./errors";
import {
  maxEventLength,
  minGames,
  maxGames,
  minTeamSize,
  maxTeamSize,
  zeroAmount,
  maxMoney,
} from "@/lib/validation";
import EaCurrencyInput, { minMoneyText, maxMoneyText } from "@/components/currency/eaCurrencyInput";
import { localConfig, currRexEx } from "@/lib/currency/const";

interface ChildProps {
  events: eventType[];
  setEvents: (events: eventType[]) => void;
  squads: squadType[],
  setSquads: (squds: squadType[]) => void;
  setAcdnErr: (objAcdnErr: AcdnErrType) => void;  
}
interface AddOrDelButtonProps {
  id: number;
}

const defaultTabKey = "event1";

const amountFields = [
  "entry_fee",
  "lineage",
  "prize_fund",
  "other",
  "expenses",
  "added_money",
];

const getEventErrMsg = (event: eventType): string => {
  if (event.name_err) return event.name_err;
  if (event.team_size_err) return event.team_size_err;
  if (event.games_err) return event.games_err;  
  if (event.added_money_err) return event.added_money_err;
  if (event.entry_fee_err) return event.entry_fee_err;
  if (event.lineage_err) return event.lineage_err;
  if (event.prize_fund_err) return event.prize_fund_err;
  if (event.other_err) return event.other_err;
  if (event.expenses_err) return event.expenses_err;
  if (event.lpox_err) return event.lpox_err;
  return "";
};

const getNextAcdnErrMsg = (
  updatedEvent: eventType | null,
  events: eventType[]
): string => {
  let errMsg = "";
  let acdnErrMsg = "";
  let i = 0;
  let event: eventType;
  while (i < events.length && !errMsg) {
    event = (events[i].id === updatedEvent?.id) ? updatedEvent : events[i];    
    errMsg = getEventErrMsg(event);
    if (errMsg) {
      acdnErrMsg = getAcdnErrMsg(event.name, errMsg);
    }
    i++;
  }
  return acdnErrMsg;
};

export const validateEvents = (
  events: eventType[],
  setEvents: Dispatch<SetStateAction<eventType[]>>,
  setAcdnErr: Dispatch<SetStateAction<AcdnErrType>>
): boolean => {
  let areEventsValid = true;
  let nameErr = '';
  let teamErr = '';
  let gamesErr = '';
  let addedMoneyErr = '';
  let entryFeeErr = ''
  let lpoxFeeErr = ''
  let eventErrClassName = '';

  const setError = (eventName: string, errMsg: string) => {
    if (areEventsValid) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: getAcdnErrMsg(eventName, errMsg),
      });
    }
    areEventsValid = false;
    eventErrClassName = objErrClassName;
  };

  setEvents(
    events.map((event) => {
      eventErrClassName = '';
      if (!event.name.trim()) {
        nameErr = "Name is required";
        setError(event.name, nameErr);
      } else if (isDuplicateName(events, event)) {
        nameErr = `"${event.name}" has already been used.`;
        setError(event.name, nameErr);
      } else {
        nameErr = '';
      }
      if (event.team_size < minTeamSize) {
        teamErr = "Team Size must be more than " + (minTeamSize - 1);
        setError(event.name, teamErr);
      } else if (event.team_size > maxTeamSize) {
        teamErr = "Team Size must be less than " + (maxTeamSize + 1);
        setError(event.name, teamErr);
      } else {
        teamErr = '';
      }
      if (event.games < minGames) {
        gamesErr = "Event Games must be more than " + (minGames - 1);
        setError(event.name, gamesErr);
      } else if (event.games > maxGames) {
        gamesErr = "Event Games must be less than " + (maxGames + 1);
        setError(event.name, gamesErr);
      } else {
        gamesErr = '';
      }
      const addedMoney = Number(event.added_money)
      if (typeof addedMoney !== 'number') {
        addedMoneyErr = 'Invalid Added $'
        setError(event.name, addedMoneyErr);
      } else if (addedMoney < zeroAmount) {
        addedMoneyErr = 'Added $ cannot be less than ' + minMoneyText;
        setError(event.name, addedMoneyErr);
      } else if (addedMoney > maxMoney) {        
        addedMoneyErr = 'Added $ cannot be more than ' + maxMoneyText;
        setError(event.name, addedMoneyErr);
      } 
      const entryFee = Number(event.entry_fee)      
      if (typeof entryFee !== 'number') {
        entryFeeErr = 'Invalid Entry Fee'
        setError(event.name, entryFeeErr);
      } else if (entryFee < zeroAmount) {
        entryFeeErr = 'Entry Fee cannot be less than ' + minMoneyText;
        setError(event.name, entryFeeErr);
      } else if (entryFee > maxMoney) {
        entryFeeErr = 'Entry Fee cannot be more than ' + maxMoneyText;
        setError(event.name, entryFeeErr);
      } else {
        entryFeeErr = ''
      }
      const LPOX = Number(event.lpox)
      if (typeof LPOX !== 'number') {
        lpoxFeeErr = 'Invalid LPOX'
        setError(event.name, lpoxFeeErr);
      }
      if (entryFee !== LPOX) {
        lpoxFeeErr = 'Entry Fee ≠ LPOX'
        setError(event.name, lpoxFeeErr);
      } else {
        lpoxFeeErr = ''
      }

      return {
        ...event,
        name_err: nameErr,
        team_size_err: teamErr,
        games_err: gamesErr,
        added_money_err: addedMoneyErr,
        entry_fee_err: entryFeeErr,
        lpox_err: lpoxFeeErr,
        errClassName: eventErrClassName,
      };
    })
  );
  if (areEventsValid) {
    setAcdnErr(noAcdnErr);
  }
  return areEventsValid;
};

const OneToNEvents: React.FC<ChildProps> = ({
  events,
  setEvents,
  squads,
  setSquads,
  setAcdnErr,
}) => {
  const [modalObj, setModalObj] = useState(initModalObj);
  const [tabKey, setTabKey] = useState(defaultTabKey);
  const [eventId, setEventId] = useState(1); // id # used in initEvents in form.tsx
  
  const handleAdd = () => {
    const newEvent: eventType = {
      ...initEvent,      
      id: eventId + 1,
      name: "Event " + (eventId + 1),
      tabTitle: "Event " + (eventId + 1),
    };
    setEventId(eventId + 1);
    setEvents([...events, newEvent]);
  };

  const confirmedDelete = () => {
    setModalObj(initModalObj); // reset modal object (hides modal)

    const updatedData = events.filter((event) => event.id !== modalObj.id);
    setEvents(updatedData);

    setTabKey(defaultTabKey); // refocus 1st event
  };

  const canceledDelete = () => {
    setModalObj(initModalObj); // reset modal object (hides modal)
  };

  const handleDelete = (id: number) => {
    if (id === 1) {
      return;
    }
    const eventToDel = events.find((event) => event.id === id);
    const toDelName = eventToDel?.name;
    setModalObj({
      show: true,
      title: delConfTitle,
      message: `Do you want to delete Event: ${toDelName}`,
      id: id,
    }); // deletion done in confirmedDelete
  };

  const handleAmountValueChange = (id: number, name: string) => (value: string | undefined): void => {
    const nameErr = name + "_err";
    let rawValue = value === undefined ? 'undefined' : value;
    rawValue = (rawValue || ' ');

    setEvents(
      events.map((event) => {
        if (event.id === id) {
          if (rawValue && Number.isNaN(Number(rawValue))) {
            rawValue = ''
          } 
          let updatedEvent: eventType;
          updatedEvent = {
            ...event,
            [name]: rawValue,
            [nameErr]: ''
          }
          // if part of the entry fee, clear lpox error message if editing          
          if (name !== 'added_money') {     
            // get current value in object
            // typescript will not allow event[name] here
            let numVal = 0
            if (name === 'entry_fee') {
              numVal = Number(event.entry_fee)
            } else if (name === 'lineage') {
              numVal = Number(event.lineage)
            } else if (name === 'prize_fund') { 
              numVal = Number(event.prize_fund)
            } else if (name === 'other') { 
              numVal = Number(event.other)
            } else if (name === 'expenses') { 
              numVal = Number(event.expenses)
            } 
            // if losing focus, rawValue will equal object value,
            // user not editing, do not clear lpox error
            if (numVal !== Number(rawValue)) {
              // clear lpox error if user editing
              updatedEvent = {
                ...updatedEvent,
                lpox_err: '',
              }
            }        
          }
          const acdnErrMsg = getNextAcdnErrMsg(updatedEvent, events);
          if (acdnErrMsg) {
            setAcdnErr({
              errClassName: acdnErrClassName,
              message: acdnErrMsg,
            });
          } else {
            setAcdnErr(noAcdnErr);
          }
          const errMsg = getEventErrMsg(updatedEvent);
          if (errMsg) {
            return {
              ...updatedEvent,
              errClassName: objErrClassName,
            };
          } else {
            return {
              ...updatedEvent,
              errClassName: '',
            };
          }
        } else {
          return event;
        }
      })
    )
  };

  const handleInputChange = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nameErr = name + "_err";

    setEvents(
      events.map((event) => {
        if (event.id === id) {
          let updatedEvent: eventType;
          // set tabTitle changing name property value
          if (name === "name") {
            updatedEvent = {
              ...event,
              name: value,
              tabTitle: value,
              name_err: "",
            };
          } else if (name === 'games') {
            const gamesNum = Number(value)
            if (typeof gamesNum === 'number' && gamesNum >= minGames && gamesNum <= maxGames) {
              updatedEvent = {
                ...event,
                games: Number(value),
                games_err: "",
              };    
              setSquads(
                squads.map((squad) => {
                  if (squad.event_id === event.id) {
                    const squadGames = (squad.games === event.games) ? updatedEvent.games : squad.games;                      
                    return {
                      ...squad,
                      games: squadGames,
                    }
                  } else {
                    return squad;
                  }
                })
              )
            } else {
              updatedEvent = {
                ...event
              }              
            }
          } else {
            updatedEvent = {
              ...event,
              [name]: value,
              [nameErr]: "",
            };
          }
          const acdnErrMsg = getNextAcdnErrMsg(updatedEvent, events);
          if (acdnErrMsg) {
            setAcdnErr({
              errClassName: acdnErrClassName,
              message: acdnErrMsg,
            });
          } else {
            setAcdnErr(noAcdnErr);
          }
          const errMsg = getEventErrMsg(updatedEvent);
          if (errMsg) {
            return {
              ...updatedEvent,
              errClassName: objErrClassName,
            };
          } else {
            return {
              ...updatedEvent,
              errClassName: "",
            };
          }
        } else {
          return event;
        }
      })
    );
  };

  const updateLPOX = (event: eventType, name: string, value: string): eventType => {
    const nameErr = name + "_err";
    const valNoSymb = value.replace(currRexEx, '')
    let formattedValue = (value) ? formatValue2Dec(valNoSymb, localConfig) : '';

    if (formattedValue === 'NaN') {
      formattedValue = ''
    }
    if (typeof (Number(formattedValue)) !== 'number') {
      formattedValue = ''
    }
    const valueNum = Number(formattedValue)
    if (valueNum < zeroAmount || valueNum > maxMoney) {
      formattedValue = ''
    }
    const temp_event = {
      ...event,
      [name]: formattedValue,
      [nameErr]: '',
    }
    let lpoxStr = ''
    let lpoxValid = ''
    if (!temp_event.entry_fee
        && !temp_event.lineage
        && !temp_event.prize_fund
        && !temp_event.other
        && !temp_event.expenses) {
    } else {
      const lpoxNum = Number(temp_event.lineage)
        + Number(temp_event.prize_fund)
        + Number(temp_event.other)
        + Number(temp_event.expenses);
      lpoxStr = formatValue2Dec(lpoxNum.toString(), localConfig)
      if (Number(temp_event.entry_fee) === lpoxNum) {
        lpoxValid = 'is-valid'        
      } else {
        lpoxValid = 'is-invalid'      
      }
    }
    return {
      ...temp_event,
      lpox: lpoxStr,
      lpox_valid: lpoxValid      
    } 
  }

  const handleBlur = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (amountFields.includes(name) && (value)) {
      setEvents(
        events.map((event) => {
          if (event.id === id) {
            const temp_event = updateLPOX(event, name, value)
            return {
              ...temp_event
            }
          } else {
            return event;
          }
        })
      )
    }

    if (!value.trim()) {
      setEvents(
        events.map((event) => {
          if (event.id === id) {
            if (name === "name") {
              return {
                ...event,
                name: "Event " + event.id,
                tabTitle: "Event " + event.id,
                name_err: "",
              };
            } else if (name === "team_size") {
              return {
                ...event,
                team_size: 1,
                team_size_err: '',
              };
            } else if (name === "games") {
              return {
                ...event,
                games: 3,
                games_err: '',
              };
            } else if (amountFields.includes(name)) {              
              const temp_event = updateLPOX(event, name, value);
              return {
                ...temp_event,
              };
            } else {
              return event;
            }
          } else {
            return event;
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

  const AddOrDelButton: React.FC<AddOrDelButtonProps> = ({ id }) => {
    if (id === 1) {
      return (
        <div className="col-sm-3">
          <label htmlFor="inputNumEvents" className="form-label">
            # Events
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="inputNumEvents"
              name="num_events"
              readOnly
              value={events.length}
            />
            <button
              className="btn btn-success border border-start-0 rounded-end"
              type="button"
              tabIndex={-1}
              id="event-plus"
              onClick={handleAdd}
            >
              +
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-sm-3 d-flex justify-content-center align-items-end">
          <div className="input-group">
            <input
              type="text"
              className="form-control deleteInput"
              readOnly
              value="Delete Event"
            />
            <button
              className="btn btn-danger border rounded"
              type="button"
              tabIndex={-1}
              onClick={() => handleDelete(id)}
            >
              -
            </button>
          </div>
        </div>
      );
    }
  };

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
        id="event-tabs"
        className="mb-2"
        variant="pills"
        activeKey={tabKey}
        onSelect={handleTabSelect}
      >
        {events.map((event) => (
          <Tab
            key={event.id}
            eventKey={`event${event.id}`}
            title={event.tabTitle}
            tabClassName={`${event.errClassName}`}
          >
            <div className="row g-3 mb-3">
              {/* AddOrDelButton includes a <div className="col-sm-3">...</div> */}
              <AddOrDelButton id={event.id} />
              <div className="col-sm-3">
                <label
                  htmlFor={`inputEventName${event.id}`}
                  className="form-label"
                >
                  Event Name
                </label>
                <input
                  type="text"
                  className={`form-control ${event.name_err && "is-invalid"}`}
                  id={`inputEventName${event.id}`}
                  name="name"
                  value={event.name}
                  maxLength={maxEventLength}
                  onChange={handleInputChange(event.id)}
                  onBlur={handleBlur(event.id)}                  
                />
                <div className="text-danger">{event.name_err}</div>
              </div>
              <div className="col-sm-2">
                <label
                  htmlFor={`inputTeamSize${event.id}`}
                  className="form-label"
                  title="Singles = 1, Doubles = 2..."
                >
                  Team Size <span className="popup-help">&nbsp;?&nbsp;</span>
                </label>
                <input
                  type="number"
                  min={minTeamSize}
                  max={maxTeamSize}
                  step={1}
                  className={`form-control ${event.team_size_err && "is-invalid"}`}
                  id={`inputTeamSize${event.id}`}
                  name="team_size"
                  value={event.team_size}
                  onChange={handleInputChange(event.id)}
                  onBlur={handleBlur(event.id)}
                />
                <div className="text-danger">{event.team_size_err}</div>
              </div>
              <div className="col-sm-2">
                <label
                  htmlFor={`inputEventGames${event.id}`}
                  className="form-label"
                >
                  Event Games
                </label>
                <input
                  type="number"
                  min={minGames}
                  max={maxGames}
                  step={1}
                  className={`form-control ${event.games_err && "is-invalid"}`}
                  id={`inputEventGames${event.id}`}
                  name="games"
                  value={event.games}
                  onChange={handleInputChange(event.id)}
                  onBlur={handleBlur(event.id)}
                />
                <div className="text-danger">{event.games_err}</div>
              </div>
              <div className="col-sm-2">
                <label
                  htmlFor={`inputEventAddedMoney${event.id}`}
                  className="form-label"
                  title="Total Prize Fund = Added $ + (Entry Prize Fund * Number of Entries)"
                >
                  Added $ <span className="popup-help">&nbsp;?&nbsp;</span>
                </label>
                <EaCurrencyInput
                  id={`inputEventAddedMoney${event.id}`}
                  name="added_money"
                  className={`form-control ${event.added_money_err && "is-invalid"}`}
                  value={event.added_money}
                  onValueChange={handleAmountValueChange(event.id, 'added_money')}
                />
                <div className="text-danger">{event.added_money_err}</div>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-sm-2">
                <label
                  htmlFor={`inputEventEntryFee${event.id}`}
                  className="form-label"
                >
                  Entry Fee
                </label>
                <EaCurrencyInput
                  id={`inputEventEntryFee${event.id}`}
                  name="entry_fee"
                  className={`form-control ${event.entry_fee_err && "is-invalid"}`}
                  value={event.entry_fee}
                  onValueChange={handleAmountValueChange(event.id, 'entry_fee')}
                  onBlur={handleBlur(event.id)}
                />
                <div className="text-danger">{event.entry_fee_err}</div>
              </div> 
              <div className="col-sm-2">
                <label
                  htmlFor={`inputEventLineage${event.id}`}
                  className="form-label"
                >
                  Lineage
                </label>
                <EaCurrencyInput
                  id={`inputEventLineage${event.id}`}
                  name="lineage"
                  className={`form-control ${event.lineage_err && "is-invalid"}`}
                  value={event.lineage}
                  onValueChange={handleAmountValueChange(event.id, 'lineage')}
                  onBlur={handleBlur(event.id)}
                />
                <div className="text-danger">{event.lineage_err}</div>
              </div>
              <div className="col-sm-2">
                <label
                  htmlFor={`inputEventPrizeFund${event.id}`}
                  className="form-label"
                >
                  Prize Fund
                </label>
                <EaCurrencyInput
                  id={`inputEventPrizeFund${event.id}`}
                  name="prize_fund"
                  className={`form-control ${event.prize_fund_err && "is-invalid"}`}
                  value={event.prize_fund}
                  onValueChange={handleAmountValueChange(event.id, 'prize_fund')}
                  onBlur={handleBlur(event.id)}
                />
                <div className="text-danger">{event.prize_fund_err}</div>
              </div>
              <div className="col-sm-2">
                <label
                  htmlFor={`inputEventOther${event.id}`}
                  className="form-label"
                >
                  Other
                </label>
                <EaCurrencyInput
                  id={`inputEventOther${event.id}`}
                  name="other"
                  className={`form-control ${event.other_err && "is-invalid"}`}
                  value={event.other}
                  onValueChange={handleAmountValueChange(event.id, 'other')}
                  onBlur={handleBlur(event.id)}
                />
                <div className="text-danger">{event.other_err}</div>
              </div>
              <div className="col-sm-2">
                <label
                  htmlFor={`inputEventExpenses${event.id}`}
                  className="form-label"
                >
                  Expenses
                </label>
                <EaCurrencyInput
                  id={`inputEventExpenses${event.id}`}
                  name="expenses"
                  className={`form-control ${event.expenses_err && "is-invalid"}`}
                  value={event.expenses}
                  onValueChange={handleAmountValueChange(event.id, 'expenses')}
                  onBlur={handleBlur(event.id)}
                />
                <div className="text-danger">{event.expenses_err}</div>
              </div>
              <div className="col-sm-2">
                <label
                  htmlFor={`inputEventLPOX${event.id}`}
                  className="form-label"
                  title="Lineage + Prize Fund + Other + eXpeses must equal Entry Fee"
                >
                  L+P+O+X <span className="popup-help">&nbsp;?&nbsp;</span>
                </label>
                <EaCurrencyInput
                  id={`inputEventLPOX${event.id}`}
                  name="lpox"
                  className={`form-control ${event.lpox_valid}`}
                  value={event.lpox}
                  disabled={true}
                />
                <div className="text-danger">{event.lpox_err}</div>
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

export default OneToNEvents;
