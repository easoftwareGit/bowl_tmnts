import React, { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { myObj } from "./myObjType";
import { Tabs, Tab } from "react-bootstrap";
import ModalConfirm from "./confirmModel";

type modalObjectType = {
  title: string,
  message: string,
  id: number
}
type AcdnErrType = {
  errClass: string,
  message: string,
}
interface ChildProps {
  otherObjs: myObj[],
  setOtherObjs: (otherObjs: myObj[]) => void;
  objAcdnErr: AcdnErrType,
  setObjAcdnErr: (objAcdnErr: AcdnErrType) => void;
}
interface AddOrDelButtonProps {
  id: number;
}

const initModalObj: modalObjectType = {
  title: 'title',
  message: 'message',
  id: 0
}

const noObjAcndErr: AcdnErrType = {
  errClass: '',
  message: ''
}

const defaultTabKey = 'otherObj5'
const delConfTitle = 'Confirm Delete'
const objErrClassName = 'objError';
const acndErrClassName = 'acdnError';

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

export const validate = (  
  otherObjs: myObj[],
  setOtherObjs: Dispatch<SetStateAction<myObj[]>>,
  objAcdnErr: AcdnErrType,
  setObjAcdnErr: Dispatch<SetStateAction<AcdnErrType>>
): boolean => {

  let isValid = true;
  let nameErr = '';
  let MyNumErr = '';
  let objErrClass = '';

  const isDuplicateName = (otherObj: myObj): boolean => {
    let i = 0;
    while (otherObjs[i].id < otherObj.id && i < otherObjs.length) {
      if (otherObjs[i].name === otherObj.name) {
        return true;
      }
      i++;
    }
    return false;
  }

  const setError = (objName: string, errMsg: string) => {
    if (isValid) {
      setObjAcdnErr({
        errClass: acndErrClassName,
        message: getObjAcdnErrMsg(objName, nameErr),
      })      
    }
    isValid = false;
    objErrClass = objErrClassName;
  }

  setOtherObjs(
    otherObjs.map((otherObj) => {
      objErrClass = '';
      if (!otherObj.name.trim()) {
        nameErr = 'Name is required';
        if (isValid) {
          setObjAcdnErr({
            errClass: acndErrClassName,
            message: getObjAcdnErrMsg(otherObj.name, nameErr),
          })
        }
        isValid = false;
        objErrClass = objErrClassName;
      } else if (isDuplicateName(otherObj)) {
        nameErr = `"${otherObj.name}" has already been used.`;
        if (isValid) {
          setObjAcdnErr({
            errClass: acndErrClassName,
            message: getObjAcdnErrMsg(otherObj.name, nameErr),
          })
        }
        isValid = false;
        objErrClass = objErrClassName;
      } else {
        nameErr = ''; 
      }
      if (otherObj.myNum < 1) {
        MyNumErr = 'Number must be more than 0'
        if (isValid) {
          setObjAcdnErr({
            errClass: acndErrClassName,
            message: getObjAcdnErrMsg(otherObj.name, MyNumErr) 
          })    
        }
        isValid = false;
        objErrClass = objErrClassName;
      } else if (otherObj.myNum > 100) {
        MyNumErr = 'Number must be less than 100'
        if (isValid) {
          setObjAcdnErr({
            errClass: acndErrClassName,
            message: getObjAcdnErrMsg(otherObj.name, MyNumErr) 
          })    
        }
        isValid = false;
        objErrClass = objErrClassName;
      } else {
        MyNumErr = ''
      }
      return {
        ...otherObj,
        name_err: nameErr,
        myNum_err: MyNumErr,
        errClass: objErrClass
      }
    })
  )
  if (isValid) {
    setObjAcdnErr(noObjAcndErr)
  }    
  return isValid;
}

const MyOtherObj: React.FC<ChildProps> = ({
  otherObjs,
  setOtherObjs,
  objAcdnErr, 
  setObjAcdnErr
}) => {

  const [otherObjId, setOtherObjId] = useState(8); // last id # used in initOtherObjs
  const [tabKey, setTabKey] = useState(defaultTabKey);  

  const [showModal, setShowModal] = useState(false);
  const [modalObj, setModalObj] = useState(initModalObj);

  const handleAdd = () => {
    const newOtherObj: myObj = {
      id: otherObjId + 1,
      name: "Object " + (otherObjId + 1),
      tabTitle: "Object " + (otherObjId + 1),
      myNum: (otherObjId + 1) * 11,
      other: (otherObjId + 1) * 111,
      errClass: "",
      name_err: "",
      myNum_err: "",
    }    
    setOtherObjId(otherObjId + 1)
    setOtherObjs([...otherObjs, newOtherObj]);
  }

  const confirmedDelete = () => {    
    setShowModal(false)       // hide modal

    const updatedData = otherObjs.filter((otherObj) => otherObj.id !== modalObj.id);    
    setOtherObjs(updatedData);    

    setModalObj(initModalObj) // reset modal object (used my modal dialog)    
    setTabKey(defaultTabKey); // refocus 1st object  
  }

  const canceledDelete = () => {
    setShowModal(false)       // hide modal
    setModalObj(initModalObj) // reset modal object (used my modal dialog)    
  }

  const handleDelete = (id: number) => {
    const objToDel = otherObjs.find((otherObj) => otherObj.id === id);
    const toDelName = objToDel?.name;
    setModalObj({
      title: delConfTitle,
      message: `Do you want to delete Object: ${toDelName}`,
      id: id
    });
    setShowModal(true) // deletion done in confirmedDelete
  }

  const handleInputChange = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nameErr = name + '_err';   

    const getNextObjAcdnErrMsg = (updatedObj: myObj | null): string => {
      let errMsg = '';
      let acdnErrMsg = '';
      let i = 0;
      let otherObj: myObj;
      while (i < otherObjs.length && !errMsg) {
        if (otherObjs[i].id === updatedObj?.id) {
          otherObj = updatedObj;
        } else {
          otherObj = otherObjs[i];
        }
        errMsg = getObjErrMsg(otherObj)
        if (errMsg) {
          acdnErrMsg = getObjAcdnErrMsg(otherObj.name, errMsg)
        }              
        i++;
      }
      return acdnErrMsg;
    }
    
    setOtherObjs(
      otherObjs.map((otherObj) => {
        if (otherObj.id === id) {
          let updatedObj: myObj
          // set tabTitle changing name property value
          if (name === 'name') {
            updatedObj = {
              ...otherObj,
              name: value,
              tabTitle: value,
              name_err: ''
            } 
          } else {
            updatedObj = {
              ...otherObj,
              [name]: value,
              [nameErr]: ''
            }
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
          return otherObj;
        }
      })
    );
  };
  
  const handleBlur = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!value.trim()) {
      setOtherObjs(otherObjs.map((otherObj) => { 
        if (otherObj.id === id) {
          if (name === 'name') {
            return {
              ...otherObj,
              name: 'Object ' + otherObj.id,
              tabTitle: 'Object ' + otherObj.id,
              name_err: ''
            }
          } else {
            return otherObj
          }
        } else {
          return otherObj
        }
      }))
    }
  }

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setTabKey(key);
    }
  };

  const AddOrDelButton: React.FC<AddOrDelButtonProps> = ({ id }) => {
    if (id === 5) {
      return (
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
              value={otherObjs.length}
            />
            <button
              className="btn btn-success border border-start-0 rounded-end"
              type="button"
              tabIndex={-1}
              id="event-plus"
              onClick={handleAdd}
            >
              +
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-sm-3 d-flex align-items-end">
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(id)}
          >
            Delete Object
          </button>
        </div>
      );
    }
  };

  return (
    <>
      <ModalConfirm
        show={showModal}
        title={modalObj.title}
        message={modalObj.message}
        onConfirm={confirmedDelete}  
        onCancel={canceledDelete}
      />      
      <Tabs
        defaultActiveKey={defaultTabKey}
        id="otherObjs-tabs"
        className="mb-2"
        variant="pills"  
        activeKey={tabKey}
        onSelect={handleTabSelect}
      >
        {otherObjs.map((otherObj) => (
          <Tab
            key={otherObj.id}
            eventKey={`otherObj${otherObj.id}`}
            title={otherObj.tabTitle}
            tabClassName={`${otherObj.errClass}`}
          >            
            <div className="row g-3 mb-3">
              <AddOrDelButton id={otherObj.id} />
              <div className="col-sm-3">
                <label htmlFor={`inputOtherName${otherObj.id}`} className="form-label">
                  Object Name
                </label>
                <input
                  type="text"
                  className={`form-control ${otherObj.name_err && "is-invalid"}`}
                  id={`inputOtherName${otherObj.id}`}
                  name="name"
                  value={otherObj.name}
                  maxLength={20}                
                  onChange={handleInputChange(otherObj.id)}                
                  onBlur={handleBlur(otherObj.id)}
                />
                <div className="text-danger">{otherObj.name_err}</div>
              </div>
              <div className="col-sm-3">
                <label htmlFor={`inputOtherMyNum${otherObj.id}`} className="form-label">
                  My Num
                </label>
                <input
                  type="Number"          
                  className={`form-control ${otherObj.myNum_err && "is-invalid"}`}
                  id={`inputOtherMyNum${otherObj.id}`}
                  name="myNum"
                  value={otherObj.myNum}          
                  onChange={handleInputChange(otherObj.id)}                
                  // onBlur={handleBlur(otherObj.id)}
                />
                <div className="text-danger">{otherObj.myNum_err}</div>
              </div>
              <div className="col-sm-3"></div>
            </div>
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

export default MyOtherObj;
