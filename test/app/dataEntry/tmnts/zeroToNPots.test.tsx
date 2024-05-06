import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ZeroToNPots from "../../../../src/app/dataEntry/tmnt/zeroToNPots";
import { mockPots, mockDivs, mockSquads } from "../../../mocks/tmnts/twoDivs/mockDivs";
import { localConfig } from "@/lib/currency/const";
import { formatValueSymbSep2Dec } from "@/lib/currency/formatValue";
import { initPot } from "@/app/dataEntry/tmnt/initVals";
import { getPotName } from "@/lib/getName";
import { mock } from "node:test";

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
        const potTypeLabels = screen.getAllByText(/pot type/i);        
        // ASSERT        
        expect(potTypeLabels).toHaveLength(mockPots.length)        
      })
      it('render the "Game" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);        
        const gameRadio = screen.getByRole('radio', { name: "Game" }) as HTMLInputElement;
        expect(gameRadio).toBeInTheDocument();
        expect(gameRadio).not.toBeChecked();
      })
      it('render the "Last Game" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);        
        const lastRadio = screen.getByRole('radio', { name: /last game/i }) as HTMLInputElement;
        expect(lastRadio).toBeInTheDocument();
        expect(lastRadio).not.toBeChecked();
      })
      it('render the "Series" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);        
        const seriesRadio = screen.getByRole('radio', { name: /series/i }) as HTMLInputElement;
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
        const divLabels = screen.getAllByText(/division/i)
        expect(divLabels).toHaveLength(mockPots.length)
      })
      it('render the "Sratch" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);        
        const scratchRadio = screen.getByRole('radio', { name: /scratch/i }) as HTMLInputElement;
        expect(scratchRadio).not.toBeChecked();        
      })
      it('render the "HDCP" radio button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);                       
        const hdcpRadio = screen.getByRole('radio', { name: /hdcp/i }) as HTMLInputElement;
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
        const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
        expect(fees).toHaveLength(mockPots.length)
        expect(fees[0]).toHaveValue('')
      })
      it('DO NOT render the "Fee" errors', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const feeError = screen.queryByTestId("dangerPotFee");        
        expect(feeError).toHaveTextContent("");
      })
      it('render the "Add Pot" button', () => {
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const addBtn = screen.getByRole("button", { name: /add pot/i });
        expect(addBtn).toBeInTheDocument();
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
        expect(tabs).toHaveLength(mockPots.length);
        // ARRANGE
        await user.click(tabs[1]);

        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "true");
        expect(tabs[2]).toHaveAttribute("aria-selected", "false");
        expect(tabs[3]).toHaveAttribute("aria-selected", "false");
        expect(tabs[4]).toHaveAttribute("aria-selected", "false");
      })    
      it('render the pot type value', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);        
        const potTypeValues = screen.getAllByRole('textbox', { name: /pot type/i }) as HTMLInputElement[];
        expect(potTypeValues).toHaveLength(mockPots.length - 1);        
        expect(potTypeValues[0]).toHaveValue(mockPots[1].pot_type);
        expect(potTypeValues[0]).toBeDisabled();
      })
      it('render the division value', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);        
        const divValues = screen.getAllByRole('textbox', { name: /division/i }) as HTMLInputElement[];
        expect(divValues).toHaveLength(mockPots.length - 1);
        expect(divValues[0]).toHaveValue(mockPots[1].div_name);
        expect(divValues[0]).toBeDisabled();
      })
      it('render the pot fee value', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const potFeeValues = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
        expect(potFeeValues).toHaveLength(mockPots.length); // NOT mockPots.length - 1        
        expect(potFeeValues[1]).toHaveValue(formatValueSymbSep2Dec(mockPots[1].fee, localConfig));
      })
      it('DO NOT render the pot fee error', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const potFeeError = screen.queryByTestId("dangerPotFee2");        
        expect(potFeeError).toHaveTextContent("");
      })
      it('render the "Delete Pot" button', async () => {
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);   
        const delBtns = screen.getAllByRole("button", { name: /delete pot/i });
        // const delPotBtns = screen.getAllByText("Delete Pot");
        expect(delBtns).toHaveLength(mockPots.length - 1); // add button shown in Create Pot tab
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
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const potTypeValues = screen.getAllByRole('textbox', { name: /pot type/i }) as HTMLInputElement[];
        expect(potTypeValues).toHaveLength(mockPots.length - 1);        
        expect(potTypeValues[1]).toHaveValue(mockPots[2].pot_type);
        expect(potTypeValues[1]).toBeDisabled();
      })
      it('render the division value', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const divValues = screen.getAllByRole('textbox', { name: /division/i }) as HTMLInputElement[];
        expect(divValues).toHaveLength(mockPots.length - 1);
        expect(divValues[1]).toHaveValue(mockPots[2].div_name);
        expect(divValues[1]).toBeDisabled();
      })
      it('render the pot fee value', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const potFeeValues = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
        expect(potFeeValues).toHaveLength(mockPots.length); // NOT mockPots.length - 1        
        expect(potFeeValues[2]).toHaveValue(formatValueSymbSep2Dec(mockPots[2].fee, localConfig)); 
      })
      it('render the pot fee error', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
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
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const potTypeValues = screen.getAllByRole('textbox', { name: /pot type/i }) as HTMLInputElement[];
        expect(potTypeValues).toHaveLength(mockPots.length - 1);        
        expect(potTypeValues[2]).toHaveValue(mockPots[3].pot_type);
        expect(potTypeValues[2]).toBeDisabled();
      })
      it('render the division value', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const divValues = screen.getAllByRole('textbox', { name: /division/i }) as HTMLInputElement[];
        expect(divValues).toHaveLength(mockPots.length - 1);
        expect(divValues[2]).toHaveValue(mockPots[3].div_name);
        expect(divValues[2]).toBeDisabled();
      })
      it('render the pot fee value', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const potFeeValues = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
        expect(potFeeValues).toHaveLength(mockPots.length); // NOT mockPots.length - 1        
        expect(potFeeValues[3]).toHaveValue(formatValueSymbSep2Dec(mockPots[3].fee, localConfig)); 
      })
      it('DO NOT render the pot fee error', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
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
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const potTypeValues = screen.getAllByRole('textbox', { name: /pot type/i }) as HTMLInputElement[];
        expect(potTypeValues).toHaveLength(mockPots.length - 1);        
        expect(potTypeValues[3]).toHaveValue(mockPots[4].pot_type);
        expect(potTypeValues[3]).toBeDisabled();
      })
      it('render the division value', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const divValues = screen.getAllByRole('textbox', { name: /division/i }) as HTMLInputElement[];
        expect(divValues).toHaveLength(mockPots.length - 1);
        expect(divValues[3]).toHaveValue(mockPots[4].div_name);
        expect(divValues[3]).toBeDisabled();
      })
      it('render the pot fee value', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const potFeeValues = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
        expect(potFeeValues).toHaveLength(mockPots.length); // NOT mockPots.length - 1        
        expect(potFeeValues[4]).toHaveValue(formatValueSymbSep2Dec(mockPots[4].fee, localConfig)); 
      })
      it('DO NOT render the pot fee error', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNPots {...mockZeroToNPotsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const potFeeError = screen.queryByTestId("dangerPotFee5");      
        expect(potFeeError).toHaveTextContent("");
      })
    })
  });

  describe('render radio buttons, buttons in group have the same name', () => { 

    it("pot type radio buttons have the same name", () => {
      // const user = userEvent.setup()
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);
      const gameRadio = screen.getByRole('radio', { name: "Game" }) as HTMLInputElement;
      const lastRadio = screen.getByRole('radio', { name: /last game/i }) as HTMLInputElement;
      const seriesRadio = screen.getByRole('radio', { name: /series/i }) as HTMLInputElement;
      expect(gameRadio).toHaveAttribute('name', 'potTypeRadio');
      expect(lastRadio).toHaveAttribute('name', 'potTypeRadio');
      expect(seriesRadio).toHaveAttribute('name', 'potTypeRadio');
    })

    it("division radio buttons have the same name", () => {
      render(<ZeroToNPots {...mockZeroToNPotsProps} />);
      const scratchRadio = screen.getByRole('radio', { name: /scratch/i }) as HTMLInputElement;
      const hdcpRadio = screen.getByRole('radio', { name: /hdcp/i }) as HTMLInputElement;
      expect(scratchRadio).toHaveAttribute('name', 'potsDivRadio');
      expect(hdcpRadio).toHaveAttribute('name', 'potsDivRadio');
    })
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
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      expect(fees[0]).toHaveClass("is-invalid");
      expect(fees[0]).toHaveValue(formatValueSymbSep2Dec(mockPots[0].fee, localConfig));
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