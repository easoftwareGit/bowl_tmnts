import {
  sanitizeEvent,
  validateEvent,
  validEventName,
  validGames,
  validTeamSize,
  validEventMoney,
  exportedForTesting,  
  entryFeeEqualsLpox,
  validEventFkId
} from "@/app/api/events/validate";
import { initEvent } from "@/db/initVals";
import { eventType } from "@/lib/types/types";
import { ErrorCode, maxEventLength, maxSortOrder, validPostId } from "@/lib/validation";
import { nextPostSecret } from "@/lib/tools";

const { gotEventData, validEventData } = exportedForTesting;

const validEvent = {
  ...initEvent,
  tmnt_id: 'tmt_fd99387c33d9c78aba290286576ddce5',
  event_name: 'Event Name',
  team_size: 1,
  games: 6,
  added_money: '500',
  entry_fee: '100',
  lineage: '18',
  prize_fund: '75',
  other: '2',
  expenses: '5',
  lpox: '100',
  sort_order: 1
} as eventType

describe('tests for event validation', () => { 

  describe('gotEventData function', () => { 

    it('should return ErrorCode.None when all data is valid' , () => {
      const result = gotEventData(validEvent)
      expect(result).toBe(ErrorCode.None)
    }) 
    it('should return ErrorCode.None when all data is valid, added_money is "0"', () => {
      const testEvent = {
        ...validEvent,
        added_money: '0',
      }
      const result = gotEventData(validEvent)
      expect(result).toBe(ErrorCode.None)
    }) 
    it('should return ErrorCode.MissingData when event_name is missing', () => { 
      const invalidEvent = {
        ...validEvent,
        event_name: ''
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when team_size is missing', () => {
      const invalidEvent = {
        ...validEvent,
        team_size: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when games is missing', () => {
      const invalidEvent = {
        ...validEvent,
        games: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when added_money is missing', () => {
      const invalidEvent = {
        ...validEvent,
        added_money: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when entry_fee is missing', () => {
      const invalidEvent = {
        ...validEvent,
        entry_fee: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when lineage is missing', () => {
      const invalidEvent = {
        ...validEvent,
        lineage: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when prize_fund is missing', () => {
      const invalidEvent = {
        ...validEvent,
        prize_fund: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when other is missing', () => {
      const invalidEvent = {
        ...validEvent,
        other: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when expenses is missing', () => {
      const invalidEvent = {
        ...validEvent,
        expenses: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when lpox is missing', () => {
      const invalidEvent = {
        ...validEvent,
        lpox: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when sort_order is missing', () => { 
      const invalidEvent = {
        ...validEvent,
        sort_order: null as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when added_money is a valid number', () => { 
      const invalidEvent = {
        ...validEvent,
        added_money: 0 as any,
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.OtherError when passed null', () => { 
      const result = gotEventData(null as any)
      expect(result).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.None when added_money is valid number but over maxMoney', () => {
      const invalidEvent = {
        ...validEvent,
        added_money: '1234567890',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when added_money is valid number but less than 0', () => {
      const invalidEvent = {
        ...validEvent,
        added_money: '-1',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when entry_fee is valid number but over maxMoney', () => {
      const invalidEvent = {
        ...validEvent,
        entry_fee: '1234567890',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when entry_fee is valid number but less than 0', () => {
      const invalidEvent = {
        ...validEvent,
        entry_fee: '-1',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when lineage is valid number but over maxMoney', () => {
      const invalidEvent = {
        ...validEvent,
        lineage: '1234567890',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when lineage is valid number but less than 0', () => {
      const invalidEvent = {
        ...validEvent,
        lineage: '-1',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when prize_fund is valid number but over maxMoney', () => {
      const invalidEvent = {
        ...validEvent,
        prize_fund: '1234567890',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when prize_fund is valid number but less than 0', () => {
      const invalidEvent = {
        ...validEvent,
        prize_fund: '-1',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when other is valid number but over maxMoney', () => {
      const invalidEvent = {
        ...validEvent,
        other: '1234567890',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when other is valid number but less than 0', () => {
      const invalidEvent = {
        ...validEvent,
        other: '-1',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when expenses is valid number but over maxMoney', () => {
      const invalidEvent = {
        ...validEvent,
        expenses: '1234567890',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when expenses is valid number but less than 0', () => {
      const invalidEvent = {
        ...validEvent,
        expenses: '-1',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when lpox is valid number but over maxMoney', () => {
      const invalidEvent = {
        ...validEvent,
        lpox: '1234567890',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when lpox is valid number but less than 0', () => {
      const invalidEvent = {
        ...validEvent,
        lpox: '-1',
      }
      const result = gotEventData(invalidEvent)
      expect(result).toBe(ErrorCode.None)
    })
  })

  describe('validEventName function', () => {
    it('should return true when valid', () => { 
      const result = validEventName('Event Name')
      expect(validEventName('Event Name')).toBe(true)
    })
    it('should return false when over max length', () => { 
      const result = validEventName('a'.repeat(maxEventLength + 1))
      expect(result).toBe(false)
    })
    it('should return false when under min length', () => { 
      const result = validEventName('')
      expect(result).toBe(false)
    })
    it('should sanitize event name', () => {
      const result = validEventName('<script>alert(1)</script>')
      expect(result).toBe(true) // sanitizes to 'alert1'
    })
    it('should return false when passed null', () => { 
      const result = validEventName(null as any)
      expect(result).toBe(false)
    })
    it('should return false when passed undefined', () => { 
      const result = validEventName(undefined as any)
      expect(result).toBe(false)
    })    
  })

  describe('validTeamSize function', () => {
    it('should return true when valid', () => { 
      const result = validTeamSize(1)
      expect(result).toBe(true)
    })
    it('should return false when over max size', () => { 
      const result = validTeamSize(6)
      expect(result).toBe(false)
    })
    it('should return false when under min size', () => {
      const result = validTeamSize(0)
      expect(result).toBe(false)
    })
    it('should return false when non integer number is passed', () => { 
      const result = validTeamSize(2.5)
      expect(result).toBe(false)
    })  
    it('should return false when passed null', () => { 
      const result = validTeamSize(null as any)
      expect(result).toBe(false)
    })
    it('should return false when passed undefined', () => { 
      const result = validTeamSize(undefined as any)
      expect(result).toBe(false)
    })
  })

  describe('validGames function', () => {
    it('should return true when valid', () => { 
      const result = validGames(3)
      expect(result).toBe(true)
    })
    it('should return false when over max games', () => { 
      const result = validGames(123)
      expect(result).toBe(false)
    })
    it('should return false when under min games', () => { 
      const result = validGames(0)
      expect(result).toBe(false)
    })  
    it('should return false when non integer number is passed', () => { 
      const result = validGames(2.5)
      expect(result).toBe(false)
    })  
    it('should return false when passed null', () => { 
      const result = validGames(null as any)
      expect(result).toBe(false)
    })
    it('should return false when passed undefined', () => { 
      const result = validGames(undefined as any)
      expect(result).toBe(false)
    })
  })

  describe('validEventMoney function', () => { 
    it('should return true when valid added_money', () => { 
      const result = validEventMoney(validEvent.added_money)
      expect(result).toBe(true)
    })
    it('should return true when valid entry_fee', () => { 
      const result = validEventMoney(validEvent.entry_fee)
      expect(result).toBe(true)
    })
    it('should return true when valid lineage', () => { 
      const result = validEventMoney(validEvent.lineage)
      expect(result).toBe(true)
    })
    it('should return true when valid prize fund', () => { 
      const result = validEventMoney(validEvent.prize_fund)
      expect(result).toBe(true)
    })
    it('should return true when valid other', () => { 
      const result = validEventMoney(validEvent.other)
      expect(result).toBe(true)
    })
    it('should return true when valid expenses', () => { 
      const result = validEventMoney(validEvent.expenses)
      expect(result).toBe(true)
    })
    it('should return true when valid lpox', () => { 
      const result = validEventMoney(validEvent.lpox)
      expect(result).toBe(true) 
    })

    it('should return false when invalid added_money', () => { 
      const invalidEvent = {
        ...initEvent,
        added_money: '$100'
      }; 
      const result = validEventMoney(invalidEvent.added_money)
      expect(result).toBe(false)
    })
    it('should return false when invalid entry_fee', () => { 
      const invalidEvent = {
        ...initEvent,
        entry_fee: '123456789'
      }; 
      const result = validEventMoney(invalidEvent.entry_fee)
      expect(result).toBe(false)
    })
    it('should return false when invalid lineage', () => { 
      const invalidEvent = {
        ...initEvent,
        lineage: '(123456789)'
      }; 
      const result = validEventMoney(invalidEvent.lineage)
      expect(result).toBe(false)
    })
    it('should return false when invalid prize fund', () => { 
      const invalidEvent = {
        ...initEvent,
        prize_fund: '123-'
      }; 
      const result = validEventMoney(invalidEvent.prize_fund)
      expect(result).toBe(false)
    })
    it('should return false when invalid other', () => { 
      const invalidEvent = {
        ...initEvent,
        other: '-1'
      }; 
      const result = validEventMoney(invalidEvent.other)
      expect(result).toBe(false)
    })
    it('should return false when invalid expenses', () => { 
      const invalidEvent = {
        ...initEvent,
        expenses: 'ABC'
      }; 
      const result = validEventMoney(invalidEvent.expenses)
      expect(result).toBe(false)
    })
    it('should return false when invalid lpox', () => { 
      const invalidEvent = {
        ...initEvent,
        lpox: 'ABC'
      }; 
      const result = validEventMoney(invalidEvent.lpox)
      expect(result).toBe(false)
    })
    it('should return false when passed null event', () => { 
      const result = validEventMoney(null as any)
      expect(result).toBe(false)
    })
    it('should return false when passed undefined event', () => { 
      const result = validEventMoney(undefined as any)
      expect(result).toBe(false)
    })
  })

  describe('entryFeeEqualsLpox function', () => { 
    it('should return true when entry_fee equals lpox', () => { 
      const result = entryFeeEqualsLpox(validEvent)
      expect(result).toBe(true)
    })
    it('should return false when entry_fee does not equal lpox', () => { 
      const invalidEvent = {
        ...initEvent,
        entry_fee: '99'        
      }; 
      const result = entryFeeEqualsLpox(invalidEvent)
      expect(result).toBe(false)
    })
    it('should return false when entry_fee does not equal lpox', () => { 
      const invalidEvent = {
        ...initEvent,
        lpox: '99'        
      }; 
      const result = entryFeeEqualsLpox(invalidEvent)
      expect(result).toBe(false)
    })
    it('should return false when passed null event', () => { 
      const result = entryFeeEqualsLpox(null as any)
      expect(result).toBe(false)
    })
    it('should return false when passed undefined event', () => { 
      const result = entryFeeEqualsLpox(undefined as any)
      expect(result).toBe(false)
    })
  })

  describe('validEventFkId function', () => { 
    it('should return true for valid tmnt_id', () => {
      expect(validEventFkId(validEvent.tmnt_id, 'tmt')).toBe(true)
    })
    it('should return false for invalid foreign key id', () => {
      expect(validEventFkId('abc_def', 'tmt')).toBe(false)
    })
    it('should return false if foreign key id type does not match id type', () => { 
      expect(validEventFkId(validEvent.tmnt_id, 'usr')).toBe(false)
    })
    it('should return false for an empty foreign key id', () => { 
      expect(validEventFkId('', 'bwl')).toBe(false)      
    })
    it('should return false for an null foreign key id', () => { 
      expect(validEventFkId(null as any, 'tmt')).toBe(false)
    })
    it('should return false for an null key type', () => { 
      expect(validEventFkId(validEvent.tmnt_id, null as any)).toBe(false)
    })

  })

  describe('validEventData function', () => {
    it('should return ErrorCode.None when valid event data', () => { 
      const result = validEventData(validEvent)
      expect(result).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.InvalidData when tmnt_id is empty', () => { 
      const invalidEvent = {
        ...initEvent,
        tmnt_id: ''
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when tmnt_id is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        tmnt_id: 'abc'
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when tmnt_id is valid, but not tmt type', () => { 
      const invalidEvent = {
        ...initEvent,
        tmnt_id: 'usr_12345678901234567890123456789012'
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when event_name is empty', () => { 
      const invalidEvent = {
        ...initEvent,
        event_name: ''
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when team_size is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        team_size: 0
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when games is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        games: 0
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when added_money is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        added_money: ''
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when entry_fee is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        entry_fee: 'ABC'
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when lineage is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        lineage: '123-'
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when prize_fund is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        prize_fund: '-1'
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when expenses is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        expenses: 'ABC'
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when other is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        other: '12345678'
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when lpox is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        lpox: 'ABC'
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when entry_fee !== linage + prize_fund + other + expenses', () => { 
      const invalidEvent = {
        ...initEvent,
        entry_fee: '99',
      }
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when entry_fee !== lpox', () => { 
      const invalidEvent = {
        ...initEvent,
        entry_fee: '99',
      }
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })

    it('should return ErrorCode.InvalidData when sort_order is invalid', () => { 
      const invalidEvent = {
        ...initEvent,
        sort_order: 0
      }; 
      const result = validEventData(invalidEvent)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when passed null event', () => { 
      const result = validEventData(null as any)
      expect(result).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.InvalidData when passed undefined event', () => { 
      const result = validEventData(undefined as any)
      expect(result).toBe(ErrorCode.InvalidData)
    })
  })

  describe('sanitizeEvent function', () => {
    it('should return a sanitized event when event is already sanitized', () => {
      const testEvent = { 
        ...validEvent,
      }
      const sanitizedEvent = sanitizeEvent(testEvent)      
      expect(sanitizedEvent.tmnt_id).toEqual('tmt_fd99387c33d9c78aba290286576ddce5') // not valid, but sanitized
      expect(sanitizedEvent.event_name).toEqual('Event Name')
      expect(sanitizedEvent.team_size).toEqual(1)
      expect(sanitizedEvent.games).toEqual(6)
      expect(sanitizedEvent.added_money).toEqual('500')
      expect(sanitizedEvent.entry_fee).toEqual('100')
      expect(sanitizedEvent.lineage).toEqual('18')
      expect(sanitizedEvent.prize_fund).toEqual('75')
      expect(sanitizedEvent.other).toEqual('2')
      expect(sanitizedEvent.expenses).toEqual('5')
      expect(sanitizedEvent.sort_order).toEqual(1)
    })
    it('should return a sanitized event ehrn event is NOT already sanitized', () => {
      const testEvent = { 
        ...validEvent,
        tmnt_id: 'abc_123',
        event_name: '  Test Name*   ',
        team_size: 10,
        games: 165,
        added_money: '500.00',
        entry_fee: '100.000',
        lineage: '18',
        prize_fund: '75.0',
        other: '2.0',
        expenses: '5.00',
        sort_order: -1
      }
      const sanitizedEvent = sanitizeEvent(testEvent)      
      expect(sanitizedEvent.tmnt_id).toEqual('1')
      expect(sanitizedEvent.event_name).toEqual('Test Name')
      expect(sanitizedEvent.team_size).toEqual(1)
      expect(sanitizedEvent.games).toEqual(3)
      expect(sanitizedEvent.added_money).toEqual('500')
      expect(sanitizedEvent.entry_fee).toEqual('100')
      expect(sanitizedEvent.lineage).toEqual('18')
      expect(sanitizedEvent.prize_fund).toEqual('75')
      expect(sanitizedEvent.other).toEqual('2')
      expect(sanitizedEvent.expenses).toEqual('5')
      expect(sanitizedEvent.sort_order).toEqual(1)
    })

    it('should return null when passed null event', () => { 
      const result = sanitizeEvent(null as any)
      expect(result).toBe(null)
    })
    it('should return null when passed undefined event', () => { 
      const result = sanitizeEvent(undefined as any)
      expect(result).toBe(null)
    })
  })

  describe('validateEvent function', () => { 

    describe('validateEvent function - valid data', () => { 
      it('should return ErrorCode.None when passed valid event', () => {
        const result = validateEvent(validEvent)
        expect(result).toBe(ErrorCode.None)
      })
      it('should return ErrorCode.None when all fields are properly sanitized', () => {
        const validTestEvent = {
          ...validEvent,
          event_name: '  Test Name*   ',
          team_size: 1,
          games: 6,
          added_money: '500',
          entry_fee: '100.000',
          lineage: '18',
          prize_fund: '75.0',
          other: '2.0',
          expenses: '5.00',
          sort_order: 2
        }
        const result = validateEvent(validTestEvent)
        expect(result).toBe(ErrorCode.None)        
      })
    })

    describe('validateEvent function - missing data', () => { 
      it('should return ErrorCode.MissingData when required field(s) are empty', () => {
        const invalidEvent = {
          ...validEvent,
          event_name: '',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })
      it('should return ErrorCode.MissingData when event_name is only specail characters', () => {
        const invalidEvent = {
          ...validEvent,
          event_name: '****',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })
      it('should return ErrorCode.MissingData when team_size is empty', () => {
        const invalidEvent = {
          ...validEvent,
          team_size: null as any,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })
      it('should return ErrorCode.MissingData when team_size is not a number', () => { 
        const invalidEvent = {
          ...validEvent,
          team_size: 'This is not a number' as any,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData) // sanitized to 0
      })
      it('should return ErrorCode.MissingData when games is empty', () => {
        const invalidEvent = {
          ...validEvent,
          games: null as any,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })
      it('should return ErrorCode.MissingData when games is not a number', () => { 
        const invalidEvent = {
          ...validEvent,
          games: 'This is not a number' as any,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData) // sanitized to 0
      })
      it('should return ErrorCode.MissingData when entry_fee is empty', () => {
        const invalidEvent = {
          ...validEvent,
          entry_fee: '',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })      
      it('should return ErrorCode.MissingData when entry_fee is not a number', () => { 
        const invalidEvent = {
          ...validEvent,
          entry_fee: 'This is not a number',
        }
        // sanitized to an empty string, thus missing data error
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when lineage is empty', () => {
        const invalidEvent = {
          ...validEvent,
          lineage: '',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })
      it('should return ErrorCode.MissingData when lineage is not a number', () => { 
        const invalidEvent = {
          ...validEvent,
          lineage: 'This is not a number',
        }        
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when prize_fund is empty', () => {
        const invalidEvent = {
          ...validEvent,
          prize_fund: '',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })
      it('should return ErrorCode.MissingData when prize_fund is not a number', () => { 
        const invalidEvent = {
          ...validEvent,
          prize_fund: 'This is not a number',
        }        
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when other is empty', () => {
        const invalidEvent = {
          ...validEvent,
          other: '',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })
      it('should return ErrorCode.MissingData when other is not a number', () => { 
        const invalidEvent = {
          ...validEvent,
          other: 'This is not a number',
        }        
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when expenses is empty', () => {
        const invalidEvent = {
          ...validEvent,
          expenses: '',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })      
      it('should return ErrorCode.MissingData when expenses is not a number', () => { 
        const invalidEvent = {
          ...validEvent,
          expenses: 'This is not a number',
        }        
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when lpox is empty', () => {
        const invalidEvent = {
          ...validEvent,
          lpox: '',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)        
      })      
      it('should return ErrorCode.MissingData when lpox is not a number', () => { 
        const invalidEvent = {
          ...validEvent,
          lpox: 'This is not a number',
        }        
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when sort_order is empty', () => {
        const invalidEvent = {
          ...validEvent,
          sort_order: null as any,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData)
      })
      it('should return ErrorCode.MissingData when sort_order is not a number', () => { 
        const invalidEvent = {
          ...validEvent,
          sort_order: 'This is not a number' as any,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.MissingData) // sanitized to 0
      })
      it('should return ErrorCode.MissingData when event object is null', () => {
        const result = validateEvent(null as any)
        expect(result).toBe(ErrorCode.MissingData)        
      })      
    })

    describe('validateEvent function - invalild data', () => { 
      it('should return ErrorCode.InvalidData when event_name exceeds max length', () => { 
        const invalidEvent = {
          ...validEvent,
          event_name: 'This event name is way too long and should exceed the maximum length allowed',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)        
      })
      it('should return ErrorCode.InvalidData when team_size is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          team_size: 123456789,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when team_size is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          team_size: -1,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when games is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          games: 123456789,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when games is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          games: -1,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when added_money is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          added_money: '123456789',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when added_money is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          added_money: '-1',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when entry_fee is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          entry_fee: '123456789',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when entry_fee is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          entry_fee: '-1',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when lineage is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          lineage: '123456789',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when lineage is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          lineage: '-1',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when prize_fund is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          prize_fund: '123456789',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when prize_fund is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          prize_fund: '-1',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when other is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          other: '123456789',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when other is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          other: '-1',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })      
      it('should return ErrorCode.InvalidData when expenses is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          expenses: '123456789',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when expenses is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          expenses: '-1',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when lpox is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          lpox: '123456789',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when lpox is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          lpox: '-1',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })      
      it('should return ErrorCode.InvalidData when sort_order is over max', () => { 
        const invalidEvent = {
          ...validEvent,
          sort_order: maxSortOrder + 1,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when sort_order is under min', () => { 
        const invalidEvent = {
          ...validEvent,
          sort_order: -1,
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })
      it('should return ErrorCode.InvalidData when entry_fee !== linage + prize_fund + other + expenses', () => { 
        const invalidEvent = {
          ...validEvent,
          entry_fee: '99',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })  
      it('should return ErrorCode.InvalidData when entry_fee !== lpox', () => { 
        const invalidEvent = {
          ...validEvent,
          lpox: '99',
        }
        const result = validateEvent(invalidEvent)
        expect(result).toBe(ErrorCode.InvalidData)
      })        
    })
  })

  describe('validPostId function', () => { 
    const testEventId = "evt_cb97b73cb538418ab993fc867f860510"
    it('should return testEventId when id starts with post Secret and follows with a valid event id', () => { 
      const validId = nextPostSecret + testEventId;
      expect(validPostId(validId, 'evt')).toBe(testEventId)
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
      expect(validPostId(invalidId, 'evt')).toBe('');
    });
    it('should return "" when id starts with postSecret but does not follow with a valid BtDb id', () => {
      const invalidId = process.env.POST_SECRET + 'evt_invalidid';
      expect(validPostId(invalidId, 'evt')).toBe('');
    });
    it('should return "" when id does not start with postSecret', () => {
      const invalidId = testEventId;
      expect(validPostId(invalidId, 'evt')).toBe('');
    });
  })

})