import {
  dateTo_UTC_yyyyMMdd,
  dateTo_UTC_MMddyyyy,
  todayStr,
  twelveHourto24Hour,
  getHoursFromTime, 
  getMinutesFromTime,
  validTime
} from "@/lib/dateTools";
import { startOfToday } from "date-fns";
import { captureRejectionSymbol } from "events";

describe("tests for dateTools", () => {
  
  describe("dateTo_UTC_yyyyMMdd", () => {
    it("should format a date into a UTC string using yyyy-MM-dd", () => {
      const date = new Date("2022-01-01");
      const formattedDate = dateTo_UTC_yyyyMMdd(date);
      expect(formattedDate).toBe("2022-01-01");
    });
  });

  describe("dateTo_UTC_MMddyyyy", () => {
    it("should format a date into a UTC string using MM/dd/yyyy", () => {
      const date = new Date("2022-01-01");
      const formattedDate = dateTo_UTC_MMddyyyy(date);
      expect(formattedDate).toBe("01/01/2022");
    });
  });

  describe("todayStr", () => {
    it("should return the current date formatted as yyyy-MM-dd", () => {
      const today = new Date(startOfToday());
      const formattedDate = dateTo_UTC_yyyyMMdd(today);
      expect(todayStr).toBe(formattedDate);
    });
  });

  describe("twelveHourto24Hour", () => {
    it("should convert 12-hour time to 24-hour time", () => {
      expect(twelveHourto24Hour("01:00 PM")).toEqual("13:00");
      expect(twelveHourto24Hour("12:30 AM")).toEqual("00:30");
      expect(twelveHourto24Hour("11:45 PM")).toEqual("23:45");
      expect(twelveHourto24Hour("13:00")).toEqual("13:00");
      expect(twelveHourto24Hour("00:00")).toEqual("00:00");
    });

    it("should return an empty string if the input is invalid", () => {
      expect(twelveHourto24Hour("-1:00")).toEqual("");
      expect(twelveHourto24Hour("01:-1")).toEqual("");
      expect(twelveHourto24Hour("1:0")).toEqual("");
      expect(twelveHourto24Hour("AB:00")).toEqual("");
      expect(twelveHourto24Hour("12:XY")).toEqual("");
      expect(twelveHourto24Hour("12:60 PM")).toEqual("");
      expect(twelveHourto24Hour("25:00 PM")).toEqual("");
      expect(twelveHourto24Hour("")).toEqual("");
    });
  });

  describe('getHoursFromTime', () => {
    it('should return the correct hours from a valid time string', () => {
      expect(getHoursFromTime('09:30')).toBe(9)
      expect(getHoursFromTime('15:45')).toBe(15)
    })
  
    it('should return -1 for an invalid time string', () => {
      expect(getHoursFromTime('abc')).toBe(-1)
      expect(getHoursFromTime('')).toBe(-1)
      expect(getHoursFromTime('12:60')).toBe(-1)
      expect(getHoursFromTime('25:00')).toBe(-1)
      expect(getHoursFromTime('-1:00')).toBe(-1)
    })
  })  

  describe('getMinutesFromTime', () => {
    it('should return the correct minutes from a valid time string', () => {
      const time = '12:34'
      const result = getMinutesFromTime(time)
      expect(result).toBe(34)
    })
  
    it('should return -1 for an invalid time string', () => {
      const time = '12:34:56'
      const result = getMinutesFromTime(time)
      expect(result).toBe(-1)
      expect(getMinutesFromTime('ab:09')).toBe(-1)
    })
  
    it('should return -1 for an empty time string', () => {
      const time = ''
      const result = getMinutesFromTime(time)
      expect(result).toBe(-1)
    })
  })
});
