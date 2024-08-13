import { getPotName, getBrktOrElimName, exportedForTesting } from "@/lib/getName";
import {
  mockDivs,
  mockPots,
  mockBrkts,
  mockElims,  
} from "../mocks/tmnts/twoDivs/mockDivs";

const { findDiv } = exportedForTesting;

describe("getName functions", () => {

  describe('findDiv', () => {
    it("finds the correct div", () => {
      const foundDiv = findDiv(mockPots[1].div_id, mockDivs);
      expect(foundDiv?.div_name).toBe("Scratch");
    });

    it("returns undefined if the div is not found", () => {
      const foundDiv = findDiv("div_123", mockDivs);
      expect(foundDiv).toBeUndefined();
    });

    it("returns undefined if the divs array is empty", () => {
      const foundDiv = findDiv(mockPots[1].div_id, []);
      expect(foundDiv).toBeUndefined();
    });
  });

  describe('getPotName', () => {
    it("getPotName returns the correct name", () => {
      const potName = getPotName(mockPots[1], mockDivs);
      expect(potName).toBe("Game - Scratch");
    });
    
    it("getPotName returns an empty string if the pot is not found", () => {
      const testPot = {
        ...mockPots[1],
        div_id: "div_123"
      };
      const potName = getPotName(testPot, mockDivs);
      expect(potName).toBe("");
    });

    it("getPotName returns an empty string if the divs array is empty", () => {
      const potName = getPotName(mockPots[1], []);
      expect(potName).toBe("");
    }); 
  })

  describe('getBrktOrElimName', () => {
    it("getBrktOrElimName returns the correct name for Bracket", () => {
      const brktName = getBrktOrElimName(mockBrkts[1].id, mockBrkts);
      expect(brktName).toBe("Scratch: 1-3");
    });

    it("getBrktOrElimName returns the correct name for Elimination", () => {
      const elimName = getBrktOrElimName(mockElims[1].id, mockElims);
      expect(elimName).toBe("Scratch: 1-3");
    });

    it("getBrktOrElimName returns an empty string if the id is not found", () => {
      const brktName = getBrktOrElimName("brkt_123", mockBrkts);
      expect(brktName).toBe("");
    });

    it("getBrktOrElimName returns an empty string if the array to search is empty", () => {
      const brktName = getBrktOrElimName(mockBrkts[1].id, []);
      expect(brktName).toBe("");
    });
  });

});
