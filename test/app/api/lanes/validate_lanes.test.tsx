import {
  sanitizeLane,
  validateLane,
  validLaneNumber,
  validEventFkId,
  exportedForTesting,
} from "@/app/api/lanes/validate";
import { initLane } from "@/db/initVals";
import { ErrorCode, maxEventLength, maxLaneCount, maxSortOrder, validPostId } from "@/lib/validation";
import { nextPostSecret } from "@/lib/tools";

const { gotLaneData, validLaneData } = exportedForTesting;

const validLane = {
  ...initLane,  
  lane_number: 29,
  squad_id: "sqd_7116ce5f80164830830a7157eb093396",
}

describe("tests for lane validation", () => { 

  describe('getLaneData function', () => {
    it('should return ErrorCode.None when all data is valid', () => { 
      expect(gotLaneData(validLane)).toBe(ErrorCode.None);
    })
    it('should return ErrorCode.MissingData when squad_id is missing', () => {
      const testLane = {
        ...validLane,
        squad_id: null as any
      }
      expect(gotLaneData(testLane)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when lane_number is missing', () => {
      const testLane = {
        ...validLane,
        lane_number: null as any
      }
      expect(gotLaneData(testLane)).toBe(ErrorCode.MissingData);
    })
  })

  describe('validLaneNumber function', () => { 
    it('should return true when lane_number is valid', () => {
      expect(validLaneNumber(1)).toBe(true) // odd
      expect(validLaneNumber(2)).toBe(true) // even
    })
    it('should return false when lane_number is too low', () => {
      expect(validLaneNumber(0)).toBe(false)
    })
    it('should return false when lane_number is too high', () => {
      expect(validLaneNumber(maxLaneCount + 1)).toBe(false)
    })
    it('should return false when lane_number is not an integer', () => {
      expect(validLaneNumber(5.5)).toBe(false)
    })
    it('should return false when lane_number is null', () => {
      expect(validLaneNumber(null as any)).toBe(false)
    })
    it('should return false when lane_number is undefined', () => {
      expect(validLaneNumber(undefined as any)).toBe(false)
    })
  })

  describe('validEventFkId function', () => { 
    it('should return true for valid event_id', () => {
      expect(validEventFkId(validLane.squad_id, 'sqd')).toBe(true)
    })
    it('should return false for invalid foreign key id', () => {
      expect(validEventFkId('abc_def', 'sqd')).toBe(false)
    })
    it('should return false if foreign key id type does not match id type', () => { 
      expect(validEventFkId(validLane.squad_id, 'usr')).toBe(false)
    })
    it('should return false for an empty foreign key id', () => { 
      expect(validEventFkId('', 'sqd')).toBe(false)      
    })
    it('should return false for an null foreign key id', () => { 
      expect(validEventFkId(null as any, 'sqd')).toBe(false)
    })
    it('should return false for an null key type', () => { 
      expect(validEventFkId(validLane.squad_id, null as any)).toBe(false)
    })
  })  

  describe('validLaneData function', () => { 
    it('should return ErrorCode.None when all data is valid', () => { 
      expect((validLaneData(validLane))).toBe(ErrorCode.None);
    })
    it('should return ErrorCode.InvalidData when lane_number is missing', () => {
      const testLane = {
        ...validLane,
        lane_number: 201
      }
      expect(validLaneData(testLane)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when squad_id is invalid', () => {
      const testLane = {
        ...validLane,
        squad_id: 'abc_123'
      }
      expect(validLaneData(testLane)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when squad_id is valid id, but wrong type', () => {
      const testLane = {
        ...validLane,
        squad_id: 'usr_12345678901234567890123456789012'
      }
      expect(validLaneData(testLane)).toBe(ErrorCode.InvalidData);
    })

  })

  describe('sanitizeLane function', () => { 
    it('should return a sanitized laneType when lanetype is already sanitized', () => {
      const testLane = {
        ...validLane,
      }
      const sanitizedLane = sanitizeLane(testLane)
      expect(sanitizedLane).toEqual(testLane)
    })
    it('should return a sanitized laneType when lanetype is NOT already sanitized', () => {
      const testLane = {
        ...validLane,
        lane_number: 204,
        squad_id: 'abc_123'
      }
      const sanitizedLane = sanitizeLane(testLane)
      expect(sanitizedLane.lane_number).toEqual(1)
      expect(sanitizedLane.squad_id).toEqual('1')
    })    
    it('should return null when pass a null lane', () => {
      expect(sanitizeLane(null as any)).toBe(null)
    })
    it('should return null when pass an undefined lane', () => {
      expect(sanitizeLane(undefined as any)).toBe(null)
    })    
  })

  describe('validateLane function', () => { 

    describe('validLane function - valid data', () => { 
      it('should return ErrorCode.None when all data is valid', () => { 
        expect(validateLane(validLane)).toBe(ErrorCode.None);
      })
      // no test for sanitized data, since there is no strings to sanitize
    })

    describe('validLane function - missing data', () => { 
      it('should return ErrorCode.MissingData when lane_number is missing', () => {
        const testLane = {
          ...validLane,
          lane_number: null as any
        }
        expect(validateLane(testLane)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when squad_id is missing', () => {
        const testLane = {
          ...validLane,
          squad_id: null as any
        }
        expect(validateLane(testLane)).toBe(ErrorCode.MissingData);
      })
    })

    describe('validLane function - invalid data', () => { 
      it('should return ErrorCode.InvalidData when lane_number is invalid', () => {
        const testLane = {
          ...validLane,
          lane_number: 201
        }
        expect(validateLane(testLane)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when squad_id is invalid', () => {
        const testLane = {
          ...validLane,
          squad_id: 'abc_123'
        }
        expect(validateLane(testLane)).toBe(ErrorCode.InvalidData);
      })
    })  
  })

  describe('validPostId function', () => { 
    const testId = "lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d"
    it('should return testId when id starts with post Secret and follows with a valid lane id', () => { 
      const validId = nextPostSecret + testId;
      expect(validPostId(validId, 'lan')).toBe(testId)
    })
    it('should return "" when id starts with postSecret but does idType does not match idtype in postId', () => {
      const invalidId = nextPostSecret + testId;
      expect(validPostId(invalidId, 'usr')).toBe('');
    });
    it('should return "" when id starts with postSecret but does idType is invalid', () => {
      const invalidId = nextPostSecret + testId;
      expect(validPostId(invalidId, '123' as any)).toBe('');
    });
    it('should return "" when id starts with postSecret but does not follow with valid BtDb idType', () => {
      const invalidId = nextPostSecret + 'abc_a1b2c3d4e5f678901234567890abcdef';
      expect(validPostId(invalidId, 'lan')).toBe('');
    });
    it('should return "" when id starts with postSecret but does not follow with a valid BtDb id', () => {
      const invalidId = process.env.POST_SECRET + 'lan_invalidid';
      expect(validPostId(invalidId, 'lan')).toBe('');
    });
    it('should return "" when id does not start with postSecret', () => {
      const invalidId = testId;
      expect(validPostId(invalidId, 'lan')).toBe('');
    });
  })
})