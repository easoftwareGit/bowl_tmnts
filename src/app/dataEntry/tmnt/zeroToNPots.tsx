import React, { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { divType, squadType, AcdnErrType, potType } from "./types";
import ModalConfirm, { delConfTitle } from "@/components/modal/confirmModal";
import { Tab, Tabs } from "react-bootstrap";
import { initModalObj } from "@/components/modal/modalObjType";
import EaCurrencyInput, { maxMoneyText, minFeeText } from "@/components/currency/eaCurrencyInput";
import { initPot } from "./initVals";
import {
  objErrClassName,
  acdnErrClassName,
  getAcdnErrMsg,
  noAcdnErr,
} from "./errors";
import { maxMoney, minFee } from "@/lib/validation";
import { getPotName } from "@/lib/getName";

interface ChildProps {
  pots: potType[];
  setPots: (pots: potType[]) => void;
  divs: divType[];
  squads: squadType[];
  setAcdnErr: (objAcdnErr: AcdnErrType) => void;
}

const createPotTitle = 'Create Pot';
const duplicatePotErrMsg = "Pot Type - Division already exists"
const defaultTabKey = "pot1";
const putCategories = [
  {
    id: 1,
    name: "Game",
    checked: false,
  },
  {
    id: 2,
    name: "Last Game",
    checked: false,
  },
  {
    id: 3,
    name: "Series",
    checked: false,
  },
];

const getPotErrMsg = (pot: potType): string => {
  if (pot.pot_type_err) return pot.pot_type_err;
  if (pot.div_err) return pot.div_err;
  if (pot.fee_err) return pot.fee_err;
  return '';
};

const getNextPotAcdnErrMsg = (updatedPot: potType | null, pots: potType[]): string => {
  let errMsg = '';
  let acdnErrMsg = '';
  let i = 0;
  let pot: potType;
  while (i < pots.length && !errMsg) {
    pot = (pots[i].id === updatedPot?.id) ? updatedPot : pots[i];    
    errMsg = getPotErrMsg(pot)
    if (errMsg) {      
      const errTabTitle = (pot.id === "1") ? createPotTitle : pot.pot_type + ' - ' + pot.div_name
      acdnErrMsg = getAcdnErrMsg(errTabTitle, errMsg)
    }
    i++;
  }
  return acdnErrMsg;
};

export const validatePots = (
  pots: potType[],
  setPots: Dispatch<SetStateAction<potType[]>>,  
  setAcdnErr: Dispatch<SetStateAction<AcdnErrType>>,
): boolean => {

  let arePotsValid = true;
  let feeErr = "";
  let potErrClassName = "";

  const setError = (potName: string, errMsg: string) => {
    if (arePotsValid) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: getAcdnErrMsg(potName, errMsg)
      });
    }
    arePotsValid = false;
    potErrClassName = objErrClassName;
  };

  setPots(
    pots.map((pot) => {
      feeErr = "";
      potErrClassName = "";      
      if (pot.id === "1") { // no error checking for 1st pot
        return pot;
      } else {
        const fee = Number(pot.fee)
        if (typeof fee !== "number") {
          feeErr = "Invalid Fee";
        } else if (fee < minFee) {
          feeErr = "Fee cannot be less than " + minFeeText;
        } else if (fee > maxMoney) {
          feeErr = "Fee cannot be greater than " + maxMoneyText;
        }
        if (feeErr) {
          setError(pot.pot_type + ' - ' + pot.div_name, feeErr);
        }
        return {
          ...pot,
          fee_err: feeErr,
          errClassName: potErrClassName,
        };
      }
    })
  )
  if (arePotsValid) {
    setAcdnErr(noAcdnErr);
  }
  return arePotsValid;
}

const ZeroToNPots: React.FC<ChildProps> = ({
  pots,
  setPots,
  divs,
  squads,
  setAcdnErr,
}) => {
  const [modalObj, setModalObj] = useState(initModalObj);  
  const [tabKey, setTabKey] = useState(defaultTabKey);  
  const [potId, setPotId] = useState(1); // id # used in initPots in form.tsx

  const validNewPot = (newPot: potType) => {
    let isPotValid = true;
    let potErr = "";
    let divErr = "";
    let feeErr = "";
    let potErrClassName = "";

    const setError = (errMsg: string) => {
      if (isPotValid) {
        setAcdnErr({
          errClassName: acdnErrClassName,
          message: getAcdnErrMsg(createPotTitle, errMsg),
        });
      }
      isPotValid = false;
      potErrClassName = objErrClassName;
    };

    if (newPot.pot_type === "") {
      potErr = "Pot Type is required";
      setError(potErr);
    }
    if (newPot.div_name === "") {
      divErr = "Division is required";
      setError(divErr);
    }
    const fee = Number(newPot.fee);
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

    if (isPotValid) {
      // DO NOT check pot with ID 1
      const potsToCheck = pots.filter(pot => pot.id !== "1")
      const duplicatePot = potsToCheck.find(
        (pot) =>
          pot.pot_type === newPot.pot_type &&
          pot.div_id === newPot.div_id
      );
      if (duplicatePot) {
        potErr = duplicatePotErrMsg;
        setError(potErr);
      }
    }

    setPots(
      pots.map((pot) => {
        if (pot.id === newPot.id) {
          return {
            ...newPot,
            pot_type_err: potErr,
            div_err: divErr,
            fee_err: feeErr,
            errClassName: potErrClassName,
          }
        }
        return pot;
      })
    )

    if (isPotValid) {
      setAcdnErr(noAcdnErr);
    }

    return isPotValid;
  };

  const handleAdd = () => {
    if (validNewPot(pots[0])) {
      const newPot: potType = {
        ...initPot,
        id: '' + (potId + 1),
        pot_type: pots[0].pot_type,
        div_id: pots[0].div_id,
        div_name: pots[0].div_name,        
        fee: pots[0].fee,
      };
      setPotId(potId + 1);
      const updatedPots = structuredClone(pots)
      updatedPots[0] = {
        ...initPot
      }
      updatedPots.push(newPot);
      setPots(updatedPots);
    }
  };

  const confirmedDelete = () => {
    setModalObj(initModalObj)   // reset modal object (hides modal)
    const updatedData = pots.filter((pot) => pot.id !== modalObj.id);
    setPots(updatedData);
    setTabKey(defaultTabKey);   // refocus 1st pot
  };

  const canceledDelete = () => {
    setModalObj(initModalObj); // reset modal object (hides modal)
  };

  const handleDelete = (id: string) => {
    if (id === "1") return;

    const potToDel = pots.find((pot) => pot.id === id);
    if (!potToDel) return;

    const toDelName = getPotName(potToDel, divs) // potToDel.pot_type + " - " + potToDel.div_name;
    setModalObj({
      show: true,
      title: delConfTitle,
      message: `Do you want to delete Pot: ${toDelName}?`,
      id: id,
    }); // deletion done in confirmedDelete
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target;
    const ids = id.split("-");
    const name = ids[0];
    const value = ids[2];
    
    // only pots[0] has editable pot_type and div_name
    let updatedPot: potType;
    if (name === "div_name") {
      updatedPot = {
        ...pots[0],
        div_name: value,
        div_id: ids[1],
        div_err: '',
      };

      if (pots[0].pot_type_err === duplicatePotErrMsg) {
        updatedPot.pot_type_err = ''
      }
    } else {
      // use [name] here, not pot_type, becuase typescript
      // does not like assigning pot_name: value, even
      updatedPot = {
        ...pots[0],
        [name]: value,
        pot_type_err: '',        
      };
    }  
    updatedPot.errClassName = '';
    const acdnErrMsg = getNextPotAcdnErrMsg(updatedPot, pots);
    if (acdnErrMsg) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: acdnErrMsg,
      });
    } else {
      setAcdnErr(noAcdnErr);
    }

    setPots(
      pots.map((pot) => {
        if (pot.id === updatedPot.id) {
          return updatedPot;
        }
        return pot;
      })
    )    
  };

  const handleAmountValueChange = (id: string) => (value: string | undefined): void => {
    let rawValue = value === undefined ? "undefined" : value;
    rawValue = rawValue || " ";

    setPots(
      pots.map((pot) => {
        if (pot.id === id) {
          if (rawValue && Number.isNaN(Number(rawValue))) {
            rawValue = "";
          }
          let updatedPot: potType;
          updatedPot = {
            ...pot,
            fee: rawValue,
            fee_err: '',
            errClassName: '',
          };
          const acdnErrMsg = getNextPotAcdnErrMsg(updatedPot, pots);
          if (acdnErrMsg) {
            setAcdnErr({
              errClassName: acdnErrClassName,
              message: acdnErrMsg,
            });
          } else {
            setAcdnErr(noAcdnErr);
          }
          return updatedPot;
        } else {
          return pot;
        }        
      })
    )    
  };

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setTabKey(key);
    }
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
        id="pots-tabs"
        className="mb-2"
        variant="pills"
        activeKey={tabKey}
        onSelect={handleTabSelect}
      >
        {pots.map((pot) => (
          <Tab
            key={pot.id}
            eventKey={`pot${pot.id}`}
            title={(pot.id === "1") ? createPotTitle : getPotName(pot, divs)}            
            tabClassName={`${pot.errClassName}`}
          >
            <div className="row g-3 mb-3">
              {pot.id === "1" ? (
                <>
                  <div className="col-sm-3">
                    <label className="form-label">Pot Type</label>
                    {putCategories.map((potCat) => (
                      <div key={potCat.id} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="potTypeRadio"
                          id={`pot_type-${potCat.id}-${potCat.name}`}
                          checked={pot.pot_type === potCat.name}
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`pot_type-${potCat.id}-${potCat.name}`}
                        >
                          {potCat.name}
                        </label>
                      </div>
                    ))}
                    <div className="text-danger">{pot.pot_type_err}</div>
                  </div>
                  <div className="col-sm-3">
                    <label className="form-label">Division</label>
                    {divs.map((div) => (
                      <div key={div.id} className="form-check text-break">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="potsDivRadio"
                          id={`div_name-${div.id}-${div.name}-pots`}
                          checked={pot.div_name === div.name}
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`div_name-${div.id}-${div.name}-pots`}
                        >
                          {div.name}
                        </label>
                      </div>
                    ))}
                    <div className="text-danger">{pot.div_err}</div>
                  </div>
                  <div className="col-sm-3">
                    <label htmlFor="inputPotFee" className="form-label">
                      Fee
                    </label>
                    <EaCurrencyInput
                      id="inputPotFee"
                      name="inputPotFee"
                      className={`form-control ${pot.fee_err && "is-invalid"}`}
                      value={pot.fee}
                      onValueChange={handleAmountValueChange("1")}
                    />
                    <div className="text-danger">{pot.fee_err}</div> 
                  </div>
                  <div className="col-sm-3 d-flex justify-content-center align-items-start">
                    <button
                      className="btn btn-success mx-3"
                      onClick={handleAdd}
                    >
                      Add Pot
                    </button>                    
                  </div>
                </>
              ) : (
                <>
                  <div className="col-sm-3">
                    <label className="form-label">Pot Type</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`pot_type-${pot.id}`}
                      name={`pot_type-${pot.id}`}
                      value={pot.pot_type}
                      disabled                      
                    />
                  </div>
                  <div className="col-sm-3">
                    <label className="form-label">Division</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`div_name-${pot.id}`}
                      name={`div_name-${pot.id}`}
                      value={pot.div_name}
                      disabled                      
                    />
                  </div>
                  <div className="col-sm-3">
                    <label className="form-label">Fee</label>
                    <EaCurrencyInput
                      id={`potFee-${pot.id}`}
                      name={`potFee-${pot.id}`}
                      className={`form-control ${pot.fee_err && "is-invalid"}`}
                      value={pot.fee}
                      onValueChange={handleAmountValueChange(pot.id)}
                    />
                    <div className="text-danger">{pot.fee_err}</div>
                  </div>
                  <div className="col-sm-3 d-flex justify-content-center align-items-start">
                    <button
                      className="btn btn-danger mx-3"
                      onClick={() => handleDelete(pot.id)}
                    >
                      Delete Pot
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

export default ZeroToNPots;
