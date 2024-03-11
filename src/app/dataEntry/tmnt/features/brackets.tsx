import React, { ChangeEvent, useRef } from 'react';
import { brktType, featsParamsType } from '../types';
import EaCurrencyInput from '@/components/currency/eaCurrencyInput';
import { maxMoney, zeroAmount } from "@/lib/validation";
import { formatValue2Dec } from '@/lib/currency/formatValue';
import { localConfig, currRexEx } from "@/lib/currency/const";
import { IMaskInput } from 'react-imask';
import { getNextFeatAcdnErrMsg } from './featErrors';
import { acdnErrClassName, noAcdnErr } from '../errors';
import { FEATURES } from '@/lib/features';

interface ChildProps {
  // brkt: brktType;
  // setBrkt: (brkt: brktType) => void;  
  featsParams: featsParamsType,
}

const amountFields = [
  "fee",
  "first",
  "second",
  "admin",
];

const Brackets: React.FC<ChildProps> = ({  
  // brkt,
  // setBrkt
  featsParams
}) => {
  const { divFeats, setDivFeats, seDivFeats, setSeDivFeats, elim, setElim, brkt, setBrkt, setFeatAcdnErr } = featsParams;
  // use ref to get access to internal "masked = ref.current.maskRef"
  const ref = useRef(null);
  const inputRef = useRef(null);

  const handleBrktFeeAmountChange = (value: string | undefined): void => { 
    let rawValue = value === undefined ? 'undefined' : value;
    rawValue = (rawValue || ' ');
    if (rawValue && Number.isNaN(Number(rawValue))) {
      rawValue = ''
    } 
    setBrkt({
      ...brkt,
      fee: rawValue,
      fee_err: ''
    })
    const acdnErrMsg = getNextFeatAcdnErrMsg(featsParams, undefined)
    if (acdnErrMsg) {
      setFeatAcdnErr({
        errClassName: acdnErrClassName,
        message: acdnErrMsg
      })          
    } else {
      setFeatAcdnErr(noAcdnErr);
    }
    setDivFeats(
      divFeats.map((dfItem) => {
        if (dfItem.feat_name === FEATURES.BRACKETS) {
          return {
            ...dfItem,
            errClassName: ''
          }
        } else {
          return dfItem
        }
      })
    )
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target;
    const nameErr = name + "_err";

    setBrkt({
      ...brkt,
      [name]: value,
      [nameErr]: '',
    })
    const acdnErrMsg = getNextFeatAcdnErrMsg(featsParams, undefined)
    if (acdnErrMsg) {
      setFeatAcdnErr({
        errClassName: acdnErrClassName,
        message: acdnErrMsg
      })          
    } else {
      setFeatAcdnErr(noAcdnErr);
    }
    setDivFeats(
      divFeats.map((dfItem) => {
        if (dfItem.feat_name === FEATURES.BRACKETS) {
          return {
            ...dfItem,
            errClassName: ''
          }
        } else {
          return dfItem
        }
      })
    )    
  }  

  const calcBracketBreakdown = () => {

    const valNoSymb = brkt.fee.replace(currRexEx, '')
    let formattedValue = (brkt.fee) ? formatValue2Dec(valNoSymb, localConfig) : '';

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

    const feeNum = Number(formattedValue)
    if (feeNum > 0) {
      setBrkt({
        ...brkt,
        fee: formattedValue,
        fee_err: '',
        first: formatValue2Dec((feeNum * 5).toString(), localConfig),
        first_err: '',
        second: formatValue2Dec((feeNum * 2).toString(), localConfig),
        second_err: '',
        admin: formatValue2Dec(feeNum.toString(), localConfig),
        admin_err: '',
        fsa: formatValue2Dec((feeNum * 8).toString(), localConfig),
        fsa_valid: 'is-valid',
        fsa_err: '',
      })      
    } else {
      setBrkt({
        ...brkt,
        // fee: value,
        // fee_err: '',
        first: '',
        first_err: '',
        second: '',
        second_err: '',
        admin: '',
        admin_err: '',
        fsa: '',
        fsa_valid: 'is-valid',
        fsa_err: '',
      })      
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => { 
    calcBracketBreakdown()
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => { 
    if (e.key === 'Enter') {
      calcBracketBreakdown()
    }
  }

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-3">
          <label htmlFor="inputBrktFee" className="form-label">
            Fee
          </label>
          <EaCurrencyInput
            id="inputEliminputBrktFeeFee"
            name="fee"                              
            className={`form-control ${brkt.fee_err && "is-invalid"}`}
            onValueChange={handleBrktFeeAmountChange}
            onBlur={handleBlur}
            onKeyDown={handleOnKeyDown}
            value={brkt.fee}
          />
          <div className="text-danger">{brkt.fee_err}</div>
        </div>
        <div className="col-sm-3">
          <label
            htmlFor="inputBrktStart"
            className="form-label"
            title='The game(s) the brackets will start, seperated by commas: 1,4'
          >
            Starting <span className="popup-help">&nbsp;?&nbsp;</span>
          </label>
          <IMaskInput
            type="text"
            ref={ref}
            inputRef={inputRef}
            unmask={true}            
            mask={/\d(\d)?(,(\d(\d)?)?)*$/}
            id="inputBrktStart"
            name="start"
            className={`form-control ${brkt.start_err && "is-invalid"}`}
            placeholder="#,#"
            onChange={handleInputChange}
            value={brkt.start}
          />
          {/* <input
            type="text"
            id="inputBrktStart"
            name="start"            
            placeholder="#,#"                              
            className={`form-control ${brkt.start_err && "is-invalid"}`}                              
            onChange={handleInputChange}
            value={brkt.start}
          /> */}
          <div className="text-danger">{brkt.start_err}</div>
        </div>

        <div className="col-sm-3">
          <label htmlFor="inputBrktGames" className="form-label">
            Games
          </label>
          <input
            type="number"
            id="inputBrktGames"
            name="games"                              
            // placeholder="3"
            // min={1}
            // max={maxGames}
            // step={1}                              
            // className={`form-control ${brkt.games_err && "is-invalid"}`}
            // onChange={handleInputChange}
            value={brkt.games}
            className="form-control"
            disabled={true}
          />
          <div className="text-danger">{brkt.games_err}</div> 
        </div>
        <div className="col-sm-3">
          <label htmlFor="inputBrktPlayers" className="form-label">
            Players
          </label>
          <input
            type="number"
            id="inputBrktPlayers"
            name="games"                              
            // placeholder="8"
            // min={1}
            // max={maxGames}
            // step={1}                              
            // className={`form-control ${brkt.players_err && "is-invalid"}`}
            // onChange={handleInputChange}
            value={brkt.players}
            className="form-control"
            disabled={true}
          />
          <div className="text-danger">{brkt.players_err}</div> 
        </div>        
      </div>
      <div className="row">
        <div className="col-sm-3">
          <label htmlFor="inputBrktFirst" className="form-label">
            First
          </label>
          <EaCurrencyInput
            id="inputBrktFirst"
            name="first"
            // className={`form-control ${brkt.first_err && "is-invalid"}`}            
            // onValueChange={handleBrktFeeAmountChange('first')}
            value={brkt.first}
            className="form-control"
            disabled={true}
          />
          <div className="text-danger">{brkt.first_err}</div>
        </div>
        <div className="col-sm-3">
          <label htmlFor="inputBrktSecond" className="form-label">
            Second
          </label>
          <EaCurrencyInput
            id="inputBrktSecond"
            name="second"
            // className={`form-control ${brkt.second_err && "is-invalid"}`}
            // onValueChange={handleBrktFeeAmountChange('second')}
            value={brkt.second}
            className="form-control"
            disabled={true}
          />
          <div className="text-danger">{brkt.second_err}</div>
        </div>
        <div className="col-sm-3">
          <label htmlFor="inputBrktAdmin" className="form-label">
            Admin
          </label>
          <EaCurrencyInput
            id="inputBrktAdmin"
            name="admin"
            // className={`form-control ${brkt.admin_err && "is-invalid"}`}
            // onValueChange={handleBrktFeeAmountChange('admin')}
            className="form-control"
            disabled={true}
            value={brkt.admin}
          />
          <div className="text-danger">{brkt.admin_err}</div>
        </div>
        <div className="col-sm-3">
          <label
            htmlFor="inputBrktFsa"
            className="form-label"
            title="First + Second + Admin must equal Fee * Players"
          >
            F+S+A <span className="popup-help">&nbsp;?&nbsp;</span>
          </label>
          <EaCurrencyInput
            id="inputBrktFsa"
            name="fsa"            
            value={brkt.fsa}
            className={`form-control ${brkt.fsa_valid}`}
            disabled={true}
          />
          <div className="text-danger">{brkt.fsa_err}</div>
        </div>
      </div>
    </>                          
  )
}

export default Brackets