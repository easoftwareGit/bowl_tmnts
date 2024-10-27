import { brktType, divType, elimType, eventType, ioDataErrorsType, laneType, potType, saveAllTmntDataType, saveTypes, squadType, tmntType } from "@/lib/types/types";
import { deleteTmnt, postTmnt, putTmnt } from "../tmnts/tmntsAxios";
import { isValidBtDbId } from "@/lib/validation";
import { deleteAllTmntEvents, deleteEvent, postEvent, postManyEvents, putEvent } from "../events/eventsAxios";
import { deleteAllTmntDivs, deleteDiv, postDiv, postManyDivs, putDiv } from "../divs/divsAxios";
import { deleteAllTmntSquads, deleteSquad, postManySquads, postSquad, putSquad } from "../squads/squadsAxios";
import { deleteAllTmntLanes, deleteLane, postLane, postManyLanes, putLane } from "../lanes/lanesAxios";
import { deleteAllTmntPots, deletePot, postManyPots, postPot, putPot } from "../pots/potsAxios";
import { deleteAllTmntBrkts, deleteBrkt, postBrkt, postManyBrkts, putBrkt } from "../brkts/brktsAxios";
import { deleteElim, postElim, postManyElims, putElim } from "../elims/elimsAxios";

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
 * creates, updates or deletes tmnt events based on event status
 * 
 * @param {eventType[]} origEvents - original events in tmnt
 * @param {eventType[]} events - current events to save
 * @returns array of saved current events or null
 */
const tmntPostPutOrDelEvents = async (origEvents: eventType[], events: eventType[]): Promise<eventType[] | null> => {
  
  const savedEvents: eventType[] = [];
  // if user has deleted an event, the event will be in origEvents
  // and not in events. Delete the event from the db.
  for (let i = 0; i < origEvents.length; i++) {
    const event = origEvents[i];
    if (isValidBtDbId(event.id, 'evt')) {
      const foundEvent = events.find((e) => e.id === event.id);
      if (!foundEvent) {
        const delEventCount = await deleteEvent(event.id);
        if (delEventCount !== 1) return null
      }
    }
  }

  // if user has added an event, the event will be in events
  for (let i = 0; i < events.length; i++) {         
    // if not a new event 
    if (isValidBtDbId(events[i].id, 'evt')) {     
      // find origonal event
      const foundOrig = origEvents.find((e) => e.id === events[i].id);
      if (foundOrig) {
        // if original event has been edited, put currennt event
        if (JSON.stringify(foundOrig) !== JSON.stringify(events[i])) { 
          const puttedEvent = await putEvent(events[i]);
          if (!puttedEvent) return null
          savedEvents.push(puttedEvent);
        } else { // else original event has not been edited
          savedEvents.push(foundOrig);          
        }
      } else { // else a new event
        const postedEvent = await postEvent(events[i]);    
        if (!postedEvent) return null     
        savedEvents.push(postedEvent);
      }
    }    
  }  
  return savedEvents;
}

/**
 * saves tmnt events
 * 
 * @param {eventType[]} origEvents - original events in tmnt
 * @param {eventType[]} events - current events to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns - array of saved current events or null (if an event is not edited, it will be included in the returned array)  
 */
export const tmntSaveEvents = async (origEvents: eventType[], events: eventType[], saveType: saveTypes): Promise<eventType[] | null> => { 

  if (!origEvents || !events || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyEvents(events) 
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelEvents(origEvents, events)
  } else {  
    return null
  }
}

/**
 * creates, updates or deletes tmnt divs based on div status
 * 
 * @param {divType[]} origDivs - original divs in tmnts
 * @param {divType[]} divs - current divs to save
 * @returns {divType[] | null} - array of saved current divs or null
 */
const tmntPostPutOrDelDivs = async (origDivs: divType[], divs: divType[]): Promise<divType[] | null> => {

  const savedDivs: divType[] = [];
  // if user has deleted an div, the div will be in origDivs
  // and not in divs. Delete the div from the db.
  for (let i = 0; i < origDivs.length; i++) {
    const div = origDivs[i];
    if (isValidBtDbId(div.id, 'div')) {
      const foundDiv = divs.find((d) => d.id === div.id);
      if (!foundDiv) {
        const delDivCount = await deleteDiv(div.id);
        if (delDivCount !== 1) return null
      }
    }
  }

  // if user has added an div, the div will be in divs
  for (let i = 0; i < divs.length; i++) {
    // if not a new div
    if (isValidBtDbId(divs[i].id, 'div')) {
      // find origonal div
      const foundOrig = origDivs.find((d) => d.id === divs[i].id);
      if (foundOrig) {
        if (JSON.stringify(foundOrig) !== JSON.stringify(divs[i])) {
          const puttedDiv = await putDiv(divs[i]);
          if (!puttedDiv) return null
          savedDivs.push(puttedDiv);
        } else {
          savedDivs.push(foundOrig);
        }
      } else { // else a new div
        const postedDiv = await postDiv(divs[i]);
        if (!postedDiv) return null
        savedDivs.push(postedDiv);
      }
    }
  }
  return savedDivs;
}

/**
 * saves tmnt divs
 * 
 * @param {divType[]} origDivs - original divs in tmnts
 * @param {divType[]} divs - current divs to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {divType[] | null} - array of saved current divs or null
 */
export const tmntSaveDivs = async (origDivs: divType[], divs: divType[], saveType: saveTypes): Promise<divType[] | null> => {

  if (!origDivs || !divs || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyDivs(divs); 
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelDivs(origDivs, divs)
  } else {  
    return null
  }
}

/**
 * creates, updates or deletes tmnt squads based on squad status
 * 
 * @param {squadType[]} origSquads - original squads in tmnts
 * @param {squadType[]} squads - current squads to save
 * @returns {squadType[] | null} - array of saved current squads or null 
 * */
const tmntPostPutOrDelSquads = async (origSquads: squadType[], squads: squadType[]): Promise<squadType[] | null> => { 

  const savedSquads: squadType[] = [];
  // if user has deleted a squad, the squad will be in origSquads
  // and not in squads. Delete the squad from the db.
  for (let i = 0; i < origSquads.length; i++) {
    const squad = origSquads[i];
    if (isValidBtDbId(squad.id, 'sqd')) {
      const foundDiv = squads.find((s) => s.id === squad.id);
      if (!foundDiv) {
        const delSquadCount = await deleteSquad(squad.id);
        if (delSquadCount !== 1) return null
      }
    }
  }

  // if user has added a squad, the lane will be in squads
  for (let i = 0; i < squads.length; i++) {
    // if not a new squad
    if (isValidBtDbId(squads[i].id, 'sqd')) {
      // find origonal squad
      const foundOrig = origSquads.find((s) => s.id === squads[i].id);
      if (foundOrig) {
        if (JSON.stringify(foundOrig) !== JSON.stringify(squads[i])) {
          const puttedSquad = await putSquad(squads[i]);
          if (!puttedSquad) return null
          savedSquads.push(puttedSquad);
        } else {
          savedSquads.push(foundOrig);
        }
      } else { // else a new lane
        const postedSquad = await postSquad(squads[i]);
        if (!postedSquad) return null
        savedSquads.push(postedSquad);
      }
    }
  }
  return savedSquads;
}

/**
 * saves tmnt squads
 * 
 * @param {squadType[]} origSquads - original squads in tmnts
 * @param {squadType[]} squads - current squads to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {squadType[] | null} - array of saved current squads or null
 */
export const tmntSaveSquads = async (origSquads: squadType[], squads: squadType[], saveType: saveTypes): Promise<squadType[] | null> => { 

  if (!origSquads || !squads || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManySquads(squads)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelSquads(origSquads, squads)
  } else {  
    return null
  }
}

/**
 * creates, updates or deletes tmnt lanes based on lane status
 * 
 * @param {laneType[]} origLanes - original lanes in tmnts
 * @param {laneType[]} lanes - current lanes to save
 * @returns {laneType[] | null} - array of saved current lanes or null 
 * */
const tmntPostPutOrDelLanes = async (origLanes: laneType[], lanes: laneType[]): Promise<laneType[] | null> => { 

  const savedLanes: laneType[] = [];
  // if user has deleted a lane, the lane will be in origLanes
  // and not in lanes. Delete the lane from the db.
  for (let i = 0; i < origLanes.length; i++) {
    const lane = origLanes[i];
    if (isValidBtDbId(lane.id, 'lan')) {
      const foundLane = lanes.find((l) => l.id === lane.id);
      if (!foundLane) {
        const delLaneCount = await deleteLane(lane.id);
        if (delLaneCount !== 1) {
          return null
        }
      }
    }
  }

  // if user has added a lane, the lane will be in lanes
  for (let i = 0; i < lanes.length; i++) {
    // if not a new lane
    if (isValidBtDbId(lanes[i].id, 'lan')) {
      // find origonal lane
      const foundOrig = origLanes.find((l) => l.id === lanes[i].id);
      if (foundOrig) {        
        if (JSON.stringify(foundOrig) !== JSON.stringify(lanes[i])) {
          const puttedLane = await putLane(lanes[i]);
          if (!puttedLane) {
            return null
          }
          savedLanes.push(puttedLane);
        } else {
          savedLanes.push(foundOrig);
        }
      } else { // else a new lane
        const postedLane = await postLane(lanes[i]);
        if (!postedLane) {
          return null
        }
        savedLanes.push(postedLane);
      }
    }
  }
  return savedLanes;
}

/**
 * saves tmnt lanes
 * 
 * @param {laneType[]} origLanes - original lanes in tmnts
 * @param {laneType[]} lanes - current lanes to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {laneType[] | null} - array of saved current lanes or null
 */
export const tmntSaveLanes = async (origLanes: laneType[], lanes: laneType[], saveType: saveTypes): Promise<laneType[] | null> => { 

  if (!origLanes || !lanes || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyLanes(lanes)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelLanes(origLanes, lanes)
  } else {  
    return null
  }
}

/**
 * creates, updates or deletes tmnt pots based on pot status
 * 
 * @param {potType[]} origPots - original pots in tmnts
 * @param {potType[]} pots - current pots to save
 * @returns {potType[] | null} - array of saved current pots or null
 */
const tmntPostPutOrDelPots = async (origPots: potType[], pots: potType[]): Promise<potType[] | null> => { 

  const savedPots: potType[] = [];
  // if user has deleted a pot, the pot will be in origPots
  // and not in pots. Delete the pot from the db.
  for (let i = 0; i < origPots.length; i++) {
    const pot = origPots[i];
    if (isValidBtDbId(pot.id, 'pot')) {
      const foundPot = pots.find((p) => p.id === pot.id);
      if (!foundPot) {
        const delPotCount = await deletePot(pot.id);
        if (delPotCount !== 1) {
          return null
        }
      }
    }
  }

  // if user has added a pot, the pot will be in pots
  for (let i = 0; i < pots.length; i++) {
    // if not a new pot
    if (isValidBtDbId(pots[i].id, 'pot')) {
      // find origonal pot
      const foundOrig = origPots.find((p) => p.id === pots[i].id);
      if (foundOrig) {        
        if (JSON.stringify(foundOrig) !== JSON.stringify(pots[i])) {
          const puttedPot = await putPot(pots[i]);
          if (!puttedPot) {
            return null
          }
          savedPots.push(puttedPot);
        } else {
          savedPots.push(foundOrig);
        }
      } else { // else a new pot
        const postedPot = await postPot(pots[i]);
        if (!postedPot) {
          return null
        }
        savedPots.push(postedPot);
      }
    }
  }
  return savedPots;
}

/**
 * saves tmnt pots
 * 
 * @param {potType[]} origPots - original pots in tmnts
 * @param {potType[]} pots - current pots to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {potType[] | null} - array of saved current pots or null
 */
export const tmntSavePots = async (origPots: potType[], pots: potType[], saveType: saveTypes): Promise<potType[] | null> => { 

  if (!origPots || !pots || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyPots(pots)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelPots(origPots, pots)
  } else {  
    return null
  }
}

/**
 * creates, updates or deletes tmnt brkts based on brkt status
 * 
 * @param {brktType[]} origBrkts - original brkts in tmnts
 * @param {brktType[]} brkts - current brkts to save
 * @returns {brktType[] | null} - array of saved current brkts or null
 */
const tmntPostPutOrDelBrkts = async (origBrkts: brktType[], brkts: brktType[]): Promise<brktType[] | null> => { 

  const savedBrkts: brktType[] = [];
  // if user has deleted a brkt, the brkt will be in origBrkts
  // and not in brkts. Delete the brkt from the db.
  for (let i = 0; i < origBrkts.length; i++) {
    const brkt = origBrkts[i];
    if (isValidBtDbId(brkt.id, 'brk')) {
      const foundBrkt = brkts.find((b) => b.id === brkt.id);
      if (!foundBrkt) {
        const delBrktCount = await deleteBrkt(brkt.id);
        if (delBrktCount !== 1) {
          return null
        }
      }
    }
  }

  // if user has added a brkt, the brkt will be in brkts
  for (let i = 0; i < brkts.length; i++) {
    // if not a new brkt
    if (isValidBtDbId(brkts[i].id, 'brk')) {
      // find origonal brkt
      const foundOrig = origBrkts.find((b) => b.id === brkts[i].id);
      if (foundOrig) {        
        if (JSON.stringify(foundOrig) !== JSON.stringify(brkts[i])) {
          const puttedBrkt = await putBrkt(brkts[i]);
          if (!puttedBrkt) {
            return null
          }
          savedBrkts.push(puttedBrkt);
        } else {
          savedBrkts.push(foundOrig);
        }
      } else { // else a new brkt
        const postedBrkt = await postBrkt(brkts[i]);
        if (!postedBrkt) {
          return null
        }
        savedBrkts.push(postedBrkt);
      }
    }
  }
  return savedBrkts;
}

/**
 * saves tmnt brkts
 * 
 * @param {brktType[]} origBrkts - original brkts in tmnts
 * @param {brktType[]} brkts - current brkts to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {brktType[] | null} - array of saved current brkts or null
 */
export const tmntSaveBrkts = async (origBrkts: brktType[], brkts: brktType[], saveType: saveTypes): Promise<brktType[] | null> => { 

  if (!origBrkts || !brkts || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyBrkts(brkts)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelBrkts(origBrkts, brkts)
  } else {  
    return null
  }
}

/**
 * creates, updates or deletes tmnt elims based on elim status
 * 
 * @param {elimType[]} origElims - original elims in tmnts
 * @param {elimType[]} elims - current elims to save
 * @returns {elimType[] | null} - array of saved current elims or null
 */
const tmntPostPutOrDelElims = async (origElims: elimType[], elims: elimType[]): Promise<elimType[] | null> => { 

  const savedElims: elimType[] = [];
  // if user has deleted a elim, the elim will be in origElims
  // and not in elims. Delete the elim from the db.
  for (let i = 0; i < origElims.length; i++) {
    const elim = origElims[i];
    if (isValidBtDbId(elim.id, 'elm')) {
      const foundElim = elims.find((e) => e.id === elim.id);
      if (!foundElim) {
        const delElimCount = await deleteElim(elim.id);
        if (delElimCount !== 1) {
          return null
        }
      }
    }
  }

  // if user has added an elim, the elim will be in elims
  for (let i = 0; i < elims.length; i++) {
    // if not a new elim
    if (isValidBtDbId(elims[i].id, 'elm')) {
      // find origonal elim
      const foundOrig = origElims.find((e) => e.id === elims[i].id);
      if (foundOrig) {        
        if (JSON.stringify(foundOrig) !== JSON.stringify(elims[i])) {
          const puttedElim = await putElim(elims[i]);
          if (!puttedElim) {
            return null
          }
          savedElims.push(puttedElim);
        } else {
          savedElims.push(foundOrig);
        }
      } else { // else a new elim
        const postedElim = await postElim(elims[i]);
        if (!postedElim) {
          return null
        }
        savedElims.push(postedElim);
      }
    }
  }
  return savedElims;
}

/**
 * saves tmnt elims
 * 
 * @param {elimType[]} origElims - original elims in tmnts
 * @param {elimType[]} elims - current elims to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {elimType[] | null} - array of saved current elims or null
 */
export const tmntSaveElims = async (origElims: elimType[], elims: elimType[], saveType: saveTypes): Promise<elimType[] | null> => { 

  if (!origElims || !elims || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyElims(elims)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelElims(origElims, elims)
  } else {  
    return null
  }
}

/**
 * saves all data for one tournament post, put or delete as needed
 * 
 * @param {saveAllTmntDataType} allTmntData - data to save
 * @returns {ioDataErrorsType} - save result 
 */
export const saveAllDataOneTmnt = async(allTmntData: saveAllTmntDataType): Promise<ioDataErrorsType> => { 
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

export const exportedForTesting = {  
  tmntPostPutOrDelEvents,
  tmntPostPutOrDelDivs,
  tmntPostPutOrDelSquads,
  tmntPostPutOrDelLanes,
  tmntPostPutOrDelPots,
  tmntPostPutOrDelBrkts,
  tmntPostPutOrDelElims,
};
