import { acdnErrClassName, getAcdnErrMsg, objErrClassName } from "../errors";
import { divFeatErrType, featsParamsType, squadType } from "../types";
import { maxMoney, minFee, minGames, zeroAmount } from "@/lib/validation";
import { maxMoneyText, minFeeText, minMoneyText } from "@/components/currency/eaCurrencyInput";
import { FEATURES, FEATURES_SORT_ORDER } from "@/lib/features";
import { SG_ERRORS, getStaringGames } from "./staringGames";

// validating brackets clears error highlight for Pots

const minPlayers = 8;
const maxPlayers = 8;

const ValidateBrackets = (featsParams: featsParamsType, squads: squadType[], divErrs: divFeatErrType[]): boolean => { 
  const { brkt, setBrkt, featAcdnErr, setFeatAcdnErr } = featsParams;
  let areBrktsValid = true;  
  let divFeatErrClassName = '';  

  const setError = (errMsg: string) => {
    if (areBrktsValid && !featAcdnErr) {
      setFeatAcdnErr({
        errClassName: acdnErrClassName,
        message: getAcdnErrMsg(FEATURES.BRACKETS, errMsg)
      })
    }
    divFeatErrClassName = objErrClassName;
    areBrktsValid = false;    
  }

  const squadGames: number[] = [];
  squads.forEach(squad => {
    squadGames.push(squad.games)
  });
  const maxSquadGames = Math.max(...squadGames);
  let feeNum = 0
  let feeErr = '';
  let gamesErr = '';
  let playersErr = '';
  let firstErr = '';
  let secondErr = '';
  let adminErr = '';
  let fsaErr = '';
  let startErr = '';  
      
  if (!brkt.fee.trim()) {
    feeErr = 'Fee is required';
    setError(feeErr);
  } else {
    feeNum = Number(brkt.fee)
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
  if (brkt.games < minGames) {
    gamesErr = "Games must be more than " + (minGames - 1);
    setError(gamesErr)
  } else if (brkt.games > maxSquadGames) {
    gamesErr = "Games must be less than " + (maxSquadGames + 1);
    setError(gamesErr)
  } 
  if (brkt.players < minPlayers) {
    playersErr = "Players must be more than " + (minPlayers - 1);
    setError(playersErr)
  } else if (brkt.players > maxPlayers) {
    playersErr = "Players must be less than " + (minPlayers - 1);
    setError(playersErr)
  }
  const first = Number(brkt.first)
  if (typeof first !== 'number') {
    firstErr = 'Invalid First'
    setError(firstErr)
  } else if (first < zeroAmount) {
    firstErr = 'First cannot be less than ' + minMoneyText;
    setError(firstErr)
  } else if (first > maxMoney) {        
    firstErr = 'First cannot be more than ' + maxMoneyText;
    setError(firstErr);
  } 
  const second = Number(brkt.second)
  if (typeof second !== 'number') {
    secondErr = 'Invalid Second'
    setError(secondErr)
  } else if (second < zeroAmount) {
    secondErr = 'Second cannot be less than ' + minMoneyText;
    setError(secondErr)
  } else if (second > maxMoney) {        
    secondErr = 'Second cannot be more than ' + maxMoneyText;
    setError(secondErr);
  } 
  const admin = Number(brkt.admin)
  if (typeof admin !== 'number') {
    adminErr = 'Invalid Admin'
    setError(adminErr)
  } else if (admin < zeroAmount) {
    adminErr = 'Admin cannot be less than ' + minMoneyText;
    setError(adminErr)
  } else if (admin > maxMoney) {        
    adminErr = 'Admin cannot be more than ' + maxMoneyText;
    setError(adminErr);
  } 
  const fsa = Number(brkt.fsa)
  if (typeof fsa !== 'number') {
    fsaErr = 'Invalid FSA'
    setError(fsaErr)
  } else if (!feeErr && !gamesErr && !playersErr && (feeNum * brkt.players !== fsa)) {
    fsaErr = 'Fee * Players ≠ FSA'
    setError(fsaErr)
  }
  const startGamesInfo = getStaringGames(brkt.start, brkt.games, maxSquadGames);
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
        startErr = "Brackets ending after last game";
        break;      
      default:
        startErr = "Other Error";
        break;
    }
  } 
  setBrkt({
    ...brkt,    
    fee_err: feeErr,
    start_err: startErr,
    games_err: gamesErr,
    players_err: playersErr,
    first_err: firstErr,
    second_err: secondErr,
    admin_err: adminErr,
    fsa_err: fsaErr
  })
  
  if (divFeatErrClassName) {
    divErrs.push({ sort_order: FEATURES_SORT_ORDER.BRACKETS, errClassName: divFeatErrClassName })    
  }

  return areBrktsValid;
}

export default ValidateBrackets;