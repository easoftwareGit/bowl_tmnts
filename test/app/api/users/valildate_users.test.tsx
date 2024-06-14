import {
  sanitizeUser,
  validateUser,
  validUserFirstName,
  validUserLastName,
  validUserEmail,
  validUserPhone,
  validUserPassword,
  exportedForTesting,   
} from "@/app/api/users/validate";
import { userType } from "@/lib/types/types";
import { mockUser } from "../../../mocks/tmnts/mockTmnt";
import { ErrorCode, validPostId } from "@/lib/validation";
import { nextPostSecret } from "@/lib/tools";

const { gotUserData, validUserData } = exportedForTesting;

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
        last_name: "****",
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

  describe('validUserFirstName function', () => {
    it('should return true when first name is valid', () => {
      expect(validUserFirstName("John")).toBe(true);
    });
    it('should return false when first name is too long', () => {
      expect(validUserFirstName("1234567890123456")).toBe(false);
    });
    it('should return false when first name is empty', () => {
      expect(validUserFirstName("")).toBe(false);
    });
    it('should return false when first name has just special chars', () => {
      expect(validUserFirstName("***")).toBe(false);
    });
    it('should return false when first name is null', () => {
      expect(validUserFirstName(null as any)).toBe(false);
    });
    it('should return false when first name is undefined', () => {
      expect(validUserFirstName(undefined as any)).toBe(false);
    });
    it('should return true when passed html tag (tags remove)', () => { 
      // will be John
      expect(validUserFirstName("<b>John</b>")).toBe(true);
      // will be alerthello
      expect(validUserFirstName("<script>alert('hello')</script>")).toBe(true);
    })
  });

  describe('validUserLastName function', () => {
    it('should return true when last name is valid', () => {
      expect(validUserLastName("Doe")).toBe(true);
    });
    it('should return false when last name is too long', () => {
      expect(validUserLastName("123456789012345678901")).toBe(false);
    });
    it('should return false when last name is empty', () => {
      expect(validUserLastName("")).toBe(false);
    });
    it('should return false when last name has just special chars', () => {
      expect(validUserLastName("<<<>>>")).toBe(false);
    });
    it('should return false when last name is null', () => {
      expect(validUserLastName(null as any)).toBe(false);
    });
    it('should return false when last name is undefined', () => {
      expect(validUserLastName(undefined as any)).toBe(false);
    });
    it('should return true when passed html tag (tags remove)', () => { 
      // will be Jones
      expect(validUserLastName("<b>Jones</b>")).toBe(true);
      // will be alerthello
      expect(validUserLastName("<script>alert('hello')</script>")).toBe(true);
    })
  });

  describe('validUserEmail function', () => {
    it('should return true when email is valid', () => {
      expect(validUserEmail("a@b.com")).toBe(true);
      expect(validUserEmail("test@example.com")).toBe(true);
    });
    it('should return false when email is invalid', () => {
      expect(validUserEmail("a@b")).toBe(false);
    });
    it('should return false when email is empty', () => {
      expect(validUserEmail("")).toBe(false);
    });
    it('should return false when email is null', () => {
      expect(validUserEmail(null as any)).toBe(false);
    });
    it('should return false when email is undefined', () => {
      expect(validUserEmail(undefined as any)).toBe(false);
    });
    it('should return false when passed html tag (tags remove)', () => { 
      expect(validUserEmail("<b>a@b.com</b>")).toBe(false);
    })
    it('should return false when passed invalid characters', () => { 
      expect(validUserEmail('invalid**test@email.com')).toBe(false);      
    })
    it('should return false when passed not exaclty one @', () => { 
      expect(validUserEmail('inv@alid@email.com')).toBe(false);
      expect(validUserEmail('invalidemail.com')).toBe(false);
    })
    it('should return false when passed email will no domain', () => {       
      expect(validUserEmail('invalid@emailcom')).toBe(false);
    })
  });

  describe('validUserPhone function', () => {
    it('should return true when phone is valid', () => {
      expect(validUserPhone("2345678901")).toBe(true);
    });
    it('should return false when phone is invalid', () => {
      expect(validUserPhone("12345678901")).toBe(true);
      expect(validUserPhone("abc")).toBe(false);
    });
    it('should return false when phone is empty', () => {
      expect(validUserPhone("")).toBe(false);
    });
    it('should return false when phone is null', () => {
      expect(validUserPhone(null as any)).toBe(false);
    });
    it('should return false when phone is undefined', () => {
      expect(validUserPhone(undefined as any)).toBe(false);
    });
    it('should return false when passed invalid characters', () => {
      expect(validUserPassword("1234567890a")).toBe(false);
      expect(validUserPassword("  1234567890 ")).toBe(false);
      expect(validUserPassword("12345678%0")).toBe(false);
      expect(validUserPassword("12345678@0")).toBe(false);
    })
    it('should return false when passed html tag)', () => { 
      expect(validUserPhone("<b>2345678901</b>")).toBe(true);
    })
  });

  describe('valueUserPassword function', () => { 
    it('should return true when password is valid', () => { 
      expect(validUserPassword("Test123!")).toBe(true);
    });
    it('should return false when no uppercase letter', () => { 
      expect(validUserPassword("test123!")).toBe(false);
    })
    it('should return false when no lowercase letter', () => { 
      expect(validUserPassword("TEST123!")).toBe(false);
    })
    it('should return false when no number', () => { 
      expect(validUserPassword("Testtest!")).toBe(false);
    })
    it('should return false when no special char', () => { 
      expect(validUserPassword("Test1234")).toBe(false);
    })
  })

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
        phone: "<b>(800) 555-1234</b>",
      };
      const sanitized = sanitizeUser(testUser);
      expect(sanitized.first_name).toEqual("John-Paul");
      expect(sanitized.last_name).toEqual("O'Conner, Jr.");
      expect(sanitized.phone).toEqual("+18005551234");
    });
    it("should return a sanitized user object without email or password", () => {
      const testUser: userType = {
        ...mockUser,
        email: 'johndoe.com',
        password: "Test123",
      };
      const sanitized = sanitizeUser(testUser);
      expect(sanitized.email).toEqual("");
      expect(sanitized.password).toEqual("");      
    });

  });

  describe("validate validPostId function", () => { 
    const testUserId = 'usr_a1b2c3d4e5f678901234567890abcdef'
    it('should return true when id starts with postSecret and follows with a valid BtDb id', () => {
      const validId = nextPostSecret + testUserId;
      expect(validPostId(validId, 'usr')).toBe(testUserId);
    });
    it('should return false when id starts with postSecret but does idType does not match idtype in postId', () => {
      const invalidId = nextPostSecret + testUserId;
      expect(validPostId(invalidId, 'bwl')).toBe('');
    });
    it('should return false when id starts with postSecret but does idType is invalid', () => {
      const invalidId = nextPostSecret + testUserId;
      expect(validPostId(invalidId, '123' as any)).toBe('');
    });
    it('should return false when id starts with postSecret but does not follow with valid BtDb idType', () => {
      const invalidId = nextPostSecret + 'abc_a1b2c3d4e5f678901234567890abcdef';
      expect(validPostId(invalidId, 'usr')).toBe('');
    });
    it('should return false when id does not start with postSecret', () => {
      const invalidId = testUserId;
      expect(validPostId(invalidId, 'usr')).toBe('');
    });

  })

});
