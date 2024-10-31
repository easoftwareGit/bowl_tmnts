import React from "react";
import { render, screen, waitFor } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import RootLayout from "../../../../src/app/layout";
import TmntDataPage from "@/app/dataEntry/tmnt/page";
import { mockTmnt } from "../../../mocks/tmnts/twoDivs/mockTmnt";
import { mockDivs, mockPots } from "../../../mocks/tmnts/twoDivs/mockDivs";
import { mockEvent } from "../../../mocks/tmnts/twoDivs/mockEvent";
import {
  initBrkts,
  initDivs,
  initElims,
  initEvents,
  initLanes,
  initPots,
  initSquads,
} from "@/lib/db/initVals";
import { dataOneTmntType } from "@/lib/types/types";

describe("TmntDataPage - Pots Component", () => {

  describe("click on the pots accordian", () => {
    it("find and open the pots accordian", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      expect(acdns).toHaveLength(1);
      await user.click(acdns[0]);
    });
    it("render the pots tab", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const createTab = await screen.findByRole("tab", { name: /create pot/i });
      expect(createTab).toBeVisible();
    });
  });

  describe("click the pot type radio buttons", () => {
    it("render the pot type radio buttons, should all be unchecked", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      // games[0]: div hdcp for, games[1]: Pot Game
      expect(games).toHaveLength(2);
      expect(games[1]).not.toBeChecked();
      expect(lastGame).not.toBeChecked();
      // series[0]: Div Hdcp for, series[1]: Pot Series
      expect(series).toHaveLength(2);
      expect(series[1]).not.toBeChecked();
    });
    it("check the Game pot type radio button", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      await user.click(games[1]);
      expect(games[1]).toBeChecked();
      expect(lastGame).not.toBeChecked();
      expect(series[1]).not.toBeChecked();
    });
    it("check the Last Game pot type radio button", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      await user.click(lastGame);
      expect(games[1]).not.toBeChecked();
      expect(lastGame).toBeChecked();
      expect(series[1]).not.toBeChecked();
    });
    it("check the Series pot type radio button", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      await user.click(series[1]);
      expect(games[1]).not.toBeChecked();
      expect(lastGame).not.toBeChecked();
      expect(series[1]).toBeChecked();
    });
    it("cyles throw all pot game radio buttons", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i }) as HTMLInputElement;      
      const series = screen.getAllByRole("radio", { name: /series/i }) as HTMLInputElement[];      
      await user.click(games[1]);
      expect(games[1]).toBeChecked();
      expect(lastGame).not.toBeChecked();
      expect(series[1]).not.toBeChecked();
      await user.click(lastGame);
      expect(games[1]).not.toBeChecked();
      expect(lastGame).toBeChecked();
      expect(series[1]).not.toBeChecked();
      await user.click(series[1]);
      expect(games[1]).not.toBeChecked();
      expect(lastGame).not.toBeChecked();
      expect(series[1]).toBeChecked();
    });
  });

  describe("click on the division radios", () => {
    const mockFullTmnt: dataOneTmntType = {
      tmnt: mockTmnt,
      events: mockEvent,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims,
    };

    it("initally one division for pots, radio button not checked", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const div1s = screen.getAllByRole("radio", {name: /division 1/i}) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs[2] - elims
      expect(div1s).toHaveLength(3);
      expect(div1s[0]).not.toBeChecked();
    });
    it("render multiple division radio buttons", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      // scratchs[0] - pots, scratchs[1] - brkts, scratchs[2] - elims
      expect(scratchs).toHaveLength(3);
      // hdcps[0] - pots, hdcps[1] - brkts, hdcps[2] - elims
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[0]).not.toBeChecked();      
      expect(hdcps[0]).not.toBeChecked();
    });
    it("check 1st div radio radio button", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      expect(scratchs).toHaveLength(3);
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[0]).not.toBeChecked();      
      expect(hdcps[0]).not.toBeChecked();
      await user.click(scratchs[0]);
      expect(scratchs[0]).toBeChecked();      
      expect(hdcps[0]).not.toBeChecked();
    });
    it("check 2nd div radio radio button", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      expect(scratchs).toHaveLength(3);
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[0]).not.toBeChecked();      
      expect(hdcps[0]).not.toBeChecked();
      await user.click(hdcps[0]);
      expect(scratchs[0]).not.toBeChecked();      
      expect(hdcps[0]).toBeChecked();
    });
    it("cycle through radio buttons", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      expect(scratchs).toHaveLength(3);
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[0]).not.toBeChecked();      
      expect(hdcps[0]).not.toBeChecked();
      await user.click(scratchs[0]);
      expect(scratchs[0]).toBeChecked();      
      expect(hdcps[0]).not.toBeChecked();
      await user.click(hdcps[0]);
      expect(scratchs[0]).not.toBeChecked();      
      expect(hdcps[0]).toBeChecked();
      await user.click(scratchs[0]);
      expect(scratchs[0]).toBeChecked();      
      expect(hdcps[0]).not.toBeChecked();
    });
  });

  describe('render pot type error', () => { 
    it("create a pot without a pot type, render error", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add pot/i });
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // games[0]: div hdcp for, games[1]: Pot Game
      expect(games).toHaveLength(2);
      // divs1[0] - pots, divs1[1] - brkts, divs[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4);
      await user.click(div1s[0]);
      await user.clear(fees[0]);
      await user.type(fees[0], "20");
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create pot/i }) as HTMLInputElement;
      const potTypeError = await screen.findByTestId('dangerPotType');    
      expect(potTypeError).toHaveTextContent("Pot Type is required");
      expect(acdns[0]).toHaveTextContent("Pots: Error in Create Pot - Pot Type is required");
      expect(createTab).toHaveClass('objError')
    });
    it("clear pot type error", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add pot/i });
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // games[0]: div hdcp for, games[1]: Pot Game
      expect(games).toHaveLength(2);
      // divs1[0] - pots, divs1[1] - brkts, divs[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4);
      await user.click(div1s[0]);
      await user.clear(fees[0]);
      await user.type(fees[0], "20");
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create pot/i }) as HTMLInputElement;
      const potTypeError = await screen.findByTestId('dangerPotType');    
      expect(potTypeError).toHaveTextContent("Pot Type is required");
      expect(acdns[0]).toHaveTextContent("Pots: Error in Create Pot - Pot Type is required");
      expect(createTab).toHaveClass('objError')
      await user.click(games[1]);
      expect(potTypeError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Error in Create Pot - Pot Type is required");
      expect(createTab).not.toHaveClass('objError')
    });
  })

  describe('render the pot division error', () => { 
    it("create a pot without a division, render error", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add pot/i });
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // games[0]: div hdcp for, games[1]: Pot Game
      expect(games).toHaveLength(2);
      // divs1[0] - pots, divs1[1] - brkts, divs[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      await user.click(games[1]);
      await user.clear(fees[1]);
      await user.type(fees[1], "20");
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create pot/i }) as HTMLInputElement;
      const divError = await screen.findByTestId('dangerDiv');    
      expect(divError).toHaveTextContent("Division is required");
      expect(acdns[0]).toHaveTextContent("Pots: Error in Create Pot - Division is required");
      expect(createTab).toHaveClass('objError')
    });
    it("clear pot division error", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add pot/i });
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // games[0]: div hdcp for, games[1]: Pot Game
      expect(games).toHaveLength(2);
      // divs1[0] - pots, divs1[1] - brkts, divs[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      await user.click(games[1]);
      await user.clear(fees[1]);
      await user.type(fees[1], "20");
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create pot/i }) as HTMLInputElement;
      const divError = await screen.findByTestId('dangerDiv');    
      expect(divError).toHaveTextContent("Division is required");
      expect(acdns[0]).toHaveTextContent("Pots: Error in Create Pot - Division is required");
      expect(createTab).toHaveClass('objError')
      await user.click(div1s[0]);
      expect(divError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Error in Create Pot - Division is required");
      expect(createTab).not.toHaveClass('objError')
    });
  })

  describe('render the pot fee errors', () => { 
    it("create a pot without a fee less than min", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add pot/i });
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // games[0]: div hdcp for, games[1]: Pot Game
      expect(games).toHaveLength(2);
      // divs1[0] - pots, divs1[1] - brkts, divs[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      await user.click(games[1]);
      await user.click(div1s[0]);      
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create pot/i }) as HTMLInputElement;
      const feeError = await screen.findByTestId('dangerPotFee');    
      expect(feeError).toHaveTextContent("Fee cannot be less than");
      expect(acdns[0]).toHaveTextContent("Fee cannot be less than");
      expect(createTab).toHaveClass('objError')
    });
    it("create a pot without a fee more than max", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add pot/i });
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      await user.click(games[1]);
      await user.click(div1s[0]);   
      await user.type(fees[1], "1234567");
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create pot/i }) as HTMLInputElement;
      const feeError = await screen.findByTestId('dangerPotFee');    
      expect(feeError).toHaveTextContent("Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent("Fee cannot be more than");
      expect(createTab).toHaveClass('objError')
    });
    it("clear pot fee error", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add pot/i });
      const games = screen.getAllByLabelText('Game') as HTMLInputElement[];      
      const lastGame = screen.getByRole("radio", { name: /last game/i, }) as HTMLInputElement;    
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // games[0]: div hdcp for, games[1]: Pot Game
      expect(games).toHaveLength(2);
      // divs1[0] - pots, divs1[1] - brkts, divs[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      await user.click(games[1]);
      await user.click(div1s[0]);      
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create pot/i }) as HTMLInputElement;
      const feeError = await screen.findByTestId('dangerPotFee');    
      expect(feeError).toHaveTextContent("Fee cannot be less than");
      expect(acdns[0]).toHaveTextContent("Fee cannot be less than");
      expect(createTab).toHaveClass('objError')
      await user.click(fees[1]);
      // clear/type will clear the error
      await user.clear(fees[1]);
      await user.type(fees[1], "20");
      expect(feeError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Fee cannot be less than");
      expect(createTab).not.toHaveClass('objError')
    });
  })

  describe('render multiple errors', () => { 
    const mockFullTmnt: dataOneTmntType = {
      tmnt: mockTmnt,
      events: mockEvent,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: mockPots,
      brkts: initBrkts,
      elims: initElims,
    };

    beforeAll(() => {
      mockFullTmnt.pots[1].fee = '0';
      mockFullTmnt.pots[3].fee = '1234567';
    })

    afterAll(() => {
      mockFullTmnt.pots[1].fee = '20';
      mockFullTmnt.pots[3].fee = '20';      
    })

    it('render multiple errors', async () => { 
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // fees[0] - events, fees[1,2,3,4,5] - pots, fees[6] - brkts, fees[7] - elims
      expect(fees).toHaveLength(8);      
      expect(fees[2]).toHaveValue('$0.00');
      // expect(fees[4]).toHaveValue('$1,234,567.00');
      const gameScratchTab = await screen.findByRole("tab", { name: "Game - Scratch" }) as HTMLInputElement;      
      const gameHdcpTab = await screen.findByRole("tab", { name: "Game - Hdcp" }) as HTMLInputElement;
      await user.click(saveBtn)

      const feeErrors = screen.getAllByTestId(/dangerPotFee/i);
      // feeErrors[0] - create pot, feeErrors[1] - gameScratch, feeErros[2] - lastScratch, feeErrors[3] - gameHdcp, feeErrors[4] - lastHdcp      
      expect(feeErrors).toHaveLength(5);      
      expect(feeErrors[1]).toHaveTextContent("Fee cannot be less than");
      expect(acdns[0]).toHaveTextContent("Fee cannot be less than");
      expect(gameScratchTab).toHaveClass('objError')

      const createTab = await screen.findByRole("tab", { name: "Create Pot" }) as HTMLInputElement;
      await user.click(createTab)      
      const scratchRadios = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];
      // scratchRadios[0] - pots, scratchRadios[1] - brkts, scratchRadios[2] - elims
      expect(scratchRadios).toHaveLength(3);
      await user.click(scratchRadios[0]);
      await user.click(fees[1]);
      await user.clear(fees[1]);
      await user.type(fees[1], "20");
      const addBtn = await screen.findByRole('button', { name: /add pot/i });
      await user.click(addBtn);
      const potTypeError = await screen.findByTestId('dangerPotType');    
      expect(potTypeError).toHaveTextContent("Pot Type is required");
      expect(acdns[0]).toHaveTextContent("Pot Type is required");
      expect(createTab).toHaveClass('objError')      
      const series = screen.getAllByRole("radio", { name: /series/i, }) as HTMLInputElement[];      
      // series[0,1] - divs, series[2] - pots
      expect(series).toHaveLength(3);
      await user.click(series[2]);
      expect(potTypeError).toHaveTextContent("");
      expect(acdns[0]).toHaveTextContent("Fee cannot be less than");
      expect(createTab).not.toHaveClass('objError')      
    })
  })
  
  describe('render and click the delete button', () => { 
    const mockFullTmnt: dataOneTmntType = {
      tmnt: mockTmnt,
      events: mockEvent,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: mockPots,
      brkts: initBrkts,
      elims: initElims,
    };

    it('render the and click the delete button', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole("button", { name: /pots/i });
      await user.click(acdns[0]);
      const gameScratchTab = await screen.findByRole("tab", { name: "Game - Scratch" }) as HTMLInputElement;      
      await user.click(gameScratchTab)
      const deleteBtns = await screen.findAllByRole('button', { name: /delete pot/i }) as HTMLElement[];
      expect(deleteBtns).toHaveLength(4);
      await user.click(deleteBtns[0]);
      const okBtn = await screen.findByRole('button', { name: /ok/i });
      expect(okBtn).toBeInTheDocument();              
    })
  })

});
