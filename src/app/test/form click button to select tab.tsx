"use client";
import { useState } from 'react';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export const TestForm = () => {

  const [key, setKey] = useState('home');

  const handleButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    setKey("profile")
  }

  const handleTabSelect = (eventKey: string | null) => {
    if (eventKey) {
      setKey(eventKey)
    }    
  }  

  return (
    <div>
      <div className="row g-3 mb-3">
        <button
          className="btn btn-primary"
          onClick={handleButtonClick}
        >
          Focus Profile Tab
        </button>
      </div>
      <div className="row g-3 mb-3">
        <Tabs   
          className="flex-row mb-3"
          variant="pills"                     
          transition={false}
          id="noanim-tab-example"          
          activeKey={key}
          onSelect={handleTabSelect}
        >
          <Tab eventKey="home" title="Home">
            Tab content for Home
          </Tab>
          <Tab eventKey="profile" title="Profile">
            Tab content for Profile
          </Tab>
          <Tab eventKey="contact" title="Contact">
            Tab content for Contact
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};
