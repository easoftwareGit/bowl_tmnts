"use client";
import React, { useState, ChangeEvent } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { Button, Tab, Tabs } from "react-bootstrap";
import OneToNObj from "./oneToNObjs";
import OtherObj from "./otherObj";
import { myObj } from "./myObjType";
import ModalConfirm from "./confirmModel";
import "./form.css";
import MyOtherObj from "./myOtherObj";

type modalObjectType = {
  title: string,
  message: string,
  id: number
}

type AcdnErrType = {
  errClass: string,
  message: string,
}

export const TestForm: React.FC = () => {

  const delConfTitle = 'Confirm Delete'
  const objErrClassName = 'objError';
  const acndErrClassName = 'acdnError';

  const initObjs: myObj[] = [
    {
      id: 1,
      name: "Object 1",
      tabTitle: "Object 1",
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
  
  const noObjAcndErr: AcdnErrType = {
    errClass: '',
    message: ''
  }

  const initOtherObj: myObj = {
    id: 1,
    name: 'blank',
    tabTitle: 'blank',
    myNum: 0,
    other: 0,
    errClass: '',
    name_err: '',
    myNum_err: ''  
  }

  const [objs, setObjs] = useState(initObjs);
  const [objId, setObjId] = useState(4);
  const [tabKey, setTabKey] = useState("object1");
  const [objAcdnErr, setObjAcdnErr] = useState(noObjAcndErr);
  
  const [parentObj, setParentObj] = useState<myObj>(initOtherObj);

  const [showModal, setShowModal] = useState(false);
  const [modalObj, setModalObj] = useState(initModalObj);

  const handleParentObjChange = (updatedObj: myObj[]) => {
    setParentObj(updatedObj[0])
  }

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

  const getObjAcdnErrMsg = (objName: string, objErrMsg: string): string => {
    return `: Error in ${objName} - ${objErrMsg}`
  }

  const getObjErrMsg = (obj: myObj): string => {
    if (obj.name_err) {
      return obj.name_err
    } else if (obj.myNum_err) {
      return obj.myNum_err
    } else
      return '';
  }

  const getNextObjAcdnErrMsg = (updatedObj: myObj | null): string => {
    
    let errMsg = '';
    let acdnErrMsg = '';
    let i = 0;
    let obj: myObj;
    while (i < objs.length && !errMsg) {
      if (objs[i].id === updatedObj?.id) {
        obj = updatedObj;
      } else {
        obj = objs[i];
      }
      errMsg = getObjErrMsg(obj)
      if (errMsg) {
        acdnErrMsg = getObjAcdnErrMsg(obj.name, errMsg)
      }              
      i++;
    }
    return acdnErrMsg;
  }

  const handleInputChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nameErr = name + '_err';    
    setObjs(
      objs.map((obj) => {
        if (obj.id === id) {

          let updatedObj: myObj
          // set tabTitle changing name property value
          if (name === "name") {
            updatedObj = {
              ...obj,
              name: value,
              tabTitle: value,
              name_err: '',
            };
          } else {
            updatedObj = {
              ...obj,
              [name]: value,
              [nameErr]: '',
            };
          }
          const acdnErrMsg = getNextObjAcdnErrMsg(updatedObj);
          if (acdnErrMsg) {
            setObjAcdnErr({
              errClass: acndErrClassName,
              message: acdnErrMsg
            })
          } else {
            setObjAcdnErr(noObjAcndErr)
          }
          const errMsg = getObjErrMsg(updatedObj);            
          if (errMsg) {
            return {
              ...updatedObj,
              errClass: objErrClassName,
            }            
          } else {
            return {
              ...updatedObj,
              errClass: '',
            }            
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
              tabTitle: 'Object ' + obj.id,
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

  const isDuplicateName = (obj: myObj): boolean => {
    let i = 0;
    while (objs[i].id < obj.id && i < objs.length) {
      if (objs[i].name === obj.name) {
        return true;
      }
      i++;
    }
    return false;
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
          if (isValid) {
            setObjAcdnErr({
              errClass: acndErrClassName,
              message: getObjAcdnErrMsg(obj.name, nameErr),
            })    
          }
          isValid = false;
          objErrClass = objErrClassName;
        } else if (isDuplicateName(obj)) {
          nameErr = `"${obj.name}" has already been used.`;
          if (isValid) {
            setObjAcdnErr({
              errClass: acndErrClassName,
              message: getObjAcdnErrMsg(obj.name, nameErr) 
            })    
          }
          isValid = false;
          objErrClass = objErrClassName;
        } else {
          nameErr = '';
          // sanitized.first_name = sanitize(formData.first_name);
        }  
        if (obj.myNum < 1) {
          MyNumErr = 'Number must be more than 0'
          if (isValid) {
            setObjAcdnErr({
              errClass: acndErrClassName,
              message: getObjAcdnErrMsg(obj.name, MyNumErr) 
            })    
          }
          isValid = false;
          objErrClass = objErrClassName
        } else if (obj.myNum > 100) {
          MyNumErr = 'Number must be less than 100'
          if (isValid) {
            setObjAcdnErr({
              errClass: acndErrClassName,
              message: getObjAcdnErrMsg(obj.name, MyNumErr) 
            })    
          }
          isValid = false;
          objErrClass = objErrClassName;
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
    if (isValid) {
      setObjAcdnErr(noObjAcndErr)
    }    
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
          {/* <Accordion.Header className="accordObj1"> */}
          <Accordion.Header className={objAcdnErr.errClass}>
            Objects{objAcdnErr.message}
          </Accordion.Header>
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
          <Accordion.Header>Other Object</Accordion.Header>
          <Accordion.Body>
            <p>Parent Object [0]: {JSON.stringify(parentObj)}</p>
            {/* <OtherObj onObjectChange={handleParentObjChange} /> */}
            <MyOtherObj onObjectChange={handleParentObjChange} />

            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
