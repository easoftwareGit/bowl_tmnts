import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ZeroToNElims from "../../../../src/app/dataEntry/tmnt/zeroToNElims";
import { mockElims, mockDivs, mockSquads } from "../../../mocks/tmnts/twoDivs/mockDivs";
import { localConfig } from "@/lib/currency/const";
import { formatValueSymbSep2Dec } from "@/lib/currency/formatValue";
import { initElim } from "@/app/dataEntry/tmnt/initVals";
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
        const divRaidoLabel = screen.getByTestId("elimDivRadioLabel");        
        // ASSERT        
        expect(divRaidoLabel).toBeInTheDocument();        
      })
      it('render the "Scratch" radio button', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const scratchRadio = screen.getByLabelText("Scratch");
        expect(scratchRadio).not.toBeChecked();        
      })
      it('render the "Hdcp" radio button', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const hdcpRadio = screen.getByLabelText("Hdcp"); 
        expect(hdcpRadio).not.toBeChecked();        
      })
      it('render the "Fee" label', () => {
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimFeeLabel = screen.getByTestId("createElimFeeLabel");
        expect(elimFeeLabel).toBeInTheDocument();
      })
      it('render the "Fee" input', () => {
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimFeeInput = screen.getByTestId("createElimFeeInput");
        expect(elimFeeInput).toBeInTheDocument();
      })
      it('DO NOT render the create eliminator fee error', () => {
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimFeeError = screen.queryByTestId("dangerCreateElimFee");
        expect(elimFeeError).toHaveTextContent("");
      })
      it('render the create eliminator "Start" label', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimStartLabel = screen.getByTestId("createElimStartLabel");
        expect(elimStartLabel).toBeInTheDocument();
      })
      it('render the create eliminator "Start" input', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimStartInput = screen.getByTestId("createElimStartInput");
        expect(elimStartInput).toBeInTheDocument();
        expect(elimStartInput).toHaveValue(1);
      })
      it('DO NOT render the create eliminator "Start" error', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimStartError = screen.queryByTestId("dangerCreateElimStart");
        expect(elimStartError).toHaveTextContent("");
      })
      it('render the "Games" label', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimGamesLabel = screen.getByTestId("createElimGamesLabel");
        expect(elimGamesLabel).toBeInTheDocument();
      })
      it('render the "Games" input', () => { 
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const elimGamesInput = screen.getByTestId("createElimGamesInput");
        expect(elimGamesInput).toBeInTheDocument        
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
        const divLabels = screen.getAllByLabelText("Division");
        expect(divLabels).toHaveLength(mockElims.length - 1);
      })
      it('render the Division input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const divInput = screen.getByTestId("elimDiv2") as HTMLInputElement;
        expect(divInput).toBeInTheDocument();
        expect(divInput.value).toBe(mockElims[1].div_name);        
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const feeInput = screen.getByTestId("elimFee2") as HTMLInputElement;
        expect(feeInput).toBeInTheDocument();
        expect(feeInput.value).toBe(formatValueSymbSep2Dec(mockElims[1].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const startInput = screen.getByTestId("inputElim_start2") as HTMLInputElement;
        expect(startInput).toBeInTheDocument();
        expect(startInput.value).toBe(mockElims[1].start.toString());
        expect(startInput).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const gamesInput = screen.getByTestId("inputElim_games2") as HTMLInputElement;
        expect(gamesInput).toBeInTheDocument();
        expect(gamesInput.value).toBe(mockElims[1].games.toString());
        expect(gamesInput).toBeDisabled();
      })
      it('render the Delete Eliminator button', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const delBtns = screen.getAllByText("Delete Eliminator");
        expect(delBtns).toHaveLength(mockElims.length - 1) // add button shown in Create Eliminator tab      
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
      it('render the Division label', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const divLabels = screen.getAllByLabelText("Division");
        expect(divLabels).toHaveLength(mockElims.length - 1);
      })
      it('render the Division input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const divInput = screen.getByTestId("elimDiv3") as HTMLInputElement;
        expect(divInput).toBeInTheDocument();
        expect(divInput.value).toBe(mockElims[2].div_name);        
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const feeInput = screen.getByTestId("elimFee3") as HTMLInputElement;
        expect(feeInput).toBeInTheDocument();
        expect(feeInput.value).toBe(formatValueSymbSep2Dec(mockElims[2].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const startInput = screen.getByTestId("inputElim_start3") as HTMLInputElement;
        expect(startInput).toBeInTheDocument();
        expect(startInput.value).toBe(mockElims[2].start.toString());
        expect(startInput).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const gamesInput = screen.getByTestId("inputElim_games3") as HTMLInputElement;
        expect(gamesInput).toBeInTheDocument();
        expect(gamesInput.value).toBe(mockElims[2].games.toString());
        expect(gamesInput).toBeDisabled();
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
      it('render the Division label', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const divLabels = screen.getAllByLabelText("Division");
        expect(divLabels).toHaveLength(mockElims.length - 1);
      })
      it('render the Division input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const divInput = screen.getByTestId("elimDiv4") as HTMLInputElement;
        expect(divInput).toBeInTheDocument();
        expect(divInput.value).toBe(mockElims[3].div_name);        
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const feeInput = screen.getByTestId("elimFee4") as HTMLInputElement;
        expect(feeInput).toBeInTheDocument();
        expect(feeInput.value).toBe(formatValueSymbSep2Dec(mockElims[3].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const startInput = screen.getByTestId("inputElim_start4") as HTMLInputElement;
        expect(startInput).toBeInTheDocument();
        expect(startInput.value).toBe(mockElims[3].start.toString());
        expect(startInput).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const gamesInput = screen.getByTestId("inputElim_games4") as HTMLInputElement;
        expect(gamesInput).toBeInTheDocument();
        expect(gamesInput.value).toBe(mockElims[3].games.toString());
        expect(gamesInput).toBeDisabled();
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
      it('render the Division label', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const divLabels = screen.getAllByLabelText("Division");
        expect(divLabels).toHaveLength(mockElims.length - 1);
      })
      it('render the Division input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const divInput = screen.getByTestId("elimDiv5") as HTMLInputElement;
        expect(divInput).toBeInTheDocument();
        expect(divInput.value).toBe(mockElims[4].div_name);        
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const feeInput = screen.getByTestId("elimFee5") as HTMLInputElement;
        expect(feeInput).toBeInTheDocument();
        expect(feeInput.value).toBe(formatValueSymbSep2Dec(mockElims[4].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const startInput = screen.getByTestId("inputElim_start5") as HTMLInputElement;
        expect(startInput).toBeInTheDocument();
        expect(startInput.value).toBe(mockElims[4].start.toString());
        expect(startInput).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNElims {...mockZeroToNElimsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const gamesInput = screen.getByTestId("inputElim_games5") as HTMLInputElement;
        expect(gamesInput).toBeInTheDocument();
        expect(gamesInput.value).toBe(mockElims[4].games.toString());
        expect(gamesInput).toBeDisabled();
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
})