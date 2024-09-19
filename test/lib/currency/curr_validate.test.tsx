import { validMoney } from "@/lib/currency/validate";
import { maxMoney } from "@/lib/validation";

describe("validAmount", () => {
  it("should return true if amount is a valid number", () => {
    expect(validMoney("5", 0, maxMoney)).toBe(true);
    expect(validMoney("0", 0, maxMoney)).toBe(true);
    expect(validMoney("0.5", 0, maxMoney)).toBe(true);
    expect(validMoney("5.55", 0, maxMoney)).toBe(true);
    expect(validMoney("-5", maxMoney * -1, maxMoney)).toBe(true);  
    expect(validMoney(5 as any, 0, maxMoney)).toBe(true);
  });
  it("should return false if amount is not a valid number", () => {
    expect(validMoney("0.0005", 0, maxMoney)).toBe(true); // sanitied to 0.00
    expect(validMoney("abc", 0, maxMoney)).toBe(false);
    expect(validMoney("5.abc", 0, maxMoney)).toBe(false);
    expect(validMoney("5,55", 0, maxMoney)).toBe(false);
    expect(validMoney("$5.55", 0, maxMoney)).toBe(false);
    expect(validMoney("5.5.5", 0, maxMoney)).toBe(false);
    expect(validMoney("5.55-", 0, maxMoney)).toBe(false);
    expect(validMoney("(5.55)", 0, maxMoney)).toBe(false);
    expect(validMoney("", 0, maxMoney * -1)).toBe(false);
    expect(validMoney(null as any, 0, maxMoney)).toBe(false);
    expect(validMoney(undefined as any, 0, maxMoney)).toBe(false);
  });
})