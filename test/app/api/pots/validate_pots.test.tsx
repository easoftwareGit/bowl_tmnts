import {
  sanitizePot,
  validatePot,
  validPotType,
  validPotMoney,
  validPotFkId,
  exportedForTesting
} from "@/app/api/pots/validate";
import { initPot } from "@/db/initVals";
import { PotCategories, potType } from "@/lib/types/types";
import { ErrorCode, validPostId } from "@/lib/validation";
import { postSecret } from "@/lib/tools";

const { gotPotData, validPotData } = exportedForTesting;

const validPot = {
  ...initPot,
  div_id: 'div_f30aea2c534f4cfe87f4315531cef8ef',
  squad_id: 'sqd_7116ce5f80164830830a7157eb093396',
  pot_type: 'Game',
  fee: '20',
  sort_order: 1,
} as potType;

describe("tests for pot validation", () => { 

  describe('gotPotData function', () => {
    it('should return ErrorCode.None when all data is valid', () => {
      expect(gotPotData(validPot)).toBe(ErrorCode.None);
    })
    it('should return ErrorCode.MissingData when div_id is missing', () => {
      const testPot = {
        ...validPot,
        div_id: ''
      }
      expect(gotPotData(testPot)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when squad_id is missing', () => {
      const testPot = {
        ...validPot,
        squad_id: ''
      }
      expect(gotPotData(testPot)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when pot_type is missing', () => {
      const testPot = {
        ...validPot,
        pot_type: '' as PotCategories
      }
      expect(gotPotData(testPot)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when fee is missing', () => {
      const testPot = {
        ...validPot,
        fee: ''
      }
      expect(gotPotData(testPot)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when sort_order is missing', () => {
      const testPot = {
        ...validPot,
        sort_order: null as any
      }
      expect(gotPotData(testPot)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when passed null', () => {
      expect(gotPotData(null as any)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when passed undefined', () => {
      expect(gotPotData(undefined as any)).toBe(ErrorCode.MissingData);
    })
  })

  describe('validPotType function', () => {
    it('should return true when pot_type is valid', () => {
      expect(validPotType('Game')).toBe(true);
      expect(validPotType('Last Game')).toBe(true);
      expect(validPotType('Series')).toBe(true);
    })
    it('should return false when pot_type is invalid', () => {
      expect(validPotType('')).toBe(false);
      expect(validPotType('Invalid' as any)).toBe(false);
      expect(validPotType('<script>alert(1)</script>' as any)).toBe(false);
    })
    it('should return false when passed null', () => {
      expect(validPotType(null as any)).toBe(false);
    })    
    it('should return false when passed undefined', () => {
      expect(validPotType(undefined as any)).toBe(false);
    })
  })

  describe('validPotMoney function', () => {
    it('should return true when money is valid', () => {
      expect(validPotMoney('5')).toBe(true);      
      expect(validPotMoney('1.5')).toBe(true);
      expect(validPotMoney('5.55')).toBe(true);
    })
    it('should return false when money is invalid', () => {
      expect(validPotMoney('')).toBe(false);
      expect(validPotMoney('0')).toBe(false);
      expect(validPotMoney('0.99')).toBe(false);
      expect(validPotMoney('0.0005')).toBe(false);      
      expect(validPotMoney('1234567890')).toBe(false);
      expect(validPotMoney('$5.55')).toBe(false);
      expect(validPotMoney('5,55')).toBe(false);
      expect(validPotMoney('5.5.5')).toBe(false);
      expect(validPotMoney('-5')).toBe(false);
      expect(validPotMoney('-0.5')).toBe(false);
      expect(validPotMoney('-5.55')).toBe(false);
      expect(validPotMoney('(5.55)')).toBe(false)
      expect(validPotMoney('abc')).toBe(false);
      expect(validPotMoney('<script>alert(1)</script>' as any)).toBe(false);
    })
    it('should return false when passed null', () => {
      expect(validPotMoney(null as any)).toBe(false);
    })    
    it('should return false when passed undefined', () => {
      expect(validPotMoney(undefined as any)).toBe(false);
    })
  })

  describe("validPotFkId function", () => {
    it("should return true for valid tmnt_id", () => {
      expect(validPotFkId(validPot.div_id, "div")).toBe(true);
      expect(validPotFkId(validPot.squad_id, "sqd")).toBe(true);
    });
    it("should return false for invalid foreign key id", () => {
      expect(validPotFkId("abc_def", "div")).toBe(false);
    });
    it("should return false if foreign key id type does not match id type", () => {
      expect(validPotFkId(validPot.div_id, "usr")).toBe(false);
    });
    it("should return false for an empty foreign key id", () => {
      expect(validPotFkId("", "bwl")).toBe(false);
    });
    it("should return false for an null foreign key id", () => {
      expect(validPotFkId(null as any, "div")).toBe(false);
    });
    it("should return false for an null key type", () => {
      expect(validPotFkId(validPot.div_id, null as any)).toBe(false);
    });
  });

  describe('validPotData function', () => {
    it('should return ErrorCode.None for valid pot data', () => {
      expect(validPotData(validPot)).toBe(ErrorCode.None);
    })
    it('should return ErrorCode.InvalidData when div_id is empty', () => {
      const testPot = {
        ...validPot,
        div_id: ''
      }
      expect(validPotData(testPot)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when div_id is invalid', () => {
      const testPot = {
        ...validPot,
        div_id: 'abc'
      }
      expect(validPotData(testPot)).toBe(ErrorCode.InvalidData);
    })
    it("should return ErrorCode.InvalidData when div_id is valid, but not div type", () => {
      const testPot = {
        ...validPot,
        div_id: 'usr_12345678901234567890123456789012'
      }
      expect(validPotData(testPot)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when squad_id is empty', () => {
      const testPot = {
        ...validPot,
        squad_id: ''
      }
      expect(validPotData(testPot)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when squad_id is invalid', () => {
      const testPot = {
        ...validPot,
        squad_id: 'abc'
      }
      expect(validPotData(testPot)).toBe(ErrorCode.InvalidData);
    })
    it("should return ErrorCode.InvalidData when squad_id is valid, but not div type", () => {
      const testPot = {
        ...validPot,
        squad_id: 'usr_12345678901234567890123456789012'
      }
      expect(validPotData(testPot)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when fee is invalid', () => {
      const testPot = {
        ...validPot,
        fee: '-1'
      }
      expect(validPotData(testPot)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when fee is missing', () => {
      const testPot = {
        ...validPot,
        fee: null as any
      }
      expect(validPotData(testPot)).toBe(ErrorCode.InvalidData);      
    })
    it('should return ErrorCode.InvalidData when sort_order is invalid', () => {
      const testPot = {
        ...validPot,
        sort_order: -1
      }
      expect(validPotData(testPot)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when passed null', () => {
      expect(validPotData(null as any)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when passed undefined', () => {
      expect(validPotData(undefined as any)).toBe(ErrorCode.InvalidData);
    })
  })

  describe('sanitizePot function', () => { 
    it('should return sanitized pot when pot is already sanitized', () => {
      const testPot = {
        ...validPot
      }
      const sanitizedPot = sanitizePot(testPot)
      expect(sanitizedPot.div_id).toEqual(testPot.div_id)
      expect(sanitizedPot.squad_id).toEqual(testPot.squad_id)
      expect(sanitizedPot.pot_type).toEqual(testPot.pot_type)
      expect(sanitizedPot.fee).toEqual(testPot.fee)
      expect(sanitizedPot.sort_order).toEqual(testPot.sort_order)
    })
    it('should return sanitized pot when pot is not already sanitized', () => {
      // no numerical fields
      const testPot = {
        ...initPot,
        div_id: "abc_123",
        squad_id: "usr_12345678901234567890123456789012",
        pot_type: "test" as any, 
        fee: "1234567890",        
      }
      const sanitizedPot = sanitizePot(testPot)
      expect(sanitizedPot.div_id).toEqual('')
      expect(sanitizedPot.squad_id).toEqual('')
      expect(sanitizedPot.pot_type).toEqual('')
      expect(sanitizedPot.fee).toEqual('')      
    })
    it('should return sanitized pot when pot numerical values are null', () => {
      const testPot = {
        ...initPot,
        sort_order: null as any
      }
      const sanitizedPot = sanitizePot(testPot)
      expect(sanitizedPot.sort_order).toBeNull()
    })
    it('should return sanitized pot when pot numerical values are nit numbers', () => {
      const testPot = {
        ...initPot,
        sort_order: 'abc' as any
      }
      const sanitizedPot = sanitizePot(testPot)
      expect(sanitizedPot.sort_order).toBeNull()
    })
    it('should return sanitized pot when pot numerical values are to low', () => {
      const testPot = {
        ...initPot,
        sort_order: 0
      }
      const sanitizedPot = sanitizePot(testPot)
      expect(sanitizedPot.sort_order).toBe(0)
    })
    it('should return sanitized pot when pot numerical values are too high', () => {
      const testPot = {
        ...initPot,
        sort_order: 1234567
      }
      const sanitizedPot = sanitizePot(testPot)
      expect(sanitizedPot.sort_order).toBe(1234567)
    })

    it("should return null when passed null event", () => {
      const result = sanitizePot(null as any);
      expect(result).toBe(null);
    });
    it("should return null when passed undefined event", () => {
      const result = sanitizePot(undefined as any);
      expect(result).toBe(null);
    });
  })

  describe('validatePot function', () => {

    describe('validatePot function - valid data', () => { 
      it('should return ErrorCode.None when all data is valid', () => { 
        expect(validatePot(validPot)).toBe(ErrorCode.None);
      })
      it('should return ErrorCode.None when all fields are properly sanitized', () => { 
        const validTestPot = {
          ...validPot,
          fee: '20.000',
          pot_type: '  Game** ' as any,
        }
        expect(validatePot(validTestPot)).toBe(ErrorCode.None);
      })
    })

    describe('validatePot function - missing data', () => { 
      it('should return ErrorCode.MissingData when div_id is missing', () => {
        const testPot = {
          ...validPot,
          div_id: null as any
        }
        expect(validatePot(testPot)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when squad_id is empty', () => {
        const testPot = {
          ...validPot,
          squad_id: ''
        }
        expect(validatePot(testPot)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when pot_type is empty', () => {
        const testPot = {
          ...validPot,
          pot_type: '' as any
        }
        expect(validatePot(testPot)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when fee is empty', () => {
        const testPot = {
          ...validPot,
          fee: '' as any
        }
        expect(validatePot(testPot)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when sort_order is empty', () => {
        const testPot = {
          ...validPot,
          sort_order: null as any
        }
        expect(validatePot(testPot)).toBe(ErrorCode.MissingData);
      })  
    })

    describe('validatePot function - invalid data', () => { 
      it('should return ErrorCode.InvalidData when div_id is invalid', () => {
        const testPot = {
          ...validPot,
          div_id: 'abd_123'
        }
        expect(validatePot(testPot)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when squad_id is invalid', () => {
        const testPot = {
          ...validPot,
          squad_id: 'div_7116ce5f80164830830a7157eb093396' as any
        }
        expect(validatePot(testPot)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when pot_type is invalid', () => {
        const testPot = {
          ...validPot,
          pot_type: 'Test' as any
        }
        expect(validatePot(testPot)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when fee is invalid', () => {
        const testPot = {
          ...validPot,
          fee: '-1' as any
        } 
        expect(validatePot(testPot)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when sort_order is invalid', () => {
        const testPot = {
          ...validPot,
          sort_order: -1
        }
        expect(validatePot(testPot)).toBe(ErrorCode.InvalidData);
      })
    })
  })

  describe("validPostId function", () => {
    const testPotId = "pot_cb97b73cb538418ab993fc867f860510";
    it("should return testPotId when id starts with post Secret and follows with a valid pot id", () => {
      const validId = postSecret + testPotId;
      expect(validPostId(validId, "pot")).toBe(testPotId);
    });
    it('should return "" when id starts with postSecret but does idType does not match idtype in postId', () => {
      const invalidId = postSecret + testPotId;
      expect(validPostId(invalidId, "usr")).toBe("");
    });
    it('should return "" when id starts with postSecret but does idType is invalid', () => {
      const invalidId = postSecret + testPotId;
      expect(validPostId(invalidId, "123" as any)).toBe("");
    });
    it('should return "" when id starts with postSecret but does not follow with valid BtDb idType', () => {
      const invalidId = postSecret + "abc_a1b2c3d4e5f678901234567890abcdef";
      expect(validPostId(invalidId, "pot")).toBe("");
    });
    it('should return "" when id starts with postSecret but does not follow with a valid BtDb id', () => {
      const invalidId = postSecret + "evt_invalidid";
      expect(validPostId(invalidId, "pot")).toBe("");
    });
    it('should return "" when id does not start with postSecret', () => {
      const invalidId = testPotId;
      expect(validPostId(invalidId, "pot")).toBe("");
    });
  });

})