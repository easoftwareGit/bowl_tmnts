import { acdnErrClassName, getAcdnErrMsg, noAcdnErr, objErrClassName } from "../errors";
import { divFeatErrType, featsParamsType } from "../types"
import { maxMoney, minFee } from "@/lib/validation";
import { maxMoneyText, minFeeText } from "@/components/currency/eaCurrencyInput";

const ValidateSingleEntry = (featsPrams: featsParamsType, divErrs: divFeatErrType[]): boolean => {
  const {divFeats, setDivFeats, seDivFeats, setSeDivFeats, setFeatAcdnErr } = featsPrams
  let areSeDivFeatsValid = true;

  const setError = (featName: string, errMsg: string) => {
    if (areSeDivFeatsValid) {
      setFeatAcdnErr({
        errClassName: acdnErrClassName,
        message: getAcdnErrMsg(featName, errMsg)
      })
    }
    areSeDivFeatsValid = false;    
  }

  setSeDivFeats(
    seDivFeats.map(seDivFeat => {
      let feeErr = ''
      let divFeatErrClassName = '';  
      if (!seDivFeat.fee.trim()) {
        feeErr = 'Fee is required';
        setError(seDivFeat.feat_name, feeErr);
      } else { 
        const feeNum = Number(seDivFeat.fee)
        if (typeof feeNum !== 'number') {
          feeErr = 'Invalid Fee';
          setError(seDivFeat.feat_name, feeErr);
        } else if (feeNum < minFee) {
          feeErr = 'Fee cannot be less than ' + minFeeText;
          setError(seDivFeat.feat_name, feeErr);
        } else if (feeNum > maxMoney) { 
          feeErr = 'Fee cannot be more than ' + maxMoneyText;
          setError(seDivFeat.feat_name, feeErr);
        }  
      }
      if (feeErr) {
        divFeatErrClassName = objErrClassName;
      }      
      divErrs.push({ sort_order: seDivFeat.sort_order, errClassName: divFeatErrClassName })
      return {
        ...seDivFeat,
        fee_err: feeErr
      }
    })
  )
  if (areSeDivFeatsValid) {
    setFeatAcdnErr(noAcdnErr)
  }    
  return areSeDivFeatsValid;
}

export default ValidateSingleEntry;