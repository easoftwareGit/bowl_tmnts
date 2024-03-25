import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ZeroToNBrackets from "../../../../src/app/dataEntry/tmnt/zeroToNBrackets";
import { mockBrkts, mockDivs, mockSquads } from "../../../mocks/tmnts/twoDivs/mockDivs";
import { localConfig } from "@/lib/currency/const";
import { formatValueSymbSep2Dec } from "@/lib/currency/formatValue";
import { initBrkt } from "@/app/dataEntry/tmnt/initVals";
import exp from "constants";

const mockSetBrkts = jest.fn();
const mockSetAcdnErr = jest.fn();

const mockZeroToNBrktsProps = {
  brkts: mockBrkts, 
  setBrkts: mockSetBrkts,
  divs: mockDivs,
  squads: mockSquads,
  setAcdnErr: mockSetAcdnErr
}

describe("ZeroToNBrackets - Component", () => {
  
  describe("render the component", () => {
    
    describe('render the Create Bracket tab', () => { 
      it("render division radio label", () => {
        // ARRANGE
        // const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        // ACT
        const brktRaidoLabel = screen.getByTestId("brktDivRadioLabel");
        // ASSERT
        expect(brktRaidoLabel).toBeInTheDocument();
      })
      it('render the "Scratch" radio button', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const scratchRadio = screen.getByLabelText("Scratch");
        expect(scratchRadio).not.toBeChecked();        
      })
      it('render the "Hdcp" radio button', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const hdcpRadio = screen.getByLabelText("Hdcp"); 
        expect(hdcpRadio).not.toBeChecked();        
      })

    })
  })
})