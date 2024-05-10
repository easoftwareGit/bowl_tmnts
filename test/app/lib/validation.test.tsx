import { isEmail, isPassword8to20, isValidBtDbId, validYear, validTime, isValidBtDbType, isOdd, isEven } from '../../../src/lib/validation';

describe('tests for validation functions', () => {

  describe('isEmail function', () => {
    describe('isEmail function', () => {
      it('should return true for a valid email', () => {
        expect(isEmail('test@example.com')).toBe(true);
      });
    
      it('should return false for an invalid email without "@" symbol', () => {
        expect(isEmail('testexample.com')).toBe(false);
      });
    
      it('should return false for an invalid email without domain', () => {
        expect(isEmail('test@example')).toBe(false);
      });
    
      it('should return false for an invalid email with special characters', () => {
        expect(isEmail('test.@example.com')).toBe(false);
      });

      it('should return false for an invalid blank email', () => {
        expect(isEmail('')).toBe(false);
      });
    });    
  })

  describe('isPassword8To20 function', () => {
    it('should return true for a valid password', () => {
      expect(isPassword8to20('Test123!')).toBe(true);
    })
    it('should return false for an invalid password (no upper case)', () => {
      expect(isPassword8to20('test123!')).toBe(false);
    })
    it('should return false for an invalid password (no lower case)', () => {
      expect(isPassword8to20('TEST123!')).toBe(false);
    })
    it('should return false for an invalid password (no digits)', () => {
      expect(isPassword8to20('TESTtest!')).toBe(false);
    })
    it('should return false for an invalid password (no special char)', () => {
      expect(isPassword8to20('TEST1234')).toBe(false);
    })
    it('should return false for an invalid password (less than 8 chars long)', () => {
      expect(isPassword8to20('Test12!')).toBe(false);
    })
    it('should return false for an invalid password (more than 20 chars long)', () => {
      expect(isPassword8to20('Test12345!Test12345!1')).toBe(false);
    })
  })

  describe('isValidBtDbType function', () => { 
    it('should return true for valid BtDb type', () => {
      expect(isValidBtDbType('bwl')).toBe(true);
    });
    it('should return true for valid BtDb type', () => {
      expect(isValidBtDbType('tmt')).toBe(true);
    });
    it('should return false for invalid BtDb type', () => {
      expect(isValidBtDbType('bad')).toBe(false);
    });
    it('should return true for blank BtDb type', () => {
      expect(isValidBtDbType('')).toBe(false);
    });
    it('should return true for too long valid BtDb type', () => {
      expect(isValidBtDbType('tmtbwl')).toBe(false);
    });

  })

  describe('isValidBtDbId function', () => {
    it('valid BtDb id should return true for user (usr) id', () => {
      expect(isValidBtDbId('usr_5bcefb5d314fff1ff5da6521a2fa7bde')).toBe(true);
    });
  
    it('valid BtDb id should return true for bowl (bwl) id', () => {
      expect(isValidBtDbId('bwl_561540bd64974da9abdd97765fdb3659')).toBe(true);
    });
  
    it('valid BtDb id should return true for tournament (tmt) id', () => {
      expect(isValidBtDbId('tmt_fd99387c33d9c78aba290286576ddce5')).toBe(true);
    });
  
    it('valid BtDb id should return true for event (tvt) id', () => {
      expect(isValidBtDbId('evt_cb97b73cb538418ab993fc867f860510')).toBe(true);
    });
  
    it('valid BtDb id should return true for division (div) id', () => {
      expect(isValidBtDbId('div_f30aea2c534f4cfe87f4315531cef8ef')).toBe(true);
    });
  
    it('valid BtDb id should return true for handicap (hdc) id', () => {
      expect(isValidBtDbId('hdc_67c7a51bbd2d441da9bb20a3001795a9')).toBe(true);
    });
  
    it('valid BtDb id should return true for squad (sqd) id', () => {
      expect(isValidBtDbId('sqd_7116ce5f80164830830a7157eb093396')).toBe(true);
    });
  
    it('valid BtDb id should return true for pot (pot) id', () => {
      expect(isValidBtDbId('pot_b2a7b02d761b4f5ab5438be84f642c3b')).toBe(true);
    });
  
    it('valid BtDb id should return true for bracket (brk) id', () => {
      expect(isValidBtDbId('brk_5109b54c2cc44ff9a3721de42c80c8c1')).toBe(true);
    });
  
    it('valid BtDb id should return true for eliminator (elm) id', () => {
      expect(isValidBtDbId('elm_45d884582e7042bb95b4818ccdd9974c')).toBe(true);
    });
  
    it('valid BtDb id should return true for player (ply) id', () => {
      expect(isValidBtDbId('ply_7116ce5f80164830830a7157eb093399')).toBe(true);
    });
  
    it('invalid BtDb id with invalid uuid too short should return false', () => {
      expect(isValidBtDbId('inv_id')).toBe(false);
    });
    it('invalid BtDb id with invalid uuid too long should return false', () => {
      expect(isValidBtDbId('elm_45d884582e7042bb95b4818ccdd9974cabc')).toBe(false);
    });
    it('invalid BtDb id with invalid uuid portion should return false', () => {
      expect(isValidBtDbId('elm_45d884582e7042bb95b4818ccdd99xyz')).toBe(false);
    });
    it('invalid BtDb id with invalid indicator (first 3 chars) should return false', () => {
      expect(isValidBtDbId('xyz_45d884582e7042bb95b4818ccdd9974c')).toBe(false);
    });
    it('blank BtDb id should return false', () => {
      expect(isValidBtDbId('')).toBe(false);
    });
  });
  
  describe('validYear', () => {

    it('valid year should return true', () => {
      expect(validYear('2017')).toBe(true);
    });
    it('valid year (1900) should return true', () => {
      expect(validYear('1900')).toBe(true);
    });
    it('valid year (2200) should return true', () => {
      expect(validYear('2200')).toBe(true);
    });
    it('invalid year (yyyy-yyyy)should return false', () => {
      expect(validYear('2017-2018')).toBe(false);
    })
    it('invalid year (yy) should return false', () => {
      expect(validYear('17')).toBe(false);
    })
    it('invalid year (yyyyy) should return false', () => {
      expect(validYear('12345')).toBe(false);
    })
    it('invalid year (1899) should return false', () => {
      expect(validYear('1899')).toBe(false);
    })
    it('invalid year (2200) should return false', () => {
      expect(validYear('2201')).toBe(false);
    })
    it('invalid year (abc) should return false', () => {
      expect(validYear('abc')).toBe(false);
    })
    it('invalid year "" should return false', () => {
      expect(validYear('')).toBe(false);
    })
  });
  
  describe('validTime function', () => {
    it('should return true for valid 12-hour time in HH:MM AM/PM format', () => {
      expect(validTime('11:30 AM')).toBe(true);
    });
  
    it('should return true for valid 24-hour time in HH:MM format', () => {
      expect(validTime('13:45')).toBe(true);
    });
  
    it('should return false for invalid time format (25:30)', () => {
      expect(validTime('25:30')).toBe(false);
    });

    it('should return false for invalid time format (15:60)', () => {
      expect(validTime('15:60')).toBe(false);
    });

    it('should return false for invalid time format (1234)', () => {
      expect(validTime('1234')).toBe(false);
    });
  
    it('should return false for invalid time format (abc)', () => {
      expect(validTime('abc')).toBe(false);
    });
  
    it('should return false for empty input', () => {
      expect(validTime('')).toBe(false);
    });
  
  });  

  describe('isOdd and IsEven functions', () => { 
    it('should return true for odd number', () => {
      expect(isOdd(5)).toBe(true);
    });
    it('should return false for even number', () => {
      expect(isOdd(4)).toBe(false);
    });
    it('should return true for even number', () => {
      expect(isEven(4)).toBe(true);
    });
    it('should return false for odd number', () => {
      expect(isEven(5)).toBe(false);
    });
  })

});

