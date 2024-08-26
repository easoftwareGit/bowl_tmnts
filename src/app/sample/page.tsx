"use client"
import React, { useState } from "react";
import { initDivs, initTmnt } from "../../lib/db/initVals";
import { todayStr } from "@/lib/dateTools";
import { mockEvents } from "../../../test/mocks/tmnts/singlesAndDoubles/mockEvents";
import { tmntType, brktType, divType, elimType, potType, squadType, tmntPropsType, laneType, eventType } from "../../lib/types/types";
import { SampleForm } from "./form";
import { Form5 } from "./form5";
import { Form6 } from "./form6";
import { Form7 } from "./form7";

const blankTmnt = {
  ...initTmnt,    
  ...initTmnt,    
}

interface FormProps {
  tmnt?: tmntType  
}

export const SamplePage: React.FC<FormProps> = ({ tmnt = blankTmnt }) => { 

  const [tmntData, setTmntData] = useState(tmnt);
  const [events, setEvents] = useState<eventType[]>([]);
  const [divs, setDivs] = useState<divType[]>(initDivs);
  const [squads, setSquads] = useState<squadType[]>([]);
  const [lanes, setLanes] = useState<laneType[]>([])
  const [pots, setPots] = useState<potType[]>([])
  const [brkts, setBrkts] = useState<brktType[]>([])
  const [elims, setElims] = useState<elimType[]>([])  

  const tmntFormProps: tmntPropsType = {
    tmnt: tmntData,
    setTmnt: setTmntData,
    events,
    setEvents,
    divs,
    setDivs,
    squads,
    setSquads,
    lanes,
    setLanes,
    pots,
    setPots,
    brkts,
    setBrkts,
    elims,
    setElims,
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="shadow p-3 m-3 rounded-3 container">
        <h2 className="mb-3">Test</h2>
        {/* <SampleForm /> */}
        {/* <Form2 /> */}
        {/* <Form3 events={events} setEvents={setEvents} pets={pets} setPets={setPets} /> */}
        {/* <Form4 tmntProps={tmntFormProps} /> */}
        {/* <Form5 tmntProps={tmntFormProps} /> */}
        <Form6 />
        {/* <Form7 /> */}
      </div>
    </div>
  )
}

export default SamplePage;