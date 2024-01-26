"use client";
import React, { useState, ChangeEvent } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { Tab, Tabs } from "react-bootstrap";
import OneToNObj from "./oneToNObjs";
import { myObj } from "./myObjType";
import "./form.css";

export const TestForm: React.FC = () => {
  const initObjs: myObj[] = [
    {
      id: 1,
      name: "Object 1",
      tabTitle: "Objects",
      myNum: 11,
      other: 123,
    },
    {
      id: 2,
      name: "Object 2",
      tabTitle: "Object 2",
      myNum: 22,
      other: 234,
    },
    {
      id: 3,
      name: "Object 3",
      tabTitle: "Object 3",
      myNum: 33,
      other: 345,
    },
    {
      id: 4,
      name: "Object 4",
      tabTitle: "Object 4",
      myNum: 44,
      other: 456,
    },
  ];

  const [objs, setObjs] = useState(initObjs);
  const [objId, setObjId] = useState(4);
  const [tabKey, setTabKey] = useState("object1");

  const handleAdd = () => {
    const newObj: myObj = {
      id: objId + 1,
      name: "Object " + (objId + 1),
      tabTitle: "Object " + (objId + 1),
      myNum: (objId + 1) * 11,
      other: (objId + 1) * 100 + (objId + 2) * 10 + (objId + 3),
    };
    setObjId(objId + 1);
    setObjs([...objs, newObj]);
  };

  const handleDelete = (id: number) => {
    const updatedData = objs.filter((obj) => obj.id !== id);
    setObjs(updatedData);
    setTabKey("object1");
  };

  const handleInputChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setObjs(
      objs.map((obj) => {
        if (obj.id === id) {
          // set tabTitle if id !== 1 AND changing name property value
          if (id !== 1 && name === "name") {
            return {
              ...obj,
              name: value,
              tabTitle: value,
            };
          } else {
            return {
              ...obj,
              [name]: value,
            };
          }
        } else {
          return obj;
        }
      })
    );
  };

  const handleTabSelect = (key: string | null) => {     
    if (key) {
      setTabKey(key)
    }
  }

  return (
    <div>
      <h3>Parent Component</h3>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Objects</Accordion.Header>
          <Accordion.Body>
            <Tabs
              defaultActiveKey="object1"
              variant="pills"
              id="objects-tabs"
              activeKey={tabKey}
              onSelect={handleTabSelect}
            >
              {objs.map((obj) => (
                <Tab key={obj.id} eventKey={`object${obj.id}`} title={obj.tabTitle}>
                  <OneToNObj
                    obj={obj}
                    objCount={objs.length}
                    onAddObj={handleAdd}
                    onDeleteObj={handleDelete}
                    onInputChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(obj.id, e)}
                  />
                </Tab>
              ))}
            </Tabs>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Other Objects</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
