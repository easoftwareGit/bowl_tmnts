import React, { useState, ChangeEvent } from "react";
import { divType, squadType, AcdnErrType, brktType } from "../../../lib/types/types";
import { initModalObj } from "@/components/modal/modalObjType";
import ModalConfirm, { delConfTitle } from "@/components/modal/confirmModal";
import { Tab, Tabs } from "react-bootstrap";
import EaCurrencyInput, {
  maxMoneyText,
  minFeeText,
} from "@/components/currency/eaCurrencyInput";
import { defaultBrktGames, defaultBrktPlayers, initBrkt } from "../../../lib/db/initVals";
import {  
  maxMoney,
  minFee,  
  zeroAmount,
} from "@/lib/validation";
import {
  acdnErrClassName,
  getAcdnErrMsg,
  noAcdnErr,
  objErrClassName,
} from "./errors";
import { getBrktOrElimName, getDivName } from "@/lib/getName";
import { currRexEx, localConfig } from "@/lib/currency/const";
import { formatValue2Dec } from "@/lib/currency/formatValue";
import { btDbUuid } from "@/lib/uuid";

interface ChildProps {
  brkts: brktType[];
  setBrkts: (brkts: brktType[]) => void;
  divs: divType[];
  squads: squadType[];
  setAcdnErr: (objAcdnErr: AcdnErrType) => void;
  setShowingModal: (showingModal: boolean) => void;
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

const getBrktErrMsg = (brkt: brktType): string => {
  if (!brkt) return "";
  if (brkt.div_err) return brkt.div_err;
  if (brkt.start_err) return brkt.start_err;
  if (brkt.fee_err) return brkt.fee_err;
  return "";
};

const getNextBrktAcdnErrMsg = (
  updatedBrkt: brktType | null,
  brkts: brktType[],
  divs: divType[]
): string => {
  let errMsg = "";
  let acdnErrMsg = "";
  let i = 0;
  let brkt: brktType;
  while (i < brkts.length && !errMsg) {
    brkt = brkts[i].id === updatedBrkt?.id ? updatedBrkt : brkts[i];
    errMsg = getBrktErrMsg(brkt);
    if (errMsg) {
      acdnErrMsg = getAcdnErrMsg(getBrktOrElimName(brkt, divs), errMsg);
    }
    i++;
  }
  return acdnErrMsg;
};

export const validateBrkts = (
  brkts: brktType[],
  setBrkts: (brkts: brktType[]) => void,
  divs: divType[],  
  setAcdnErr: (objAcdnErr: AcdnErrType) => void
): boolean => {
  let areBrktsValid = true;
  let feeErr = "";
  let brktErrClassName = "";  

  const newBrktErrMsg = getBrktErrMsg(brkts[0]);

  const setError = (brktName: string, errMsg: string) => {
    if (areBrktsValid && !newBrktErrMsg) {
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
      feeErr = "";
      brktErrClassName = "";
      const feeNum = Number(brkt.fee);
      if (typeof feeNum !== "number") {
        feeErr = "Invalid Fee";
      } else if (feeNum < minFee) {
        feeErr = "Fee cannot be less than " + minFeeText;
      } else if (feeNum > maxMoney) {
        feeErr = "Fee cannot be more than " + maxMoneyText;
      }
      if (feeErr) {
        setError(getBrktOrElimName(brkt, divs), feeErr);
      }
      return {
        ...brkt,
        fee_err: feeErr,
        errClassName: feeErr ? objErrClassName : "",
      };      
    })
  );
  if (areBrktsValid) {
    setAcdnErr(noAcdnErr);
  }
  return areBrktsValid;
};

const ZeroToNBrackets: React.FC<ChildProps> = ({
  brkts,
  setBrkts,
  divs,
  squads,
  setAcdnErr,
  setShowingModal,
}) => {

  const defaultTabKey = 'createBrkt';

  const [modalObj, setModalObj] = useState(initModalObj);
  const [tabKey, setTabKey] = useState(defaultTabKey);
  const [sortOrder, setSortOrder] = useState(1); 
  const [createBrkt, setCreateBrkt] = useState(initBrkt);

  const maxStartGame = squads[0].games - (defaultBrktGames - 1);

  const validNewBrkt = () => {
    const newBrkt = {...createBrkt};
    let isBrktValid = true;
    let startErr = "";
    let divErr = "";
    let feeErr = "";    

    if (newBrkt.start < 1) {
      startErr = "Start cannot be less than 1";
      isBrktValid = false;
    } else if (newBrkt.start > maxStartGame) {
      startErr = "Start cannot be more than " + maxStartGame;
      isBrktValid = false;
    }
    if (newBrkt.div_id === "") {
      divErr = "Division is required";
      isBrktValid = false;
    }
    const feeNum = Number(newBrkt.fee);
    if (typeof feeNum !== "number") {
      feeErr = "Invalid Fee";
      isBrktValid = false;
    } else if (feeNum < minFee) {
      feeErr = "Fee cannot be less than " + minFeeText;
      isBrktValid = false;
    } else if (feeNum > maxMoney) {
      feeErr = "Fee cannot be more than " + maxMoneyText;
      isBrktValid = false;
    }

    if (isBrktValid) {      
      const duplicateBrkt = brkts.find(
        (brkt) => brkt.start === newBrkt.start && brkt.div_id === newBrkt.div_id
      );
      if (duplicateBrkt) {
        startErr = duplicateBrktErrMsg;
        isBrktValid = false;
      }
    }

    setCreateBrkt({
      ...newBrkt,      
      start_err: startErr,
      div_err: divErr,
      fee_err: feeErr,
    })

    return isBrktValid;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (validNewBrkt()) {
      const newBrkt = {
        ...createBrkt,
        id: btDbUuid('brk'),
      };
      // add new brkt
      const mappedBrkts = brkts.map((brkt) => ({ ...brkt }));
      mappedBrkts.push(newBrkt);
      setBrkts(mappedBrkts);
      // update sort order for next new brkt
      setCreateBrkt({
        ...createBrkt,
        sort_order: sortOrder + 1,
      });            
      setSortOrder(sortOrder + 1);
    }
  };

  const confirmedDelete = () => {
    setShowingModal(false);
    setModalObj(initModalObj); // reset modal object (hides modal)
    const updatedData = brkts.filter((brkt) => brkt.id !== modalObj.id);
    setBrkts(updatedData);
    setTabKey(defaultTabKey); // refocus create brkt
  };

  const canceledDelete = () => {
    setShowingModal(false);
    setModalObj(initModalObj); // reset modal object (hides modal)
  };

  const handleDelete = (id: string) => {
    const brktToDel = brkts.find((brkt) => brkt.id === id);    
    if (!brktToDel) return;
    const toDelName = getBrktOrElimName(brktToDel, divs);
    setShowingModal(true);
    setModalObj({
      show: true,
      title: delConfTitle,
      message: `Do you want to delete Bracket: ${toDelName}?`,
      id: id,
    }); // deletion done in confirmedDelete
  };

  const handleCreateBrktInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = e.target;
    const ids = id.split("-");
    
    let updatedBrkt: brktType;
    if (name === 'brktsDivRadio') {
      const parentId = ids[1];      
      updatedBrkt = {
        ...createBrkt,        
        div_id: parentId, 
        div_err: "",
      };
      if (updatedBrkt.start_err = duplicateBrktErrMsg) {
        updatedBrkt.start_err = "";
      }
      if (createBrkt.div_err === duplicateBrktErrMsg) {
        updatedBrkt.div_err = "";
      }
    } else {
      updatedBrkt = {
        ...createBrkt,
        start: Number(value),
        start_err: "",
      };
    }
    setCreateBrkt(updatedBrkt);
  };

  const handlCreateBrktAmountValueChange = (id: string) => (value: string | undefined): void => {
    let rawValue = value === undefined ? "undefined" : value;
    rawValue = rawValue || " ";
    if (rawValue && Number.isNaN(Number(rawValue))) {
      rawValue = "";
    }
    let updatedBrkt: brktType = {
      ...createBrkt,
      fee: rawValue,
      fee_err: "",
      errClassName: "",
    };
    setCreateBrkt(updatedBrkt);
  };

  const handleCreateBrktBlur = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      const temp_brkt = updateFSA(createBrkt, value);
      setCreateBrkt(temp_brkt);
    }

    if (!value.trim()) {
      // if cleared entry
      const temp_brkt = updateFSA(createBrkt, value);
      temp_brkt.fee = "";
      temp_brkt.fee_err = "";
      setCreateBrkt(temp_brkt);
    }
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
              fee_err: "",
              errClassName: "",
            };
            const acdnErrMsg = getNextBrktAcdnErrMsg(updatedBrkt, brkts, divs);
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
              } 
            } else {
              return {
                ...updatedBrkt,
                errClassName: "",
              }
            }
          } else {
            return brkt;
          }
        })
      );
    };

  const updateFSA = (brkt: brktType, value: string): brktType => {
    const valNoSymb = value.replace(currRexEx, "");
    let formattedValue = value ? formatValue2Dec(valNoSymb, localConfig) : "";
    if (formattedValue === "NaN") {
      formattedValue = "";
    }
    if (typeof Number(formattedValue) !== "number") {
      formattedValue = "";
    }
    const valueNum = Number(formattedValue);
    if (valueNum < zeroAmount || valueNum > maxMoney) {
      formattedValue = "";
    }
    const temp_brkt = {
      ...brkt,
      fee: formattedValue,
      fee_err: "",
    };
    if (temp_brkt.fee) {
      const feeNum = Number(temp_brkt.fee);
      temp_brkt.first = formatValue2Dec((feeNum * 5).toString(), localConfig);
      temp_brkt.second = formatValue2Dec((feeNum * 2).toString(), localConfig);
      temp_brkt.admin = formatValue2Dec(feeNum.toString(), localConfig);
      temp_brkt.fsa = formatValue2Dec((feeNum * 8).toString(), localConfig);
    } else {
      temp_brkt.first = "";
      temp_brkt.second = "";
      temp_brkt.admin = "";
      temp_brkt.fsa = "";
    }
    return {
      ...temp_brkt,
    };
  };

  const handleBlur = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      setBrkts(
        brkts.map((brkt) => {
          if (brkt.id === id) {
            const temp_brkt = updateFSA(brkt, value);
            return {
              ...temp_brkt,
            };
          } else {
            return brkt;
          }
        })
      );
    }

    if (!value.trim()) {
      // if cleared entry
      setBrkts(
        brkts.map((brkt) => {
          if (brkt.id === id) {
            const temp_brkt = updateFSA(brkt, value);
            return {
              ...temp_brkt,
              fee: "",
              fee_err: "",
            };
          }
          return brkt;
        })
      );
    }
  };

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setTabKey(key);
    }
  };

  const NumberEntry: React.FC<NumberProps> = ({
    brkt,
    LabelText,
    property,
    value,
  }) => {
    return (
      <div className="col-sm-3">
        <label
          htmlFor={`inputBrkt${property}${brkt.id}`}
          className="form-label"
        >
          {LabelText}
        </label>
        <input
          type="number"
          id={`inputBrkt${property}${brkt.id}`}
          name={`${property}`}
          className="form-control"
          value={value}
          disabled
        />
      </div>
    );
  };

  const MoneyDisabled: React.FC<NumberProps> = ({
    brkt,
    LabelText,
    property,
    value,
    title = "",
  }) => {
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
          name={`${property}`}
          className="form-control"
          value={value}
          disabled
        />
      </div>
    );
  };

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
        <Tab
          key="createBrkt"
          eventKey="createBrkt"
          title={createBrktTitle}
        >
          <div className="row g-3 mb-3">
            <div className="col-sm-2">
              <label className="form-label">
                Division
              </label>
              {divs.map((div) => (
                <div key={div.id} className="form-check text-break">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="brktsDivRadio"
                    id={`div_name-${div.id}-${div.div_name}-brkts`}
                    checked={createBrkt.div_id === div.id}
                    onChange={handleCreateBrktInputChange}
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
                {createBrkt.div_err}
              </div>
            </div>
            <div className="col-sm-8">
              <div className="row mb-3">
                <div className="col-sm-3">
                  <label
                    htmlFor={`inputBrktFee${createBrkt.id}`}
                    className="form-label"
                  >
                    Fee
                  </label>
                  <EaCurrencyInput
                    id={`inputBrktFee${createBrkt.id}`}
                    name="fee"
                    className={`form-control ${
                      createBrkt.fee_err && "is-invalid"
                    }`}
                    value={createBrkt.fee}
                    onValueChange={handlCreateBrktAmountValueChange(createBrkt.id)}
                    onBlur={handleCreateBrktBlur(createBrkt.id)}                            
                  />
                  <div
                    className="text-danger"
                    data-testid="dangerCreateBrktFee"
                  >
                    {createBrkt.fee_err}
                  </div>
                </div>
                <div className="col-sm-3">
                  <label
                    htmlFor={`inputBrktStart${createBrkt.id}`}
                    className="form-label"
                  >
                    Start
                  </label>
                  <input
                    type="number"
                    id={`inputBrktStart${createBrkt.id}`}
                    name="start"
                    placeholder="#"
                    step={1}
                    className={`form-control ${
                      createBrkt.start_err && "is-invalid"
                    }`}
                    onChange={handleCreateBrktInputChange}
                    value={createBrkt.start}
                  />
                  <div
                    className="text-danger"
                    data-testid="dangerCreateBrktStart"
                  >
                    {createBrkt.start_err}
                  </div>
                </div>
                <NumberEntry
                  brkt={createBrkt}
                  LabelText="Games"
                  property="games"
                  value={createBrkt.games}
                />
                <NumberEntry
                  brkt={createBrkt}
                  LabelText="Players"
                  property="players"
                  value={createBrkt.players}
                />
              </div>
              <div className="row">
                <MoneyDisabled
                  brkt={createBrkt}
                  LabelText="First"
                  property="first"
                  value={createBrkt.first}
                />
                <MoneyDisabled
                  brkt={createBrkt}
                  LabelText="Second"
                  property="second"
                  value={createBrkt.second}
                />
                <MoneyDisabled
                  brkt={createBrkt}
                  LabelText="Admin"
                  property="admin"
                  value={createBrkt.admin}
                />
                <MoneyDisabled
                  brkt={createBrkt}
                  LabelText="F+S+A"
                  property="fsa"
                  value={createBrkt.fsa}
                  title="First + Second + Admin must equal Fee * Players"
                />
              </div>
            </div>
            <div className="col-sm-2 d-flex justify-content-center align-items-start">
              <button
                className="btn btn-success mx-3"
                onClick={handleAdd}
              >
                Add Bracket
              </button>
            </div>
          </div>
        </Tab>
        {brkts.map((brkt) => (
          <Tab
            key={brkt.id}
            eventKey={`brkt${brkt.id}`}
            title={getBrktOrElimName(brkt, divs)}
            tabClassName={`${brkt.errClassName}`}
          >
            <div className="row g-3 mb-3">                
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
                  name="div_name"                  
                  value={getDivName(brkt.div_id, divs)}
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
                      name="fee"
                      className={`form-control ${
                        brkt.fee_err && "is-invalid"
                      }`}
                      value={brkt.fee}
                      onValueChange={handleAmountValueChange(brkt.id)}
                      onBlur={handleBlur(brkt.id)}
                    />
                    <div
                      className="text-danger"                            
                      data-testid={`dangerBrktFee${brkt.sort_order}`}
                    >
                      {brkt.fee_err}
                    </div>
                  </div>
                  <NumberEntry
                    brkt={brkt}
                    LabelText="Start"
                    property="start"
                    value={brkt.start}
                  />
                  <NumberEntry
                    brkt={brkt}
                    LabelText="Games"
                    property="games"
                    value={brkt.games}
                  />
                  <NumberEntry
                    brkt={brkt}
                    LabelText="Players"
                    property="players"
                    value={brkt.players}
                  />
                </div>
                <div className="row">
                  <MoneyDisabled
                    brkt={brkt}
                    LabelText="First"
                    property="first"
                    value={brkt.first}
                  />
                  <MoneyDisabled
                    brkt={brkt}
                    LabelText="Second"
                    property="second"
                    value={brkt.second}
                  />
                  <MoneyDisabled
                    brkt={brkt}
                    LabelText="Admin"
                    property="admin"
                    value={brkt.admin}
                  />
                  <MoneyDisabled
                    brkt={brkt}
                    LabelText="F+S+A"
                    property="fsa"
                    value={brkt.fsa}
                    title="First + Second + Admin must equal Fee * Players"
                  />
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
            </div>
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

export default ZeroToNBrackets;
