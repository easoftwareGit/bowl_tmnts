import {
  sanitizeElim,
  validateElim,
  validStart,
  validGames,
  validElimFkId,
  validElimMoney,
  exportedForTesting
} from "@/app/api/elims/validate";
import { initElim } from "@/db/initVals";
import { elimType } from "@/lib/types/types";
import { ErrorCode, minGames, maxGames, validPostId } from "@/lib/validation";
import { postSecret } from "@/lib/tools";

const { gotElimData, validElimData } = exportedForTesting;

const validElim = {
  ...initElim,
  id: "elm_45d884582e7042bb95b4818ccdd9974c",
  squad_id: "sqd_7116ce5f80164830830a7157eb093396",
  div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
  sort_order: 1,
  start: 1,
  games: 3,
  fee: '5',
} as elimType;

describe("tests for eliminator validation", () => { 

  describe('gotElimData function', () => {
    it('should return ErrorCode.None when all data is present', () => { 
      expect(gotElimData(validElim)).toBe(ErrorCode.None);
    })
    it('should return ErrorCode.MissingData when div_id is missing', () => {
      const testElim = {
        ...validElim,
        div_id: null as any
      }
      expect(gotElimData(testElim)).toBe(ErrorCode.MissingData);
    })  
    it('should return ErrorCode.MissingData when squad_id is missing', () => {
      const testElim = {
        ...validElim,
        squad_id: null as any
      }
      expect(gotElimData(testElim)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when start is missing', () => {
      const testElim = {
        ...validElim,
        start: null as any
      }
      expect(gotElimData(testElim)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when games is missing', () => {
      const testElim = {
        ...validElim,
        games: null as any
      }
      expect(gotElimData(testElim)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when fee is missing', () => {
      const testElim = {
        ...validElim,
        fee: ''
      }
      expect(gotElimData(testElim)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData when sort_order is missing', () => {
      const testElim = {
        ...validElim,
        sort_order: null as any
      }
      expect(gotElimData(testElim)).toBe(ErrorCode.MissingData);
    })
  })

  describe('validStart function', () => { 
    it('should return true when start is valid', () => { 
      expect(validStart(1)).toBe(true);
    })
    it('should return false when start is invalid', () => {
      expect(validStart(0)).toBe(false);
      expect(validStart(maxGames + 1)).toBe(false);
      expect(validStart('abc' as any)).toBe(false);
    })
    it('should return false when start is null', () => {
      expect(validStart(null as any)).toBe(false);
    })
    it('should return false when start is undefined', () => {
      expect(validStart(undefined as any)).toBe(false);
    })
  })

  describe('validGames function', () => { 
    it('should return true when start is valid', () => {
      expect(validGames(3)).toBe(true);
    })
    it('should return false when start is invalid', () => {
      expect(validGames(minGames - 1)).toBe(false);
      expect(validGames(maxGames + 1)).toBe(false);
      expect(validGames('abc' as any)).toBe(false);
    })
    it('should return false when start is null', () => {
      expect(validGames(null as any)).toBe(false);
    })
    it('should return false when start is undefined', () => {
      expect(validGames(undefined as any)).toBe(false);
    })
  })

  describe('validBrktMoney function', () => {
    it('should return true when fee is valid', () => {
      expect(validElimMoney('5')).toBe(true);
    })
    it('should return false when fee is invalid', () => {
      expect(validElimMoney('')).toBe(false);
      expect(validElimMoney('-1')).toBe(false);
      expect(validElimMoney('0.9')).toBe(false);
      expect(validElimMoney('1234567890')).toBe(false);
      expect(validElimMoney('abc' as any)).toBe(false);
    })
    it('should return false when fee is null', () => {
      expect(validElimMoney(null as any)).toBe(false);
    })
    it('should return false when fee is undefined', () => {
      expect(validElimMoney(undefined as any)).toBe(false);
    })
  })

  describe("validElimFkId function", () => {
    it("should return true for valid tmnt_id", () => {
      expect(validElimFkId(validElim.div_id, "div")).toBe(true);
      expect(validElimFkId(validElim.squad_id, "sqd")).toBe(true);
    });
    it("should return false for invalid foreign key id", () => {
      expect(validElimFkId("abc_def", "div")).toBe(false);
    });
    it("should return false if foreign key id type does not match id type", () => {
      expect(validElimFkId(validElim.div_id, "usr")).toBe(false);
    });
    it("should return false for an empty foreign key id", () => {
      expect(validElimFkId("", "bwl")).toBe(false);
    });
    it("should return false for an null foreign key id", () => {
      expect(validElimFkId(null as any, "div")).toBe(false);
    });
    it("should return false for an null key type", () => {
      expect(validElimFkId(validElim.div_id, null as any)).toBe(false);
    });
  });

  describe('sanitizeElim function', () => { 
    it('should return sanitized elim for valid eliminator data', () => { 
      const testElim = {
        ...validElim,        
      }
      const sanitizedElim = sanitizeElim(testElim);
      expect(sanitizedElim.div_id).toEqual(testElim.div_id)
      expect(sanitizedElim.squad_id).toEqual(testElim.squad_id)
      expect(sanitizedElim.start).toEqual(testElim.start)
      expect(sanitizedElim.games).toEqual(testElim.games)            
      expect(sanitizedElim.fee).toEqual(testElim.fee)
      expect(sanitizedElim.sort_order).toEqual(testElim.sort_order)
    })
    it('should return sanitized elim when elim is not sanitzed', () => { 
      // no numerical fields
      const testElim = {
        ...initElim,
        div_id: '<script>alert(1)</script>',
        squad_id: "usr_12345678901234567890123456789012",
        fee: '1234567890',
      }
      const sanitizedBrkt = sanitizeElim(testElim);
      expect(sanitizedBrkt.div_id).toEqual('')
      expect(sanitizedBrkt.squad_id).toEqual('')
      expect(sanitizedBrkt.fee).toEqual('')
    })
    it('should return sanitized elim when numerical values are null', () => { 
      const testElim = {
        ...initElim,
        start: null as any,
        games: null as any,
        sort_order: null as any,
      }
      const sanitizedBrkt = sanitizeElim(testElim);
      expect(sanitizedBrkt.start).toBeNull()
      expect(sanitizedBrkt.games).toBeNull()      
      expect(sanitizedBrkt.sort_order).toBeNull()
    })
    it('should return sanitized elim when numerical values are not numbers', () => { 
      const testElim = {
        ...initElim,
        start: 'abc' as any,
        games: ['abc', 'def'] as any,
        sort_order: new Date() as any,
      }
      const sanitizedBrkt = sanitizeElim(testElim);
      expect(sanitizedBrkt.start).toBeNull()
      expect(sanitizedBrkt.games).toBeNull()      
      expect(sanitizedBrkt.sort_order).toBeNull()
    })
    it('should return sanitized elim when numerical values are too low', () => { 
      const testElim = {
        ...initElim,
        start: 0,
        games: 0,
        sort_order: 0
      }
      const sanitizedBrkt = sanitizeElim(testElim);
      expect(sanitizedBrkt.start).toEqual(0)
      expect(sanitizedBrkt.games).toEqual(0)      
      expect(sanitizedBrkt.sort_order).toEqual(0)
    })
    it('should return sanitized elim when numerical values are too high', () => { 
      const testElim = {
        ...initElim,
        start: 100,
        games: 100,
        sort_order: 1234567
      }
      const sanitizedBrkt = sanitizeElim(testElim);
      expect(sanitizedBrkt.start).toEqual(100)
      expect(sanitizedBrkt.games).toEqual(100)      
      expect(sanitizedBrkt.sort_order).toEqual(1234567)
    })

    it('should return sanitized null when passed null', () => {
      expect(sanitizeElim(null as any)).toBe(null);
    })
    it('should return sanitized null when passed undefined', () => {
      expect(sanitizeElim(undefined as any)).toBe(null);
    })
  })

  describe('validateElim function', () => { 

    describe('ValidateElim function - valid eliminator data', () => { 
      it('should return ErrorCode.None for valid eliminator data', () => { 
        expect(validateElim(validElim)).toBe(ErrorCode.None);
      })
      it('should return ErrorCode.None when all fields are properly sanitized', () => { 
        const validTestElim = {
          ...validElim,
          fee: '5.000',
          first: '25.0',
          second: '10.0000',
          admin: '5.00',
        }
        expect(validateElim(validTestElim)).toBe(ErrorCode.None);
      })
    })

    describe('ValidateElim function - missing data', () => { 
      it('should return ErrorCode.MissingData when div_id is missing', () => { 
        const testElim = {
          ...validElim,
          div_id: '',
        }
        expect(validateElim(testElim)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when squad_id is missing', () => { 
        const testElim = {
          ...validElim,
          squad_id: '',
        }
        expect(validateElim(testElim)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when start is missing', () => { 
        const testElim = {
          ...validElim,
          start: null as any,
        }
        expect(validateElim(testElim)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when games is missing', () => { 
        const testElim = {
          ...validElim,
          games: null as any,
        }
        expect(validateElim(testElim)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when fee is missing', () => { 
        const testElim = {
          ...validElim,
          fee: '',
        }
        expect(validateElim(testElim)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when sort_order is missing', () => { 
        const testElim = {
          ...validElim,
          sort_order: null as any,
        }
        expect(validateElim(testElim)).toBe(ErrorCode.MissingData);
      })
    })

    describe('ValidateElim function - invalid data', () => { 
      it('should return ErrorCode.InvalidData when div_id is invalid', () => { 
        const testElim = {
          ...validElim,
          div_id: '<script>alert(1)</script>',
        }
        expect(validateElim(testElim)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when squad_id is invalid', () => { 
        const testElim = {
          ...validElim,
          squad_id: 'abc_123',
        }
        expect(validateElim(testElim)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when start is invalid', () => { 
        const testElim = {
          ...validElim,
          start: -1,
        }
        expect(validateElim(testElim)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when games is invalid', () => { 
        const testElim = {
          ...validElim,
          games: 0,
        }
        expect(validateElim(testElim)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when fee is invalid', () => { 
        const testElim = {
          ...validElim,
          fee: '1234567890',
        }
        expect(validateElim(testElim)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when sort_order is invalid', () => { 
        const testElim = {
          ...validElim,
          sort_order: -1,
        }
        expect(validateElim(testElim)).toBe(ErrorCode.InvalidData);
      })
    })

  })

  describe('validPostId function', () => { 
    const testElimId = "elm_cb97b73cb538418ab993fc867f860510"
    it('should return testElimId when id starts with post Secret and follows with a valid elim id', () => {
      const validId = postSecret + testElimId;
      expect(validPostId(validId, 'elm')).toBe(testElimId);
    })
    it('should return "" when id starts with postSecret but does idType does not match idtype in postId', () => { 
      const invalidId = postSecret + testElimId;
      expect(validPostId(invalidId, 'usr')).toBe('');
    });
    it('should return "" when id starts with postSecret but does idType is invalid', () => { 
      const invalidId = postSecret + testElimId;
      expect(validPostId(invalidId, '123' as any)).toBe('');
    });
    it('should return "" when id starts with postSecret but does not follow with valid BtDb idType', () => { 
      const invalidId = postSecret + 'abc_a1b2c3d4e5f678901234567890abcdef';
      expect(validPostId(invalidId, 'elm')).toBe('');
    });
    it('should return "" when id starts with postSecret but does not follow with a valid BtDb id', () => { 
      const invalidId = postSecret + 'elm_invalidid';
      expect(validPostId(invalidId, 'elm')).toBe('');
    });
    it('should return "" when id does not start with postSecret', () => { 
      const invalidId = testElimId;
      expect(validPostId(invalidId, 'elm')).toBe('');
    });
  })

})
