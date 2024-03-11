import { FEATURES, FEATURES_SORT_ORDER } from "@/lib/features";
import { acdnErrClassName, getAcdnErrMsg, objErrClassName } from "../errors";
import { divFeatErrType, featsParamsType, squadType } from "../types";
import { maxMoney, minFee, minGames } from "@/lib/validation";
import { maxMoneyText, minFeeText } from "@/components/currency/eaCurrencyInput";
import { SG_ERRORS, getStaringGames } from "./staringGames";
import { validateHeaderValue } from "http";

const ValidateEliminator = (featsParams: featsParamsType, squads: squadType[], divErrs: divFeatErrType[]): boolean => { 
  const { elim, setElim, featAcdnErr, setFeatAcdnErr } = featsParams;
  let areElimsValid = true;  
  let divFeatErrClassName = '';  

  const setError = (errMsg: string) => {
    if (areElimsValid && !featAcdnErr) {
      setFeatAcdnErr({
        errClassName: acdnErrClassName,
        message: getAcdnErrMsg(FEATURES.BRACKETS, errMsg)
      })
    }
    divFeatErrClassName = objErrClassName;
    areElimsValid = false;    
  }

  const squadGames: number[] = [];
  squads.forEach(squad => {
    squadGames.push(squad.games)
  });
  const maxSquadGames = Math.max(...squadGames);

  let feeNum = 0
  let feeErr = '';
  let gamesErr = '';
  let startErr = '';
  let elimGames = 0;

  if (!elim.fee.trim()) {
    feeErr = 'Fee is required';
    setError(feeErr);
  } else {
    feeNum = Number(elim.fee)
    if (typeof feeNum !== 'number') {
      feeErr = 'Invalid Fee';
      setError(feeErr);
    } else if (feeNum < minFee) {
      feeErr = 'Fee cannot be less than ' + minFeeText;
      setError(feeErr);
    } else if (feeNum > maxMoney) { 
      feeErr = 'Fee cannot be more than ' + maxMoneyText;
      setError(feeErr);
    }  
  }
  if (elim.games < minGames) {
    gamesErr = "Games must be more than " + (minGames - 1);
    setError(gamesErr)
  } else if (elim.games > maxSquadGames) {
    gamesErr = "Games must be less than " + (maxSquadGames + 1);
    setError(gamesErr)
  } 
  const startGamesInfo = getStaringGames(elim.start, elim.games, maxSquadGames);
  if (startGamesInfo.errorCode < 0) {
    switch (startGamesInfo.errorCode) {
      case SG_ERRORS.EMPTY_STRING:
        startErr = 'Starting is required';
        break;
      case SG_ERRORS.INVALID_FORMAT:
        startErr = "Game #'s seperated by commas";
        break;
      case SG_ERRORS.NON_NUMBER: 
        startErr = "Invalid number";
        break;
      case SG_ERRORS.INVALID_SQEQUENCE:
        startErr = "Not in assending order";
        break;
      case SG_ERRORS.INVALID_START:
        startErr = "Eliminator ending after last game";
        break;      
      default:
        startErr = "Other Error";
        break;
    }
  } 

  setElim({
    ...elim,
    fee_err: feeErr,
    games_err: gamesErr,
    start_err: startErr
  })

  if (divFeatErrClassName) {
    divErrs.push({ sort_order: FEATURES_SORT_ORDER.ELIMINATOR, errClassName: divFeatErrClassName })
  }

  return areElimsValid;
}

export default ValidateEliminator;