"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react"; 
import TmntDataForm from "./form";
import {
  initBrkts,
  blankDataOneTmnt,
  initDivs,
  initElims,
  initEvents,
  initLanes,
  initPots,
  initSquads,
  initTmnt,  
} from "../../../lib/db/initVals";
import { allDataOneTmntType, dataOneTmntType, tmntPropsType } from "../../../lib/types/types";
import { clone, cloneDeep } from "lodash";

interface FormProps {
  fullTmntData?: dataOneTmntType;
}

const blankFullTmnt: dataOneTmntType = {
  tmnt: initTmnt,
  events: initEvents,
  divs: initDivs,
  squads: initSquads,
  lanes: initLanes,
  pots: initPots,
  brkts: initBrkts,
  elims: initElims,
};

export const TmntDataPage: React.FC<FormProps> = ({
  fullTmntData = blankFullTmnt,
}) => {

  const { status, data } = useSession();
  // link the tmnt data types
  fullTmntData.tmnt.user_id = data?.user?.id || "";  
  fullTmntData.events[0].tmnt_id = fullTmntData.tmnt.id;
  fullTmntData.divs[0].tmnt_id = fullTmntData.tmnt.id;
  fullTmntData.squads[0].event_id = fullTmntData.events[0].id;
  fullTmntData.lanes[0].squad_id = fullTmntData.squads[0].id;
  fullTmntData.lanes[1].squad_id = fullTmntData.squads[0].id; // initLanes has 2 itens

  
  const dataOneTmnt: allDataOneTmntType = {
    origData: blankDataOneTmnt(),
    curData: fullTmntData,
  }
  
  // const [tmntData, setTmntData] = useState(fullTmntData.tmnt);
  // const [events, setEvents] = useState(fullTmntData.events);
  // const [divs, setDivs] = useState(fullTmntData.divs);
  // const [squads, setSquads] = useState(fullTmntData.squads);
  // const [lanes, setLanes] = useState(fullTmntData.lanes);
  // const [pots, setPots] = useState(fullTmntData.pots);
  // const [brkts, setBrkts] = useState(fullTmntData.brkts);
  // const [elims, setElims] = useState(fullTmntData.elims);
    
  // const tmntFormProps: tmntPropsType = {
  //   tmnt: tmntData,
  //   setTmnt: setTmntData,
  //   events,
  //   setEvents,
  //   divs,
  //   setDivs,
  //   squads,
  //   setSquads,
  //   lanes,
  //   setLanes,
  //   pots,
  //   setPots,
  //   brkts,
  //   setBrkts,
  //   elims,
  //   setElims,
  // };  

  return (
    <>      
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="shadow p-3 m-3 rounded-3 container">
          <h2 className="mb-3">Tournament Info</h2>
          {/* <TmntDataForm tmntProps={tmntFormProps} /> */}
          <TmntDataForm tmntProps={dataOneTmnt} />
        </div>
      </div>
    </>
  );
};

export default TmntDataPage;
