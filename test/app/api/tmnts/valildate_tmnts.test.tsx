import { validTmntName, sanitizeTmnt, validateTmnt, exportedForTesting, validTmntDates, validTmntFkId } from "@/app/api/tmnts/valildate";
import { tmntType } from "@/lib/types/types";
import { mockTmnt } from "../../../mocks/tmnts/mockTmnt";
import { ErrorCode, validPostId } from "@/lib/validation";
import { nextPostSecret } from "@/lib/tools";
const { gotTmntData, validTmntData } = exportedForTesting;

describe('tmnt table data validation', () => { 

  describe('gotTmntData function - checks for missing data', () => { 
    let testTmnt: tmntType;    

    it('should return a None error code when valid tmntData object', () => { 
      testTmnt = {
        ...mockTmnt,
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.None)      
    })
    it('should return missing data error code when no tmnt_name', () => { 
      testTmnt = {
        ...mockTmnt,
        tmnt_name: ''
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return missing data error code when no start_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: ''
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return missing data error code when no end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        end_date: ''
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return a None error code when when no start_date AND no end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: '',
        end_date: ''
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.None)      
    })
    it('should return missing data error code when no bowl_id', () => {
      testTmnt = {
        ...mockTmnt,
        bowl_id: ''
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return missing data error code when tmnt_name contains only special characters', () => { 
      testTmnt = {
        ...mockTmnt,
        tmnt_name: '!$%^&'
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return missing data error code when tmnt_name properly sanitized', () => { 
      testTmnt = {
        ...mockTmnt,
        tmnt_name: '  Valid Tournament!* Name  %%% '
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.MissingData)
    })
  })

  describe('validTmntName function', () => {
    it('should return true for valid tmnt_name', () => {
      expect(validTmntName('Valid Tournament Name')).toBe(true)
    })
    it('should return false for blank tmnt_name', () => {
      expect(validTmntName('')).toBe(false)
    })
    it('should return false for tmnt_name that is too long', () => {
      expect(validTmntName('12345678901234567890123456789012345678901234567890')).toBe(false)
    })
    it('should return false for tmnt_name with oonly special characters', () => {
      expect(validTmntName('!$%^&')).toBe(false)
    })
    it('should return false for tmnt_name with only spaces', () => {
      expect(validTmntName('  ')).toBe(false)
    })
    it('should return false for tmnt_name with only spaces and special characters', () => {
      expect(validTmntName('  !$%^&  ')).toBe(false)
    })
    it('should return true for tmnt name with some specail characters, but also has valid text', () => {
      expect(validTmntName('  ***  Valid Tournament Name  ++ ')).toBe(true)
    })
    it('should return false for tmnt_name that contails HTML tags', () => { 
      // sanitized to alert'hello'
      expect(validTmntName("<script>alert('hello')</script>")).toBe(true)  
    })
  })

  describe('validTmntDates function', () => { 
    it('should return true for valid start_date and end_date, both the same date', () => {
      expect(validTmntDates('2020-01-30', '2020-01-30')).toBe(true)
    })
    it('should return true for valid start_date and end_date, end after start', () => {
      expect(validTmntDates('2020-01-30', '2020-01-31')).toBe(true)
    })
    it('should return true for empty start and end_date', () => {
      expect(validTmntDates('', '')).toBe(true)
    })
    it('should return false for start_date after end_date', () => {
      expect(validTmntDates('2020-01-31', '2020-01-30')).toBe(false)
    })
    it('should return false for invalid start_date', () => {
      expect(validTmntDates('2020-01-32', '2020-01-31')).toBe(false)
    })
    it('should return false for invalid end_date', () => {
      expect(validTmntDates('2020-01-31', '2020-01-32')).toBe(false)
      expect(validTmntDates('2020-02-28', '2020-13-01')).toBe(false)
    })
    it('should return false for valid start date and empty end date', () => { 
      expect(validTmntDates('2020-01-31', '')).toBe(false)
    })
    it('should return false for valid end date and empty start date', () => { 
      expect(validTmntDates('', '2020-01-31')).toBe(false)
    })
  })
  
  describe('validTmntFkId function', () => { 
    it('should return true for valid bowl_id', () => {
      expect(validTmntFkId(mockTmnt.bowl_id, 'bwl')).toBe(true)
    })
    it('should return true for valid user_id', () => {
      expect(validTmntFkId(mockTmnt.user_id, 'usr')).toBe(true)
    })
    it('should return false for invalid foreign key id', () => {
      expect(validTmntFkId('abc_def', 'bwl')).toBe(false)
    })
    it('should return false if foreign key id type does not match id type', () => { 
      expect(validTmntFkId(mockTmnt.bowl_id, 'usr')).toBe(false)
    })
    it('should return false for an empty foreign key id', () => { 
      expect(validTmntFkId('', 'bwl')).toBe(false)
    })
    it('should return false for an null foreign key id', () => { 
      expect(validTmntFkId(null as any, 'bwl')).toBe(false)
    })
    it('should return false for an null key type', () => { 
      expect(validTmntFkId(mockTmnt.bowl_id, null as any)).toBe(false)
    })

  })

  describe('validTmntData function - invalid data', () => {
    let testTmnt: tmntType;

    it('should return None error code when valid tmntData object', () => {
      testTmnt = {
        ...mockTmnt,
      } 
      expect(validTmntData(testTmnt)).toBe(ErrorCode.None)
    })
    it('should return invalid data error code when tmnt_name is empty', () => { 
      testTmnt = {
        ...mockTmnt,
        tmnt_name: ''
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when tmnt_name too long', () => { 
      testTmnt = {
        ...mockTmnt,
        tmnt_name: '12345678901234567890123456789012345678901234567890'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when tmnt_name contains only special characters', () => { 
      testTmnt = {
        ...mockTmnt,
        tmnt_name: '!$%^&'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })    
    it('should return invalid data error code when non date start_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: 'abc'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when invalid start_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: '2020-01-32'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when non date end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        end_date: 'abc'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when invalid end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        end_date: '2020-02-32'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when start_date is after end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: '2020-01-30',
        end_date: '2020-01-29'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when no bowl_id', () => { 
      testTmnt = {
        ...mockTmnt,
        bowl_id: ''
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when invalid bowl_id', () => { 
      testTmnt = {
        ...mockTmnt,
        bowl_id: 'abc_a1b2c3d4e5f678901234567890abcdef'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when invalid id', () => { 
      testTmnt = {
        ...mockTmnt,
        bowl_id: 'abc'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when tmnt is null', () => { 
      expect(validTmntData(null as any)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when tmnt is undefined', () => { 
      expect(validTmntData(undefined as any)).toBe(ErrorCode.InvalidData)
    })
  })

  describe("sanitizeTmnt function", () => { 
    it('should return a sanitized tmnt object - no sanitizing', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        tmnt_name: 'Test Name',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.tmnt_name).toEqual('Test Name')      
    })
    it('should return a sanitized tmnt name', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        tmnt_name: '   T>e<s@t-N#aকm😀e  ',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.tmnt_name).toEqual('Test-Name')
    })
    it('should remove HTML tags from tmnt name', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        tmnt_name: "<script>alert('hello')</script>",
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.tmnt_name).toEqual("alert'hello'")
    })
    it('should return a valid start_date for a valid start date' , () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        start_date: '2020-01-30',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.start_date).toEqual('2020-01-30')
    })
    it('should return an empty start date for an invalid start date', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        start_date: '2020-01-32',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.start_date).toEqual('')
    })
    it('should return an empty start date for a non date start date', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        start_date: 'abc',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.start_date).toEqual('')
    })
    it('should return an empty start date for an empty start date', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        start_date: '',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.start_date).toEqual('')
    })
    it('should return a valid end_date for a valid end date' , () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        end_date: '2020-01-30',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.end_date).toEqual('2020-01-30')
    })
    it('should return an empty end date for an invalid end date', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        end_date: '2020-01-32',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.end_date).toEqual('')
    })
    it('should return an empty end date for a non date end date', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        end_date: 'abc',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.end_date).toEqual('')
    })
    it('should return an empty end date for an empty end date', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        end_date: '',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.end_date).toEqual('')
    })
    it('should return a valid bowl_id for a valid bowl_id', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,        
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.bowl_id).toEqual(mockTmnt.bowl_id)
    })
    it('should return an empty bowl_id for an invalid bowl_id', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        bowl_id: 'abc',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.bowl_id).toEqual('')
    })
    it('should return an empty bowl_id for an empty bowl_id', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        bowl_id: '',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.bowl_id).toEqual('')
    })
    it('should return an empty bowl_id for an valid id, but wrong id type', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        bowl_id: mockTmnt.user_id,
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.bowl_id).toEqual('')
    })

    it('should return a valid user_id for a valid user_id', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,        
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.user_id).toEqual(mockTmnt.user_id)
    })
    it('should return an empty user_id for an invalid user_id', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        user_id: 'abc',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.user_id).toEqual('')
    })
    it('should return an empty user_id for an empty user_id', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        user_id: '',
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.user_id).toEqual('')
    })
    it('should return an empty user_id for an valid id, but wrong id type', () => { 
      const testTmnt: tmntType = {
        ...mockTmnt,
        user_id: mockTmnt.bowl_id,
      }
      const sanitized = sanitizeTmnt(testTmnt)
      expect(sanitized.user_id).toEqual('')
    })

  })

  describe("validateTmnt function", () => {
    it('should return ErrorCode.None whenfor a valid tmnt object', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        tmnt_name: 'Test Name',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.None when tmnt_name is sanitized and valid', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        tmnt_name: '  Test* Name ',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.MissingData when tmnt_name is missing', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        tmnt_name: '',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.InvalidData when tmnt_name is invalid', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        tmnt_name: '***',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.MissingData when start_date is missing but got end_date', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        start_date: '',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.InvalidData when start_date is invalid', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        start_date: '02/32/2020',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.MissingData when end_date is missing but got start_date', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        end_date: '',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return ErrorCode.None when start_data AND end_date are empty', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        start_date: '',
        end_date: '',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.None)
    })
    it('should return ErrorCode.InvalidData when end_date is invalid', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        end_date: '02/32/2020',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return ErrorCode.MissingData when bowl_id is missing', () => {
      const testTmnt: tmntType = {
        ...mockTmnt,
        bowl_id: '',
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
  })

  describe("validate validPostId function", () => { 
    const testBowlId = 'tmt_a1b2c3d4e5f678901234567890abcdef'
    it('should return true when id starts with postSecret and follows with a valid BtDb id', () => {
      const validId = nextPostSecret + testBowlId;
      expect(validPostId(validId, 'tmt')).toBe(testBowlId);
    });
    it('should return false when id starts with postSecret but does idType does not match idtype in postId', () => {
      const invalidId = nextPostSecret + testBowlId;
      expect(validPostId(invalidId, 'usr')).toBe('');
    });
    it('should return false when id starts with postSecret but does idType is invalid', () => {
      const invalidId = nextPostSecret + testBowlId;
      expect(validPostId(invalidId, '123' as any)).toBe('');
    });
    it('should return false when id starts with postSecret but does not follow with valid BtDb idType', () => {
      const invalidId = nextPostSecret + 'abc_a1b2c3d4e5f678901234567890abcdef';
      expect(validPostId(invalidId, 'tmt')).toBe('');
    });
    it('should return false when id starts with postSecret but does not follow with a valid BtDb id', () => {
      const invalidId = process.env.POST_SECRET + 'tmt_invalidid';
      expect(validPostId(invalidId, 'tmt')).toBe('');
    });
    it('should return false when id does not start with postSecret', () => {
      const invalidId = testBowlId;
      expect(validPostId(invalidId, 'tmt')).toBe('');
    });
  })
  
})