"use client";
import { useState, ChangeEvent } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { myObj } from "./myObjType";
import "./form.css";

export const TestForm = () => {
  const init1stObj = {
    id: 1,
    name: "Obj 1",
    myNum: 0,
    other: 10,
  };
  const initArrOfObj: myObj[] = [];

  const [firstObj, setFirstObj] = useState(init1stObj);
  const [addedObjs, setAddedObjs] = useState(initArrOfObj);
  const [key, setKey] = useState("1");
  const [objId, setObjId] = useState(1);

  const handleAddObjClick = (e: React.MouseEvent<HTMLElement>) => {
    const newObj = {
      id: objId + 1,
      name: "Obj " + (objId + 1),
      myNum: 0,
      other: 10,
    };
    setObjId(objId + 1);
    setAddedObjs([...addedObjs, newObj]);
  };

  const handleDeleteObjClick = (id:number) => (e: React.MouseEvent<HTMLElement>) => { 
    setAddedObjs(addedObjs.filter(obj => obj.id !== id))
    setKey("1") // refocus first tab after delete
  }

  const handleFirstObjInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFirstObj({
      ...firstObj,
      [name]: value,
    });
  };

  const handleAddedObjsInputChange = (id: number) => (e: ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target;
    setAddedObjs(
      addedObjs.map((obj) => {
        if (obj.id === id) { 
          return {
            ...obj,
            [name]: value,
          };
        } else {
          return obj
        }
      })
    )
  }

  const handleTabSelect = (eventKey: string | null) => {
    if (eventKey) {
      setKey(eventKey);
    }
  };

  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
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
        <div className="col-md-6">
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
      </div>
      <div className="row g-3">
        <Tabs
          className="flex-row"
          variant="pills"
          transition={false}
          id="firstObjTab"
          defaultActiveKey="obj"
          activeKey={key}
          onSelect={handleTabSelect}
        >
          <Tab eventKey={firstObj.id} title="Objects">
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
                    name="num_divs"
                    readOnly
                    value={addedObjs.length + 1}
                  />
                  <button
                    className="btn btn-success border border-start-0 rounded-end"
                    type="button"
                    tabIndex={-1}
                    id="div-plus"
                    onClick={handleAddObjClick}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-sm-3">
                <label htmlFor="inputObjName1" className="form-label">
                  Obj Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputObjName1"
                  name="name"
                  value={firstObj.name}
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
              <div className="col-sm-3"></div>
            </div>
          </Tab>
          {addedObjs.map((obj) => (
            <Tab key={obj.id} eventKey={obj.id} title={obj.name}>
              <div className="row g-3 mb-3">
                <div className="col-sm-3 d-flex align-items-end">
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteObjClick(obj.id)}
                  >
                    Delete Obj
                  </button>
                </div>
                <div className="col-sm-3">
                  <label
                    htmlFor={`inputObjName${obj.id}`}
                    className="form-label"
                  >
                    Obj Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`inputObjName${obj.id}`}
                    name="name"
                    value={obj.name}
                    onChange={handleAddedObjsInputChange(obj.id)}
                  />
                </div>
                <div className="col-sm-3">
                  <label htmlFor={`inputMyNum${obj.id}`} className="form-label">
                    My Num
                  </label>
                  <input
                    type="Number"
                    className="form-control"
                    id={`inputMyNum${obj.id}`}
                    name="myNum"
                    value={obj.myNum}
                    onChange={handleAddedObjsInputChange(obj.id)}
                  />
                </div>
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
