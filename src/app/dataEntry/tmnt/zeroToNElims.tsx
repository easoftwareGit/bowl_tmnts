import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { elimType, divType, squadType, AcdnErrType } from "./types";
import { initModalObj } from '@/components/modal/modalObjType';
import ModalConfirm, { delConfTitle } from '@/components/modal/confirmModal';
import { Tab, Tabs } from 'react-bootstrap';
import { getBrktOrElimName } from '@/lib/getName';
import EaCurrencyInput, { maxMoneyText, minFeeText } from '@/components/currency/eaCurrencyInput';
import { acdnErrClassName, getAcdnErrMsg, noAcdnErr, objErrClassName } from './errors';
import { maxGames, maxMoney, minFee, minGames } from '@/lib/validation';
import { initElim } from './initVals';

interface ChildProps {
  elims: elimType[];
  setElims: (elims: elimType[]) => void;
  divs: divType[];
  squads: squadType[];
  setAcdnErr: (objAcdnErr: AcdnErrType) => void;
}
interface NumberProps {
  elim: elimType;
  LabelText: string;
  property: string;
  value: number | string;
  title?: string;
}

const createElimTitle = "Create Eliminator";
const duplicateElimErrMsg = "Eliminator - Division, Start & Games already exists";
const defaultTabKey = "elim1";

const getElimErrMsg = (elim: elimType): string => {  
  if (elim.div_err) return elim.div_err;
  if (elim.start_err) return elim.start_err;
  if (elim.fee_err) return elim.fee_err;
  return '';
};

const getNextElimAcdnErrMsg = (
  updatedElim: elimType | null,
  brkts: elimType[]
): string => {
  let errMsg = "";
  let acdnErrMsg = "";
  let i = 0;
  let elim: elimType;
  while (i < brkts.length && !errMsg) {
    elim = brkts[i].id === updatedElim?.id ? updatedElim : brkts[i];
    errMsg = getElimErrMsg(elim);
    if (errMsg) {
      const errTabTitle =
        elim.id === "1"
          ? createElimTitle
          : `${elim.div_name}: ${elim.start}-${elim.start + elim.games - 1}`;
      acdnErrMsg = getAcdnErrMsg(errTabTitle, errMsg);
    }
    i++;
  }
  return acdnErrMsg;
};

export const validateElims = (
  elims: elimType[],
  setElims: Dispatch<SetStateAction<elimType[]>>,
  setAcdnErr: Dispatch<SetStateAction<AcdnErrType>>
): boolean => {
  
  let areElimsValid = true;
  let feeErr = '';
  let elimErrClassName = '';

  const setError = (elimName: string, errMsg: string) => {
    if (areElimsValid) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: getAcdnErrMsg(elimName, errMsg),
      });
    }
    areElimsValid = false;
    elimErrClassName = objErrClassName;
  };

  setElims(
    elims.map((elim) => {
      if (elim.id === "1") {
        return elim;
      } else {
        feeErr = '';
        elimErrClassName = '';
        const fee = Number(elim.fee);
        if (typeof fee !== "number") {
          feeErr = "Invalid Fee";
          setError(elim.div_name, feeErr);
        } else if (fee < minFee) {
          feeErr = "Fee cannot be less than " + minFeeText;
          setError(elim.div_name, feeErr);
        } else if (fee > maxMoney) {
          feeErr = "Fee cannot be greater than " + maxMoneyText;
          setError(elim.div_name, feeErr);
        }
        if (feeErr) {
          return {
            ...elim,
            fee_err: feeErr,
            errClassName: elimErrClassName,
          };
        }
        return elim;
      }
    })
  )
  if (areElimsValid) {
    setAcdnErr(noAcdnErr);
  }
  return areElimsValid;
}

const ZeroToNElims: React.FC<ChildProps> = ({
  elims,
  setElims,
  divs,
  squads,
  setAcdnErr
}) => {

  const [modalObj, setModalObj] = useState(initModalObj);
  const [tabKey, setTabKey] = useState(defaultTabKey);
  const [elimId, setElimId] = useState(1); // id # used in initElims in form.tsx

  const validNewElim = (newElim: elimType): boolean => {
    let isElimValid = true;
    let startErr = "";
    let divErr = "";
    let feeErr = "";
    let gamesErr = "";
    let elimErrClassName = "";

    const setError = (errMsg: string) => {
      if (isElimValid) {
        setAcdnErr({
          errClassName: acdnErrClassName,
          message: getAcdnErrMsg(createElimTitle, errMsg),
        })
      }
      isElimValid = false;
      elimErrClassName = objErrClassName;
    }

    if (newElim.div_name === "") {
      divErr = "Division is required";
      setError(divErr);
    }
    const fee = Number(newElim.fee);
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
    if (newElim.start < 1) {
      startErr = 'Start cannot be less than 1';
      setError(startErr);
    }
    if (newElim.games < 1) {
      gamesErr = 'Games cannot be less than 1';
      setError(gamesErr);
    }
    if (newElim.games > maxGames) {
      gamesErr = 'Games cannot be greater than ' + maxGames;
      setError(gamesErr);
    }
    if (newElim.start + newElim.games - 1 > squads[0].games) {
      startErr = 'Eliminator ends after last game'; 
      setError(startErr);
    }

    if (isElimValid) {
      // DO NOT check elim with ID 1
      const elimsToCheck = elims.filter(elim => elim.id !== "1")
      const duplicateElim = elimsToCheck.find(
        (elim) =>
          elim.start === newElim.start &&
          elim.games === newElim.games &&
          elim.div_id === newElim.div_id
      );
      if (duplicateElim) {
        startErr = duplicateElimErrMsg;
        setError(startErr);
      }
    }

    setElims(
      elims.map((elim) => {
        if (elim.id === newElim.id) {
          return {
            ...newElim,
            div_err: divErr,
            fee_err: feeErr,
            games_err: gamesErr,
            start_err: startErr,
            errClassName: elimErrClassName
          }
        }
        return elim
      })
    )

    if (isElimValid) {
      setAcdnErr(noAcdnErr)
    }
    return isElimValid;
  }

  const handleAdd = () => { 
    if (validNewElim(elims[0])) {
      const newElim = {
        ...elims[0],
        id: '' + (elimId + 1),
        div_id: elims[0].div_id,
        div_name: elims[0].div_name,
        start: elims[0].start,
        games: elims[0].games,
        fee: elims[0].fee,
      }
      setElimId(elimId + 1);
      const updatedElims = structuredClone(elims);
      updatedElims[0] = {
        ...initElim
      }
      updatedElims.push(newElim);
      setElims(updatedElims);
    }
  }

  const confirmedDelete = () => { 
    setModalObj(initModalObj)   // reset modal object (hides modal)
    const updatedData = elims.filter((elim) => elim.id !== modalObj.id);
    setElims(updatedData);
    setTabKey(defaultTabKey);   // refocus 1st pot

  }

  const canceledDelete = () => { 
    setModalObj(initModalObj); // reset modal object (hides modal)
  }

  const handleDelete = (id: string) => {
    if (id === "1") return;

    const brktToDel = elims.find((elim) => elim.id === id);
    if (!brktToDel) return;

    const toDelName = getBrktOrElimName(id, elims);
    setModalObj({
      show: true,
      title: delConfTitle,
      message: `Do you want to delete Eliminator: ${toDelName}?`,
      id: id,
    });
   }

  const handleInputChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => { 
    const { id, name, value } = e.target;      
    const ids = id.split("-");

    // only elim[0] has editable div_name, start and games
    let updatedElim: elimType;

    if (ids[0] === 'div_name') {
      updatedElim = {
        ...elims[0],
        div_name: ids[2],
        div_id: ids[1],
        div_err: "",
      }
      if (elims[0].div_err === duplicateElimErrMsg) {
        updatedElim.div_err = "";
      }
    } else {
      const valueNum = Number(value)
      const nameErr = name + "_err";
      updatedElim = {
        ...elims[0],
        [name]: valueNum,
        [nameErr]: "",
      }
    }
    updatedElim.errClassName = "";
    const acdnErrMsg = getNextElimAcdnErrMsg(updatedElim, elims);
    if (acdnErrMsg) {
      setAcdnErr({
        errClassName: acdnErrClassName,
        message: acdnErrMsg,
      });
    } else {
      setAcdnErr(noAcdnErr);
    }
    setElims(
      elims.map((elim) => {
        if (elim.id === updatedElim.id) {
          return updatedElim;
        }
        return elim
      })
    )
  }

  const handleAmountValueChange = (id: string, name: string) => (value: string | undefined): void => { 
    const nameErr = name + "_err";
    let rawValue = value === undefined ? 'undefined' : value;
    rawValue = (rawValue || ' ');

    setElims(
      elims.map((elim) => {
        if (elim.id === id) {
          if (rawValue && Number.isNaN(Number(rawValue))) {
            rawValue = ''
          } 
          let updatedElim: elimType;
          updatedElim = {
            ...elim,
            fee: rawValue,
            fee_err: ''
          }
          const acdnErrMsg = getNextElimAcdnErrMsg(updatedElim, elims);
          if (acdnErrMsg) {
            setAcdnErr({
              errClassName: acdnErrClassName,
              message: acdnErrMsg,
            });
          } else {
            setAcdnErr(noAcdnErr);
          }
          const errMsg = getElimErrMsg(updatedElim);
          if (errMsg) {
            return {
              ...updatedElim,
              errClassName: objErrClassName,
            };
          } else {
            return {
              ...updatedElim,
              errClassName: '',
            };
          }          
        }
        return elim;
      })
    )    
  }

  const handleBlur = (id: string) => (e: ChangeEvent<HTMLInputElement>) => { }

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setTabKey(key);
    }
  };

  const NumberEntry: React.FC<NumberProps> = ({ elim, LabelText, property, value }) => { 

    return (
      <div className="col-sm-2">
        <label htmlFor={`inputElim${property}${elim.id}`} className="form-label">
          {LabelText}
        </label>
        <input
          type="number"
          id={`inputElim${property}${elim.id}`}
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
        id='elims-tabs'
        className='mb-3'
        variant='pills'
        activeKey={tabKey}
        onSelect={handleTabSelect}
      >
        {elims.map((elim) => (
          <Tab
            key={elim.id}
            eventKey={`elim${elim.id}`}
            title={(elim.id === "1") ? createElimTitle : getBrktOrElimName(elim.id, elims)}
            tabClassName={`${elim.errClassName}`}
          >
            <div className="row g-3 mb-3">
              {elim.id === "1" ? (
                <>
                  <div className="col-sm-3">
                    <label className="form-label">Division</label>
                    {divs.map((div) => (
                      <div key={div.id} className="form-check text-break">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="elimsDivRadio"
                          id={`div_name-${div.id}-${div.name}-elims`}
                          checked={elims[0].div_name === div.name}
                          onChange={handleInputChange(elim.id)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`div_name-${div.id}-${div.name}-elims`}
                        >
                          {div.name}
                        </label>
                      </div>
                    ))}
                    <div className="text-danger">{elim.div_err}</div>
                  </div>
                  <div className="col-sm-2">
                    <label
                      htmlFor={`inputElimFee${elim.id}`}
                      className="form-label"
                    >
                      Fee
                    </label>
                    <EaCurrencyInput
                      id={`inputElimFee${elim.id}`}                        
                      name="fee"
                      className={`form-control ${elim.fee_err && "is-invalid"}`}
                      value={elim.fee}
                      onValueChange={handleAmountValueChange(elim.id, 'fee')}
                      onBlur={handleBlur(elim.id)}
                    />
                    <div className="text-danger">{elim.fee_err}</div>
                  </div>
                  <div className="col-sm-2">
                    <label htmlFor={`inputElimStart${elim.id}`} className="form-label">
                      Start
                    </label>
                    <input
                      type="number"
                      id={`inputElimStart${elim.id}`}
                      name="start"
                      placeholder="#"
                      step={1}
                      className={`form-control ${elim.start_err && "is-invalid"}`}
                      onChange={handleInputChange(elim.id)}
                      value={elim.start}
                    />
                    <div className="text-danger">{elim.start_err}</div>
                  </div>
                  <div className="col-sm-2">
                    <label htmlFor={`inputElimGames${elim.id}`} className="form-label">
                      Games
                    </label>
                    <input
                      type="number"
                      id={`inputElimGames${elim.id}`}
                      name="games"
                      placeholder="#"
                      step={1}
                      className={`form-control ${elim.games_err && "is-invalid"}`}
                      onChange={handleInputChange(elim.id)}
                      value={elim.games}
                    />
                    <div className="text-danger">{elim.games_err}</div>
                  </div>
                  <div className="col-sm-3 d-flex justify-content-center align-items-start">
                    <button className="btn btn-success mx-3" onClick={handleAdd}>
                      Add Eliminator
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-sm-3">
                    <label className="form-label">Division</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`elim_div-${elim.id}`}
                      name="div_name"
                      value={elim.div_name}
                      disabled
                    />
                  </div>
                  <div className="col-sm-2">
                    <label
                      htmlFor={`inputElimFee${elim.id}`}
                      className="form-label"
                    >
                      Fee
                    </label>
                    <EaCurrencyInput
                      id={`inputElimFee${elim.id}`}                        
                      name="fee"
                      className={`form-control ${elim.fee_err && "is-invalid"}`}
                      value={elim.fee}
                      onValueChange={handleAmountValueChange(elim.id, 'fee')}
                      onBlur={handleBlur(elim.id)}
                    />
                    <div className="text-danger">{elim.fee_err}</div>
                  </div>                  
                  <NumberEntry elim={elim} LabelText='Start' property='start' value={elim.start} />
                  <NumberEntry elim={elim} LabelText='Games' property='games' value={elim.games} />                  
                  <div className="col-sm-3 d-flex justify-content-center align-items-start">
                    <button
                      className="btn btn-danger mx-3"
                      onClick={() => handleDelete(elim.id)}
                    >
                      Delete Eliminator
                    </button>
                  </div>                
                </>
              ) }
            </div>
          </Tab>
        ))}        
      </Tabs>
    </>
  )
}

export default ZeroToNElims