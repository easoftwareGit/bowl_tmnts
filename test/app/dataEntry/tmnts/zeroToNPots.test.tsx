import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ZeroToNPots from "../../../../src/app/dataEntry/tmnt/zeroToNPots";
import { mockPots, mockDivs, mockSquads } from "../../../mocks/tmnts/twoDivs/mockDivs";
import { localConfig } from "@/lib/currency/const";
import { formatValueSymbSep2Dec } from "@/lib/currency/formatValue";
import { initPot } from "@/app/dataEntry/tmnt/initVals";
import { getPotName } from "@/lib/getName";
import { after, before } from "node:test";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

const mockSetPots = jest.fn();
const mockSetAcdnErr = jest.fn();

const mockZeroToNPotsProps = {
  pots: mockPots, 
  setPots: mockSetPots,
  divs: mockDivs,
  squads: mockSquads,
  setAcdnErr: mockSetAcdnErr
}

describe("ZeroToNPots - Component", () => { 

  describe("render the component", () => {

    describe("render the Create Pot tab", () => {
      it("render Pot Type Radio label", () => {
        // ARRANGE
        // const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        // ACT
        const potRaidoLabel = screen.getByTestId("potTypeRadioLabel");        
        // ASSERT        
        expect(potRaidoLabel).toBeInTheDocument();        
      })
      it('render the "Game" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const gameRadio = screen.getByLabelText("Game");
        expect(gameRadio).toBeInTheDocument();
        expect(gameRadio).not.toBeChecked();
      })
      it('render the "Last Game" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const lastRadio = screen.getByLabelText("Last Game");
        expect(lastRadio).toBeInTheDocument();
        expect(lastRadio).not.toBeChecked();
      })
      it('render the "Series" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const seriesRadio = screen.getByLabelText("Series");
        expect(seriesRadio).toBeInTheDocument();
        expect(seriesRadio).not.toBeChecked();
      })
      it('DO NOT render the Pot Type errors', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const potTypeError = screen.queryByTestId("dangerPotType");
        expect(potTypeError).toHaveTextContent("");
      })
      it('render the Division Radio label', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const divRadioLabel = screen.getByTestId("divRadioLabel");        
        expect(divRadioLabel).toBeInTheDocument();
      })
      it('render the "Sratch" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);        
        const scratchRadio = screen.getByLabelText("Scratch");
        expect(scratchRadio).not.toBeChecked();        
      })
      it('render the "HDCP" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
               
        const hdcpRadio = screen.getByLabelText("Hdcp");
        expect(hdcpRadio).not.toBeChecked();
      })
      it('DO NOT render the Division errors', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const divError = screen.queryByTestId("dangerDiv");
        expect(divError).toHaveTextContent("");
      })
      it('render the "Fee" labels', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const feeLabels = screen.getAllByLabelText("Fee");
        expect(feeLabels).toHaveLength(mockPots.length);
      })
      it('render the "Fee" values', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const fee = screen.getByTestId("inputPotFee") as HTMLInputElement;                
        expect(fee.value).toBe('');
      })
      it('DO NOT render the "Fee" errors', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const feeError = screen.queryByTestId("dangerPotFee");        
        expect(feeError).toHaveTextContent("");
      })
      it('render the "Add Pot" button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const addPotBtn = screen.getByText("Add Pot");
        expect(addPotBtn).toBeInTheDocument();
      })
      it('render the tabs', async () => {         
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);        
        const tabs = screen.getAllByRole("tab");        
        expect(tabs).toHaveLength(mockPots.length);
        await user.click(tabs[0]);
        
        expect(tabs[0]).toHaveTextContent('Create Pot');
        expect(tabs[0]).toHaveAttribute("aria-selected", "true");
        expect(tabs[1]).toHaveTextContent(mockPots[1].pot_type + ' - ' + mockPots[1].div_name);
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
        expect(tabs[2]).toHaveTextContent(mockPots[2].pot_type + ' - ' + mockPots[2].div_name);
        expect(tabs[2]).toHaveAttribute("aria-selected", "false");
        expect(tabs[3]).toHaveTextContent(mockPots[3].pot_type + ' - ' + mockPots[3].div_name);
        expect(tabs[3]).toHaveAttribute("aria-selected", "false");
        expect(tabs[4]).toHaveTextContent(mockPots[4].pot_type + ' - ' + mockPots[4].div_name);
        expect(tabs[4]).toHaveAttribute("aria-selected", "false");
      })
    });

    describe('render the 1st pot', () => { 
      it('render the "Game - Scratch" pot', async () => {
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(5);
        // ARRANGE
        await user.click(tabs[1]);

        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "true");
        expect(tabs[2]).toHaveAttribute("aria-selected", "false");
        expect(tabs[3]).toHaveAttribute("aria-selected", "false");
        expect(tabs[4]).toHaveAttribute("aria-selected", "false");
      })    
      it('render the pot type labels', async () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[1]);
        const potTypeLabels = screen.getAllByLabelText("Pot Type");
        expect(potTypeLabels).toHaveLength(mockPots.length - 1); // -1 for 1st pot
      })
      it('render the pot type value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[1]);
        const potTypeValue = screen.getByTestId("potType2") as HTMLInputElement;
        expect(potTypeValue.value).toBe(mockPots[1].pot_type);
        expect(potTypeValue).toBeDisabled();
      })
      it('render the division labels', async () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[1]);
        const divLabels = screen.getAllByLabelText("Division");
        expect(divLabels).toHaveLength(mockPots.length - 1); // -1 for 1st pot
      })
      it('render the division value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[1]);
        const divValue = screen.getByTestId("divName2") as HTMLInputElement;
        expect(divValue.value).toBe(mockPots[1].div_name);
        expect(divValue).toBeDisabled();
      })
      it('render the pot fee value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[1]);
        const potFeeValue = screen.getByTestId("potFee2") as HTMLInputElement;        
        expect(potFeeValue.value).toBe(formatValueSymbSep2Dec(mockPots[1].fee, localConfig));
      })
      it('DO NOT render the pot fee error', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[1]);
        const potFeeError = screen.queryByTestId("dangerPotFee2");        
        expect(potFeeError).toHaveTextContent("");
      })
      it('render the "Delete Pot" button', async () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[1]);        
        const delPotBtns = screen.getAllByText("Delete Pot");
        expect(delPotBtns).toHaveLength(4);
      })
    })

    describe('render the 2nd pot', () => { 
      beforeAll(() => {
        mockPots[2].fee_err = 'test fee error';
      })
      afterAll(() => {
        mockPots[2].fee_err = '';
      })
      it('render the "Game - Scratch" pot', async () => {
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(5);
        // ARRANGE
        await user.click(tabs[2]);

        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
        expect(tabs[2]).toHaveAttribute("aria-selected", "true");
        expect(tabs[3]).toHaveAttribute("aria-selected", "false");
        expect(tabs[4]).toHaveAttribute("aria-selected", "false");
      })    
      it('render the pot type value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[2]);
        const potTypeValue = screen.getByTestId("potType3") as HTMLInputElement;
        expect(potTypeValue.value).toBe(mockPots[2].pot_type);
        expect(potTypeValue).toBeDisabled();
      })
      it('render the division value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[2]);
        const divValue = screen.getByTestId("divName3") as HTMLInputElement;
        expect(divValue.value).toBe(mockPots[2].div_name);
        expect(divValue).toBeDisabled();
      })
      it('render the pot fee value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[2]);
        const potFeeValue = screen.getByTestId("potFee3") as HTMLInputElement;
        expect(potFeeValue).toHaveClass("is-invalid");
        expect(potFeeValue.value).toBe(formatValueSymbSep2Dec(mockPots[2].fee, localConfig));
      })
      it('render the pot fee error', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[2]);
        const potFeeError = screen.queryByTestId("dangerPotFee3");      
        expect(potFeeError).toHaveTextContent('test fee error');
      })
    })

    describe('render the 3rd pot', () => { 
      it('render the "Game - Scratch" pot', async () => {
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(5);
        // ARRANGE
        await user.click(tabs[3]);

        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
        expect(tabs[2]).toHaveAttribute("aria-selected", "false");
        expect(tabs[3]).toHaveAttribute("aria-selected", "true");
        expect(tabs[4]).toHaveAttribute("aria-selected", "false");
      })    
      it('render the pot type value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[3]);
        const potTypeValue = screen.getByTestId("potType4") as HTMLInputElement;
        expect(potTypeValue.value).toBe(mockPots[3].pot_type);
        expect(potTypeValue).toBeDisabled();
      })
      it('render the division value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[3]);
        const divValue = screen.getByTestId("divName4") as HTMLInputElement;
        expect(divValue.value).toBe(mockPots[3].div_name);
        expect(divValue).toBeDisabled();
      })
      it('render the pot fee value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[3]);
        const potFeeValue = screen.getByTestId("potFee4") as HTMLInputElement;
        expect(potFeeValue.value).toBe(formatValueSymbSep2Dec(mockPots[3].fee, localConfig));
      })
      it('DO NOT render the pot fee error', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[3]);
        const potFeeError = screen.queryByTestId("dangerPotFee4");      
        expect(potFeeError).toHaveTextContent("");
      })
    })

    describe('render the 4th pot', () => { 
      it('render the "Game - Scratch" pot', async () => {
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(5);
        // ARRANGE
        await user.click(tabs[4]);

        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
        expect(tabs[2]).toHaveAttribute("aria-selected", "false");
        expect(tabs[3]).toHaveAttribute("aria-selected", "false");
        expect(tabs[4]).toHaveAttribute("aria-selected", "true");
      })    
      it('render the pot type value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[4]);
        const potTypeValue = screen.getByTestId("potType5") as HTMLInputElement;
        expect(potTypeValue.value).toBe(mockPots[4].pot_type);
        expect(potTypeValue).toBeDisabled();
      })
      it('render the division value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[4]);
        const divValue = screen.getByTestId("divName5") as HTMLInputElement;
        expect(divValue.value).toBe(mockPots[4].div_name);
        expect(divValue).toBeDisabled();
      })
      it('render the pot fee value', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[4]);
        const potFeeValue = screen.getByTestId("potFee5") as HTMLInputElement;
        expect(potFeeValue.value).toBe(formatValueSymbSep2Dec(mockPots[4].fee, localConfig));
      })
      it('DO NOT render the pot fee error', async () => { 
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await userEvent.click(tabs[4]);
        const potFeeError = screen.queryByTestId("dangerPotFee5");      
        expect(potFeeError).toHaveTextContent("");
      })
    })
  });

  describe('render radio buttons, buttons in group have the same name', () => { 

    it("pot type radio buttons have the same name", () => {
      // const user = userEvent.setup()
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);
      const gameRadio = screen.getByLabelText("Game") as HTMLInputElement; // pot type: Game        
      const lastRadio = screen.getByLabelText("Last Game") as HTMLInputElement; // pot type: Last Game
      const seriesRadio = screen.getByLabelText("Series") as HTMLInputElement; // pot type: Series      
      expect(gameRadio).toHaveAttribute('name', 'potTypeRadio');
      expect(lastRadio).toHaveAttribute('name', 'potTypeRadio');
      expect(seriesRadio).toHaveAttribute('name', 'potTypeRadio');
    })

    it("division radio buttons have the same name", () => {
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);
      const scratchRadio = screen.getByLabelText("Scratch") as HTMLInputElement; // div: Scratch
      const hdcpRadio = screen.getByLabelText("Hdcp") as HTMLInputElement; // div: Hdcp
      expect(scratchRadio).toHaveAttribute('name', 'potsDivRadio');
      expect(hdcpRadio).toHaveAttribute('name', 'potsDivRadio');
    })

    // it("each division radio button has same name (group)", () => {
    //   render(<ZeroToNPots {...mockZeroToNPotsProps} />);
    // })

    // it("click each pot type radio button", async () => {
    //   const user = userEvent.setup()
    //   render(<ZeroToNPots {...mockZeroToNPotsProps} />);
    //   const gameRadio = screen.getByTestId("potTypeRadio1") as HTMLInputElement; // pot type: Game        
    //   const lastRadio = screen.getByTestId("potTypeRadio2") as HTMLInputElement; // pot type: Last Game
    //   const seriesRadio = screen.getByTestId("potTypeRadio3") as HTMLInputElement; // pot type: Series      
    //   expect(gameRadio).not.toBeChecked();
    //   expect(lastRadio).not.toBeChecked();
    //   expect(seriesRadio).not.toBeChecked();      
      
    //   // <input> atribute checked is set as: 
    //   // checked={pot.pot_type === potCat.name}
    //   await user.click(gameRadio)
    //   mockPots[0].pot_type = "Game"
    //   try {
    //     expect(gameRadio).toBeChecked();
    //   } catch (error) {
    //     expect(mockZeroToNPotsProps.pots[0].pot_type).toEqual("Game")
    //   }
    //   expect(lastRadio).not.toBeChecked();
    //   expect(seriesRadio).not.toBeChecked();

    //   await user.click(lastRadio)
    //   mockPots[0].pot_type = "Last Game"
    //   try {
    //     expect(lastRadio).toBeChecked();
    //   }
    //   catch (error) {
    //     expect(mockZeroToNPotsProps.pots[0].pot_type).toEqual("Last Game")
    //   }
    //   expect(gameRadio).not.toBeChecked();
    //   expect(seriesRadio).not.toBeChecked();

    //   await user.click(seriesRadio)
    //   mockPots[0].pot_type = "Series"
    //   try {
    //     expect(seriesRadio).toBeChecked();
    //   }
    //   catch (error) {
    //     expect(mockZeroToNPotsProps.pots[0].pot_type).toEqual("Series")
    //   }
    //   expect(gameRadio).not.toBeChecked();
    //   expect(lastRadio).not.toBeChecked();
    // })

    // it("click each division radio button", async () => {
    //   const user = userEvent.setup()
    //   render(<ZeroToNPots {...mockZeroToNPotsProps} />);
    //   const scratchRadio = screen.getByTestId("divRadio1"); // pot type: Game        
    //   const hdcpRadio = screen.getByTestId("divRadio2"); // pot type: Last Game      
    //   expect(scratchRadio).not.toBeChecked();
    //   expect(hdcpRadio).not.toBeChecked();      

    //   // <input> atribute checked is set as: 
    //   // checked={pot.div_name === div.div_name}
    //   await user.click(scratchRadio)
    //   mockPots[0].div_name = mockDivs[0].div_name  // manually set div name 'Scratch'
    //   try {
    //     expect(scratchRadio).toBeChecked();        
    //   } catch (error) {
    //     expect(mockZeroToNPotsProps.pots[0].div_name).toEqual(mockZeroToNPotsProps.divs[0].div_name)
    //   }
    //   expect(hdcpRadio).not.toBeChecked();      
      
    //   await user.click(hdcpRadio)
    //   mockPots[0].div_name = mockDivs[1].div_name  // manually set div name 'Hdcp'      
    //   try {
    //     expect(hdcpRadio).toBeChecked();        
    //   } catch (error) {
    //     expect(mockZeroToNPotsProps.pots[0].div_name).toEqual(mockZeroToNPotsProps.divs[1].div_name)
    //   }
    //   expect(scratchRadio).not.toBeChecked();      
    // })
  })

  describe('render the create pot with errors', () => { 
    beforeAll(() => {
      mockPots[0].pot_type_err = 'test pot type error';
      mockPots[0].div_err = 'test div error';
      mockPots[0].fee_err = 'test fee error';
      mockPots[0].fee = '0';
    })
    afterAll(() => {
      mockPots[0].pot_type_err = '';
      mockPots[0].div_err = '';
      mockPots[0].fee_err = '';     
      mockPots[0].fee = '';
    })
    it("render Pot Type error", () => {
      // ARRANGE
      // const user = userEvent.setup()
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);
      // ACT      
      const potTypeError = screen.queryByTestId("dangerPotType");      
      // ASSERT      
      expect(potTypeError).toHaveTextContent('test pot type error');
    })
    it("render Pot Type error", () => {            
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);      
      const potDivError = screen.queryByTestId("dangerDiv");            
      expect(potDivError).toHaveTextContent('test div error');
    })
    it('render the "Fee" values', () => {
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);
      const fee = screen.getByTestId("inputPotFee") as HTMLInputElement;              
      expect(fee).toHaveClass("is-invalid");
      expect(fee.value).toBe(formatValueSymbSep2Dec(mockPots[0].fee, localConfig));
    })
    it("render Pot Fee error", () => {            
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);      
      const potFeeError = screen.queryByTestId("dangerPotFee");            
      expect(potFeeError).toHaveTextContent('test fee error');
    })
  })

  describe('add a pot', () => { 
    beforeAll(() => {
      mockPots.push({
        ...initPot,
        id: "test-id",
        pot_type: 'Last Game',
        div_name: 'Hdcp',
        fee: '10',
        sort_order: 6
      })
    })
    afterAll(() => {
      if (mockPots.length === 6) mockPots.pop();
    })
    it('test if added pot has correct tab title', async () => { 
      // ARRANGE
      const user = userEvent.setup();
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);
      const addBtn = screen.getByText("Add Pot");
      // ACT
      await user.click(addBtn);
      // ASSERT
      expect(mockZeroToNPotsProps.setPots).toHaveBeenCalled();

      // ACT
      const tabs = screen.getAllByRole("tab");
      // ASSERT
      expect(tabs.length).toBe(6);
      const tabTitle = getPotName(mockPots[5], mockDivs);
      expect(tabs[5]).toHaveTextContent(tabTitle);
    })
  })

  describe('remove a pot', () => {
    beforeAll(() => {
      mockPots.push({
        ...initPot,
        id: "test-id",
        pot_type: 'Last Game',
        div_name: 'Hdcp',
        fee: '10',
        sort_order: 6
      })
    })
    afterAll(() => {
      if (mockPots.length === 6) mockPots.pop();
    })
    it('delete pot', async () => { 
      // ARRANGE
      const user = userEvent.setup();
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);
      // ACT
      const tabs = screen.getAllByRole("tab");
      // ARRANGE
      await user.click(tabs[5]);
      const delBtns = screen.getAllByText("Delete Pot");
      // ASSERT
      expect(delBtns.length).toBe(5);
      // ACT
      await user.click(delBtns[4]);
      // ASSERT
      expect(mockZeroToNPotsProps.setPots).toHaveBeenCalled();            
    })
  })
})