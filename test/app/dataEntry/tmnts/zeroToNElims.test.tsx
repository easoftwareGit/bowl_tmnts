import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ZeroToNElims from "../../../../src/app/dataEntry/tmnt/zeroToNElims";
import { mockElims, mockDivs, mockSquads } from "../../../mocks/tmnts/twoDivs/mockDivs";
import { localConfig } from "@/lib/currency/const";
import { formatValueSymbSep2Dec } from "@/lib/currency/formatValue";
import { defaultElimGames, initElim } from "@/app/dataEntry/tmnt/initVals";
import { getBrktOrElimName } from "@/lib/getName";

const mockSetElims = jest.fn();
const mockSetAcdnErr = jest.fn();

const mockZeroToNElimsProps = {
  elims: mockElims, 
  setElims: mockSetElims,
  divs: mockDivs,
  squads: mockSquads,
  setAcdnErr: mockSetAcdnErr
}

describe('ZeroToNElims - Component', () => { 

  describe('render the component', () => { 

    describe('render the Create Eliminator tab', () => { 
      it('render the Division label', () => { 
        // ARRANGE
        // const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />)
        // ACT
        const divLabels = screen.getAllByText(/division/i);        
        // ASSERT        
        expect(divLabels).toHaveLength(mockElims.length);
      })
      it('render the "Scratch" radio button', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const scratchRadio = screen.getByRole('radio', { name: /scratch/i }) as HTMLInputElement;
        expect(scratchRadio).not.toBeChecked();        
      })
      it('render the "Hdcp" radio button', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const hdcpRadio = screen.getByRole('radio', { name: /hdcp/i }) as HTMLInputElement;
        expect(hdcpRadio).not.toBeChecked();        
      })
      it('render the "Fee" label', () => {
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const feeLabels = screen.getAllByText("Fee");
        expect(feeLabels).toHaveLength(mockElims.length);
      })
      it('render the "Fee" input', () => {
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];        
        expect(fees).toHaveLength(mockElims.length);
        expect(fees[0]).toHaveValue('');
      })
      it('DO NOT render the create eliminator fee error', () => {
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimFeeError = screen.queryByTestId("dangerCreateElimFee");
        expect(elimFeeError).toHaveTextContent("");
      })
      it('render the create eliminator "Start" label', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const startLabels = screen.getAllByText(/start/i);
        expect(startLabels).toHaveLength(mockElims.length);
      })
      it('render the create eliminator "Start" input', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const startInputs = screen.getAllByRole('spinbutton', { name: /start/i }) as HTMLInputElement[];        
        expect(startInputs).toHaveLength(mockElims.length);
        expect(startInputs[0]).toHaveValue(1);
      })
      it('DO NOT render the create eliminator "Start" error', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimStartError = screen.queryByTestId("dangerCreateElimStart");
        expect(elimStartError).toHaveTextContent("");
      })
      it('render the "Games" label', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const gamesLabels = screen.getAllByText("Games");
        expect(gamesLabels).toHaveLength(mockElims.length);
      })
      it('render the "Games" input', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const gamesInputs = screen.getAllByRole('spinbutton', { name: /games/i }) as HTMLInputElement[];
        expect(gamesInputs).toHaveLength(mockElims.length);
        expect(gamesInputs[0]).toHaveValue(defaultElimGames)        
      })
      it('DO NOT render the create eliminator "Start" error', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimGamesError = screen.queryByTestId("dangerCreateElimGames");
        expect(elimGamesError).toHaveTextContent("");
      })
      it('render the "Add Eliminator" button', () => {
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const addBtn = screen.getByText("Add Eliminator");
        expect(addBtn).toBeInTheDocument();
      })
      it('render the tabs', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        expect(tabs).toHaveLength(mockElims.length);
        await user.click(tabs[0]);
        expect(tabs[0]).toHaveTextContent('Create Eliminator');
        expect(tabs[0]).toHaveAttribute("aria-selected", "true");
        expect(tabs[1]).toHaveTextContent('Scratch: 1-3');
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
        expect(tabs[2]).toHaveTextContent('Scratch: 4-6');
        expect(tabs[2]).toHaveAttribute("aria-selected", "false");
        expect(tabs[3]).toHaveTextContent('Hdcp: 1-3');
        expect(tabs[3]).toHaveAttribute("aria-selected", "false");
        expect(tabs[4]).toHaveTextContent('Hdcp: 4-6');
        expect(tabs[4]).toHaveAttribute("aria-selected", "false");
      })
    })

    describe('render the "Scratch: 1-3" eliminator', () => { 
      it('render the "Scratch: 1-3" eliminator', async () => { 
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(mockElims.length);
        // ARRANGE
        await user.click(tabs[1]);
        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "true");
        expect(tabs[2]).toHaveAttribute("aria-selected", "false");
        expect(tabs[3]).toHaveAttribute("aria-selected", "false");
        expect(tabs[4]).toHaveAttribute("aria-selected", "false");
      })
      it('render the Division label', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const divLabels = screen.getAllByText(/division/i);        
        expect(divLabels).toHaveLength(mockElims.length);
      })
      it('render the Division input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const divInputs = screen.getAllByRole('textbox', { name: /division/i }) as HTMLInputElement[];        
        expect(divInputs).toHaveLength(mockElims.length - 1);
        expect(divInputs[0]).toHaveValue(mockElims[1].div_name);
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const feeInputs = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];        
        expect(feeInputs[1]).toHaveValue(formatValueSymbSep2Dec(mockElims[1].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const startInputs = screen.getAllByRole('spinbutton', { name: /start/i }) as HTMLInputElement[];                
        expect(startInputs[1]).toHaveValue(mockElims[1].start);
        expect(startInputs[1]).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const gamesInputs = screen.getAllByRole('spinbutton', { name: /games/i }) as HTMLInputElement[];        
        expect(gamesInputs[1]).toHaveValue(mockElims[1].games);
        expect(gamesInputs[1]).toBeDisabled();
      })
      it('render the Delete Eliminator button', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const delBtns = screen.getAllByRole("button", { name: /delete eliminator/i });        
        expect(delBtns).toHaveLength(mockElims.length - 1) // add button shown in Create Bracket tab      
      })      
    })

    describe('render the "Scratch: 4-6" eliminator', () => { 
      it('render the "Scratch: 4-6" eliminator', async () => { 
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(mockElims.length);
        // ARRANGE
        await user.click(tabs[2]);
        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
        expect(tabs[2]).toHaveAttribute("aria-selected", "true");
        expect(tabs[3]).toHaveAttribute("aria-selected", "false");
        expect(tabs[4]).toHaveAttribute("aria-selected", "false");
      })
      it('render the Division input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const divInputs = screen.getAllByRole('textbox', { name: /division/i }) as HTMLInputElement[];        
        expect(divInputs).toHaveLength(mockElims.length - 1);
        expect(divInputs[1]).toHaveValue(mockElims[2].div_name);
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const feeInputs = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];        
        expect(feeInputs[2]).toHaveValue(formatValueSymbSep2Dec(mockElims[2].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const startInputs = screen.getAllByRole('spinbutton', { name: /start/i }) as HTMLInputElement[];                
        expect(startInputs[2]).toHaveValue(mockElims[2].start);
        expect(startInputs[2]).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const gamesInputs = screen.getAllByRole('spinbutton', { name: /games/i }) as HTMLInputElement[];        
        expect(gamesInputs[2]).toHaveValue(mockElims[2].games);
        expect(gamesInputs[2]).toBeDisabled();
      })
    })

    describe('render the "Hdcp: 1-3" eliminator', () => { 
      it('render the "Hdcp: 1-3" eliminator', async () => { 
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(mockElims.length);
        // ARRANGE
        await user.click(tabs[3]);
        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
        expect(tabs[2]).toHaveAttribute("aria-selected", "false");
        expect(tabs[3]).toHaveAttribute("aria-selected", "true");
        expect(tabs[4]).toHaveAttribute("aria-selected", "false");
      })
      it('render the Division input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const divInputs = screen.getAllByRole('textbox', { name: /division/i }) as HTMLInputElement[];        
        expect(divInputs).toHaveLength(mockElims.length - 1);
        expect(divInputs[2]).toHaveValue(mockElims[3].div_name);
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const feeInputs = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];        
        expect(feeInputs[3]).toHaveValue(formatValueSymbSep2Dec(mockElims[3].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const startInputs = screen.getAllByRole('spinbutton', { name: /start/i }) as HTMLInputElement[];                
        expect(startInputs[3]).toHaveValue(mockElims[3].start);
        expect(startInputs[3]).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const gamesInputs = screen.getAllByRole('spinbutton', { name: /games/i }) as HTMLInputElement[];        
        expect(gamesInputs[3]).toHaveValue(mockElims[3].games);
        expect(gamesInputs[3]).toBeDisabled();
      })
    })

    describe('render the "Hdcp: 4-6" eliminator', () => { 
      it('render the "Hdcp: 4-6" eliminator', async () => { 
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(mockElims.length);
        // ARRANGE
        await user.click(tabs[4]);
        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
        expect(tabs[2]).toHaveAttribute("aria-selected", "false");
        expect(tabs[3]).toHaveAttribute("aria-selected", "false");
        expect(tabs[4]).toHaveAttribute("aria-selected", "true");
      })
      it('render the Division input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const divInputs = screen.getAllByRole('textbox', { name: /division/i }) as HTMLInputElement[];        
        expect(divInputs).toHaveLength(mockElims.length - 1);
        expect(divInputs[3]).toHaveValue(mockElims[4].div_name);
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const feeInputs = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];        
        expect(feeInputs[4]).toHaveValue(formatValueSymbSep2Dec(mockElims[4].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const startInputs = screen.getAllByRole('spinbutton', { name: /start/i }) as HTMLInputElement[];                
        expect(startInputs[4]).toHaveValue(mockElims[4].start);
        expect(startInputs[4]).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const gamesInputs = screen.getAllByRole('spinbutton', { name: /games/i }) as HTMLInputElement[];        
        expect(gamesInputs[4]).toHaveValue(mockElims[4].games);
        expect(gamesInputs[4]).toBeDisabled();
      })
    })

    describe('render radio buttons, buttons in group have the same name', () => { 
      it("pot type radio buttons have the same name", () => {
        // const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const scratchRadio = screen.getByRole('radio', { name: /scratch/i }) as HTMLInputElement;
        const hdcpRadio = screen.getByRole('radio', { name: /hdcp/i }) as HTMLInputElement;
        expect(scratchRadio).toHaveAttribute('name', 'elimsDivRadio');
        expect(hdcpRadio).toHaveAttribute('name', 'elimsDivRadio');
      })  
    })

    describe('render the create eliminator with errors', () => { 
      beforeAll(() => {
        mockElims[0].div_err = "test division error";
        mockElims[0].start_err = "test start error";
        mockElims[0].fee_err = "test fee error";   
        mockElims[0].games_err = "test games error";
      })
      afterAll(() => {
        mockElims[0].div_err = "";
        mockElims[0].start_err = "";
        mockElims[0].fee_err = "";    
        mockElims[0].games_err = "";
      })
      it('render divison error', async () => { 
        // ARRANGE
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        // ACT      
        const divError = screen.queryByTestId("dangerElimDivRadio");      
        // ASSERT      
        expect(divError).toHaveTextContent('test division error');
      })
      it('render fee error', async () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const feeError = screen.queryByTestId("dangerCreateElimFee");
        expect(feeError).toHaveTextContent('test fee error');
      })
      it('render start error', async () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const startError = screen.queryByTestId("dangerCreateElimStart");
        expect(startError).toHaveTextContent('test start error');
      })
      it('render games error', async () => {
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const gamesError = screen.queryByTestId("dangerCreateElimGames");
        expect(gamesError).toHaveTextContent('test games error');
      })
    })

  })

  describe('add an eliminator', () => {
    beforeAll(() => {
      mockElims.push({
        ...initElim,
        id: "test-id",
        sort_order: 6,
        div_name: "Sctatch",
        fee: "10",
        start: 1,
        games: 4,
      });
    })
    afterAll(() => {
      if (mockElims.length === 6) mockElims.pop();        
    })
    it('test if added eliminator has correct title', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(<ZeroToNElims {...mockZeroToNElimsProps} />);
      const addBtn = screen.getByText("Add Eliminator");
      // ACT
      await user.click(addBtn);
      // ASSERT
      expect(mockZeroToNElimsProps.setElims).toHaveBeenCalled();

      // ACT
      const tabs = screen.getAllByRole("tab");
      // ASSERT
      expect(tabs.length).toBe(6);
      const tabTitle = getBrktOrElimName(mockElims[5].id, mockZeroToNElimsProps.elims)
      expect(tabs[5]).toHaveTextContent(tabTitle);        
    })
  })

  describe('remove an eliminator', () => { 
    beforeAll(() => {
      mockElims.push({
        ...initElim,
        id: "test-id",
        sort_order: 6,
        div_name: "Sctatch",
        fee: "10",
        start: 1,
        games: 4,
      });
    })
    afterAll(() => {
      if (mockElims.length === 6) mockElims.pop();
    })
    it('delete eliminator', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(<ZeroToNElims {...mockZeroToNElimsProps} />);
      // ACT
      const tabs = screen.getAllByRole("tab");
      // ARRANGE
      await user.click(tabs[5]);
      const delBtns = screen.getAllByText("Delete Eliminator");
      // ASSERT
      expect(delBtns.length).toBe(5);
      // ACT
      await user.click(delBtns[4]);
      // ASSERT
      expect(mockZeroToNElimsProps.setElims).toHaveBeenCalled();                    
    })
  })
})