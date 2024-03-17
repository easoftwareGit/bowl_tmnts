import React, { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { divType, AcdnErrType, potType, brktType, elimType } from "./types";
import { initDiv } from "./initVals";
import { Tabs, Tab } from "react-bootstrap";
import ModalConfirm, { delConfTitle } from "@/components/modal/confirmModal";
import ModalErrorMsg, { cannotDeleteTitle } from "@/components/modal/errorModal";
import { initModalObj } from "@/components/modal/modalObjType";
import { objErrClassName, acdnErrClassName, getAcdnErrMsg, noAcdnErr, isDuplicateName } from "./errors";
import { maxEventLength, minHdcpPer, maxHdcpPer, minHdcpFrom, maxHdcpFrom } from "@/lib/validation";

interface ChildProps {
  divs: divType[],
  setDivs: (divs: divType[]) => void;  
  pots: potType[],
  brkts: brktType[],
  elims: elimType[],
  setAcdnErr: (objAcdnErr: AcdnErrType) => void;
}
interface AddOrDelButtonProps {
  id: string;
}

const defaultTabKey = 'div1'

const getDivErrMsg = (div: divType): string => {
  if (div.name_err) return div.name_err;
  if (div.hdcp_err) return div.hdcp_err;
  if (div.hdcp_from_err) return div.hdcp_from_err;
  return '';
}

const getNextAcdnErrMsg = (updatedDiv: divType | null, divs: divType[]): string => {
  let errMsg = '';
  let acdnErrMsg = '';
  let i = 0;
  let div: divType;
  while (i < divs.length && !errMsg) {
    if (divs[i].id === updatedDiv?.id) {
      div = updatedDiv;
    } else {
      div = divs[i];
    }
    errMsg = getDivErrMsg(div)
    if (errMsg) {
      acdnErrMsg = getAcdnErrMsg(div.name, errMsg)
    }              
    i++;
  }
  return acdnErrMsg;
}

export const validateDivs = (
  divs: divType[],
  setDivs: Dispatch<SetStateAction<divType[]>>,
  setAcdnErr: Dispatch<SetStateAction<AcdnErrType>>
): boolean => {

  let areDivsValid = true;
  let nameErr = '';
  let hdcpErr = '';
  let hdcpFromErr = '';
  let divErrClassName = '';

  const setError = (divName: string, errMsg: string) => {
    if (areDivsValid) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: getAcdnErrMsg(divName, errMsg),
      })      
    }
    areDivsValid = false;
    divErrClassName = objErrClassName;
  }

  setDivs(
    divs.map((div) => {
      divErrClassName = '';
      if (!div.name.trim()) {
        nameErr = 'Name is required';
        setError(div.name, nameErr);
      } else if (isDuplicateName(divs, div)) {
        nameErr = `"${div.name}" has already been used.`;
        setError(div.name, nameErr);
      } else {
        nameErr = '';
      }
      if (div.hdcp < minHdcpPer) {
        hdcpErr = 'Hdcp % must be more than ' + (minHdcpPer - 1)
        setError(div.name, hdcpErr);
      } else if (div.hdcp > maxHdcpPer) {
        hdcpErr = 'Hdcp % must be less than ' + (maxHdcpPer + 1)
        setError(div.name, hdcpErr);
      } else {
        hdcpErr = ''
      }
      if (div.hdcp_from < minHdcpFrom) {
        hdcpFromErr = 'Event Games must be more than ' + (minHdcpFrom - 1)
        setError(div.name, hdcpFromErr);
      } else if (div.hdcp_from > maxHdcpFrom) {
        hdcpFromErr = 'Event Games must be less than ' + (maxHdcpFrom + 1)
        setError(div.name, hdcpFromErr);
      } else {
        hdcpFromErr = ''
      }
      return {
        ...div,
        name_err: nameErr,
        hdcp_err: hdcpErr,
        hdcp_from_err: hdcpFromErr,
        errClassName: divErrClassName
      }
    })
  )
  if (areDivsValid) {
    setAcdnErr(noAcdnErr)
  }    
  return areDivsValid;
}

const OneToNDivs: React.FC<ChildProps> = ({
  divs,
  setDivs,  
  pots,
  brkts,
  elims,
  setAcdnErr
}) => { 

  const [confModalObj, setConfModalObj] = useState(initModalObj);
  const [errModalObj, setErrModalObj] = useState(initModalObj);
  const [tabKey, setTabKey] = useState(defaultTabKey); 
  const [divId, setDivId] = useState(1); // id # used in initDivs in form.tsx

  const handleAdd = () => {
    const newDiv: divType = {
      ...initDiv,
      id: '' + (divId + 1),
      name: "Division " + (divId + 1),
      tab_title: "Division " + (divId + 1),
    };
    setDivId(divId + 1);
    setDivs([...divs, newDiv]);
  };

  const confirmedDelete = () => {    
    setConfModalObj(initModalObj)   // reset modal object (hides modal)    

    // filter out deleted div
    const updatedData = divs.filter((div) => div.id !== confModalObj.id);
    setDivs(updatedData);    
    
    // deleted div might have an acdn error, get next acdn error
    const acdnErrMsg = getNextAcdnErrMsg(null, updatedData);
    if (acdnErrMsg) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: acdnErrMsg
      })
    } else {
      setAcdnErr(noAcdnErr)
    }

    setTabKey(defaultTabKey);   // refocus 1st div
  }

  const canceledDelete = () => {    
    setConfModalObj(initModalObj)   // reset modal object (hides modal)    
  }
  const canceledModalErr = () => {
    setErrModalObj(initModalObj); // reset modal object (hides modal)
  };

  const divHasPots = (divToDel: divType): boolean => {
    return pots.some((pot) => pot.div_id === divToDel.id)
  }
  const divHasBrkts = (divToDel: divType): boolean => {
    return false
  }
  const divHasElims = (divToDel: divType): boolean => {
    return false
  }

  const handleDelete = (id: string) => {
    if (id === "1") return

    const divToDel = divs.find((div) => div.id === id);
    if (!divToDel) return;

    const toDelName = divToDel.name;

    if (divHasPots(divToDel)) {
      setErrModalObj({
        show: true,
        title: cannotDeleteTitle,
        message: `Cannot delete Division: ${toDelName}. It has a Pot.`,
        id: id
      })
    } else if (divHasBrkts(divToDel)) {
      setErrModalObj({
        show: true,
        title: cannotDeleteTitle,
        message: `Cannot delete Division: ${toDelName}. It has a Bracket.`,
        id: id
      })
    } else if (divHasElims(divToDel)) {
      setErrModalObj({
        show: true,
        title: cannotDeleteTitle,
        message: `Cannot delete Division: ${toDelName}. It has an Eliminator.`,
        id: id
      })
    } else {
      setConfModalObj({
        show: true,
        title: delConfTitle,
        message: `Do you want to delete Division: ${toDelName}?`,
        id: id
      });   // deletion done in confirmedDelete    
    }
  }
 
  const handleInputChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => { 
    const { name, value, checked } = e.target;
    const nameErr = name + '_err';   

    setDivs(
      divs.map((div) => {
        if (div.id === id) {
          let updatedDiv: divType
          // set tabTitle changing name property value
          if (name === 'name') {
            updatedDiv = {
              ...div,
              name: value,
              tab_title: value,
              name_err: ''
            }
          } else if (name === "item.int_hdcp") {
            return {
              ...div,
              int_hdcp: checked,
            };
          } else if (name.startsWith("hdcp_for")) {
            return {
              ...div,
              hdcp_for: value,
            };
          } else {
            updatedDiv = {
              ...div,
              [name]: value,
              [nameErr]: ''
            }
          }
          const acdnErrMsg = getNextAcdnErrMsg(updatedDiv, divs);
          if (acdnErrMsg) {
            setAcdnErr({
              errClassName: acdnErrClassName,
              message: acdnErrMsg
            })
          } else {
            setAcdnErr(noAcdnErr)
          }
          const errMsg = getDivErrMsg(updatedDiv);            
          if (errMsg) {
            return {
              ...updatedDiv,
              errClassName: objErrClassName,
            }            
          } else {
            return {
              ...updatedDiv,
              errClassName: '',
            }            
          }
        } else {
          return div;
        }
      })
    );
  }

  const handleBlur = (id: string) => (e: ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target;

    if (value === '') {
      setDivs(
        divs.map((div) => {
          if (div.id === id) {
            if (name === 'name') {
              return {
                ...div,
                name: 'Division ' + div.id,
                tab_title: 'Division ' + div.id,
                name_err: ''  
              }
            } else if (name === 'hdcp') {
              return {
                ...div,
                hdcp: 0,
                hdcp_err: '',
              }
            } else if (name === 'hdcp_from') {
              return {
                ...div,
                hdcp_from: 0,
                hdcp_from_err: '',
              }
            } else {
              return div
            }
          } else {
            return div
          }
        })
      )
    }  
    if (name === `hdcp`) {
      const doDisable = (value === '' || parseInt(value) === 0);
      const hcdpFromInput = document.getElementById(`inputHdcpFrom${id}`) as HTMLButtonElement;
      const intHdcpCheck = document.getElementById(`chkBoxIntHdcp${id}`) as HTMLButtonElement;
      const hdcpForGame = document.getElementById(`radioHdcpForGame${id}`) as HTMLButtonElement;
      const hdcpForSeries = document.getElementById(`radioHdcpForSeries${id}`) as HTMLButtonElement;
      hcdpFromInput.disabled = doDisable;
      intHdcpCheck.disabled = doDisable;
      hdcpForGame.disabled = doDisable;
      hdcpForSeries.disabled = doDisable;   
    }
  }

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setTabKey(key);
    }
  };

  const AddOrDelButton: React.FC<AddOrDelButtonProps> = ({ id }) => {
    if (id === "1") {
      return (
        <div className="col-sm-3">
          <label htmlFor="inputNumDivs" className="form-label">
            # Divisions
          </label>
          <div className="row g-0">
            <div className="col-sm-8">
              <input
                disabled
                type="text"
                className="form-control"
                id="inputNumDivs"
                name="num_Divs"
                value={divs.length}
              />
            </div>
            <div className="d-grid col-sm-4">            
              <button
                className="btn btn-success"
                id="divAdd"
                onClick={handleAdd}                
              >
                Add
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-sm-3 d-flex justify-content-center align-items-end">
          <button
            className="btn btn-danger"
            id="divDel"
            onClick={() => handleDelete(id)}
          >
            Delete Div
          </button>
        </div>
      );
    }
  };

  return (
    <>
      <ModalConfirm
        show={confModalObj.show}
        title={confModalObj.title}
        message={confModalObj.message}
        onConfirm={confirmedDelete}  
        onCancel={canceledDelete}
      />    
      <ModalErrorMsg
        show={errModalObj.show}
        title={errModalObj.title}
        message={errModalObj.message}   
        onCancel={canceledModalErr}
      />
      <Tabs
        defaultActiveKey={defaultTabKey}
        id="div-tabs"
        className="mb-2"
        variant="pills"
        activeKey={tabKey}
        onSelect={handleTabSelect}        
      >
        {divs.map((div) => (
          <Tab
            key={div.id}
            eventKey={`div${div.id}`}
            title={div.tab_title}
            tabClassName={`${div.errClassName}`}
          >
            <div className="row g-3 mb-3">
              {/* AddOrDelButton includes a <div className="col-sm-3">...</div> */}
              <AddOrDelButton id={div.id} /> 
              <div className="col-sm-3">
                <label htmlFor={`inputDivName${div.id}`} className="form-label">
                  Div Name
                </label>
                <input
                  type="text"
                  className={`form-control ${div.name_err && "is-invalid"}`}
                  id={`inputDivName${div.id}`}
                  name="name"
                  maxLength={maxEventLength}
                  value={div.name}
                  onChange={handleInputChange(div.id)}
                  onBlur={handleBlur(div.id)}
                />
                <div className="text-danger">{div.name_err}</div>
              </div>
              <div className="col-sm-3">
                <label
                  htmlFor={`inputHdcp${div.id}`}
                  className="form-label"
                  title="Enter Hdcp % 0 for scratch"
                >
                  Hdcp % <span className="popup-help">&nbsp;?&nbsp;</span>
                </label>
                <input
                  type="number"
                  min={minHdcpPer}
                  max={maxHdcpPer}
                  step={10}
                  className={`form-control ${div.hdcp_err && "is-invalid"}`}
                  id={`inputHdcp${div.id}`}
                  name="hdcp"
                  value={div.hdcp}
                  onChange={handleInputChange(div.id)}
                  onBlur={handleBlur(div.id)}
                />
                <div className="text-danger">{div.hdcp_err}</div>                
              </div>
              <div className="col-sm-3">
                <label htmlFor={`inputHdcpFrom${div.id}`} className="form-label">
                  Hdcp From
                </label>
                <input
                  type="number"
                  min={minHdcpFrom}
                  max={maxHdcpFrom}
                  step={10}        
                  className={`form-control ${div.hdcp_from_err && "is-invalid"}`}
                  id={`inputHdcpFrom${div.id}`}
                  name="hdcp_from"
                  value={div.hdcp_from}                        
                  onChange={handleInputChange(div.id)}
                  onBlur={handleBlur(div.id)}
                />
                <div className="text-danger">{div.hdcp_from_err}</div>
              </div>
            </div>
            <div className="row g-3">
              {/* blank space under button */}
              <div className="col-sm-3"></div>
              <div className="col-sm-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`chkBoxIntHdcp${div.id}`}                        
                  name='item.int_hdcp'
                  checked={div.int_hdcp}
                  onChange={handleInputChange(div.id)}
                />
                <label htmlFor={`chkBoxIntHdcp${div.id}`} className="form-label">
                  &nbsp;Integer Hdcp
                </label>
              </div>
              <div className="col-sm-6">
                <label className="form-label">
                  Hdcp for &nbsp;
                </label>
                <input
                  type="radio"
                  className="form-check-input"
                  id={`radioHdcpForGame${div.id}`}
                  name={`hdcp_for${div.id}`}
                  value="game"
                  checked={div.hdcp_for === 'game'}
                  onChange={handleInputChange(div.id)}
                />
                <label htmlFor={`radioHdcpForGame${div.id}`} className="form-check-label">
                  &nbsp;Game &nbsp; 
                </label>
                <input
                  type="radio"
                  className="form-check-input"
                  id={`radioHdcpForSeries${div.id}`}
                  name={`hdcp_for${div.id}`}
                  value="series"
                  checked={div.hdcp_for !== 'game'}
                  onChange={handleInputChange(div.id)}
                />
                <label htmlFor={`radioHdcpForSeries${div.id}`} className="form-check-label">
                  &nbsp;Series
                </label>
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>
    </>
  )
}

export default OneToNDivs;