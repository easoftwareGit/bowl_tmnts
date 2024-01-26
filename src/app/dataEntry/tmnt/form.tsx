"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchBowls } from "@/redux/features/bowls/bowlsSlice";
import { maxTmntNameLength, maxEventLength } from "@/lib/validation";
import { Bowl } from "@prisma/client";
import { BowlsFromStateObj } from "@/lib/types/bowlTypes";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { eventType, divType, squadType } from "./types";
import OneToNEvents from "./oneToNEvents";
import OneToNDivs from "./oneToNDivs";
import "./form.css";
import OneToNSquads from "./oneToNSquads";


export const TmntDataForm = () => {

  const eventsDefaultActiveKey = 'event1'
  const divsDefaultActiveKey = 'div1'
  const squadsDefaultActiveKey = 'squad1'

  const dispatch = useDispatch<AppDispatch>();

  const todayStr = new Date().toISOString().split("T")[0];

  const initVals = {
    tmnt_name: "",
    bowl_id: "",
    start_date: todayStr,
    end_date: todayStr,
  };
  const initErrors = {
    tmnt_name: "",
    bowl_id: "",
    start_date: "",
    end_date: "",
  };

  const initEvents: eventType[] = [{
    id: 1,
    name: "Singles",
    tabTitle: "Events",
    team_size: 1,
    games: 3,
    name_err: "",
    team_size_err: "",
    games_err: ""  
  }]

  const initDivs: divType[] = [{
    id: 1,
    name: "Division 1",
    tabTitle: "Divisions",
    hdcp: 90,
    hdcp_from: 220,
    int_hdcp: true,
    hdcp_for: "game",
    name_err: "",
    hdcp_err: "",
    hdcp_from_err: "",
  }]
  
  const initSquads: squadType[] = [{
    id: 1,
    name: "Squad 1",
    tabTitle: "Squads",
    sqd_date: todayStr,
    sqd_time: "",
    games: 3,  
    name_err: "",
    sqd_date_err: "",
    sqd_time_err: "",
    games_err: "",
}]

  const [formData, setFormData] = useState(initVals);
  const [formErrors, setFormErrors] = useState(initErrors);

  const [eventTabKey, setEventTabKey] = useState(eventsDefaultActiveKey);
  const [events, setEvents] = useState(initEvents);
  const [eventId, setEventId] = useState(1)  

  const [divTabKey, setDivTabKey] = useState(divsDefaultActiveKey);
  const [divs, setDivs] = useState(initDivs);
  const [divId, setDivId] = useState(1);  

  const [squadTabKey, setSquadTabKey] = useState(squadsDefaultActiveKey);
  const [squads, setSquads] = useState(initSquads)
  const [sqdId, setSqdId] = useState(1);  

  useEffect(() => {
    dispatch(fetchBowls());
  }, [dispatch]);

  const stateBowls = useSelector((state: RootState) => state.bowls);

  let bowlsArr: Bowl[] = [];
  if (!stateBowls.loading && stateBowls.error === "") {
    const bowlsFromState = stateBowls.bowls as unknown as BowlsFromStateObj;
    if (
      Array.isArray(bowlsFromState.bowls) &&
      bowlsFromState.bowls.length > 0
    ) {
      bowlsArr = bowlsFromState.bowls;
    }
  }

  const handleBowlSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      bowl_id: value,
    });
    setFormErrors({
      ...formErrors,
      bowl_id: "",
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
    if (name === "start_date") {
      const endDateInput = document.getElementById(
        "inputEndDate"
      ) as HTMLInputElement;
      if (endDateInput && endDateInput.value === "") {
        const endDate = new Date(value);
        const dateStr = endDate.toISOString().split("T")[0];
        setFormData({
          ...formData,
          start_date: dateStr,
          end_date: dateStr,
        });
        setFormErrors({
          ...formErrors,
          start_date: "",
          end_date: "",
        });
        endDateInput.value = dateStr;
        console.log(dateStr);
      }
    }
  };

  const handleEventTabSelect = (eventKey: string | null) => {
    if (eventKey) {
      setEventTabKey(eventKey);
    }
  };

  const handleAddEvent = () => {
    const newEvent: eventType = {
      id: eventId + 1,
      name: "Event " + (eventId + 1),
      tabTitle: "Event " + (eventId + 1),
      team_size: 1,
      games: 3,
      name_err: "",
      team_size_err: "",
      games_err: ""    
    };
    setEventId(eventId + 1);
    setEvents([...events, newEvent]);
  };

  const handleDeleteEvent = (id:number) => { 
    setEvents(events.filter(event => event.id !== id))
    setEventTabKey(eventsDefaultActiveKey) // refocus first event tab after delete
  }

  const handleEventsInputChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errName = name + "_err";
    setEvents(
      events.map((event) => {
        if (event.id === id) {
          // set tabTitle if id !== 1 AND changing name property value
          if (id !== 1 && name === "name") { 
            return {
              ...event,
              name: value,
              tabTitle: value,
              name_err: '',
            };
          } else {
            return {
              ...event,
              [name]: value,
              [errName]: ''
            };
          }
        } else {
          return event;
        }
      })
    );
  };

  const handleDivTabSelect = (eventKey: string | null) => {
    if (eventKey) {
      setDivTabKey(eventKey);
    }
  };

  const handleAddDiv = () => {
    const newDiv: divType = {
      id: divId + 1,
      name: "Division " + (divId + 1),
      tabTitle: "Division " + (divId + 1),
      hdcp: 90,
      hdcp_from: 220,
      int_hdcp: true,
      hdcp_for: "game",
      name_err: "",
      hdcp_err: "",
      hdcp_from_err: "",
    };
    setDivId(divId + 1);
    setDivs([...divs, newDiv]);
  };

  const handleDeleteDiv = (id:number) => { 
    setDivs(divs.filter(div => div.id !== id))
    setDivTabKey(divsDefaultActiveKey) // refocus first div tab after delete
  }

  const handleDivsInputChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const errName = name + "_err";
    setDivs(
      divs.map((div) => {
        if (div.id === id) {          
          if (id !== 1 && name === 'name') {
            // set tabTitle if id !== 1 AND changing name property value
            return {
              ...div,
              name: value,
              tabTitle: value,
              name_err: '',
            };
          } else if (name === "item.int_hdcp") {
            // set name property value
            return {
              ...div,
              int_hdcp: checked,
            };
          } else if (name.startsWith("hdcp_for")) {
            return {
              ...div,
              hdcp_for: value,
            };
          } else {
            return {
              ...div,
              [name]: value,
              [errName]: "",
            };
          }
        } else {
          return div;
        }
      })
    );
  };

  const handleHdcpBlur = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') {
      setDivs(
        divs.map((div) => {
          if (div.id === id) {
            return {
              ...div,
              hdcp: 0,
              hdcp_err: '',
            }
          } else {
            return div
          }
        })
      )
    }  
    if (name === `hdcp`) {
      const doDisable = (value === '' || parseInt(value) === 0);
      const hcdpFromInput = document.getElementById(`inputHdcpFrom${id}`) as HTMLButtonElement;
      const intHdcpCheck = document.getElementById(`chkBoxIntHdcp${id}`) as HTMLButtonElement;
      const hdcpForGame = document.getElementById(`radioHdcpForGame${id}`) as HTMLButtonElement;
      const hdcpForSeries = document.getElementById(`radioHdcpForSeries${id}`) as HTMLButtonElement;
      hcdpFromInput.disabled = doDisable;
      intHdcpCheck.disabled = doDisable;
      hdcpForGame.disabled = doDisable;
      hdcpForSeries.disabled = doDisable;   
    }
  }
 
  const handleSquadTabSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSquadTabKey(eventKey);
    }
  };

  const handleAddSquad = () => {
    const newSquad: squadType = {
      id: sqdId + 1,
      name: "Squad " + (divId + 1),
      tabTitle: "Squad " + (divId + 1),
      sqd_date: todayStr,
      sqd_time: "",
      games: 3,  
      name_err: "",
      sqd_date_err: "",
      sqd_time_err: "",
      games_err: "",
    };
    setSqdId(sqdId + 1);
    setSquads([...squads, newSquad]);
  };

  const handleDeleteSquad = (id:number) => { 
    setSquads(squads.filter(squad => squad.id !== id))
    setSquadTabKey(squadsDefaultActiveKey) // refocus first squad tab after delete
  }

  const handleSquadsInputChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errName = name + "_err";
    setSquads(
      squads.map((squad) => {
        if (squad.id === id) {
          // set tabTitle if id !== 1 AND changing name property value
          if (id !== 1 && name === "name") { 
            return {
              ...squad,
              name: value,
              tabTitle: value,
              name_err: '',
            };
          } else {
            return {
              ...squad,
              [name]: value,
              [errName]: ''
            };
          }
        } else {
          return squad;
        }
      })
    );
  };

  const handleDebug = (e: React.MouseEvent<HTMLElement>) => {
    events.forEach((event) => {
      console.log(`event ${event.id}: `, event);
    });
    divs.forEach((div) => {
      console.log(`div ${div.id}: `, div);
    });
    squads.forEach((squad) => {
      console.log(`squad ${squad.id}: `, squad);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Submitted");
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      {stateBowls.loading && <div>Loading...</div>}
      {!stateBowls.loading && stateBowls.error ? (
        <div>Error: {stateBowls.error}</div>
      ) : null}

      {!stateBowls.loading && stateBowls.bowls ? (
        <div className="form_container">
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="inputTmntName" className="form-label">
                Tournament Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.tmnt_name && "is-invalid"
                }`}
                id="inputTmntName"
                name="tmnt_name"
                value={formData.tmnt_name}
                maxLength={maxTmntNameLength}
                onChange={handleInputChange}
              />
              <div className="text-danger">{formErrors.tmnt_name}</div>
            </div>
            <div className="col-md-6">
              <label htmlFor="inputTmntName" className="form-label">
                Bowl Name
              </label>
              <select
                id="inputBowlName"
                className={`form-select ${formErrors.bowl_id && "is-invalid"}`}
                onChange={handleBowlSelectChange}
              >
                <option disabled selected>
                  Choose...
                </option>
                {bowlsArr.length > 0 &&
                  bowlsArr.map((bowl) => (
                    <option key={bowl.id} value={bowl.id}>
                      {bowl.bowl_name} - {bowl.city}, {bowl.state}
                    </option>
                  ))}
              </select>
              <div className="text-danger">{formErrors.bowl_id}</div>
            </div>
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <label htmlFor="inputStartDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  formErrors.start_date && "is-invalid"
                }`}
                id="inputStartDate"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
              />
              <div className="text-danger">{formErrors.start_date}</div>
            </div>
            <div className="col-md-3">
              <label htmlFor="inputEndDate" className="form-label">
                End Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  formErrors.end_date && "is-invalid"
                }`}
                id="inputEndDate"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
              <div className="text-danger">{formErrors.end_date}</div>
            </div>
            <div className="col-sm-3">
              <button className="btn btn-info" onClick={handleDebug}>
                Debug
              </button>
            </div>
          </div>
          <div className="row g-3 mb-1">
            <Tabs
              className="flex-row"
              variant="pills" 
              defaultActiveKey={eventsDefaultActiveKey}
              transition={false}
              id="eventTabs"
              activeKey={eventTabKey}
              onSelect={handleEventTabSelect}              
            >
              {events.map((event) => (
                <Tab key={event.id} eventKey={`event${event.id}`} title={event.tabTitle}>
                  <OneToNEvents
                    event={event}
                    eventCount={events.length}
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onInputChange={(e: ChangeEvent<HTMLInputElement>) => handleEventsInputChange(event.id, e)}
                  />
                </Tab>
              ))}
            </Tabs>           
          </div>
          <div className="row g-3 mb-1">
            <Tabs
              className="flex-row"
              variant="pills" 
              defaultActiveKey={divsDefaultActiveKey}
              transition={false}
              id="divisionTabs"
              activeKey={divTabKey}
              onSelect={handleDivTabSelect}
            >
              {divs.map((div) => (
                <Tab key={div.id} eventKey={`div${div.id}`} title={div.tabTitle}>
                  <OneToNDivs
                    div={div}
                    divCount={divs.length}
                    onAddDiv={handleAddDiv}
                    onDeleteDiv={handleDeleteDiv}
                    onInputChange={(e: ChangeEvent<HTMLInputElement>) => handleDivsInputChange(div.id, e)}
                    onHdcpBlur={(e: ChangeEvent<HTMLInputElement>) => handleHdcpBlur(div.id, e)}
                  />
                </Tab>
              ))}
            </Tabs>
          </div>
          <div className="row g-3 mb-1">
            <Tabs
              className="flex-row"
              variant="pills" 
              defaultActiveKey={squadsDefaultActiveKey}
              transition={false}
              id="squadTabs"
              activeKey={squadTabKey}
              onSelect={handleSquadTabSelect}
            >
              {squads.map((squad) => (
                <Tab key={squad.id} eventKey={`squad${squad.id}`} title={squad.tabTitle}>
                  <OneToNSquads
                    squad={squad}
                    squadCount={squads.length}
                    onAddSquad={handleAddSquad}
                    onDeleteSquad={handleDeleteSquad}
                    onInputChange={(e: ChangeEvent<HTMLInputElement>) => handleSquadsInputChange(squad.id, e)}
                  />
                </Tab>
              ))}
              {/* <Tab eventKey="1" title="Squads">
                <div className="row g-3 mb-3">
                  <div className="col-sm-3">
                    <label htmlFor="inputNumSqds" className="form-label">
                      # Squads
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="inputNumSqds"
                        name="num_sqds"
                        readOnly
                        value={otherSqds.length + 1}
                      />
                      <button
                        className="btn btn-success border border-start-0 rounded-end"
                        type="button"
                        tabIndex={-1}
                        id="sqd-plus"
                        onClick={handleAddSqdClick}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <label
                      htmlFor="inputSqdName1"
                      className="form-label"
                    >
                      Squad Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${sqd1.name_err && "is-invalid"}`}
                      id="inputSqdName1"
                      name="name"
                      maxLength={maxEventLength}
                      value={sqd1.name}
                      onChange={handleSqd1InputChange}
                    />
                    <div className="text-danger">{sqd1.name_err}</div>
                  </div>
                  <div className="col-sm-3">
                    <label
                      htmlFor="inputSqdDate1"
                      className="form-label"                      
                    >
                      Date 
                    </label>
                    <input
                      type="date"
                      className={`form-control ${sqd1.sqd_date_err && "is-invalid"}`}
                      id="inputSqdDate1"
                      name="sqd_date"
                      value={sqd1.sqd_date}
                      onChange={handleSqd1InputChange}                      
                    />
                    <div className="text-danger">{sqd1.sqd_date_err}</div>
                  </div>
                  <div className="col-sm-3">
                    <label htmlFor="inputSqdTime1" className="form-label">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className={`form-control ${sqd1.sqd_time_err && "is-invalid"}`}
                      id="inputSqdTime1"
                      name="sqd_time"
                      value={sqd1.sqd_time}                        
                      onChange={handleSqd1InputChange}                      
                    />
                    <div className="text-danger">{sqd1.sqd_time_err}</div>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-sm-3">
                  </div>
                  <div className="col-sm-3">
                    <label htmlFor="inputSqdGames1" className="form-label">
                      Squad Games
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      step={1}
                      className={`form-control ${
                        sqd1.games_err && "is-invalid"
                      }`}
                      id="inputSqdGames1"
                      name="games"
                      value={sqd1.games}
                      onChange={handleSqd1InputChange}
                    />
                    <div className="text-danger">{sqd1.games_err}</div>
                  </div>
                </div>
              </Tab> */}
            </Tabs>
          </div>
        </div>
      ) : null}
    </form>
  );
};
