"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState, store } from "@/redux/store";
import { fetchBowls, selectAllBowls, getBowlsStatus, getBowlsError } from "@/redux/features/bowls/bowlsSlice";
import { maxTmntNameLength } from "@/lib/validation";
import { Accordion, AccordionCollapse, AccordionItem } from "react-bootstrap";
import { eventType, divType, squadType, elimType, brktType, AcdnErrType, potType } from "./types";
import { noAcdnErr } from "./errors";
import OneToNEvents, { validateEvents } from "./oneToNEvents";
import OneToNDivs, { validateDivs } from "./oneToNDivs";
import OneToNSquads, { validateSquads } from "./oneToNSquads";
import { initEvents, initDivs, initSquads, initElims, initBrkts, initPots } from "./initVals";
import { todayStr } from "@/lib/dateTools";
import { isValid } from "date-fns";
import ZeroToNPots, { validatePots } from "./zeroToNPots";
import "./form.css";
import ZeroToNBrackets, { validateBrkts } from "./zeroToNBrackets";
import ZeroToNElims, { validateElims } from "./zeroToNElims";

export const TmntDataForm = () => {   
  const dispatch = useDispatch<AppDispatch>();

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

  const [formData, setFormData] = useState(initVals);
  const [formErrors, setFormErrors] = useState(initErrors);

  const [events, setEvents] = useState(initEvents);
  const [eventAcdnErr, setEventAcdnErr] = useState(noAcdnErr);

  const [divs, setDivs] = useState(initDivs);
  const [divAcdnErr, setDivAcdnErr] = useState(noAcdnErr);

  const [squads, setSquads] = useState(initSquads);
  const [squadAcdnErr, setSquadAcdnErr] = useState(noAcdnErr); 
  
  const [pots, setPots] = useState(initPots)
  const [potAcdnErr, setPotAcdnErr] = useState(noAcdnErr); 

  const [brkts, setBrkts] = useState(initBrkts)
  const [brktAcdnErr, setBrktAcdnErr] = useState(noAcdnErr); 

  const [elims, setElims] = useState(initElims)
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
      if (value) {
        // const startDate = DateTime.fromISO(value);
        const startDate = new Date(value);
        if (isValid(startDate)) {
          // set end date if not set
          let endDate: Date;
          let endDateStr: string;
          const endDateInput = document.getElementById("inputEndDate") as HTMLInputElement;
          if (endDateInput && endDateInput.value === "") {
            endDate = new Date(value);
            endDateStr = endDate.toISOString().split("T")[0];
            setFormData({
              ...formData,
              start_date: value,
              end_date: value,
            });
            setFormErrors({
              ...formErrors,
              start_date: "",
              end_date: "",
            });
            endDateInput.value = endDateStr;
          } else {
            endDate = new Date(formData.end_date);
            if (endDate < startDate) {
              setFormData({
                ...formData,
                start_date: value,
                end_date: value,
              });
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
      let updatedData: typeof formData;
      if (name === "start_date") {
        updatedData = {
          ...formData,
          start_date: todayStr,
        };
        setFormData(updatedData);
      } else if (name === "end_date") {
        const updatedDateStr =
          formData.start_date !== todayStr ? formData.start_date : todayStr;
        updatedData = {
          ...formData,
          end_date: updatedDateStr,
        };
        setFormData(updatedData);
      }
    }
  };

  const validateTmnt = (): boolean => {
    let isTmntValid = true;
    if (!validateEvents(events, setEvents, setEventAcdnErr)) {
      isTmntValid = false;
    }
    if (!validateDivs(divs, setDivs, setDivAcdnErr)) {
      isTmntValid = false;
    }
    if (!validateSquads(squads, setSquads, events, setSquadAcdnErr, formData.start_date, formData.end_date)) {
      isTmntValid = false;
    }
    if (!validatePots(pots, setPots, setPotAcdnErr)) {
      isTmntValid = false;
    }
    if (!validateBrkts(brkts, setBrkts, setBrktAcdnErr)) {
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
    const elimsAreValid = validateElims(elims, setElims, setElimAcdnErr);
    console.log('elimsAreValid', elimsAreValid);

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
    elims.forEach((elim) => {
      console.log(`elim ${elim.id}: `, elim);
    })
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Submitted");
    e.preventDefault();
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
                defaultValue='Choose...'
              >
                <option disabled>                
                  Choose...
                </option>
                {bowlOptions}
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
              />
              <div className="text-danger">{formErrors.end_date}</div>
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
            <AccordionItem eventKey="events">
              <Accordion.Header className={eventAcdnErr.errClassName}>
                Events{eventAcdnErr.message}
              </Accordion.Header>
              <Accordion.Body>
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
                  events={events}
                  setAcdnErr={setSquadAcdnErr}
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
                  squads={squads}
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
