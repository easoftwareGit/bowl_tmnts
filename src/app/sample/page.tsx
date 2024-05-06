"use client"
import React, { useState } from "react";
import { initTmnt } from "../dataEntry/tmnt/initVals";
import { todayStr } from "@/lib/dateTools";
import { mockEvents } from "../../../test/mocks/tmnts/singlesAndDoubles/mockEvents";
import { tmntType, brktType, divType, elimType, potType, squadType, tmntPropsType } from "../../lib/types/types";
import { SampleForm } from "./form";
import { Form4 } from "./form4";

const blankTmnt = {
  ...initTmnt,  
  start_date: '' // used to hold event id in this test
}

interface FormProps {
  tmnt?: tmntType  
}

export const SamplePage: React.FC<FormProps> = ({ tmnt = blankTmnt }) => { 

  const [tmntData, setTmntData] = useState(tmnt);
  const [events, setEvents] = useState(mockEvents);
  const [divs, setDivs] = useState<divType[]>([]);
  const [squads, setSquads] = useState<squadType[]>([]);
  const [pots, setPots] = useState<potType[]>([])
  const [brkts, setBrkts] = useState<brktType[]>([])
  const [elims, setElims] = useState<elimType[]>([])

  // const tmntFormProps: tmntPropsType = {
  //   tmnt: tmntData,
  //   setTmnt: setTmntData,
  //   events,
  //   setEvents,
  //   divs,
  //   setDivs,
  //   squads,
  //   setSquads,
  //   pots,
  //   setPots,
  //   brkts,
  //   setBrkts,
  //   elims,
  //   setElims,
  // }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="shadow p-3 m-3 rounded-3 container">
        <h2 className="mb-3">Test</h2>
        <SampleForm />
        {/* <Form2 /> */}
        {/* <Form3 events={events} setEvents={setEvents} pets={pets} setPets={setPets} /> */}
        {/* <Form4 tmntProps={tmntFormProps} /> */}
      </div>
    </div>
  )
}

export default SamplePage;