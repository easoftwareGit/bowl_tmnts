import {
  sanitizeUser,
  validateUser,
  validUserFirstName,
  validUserLastName,
  validUserEmail,
  validUserPhone,
  validUserPassword,
  exportedForTesting, 
  validPostUserId
} from "@/app/api/users/validate";
import { userType } from "@/lib/types/types";
import { mockUser } from "../../../mocks/tmnts/mockTmnt";
import { ErrorCode } from "@/lib/validation";

const {gotUserData, validUserData } = exportedForTesting;

describe("user table data validation", () => {  

  describe("gotUserData function - check for missing data", () => {
    
    it("should return a None error code when valid user object", () => {
      const testUser: userType = {
        ...mockUser,
      };
      expect(gotUserData(testUser)).toBe(ErrorCode.None);
    });
    it("should return missing data error code when no first_name", () => {
      const testUser: userType = {
        ...mockUser,
        first_name: "",
      };
      expect(gotUserData(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return missing data error code when first_name has just special chars", () => {
      const testUser: userType = {
        ...mockUser,
        first_name: "***",
      };
      expect(gotUserData(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return missing data error code when no last_name", () => {
      const testUser: userType = {
        ...mockUser,
        last_name: "",
      };
      expect(gotUserData(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return missing data error code when last_name has just special chars", () => {
      const testUser: userType = {
        ...mockUser,
        last_name: "++++",
      };
      expect(gotUserData(testUser)).toBe(ErrorCode.MissingData);
    });    
    it("should return missing data error code when no email", () => {
      const testUser: userType = {
        ...mockUser,
        email: "",
      };
      expect(gotUserData(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return missing data error code when no phone", () => {
      const testUser: userType = {
        ...mockUser,
        phone: "",
      };
      expect(gotUserData(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return missing data error code when no password", () => {
      const testUser: userType = {
        ...mockUser,
        password: "",
      };
      expect(gotUserData(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return a None error code when no phone and no password, when not checking for phone and password", () => {
      const testUser: userType = {
        ...mockUser,
        phone: "",
        password: "",
      };
      expect(gotUserData(testUser, false)).toBe(ErrorCode.None);
    }); 
        
  });

  describe("validUserData function - invalid data", () => {
    it("should return a None error code when valid user object", () => {
      const testUser: userType = {
        ...mockUser,
      };
      expect(validUserData(testUser)).toBe(ErrorCode.None);
    });
    it("should return an invalid data error code when first name is too long", () => {
      const testUser: userType = {
        ...mockUser,
        first_name: "1234567890123456",
      };
      expect(validUserFirstName(testUser.first_name)).toBe(false);
      expect(validUserData(testUser)).toBe(ErrorCode.InvalidData);      
    });
    it("should return an invalid data error code when last name is too long", () => {
      const testUser: userType = {
        ...mockUser,
        last_name: "123456789012345678901",
      };
      expect(validUserLastName(testUser.last_name)).toBe(false);
      expect(validUserData(testUser)).toBe(ErrorCode.InvalidData);
    });
    it("should return an invalid data error code when email is invalid", () => {
      const testUser: userType = {
        ...mockUser,
        email: "john.doe@example",
      };
      expect(validUserEmail(testUser.email)).toBe(false);
      expect(validUserData(testUser)).toBe(ErrorCode.InvalidData);
    });
    it("should return an invalid data error code when phone is invalid", () => {
      const testUser: userType = {
        ...mockUser,
        phone: "abc",
      };
      expect(validUserPhone(testUser.phone)).toBe(false);
      expect(validUserData(testUser)).toBe(ErrorCode.InvalidData);
    });
    it("should return an invalid data error code when password is invalid", () => {
      const testUser: userType = {
        ...mockUser,
        password: "Test12!",
      };
      expect(validUserPassword(testUser.password)).toBe(false);
      expect(validUserData(testUser)).toBe(ErrorCode.InvalidData);
    });
  });

  describe('validateUser function, test both gotUserData AND validUserData', () => {
    it("should return a missing data error code when user is missing first name", () => {
      const testUser: userType = {
        ...mockUser,
      };
      expect(validateUser(testUser)).toBe(ErrorCode.None);
    });
    it("should return a missing data error code when user is missing last name", () => {
      const testUser: userType = {
        ...mockUser,
        last_name: "",
      };
      expect(validateUser(testUser)).toBe(ErrorCode.MissingData);
    })    
    it('should return a invalid data error code when user has invalid phone', () => {
      const testUser: userType = {
        ...mockUser,
        phone: "abc",
      };
      expect(validateUser(testUser)).toBe(ErrorCode.InvalidData);
    })
  })

  describe("sanitizeUser function", () => {
    // const testUser: userType = {
    //   ...mockUser,
    //   first_name: "   J>o<h@n-P#aকu😀l",
    //   last_name: "J?o/n[e,s.D]o{e}   ",
    //   email: "john.doe@example.com",
    //   phone: "(800) 555-1234",
    //   password: "Test123!",
    // };
    it("should return a sanitized user object - no sanitizing", () => {
      const testUser: userType = {
        ...mockUser,
        first_name: "John-Paul",
        last_name: "Jones Doe",
        phone: "1+8005551234",
      };
      const sanitized = sanitizeUser(testUser);
      expect(sanitized.first_name).toEqual("John-Paul");
      expect(sanitized.last_name).toEqual("Jones Doe");
      expect(sanitized.phone).toEqual("+18005551234");
    });
    it("should return a sanitized user object", () => {
      const testUser: userType = {
        ...mockUser,
        first_name: "   J>o<h@n-P#aকu😀l",
        last_name: "O'Conner, Jr.   ",
        phone: "(800) 555-1234",
      };
      const sanitized = sanitizeUser(testUser);
      expect(sanitized.first_name).toEqual("John-Paul");
      expect(sanitized.last_name).toEqual("O'Conner, Jr.");
      expect(sanitized.phone).toEqual("+18005551234");
    });
  });

  describe("validate validPostUserId function", () => { 
    const testUserId = 'usr_a1b2c3d4e5f678901234567890abcdef'
    it('should return true when id starts with postSecret and follows with a valid usr BtDb id', () => {
      const validId = process.env.POST_SECRET + testUserId;
      expect(validPostUserId(validId)).toBe(testUserId);
    });
    it('should return false when id starts with postSecret but does not follow with \'usr\'', () => {
      const invalidId = process.env.POST_SECRET + 'abc_a1b2c3d4e5f678901234567890abcdef';
      expect(validPostUserId(invalidId)).toBe('');
    });
    it('should return false when id starts with postSecret but does not follow with a valid BtDb id', () => {
      const invalidId = process.env.POST_SECRET + 'usr_invalidid';
      expect(validPostUserId(invalidId)).toBe('');
    });
    it('should return false when id does not start with postSecret', () => {
      const invalidId = testUserId;
      expect(validPostUserId(invalidId)).toBe('');
    });
    it('should return false when id is blank', () => {
      const invalidId = '';
      expect(validPostUserId(invalidId)).toBe('');
    });
    it('should return false when id is null', () => {
      const invalidId:any = null;
      expect(validPostUserId(invalidId)).toBe('');
    });
    it('should return false when id is undefined', () => {
      const invalidId:any = undefined;
      expect(validPostUserId(invalidId)).toBe('');
    });
  })

});
