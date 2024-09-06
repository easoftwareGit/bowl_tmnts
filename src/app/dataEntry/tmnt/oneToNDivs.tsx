import React, { useState, ChangeEvent } from "react";
import { divType, AcdnErrType, potType, brktType, elimType, HdcpForTypes } from "../../../lib/types/types";
import { defaultHdcpFrom, initDiv } from "../../../lib/db/initVals";
import { Tabs, Tab } from "react-bootstrap";
import ModalConfirm, { delConfTitle } from "@/components/modal/confirmModal";
import ModalErrorMsg, { cannotDeleteTitle } from "@/components/modal/errorModal";
import { initModalObj } from "@/components/modal/modalObjType";
import { objErrClassName, acdnErrClassName, getAcdnErrMsg, noAcdnErr, isDuplicateDivName } from "./errors";
import { maxEventLength, minHdcpPer, maxHdcpPer, minHdcpFrom, maxHdcpFrom } from "@/lib/validation";
import { EaPercentInput } from "@/components/currency/eaCurrencyInput";

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
  sortOrder: number;
}

const defaultTabKey = 'div1'

const getDivErrMsg = (div: divType): string => {
  if (div.div_name_err) return div.div_name_err;
  if (div.hdcp_per_err) return div.hdcp_per_err;
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
      acdnErrMsg = getAcdnErrMsg(div.div_name, errMsg)
    }              
    i++;
  }
  return acdnErrMsg;
}

export const validateDivs = (
  divs: divType[],
  setDivs: (divs: divType[]) => void,
  setAcdnErr: (objAcdnErr: AcdnErrType) => void
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
      if (!div.div_name.trim()) {
        nameErr = 'Div Name is required';
        setError("Divisions", nameErr);
      } else if (isDuplicateDivName(divs, div)) {
        nameErr = `"${div.div_name}" has already been used.`;
        setError(div.div_name, nameErr);
      } else {
        nameErr = '';
      }
      const hdcpPer = Number(div.hdcp_per);
      if (hdcpPer < minHdcpPer) {
        hdcpErr = 'Hdcp % must be more than ' + (minHdcpPer - 1)
        setError(div.div_name, hdcpErr);
      } else if (hdcpPer > maxHdcpPer) {
        hdcpErr = 'Hdcp % must be less than ' + (maxHdcpPer + 1)
        setError(div.div_name, hdcpErr);
      } else {
        hdcpErr = ''
      }
      const hdcpFrom = Number(div.hdcp_from)
      if (hdcpFrom < minHdcpFrom) {
        hdcpFromErr = 'Hdcp From must be more than ' + (minHdcpFrom - 1)
        setError(div.div_name, hdcpFromErr);
      } else if (div.hdcp_from > maxHdcpFrom) {
        hdcpFromErr = 'Hdcp From must be less than ' + (maxHdcpFrom + 1)
        setError(div.div_name, hdcpFromErr);
      } else {
        hdcpFromErr = ''
      }
      return {
        ...div,
        div_name_err: nameErr,
        hdcp_per_err: hdcpErr,
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
      div_name: "Division " + (divId + 1),
      tab_title: "Division " + (divId + 1),
      sort_order: divId + 1,
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
    return brkts.some((brkt) => brkt.div_id === divToDel.id)
  }
  const divHasElims = (divToDel: divType): boolean => {
    return elims.some((elim) => elim.div_id === divToDel.id)
  }

  const handleDelete = (id: string) => {
    const divToDel = divs.find((div) => div.id === id);
    // if did not find div OR first div (must have at least 1 event)
    if (!divToDel || divToDel.sort_order === 1) return;

    const toDelName = divToDel.div_name;
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
          if (name === 'div_name') {
            updatedDiv = {
              ...div,
              div_name: value,
              tab_title: value,
              div_name_err: ''
            }
          } else if (name === "item.int_hdcp") {
            updatedDiv = {
              ...div,
              int_hdcp: checked,
            };
          } else if (name.startsWith('divHdcpRadio')) {
            const hdcpFor: HdcpForTypes = (value === "Game") ? "Game" : "Series"
            updatedDiv = {
              ...div,
              hdcp_for: hdcpFor,
            };
          } else if (name === 'hdcp_per_str') {
            let rawValue = value === undefined ? 'undefined' : value;
            rawValue = (rawValue || ' ')
            if (rawValue && Number.isNaN(Number(rawValue))) {
              rawValue = '';
            }
            const hdcpPerNum =Number(rawValue) / 100;
            updatedDiv = {
              ...div,
              hdcp_per_str: rawValue,
              hdcp_per: Number(rawValue) / 100
            }
            // do check AFETR setting updatedDiv above
            // need to clear hdcp_from_err because if hdcp is 0,
            // hdcp_from spineditis disabled, so user can't clear error
            
            // if (hdcpPerNum === 0 && (div.hdcp_from < minHdcpFrom || div.hdcp_from > maxHdcpFrom)) {
            //   updatedDiv = {
            //     ...updatedDiv,
            //     hdcp_from: defaultHdcpFrom,
            //     hdcp_from_err: ''
            //   }
            // }


            // const hdcpPerNum = Number(value);
            // updatedDiv = {
            //   ...div,
            //   hdcp_per: hdcpPerNum,
            //   hdcp_per_err: ''
            // }
            // // do check AFETR setting updatedDiv above
            // // need to clear hdcp_from_err because if hdcp is 0,
            // // hdcp_from spineditis disabled, so user can't clear error
            // if (hdcpPerNum === 0 && (div.hdcp_from < minHdcpFrom || div.hdcp_from > maxHdcpFrom)) {
            //   updatedDiv = {
            //     ...updatedDiv,
            //     hdcp_from: defaultHdcpFrom,
            //     hdcp_from_err: ''
            //   }
            // }

          } else { // hdcp_from
            const hdcpFromNum = Number(value);
            updatedDiv = {
              ...div,
              hdcp_from: hdcpFromNum,
              hdcp_from_err: ''
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
            } else if (name === 'hdcp_per') {
              return {
                ...div,
                hdcp_per: 0,
                hdcp_per_err: '',
              }
            } else if (name === 'hdcp_from') {
              return {
                ...div,
                hdcp_from: 0,
                hdcp_from_err: '',
              }
            } else if (name.startsWith('divHdcpRadio')) {              
              return {
                ...div,
                hdcp_for: 'Game',
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

  const AddOrDelButton: React.FC<AddOrDelButtonProps> = ({ id, sortOrder }) => {
    if (sortOrder === 1) {
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
              <AddOrDelButton id={div.id} sortOrder={div.sort_order} /> 
              <div className="col-sm-3">
                <label htmlFor={`inputDivName${div.id}`} className="form-label">
                  Div Name
                </label>
                <input
                  type="text"
                  className={`form-control ${div.div_name_err && "is-invalid"}`}
                  id={`inputDivName${div.id}`}                  
                  name="div_name"
                  maxLength={maxEventLength}
                  value={div.div_name}
                  onChange={handleInputChange(div.id)}
                  onBlur={handleBlur(div.id)}
                />
                <div
                  className="text-danger"
                  data-testid="dangerDivName"
                >
                  {div.div_name_err}
                </div>
              </div>
              <div className="col-sm-3">
                <label
                  htmlFor={`inputHdcpPer${div.id}`}
                  className="form-label"
                  title="Enter Hdcp % 0 for scratch"
                >
                  Hdcp % <span className="popup-help">&nbsp;?&nbsp;</span>
                </label>
                <EaPercentInput
                  id={`inputHdcpPer${div.id}`}
                  name="hdcp_per_str"
                  className={`form-control ${div.hdcp_per_err && "is-invalid"}`}
                  value={div.hdcp_per_str}
                  onChange={handleInputChange(div.id)}
                  onBlur={handleBlur(div.id)}
                />
                {/* <input
                  type="number"
                  min={minHdcpPer}
                  max={maxHdcpPer}
                  step={10}
                  className={`form-control ${div.hdcp_per_err && "is-invalid"}`}
                  id={`inputHdcpPer${div.id}`}                  
                  name="hdcp_per"
                  value={div.hdcp_per}
                  onChange={handleInputChange(div.id)}
                  onBlur={handleBlur(div.id)}
                /> */}
                <div
                  className="text-danger"
                  data-testid="dangerHdcp"
                >
                  {div.hdcp_per_err}
                </div>
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
                  disabled={div.hdcp_per === 0}
                />
                <div
                  className="text-danger"
                  data-testid="dangerHdcpFrom"
                >
                  {div.hdcp_from_err}
                </div>
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
                  disabled={div.hdcp_per === 0}
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
                  name={`divHdcpRadio${div.sort_order}`}
                  value="Game"
                  checked={div.hdcp_for === 'Game'}
                  onChange={handleInputChange(div.id)}
                  disabled={div.hdcp_per === 0}
                />
                <label htmlFor={`radioHdcpForGame${div.id}`} className="form-check-label">
                  &nbsp;Game &nbsp; 
                </label>
                <input
                  type="radio"
                  className="form-check-input"
                  id={`radioHdcpForSeries${div.id}`}
                  name={`divHdcpRadio${div.sort_order}`}
                  value="Series"
                  checked={div.hdcp_for !== 'Game'}
                  onChange={handleInputChange(div.id)}
                  disabled={div.hdcp_per === 0}
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