import React from 'react'
import { divFeatType, featsParamsType, seDivFeatType } from '../types';
import EaCurrencyInput from '@/components/currency/eaCurrencyInput';
import { minFee } from '@/lib/validation';
import { getNextFeatAcdnErrMsg } from './featErrors';
import { acdnErrClassName, noAcdnErr } from '../errors';

interface ChildProps {
  divFeat: divFeatType;
  featsParams: featsParamsType;
}

const SingleEntry: React.FC<ChildProps> = ({
  divFeat,
  featsParams
}) => {    
  const { divFeats, setDivFeats, seDivFeats, setSeDivFeats, elim, setElim, brkt, setBrkt, setFeatAcdnErr } = featsParams;
  const seDivFeat = seDivFeats.find(((seDivFeat) => seDivFeat.sort_order === divFeat.sort_order))

  const handleSeFeeValueChange = (feat_name: string) => (value: string | undefined): void => { 
    let rawValue = value === undefined ? 'undefined' : value;
    rawValue = (rawValue || ' ');
    if (rawValue && Number.isNaN(Number(rawValue))) {
      rawValue = ''
    }     
    setSeDivFeats(
      seDivFeats.map((item) => {
        if (item.feat_name === feat_name) {
          let updated: seDivFeatType;
          updated = {
            ...item,
            fee: rawValue,
            fee_err: ''
          }          
          const acdnErrMsg = getNextFeatAcdnErrMsg(featsParams, updated)
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
              if (dfItem.feat_name === feat_name) {
                return {
                  ...dfItem,
                  errClassName: ''
                }
              } else {
                return dfItem;
              }
            })
          )
          return updated;
        } else {
          return item;
        }
      })
    )
  }

  return (
    <div className="col-sm-3"> 
      <label htmlFor={`input${divFeat.sort_order}Fee`} className="form-label">
        Fee
      </label>
      <EaCurrencyInput
        id={`input${divFeat.sort_order}Fee`}
        name="fee"
        className={`form-control ${seDivFeat?.fee_err && "is-invalid"}`}
        onValueChange={handleSeFeeValueChange(divFeat.feat_name)}
        value={seDivFeat?.fee}  
        min={minFee}
      />
      <div className="text-danger">{seDivFeat?.fee_err}</div>
    </div>
  )
}

export default SingleEntry