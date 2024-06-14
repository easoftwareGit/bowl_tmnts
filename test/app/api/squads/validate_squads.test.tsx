import {
  sanitizeSquad,
  validateSquad,
  validSquadName,
  validGames,
  validStartingLane,
  validLaneCount,
  validLaneConfig,    
  validSquadDate,
  validSquadTime,  
  validEventFkId,
  exportedForTesting
} from "@/app/api/squads/validate";
import { initSquad } from "@/db/initVals";
import { squadType } from "@/lib/types/types";
import { ErrorCode, maxEventLength, maxSortOrder, validPostId } from "@/lib/validation";
import { nextPostSecret } from "@/lib/tools";

const { gotSquadData, validSquadData } = exportedForTesting;

const validSquad = {
  ...initSquad,
  event_id: 'evt_cb97b73cb538418ab993fc867f860510',
  squad_name: 'Test Squad',
  games: 6,
  starting_lane: 1,
  lane_count: 12,
  squad_date: '2022-10-23',
  squad_time: '12:00',
  sort_order: 1
}

describe('tests for squad validation', () => { 

  describe('getSquadData function', () => {

    it('should return ErrorCode.None when all data is valid', () => {
      expect(gotSquadData(validSquad)).toBe(ErrorCode.None)
    })
    it('shoudl return ErrorCode.None when all data is valid, but no start time', () => { 
      const testSquad = {
        ...validSquad,
        squad_time: ''
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.MissingData when event_id is missing', () => {
      const testSquad = {
        ...validSquad,
        event_id: ''
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when squad_name is missing', () => {
      const testSquad = {
        ...validSquad,
        squad_name: ''
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when games is missing', () => {
      const testSquad = {
        ...validSquad,
        games: null as any
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.MissingData) 
    })
    it('should return ErrorCode.MissingData when starting_lane is missing', () => {
      const testSquad = {
        ...validSquad,
        starting_lane: null as any
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.MissingData) 
    })
    it('should return ErrorCode.MissingData when lane_count is missing', () => {
      const testSquad = {
        ...validSquad,
        lane_count: null as any
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.MissingData) 
    })
    it('should return ErrorCode.MissingData when squad_date is missing', () => {
      const testSquad = {
        ...validSquad,
        squad_date: ''
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.MissingData)       
    })
    it('should return ErrorCode.MissingData when squad_time is missing', () => {
      const testSquad = {
        ...validSquad,
        squad_time: ''
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.MissingData)       
    })
    it('should return ErrorCode.MissingData when sort_order is missing', () => {
      const testSquad = {
        ...validSquad,
        sort_order: null as any
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.MissingData) 
    })
  })

})