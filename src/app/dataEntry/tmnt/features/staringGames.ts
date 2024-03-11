import { isValidStartingGames } from "@/lib/validation";

export const SG_ERRORS = {
  NONE: 0,
  EMPTY_STRING: -1,
  INVALID_FORMAT: -2,
  NON_NUMBER: -3,
  INVALID_SQEQUENCE: -4,
  INVALID_START: -5
}

export type startingGamesType = {
  errorCode: number,
  games: number[];
}

export const getStaringGames = (str: string, featGames: number, squadGames: number, ): startingGamesType => {
  const toReturn: startingGamesType = {
    errorCode: 0,
    games: [],
  }
  if (!str.trim()) {
    toReturn.errorCode = SG_ERRORS.EMPTY_STRING;
    return toReturn;
  }
  if (!isValidStartingGames(str)) {
    toReturn.errorCode = SG_ERRORS.INVALID_FORMAT;
    return toReturn;
  }
  const gameStrs = str.split(',');  

  let i = 0
  while (i < gameStrs.length) {
    const gameNum = Number(gameStrs[i]);
    if (typeof gameNum !== 'number') {
      toReturn.errorCode = SG_ERRORS.NON_NUMBER;
      return toReturn;        
    }
    toReturn.games.push(gameNum)
    i++
  }
  i = 0
  while (i < toReturn.games.length - 1) {
    if (toReturn.games[i] >= toReturn.games[i + 1]) {
      toReturn.errorCode = SG_ERRORS.INVALID_SQEQUENCE;
      return toReturn;              
    }
    i++;
  }
  i = 0
  while (i < toReturn.games.length) {
    if (toReturn.games[i] + (featGames - 1) > squadGames) {
      toReturn.errorCode = SG_ERRORS.INVALID_START;
      return toReturn;                    
    }
    i++;
  }


  return toReturn
}