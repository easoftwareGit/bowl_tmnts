import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ZeroToNBrackets from "../../../../src/app/dataEntry/tmnt/zeroToNBrackets";
import { mockBrkts, mockDivs, mockSquads } from "../../../mocks/tmnts/twoDivs/mockDivs";
import { localConfig } from "@/lib/currency/const";
import { formatValueSymbSep2Dec } from "@/lib/currency/formatValue";
import { initBrkt } from "@/app/dataEntry/tmnt/initVals";
import exp from "constants";
import { getBrktOrElimName } from "@/lib/getName";

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
      it('render the "Fee" label', () => {
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktFeeLabel = screen.getByTestId("createBrktFeeLabel");
        expect(brktFeeLabel).toBeInTheDocument();
      })
      it('render the "Fee" input', () => {
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktFeeInput = screen.getByTestId("createBrktFeeInput");
        expect(brktFeeInput).toBeInTheDocument();
      })
      it('DO NOT render the create bracket fee error', () => {
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktFeeError = screen.queryByTestId("dangerCreateBrktFee");
        expect(brktFeeError).toHaveTextContent("");
      })
      it('render the create bracket "Start" label', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktStartLabel = screen.getByTestId("createBrktStartLabel");
        expect(brktStartLabel).toBeInTheDocument();
      })
      it('render the create bracket "Start" input', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktStartInput = screen.getByTestId("createBrktStartInput");
        expect(brktStartInput).toBeInTheDocument();
        expect(brktStartInput).toHaveValue(1);
      })
      it('DO NOT render the create bracket "Start" error', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktStartError = screen.queryByTestId("dangerCreateBrktStart");
        expect(brktStartError).toHaveTextContent("");
      })
      it('render the "Games" label', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktGamesLabels = screen.getAllByLabelText("Games");
        expect(brktGamesLabels).toHaveLength(mockBrkts.length);
      })
      it('render the "Games" input', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktGamesInput = screen.getByTestId("inputBrkt_games1");
        expect(brktGamesInput).toBeInTheDocument
        expect(brktGamesInput).toBeDisabled();
      })
      it('render the "Players" label', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktPlayersLabels = screen.getAllByLabelText("Players");
        expect(brktPlayersLabels).toHaveLength(mockBrkts.length);
      })
      it('render the "Players" input', () => {
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktPlayersInput = screen.getByTestId("inputBrkt_players1");
        expect(brktPlayersInput).toBeInTheDocument();
        expect(brktPlayersInput).toBeDisabled();
      })
      it('render the "Add Bracket" button', () => {
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const addBtn = screen.getByText("Add Bracket");
        expect(addBtn).toBeInTheDocument();
      })
      it('render the bracket "First" label', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktFirstLabels = screen.getAllByLabelText("First");
        expect(brktFirstLabels).toHaveLength(mockBrkts.length);
      })
      it('render the bracket "First" input', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktFirstInput = screen.getByTestId("moneyBrkt_first1");
        expect(brktFirstInput).toBeInTheDocument();
        expect(brktFirstInput).toBeDisabled();
        expect(brktFirstInput).toHaveTextContent("");        
      })
      it('render the bracket "Second" label', () => {
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktSecondLabels = screen.getAllByLabelText("Second");
        expect(brktSecondLabels).toHaveLength(mockBrkts.length);
      })
      it('render the bracket "Second" input', () => {
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktSecondInput = screen.getByTestId("moneyBrkt_second1");
        expect(brktSecondInput).toBeInTheDocument();
        expect(brktSecondInput).toBeDisabled();
        expect(brktSecondInput).toHaveTextContent("");
      })
      it('render the bracket "Admin" label', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktAdminLabels = screen.getAllByLabelText("Admin");
        expect(brktAdminLabels).toHaveLength(mockBrkts.length);
      })
      it('render the bracket "Admin" input', () => {
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktAdminInput = screen.getByTestId("moneyBrkt_admin1");
        expect(brktAdminInput).toBeInTheDocument();
        expect(brktAdminInput).toBeDisabled();
        expect(brktAdminInput).toHaveTextContent("");
      })
      it('render the bracket "FSA" label', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const brktFSAs = screen.getAllByLabelText(/F\+S\+A/i);
        expect(brktFSAs).toHaveLength(mockBrkts.length);
      })
      it('render "FSA" titles', () => {
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const fsaTitles = screen.getAllByTitle("First + Second + Admin must equal Fee * Players");
        expect(fsaTitles).toHaveLength(mockBrkts.length);
        expect(fsaTitles[0]).toHaveTextContent("?");
      });
      it('render "FSA" input', () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const fsaInput = screen.getByTestId("moneyBrkt_fsa1");
        expect(fsaInput).toBeInTheDocument();
        expect(fsaInput).toBeDisabled();
        expect(fsaInput).toHaveTextContent("");        
      })
      it('render the tabs', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        expect(tabs).toHaveLength(mockBrkts.length);
        await user.click(tabs[0]);
        expect(tabs[0]).toHaveTextContent('Create Bracket');
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

    describe('render the "Scratch 1-3" bracket', () => { 
      it('render the "Scratch 1-3" bracket', async () => { 
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(mockBrkts.length);
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
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const divLabels = screen.getAllByLabelText("Division");
        expect(divLabels).toHaveLength(mockBrkts.length - 1);
      })
      it('render the Division input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const divInput = screen.getByTestId("brktDiv2") as HTMLInputElement;
        expect(divInput).toBeInTheDocument();
        expect(divInput.value).toBe(mockBrkts[1].div_name);        
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const feeInput = screen.getByTestId("brktFee2") as HTMLInputElement;
        expect(feeInput).toBeInTheDocument();
        expect(feeInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[1].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const startInput = screen.getByTestId("inputBrkt_start2") as HTMLInputElement;
        expect(startInput).toBeInTheDocument();
        expect(startInput.value).toBe(mockBrkts[1].start.toString());
        expect(startInput).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const gamesInput = screen.getByTestId("inputBrkt_games2") as HTMLInputElement;
        expect(gamesInput).toBeInTheDocument();
        expect(gamesInput.value).toBe(mockBrkts[1].games.toString());
        expect(gamesInput).toBeDisabled();
      })
      it('render the Players input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const playersInput = screen.getByTestId("inputBrkt_players2") as HTMLInputElement;
        expect(playersInput).toBeInTheDocument();
        expect(playersInput.value).toBe(mockBrkts[1].players.toString());
        expect(playersInput).toBeDisabled();
      })
      it('input the First input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const firstInput = screen.getByTestId("moneyBrkt_first2") as HTMLInputElement;
        expect(firstInput).toBeInTheDocument();
        expect(firstInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[1].first, localConfig));        
        expect(firstInput).toBeDisabled();
      })
      it('input the Second input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const secondInput = screen.getByTestId("moneyBrkt_second2") as HTMLInputElement;
        expect(secondInput).toBeInTheDocument();
        expect(secondInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[1].second, localConfig));
        expect(secondInput).toBeDisabled();
      })
      it('input the Admin input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const adminInput = screen.getByTestId("moneyBrkt_admin2") as HTMLInputElement;
        expect(adminInput).toBeInTheDocument();
        expect(adminInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[1].admin, localConfig));
        expect(adminInput).toBeDisabled();
      })
      it('render the FSA input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const fsaInput = screen.getByTestId("moneyBrkt_fsa2") as HTMLInputElement;
        expect(fsaInput).toBeInTheDocument();
        expect(fsaInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[1].fsa, localConfig));
        expect(fsaInput).toBeDisabled();
      })
      it('render the Delete Bracket button', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const delBtns = screen.getAllByText("Delete Bracket");
        expect(delBtns).toHaveLength(mockBrkts.length - 1) // add button shown in Create Bracket tab      
      })
    })

    describe('render the "Scratch 4-6" bracket', () => { 
      it('render the "Scratch 4-6" bracket', async () => { 
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(mockBrkts.length);
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
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const divInput = screen.getByTestId("brktDiv3") as HTMLInputElement;
        expect(divInput).toBeInTheDocument();
        expect(divInput.value).toBe(mockBrkts[2].div_name);        
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const feeInput = screen.getByTestId("brktFee3") as HTMLInputElement;
        expect(feeInput).toBeInTheDocument();
        expect(feeInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[2].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const startInput = screen.getByTestId("inputBrkt_start3") as HTMLInputElement;
        expect(startInput).toBeInTheDocument();
        expect(startInput.value).toBe(mockBrkts[2].start.toString());
        expect(startInput).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const gamesInput = screen.getByTestId("inputBrkt_games3") as HTMLInputElement;
        expect(gamesInput).toBeInTheDocument();
        expect(gamesInput.value).toBe(mockBrkts[2].games.toString());
        expect(gamesInput).toBeDisabled();
      })
      it('render the Players input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const playersInput = screen.getByTestId("inputBrkt_players3") as HTMLInputElement;
        expect(playersInput).toBeInTheDocument();
        expect(playersInput.value).toBe(mockBrkts[2].players.toString());
        expect(playersInput).toBeDisabled();
      })
      it('input the First input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const firstInput = screen.getByTestId("moneyBrkt_first3") as HTMLInputElement;
        expect(firstInput).toBeInTheDocument();
        expect(firstInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[2].first, localConfig));        
        expect(firstInput).toBeDisabled();
      })
      it('input the Second input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const secondInput = screen.getByTestId("moneyBrkt_second3") as HTMLInputElement;
        expect(secondInput).toBeInTheDocument();
        expect(secondInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[2].second, localConfig));
        expect(secondInput).toBeDisabled();
      })
      it('input the Admin input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const adminInput = screen.getByTestId("moneyBrkt_admin3") as HTMLInputElement;
        expect(adminInput).toBeInTheDocument();
        expect(adminInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[2].admin, localConfig));
        expect(adminInput).toBeDisabled();
      })
      it('render the FSA input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[2]);
        const fsaInput = screen.getByTestId("moneyBrkt_fsa3") as HTMLInputElement;
        expect(fsaInput).toBeInTheDocument();
        expect(fsaInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[2].fsa, localConfig));
        expect(fsaInput).toBeDisabled();
      })
    })

    describe('render the "Hdcp 1-3" bracket', () => { 
      it('render the "Scratch 1-3" bracket', async () => { 
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(mockBrkts.length);
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
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const divInput = screen.getByTestId("brktDiv4") as HTMLInputElement;
        expect(divInput).toBeInTheDocument();
        expect(divInput.value).toBe(mockBrkts[3].div_name);        
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const feeInput = screen.getByTestId("brktFee4") as HTMLInputElement;
        expect(feeInput).toBeInTheDocument();
        expect(feeInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[3].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const startInput = screen.getByTestId("inputBrkt_start4") as HTMLInputElement;
        expect(startInput).toBeInTheDocument();
        expect(startInput.value).toBe(mockBrkts[3].start.toString());
        expect(startInput).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const gamesInput = screen.getByTestId("inputBrkt_games4") as HTMLInputElement;
        expect(gamesInput).toBeInTheDocument();
        expect(gamesInput.value).toBe(mockBrkts[3].games.toString());
        expect(gamesInput).toBeDisabled();
      })
      it('render the Players input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const playersInput = screen.getByTestId("inputBrkt_players4") as HTMLInputElement;
        expect(playersInput).toBeInTheDocument();
        expect(playersInput.value).toBe(mockBrkts[3].players.toString());
        expect(playersInput).toBeDisabled();
      })
      it('input the First input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const firstInput = screen.getByTestId("moneyBrkt_first4") as HTMLInputElement;
        expect(firstInput).toBeInTheDocument();
        expect(firstInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[3].first, localConfig));        
        expect(firstInput).toBeDisabled();
      })
      it('input the Second input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const secondInput = screen.getByTestId("moneyBrkt_second4") as HTMLInputElement;
        expect(secondInput).toBeInTheDocument();
        expect(secondInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[3].second, localConfig));
        expect(secondInput).toBeDisabled();
      })
      it('input the Admin input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const adminInput = screen.getByTestId("moneyBrkt_admin4") as HTMLInputElement;
        expect(adminInput).toBeInTheDocument();
        expect(adminInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[3].admin, localConfig));
        expect(adminInput).toBeDisabled();
      })
      it('render the FSA input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[3]);
        const fsaInput = screen.getByTestId("moneyBrkt_fsa4") as HTMLInputElement;
        expect(fsaInput).toBeInTheDocument();
        expect(fsaInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[3].fsa, localConfig));
        expect(fsaInput).toBeDisabled();
      })
    })

    describe('render the "Hdcp 4-6" bracket', () => { 
      it('render the "Scratch 4-6" bracket', async () => { 
        // ARRANGE
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs).toHaveLength(mockBrkts.length);
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
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const divInput = screen.getByTestId("brktDiv5") as HTMLInputElement;
        expect(divInput).toBeInTheDocument();
        expect(divInput.value).toBe(mockBrkts[4].div_name);        
      })
      it('render the Fee input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const feeInput = screen.getByTestId("brktFee5") as HTMLInputElement;
        expect(feeInput).toBeInTheDocument();
        expect(feeInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[4].fee, localConfig));
      })
      it('render the Start input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const startInput = screen.getByTestId("inputBrkt_start5") as HTMLInputElement;
        expect(startInput).toBeInTheDocument();
        expect(startInput.value).toBe(mockBrkts[4].start.toString());
        expect(startInput).toBeDisabled();
      })
      it('render the Games input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const gamesInput = screen.getByTestId("inputBrkt_games5") as HTMLInputElement;
        expect(gamesInput).toBeInTheDocument();
        expect(gamesInput.value).toBe(mockBrkts[4].games.toString());
        expect(gamesInput).toBeDisabled();
      })
      it('render the Players input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const playersInput = screen.getByTestId("inputBrkt_players5") as HTMLInputElement;
        expect(playersInput).toBeInTheDocument();
        expect(playersInput.value).toBe(mockBrkts[4].players.toString());
        expect(playersInput).toBeDisabled();
      })
      it('input the First input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const firstInput = screen.getByTestId("moneyBrkt_first5") as HTMLInputElement;
        expect(firstInput).toBeInTheDocument();
        expect(firstInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[4].first, localConfig));        
        expect(firstInput).toBeDisabled();
      })
      it('input the Second input', async () => {
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const secondInput = screen.getByTestId("moneyBrkt_second5") as HTMLInputElement;
        expect(secondInput).toBeInTheDocument();
        expect(secondInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[4].second, localConfig));
        expect(secondInput).toBeDisabled();
      })
      it('input the Admin input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const adminInput = screen.getByTestId("moneyBrkt_admin5") as HTMLInputElement;
        expect(adminInput).toBeInTheDocument();
        expect(adminInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[4].admin, localConfig));
        expect(adminInput).toBeDisabled();
      })
      it('render the FSA input', async () => { 
        const user = userEvent.setup()
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[4]);
        const fsaInput = screen.getByTestId("moneyBrkt_fsa5") as HTMLInputElement;
        expect(fsaInput).toBeInTheDocument();
        expect(fsaInput.value).toBe(formatValueSymbSep2Dec(mockBrkts[4].fsa, localConfig));
        expect(fsaInput).toBeDisabled();
      })
    })

    describe('render the create bracket with errors', () => { 
      beforeAll(() => {
        mockBrkts[0].div_err = "test division error";
        mockBrkts[0].start_err = "test start error";
        mockBrkts[0].fee_err = "test fee error";        
      })
      afterAll(() => {
        mockBrkts[0].div_err = "";
        mockBrkts[0].start_err = "";
        mockBrkts[0].fee_err = "";                
      })
      it('render divison error', async () => { 
        // ARRANGE
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        // ACT      
        const divError = screen.queryByTestId("dangerBrktDivRadio");      
        // ASSERT      
        expect(divError).toHaveTextContent('test division error');
      })
      it('render fee error', async () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const feeError = screen.queryByTestId("dangerCreateBrktFee");
        expect(feeError).toHaveTextContent('test fee error');
      })
      it('render start error', async () => { 
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const startError = screen.queryByTestId("dangerCreateBrktStart");
        expect(startError).toHaveTextContent('test start error');
      })
    })

    describe('add a bracket', () => { 
      beforeAll(() => {
        mockBrkts.push({
          ...initBrkt,
          id: "test-id",
          div_id: "div_578834e04e5e4885bbae79229d8b96e8",  
          div_name: 'Scratch',
          start: 2,
          fee: '10',
          first: '50',
          second: '20',
          admin: '10',
          fsa: '80',      
          sort_order: 5
        })
      })
      afterAll(() => {
        if (mockBrkts.length === 6) mockBrkts.pop();
      })
      it('test if added bracket has correct title', async () => {
        // ARRANGE
        const user = userEvent.setup();
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        const addBtn = screen.getByText("Add Bracket");
        // ACT
        await user.click(addBtn);
        // ASSERT
        expect(mockZeroToNBrktsProps.setBrkts).toHaveBeenCalled();

        // ACT
        const tabs = screen.getAllByRole("tab");
        // ASSERT
        expect(tabs.length).toBe(6);
        const tabTitle = getBrktOrElimName(mockBrkts[5].id, mockZeroToNBrktsProps.brkts)
        expect(tabs[5]).toHaveTextContent(tabTitle);        
      })
    })

    describe('remove a bracket', () => {
      beforeAll(() => {
        mockBrkts.push({
          ...initBrkt,
          id: "test-id",
          div_id: "div_578834e04e5e4885bbae79229d8b96e8",  
          div_name: 'Scratch',
          start: 2,
          fee: '10',
          first: '50',
          second: '20',
          admin: '10',
          fsa: '80',      
          sort_order: 5
        })
      })
      afterAll(() => {
        if (mockBrkts.length === 6) mockBrkts.pop();
      })
      it('delete bracket', async () => {
        // ARRANGE
        const user = userEvent.setup();
        render(<ZeroToNBrackets {...mockZeroToNBrktsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ARRANGE
        await user.click(tabs[5]);
        const delBtns = screen.getAllByText("Delete Bracket");
        // ASSERT
        expect(delBtns.length).toBe(5);
        // ACT
        await user.click(delBtns[4]);
        // ASSERT
        expect(mockZeroToNBrktsProps.setBrkts).toHaveBeenCalled();                    
      })      
    })
  })
})