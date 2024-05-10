import {
  sanitizeUser,
  validateUser,
  validUserFirstName,
  validUserLastName,
  validUserEmail,
  validUserPhone,
  validUserPassword,
} from "@/app/api/users/validate";
import { userType } from "@/lib/types/types";
import { mockUser } from "../../../mocks/tmnts/mockTmnt";
import { ErrorCode } from "@/lib/validation";

describe("user table data validation", () => {

  describe("validateUser function - check for missing data", () => {
    
    it("should return a None error code when valid user object", () => {
      const testUser: userType = {
        ...mockUser,
      };
      expect(validateUser(testUser)).toBe(ErrorCode.None);
    });
    it("should return missing data error code when no first_name", () => {
      const testUser: userType = {
        ...mockUser,
        first_name: "",
      };
      expect(validateUser(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return missing data error code when no last_name", () => {
      const testUser: userType = {
        ...mockUser,
        last_name: "",
      };
      expect(validateUser(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return missing data error code when no email", () => {
      const testUser: userType = {
        ...mockUser,
        email: "",
      };
      expect(validateUser(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return missing data error code when no phone", () => {
      const testUser: userType = {
        ...mockUser,
        phone: "",
      };
      expect(validateUser(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return missing data error code when no password", () => {
      const testUser: userType = {
        ...mockUser,
        password: "",
      };
      expect(validateUser(testUser)).toBe(ErrorCode.MissingData);
    });
    it("should return a None error code when no phone and no password, when not checking for phone and password", () => {
      const testUser: userType = {
        ...mockUser,
        phone: "",
        password: "",
      };
      expect(validateUser(testUser, false)).toBe(ErrorCode.None);
    });
    
  });

  describe("validUserData function - invalid data", () => {
    it("should return a None error code when valid user object", () => {
      const testUser: userType = {
        ...mockUser,
      };
      expect(validateUser(testUser)).toBe(ErrorCode.None);
    });
    it("should return an invalid data error code when first name is too long", () => {
      const testUser: userType = {
        ...mockUser,
        first_name: "1234567890123456",
      };
      expect(validUserFirstName(testUser.first_name)).toBe(false);
      expect(validateUser(testUser)).toBe(ErrorCode.InvalidData);      
    });
    it("should return an invalid data error code when last name is too long", () => {
      const testUser: userType = {
        ...mockUser,
        last_name: "123456789012345678901",
      };
      expect(validUserLastName(testUser.last_name)).toBe(false);
      expect(validateUser(testUser)).toBe(ErrorCode.InvalidData);
    });
    it("should return an invalid data error code when email is invalid", () => {
      const testUser: userType = {
        ...mockUser,
        email: "john.doe@example",
      };
      expect(validUserEmail(testUser.email)).toBe(false);
      expect(validateUser(testUser)).toBe(ErrorCode.InvalidData);
    });
    it("should return an invalid data error code when phone is invalid", () => {
      const testUser: userType = {
        ...mockUser,
        phone: "abc",
      };
      expect(validUserPhone(testUser.phone)).toBe(false);
      expect(validateUser(testUser)).toBe(ErrorCode.InvalidData);
    });
    it("should return an invalid data error code when password is invalid", () => {
      const testUser: userType = {
        ...mockUser,
        password: "Test12!",
      };
      expect(validUserPassword(testUser.password)).toBe(false);
      expect(validateUser(testUser)).toBe(ErrorCode.InvalidData);
    });
  });

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
});
