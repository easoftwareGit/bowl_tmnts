import { deleteTmnt, postTmnt, putTmnt } from "@/lib/db/tmnts/tmntsAxios";
import { saveAllTmntDataType, ioDataErrorsType, saveTypes, tmntType } from "@/lib/types/types";
import { tmntSaveEvents } from "./saveTmntEvents";
import { tmntSaveDivs } from "./saveTmntDivs";
import { tmntSaveSquads } from "./saveTmntSquads";
import { tmntSaveLanes } from "./saveTmntLanes";
import { tmntSavePots } from "./saveTmntPots";
import { tmntSaveBrkts } from "./saveTmntBrkts";
import { tmntSaveElims } from "./saveTmntElims";
import { deleteAllTmntEvents } from "@/lib/db/events/eventsAxios";
import { deleteAllTmntDivs } from "@/lib/db/divs/divsAxios";
import { deleteAllTmntSquads } from "@/lib/db/squads/squadsAxios";
import { deleteAllTmntLanes } from "@/lib/db/lanes/lanesAxios";
import { deleteAllTmntPots } from "@/lib/db/pots/potsAxios";
import { deleteAllTmntBrkts } from "@/lib/db/brkts/brktsAxios";

/**
 * saves a tournament
 * 
 * @param {tmntType} origTmnt - original tmnt
 * @param {tmntType} tmnt - tmnt to save
 * @param {saveTypes} saveType - save type, 'CREATE' or 'UPDATE'
 * @returns {tmntType | null} - tmnt saved or null
 */
export const tmntSaveTmnt = async (origTmnt: tmntType, tmnt: tmntType, saveType: saveTypes): Promise<tmntType | null> => { 
 
  // data error sanitize/vailadtion done in postTmnt or putTmnt
  if (!tmnt || !saveType) return null;
  if (saveType === 'CREATE') {    
    return await postTmnt(tmnt)
  } else if (saveType === 'UPDATE') {
    // if tmnt not edited, return original tmnt
    if (JSON.stringify(origTmnt) === JSON.stringify(tmnt)) return tmnt;
    // if tmnt edited, put it
    return await putTmnt(tmnt)  
  } else {
    return null
  }
}

/**
 * saves all tmnt data
 * 
 * @param {saveAllTmntDataType} allTmntData - data to save
 * @returns {ioDataErrorsType} - save result 
 */
export const saveAllTmntData = async(allTmntData: saveAllTmntDataType): Promise<ioDataErrorsType> => { 
  const {
    saveType, 
    origTmnt, tmnt,
    origEvents, events,
    origDivs, divs, 
    origSquads, squads, 
    origLanes, lanes,
    origPots, pots, 
    origBrkts, brkts,
    origElims, elims
  } = allTmntData
  
  const savedTmnt = await tmntSaveTmnt(origTmnt, tmnt, saveType);
  if (!savedTmnt) return ioDataErrorsType.Tmnt;
  const savedEvents = await tmntSaveEvents(origEvents, events, saveType);
  if (!savedEvents) { 
    // delete saved tmnt data
    await deleteTmnt(tmnt.id);            
    return ioDataErrorsType.Events;
  } 
  const savedDivs = await tmntSaveDivs(origDivs, divs, saveType);
  if (!savedDivs) { 
    // delete saved tmnt data
    await deleteAllTmntEvents(tmnt.id);   
    await deleteTmnt(tmnt.id);            
    return ioDataErrorsType.Divs;
  } 
  const savedSquads = await tmntSaveSquads(origSquads, squads, saveType);
  if (!savedSquads) { 
    // delete saved tmnt data
    await deleteAllTmntDivs(tmnt.id);
    await deleteAllTmntEvents(tmnt.id);   
    await deleteTmnt(tmnt.id);            
    return ioDataErrorsType.Squads;
  }
  const savedLanes = await tmntSaveLanes(origLanes, lanes, saveType);
  if (!savedLanes) { 
    // delete saved tmnt data
    await deleteAllTmntSquads(tmnt.id);
    await deleteAllTmntDivs(tmnt.id);
    await deleteAllTmntEvents(tmnt.id);   
    await deleteTmnt(tmnt.id);
    return ioDataErrorsType.Lanes;
  }
  const savedPots = await tmntSavePots(origPots, pots, saveType);
  if (!savedPots) { 
    // delete saved tmnt data
    await deleteAllTmntLanes(tmnt.id);
    await deleteAllTmntSquads(tmnt.id);
    await deleteAllTmntDivs(tmnt.id);
    await deleteAllTmntEvents(tmnt.id);   
    await deleteTmnt(tmnt.id);
    return ioDataErrorsType.Pots;
  }
  const savedBrkts = await tmntSaveBrkts(origBrkts, brkts, saveType);
  if (!savedBrkts) { 
    // delete saved tmnt data
    await deleteAllTmntPots(tmnt.id);
    await deleteAllTmntLanes(tmnt.id);
    await deleteAllTmntSquads(tmnt.id);
    await deleteAllTmntDivs(tmnt.id);
    await deleteAllTmntEvents(tmnt.id);   
    await deleteTmnt(tmnt.id);
    return ioDataErrorsType.Brkts;
  }
  const savedElims = await tmntSaveElims(origElims, elims, saveType);
  if (!savedElims) { 
    // delete saved tmnt data
    await deleteAllTmntBrkts(tmnt.id);
    await deleteAllTmntPots(tmnt.id);
    await deleteAllTmntLanes(tmnt.id);
    await deleteAllTmntSquads(tmnt.id);
    await deleteAllTmntDivs(tmnt.id);
    await deleteAllTmntEvents(tmnt.id);   
    await deleteTmnt(tmnt.id);
    return ioDataErrorsType.Elims;
  }
  return ioDataErrorsType.None
}
