import { gotTmntData, validateTmnt, validTmntData } from "@/app/api/tmnts/valildate";
import { tmntType } from "@/lib/types/types";
import { mockTmnt } from "../../../mocks/tmnts/mockTmnt";
import { ErrorCode } from "@/lib/validation";

describe('tmnt table data validation', () => { 

  // gotTmntData - checks for missing data 
  // validTmntData - checks for invalid data
  // validateTmnt - checks for missing data and invalid data

  describe('gotTmntData function', () => { 
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
    it('should return missing data error code when no user_id', () => {
      testTmnt = {
        ...mockTmnt,
        user_id: ''
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return missing data error code when no bowl_id', () => {
      testTmnt = {
        ...mockTmnt,
        bowl_id: ''
      }
      expect(gotTmntData(testTmnt)).toBe(ErrorCode.MissingData)
    })
  })

  describe('validTmntData function', () => {
    let testTmnt: tmntType;

    it('should return None error code when valid tmntData object', () => {
      testTmnt = {
        ...mockTmnt,
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.None)
    })
    it('should return invalid data error code when invalid tmnt_name', () => { 
      testTmnt = {
        ...mockTmnt,
        tmnt_name: '1234567890123456789012345678901'
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
        start_date: '01/32/2020'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when no start date and have end date', () => {
      testTmnt = {
        ...mockTmnt,
        start_date: ''
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
        end_date: '02/32/2020'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when no end date and have start date', () => {
      testTmnt = {
        ...mockTmnt,
        end_date: ''
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)      
    })
    it('should return invalid data error code when start_date is after end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: '01/30/2020',
        end_date: '01/29/2020'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when invalid user_id', () => { 
      testTmnt = {
        ...mockTmnt,
        user_id: 'abc'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })    
    it('should return invalid data error code when invalid bowl_id', () => { 
      testTmnt = {
        ...mockTmnt,
        bowl_id: 'abc1234'
      }
      expect(validTmntData(testTmnt)).toBe(ErrorCode.InvalidData)
    })    
  })

  describe('validateTmnt function', () => {
    let testTmnt: tmntType;
    it('should return a None error code when valid tmntData object', () => { 
      testTmnt = {
        ...mockTmnt,
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.None)      
    })
    it('should return missing data error code when no tmnt_name', () => { 
      testTmnt = {
        ...mockTmnt,
        tmnt_name: ''
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return missing data error code when no start_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: ''
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return missing data error code when no end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        end_date: ''
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return missing data error code when no user_id', () => {
      testTmnt = {
        ...mockTmnt,
        user_id: ''
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return missing data error code when no bowl_id', () => {
      testTmnt = {
        ...mockTmnt,
        bowl_id: ''
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)
    })
    it('should return invalid data error code when invalid tmnt_name', () => { 
      testTmnt = {
        ...mockTmnt,
        tmnt_name: '1234567890123456789012345678901'
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when non date start_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: 'abc'
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when invalid start_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: '01/32/2020'
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when no start date and have end date', () => {
      testTmnt = {
        ...mockTmnt,
        start_date: ''
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)      
    })
    it('should return invalid data error code when non date end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        end_date: 'abc'
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when invalid end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        end_date: '02/32/2020'
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when no end date and have start date', () => {
      testTmnt = {
        ...mockTmnt,
        end_date: ''
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.MissingData)      
    })
    it('should return invalid data error code when start_date is after end_date', () => { 
      testTmnt = {
        ...mockTmnt,
        start_date: '01/30/2020',
        end_date: '01/29/2020'
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })
    it('should return invalid data error code when invalid user_id', () => { 
      testTmnt = {
        ...mockTmnt,
        user_id: 'abc'
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })    
    it('should return invalid data error code when invalid bowl_id', () => { 
      testTmnt = {
        ...mockTmnt,
        bowl_id: 'abc1234'
      }
      expect(validateTmnt(testTmnt)).toBe(ErrorCode.InvalidData)
    })    

  })
})