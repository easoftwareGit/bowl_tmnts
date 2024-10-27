"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; 
import { getAllDataForTmnt } from "@/lib/db/tmnts/tmntsAxios";
import { allDataOneTmntType, tmntPropsType, tmntType } from "@/lib/types/types";
import { blankTmnt } from "@/lib/db/initVals";
import TmntDataForm from "../../tmnt/form";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
// import { useRouter } from "next/router";

// interface FormProps {
//   tmntId: string;
// }

export default function EditTmntPage() {

  // const router = useRouter();
  // const { tmntId } = router.query; // Access tmntId from the URL
  
  const params = useParams();
  const tmntId = params.tmntId as string;

  const initBlankTmnt: tmntType = {
    ...blankTmnt,
    start_date: null as any,
    end_date: null as any,
  } 
  const initAllTmntData: allDataOneTmntType = {
    tmnt: initBlankTmnt,
    events: [],
    divs: [],
    squads: [],
    lanes: [],
    pots: [],
    brkts: [],
    elims: [],
  }

  const [allTmntData, setAllTmntData] = useState<allDataOneTmntType>(initAllTmntData);  
  const [tmntData, setTmntData] = useState(allTmntData.tmnt);
  const [events, setEvents] = useState(allTmntData.events);
  const [divs, setDivs] = useState(allTmntData.divs);
  const [squads, setSquads] = useState(allTmntData.squads);
  const [lanes, setLanes] = useState(allTmntData.lanes);
  const [pots, setPots] = useState(allTmntData.pots);
  const [brkts, setBrkts] = useState(allTmntData.brkts);
  const [elims, setElims] = useState(allTmntData.elims);
  const [showingModal, setShowingModal] = useState(false);  

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
    showingModal,
    setShowingModal,
    tmntSaveType: 'UPDATE'
  };  

  useEffect(() => { 
    const fetchAllDataForTmnt = async () => {
      const tmntData = await getAllDataForTmnt(tmntId);
      if (tmntData) {
        setAllTmntData(tmntData);
        setTmntData(tmntData.tmnt);
        setEvents(tmntData.events);
        setDivs(tmntData.divs);
        setSquads(tmntData.squads);
        setLanes(tmntData.lanes);
        setPots(tmntData.pots);
        setBrkts(tmntData.brkts);
        setElims(tmntData.elims);      
      }    
    }

    fetchAllDataForTmnt()
      .catch(console.error);
  }, [tmntId]);

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

}

// export default EditTmntPage;