"use client";
import React, { useState, ChangeEvent } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import OneToNObj from './oneToNObjs';
import { myObj } from "./myObjType";
import "./form.css";

export const TestForm: React.FC = () => {

  const init1stObj: myObj = {
    id: 1,
    name: "Object 1",
    myNum: 11,
    other: 123,
  };
  const initArrOfObj: myObj[] = [
    {
      id: 2,
      name: "Object 2",
      myNum: 22,
      other: 234,
    },
    {
      id: 3,
      name: "Object 3",
      myNum: 33,
      other: 345,
    },
    {
      id: 4,
      name: "Object 4",
      myNum: 44,
      other: 456,
    }    
  ];

  const [firstObj, setFirstObj] = useState(init1stObj);
  const [addedObjs, setAddedObjs] = useState(initArrOfObj);
  const [objId, setObjId] = useState(4)
  const [tabKey, setTabKey] = useState("object1");

  const handleAddEventClick = (e: React.MouseEvent<HTMLElement>) => {
    const newObj = {
      id: objId + 1,
      name: "Object " + (objId + 1),
      myNum: (objId + 1) * 11,
      other: ((objId + 1) * 100) + ((objId + 2) * 10) + (objId + 3),
    };
    setObjId(objId + 1);
    setAddedObjs([...addedObjs, newObj]);
  };

  const handleDelete = (id: number) => {
    const updatedData = addedObjs.filter(obj => obj.id !== id);
    setAddedObjs(updatedData);
    setTabKey("object1");
  };

  const handleInputChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (id === 1) {
      setFirstObj({
        ...firstObj,
        [name]: value
      })
    } else {
      setAddedObjs(
        addedObjs.map((obj) => {
          if (obj.id === id) {
            return {
              ...obj,
              [name]: value
            }
          } else {
            return obj
          }
        })
      )
    }
  };

  const handleFirstObjInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChange(firstObj.id, e)
  }

  const handleTabSelect = (key: string | null) => { 
    if (key) {
      setTabKey(key)
    }
  }

  const handleDebug = (e: React.MouseEvent<HTMLElement>) => {
    console.log('firstObj: ', firstObj)
    addedObjs.forEach((obj) => {
      console.log(`Obj # ${obj.id}: `, obj)
    })
  }

  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"            
            id="inputName"
            name="inputName"            
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputSomething" className="form-label">
            Something
          </label>
          <input
            type="text"
            className="form-control"            
            id="inputSomething"
            name="inputSomething"            
          />
        </div>
        <div className="col-md-4">
          <button className='btn btn-info' onClick={handleDebug}>
            Debug
          </button>
        </div>
      </div>
      <div className="row g-3">
        <Tabs
          defaultActiveKey="object1"
          variant="pills"
          id="objects-tabs"        
          activeKey={tabKey}
          onSelect={handleTabSelect}
        >
          <Tab key={1} eventKey={`object1`} title='Objects'>          
            <div className="row g-3 mb-3">
              <div className="col-sm-3">
                <label htmlFor="inputNumObjs" className="form-label">
                  # Objects
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="inputNumObjs"
                    name="num_objs"
                    readOnly
                    value={addedObjs.length + 1}                        
                  />
                  <button
                    className="btn btn-success border border-start-0 rounded-end"
                    type="button"
                    tabIndex={-1}
                    id="event-plus"
                    onClick={handleAddEventClick}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-sm-3">
                <label htmlFor="inputMyNum1" className="form-label">
                  Object Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputName1"
                  name="name"
                  value={firstObj.name}
                  maxLength={20}
                  onChange={handleFirstObjInputChange}
                />
              </div>
              <div className="col-sm-3">
                <label htmlFor="inputMyNum1" className="form-label">
                  My Num
                </label>
                <input
                  type="Number"
                  className="form-control"
                  id="inputMyNum1"
                  name="myNum"
                  value={firstObj.myNum}
                  onChange={handleFirstObjInputChange}
                />
              </div>
              <div className="col-sm-3">
              </div>
            </div>
          </Tab>
          {addedObjs.map(obj => (
            <Tab key={obj.id} eventKey={`object${obj.id}`} title={obj.name}>
              <OneToNObj
                obj={obj}
                onDeleteObj={() => handleDelete(obj.id)}
                onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(obj.id, e)}                
              />
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
