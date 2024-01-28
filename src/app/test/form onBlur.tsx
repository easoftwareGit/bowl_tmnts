"use client";
import React, { useState, ChangeEvent } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { Button, Tab, Tabs } from "react-bootstrap";
import OneToNObj from "./oneToNObjs";
import { myObj } from "./myObjType";
import "./form.css";
import ModalConfirm from "./confirmModel";

type modalObjectType = {
  title: string,
  message: string,
  id: number
}

export const TestForm: React.FC = () => {

  const initObjs: myObj[] = [
    {
      id: 1,
      name: "Object 1",
      tabTitle: "Objects",
      myNum: 11,
      other: 123,
      errClass: '',
      name_err: '',
      myNum_err: '',
    },
    {
      id: 2,
      name: "Object 2",
      tabTitle: "Object 2",
      myNum: 22,
      other: 234,
      errClass: '',
      name_err: '',
      myNum_err: '',
    },
    {
      id: 3,
      name: "Object 3",
      tabTitle: "Object 3",
      myNum: 33,
      other: 345,
      errClass: '',
      name_err: '',
      myNum_err: '',
    },
    {
      id: 4,
      name: "Object 4",
      tabTitle: "Object 4",
      myNum: 44,
      other: 456,
      errClass: '',
      name_err: '',
      myNum_err: '',
    },
  ];
 
  const initModalObj: modalObjectType = {
    title: 'title',
    message: 'message',
    id: 0
  }

  const [objs, setObjs] = useState(initObjs);
  const [objId, setObjId] = useState(4);
  const [tabKey, setTabKey] = useState("object1");
  
  const [showModal, setShowModal] = useState(false);
  const [modalObj, setModalObj] = useState(initModalObj)

  const delConfTitle = 'Confirm Delete'
  
  const confirmedDelete = () => {    
    setShowModal(false)       // hide modal

    const updatedData = objs.filter((obj) => obj.id !== modalObj.id);    
    setObjs(updatedData);
    
    setModalObj(initModalObj) // reset modal object (used my modal dialog)    
    setTabKey("object1");     // refocus 1st object  
  }

  const canceledDelete = () => {
    setShowModal(false)       // hide modal
    setModalObj(initModalObj) // reset modal object (used my modal dialog)    
  }

  const handleAdd = () => {
    const newObj: myObj = {
      id: objId + 1,
      name: "Object " + (objId + 1),
      tabTitle: "Object " + (objId + 1),
      myNum: (objId + 1) * 11,
      other: (objId + 1) * 100 + (objId + 2) * 10 + (objId + 3),
      errClass: '',
      name_err: '',
      myNum_err: '',
    };
    setObjId(objId + 1);
    setObjs([...objs, newObj]);
  };

  const handleDelete = (id: number) => {
    const objToDel = objs.find((obj) => obj.id === id);
    const toDelName = objToDel?.name;
    setModalObj({
      title: delConfTitle,
      message: `Do you want to delete Object: ${toDelName}`,
      id: id
    })
    setShowModal(true) // deletion done in confirmedDelete
  };

  const handleInputChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nameErr = name + '_err';
    setObjs(
      objs.map((obj) => {
        if (obj.id === id) {
          // set tabTitle if id !== 1 AND changing name property value
          if (id !== 1 && name === "name") {
            return {
              ...obj,
              name: value,
              tabTitle: value,
              name_err: '',
            };
          } else {
            return {
              ...obj,
              [name]: value,
              [nameErr]: '',
            };
          }
        } else {
          return obj;
        }
      })
    );
  };

  const handleBlur = (id: number, e: ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target;
    if (!value.trim()) {
      setObjs(objs.map((obj) => { 
        if (obj.id === id) {
          if (name === 'name') {
            return {
              ...obj,
              name: 'Object ' + obj.id,
              name_err: ''
            }
          } else {
            return obj
          }
        } else {
          return obj
        }
      }))
    }
  }

  const handleValidate = () => {

    let isValid = true;
    let nameErr = '';
    let MyNumErr = '';
    let objErrClass = ''
    setObjs(
      objs.map((obj) => {   
        objErrClass = '';
        if (!obj.name.trim()) {
          nameErr = "Name is required";
          isValid = false;
          objErrClass = 'objError';
        } else {
          nameErr = '';
          // sanitized.first_name = sanitize(formData.first_name);
        }  
        if (obj.myNum < 1) {
          MyNumErr = 'Number must be more than 0'
          objErrClass = 'objError'
        } else if (obj.myNum > 100) {
          MyNumErr = 'Number must be less than 100'
          objErrClass = 'objError';
        } else {
          MyNumErr = ''
        }
        return {
          ...obj,
          name_err: nameErr,
          myNum_err: MyNumErr,
          errClass: objErrClass,
        }
      })
    )
    return isValid;
  }

  const handleTabSelect = (key: string | null) => {     
    if (key) {
      setTabKey(key)
    }
  }

  return (
    <div>
      <h3>Parent Component</h3>
      <ModalConfirm
        show={showModal}
        title={modalObj.title}
        message={modalObj.message}
        onConfirm={confirmedDelete}
        onCancel={canceledDelete}
      />
      <div className="row g-3 mb-3">
        <div className="col-md-5">
          <label htmlFor="inputMainName" className="form-label">
            Main Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputMainName"
            name="main_name"            
            maxLength={20}            
          />
        </div>
        <div className="col-md-5">
          <label htmlFor="inputOtherName" className="form-label">
            Other Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputOtherName"
            name="other_name"            
            maxLength={20}            
          />
        </div>
        <div className="col-md-2 mx-auto">
          <label htmlFor="button" className="form-label">
            &#160;
          </label>
          <Button variant="primary" onClick={handleValidate}>
            Validate
          </Button>
        </div>
      </div>


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
                <Tab
                  key={obj.id}
                  eventKey={`object${obj.id}`}
                  title={obj.tabTitle} 
                  tabClassName={`${obj.errClass}`} 
                >
                  <OneToNObj
                    obj={obj}
                    objCount={objs.length}
                    onAddObj={handleAdd}
                    onDeleteObj={handleDelete}
                    onInputChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(obj.id, e)}
                    onBlur={(e: ChangeEvent<HTMLInputElement>) => handleBlur(obj.id, e)}
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
