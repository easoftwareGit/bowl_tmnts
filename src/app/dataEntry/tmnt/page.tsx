"use client";
import { useState } from "react";
import { TmntDataForm } from "./form";
import {
  initBrkts,
  initDivs,
  initElims,
  initEvents,
  initLanes,
  initPots,
  initSquads,
  initTmnt,
} from "./initVals";
import { todayStr } from "@/lib/dateTools";
import { fullTmntDataType, tmntPropsType } from "../../../lib/types/types";

const blankTmnt = {
  ...initTmnt,
  start_date: todayStr,
  end_date: todayStr,
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
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="shadow p-3 m-3 rounded-3 container">
        <h2 className="mb-3">Tournament Info</h2>
        <TmntDataForm tmntProps={tmntFormProps} />
      </div>
    </div>
  );
};

export default TmntDataPage;
