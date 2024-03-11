import { eventType, divType, squadType, AcdnErrType, elimType, brktType } from "./types";
export const objErrClassName = 'objError';
export const acdnErrClassName = 'acdnError';

export const getAcdnErrMsg = (objName: string, objErrMsg: string): string => {
  return `: Error in ${objName} - ${objErrMsg}`
}
/**
 * checks if the name property of an object has been used in another object
 * 
 * @param arrOfObj - array of objects to check for duplicate names
 * @param obj - object to check if contains a duplicate name
 * @returns {*} boolean: true if a duplicate name
 */
export const isDuplicateName = (
  arrOfObj: eventType[] | divType[] | squadType[],
  obj: eventType | divType | squadType
): boolean => {
  let i = 0;
  while (arrOfObj[i].id < obj.id && i < arrOfObj.length) {
    if (arrOfObj[i].name.trim().toLowerCase() === obj.name.trim().toLowerCase()) {
      return true;
    }
    i++;
  }
  return false;
}

export const getElimErrMsg = (elim: elimType): string => {
  if (elim.fee_err) return elim.fee_err;
  if (elim.games_err) return elim.games_err;
  if (elim.start_err) return elim.start_err;
  return '';
}

export const getBrktErrMsg = (brkt: brktType): string => {
  if (brkt.fee_err) return brkt.fee_err;
  if (brkt.first_err) return brkt.first_err;
  if (brkt.fsa_err) return brkt.fsa_err;
  if (brkt.games_err) return brkt.games_err;
  if (brkt.players_err) return brkt.players_err;
  if (brkt.second_err) return brkt.second_err;
  if (brkt.start_err) return brkt.start_err;
  return '';
}

/**
 * checks if the date and time properties of an object has been used in another object
 * 
 * @param arrOfObj - array of objects to check for duplicate date & time
 * @param obj - object to check if contains a duplicate date & time
 * @returns {*} boolean: true if a duplicate date & time
 */
export const isDuplicateDateTime = (
  arrOfObj: squadType[],
  obj: squadType
): boolean => {
  let i = 0;
  while (arrOfObj[i].id < obj.id && i < arrOfObj.length) {
    if (arrOfObj[i].squad_date === obj.squad_date && arrOfObj[i].squad_time === obj.squad_time) {
      return true
    }
    i++
  }
  return false;
}

export const noAcdnErr: AcdnErrType = {
  errClassName: '',
  message: ''
}