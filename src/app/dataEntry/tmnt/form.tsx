"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState, store } from "@/redux/store";
import { fetchBowls, selectAllBowls, getBowlsStatus, getBowlsError } from "@/redux/features/bowls/bowlsSlice";
import { maxTmntNameLength } from "@/lib/validation";
import { Accordion, AccordionItem } from "react-bootstrap";
import { tmntType, tmntPropsType } from "../../../lib/types/types";
import { noAcdnErr } from "./errors";
import OneToNEvents, { validateEvents } from "./oneToNEvents";
import OneToNDivs, { validateDivs } from "./oneToNDivs";
import OneToNSquads, { validateSquads } from "./oneToNSquads";
import OneToNLanes from "./oneToNLanes";
import { todayStr } from "@/lib/dateTools";
import { isValid } from "date-fns";
import ZeroToNPots, { validatePots } from "./zeroToNPots";
import ZeroToNBrackets, { validateBrkts } from "./zeroToNBrackets";
import ZeroToNElims, { validateElims } from "./zeroToNElims";
import "./form.css";

interface FormProps {
  tmntProps: tmntPropsType
}

export const TmntDataForm: React.FC<FormProps> = ({ tmntProps }) => {     
  const {
    tmnt, setTmnt,
    events, setEvents,
    divs, setDivs,
    squads, setSquads,
    lanes, setLanes,
    pots, setPots,
    brkts, setBrkts,
    elims, setElims
  } = tmntProps;
  const dispatch = useDispatch<AppDispatch>();

  const [eventAcdnErr, setEventAcdnErr] = useState(noAcdnErr);
  const [divAcdnErr, setDivAcdnErr] = useState(noAcdnErr);  
  const [squadAcdnErr, setSquadAcdnErr] = useState(noAcdnErr);   
  const [potAcdnErr, setPotAcdnErr] = useState(noAcdnErr);   
  const [brktAcdnErr, setBrktAcdnErr] = useState(noAcdnErr);   
  const [elimAcdnErr, setElimAcdnErr] = useState(noAcdnErr); 

  const bowlsStatus = useSelector(getBowlsStatus);
  const bowls = useSelector(selectAllBowls);
  const bowlsError = useSelector(getBowlsError);  

  useEffect(() => {
    dispatch(fetchBowls());
  }, [dispatch]);

  const bowlOptions = bowls.map(bowl => (
    <option key={bowl.id} value={bowl.id}>
      {bowl.bowl_name} - {bowl.city}, {bowl.state}
    </option>
  ));

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
    setTmnt({
      ...tmnt,
      [name]: value,
      [nameErr]: "",
    })
    if (name === "start_date") {
      if (value) {        
        const startDate = new Date(value);
        if (isValid(startDate)) {
          // set end date if not set
          let endDate: Date;
          let endDateStr: string;
          const endDateInput = document.getElementById("inputEndDate") as HTMLInputElement;
          if (endDateInput && endDateInput.value === "") {
            endDate = new Date(value);
            endDateStr = endDate.toISOString().split("T")[0];
            setTmnt({
              ...tmnt,
              start_date: value,
              start_date_err: "",
              end_date: value,
              end_date_err: "",
            })
            endDateInput.value = endDateStr;
          } else {
            endDate = new Date(tmnt.end_date);
            if (endDate < startDate) {
              setTmnt({
                ...tmnt,
                start_date: value,
                start_date_err: "",
                end_date: value,
                end_date_err: "",
              })              
            }
          }
          // make sure squad dates are within the start and end dates for the event
          let squadDateStr = "";
          setSquads(
            squads.map((squad) => {
              squadDateStr = "";              
              if (
                !squad.squad_date.trim() ||
                !isValid(new Date(squad.squad_date))
              ) {
                squadDateStr = value;
              } else if (new Date(squad.squad_date) < startDate) {
                squadDateStr = value;
              } else if (new Date(squad.squad_date) < endDate) {
                squadDateStr = endDateStr;
              }
              if (squadDateStr) {
                return {
                  ...squad,
                  squad_date: squadDateStr,
                };
              } else {
                return squad;
              }
            })
          );
        }
      }
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!value.trim()) {
      let updatedData: tmntType;
      if (name === "start_date") { 
        updatedData = {
          ...tmnt,
          start_date: todayStr,
          start_date_err: "",
        };
        setTmnt(updatedData);
      } else if (name === "end_date") {
        const updatedDateStr = tmnt.start_date !== todayStr ? tmnt.start_date : todayStr;
        updatedData = {
          ...tmnt,
          end_date: updatedDateStr,
          end_date_err: "",
        };
        setTmnt(updatedData);
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
      if (new Date(tmnt.end_date) < new Date(tmnt.start_date)) {
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

    if (!validatePots(pots, setPots, setPotAcdnErr)) {
      isTmntValid = false;
    }
    if (!validateBrkts(brkts, setBrkts, setBrktAcdnErr)) {
      isTmntValid = false;
    }
    if (!validateElims(elims, setElims, setElimAcdnErr)) { 
      isTmntValid = false;
    }
    return isTmntValid;
  };

  const handleDebug = (e: React.MouseEvent<HTMLElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    // console.log("Submitted");
    e.preventDefault();
    if (validateTmnt()) {
      // console.log("Tournament valid");
    } else {
      // console.log("Tournament invalid");
    }
  };

  return (
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
                value={tmnt.start_date}
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
                value={tmnt.end_date}
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
            {/* <div className="col-sm-3">
              <button 
                className="btn btn-info"
                onClick={handleDebug}
                onFocus={() => console.log("Debug button: got focus")}
              >
                Debug
              </button>
            </div> */}
          </div>
          <Accordion>
            <AccordionItem eventKey="events" >
              <Accordion.Header className={eventAcdnErr.errClassName} data-testid="acndEvents">
                Events{eventAcdnErr.message}
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
                Divisions{divAcdnErr.message}
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
                Squads{squadAcdnErr.message}
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
                Lanes
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
                Pots{potAcdnErr.message}
              </Accordion.Header>
              <Accordion.Body>
                <ZeroToNPots
                  pots={pots}
                  setPots={setPots}
                  divs={divs}                  
                  setAcdnErr={setPotAcdnErr}
                />
              </Accordion.Body>
            </AccordionItem>
          </Accordion>
          <Accordion>
            <AccordionItem eventKey="brkts">
              <Accordion.Header className={brktAcdnErr.errClassName}>
                Brackets{brktAcdnErr.message}
              </Accordion.Header>
              <Accordion.Body>
                <ZeroToNBrackets
                  brkts={brkts}
                  setBrkts={setBrkts}
                  divs={divs}
                  squads={squads}
                  setAcdnErr={setBrktAcdnErr}
                />
              </Accordion.Body>
            </AccordionItem>
          </Accordion>
          <Accordion>
            <AccordionItem eventKey="elims">
              <Accordion.Header className={elimAcdnErr.errClassName}>
                Eliminators{elimAcdnErr.message}
              </Accordion.Header>
              <Accordion.Body>
                <ZeroToNElims
                  elims={elims}
                  setElims={setElims}
                  divs={divs}
                  squads={squads}
                  setAcdnErr={setElimAcdnErr}
                />
              </Accordion.Body>
            </AccordionItem>
          </Accordion>
        </div>
      ) : null}
    </form>
  );
};
