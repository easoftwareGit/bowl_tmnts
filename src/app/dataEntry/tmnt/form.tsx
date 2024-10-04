"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState, store } from "@/redux/store";
import { fetchBowls, selectAllBowls, getBowlsStatus, getBowlsError } from "@/redux/features/bowls/bowlsSlice";
import { isValidBtDbId, maxTmntNameLength } from "@/lib/validation";
import { Accordion, AccordionItem } from "react-bootstrap";
import { tmntType, tmntPropsType, saveTypes, eventType, divType, squadType } from "../../../lib/types/types";
import { noAcdnErr } from "./errors";
import OneToNEvents, { validateEvents } from "./oneToNEvents";
import OneToNDivs, { validateDivs } from "./oneToNDivs";
import OneToNSquads, { validateSquads } from "./oneToNSquads";
import OneToNLanes from "./oneToNLanes";
import { dateTo_yyyyMMdd, getYearMonthDays, startOfDayFromString } from "@/lib/dateTools";
import { compareAsc, isValid, set } from "date-fns";
import ZeroToNPots, { validatePots } from "./zeroToNPots";
import ZeroToNBrackets, { validateBrkts } from "./zeroToNBrkts";
import ZeroToNElims, { validateElims } from "./zeroToNElims";
import ModalErrorMsg, { cannotSaveTitle } from "@/components/modal/errorModal";
import { initModalObj } from "@/components/modal/modalObjType";
import { postEvent } from "@/lib/db/events/eventsAxios";
import { postDiv } from "@/lib/db/divs/divsAxios";
import { postSquad } from "@/lib/db/squads/squadsAxios";
import { postLane } from "@/lib/db/lanes/lanesAxios";
import { postPot } from "@/lib/db/pots/potsAxios";
import { postBrkt } from "@/lib/db/brkts/brktsAxios";
import { postElim } from "@/lib/db/elims/elimsAxios";
import { tmntSaveTmnt } from "./saveTmnt";
import { tmntSaveEvents } from "./saveTmntEvents";

import "./form.css";
import { blankDiv, blankEvent, blankSquad, blankTmnt } from "@/lib/db/initVals";
import { tmntSaveDivs } from "./saveTmntDivs";
import { tmntSaveSquads } from "./saveTmntSquads";

interface FormProps {
  tmntProps: tmntPropsType
}

const TmntDataForm: React.FC<FormProps> = ({ tmntProps }) => {
  const {
    tmnt, setTmnt,
    events, setEvents,
    divs, setDivs,
    squads, setSquads,
    lanes, setLanes,
    pots, setPots,
    brkts, setBrkts,
    elims, setElims,
    showingModal, setShowingModal,
  } = tmntProps;

  let saveType: saveTypes = 'CREATE';
  
  const dispatch = useDispatch<AppDispatch>();

  const [eventAcdnErr, setEventAcdnErr] = useState(noAcdnErr);
  const [divAcdnErr, setDivAcdnErr] = useState(noAcdnErr);
  const [squadAcdnErr, setSquadAcdnErr] = useState(noAcdnErr);
  const [potAcdnErr, setPotAcdnErr] = useState(noAcdnErr);
  const [brktAcdnErr, setBrktAcdnErr] = useState(noAcdnErr);
  const [elimAcdnErr, setElimAcdnErr] = useState(noAcdnErr);

  let origTmnt: tmntType = { ...blankTmnt };
  let origEvents: eventType[] = [ { ...blankEvent } ];  
  let origDivs: divType[] = [{ ...blankDiv }];
  let origSquads: squadType[] = [{ ...blankSquad }];

  const bowlsStatus = useSelector(getBowlsStatus);
  const bowls = useSelector(selectAllBowls);
  const bowlsError = useSelector(getBowlsError);  

  const initDateStrs = {
    start_date_str: dateTo_yyyyMMdd(tmnt.start_date),
    end_date_str: dateTo_yyyyMMdd(tmnt.end_date),
  }

  const [dateStrs, setDateStrs] = useState(initDateStrs);
  const [errModalObj, setErrModalObj] = useState(initModalObj);

  useEffect(() => {
    dispatch(fetchBowls());
  }, [dispatch]);

  const bowlOptions = bowls.map(bowl => (
    <option key={bowl.id} value={bowl.id}>
      {bowl.bowl_name} - {bowl.city}, {bowl.state}
    </option>
  ));

  const canceledModalErr = () => {
    setErrModalObj(initModalObj); // reset modal object (hides modal)
  };

  const handleBowlSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setTmnt({
      ...tmnt,
      bowl_id: value,
      bowl_id_err: "",
    })
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nameErr = name + "_err"; 
    if (name === "tmnt_name" || name === "bowl_id") {
      setTmnt({
        ...tmnt,
        [name]: value,
        [nameErr]: "",
      })
    } else if ((name === "start_date") || (name === "end_date")) {      
      if (!e.target.valueAsDate) return;
      let startDate: Date;
      let endDate: Date;
      if (name === "start_date") {
        setDateStrs({
          ...dateStrs,
          start_date_str: value,          
        })
        startDate = startOfDayFromString(value) as Date
        endDate = tmnt.end_date
        setTmnt({
          ...tmnt,
          start_date: startOfDayFromString(value) as Date,
          start_date_err: "",
        })
      } else {
        setDateStrs({
          ...dateStrs,
          end_date_str: value,          
        })
        startDate = tmnt.start_date
        endDate = startOfDayFromString(value) as Date
        setTmnt({
          ...tmnt,
          end_date: endDate,
          end_date_err: "",
        })
      }
      // make sure squad dates are within the start and end dates for the event          
      setSquads(
        squads.map((squad) => {
          // if no squad date, use start date
          if (!squad.squad_date || !isValid(squad.squad_date)) {
            return {
              ...squad,
              squad_date: startDate
            }
          } else {
            // if squad date is before start date, use start date
            if (compareAsc(startDate, squad.squad_date) < 0) {
              return {
                ...squad,
                squad_date: startDate
              }
              // if squad date is after end date, use end date
            } else if (compareAsc(endDate, squad.squad_date) > 0) {
              return {
                ...squad,
                squad_date: endDate
              }
            }
          }
          return squad
        })
      )      
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!value.trim()) {      
      if (name === "start_date" || name === "end_date") {               
        const ymd = getYearMonthDays(value);
        if (ymd.year === 0 || ymd.month === 0 || ymd.days === 0) {
          let updatedData: tmntType;
          if (name === "start_date") {
            updatedData = {
              ...tmnt,
              start_date: new Date(Date.UTC(ymd.year, ymd.month, ymd.days)),
              start_date_err: "",
            };
          } else {
            updatedData = {
              ...tmnt,
              end_date: new Date(Date.UTC(ymd.year, ymd.month, ymd.days)),
              end_date_err: "",
            };
          }
          setTmnt(updatedData);
        }
      }
    }
  };

  const validateTmntInfo = (): boolean => {
    let istmntInfoValid = true;

    let nameErr = '';
    let bowlErr = '';
    let startErr = '';
    let endErr = '';

    if (!tmnt.tmnt_name.trim()) {
      nameErr = "Tournament Name is required";
      istmntInfoValid = false;
    }
    if (!tmnt.bowl_id) {
      bowlErr = "Bowl Name is required";
      istmntInfoValid = false;
    }
    if (!tmnt.start_date) {
      startErr = "Start date is required";
      istmntInfoValid = false;
    }    
    if (!tmnt.end_date) {
      endErr = "End date is required";
      istmntInfoValid = false;
    }    
    if (!startErr && !endErr) {
      if (compareAsc(tmnt.start_date, tmnt.end_date) > 0) {
        endErr = "End date cannot be before start date";
        istmntInfoValid = false;
      }
    }
    if (nameErr || bowlErr || startErr || endErr) {
      setTmnt({
        ...tmnt,
        tmnt_name_err: nameErr,
        bowl_id_err: bowlErr,
        start_date_err: startErr,
        end_date_err: endErr,
      });
    }

    return istmntInfoValid;
  }

  const validateTmnt = (): boolean => {
    let isTmntValid = true;
    if (!validateTmntInfo()) {
      isTmntValid = false;
    }
    if (!validateEvents(events, setEvents, setEventAcdnErr)) {
      isTmntValid = false;
    }
    if (!validateDivs(divs, setDivs, setDivAcdnErr)) {
      isTmntValid = false;
    }
    if (!validateSquads(squads, setSquads, events, setSquadAcdnErr, tmnt.start_date, tmnt.end_date)) {
      isTmntValid = false;
    }
    if (!validatePots(pots, setPots, divs, setPotAcdnErr)) {
      isTmntValid = false;
    }
    if (!validateBrkts(brkts, setBrkts, divs, setBrktAcdnErr)) {
      isTmntValid = false;
    }
    if (!validateElims(elims, setElims, divs, setElimAcdnErr)) { 
      isTmntValid = false;
    }
    return isTmntValid;
  };

  const handleDebug = (e: React.MouseEvent<HTMLElement>) => {

    console.log('events', events);
    console.log('squads', squads);
    // const eventsAreValid = validateEvents(events, setEvents, setEventAcdnErr);
    // console.log("Events valid: ", eventsAreValid);
    // const divsArevalid = validateDivs(divs, setDivs, setDivAcdnErr);
    // console.log("Divs are valid: ", divsArevalid);
    // const squadsAreValid = validateSquads(
    //   squads,
    //   setSquads,
    //   events,
    //   setSquadAcdnErr,
    //   formData.start_date,
    //   formData.end_date
    // );
    // console.log("Squads are valid: ", squadsAreValid);
    // const postAreValid = validatePots(pots, setPots, setPotAcdnErr);
    // console.log("Pots are valid: ", postAreValid);
    // const brktsAreValid = validateBrkts(brkts, setBrkts, setBrktAcdnErr);
    // console.log('brktsAreValid', brktsAreValid);
    // const elimsAreValid = validateElims(elims, setElims, setElimAcdnErr);
    // console.log('elimsAreValid', elimsAreValid);

    // events.forEach((event) => {
    //   console.log(`event ${event.id}: `, event);
    // });
    // divs.forEach((div) => {
    //   console.log(`div ${div.id}: `, div);
    // });
    // squads.forEach((squad) => {
    //   console.log(`squad ${squad.id}: `, squad);
    // });
    // pots.forEach((pot) => {
    //   console.log(`pot ${pot.id}: `, pot);
    // })
    // brkts.forEach((brkt) => {
    //   console.log(`brkt ${brkt.id}: `, brkt);
    // })
    // elims.forEach((elim) => {
    //   console.log(`elim ${elim.id}: `, elim);
    // })
  };

  const getLanesTabTilte = (): string => {
    let lanesTitle = '';
    squads.forEach((squad) => {
      if (lanesTitle === '') {
        lanesTitle = squad.lane_count + '';
      } else {
        lanesTitle = lanesTitle + ', ' + squad.lane_count;
      }
    })
    return lanesTitle
  }

  const saveTmnt = async (): Promise<boolean> => {      
    const savedTmnt = await tmntSaveTmnt(origTmnt, tmnt, saveType);
    if (!savedTmnt) {
      setErrModalObj({
        show: true,
        title: cannotSaveTitle,
        message: `Cannot save Tournament "${tmnt.tmnt_name}".`,
        id: initModalObj.id
      })   
      return false;
    };    
    origTmnt = {...tmnt};
    return true;
  }  
  const saveEvents = async (): Promise<boolean> => {
    const savedEvents = await tmntSaveEvents(origEvents, events, saveType);
    if (!savedEvents) {
      setErrModalObj({
        show: true,
        title: cannotSaveTitle,
        message: `Cannot save Events.`,
        id: initModalObj.id
      }) 
      return false;
    }
    origEvents = [...events];
    return true;
  }
  const saveDivs = async (): Promise<boolean> => {
    const savedDivs = await tmntSaveDivs(origDivs, divs, saveType);
    if (!savedDivs) {
      setErrModalObj({
        show: true,
        title: cannotSaveTitle,
        message: `Cannot save Divisions.`,
        id: initModalObj.id
      }) 
      return false;
    }
    origDivs = [...divs];
    return true;
  }  
  const saveSquads = async (): Promise<boolean> => {
    const savedSquads = await tmntSaveSquads(origSquads, squads, saveType);
    if (!savedSquads) {
      setErrModalObj({
        show: true,
        title: cannotSaveTitle,
        message: `Cannot save Squads.`,
        id: initModalObj.id
      }) 
      return false;
    }
    origSquads = [...squads];
    return true;
  }
  const saveLanes = async (): Promise<boolean> => {
    for (let i = 0; i < lanes.length; i++) {
      const currentLaneId = lanes[i].id;
      lanes[i].id = '';
      const postedLane = await postLane(lanes[i]);
      if (!postedLane) {
        lanes[i].id = currentLaneId;
        setErrModalObj({
          show: true,
          title: cannotSaveTitle,
          message: `Cannot save Lane "${lanes[i].lane_number}".`,
          id: initModalObj.id
        }) 
        return false;
      }
    }
    return true;
  }
  const savePots = async (): Promise<boolean> => {
    for (let i = 0; i < pots.length; i++) {
      const currentPotId = pots[i].id;
      pots[i].id = '';
      const postedPot = await postPot(pots[i]);
      if (!postedPot) { 
        pots[i].id = currentPotId;
        setErrModalObj({
          show: true,
          title: cannotSaveTitle,
          message: `Cannot save Pot "${pots[i].pot_type}".`,
          id: initModalObj.id
        }) 
        return false;
      }
    }
    return true;
  }
  const saveBrkts = async (): Promise<boolean> => {
    for (let i = 0; i < brkts.length; i++) {
      const currentBrktId = brkts[i].id;
      brkts[i].id = '';
      const postedBrkt = await postBrkt(brkts[i]);
      if (!postedBrkt) {
        brkts[i].id = currentBrktId;
        setErrModalObj({
          show: true,
          title: cannotSaveTitle,
          message: `Cannot save Bracket starting game "${brkts[i].start}".`,
          id: initModalObj.id
        }) 
        return false;
      }
    }
    return true;
  }
  const saveElims = async (): Promise<boolean> => {
    for (let i = 0; i < elims.length; i++) {
      const currentElimId = elims[i].id;
      elims[i].id = '';
      const postedElim = await postElim(elims[i]);
      if (!postedElim) {
        elims[i].id = currentElimId;
        setErrModalObj({
          show: true,
          title: cannotSaveTitle,
          message: `Cannot save Eliminator starting game "${elims[i].start}".`,
          id: initModalObj.id
        }) 
        return false;
      }
    }
    return true;
  }

  const save = async () => { 

    let saved = false;
    saved = await saveTmnt();
    if (!saved) return false;
    saved = await saveEvents();
    if (!saved) return false;
    saved = await saveDivs();
    if (!saved) return false;
    saved = await saveSquads();
    if (!saved) return false;    
    // if (!saveLanes()) return false;
    // if (!savePots()) return false;
    // if (!saveBrkts()) return false;
    // if (!saveElims()) return false;    
    saveType = 'UPDATE';
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    // console.log("Submitted");
    e.preventDefault();
    if (showingModal) return;
    if (validateTmnt()) {      
      save();
      // console.log("Tournament valid");
    } else {
      // console.log("Tournament invalid");
    }
  };

  return (
    <>
      <ModalErrorMsg
        show={errModalObj.show}
        title={errModalObj.title}
        message={errModalObj.message}   
        onCancel={canceledModalErr}
      />      
      <form onSubmit={handleSubmit}>      
        {(bowlsStatus === 'loading' ) && <div>Loading...</div>}
        {bowlsStatus !== 'loading' && bowlsError ? (
          <div>Error: {bowlsError}</div>
        ) : null}      
        {(bowlsStatus === 'succeeded') ? (        
          <div className="form_container">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="inputTmntName" className="form-label">
                  Tournament Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    tmnt.tmnt_name_err && "is-invalid"
                  }`}
                  id="inputTmntName"                
                  name="tmnt_name"
                  value={tmnt.tmnt_name}
                  maxLength={maxTmntNameLength}
                  onChange={handleInputChange}
                />
                <div
                  className="text-danger"
                  data-testid="dangerTmntName"
                >
                  {tmnt.tmnt_name_err}
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="inputBowlName" className="form-label">
                  Bowl Name
                </label>
                <select
                  id="inputBowlName"
                  data-testid="inputBowlName"
                  name="bowl_id"
                  className={`form-select ${tmnt.bowl_id_err && "is-invalid"}`}
                  onChange={handleBowlSelectChange}
                  value={tmnt.bowl_id === '' ? 'Choose...' : tmnt.bowl_id}
                >
                  <option disabled>                
                    Choose...
                  </option>
                  {bowlOptions}
                </select>
                <div
                  className="text-danger"
                  data-testid="dangerBowlName"
                >
                  {tmnt.bowl_id_err}
                </div>
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
                    tmnt.start_date_err && "is-invalid"
                  }`}
                  id="inputStartDate"
                  name="start_date"
                  data-testid="inputStartDate"
                  // value={dateTo_UTC_yyyyMMdd(tmnt.start_date)}
                  value={dateStrs.start_date_str}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <div
                  className="text-danger"
                  data-testid="dangerStartDate"
                >
                  {tmnt.start_date_err}
                </div>
              </div>
              <div className="col-md-3">
                <label htmlFor="inputEndDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    tmnt.end_date_err && "is-invalid"
                  }`}
                  id="inputEndDate"
                  name="end_date"
                  data-testid="inputEndDate"
                  // value={dateTo_UTC_yyyyMMdd(tmnt.end_date)}
                  value={dateStrs.end_date_str}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <div
                  className="text-danger"
                  data-testid="dangerEndDate"
                >
                  {tmnt.end_date_err}
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-center align-items-center">
                <button
                  className="btn btn-success"
                  onClick={handleSubmit}
                >
                  Save Tournament
                </button>
              </div>
              <div className="col-sm-3">
                <button 
                  className="btn btn-info"
                  onClick={handleDebug}
                  onFocus={() => console.log("Debug button: got focus")}
                >
                  Debug
                </button>
              </div>
            </div>
            <Accordion>
              <AccordionItem eventKey="events" >
                <Accordion.Header className={eventAcdnErr.errClassName} data-testid="acdnEvents">
                  Events - {events.length} {eventAcdnErr.message}
                </Accordion.Header>
                <Accordion.Body data-testid="eventAcdn">
                  <OneToNEvents
                    events={events}
                    setEvents={setEvents}
                    squads={squads}
                    setSquads={setSquads}
                    setAcdnErr={setEventAcdnErr}                    
                  />
                </Accordion.Body>
              </AccordionItem>
            </Accordion>
            <Accordion>
              <AccordionItem eventKey="divs">
                <Accordion.Header className={divAcdnErr.errClassName}>
                  Divisions - {divs.length} {divAcdnErr.message}
                </Accordion.Header>
                <Accordion.Body>
                  <OneToNDivs
                    divs={divs}
                    setDivs={setDivs}
                    pots={pots}
                    brkts={brkts}
                    elims={elims}
                    setAcdnErr={setDivAcdnErr}
                  />
                </Accordion.Body>
              </AccordionItem>
            </Accordion>
            <Accordion>
              <AccordionItem eventKey="squads">
                <Accordion.Header className={squadAcdnErr.errClassName}>
                  Squads - {squads.length} {squadAcdnErr.message}
                </Accordion.Header>
                <Accordion.Body>
                  <OneToNSquads
                    squads={squads}
                    setSquads={setSquads}
                    lanes={lanes}
                    setLanes={setLanes}
                    events={events}
                    setAcdnErr={setSquadAcdnErr}
                  />
                </Accordion.Body>
              </AccordionItem>
            </Accordion>
            <Accordion>
              <AccordionItem eventKey="lanes">
                {/* <no errors in Lanes */}
                <Accordion.Header>
                  Lanes - {getLanesTabTilte()}
                </Accordion.Header>
                <Accordion.Body>
                  <OneToNLanes  
                    lanes={lanes}                                  
                    squads={squads}                  
                  />
                </Accordion.Body>
              </AccordionItem>
            </Accordion>
            <Accordion>
              <AccordionItem eventKey="pots">
                <Accordion.Header className={potAcdnErr.errClassName}>
                  Pots - {pots.length} {potAcdnErr.message}
                </Accordion.Header>
                <Accordion.Body>
                  <ZeroToNPots
                    pots={pots}
                    setPots={setPots}
                    divs={divs}                  
                    setAcdnErr={setPotAcdnErr}
                    setShowingModal={setShowingModal}
                  />
                </Accordion.Body>
              </AccordionItem>
            </Accordion>
            <Accordion>
              <AccordionItem eventKey="brkts">
                <Accordion.Header className={brktAcdnErr.errClassName}>
                  Brackets - {brkts.length} {brktAcdnErr.message}
                </Accordion.Header>
                <Accordion.Body>
                  <ZeroToNBrackets
                    brkts={brkts}
                    setBrkts={setBrkts}
                    divs={divs}
                    squads={squads}
                    setAcdnErr={setBrktAcdnErr}
                    setShowingModal={setShowingModal}
                  />
                </Accordion.Body>
              </AccordionItem>
            </Accordion>
            <Accordion>
              <AccordionItem eventKey="elims">
                <Accordion.Header className={elimAcdnErr.errClassName}>
                  Eliminators - {elims.length} {elimAcdnErr.message}
                </Accordion.Header>
                <Accordion.Body>
                  <ZeroToNElims
                    elims={elims}
                    setElims={setElims}
                    divs={divs}
                    squads={squads}
                    setAcdnErr={setElimAcdnErr}
                    setShowingModal={setShowingModal}
                  />
                </Accordion.Body>
              </AccordionItem>
            </Accordion>
          </div>
        ) : null}
      </form>
    </>
  );
};

export default TmntDataForm;