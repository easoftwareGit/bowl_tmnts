"use client";
import { useState } from "react";
import { useSession } from "next-auth/react"; 
import TmntDataForm from "./form";
import {
  initBrkts,
  initDivs,
  initElims,
  initEvents,
  initLanes,
  initPots,
  initSquads,
  initTmnt,
} from "../../../lib/db/initVals";
import { fullTmntDataType, tmntPropsType } from "../../../lib/types/types";
import { startOfToday } from "date-fns";

const blankTmnt = {
  ...initTmnt,
  start_date: startOfToday(),
  end_date: startOfToday(),
};

interface FormProps {
  fullTmntData?: fullTmntDataType;
}

const blankFullTmnt: fullTmntDataType = {
  tmnt: blankTmnt,
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
  // line the tmnt data types
  fullTmntData.tmnt.user_id = data?.user?.id || "";  
  fullTmntData.events[0].tmnt_id = fullTmntData.tmnt.id;
  fullTmntData.divs[0].tmnt_id = fullTmntData.tmnt.id;
  fullTmntData.squads[0].event_id = fullTmntData.events[0].id;
  fullTmntData.lanes[0].squad_id = fullTmntData.squads[0].id;
  fullTmntData.lanes[1].squad_id = fullTmntData.squads[0].id; // initLanes has 2 itens

  fullTmntData.pots[0].div_id = fullTmntData.divs[0].id;
  fullTmntData.pots[0].squad_id = fullTmntData.squads[0].id;
  
  // fullTmntData.brkts[0].div_id = fullTmntData.divs[0].id;
  // fullTmntData.brkts[0].squad_id = fullTmntData.squads[0].id;
  // fullTmntData.elims[0].div_id = fullTmntData.divs[0].id;
  // fullTmntData.elims[0].squad_id = fullTmntData.squads[0].id;

  const [tmntData, setTmntData] = useState(fullTmntData.tmnt);
  const [events, setEvents] = useState(fullTmntData.events);
  const [divs, setDivs] = useState(fullTmntData.divs);
  const [squads, setSquads] = useState(fullTmntData.squads);
  const [lanes, setLanes] = useState(fullTmntData.lanes);
  const [pots, setPots] = useState(fullTmntData.pots);
  const [brkts, setBrkts] = useState(fullTmntData.brkts);
  const [elims, setElims] = useState(fullTmntData.elims);

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
  };

  return (
    <>      
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="shadow p-3 m-3 rounded-3 container">
          <h2 className="mb-3">Tournament Info</h2>
          <TmntDataForm tmntProps={tmntFormProps} />
        </div>
      </div>
    </>
  );
};

export default TmntDataPage;
