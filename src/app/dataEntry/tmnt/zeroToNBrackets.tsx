import React, { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { divType, squadType, AcdnErrType, brktType } from "./types";
import { initModalObj } from "@/components/modal/modalObjType";
import ModalConfirm, { delConfTitle } from "@/components/modal/confirmModal";
import { Tab, Tabs } from "react-bootstrap";
import EaCurrencyInput, { maxMoneyText, minFeeText } from "@/components/currency/eaCurrencyInput";
import { defaultBrktGames, defaultBrktPlayers, initBrkt } from "./initVals";
import { maxGames, maxMoney, minFee, minGames, zeroAmount } from "@/lib/validation";
import { acdnErrClassName, getAcdnErrMsg, noAcdnErr, objErrClassName } from "./errors";
import { getBrktOrElimName } from "@/lib/getName";
import { currRexEx, localConfig } from "@/lib/currency/const";
import { formatValue2Dec } from "@/lib/currency/formatValue";

interface ChildProps {
  brkts: brktType[];
  setBrkts: (brkts: brktType[]) => void;
  divs: divType[];
  squads: squadType[];
  setAcdnErr: (objAcdnErr: AcdnErrType) => void;
}
interface FeeProps {
  brkt: brktType;
}
interface NumberProps {
  brkt: brktType;
  LabelText: string;
  property: string;
  value: number | string;
  title?: string;
}

const createBrktTitle = "Create Bracket";
const duplicateBrktErrMsg = "Bracket - Division & Start already exists";
const defaultTabKey = "brkt1";

const getBrktErrMsg = (brkt: brktType): string => {  
  if (brkt.div_err) return brkt.div_err;
  if (brkt.start_err) return brkt.start_err;
  if (brkt.fee_err) return brkt.fee_err;
  return '';
};

const getNextBrktAcdnErrMsg = (
  updatedBrkt: brktType | null,
  brkts: brktType[]
): string => {
  let errMsg = "";
  let acdnErrMsg = "";
  let i = 0;
  let brkt: brktType;
  while (i < brkts.length && !errMsg) {
    brkt = brkts[i].id === updatedBrkt?.id ? updatedBrkt : brkts[i];
    errMsg = getBrktErrMsg(brkt);
    if (errMsg) {
      const errTabTitle =
        // brkt.sort_order === 1
        //   ? createBrktTitle
        //   : `${brkt.div_name}: ${brkt.start}-${brkt.start + brkt.games - 1}`;
        brkt.sort_order === 1
          ? createBrktTitle
          : getBrktOrElimName(brkt.div_id, brkts) 
      acdnErrMsg = getAcdnErrMsg(errTabTitle, errMsg);
    }
    i++;
  }
  return acdnErrMsg;
};

export const validateBrkts = (
  brkts: brktType[],
  setBrkts: Dispatch<SetStateAction<brktType[]>>,
  setAcdnErr: Dispatch<SetStateAction<AcdnErrType>>
): boolean => { 

  let areBrktsValid = true;
  let feeErr = "";
  let brktErrClassName = "";

  const setError = (brktName: string, errMsg: string) => {
    if (areBrktsValid) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: getAcdnErrMsg(brktName, errMsg),
      });
    }
    areBrktsValid = false;
    brktErrClassName = objErrClassName;
  };
  
  setBrkts(
    brkts.map((brkt) => {
      if (brkt.id === '1') {  // no error checking for first bracket
        return brkt;
      } else {
        feeErr = "";
        brktErrClassName = "";
        const fee = Number(brkt.fee);
        if (typeof fee !== 'number') {
          feeErr = 'Invalid Fee';          
        } else if (fee < minFee) {
          feeErr = "Fee cannot be less than " + minFeeText;
        } else if (fee > maxMoney) {
          feeErr = "Fee cannot be greater than " + maxMoneyText;
        }   
        if (feeErr) {
          setError(getBrktOrElimName(brkt.id, brkts), feeErr);
        }
        return {
          ...brkt,
          fee_err: feeErr,
          errClassName: feeErr ? objErrClassName : '',
        }
      }
    })
  )
  if (areBrktsValid) {
    setAcdnErr(noAcdnErr)
  }
  return areBrktsValid;
};

const ZeroToNBrackets: React.FC<ChildProps> = ({
  brkts,
  setBrkts,
  divs,
  squads,
  setAcdnErr,
}) => {
  const [modalObj, setModalObj] = useState(initModalObj);
  const [tabKey, setTabKey] = useState(defaultTabKey);
  const [brktId, setBrktId] = useState(1); // id # used in initBrkts in form.tsx

  const maxStartGame = squads[0].games - (defaultBrktGames - 1);

  const validNewBrkt = (newBrkt: brktType) => {
    let isBrktValid = true;
    let startErr = "";
    let divErr = "";
    let feeErr = "";
    let brktErrClassName = "";

    const setError = (errMsg: string) => {
      if (isBrktValid) {
        setAcdnErr({
          errClassName: acdnErrClassName,
          message: getAcdnErrMsg(createBrktTitle, errMsg),
        });
      }
      isBrktValid = false;
      brktErrClassName = objErrClassName;
    };

    if (newBrkt.start < 1) {
      startErr = 'Start cannot be less than 1';
      setError(startErr);
    } else if (newBrkt.start > maxStartGame) {
      startErr = 'Start cannot be greater than ' + maxStartGame;
      setError(startErr);
    }
    if (newBrkt.div_name === "") {
      divErr = "Division is required";
      setError(divErr);
    }
    const fee = Number(newBrkt.fee);
    if (typeof fee !== "number") {
      feeErr = "Invalid Fee";
      setError(feeErr);
    } else if (fee < minFee) {
      feeErr = "Fee cannot be less than " + minFeeText;
      setError(feeErr);
    } else if (fee > maxMoney) {
      feeErr = "Fee cannot be greater than " + maxMoneyText;
      setError(feeErr);
    }

    if (isBrktValid) {
      // DO NOT check brkt with ID 1
      const brktsToCheck = brkts.filter(brkt => brkt.id !== "1")
      const duplicateBrkt = brktsToCheck.find(
        (brkt) =>
          brkt.start === newBrkt.start &&
          brkt.div_id === newBrkt.div_id
      );
      if (duplicateBrkt) {
        startErr = duplicateBrktErrMsg;
        setError(startErr);
      }
    }

    setBrkts(
      brkts.map((brkt) => {
        if (brkt.id === newBrkt.id) {
          return {
            ...newBrkt,
            start_err: startErr,
            div_err: divErr,
            fee_err: feeErr,
            errClassName: brktErrClassName,
          }
        }
        return brkt;
      })
    )

    if (isBrktValid) {
      setAcdnErr(noAcdnErr);
    }

    return isBrktValid;
  };

  const handleAdd = () => {
    if (validNewBrkt(brkts[0])) {
      const newBrkt = {
        ...brkts[0],
        id: '' + (brktId + 1),
        start: brkts[0].start,
        div_id: brkts[0].div_id,
        div_name: brkts[0].div_name,
        fee: brkts[0].fee,
        sort_order: brktId + 1,
      };
      setBrktId(brktId + 1);
      const updatedBrkts = structuredClone(brkts);
      updatedBrkts[0] = {
        ...initBrkt
      }
      updatedBrkts.push(newBrkt);
      setBrkts(updatedBrkts);
    }
  };

  const confirmedDelete = () => { 
    setModalObj(initModalObj)   // reset modal object (hides modal)
    const updatedData = brkts.filter((brkt) => brkt.id !== modalObj.id);
    setBrkts(updatedData);
    setTabKey(defaultTabKey);   // refocus 1st pot
  }; 

  const canceledDelete = () => {
    setModalObj(initModalObj); // reset modal object (hides modal)
  };

  const handleDelete = (id: string) => { 
    const brktToDel = brkts.find((brkt) => brkt.id === id);
    // if did not find brkt OR first brkt (1st brkt used for creating new brkts)
    if (!brktToDel || brktToDel.sort_order === 1) return;

    const toDelName = getBrktOrElimName(id, brkts);
    setModalObj({
      show: true,
      title: delConfTitle,
      message: `Do you want to delete Bracket: ${toDelName}?`,
      id: id,
    });
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;      
    const ids = id.split("-");
    const name = ids[0];    
    
    // only brkts[0] has editable div_name and start
    let updatedBrkt: brktType;

    if (name === 'div_name') { 
      updatedBrkt = {
        ...brkts[0],
        div_name: ids[2],
        div_id: ids[1],
        div_err: "",
      }
      if (brkts[0].div_err === duplicateBrktErrMsg) {
        updatedBrkt.div_err = "";
      }
    } else {
      updatedBrkt = {
        ...brkts[0],
        start: Number(value),
        start_err: "",
      }
    }
    updatedBrkt.errClassName = "";
    const acdnErrMsg = getNextBrktAcdnErrMsg(updatedBrkt, brkts);
    if (acdnErrMsg) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: acdnErrMsg,
      });
    } else {
      setAcdnErr(noAcdnErr);
    }
    setBrkts(
      brkts.map((brkt) => {
        if (brkt.id === updatedBrkt.id) {
          return updatedBrkt;
        }
        return brkt
      })
    )
  };

  const handleAmountValueChange = (id: string) => (value: string | undefined): void => {
    let rawValue = value === undefined ? "undefined" : value;
    rawValue = rawValue || " ";

    setBrkts(
      brkts.map((brkt) => {
        if (brkt.id === id) {
          if (rawValue && Number.isNaN(Number(rawValue))) {
            rawValue = "";
          }
          let updatedBrkt: brktType;
          updatedBrkt = {
            ...brkt,
            fee: rawValue,
            fee_err: '',
            errClassName: '',
          };
          const acdnErrMsg = getNextBrktAcdnErrMsg(updatedBrkt, brkts);
          if (acdnErrMsg) {
            setAcdnErr({
              errClassName: acdnErrClassName,
              message: acdnErrMsg,
            });
          } else {
            setAcdnErr(noAcdnErr);
          }
          const errMsg = getBrktErrMsg(updatedBrkt);
          if (errMsg) {
            return {
              ...updatedBrkt,
              errClassName: objErrClassName,
            };
          } else {
            return {
              ...updatedBrkt,
              errClassName: '',
            };
          }          
        } else {
          return brkt;
        }        
      })
    )    
  };

  const updateFSA = (brkt: brktType, value: string): brktType => {
    const valNoSymb = value.replace(currRexEx, '')    
    let formattedValue = (value) ? formatValue2Dec(valNoSymb, localConfig) : '';
    if (formattedValue === 'NaN') {
      formattedValue = ''
    }
    if (typeof (Number(formattedValue)) !== 'number') {
      formattedValue = ''
    }
    const valueNum = Number(formattedValue)
    if (valueNum < zeroAmount || valueNum > maxMoney) {
      formattedValue = ''
    }
    const temp_brkt = {
      ...brkt,
      fee: formattedValue,
      fee_err: '',         
    }
    if (temp_brkt.fee) {
      const feeNum = Number(temp_brkt.fee)
      temp_brkt.first = formatValue2Dec((feeNum * 5).toString(), localConfig);
      temp_brkt.second = formatValue2Dec((feeNum * 2).toString(), localConfig);
      temp_brkt.admin = formatValue2Dec(feeNum.toString(), localConfig);
      temp_brkt.fsa = formatValue2Dec((feeNum * 8).toString(), localConfig);
    } else {
      temp_brkt.first = '';
      temp_brkt.second = '';
      temp_brkt.admin = '';
      temp_brkt.fsa = ''; 
    }
    return {
      ...temp_brkt
    }
  } 

  const handleBlur = (id: string) => (e: ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target;
    if (value) {
      setBrkts(
        brkts.map((brkt) => {
          if (brkt.id === id) {
            const temp_brkt = updateFSA(brkt, value)
            return {
              ...temp_brkt
            }
          } else {
            return brkt;
          }
        })
      )
    }
    
    if (!value.trim()) {  // if cleared entry
      setBrkts(
        brkts.map((brkt) => {
          if (brkt.id === id) {
            const temp_brkt = updateFSA(brkt, value)
            return {
              ...temp_brkt,
              fee: '',
              fee_err: '',              
            }
          }
          return brkt
        })
      )
    }
  }

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setTabKey(key);
    }
  };

  const NumberEntry: React.FC<NumberProps> = ({ brkt, LabelText, property, value }) => { 

    return (
      <div className="col-sm-3">
        <label htmlFor={`inputBrkt${property}${brkt.id}`} className="form-label">
          {LabelText}
        </label>
        <input
          type="number"
          id={`inputBrkt${property}${brkt.id}`}
          data-testid={`inputBrkt_${property}${brkt.sort_order}`}
          name={`${property}`}
          className="form-control"
          value={value}          
          disabled          
        />        
      </div>
    )
  }

  const MoneyDisabled: React.FC<NumberProps> = ({ brkt, LabelText, property, value, title="" }) => { 
    
    return (
      <div className="col-sm-3">
        {title === "" ? (
          <label htmlFor={`${property}${brkt.id}`} className="form-label">
            {LabelText}
          </label>
        ) : (
          <label
            htmlFor={`${property}${brkt.id}`}
            className="form-label"
            title={title}
          >
            {LabelText} <span className="popup-help">&nbsp;?&nbsp;</span>               
          </label>  
        )}
        <EaCurrencyInput          
          id={`${property}${brkt.id}`}
          data-testid={`moneyBrkt_${property}${brkt.sort_order}`}
          name={`${property}`}
          className="form-control"
          value={value}          
          disabled          
        />        
      </div>
    )
  }

  return (
    <>
      <ModalConfirm
        show={modalObj.show}
        title={modalObj.title}
        message={modalObj.message}
        onConfirm={confirmedDelete}
        onCancel={canceledDelete}
      />
      <Tabs
        defaultActiveKey={defaultTabKey}
        id="brkts-tab"
        className="mb-2"
        variant="pills"
        activeKey={tabKey}
        onSelect={handleTabSelect}
      >
        {brkts.map((brkt) => (
          <Tab
            key={brkt.id}
            eventKey={`brkt${brkt.id}`}
            title={(brkt.sort_order === 1) ? createBrktTitle : getBrktOrElimName(brkt.id, brkts)}            
            tabClassName={`${brkt.errClassName}`}
          >
            <div className="row g-3 mb-3">
              {brkt.sort_order === 1 ? (
                <>                
                  <div className="col-sm-2">
                    <label
                      className="form-label"
                      data-testid="brktDivRadioLabel"
                    >
                      Division
                    </label>
                    {divs.map((div) => (
                      <div key={div.id} className="form-check text-break">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="brktsDivRadio"
                          id={`div_name-${div.id}-${div.div_name}-brkts`}                          
                          checked={brkts[0].div_name === div.div_name}
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`div_name-${div.id}-${div.div_name}-brkts`}
                        >
                          {div.div_name}
                        </label>
                      </div>
                    ))}
                    <div
                      className="text-danger"
                      data-testid="dangerBrktDivRadio"
                    >
                      {brkt.div_err}
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="row mb-3">                      
                      <div className="col-sm-3">
                        <label
                          htmlFor={`inputBrktFee${brkt.id}`}
                          className="form-label"
                          data-testid="createBrktFeeLabel"
                        >
                          Fee
                        </label>
                        <EaCurrencyInput
                          id={`inputBrktFee${brkt.id}`}                        
                          data-testid="createBrktFeeInput"
                          name="fee"
                          className={`form-control ${brkt.fee_err && "is-invalid"}`}
                          value={brkt.fee}
                          onValueChange={handleAmountValueChange(brkt.id)}
                          onBlur={handleBlur(brkt.id)}
                        />
                        <div
                          className="text-danger"
                          data-testid="dangerCreateBrktFee"
                        >
                          {brkt.fee_err}
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <label
                          htmlFor={`inputBrktStart${brkt.id}`}
                          className="form-label"
                          data-testid="createBrktStartLabel"
                        >
                          Start
                        </label>
                        <input
                          type="number"
                          id={`inputBrktStart${brkt.id}`}                          
                          data-testid="createBrktStartInput"
                          name="start"
                          placeholder="#"
                          step={1}
                          className={`form-control ${brkt.start_err && "is-invalid"}`}
                          onChange={handleInputChange}
                          value={brkt.start}
                        />
                        <div
                          className="text-danger"
                          data-testid="dangerCreateBrktStart"
                        >
                          {brkt.start_err}
                        </div>
                      </div>
                      <NumberEntry brkt={brkt} LabelText="Games" property="games" value={brkt.games}/>
                      <NumberEntry brkt={brkt} LabelText="Players" property="players" value={brkt.players}/>
                    </div>
                    <div className="row">                      
                      <MoneyDisabled brkt={brkt} LabelText="First" property="first" value={brkt.first}/>
                      <MoneyDisabled brkt={brkt} LabelText="Second" property="second" value={brkt.second}/>
                      <MoneyDisabled brkt={brkt} LabelText="Admin" property="admin" value={brkt.admin}/>
                      <MoneyDisabled brkt={brkt} LabelText="F+S+A" property="fsa" value={brkt.fsa} title="First + Second + Admin must equal Fee * Players"/>
                    </div>
                  </div>
                  <div className="col-sm-2 d-flex justify-content-center align-items-start">
                    <button className="btn btn-success mx-3" onClick={handleAdd}>
                      Add Bracket
                    </button>
                  </div>                
                </>
              ) : (
                <>              
                  <div className="col-sm-2">
                    <label
                      className="form-label"
                      htmlFor={`brkt_div-${brkt.id}`}
                    >
                      Division
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`brkt_div-${brkt.id}`}
                      data-testid={`brktDiv${brkt.sort_order}`}
                      name="div_name"
                      value={brkt.div_name}
                      disabled
                    />
                  </div>
                  <div className="col-sm-8">
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <label
                          htmlFor={`inputBrktFee${brkt.id}`}
                          className="form-label"
                        >
                          Fee
                        </label>
                        <EaCurrencyInput
                          id={`inputBrktFee${brkt.id}`}        
                          data-testid={`brktFee${brkt.sort_order}`}  
                          name="fee"
                          className={`form-control ${brkt.fee_err && "is-invalid"}`}
                          value={brkt.fee}
                          onValueChange={handleAmountValueChange(brkt.id)}
                          onBlur={handleBlur(brkt.id)}
                        />
                        <div className="text-danger">{brkt.fee_err}</div>
                      </div> 
                      <NumberEntry brkt={brkt} LabelText="Start" property="start" value={brkt.start}/>
                      <NumberEntry brkt={brkt} LabelText="Games" property="games" value={brkt.games}/>
                      <NumberEntry brkt={brkt} LabelText="Players" property="players" value={brkt.players}/>                        
                    </div>
                    <div className="row">
                      <MoneyDisabled brkt={brkt} LabelText="First" property="first" value={brkt.first}/>
                      <MoneyDisabled brkt={brkt} LabelText="Second" property="second" value={brkt.second}/>
                      <MoneyDisabled brkt={brkt} LabelText="Admin" property="admin" value={brkt.admin}/>
                      <MoneyDisabled brkt={brkt} LabelText="F+S+A" property="fsa" value={brkt.fsa} title="First + Second + Admin must equal Fee * Players"/>
                    </div>
                  </div>
                  <div className="col-sm-2 d-flex justify-content-center align-items-start">
                    <button
                      className="btn btn-danger mx-3"
                      onClick={() => handleDelete(brkt.id)}
                    >
                      Delete Bracket
                    </button>
                  </div>                
                </>
              )}
            </div>
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

export default ZeroToNBrackets;
