import { formatValueSymbSep2Dec, formatValue2Dec } from "@/lib/currency/formatValue";
import { IntlConfig } from "@/lib/currency/components/CurrencyInputProps";
import { getLocaleConfig } from "@/lib/currency/components/utils";

describe("formatValues.ts", () => {
  const ic: IntlConfig = {
    // locale: window.navigator.language,
    locale: 'en-US'
  };
  const localConfig = getLocaleConfig(ic);
  localConfig.prefix = "$";
  
  describe("formatValueSymbSep2Dec", () => {
    it("should call formatValue with correct parameters for decimalScale 2", () => {
      const formattedValue = formatValueSymbSep2Dec("1000", localConfig);
      expect(formattedValue).toBe("$1,000.00");
    });
    it("format monitary value for 123", () => {
      const formattedValue = formatValueSymbSep2Dec("123", localConfig);
      expect(formattedValue).toBe("$123.00");
    });
    it("format monitary value for 1234", () => {
      const formattedValue = formatValueSymbSep2Dec("1234", localConfig);
      expect(formattedValue).toBe("$1,234.00");
    });
    it("format monitary value for 1234.56", () => {
      const formattedValue = formatValueSymbSep2Dec("1234.56", localConfig);
      expect(formattedValue).toBe("$1,234.56");
    });
    it("format monitary value for 1234.567", () => {
      const formattedValue = formatValueSymbSep2Dec("1234.567", localConfig);
      expect(formattedValue).toBe("$1,234.56");
    });
    it("format monitary value for 1234567", () => {
      const formattedValue = formatValueSymbSep2Dec("1234567", localConfig);
      expect(formattedValue).toBe("$1,234,567.00");
    });
    it("format monitary value for 0", () => {
      const formattedValue = formatValueSymbSep2Dec("0", localConfig);
      expect(formattedValue).toBe("$0.00");
    });
    it("format monitary value for '' (blank)", () => {
      const formattedValue = formatValueSymbSep2Dec("", localConfig);
      expect(formattedValue).toBe("");
    });
  });

  describe('formatValue2Dec', () => {
    it('should format value with decimal separator, 2 decimal places, and disable group separators', () => {
      const formattedValue = formatValue2Dec('98765.4321', localConfig);
      expect(formattedValue).toBe('98765.43');
    });
  
    it('should handle negative values correctly', () => {
      const formattedValue = formatValue2Dec('-12345.6789', localConfig);
      expect(formattedValue).toBe('-12345.67');
    });
  
    it('should handle values with no decimal part', () => {
      const formattedValue = formatValue2Dec('54321', localConfig);
      expect(formattedValue).toBe('54321.00');
    });
  });

  
})

