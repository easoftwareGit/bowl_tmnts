import { FEATURES } from "@/lib/features";
import { getAcdnErrMsg } from "../errors";
import { featsParamsType, seDivFeatType } from "../types"

export const getNextFeatAcdnErrMsg = (
  featsParams: featsParamsType,
  updatedSeDivFeat: seDivFeatType | undefined
): string => {

  const { divFeats, setDivFeats, seDivFeats, setSeDivFeats, elim, setElim, brkt, setBrkt, setFeatAcdnErr } = featsParams;

  const getElimErrMsg = (): string => {
    if (elim.fee_err) return elim.fee_err;
    if (elim.games_err) return elim.games_err;
    if (elim.start_err) return elim.start_err;
    return '';
  }

  const getBrktErrMsg = (): string => {
    if (brkt.fee_err) return brkt.fee_err;
    if (brkt.first_err) return brkt.first_err;
    if (brkt.fsa_err) return brkt.fsa_err;
    if (brkt.games_err) return brkt.games_err;
    if (brkt.players_err) return brkt.players_err;
    if (brkt.second_err) return brkt.second_err;
    if (brkt.start_err) return brkt.start_err;
    return '';
  }

  // setup
  let errMsg = '';
  let acdnErrMsg = '';

  // single entry errors
  let i = 0;
  let seDivFeat: seDivFeatType;
  while (i < seDivFeats.length) {
    seDivFeat = (updatedSeDivFeat && seDivFeats[i].sort_order === updatedSeDivFeat?.sort_order)
      ? updatedSeDivFeat : seDivFeats[i]
    errMsg = seDivFeat.fee_err;
    if (errMsg) {
      acdnErrMsg = getAcdnErrMsg(seDivFeat.feat_name, errMsg)
      break;
    }
    i++;
  }
  if (acdnErrMsg) return acdnErrMsg

  // eliminator errors
  errMsg = getElimErrMsg();
  if (errMsg) {
    acdnErrMsg = getAcdnErrMsg(FEATURES.ELIMINATOR, errMsg)
  }
  if (acdnErrMsg) return acdnErrMsg

  // bracket errors
  errMsg = getBrktErrMsg();
  if (errMsg) {
    acdnErrMsg = getAcdnErrMsg(FEATURES.BRACKETS, errMsg)
  }    
  return acdnErrMsg
}