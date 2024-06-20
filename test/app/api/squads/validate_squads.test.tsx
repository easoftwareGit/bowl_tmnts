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
import { todayStr } from "@/lib/dateTools";

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
    it('should return ErrorCode.MissingData when sort_order is missing', () => {
      const testSquad = {
        ...validSquad,
        sort_order: null as any
      }
      expect(gotSquadData(testSquad)).toBe(ErrorCode.MissingData) 
    })
  })

  describe('validSquadName function', () => {
    it('should return true when name is valid', () => {
      expect(validSquadName('Test Squad')).toBe(true)
    })
    it('should return false when name is invalid', () => {
      const result = validSquadName('a'.repeat(maxEventLength + 1))
      expect(result).toBe(false)
    })
    it('should return false when name is empty', () => {      
      expect(validSquadName('')).toBe(false)
    })
    it('should return false when name is null', () => {      
      expect(validSquadName(null as any)).toBe(false)
    })
    it('should return false when name is undefined', () => {      
      expect(validSquadName(undefined as any)).toBe(false)
    })
    it('should return false when name is just special characters', () => { 
      expect(validSquadName('!@#$%^&*()')).toBe(false)
    })
    it('should sanitize event name', () => {
      const result = validSquadName('<script>alert(1)</script>')
      expect(result).toBe(true) // sanitizes to 'alert1'
    })

  })

  describe('validGames function', () => {
    it('should return true when games is valid', () => {
      expect(validGames(6)).toBe(true)
    })
    it('should return false when games is too low', () => {
      expect(validGames(0)).toBe(false)
    })
    it('should return false when games is too high', () => {
      expect(validGames(100)).toBe(false)
    })
    it('should return false when games is not an integer', () => {
      expect(validGames(5.5)).toBe(false)
    })
    it('should return false when games is null', () => {
      expect(validGames(null as any)).toBe(false)
    })
    it('should return false when games is undefined', () => {
      expect(validGames(undefined as any)).toBe(false)
    })
  })

  describe('validStartingLane function', () => {
    it('should return true when starting_lane is valid', () => {
      expect(validStartingLane(1)).toBe(true)
    })
    it('should return false when starting_lane is too low', () => {
      expect(validStartingLane(0)).toBe(false)
    })
    it('should return false when starting_lane is too high', () => {
      expect(validStartingLane(201)).toBe(false)
    })
    it('should return false when strating_lane is even', () => {
      expect(validStartingLane(2)).toBe(false)
    })
    it('should return false when starting_lane is not an integer', () => {
      expect(validStartingLane(5.5)).toBe(false)
    })
    it('should return false when starting_lane is null', () => {
      expect(validStartingLane(null as any)).toBe(false)
    })
    it('should return false when starting_lane is undefined', () => {
      expect(validStartingLane(undefined as any)).toBe(false)
    })
  })

  describe('validLaneCount function', () => {
    it('should return true when lane_count is valid', () => {
      expect(validLaneCount(2)).toBe(true)
    })
    it('should return false when lane_count is too low', () => {
      expect(validLaneCount(1)).toBe(false)
    })
    it('should return false when lane_count is too high', () => {
      expect(validLaneCount(202)).toBe(false)
    })
    it('should return false when lane_count is odd', () => {
      expect(validLaneCount(3)).toBe(false)
    })
    it('should return false when lane_count is not an integer', () => {
      expect(validLaneCount(5.5)).toBe(false)
    })
    it('should return false when lane_count is null', () => {
      expect(validLaneCount(null as any)).toBe(false)
    })
    it('should return false when lane_count is undefined', () => {
      expect(validLaneCount(undefined as any)).toBe(false)
    })
  })

  describe('validLaneConfig function', () => {
    it('should return true when lane_config is valid', () => {
      expect(validLaneConfig(1, 2)).toBe(true)
    })
    it('should return false when staringLane is too low', () => {
      expect(validLaneConfig(0, 2)).toBe(false)
    })
    it('should return false when stratingLane is too high', () => {
      expect(validLaneConfig(201, 2)).toBe(false)
    })
    it('should return false when stratingLane is even', () => {
      expect(validLaneConfig(2, 2)).toBe(false)
    })
    it('should return false when startingLane is not an integer', () => {
      expect(validLaneConfig(5.5, 2)).toBe(false)
    })
    it('should return false when stratingLane is null', () => {
      expect(validLaneConfig(null as any, 2)).toBe(false)
    })
    it('should return false when startingLane is undefined', () => {
      expect(validLaneConfig(undefined as any, 2)).toBe(false)
    })
    it('should return false when laneCount is too low', () => {
      expect(validLaneConfig(1, 0)).toBe(false)
    })
    it('should return false when laneCount is too high', () => {
      expect(validLaneConfig(1, 202)).toBe(false)
    })
    it('should return false when laneCount is odd', () => {
      expect(validLaneConfig(1, 3)).toBe(false)
    })
    it('should return false when laneCount is not an integer', () => {
      expect(validLaneConfig(1, 5.5)).toBe(false)
    })
    it('should return false when laneCount is null', () => {
      expect(validLaneConfig(1, null as any)).toBe(false)
    })
    it('should return false when laneCount is undefined', () => {
      expect(validLaneConfig(1, undefined as any)).toBe(false)
    })
    it('should return false when startingLane + laneCount is too high', () => {
      expect(validLaneConfig(100, 103)).toBe(false)
    })
  })

  describe('validSquadDate function', () => { 
    it('should return true when date is valid', () => {
      expect(validSquadDate(todayStr)).toBe(true)
    })
    it('should return true when date is a date, not string date', () => { 
      expect(validSquadDate(new Date() as any)).toBe(true)
    })
    it('should return false when date is not valid', () => {
      expect(validSquadDate('2022-02-32')).toBe(false)
    })
    it('should return false when date is an empty string', () => {
      expect(validSquadDate('')).toBe(false)
    })
    it('should return false when date is null', () => {
      expect(validSquadDate(null as any)).toBe(false)
    })
    it('should return false when date is undefined', () => {
      expect(validSquadDate(undefined as any)).toBe(false)
    })
    it('should return false when date is not a valid string', () => {
      expect(validSquadDate('abc')).toBe(false)
    })
  })

  describe('validSquadTime function', () => { 
    it('should return true when time is valid', () => {
      expect(validSquadTime('10:00')).toBe(true)
      expect(validSquadTime('10:00 AM')).toBe(true)
      expect(validSquadTime('10:00 PM')).toBe(true)
      expect(validSquadTime('13:00')).toBe(true)
      expect(validSquadTime('23:59')).toBe(true)      
      expect(validSquadTime('00:00')).toBe(true)      
    })
    it('should return true for empty string or null', () => { 
      expect(validSquadTime('')).toBe(true)
      expect(validSquadTime(null)).toBe(true)
    })
    it('should return false when time is not valid', () => {
      expect(validSquadTime('13:00 AM')).toBe(false)
      expect(validSquadTime('10:60')).toBe(false)
      expect(validSquadTime('24:00')).toBe(false)
      expect(validSquadTime('1:00')).toBe(false)
      expect(validSquadTime('1:00 PM')).toBe(false)
    })
    it('should return false when time is undefined', () => {
      expect(validSquadTime(undefined as any)).toBe(false)
    })
    it('should return false when time is not a valid string', () => {
      expect(validSquadTime('abc')).toBe(false)
    })
    it('should return false when time is a number', () => {
      expect(validSquadTime(10 as any)).toBe(false)
    })
  })

  describe('validEventFkId function', () => { 
    it('should return true for valid event_id', () => {
      expect(validEventFkId(validSquad.event_id, 'evt')).toBe(true)
    })
    it('should return false for invalid foreign key id', () => {
      expect(validEventFkId('abc_def', 'evt')).toBe(false)
    })
    it('should return false if foreign key id type does not match id type', () => { 
      expect(validEventFkId(validSquad.event_id, 'usr')).toBe(false)
    })
    it('should return false for an empty foreign key id', () => { 
      expect(validEventFkId('', 'evt')).toBe(false)      
    })
    it('should return false for an null foreign key id', () => { 
      expect(validEventFkId(null as any, 'evt')).toBe(false)
    })
    it('should return false for an null key type', () => { 
      expect(validEventFkId(validSquad.event_id, null as any)).toBe(false)
    })
  })  

  describe('validSquadData function', () => {
    it('should return ErrorCode.NONE for valid squad data', () => {
      expect(validSquadData(validSquad)).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None for missing squad_time', () => {
      const stillValidSquad = {
        ...validSquad,
        squad_time: ''
      }
      expect(validSquadData(stillValidSquad)).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.InvalidData for event_id missing', () => {
      const invalidSquad = {
        ...validSquad,
        event_id: ''
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData for invalid event_id', () => {
      const invalidSquad = {
        ...validSquad,
        event_id: 'abc'
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when event_id is a valid id, but not evt type', () => {
      const invalidSquad = {
        ...validSquad,
        event_id: 'usr_12345678901234567890123456789012'
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData for missing squad_name', () => {
      const invalidSquad = {
        ...validSquad,
        squad_name: ''
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData for games invalid', () => {
      const invalidSquad = {
        ...validSquad,
        games: 0
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData for starting_lane invalid', () => {
      const invalidSquad = {
        ...validSquad,
        starting_lane: 2
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData for lane_count invalid', () => {
      const invalidSquad = {
        ...validSquad,
        lane_count: 201
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData for starting lane valid, lane count valiud, but the combo is invalid', () => {  
      const invalidSquad = {
        ...validSquad,
        starting_lane: 101,
        lane_count: 103
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData for invalid squad_date', () => {
      const invalidSquad = {
        ...validSquad,
        squad_date: '2022-13-01'
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData for invalid squad_time', () => {
      const invalidSquad = {
        ...validSquad,
        squad_time: '13:13:13'
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData for invalid sort_order', () => {
      const invalidSquad = {
        ...validSquad,
        sort_order: -1
      }
      expect(validSquadData(invalidSquad)).toBe(ErrorCode.InvalidData)
    })
  })

  describe('sanitizeSquad function', () => {
    it('should return a sanitized squad when event is already sanitized', () => {
      const testSquad = {
        ...validSquad,
      }
      const sanitizedSquad = sanitizeSquad(testSquad)
      expect(sanitizedSquad).toEqual(testSquad)
    })
    it('should return a sanitized squad when event is not already sanitized', () => {
      const testSquad = {
        ...validSquad,
        event_id: 'abc_123',
        squad_name: '  Test Squad**  ',
        games: 123,
        starting_lane: 2,
        lane_count: 201,
        squad_date: '2022-13-32',
        squad_time: '24:00',
        sort_order: -1
      }
      const sanitizedSquad = sanitizeSquad(testSquad)
      expect(sanitizedSquad.event_id).toEqual('1')
      expect(sanitizedSquad.squad_name).toEqual('Test Squad')
      expect(sanitizedSquad.games).toEqual(3)
      expect(sanitizedSquad.starting_lane).toEqual(1)
      expect(sanitizedSquad.lane_count).toEqual(2)
      expect(sanitizedSquad.squad_date).toEqual(todayStr)
      expect(sanitizedSquad.squad_time).toEqual('')
      expect(sanitizedSquad.sort_order).toEqual(1)
    })
    it('should return null when passed a null squad', () => {
      const sanitizedSquad = sanitizeSquad(null as any)
      expect(sanitizedSquad).toEqual(null)
    })
    it('should return null when passed undefined squad', () => {
      const sanitizedSquad = sanitizeSquad(undefined as any)
      expect(sanitizedSquad).toEqual(null)
    })
  })

  describe('validateSquads function', () => {

    describe('validateSquad function - valid data', () => {
      it('should return ErrorCode.None when passed a valid squad', () => {
        expect(validateSquad(validSquad)).toBe(ErrorCode.None)
      })
      it('should return ErrorCode.None when all fields are properly sanitized', () => {
        const validTestSquad = {
          ...validSquad,        
          squad_name: '  Test Squad**  ',
          games: 6,
          starting_lane: 1,
          lane_count: 20,
          squad_date: '2024-01-01',
          squad_time: '12:00 PM',
          sort_order: 1
        }
        expect(validateSquad(validTestSquad)).toBe(ErrorCode.None)
      })      
    })

    describe('validateSquad function - missing data', () => {      
      it('should return ErrorCode.MissingData when passed a squad with missing event_id', () => {
        const missingSquad = {
          ...validSquad,
          event_id: '',
        }
        expect(validateSquad(missingSquad)).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when passed a squad with missing squad_name', () => {
        const missingSquad = {
          ...validSquad,
          squad_name: '',
        }
        expect(validateSquad(missingSquad)).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when passed a squad with squad_name is just special characters', () => {
        const missingSquad = {
          ...validSquad,
          squad_name: '*****',
        }
        expect(validateSquad(missingSquad)).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when passed a squad with missing games', () => {
        const missingSquad = {
          ...validSquad,
          games: null as any,
        }
        expect(validateSquad(missingSquad)).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when passed a squad with missing starting_lane', () => {
        const missingSquad = {
          ...validSquad,
          starting_lane: null as any,
        }
        expect(validateSquad(missingSquad)).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when passed a squad with missing lane_count', () => {
        const missingSquad = {
          ...validSquad,
          lane_count: null as any,
        }
        expect(validateSquad(missingSquad)).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when passed a squad with missing squad_date', () => {
        const missingSquad = {
          ...validSquad,
          squad_date: '',
        }
        expect(validateSquad(missingSquad)).toBe(ErrorCode.MissingData)
      })
      // missing squad time is OK
      it('should return ErrorCode.MissingData when passed a squad with missing sort_order', () => {
        const missingSquad = {
          ...validSquad,
          sort_order: null as any,
        }
        expect(validateSquad(missingSquad)).toBe(ErrorCode.MissingData)
      })
    })

    describe('validdateSquad function - invalid data', () => {
      it('should return ErrorCode.InvalidData when passed a squad with invalid event_id', () => {
        const invalidSquad = {
          ...validSquad,
          event_id: 'abc',
        }
        expect(validateSquad(invalidSquad)).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when passed a squad with invalid squad_name', () => {
        const invalidSquad = {
          ...validSquad,
          squad_name: 'This squad name is way too long and should exceed the maximum length allowed',
        }
        expect(validateSquad(invalidSquad)).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when passed a squad with invalid games', () => {
        const invalidSquad = {
          ...validSquad,
          games: 123,
        }
        expect(validateSquad(invalidSquad)).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when passed a squad with invalid starting_lane', () => {
        const invalidSquad = {
          ...validSquad,
          starting_lane: -1,
        }
        expect(validateSquad(invalidSquad)).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when passed a squad with invalid lane_count', () => {
        const invalidSquad = {
          ...validSquad,
          lane_count: -1,
        }
        expect(validateSquad(invalidSquad)).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when passed a squad with invalid lane_config', () => {
        const invalidSquad = {
          ...validSquad,
          starting_lane: 101,
          lane_count: 102,
        }
        expect(validateSquad(invalidSquad)).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when passed a squad with invalid squad_date', () => {
        const invalidSquad = {
          ...validSquad,
          squad_date: '2024-13-32',
        }
        expect(validateSquad(invalidSquad)).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when passed a squad with invalid squad_time', () => { 
        const invalidSquad = {
          ...validSquad,
          squad_time: '24:00',
        }
        expect(validateSquad(invalidSquad)).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when passed a squad with invalid sort_order', () => { 
        const invalidSquad = {
          ...validSquad,
          sort_order: maxSortOrder + 1,
        }
        expect(validateSquad(invalidSquad)).toBe(ErrorCode.InvalidData)
      })
    })
  })

  describe('validPostId function', () => { 
    const testEventId = "sqd_7116ce5f80164830830a7157eb093396"
    it('should return testEventId when id starts with post Secret and follows with a valid event id', () => { 
      const validId = nextPostSecret + testEventId;
      expect(validPostId(validId, 'sqd')).toBe(testEventId)
    })
    it('should return "" when id starts with postSecret but does idType does not match idtype in postId', () => {
      const invalidId = nextPostSecret + testEventId;
      expect(validPostId(invalidId, 'usr')).toBe('');
    });
    it('should return "" when id starts with postSecret but does idType is invalid', () => {
      const invalidId = nextPostSecret + testEventId;
      expect(validPostId(invalidId, '123' as any)).toBe('');
    });
    it('should return "" when id starts with postSecret but does not follow with valid BtDb idType', () => {
      const invalidId = nextPostSecret + 'abc_a1b2c3d4e5f678901234567890abcdef';
      expect(validPostId(invalidId, 'sqd')).toBe('');
    });
    it('should return "" when id starts with postSecret but does not follow with a valid BtDb id', () => {
      const invalidId = process.env.POST_SECRET + 'sqd_invalidid';
      expect(validPostId(invalidId, 'sqd')).toBe('');
    });
    it('should return "" when id does not start with postSecret', () => {
      const invalidId = testEventId;
      expect(validPostId(invalidId, 'sqd')).toBe('');
    });
  })
})