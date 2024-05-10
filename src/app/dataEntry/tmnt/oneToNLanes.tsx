"use client";
import React, { useState, ChangeEvent } from "react";
import { squadType, AcdnErrType, laneType } from "../../../lib/types/types";
import { initLanes } from "../../../db/initVals";
import { Tabs, Tab } from "react-bootstrap";
import { objErrClassName, acdnErrClassName, getAcdnErrMsg, noAcdnErr } from "./errors";
import ModalConfirm from "@/components/modal/confirmModal";
import { initModalObj } from "@/components/modal/modalObjType";
import LanesList from "@/components/tmnts/lanesList";

interface ChildProps {
  lanes: laneType[];  
  squads: squadType[];  
}

const defaultTabKey = 'squad1'

const OneToNLanes: React.FC<ChildProps> = ({
  lanes,  
  squads,  
}) => {
  
  const [confModalObj, setConfModalObj] = useState(initModalObj);
  const [tabKey, setTabKey] = useState(defaultTabKey); 

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setTabKey(key);
    }    
  }

  return (
    <>
      {/* <ModalConfirm
        show={confModalObj.show}
        title={confModalObj.title}
        message={confModalObj.message}
        onConfirm={confirmDontUse}  
        onCancel={cancelDontUse}
      />     */}
      <Tabs
        defaultActiveKey={defaultTabKey}
        id="lanes-tabs"
        className="mb-2"
        variant="pills"
        activeKey={tabKey}
        onSelect={handleTabSelect}
      >
        {squads.map((squad) => 
          <Tab
            key={squad.id}
            eventKey={`squad${squad.id}`}
            title={squad.tab_title}
            // tabClassName={`${squad.laneErrClassName}`} no errors in lane tabs
          >
            <LanesList
              squadId={squad.id}
              lanes={lanes}
            />
          </Tab>
        )}
      </Tabs>
    </>
  )
}

export default OneToNLanes;