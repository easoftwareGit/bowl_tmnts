import {
  sanitizeDiv,
  validateDiv,
  validDivName,
  validHdcpPer,
  validHdcpFrom,
  validIntHdcp,
  validDivFkId,
  exportedForTesting,
  validHdcpFor
} from "@/app/api/divs/validate";
import { defaultHdcpPer, initDiv } from "@/db/initVals";
import { nextPostSecret } from "@/lib/tools";
import { divType } from "@/lib/types/types";
import { ErrorCode, maxEventLength, maxSortOrder, validPostId } from "@/lib/validation";

const { gotDivData, validDivData } = exportedForTesting;

const validScratchDiv: divType = {
  ...initDiv,
  tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
  div_name: 'Scratch',
  hdcp_per: 0,
  hdcp_from: 230,
  int_hdcp: true,
  hdcp_for: 'Game',
  sort_order: 1,
}
const validHdcpDiv: divType = {
  ...initDiv,
  tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
  id: '2',
  div_name: 'Hdcp',
  hdcp_per: 0.90,
  hdcp_from: 230,
  int_hdcp: true,
  hdcp_for: 'Game',
  sort_order: 2,
}

describe('tests for div validation', () => { 

  describe('gotDivData function', () => { 
    
    it('should return ErrorCode.None for valid data - scratch', () => {
      expect(gotDivData(validScratchDiv)).toBe(ErrorCode.None);
    })
    it('should return ErrorCode.None for valid data - hdcp', () => {
      expect(gotDivData(validHdcpDiv)).toBe(ErrorCode.None);
    })
    it('should return ErrorCode.MissingData for missing div_name', () => {
      const invalidDiv = {
        ...validScratchDiv,
        div_name: '',
      }
      expect(gotDivData(invalidDiv)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData for missing hdcp', () => {
      const invalidDiv = {
        ...validHdcpDiv,
        hdcp_per: null as any,
      }
      expect(gotDivData(invalidDiv)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData for missing hdcp_from', () => {
      const invalidDiv = {
        ...validHdcpDiv,
        hdcp_from: null as any,
      }
      expect(gotDivData(invalidDiv)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData for missing int_hdcp', () => {
      const invalidDiv = {
        ...validHdcpDiv,
        int_hdcp: null as any,
      }
      expect(gotDivData(invalidDiv)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData for missing hdcp_for', () => {
      const invalidDiv = {
        ...validHdcpDiv,
        hdcp_for: null as any,
      }
      expect(gotDivData(invalidDiv)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData for missing sort_order', () => {
      const invalidDiv = {
        ...validHdcpDiv,
        sort_order: null as any,
      }
      expect(gotDivData(invalidDiv)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData for missing tmnt_id', () => {
      const invalidDiv = {
        ...validHdcpDiv,
        tmnt_id: null as any,
      }
      expect(gotDivData(invalidDiv)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData for div_name all special characters', () => {
      const invalidDiv = {
        ...validHdcpDiv,
        div_name: '*****((()))',
      }
      expect(gotDivData(invalidDiv)).toBe(ErrorCode.MissingData);
    })
    it('should return ErrorCode.MissingData for invalid hdcp_for', () => {
      const invalidDiv = {
        ...validHdcpDiv,
        hdcp_for: 'Test' as any,
      }
      expect(gotDivData(invalidDiv)).toBe(ErrorCode.MissingData);
    })

  })

  describe('validDivName function', () => {    
    it('should return true when valid', () => { 
      expect(validDivName('Scratch')).toBe(true);
      expect(validDivName('Hdcp')).toBe(true);
      expect(validDivName('50+')).toBe(true); // allow '+' 
    })
    it('should return false when over max length', () => { 
      expect(validDivName('Scratch'.repeat(10))).toBe(false);      
    })
    it('should return false when empty', () => { 
      expect(validDivName('')).toBe(false);      
    })
    it('should sanitize div name', () => { 
      expect(validDivName('<script>alert(1)</script>')).toBe(true); // sanitizes to 'alert1'   
    })
    it('should return false when passed null', () => { 
      expect(validDivName(null as any)).toBe(false);      
    })
    it('should return false when passed undefined', () => { 
      expect(validDivName(undefined as any)).toBe(false);      
    })
  })

  describe('validHdcp function', () => {    
    it('should return true when valid', () => { 
      expect(validHdcpPer(1)).toBe(true);
      expect(validHdcpPer(0.9)).toBe(true);
      expect(validHdcpPer(0)).toBe(true);      
    })
    it('should return false when out of range', () => { 
      expect(validHdcpPer(-1)).toBe(false);      
      expect(validHdcpPer(200)).toBe(false);      
    })
    it('should return false when passed string', () => { 
      expect(validHdcpPer('1' as any)).toBe(false);
      expect(validHdcpPer('abc' as any)).toBe(false);
    })
    it('should return false when passed null', () => { 
      expect(validHdcpPer(null as any)).toBe(false);      
    })
    it('should return false when passed undefined', () => { 
      expect(validHdcpPer(undefined as any)).toBe(false);      
    })
  })

  describe('validHdcpFrom function', () => {    
    it('should return true when valid', () => { 
      expect(validHdcpFrom(230)).toBe(true);
      expect(validHdcpFrom(0)).toBe(true);
    })
    it('should return false when out of range', () => { 
      expect(validHdcpFrom(-1)).toBe(false);      
      expect(validHdcpFrom(301)).toBe(false);      
    })
    it('should return false when passed string', () => { 
      expect(validHdcpFrom('1' as any)).toBe(false);
      expect(validHdcpFrom('abc' as any)).toBe(false);
    })
    it('should return false when passed null', () => { 
      expect(validHdcpFrom(null as any)).toBe(false);      
    })
    it('should return false when passed undefined', () => { 
      expect(validHdcpFrom(undefined as any)).toBe(false);      
    })
  })

  describe('validIntHdcp function', () => {    
    it('should return true when valid', () => { 
      expect(validIntHdcp(true)).toBe(true);
      expect(validIntHdcp(false)).toBe(true);
    })
    it('should return false when passed string', () => { 
      expect(validIntHdcp('true' as any)).toBe(false);
      expect(validIntHdcp('false' as any)).toBe(false);
    })
    it('should return false when passed null', () => { 
      expect(validIntHdcp(null as any)).toBe(false);      
    })
    it('should return false when passed undefined', () => { 
      expect(validIntHdcp(undefined as any)).toBe(false);      
    })
  })  

  describe('validHdcpFor function', () => {    
    it('should return true when valid', () => { 
      expect(validHdcpFor('Game')).toBe(true);
      expect(validHdcpFor('Series')).toBe(true);
    })
    it('should return false when passed invalid valies', () => { 
      expect(validHdcpFor('Test')).toBe(false);
      expect(validHdcpFor('game')).toBe(false);
      expect(validHdcpFor('series')).toBe(false);
      expect(validHdcpFor(2 as any)).toBe(false);
    })
    it('should return false when passed null', () => { 
      expect(validHdcpFor(null as any)).toBe(false);      
    })
    it('should return false when passed undefined', () => { 
      expect(validHdcpFor(undefined as any)).toBe(false);      
    })
  })

  describe('validDivFkId function', () => { 
    it('should return true when valid', () => { 
      expect(validDivFkId('tmt_12345678901234567890123456789012', 'tmt')).toBe(true);
    })
    it('should return false when passed invalid values', () => { 
      expect(validDivFkId('tmt_12345678901234567890123456789012', 'bwl')).toBe(false);
      expect(validDivFkId('bwl_12345678901234567890123456789012', 'bwl')).toBe(false);
      expect(validDivFkId('abc', 'bwl')).toBe(false);      
    })
    it('should return false when passed null', () => { 
      expect(validDivFkId(null as any, 'evt')).toBe(false);      
    })
    it('should return false when passed undefined', () => { 
      expect(validDivFkId(undefined as any, 'evt')).toBe(false);      
    })
  })

  describe('validDivData function', () => { 
    it('should return ErrorCode.None when valid event data', () => { 
      expect(validDivData(validScratchDiv)).toBe(ErrorCode.None);
      expect(validDivData(validHdcpDiv)).toBe(ErrorCode.None);
    })
    it('should return ErrorCode.None when div_name is sanitied to a valid value', () => {
      const invalidDiv = {
        ...validScratchDiv,
        div_name: '<script>alert(1)</script>',
      }
      // sanitied to: alert1
      expect(validDivData(invalidDiv)).toBe(ErrorCode.None);
    })
    it('should return ErrorCode.InvalidData when tmnt_id is empty', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        tmnt_id: '',
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when tmnt_id is wrong type', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        tmnt_id: 'usr_12345678901234567890123456789012',
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when div_name is empty', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        div_name: '',
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when div_name is just special chars', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        div_name: '******',
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when div_name is too long', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        div_name: 'a'.repeat(maxEventLength + 1),
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp is empty', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_per: null as any,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp is too low', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_per: -1,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp is too high', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_per: 2,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp is not a number', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_per: 'abc' as any,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp_from is empty', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_from: null as any,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp_from is too low', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_from: -1,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp_from is too high', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_from: 301,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp_from is not a number', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_from: 'abc' as any,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when int_hdcp is empty', () => {
      const invalidDiv = {
        ...validScratchDiv,
        int_hdcp: null as any,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when int_hdcp is not a boolean', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        int_hdcp: 'abc' as any,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp_for is empty', () => { 
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_for: null as any,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when hdcp_for is not valid', () => {
      const invalidDiv = {
        ...validScratchDiv,
        hdcp_for: 'abc' as any,
      }
      expect(validDivData(invalidDiv)).toBe(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.InvalidData when passed null', () => { 
      expect(validDivData(null as any)).toBe(ErrorCode.InvalidData);      
    })
    it('should return ErrorCode.InvalidData when passed undefined', () => { 
      expect(validDivData(undefined as any)).toBe(ErrorCode.InvalidData);
    })
  })

  describe('sanitizeDiv function', () => { 
    it('should return a sanitized event when event is alread sanitized', () => {
      const testDiv = {
        ...validScratchDiv,
      }
      const sanitizedDiv = sanitizeDiv(testDiv)
      expect(sanitizedDiv.tmnt_id).toEqual('tmt_fd99387c33d9c78aba290286576ddce5') 
      expect(sanitizedDiv.div_name).toEqual('Scratch')
      expect(sanitizedDiv.hdcp_per).toEqual(0)
      expect(sanitizedDiv.hdcp_from).toEqual(230)
      expect(sanitizedDiv.int_hdcp).toEqual(true)
      expect(sanitizedDiv.hdcp_for).toEqual('Game')
      expect(sanitizedDiv.sort_order).toEqual(1)
    })
    it('should return a sanitized event when event is NOT alread sanitized', () => {
      const testDiv = {
        ...validScratchDiv,
        tmnt_id: 'abc_123',
        div_name: '  Test* ',
        hdcp_per: 200,
        hdcp_from: 301,
        int_hdcp: null as any,
        hdcp_for: 'everyone' as any,
        sort_order: -1,
      }
      const sanitizedDiv = sanitizeDiv(testDiv)
      expect(sanitizedDiv.tmnt_id).toEqual('1') // not valid, but sanitized
      expect(sanitizedDiv.div_name).toEqual('Test')
      expect(sanitizedDiv.hdcp_per).toEqual(defaultHdcpPer)
      expect(sanitizedDiv.hdcp_from).toEqual(230)
      expect(sanitizedDiv.int_hdcp).toEqual(true)
      expect(sanitizedDiv.hdcp_for).toEqual('Game')
      expect(sanitizedDiv.sort_order).toEqual(1)
    })
    it('should return null when passed null', () => { 
      expect(sanitizeDiv(null as any)).toBe(null)
    })          
    it('should return null when passed undefined', () => { 
      expect(sanitizeDiv(undefined as any)).toBe(null)
    })          
  })

  describe('validateDiv function', () => { 
    
    describe('validateDiv function - valid data', () => { 
      it('should return true when passed valid data', () => { 
        expect(validateDiv(validScratchDiv)).toBe(ErrorCode.None);
      })
      it('should return ErrorCode.None when all fields are poperly sanitized', () => { 
        const validTestDiv: divType = {
          ...validScratchDiv,          
          div_name: ' Test Div** ',
          hdcp_per: 1.0,
          hdcp_from: 230,
          int_hdcp: true,
          hdcp_for: 'Game',
          sort_order: 1,
        }        
        expect(validateDiv(validTestDiv)).toBe(ErrorCode.None);
      })      
    })

    describe('validateDiv function - missing data data', () => { 
      it('should return ErrorCode.MissingData when tmnt_id is missing', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          tmnt_id: null as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when div_name is missing', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          div_name: '',
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when div_name is all special characters', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          div_name: '******',
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when hdcp is missing', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_per: null as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when hdcp is not a number', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_per: 'abc' as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when hdcp_from is missing', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_from: null as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when hdcp_from is not a number', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_from: 'xyz' as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when int_hdcp is missing', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          int_hdcp: null as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when int_hdcp is a string', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          int_hdcp: 'true' as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when hdcp_for is missing', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_for: null as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when hdcp_for is missing', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_for: 'test' as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when sort_order is missing', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          sort_order: null as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
      it('should return ErrorCode.MissingData when sort_order is not a number', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          sort_order: 'abc' as any,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      })
    })

    describe('validateDiv function - invalid data', () => { 
      it('should return ErrorCode.InvalidData when div name is too long', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          div_name: 'This div name is way too long and should exceed the maximum length allowed',
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when hdcp is less than 0', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_per: -1,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when hdcp is over max', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_per: 200,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when hdcp_from is less than 0', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_from: -1,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when hdcp_from is over max', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          hdcp_from: 301,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.InvalidData);
      })
      // it('should return ErrorCode.MissingData when int_hdcp is not a boolean', () => { 
      //   const invalidTestDiv: divType = {
      //     ...validScratchDiv,          
      //     int_hdcp: 'true' as any,
      //   }        
      //   expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      // })
      // it('should return ErrorCode.MissingData when hdcp_for is not valid', () => { 
      //   const invalidTestDiv: divType = {
      //     ...validScratchDiv,          
      //     hdcp_for: 'test' as any,
      //   }        
      //   expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      // })
      // it('should return ErrorCode.MissingData when sort_order is not a number', () => { 
      //   const invalidTestDiv: divType = {
      //     ...validScratchDiv,          
      //     sort_order: 'abc' as any,
      //   }        
      //   expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.MissingData);
      // })
      it('should return ErrorCode.InvalidData when sort_order is less than 0', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          sort_order: -1,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.InvalidData);
      })
      it('should return ErrorCode.InvalidData when sort_order is over max', () => { 
        const invalidTestDiv: divType = {
          ...validScratchDiv,          
          sort_order: maxSortOrder + 1,
        }        
        expect(validateDiv(invalidTestDiv)).toBe(ErrorCode.InvalidData);
      })
    })
  })

  describe('validPostId function', () => { 
    const testDivId = "div_cb97b73cb538418ab993fc867f860510"
    it('should return testDivId when id starts with post Secret and follows with a valid div id', () => { 
      const validId = nextPostSecret + testDivId;
      expect(validPostId(validId, 'div')).toBe(testDivId)
    })
    it('should return "" when id starts with postSecret but does idType does not match idtype in postId', () => {
      const invalidId = nextPostSecret + testDivId;
      expect(validPostId(invalidId, 'usr')).toBe('');
    });
    it('should return "" when id starts with postSecret but does idType is invalid', () => {
      const invalidId = nextPostSecret + testDivId;
      expect(validPostId(invalidId, '123' as any)).toBe('');
    });
    it('should return "" when id starts with postSecret but does not follow with valid BtDb idType', () => {
      const invalidId = nextPostSecret + 'abc_a1b2c3d4e5f678901234567890abcdef';
      expect(validPostId(invalidId, 'div')).toBe('');
    });
    it('should return "" when id starts with postSecret but does not follow with a valid BtDb id', () => {
      const invalidId = process.env.POST_SECRET + 'div_invalidid';
      expect(validPostId(invalidId, 'evt')).toBe('');
    });
    it('should return "" when id does not start with postSecret', () => {
      const invalidId = testDivId;
      expect(validPostId(invalidId, 'div')).toBe('');
    });
  })

})