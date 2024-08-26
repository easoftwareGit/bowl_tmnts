import React from "react";
import { render, screen, waitFor } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import RootLayout from "../../../../src/app/layout";
import TmntDataPage from "@/app/dataEntry/tmnt/page";
import { mockTmnt } from "../../../mocks/tmnts/twoDivs/mockTmnt";
import { mockDivs, mockBrkts, mockElims } from "../../../mocks/tmnts/twoDivs/mockDivs";
import {
  initBrkts,
  initDivs,
  initElims,
  initEvents,
  initLanes,
  initPots,
  initSquads,
} from "@/lib/db/initVals";
import { fullTmntDataType } from "@/lib/types/types";

describe("TmntDataPage - Eliminators Component", () => { 

  describe("click on the eliminators accordian", () => { 
    it("find and open the eliminators accordian", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      expect(acdns).toHaveLength(1);
      await user.click(acdns[0]);
    });
    it("render the create eliminators tab", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i });
      expect(createTab).toBeVisible();
    });
  })

  describe('click the eliminator division radio buttons', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims,
    };
    it('initially one division for eliminators, radio buton not checked', async () => { 
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const div1s = screen.getAllByRole("radio", {name: /division 1/i}) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, div1s[2] - elims
      expect(div1s).toHaveLength(3);
      expect(div1s[2]).not.toBeChecked();
    })
    it('render multiple division radio buttons', async () => { 
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      // scratchs[0] - pots, scratchs[2] - brkts, scratchs[2] - elims
      expect(scratchs).toHaveLength(3);
      // hdcps[0] - pots, hdcps[2] - brkts, hdcps[2] - elims
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[2]).not.toBeChecked();      
      expect(hdcps[2]).not.toBeChecked();
    })
    it("check 1st div radio radio button", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      expect(scratchs).toHaveLength(3);
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[2]).not.toBeChecked();      
      expect(hdcps[2]).not.toBeChecked();
      await user.click(scratchs[2]);
      expect(scratchs[2]).toBeChecked();      
      expect(hdcps[2]).not.toBeChecked();
    });
    it("check 2nd div radio radio button", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      expect(scratchs).toHaveLength(3);
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[2]).not.toBeChecked();      
      expect(hdcps[2]).not.toBeChecked();
      await user.click(hdcps[2]);
      expect(scratchs[2]).not.toBeChecked();      
      expect(hdcps[2]).toBeChecked();
    });
    it("cycle through radio buttons", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      expect(scratchs).toHaveLength(3);
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[2]).not.toBeChecked();      
      expect(hdcps[2]).not.toBeChecked();
      await user.click(scratchs[2]);
      expect(scratchs[2]).toBeChecked();      
      expect(hdcps[2]).not.toBeChecked();
      await user.click(hdcps[2]);
      expect(scratchs[2]).not.toBeChecked();      
      expect(hdcps[2]).toBeChecked();
      await user.click(scratchs[2]);
      expect(scratchs[2]).toBeChecked();      
      expect(hdcps[2]).not.toBeChecked();
    });
  })

  describe('render eliminator divison error', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };

    it('create eliminator without a division', async () => { 
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, div1s[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.clear(fees[3]);
      await user.type(fees[3], "20[Tab]");
      expect(fees[3]).toHaveValue("$20.00");

      await user.click(addBtn);
      
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const elimDivErr = await screen.findByTestId('dangerElimDivRadio');    
      expect(elimDivErr).toHaveTextContent("Division is required");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Division is required");
      expect(createTab).toHaveClass('objError')
    })
    it('clear no division error', async () => { 
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, div1s[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.clear(fees[3]);
      await user.type(fees[3], "20");
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const elimDivErr = await screen.findByTestId('dangerElimDivRadio');    
      expect(elimDivErr).toHaveTextContent("Division is required");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Division is required");
      expect(createTab).toHaveClass('objError')
      await user.click(div1s[2]);
      expect(elimDivErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Eliminators: Error in Create Eliminator - Division is required");
      expect(createTab).not.toHaveClass('objError')
    })
  })

  describe('render eliminator fee error', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims,
    };

    afterAll(() => {
      mockFullTmnt.elims[0].fee = ''
    })

    it('create eliminator with fee less than min fee', async () => {
      mockFullTmnt.elims[0].fee = '0'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, div1s[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      expect(fees[3]).toHaveTextContent("");
      await user.click(div1s[2]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const elimFeeErr = await screen.findByTestId('dangerCreateElimFee');    
      expect(elimFeeErr).toHaveTextContent("Fee cannot be less than");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Fee cannot be less than");
      expect(createTab).toHaveClass('objError')      
    })
    it('create eliminator with fee more than max fee', async () => {      
      mockFullTmnt.elims[0].fee = '1234567'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    
      
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, div1s[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.click(div1s[2]);
      expect(fees[3]).toHaveValue("$1,234,567.00");

      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const elimFeeErr = await screen.findByTestId('dangerCreateElimFee');    
      expect(elimFeeErr).toHaveTextContent("Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent(": Error in Create Eliminator - Fee cannot be more than");
      expect(createTab).toHaveClass('objError')      
    })
    it('clear eliminator fee error', async () => {      
      mockFullTmnt.elims[0].fee = '1234567'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    
      
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, div1s[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.click(div1s[2]);
      expect(fees[3]).toHaveValue("$1,234,567.00");

      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const elimFeeErr = await screen.findByTestId('dangerCreateElimFee');    
      expect(elimFeeErr).toHaveTextContent("Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent(": Error in Create Eliminator - Fee cannot be more than");
      expect(createTab).toHaveClass('objError')      
      await user.click(fees[3]);
      // clear or type clears the error
      await user.clear(fees[3]);
      await user.type(fees[3], "5");
      expect(elimFeeErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent(": Error in Create eliminator - Fee cannot be more than");
      expect(createTab).not.toHaveClass('objError')      
    })
  })

  describe('render the eliminator start error', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims,
    };

    afterAll(() => {
      mockFullTmnt.elims[0].fee = '5'
      mockFullTmnt.elims[0].start = 1
    })

    it('create eliminator with start less than min start', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const divs = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(divs).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads, start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.click(start[2]);
      await user.clear(start[2]);
      await user.type(start[2], '0');

      await user.click(fees[3]);
      await user.clear(fees[3]);
      await user.type(fees[3], '5');

      await user.click(divs[2]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const brktStartErr = await screen.findByTestId('dangerCreateElimStart');
      expect(brktStartErr).toHaveTextContent("Start cannot be less than");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Start cannot be less than");
      expect(createTab).toHaveClass('objError')
    })
    it('create eliminator with start setting eleinator to end past last game', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const divs = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(divs).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.click(start[2]);
      await user.clear(start[2]);
      await user.type(start[2], '5');

      await user.click(fees[3]);
      await user.clear(fees[3]);
      await user.type(fees[3], '5');

      await user.click(divs[2]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const brktStartErr = await screen.findByTestId('dangerCreateElimStart');
      expect(brktStartErr).toHaveTextContent("Eliminator ends after last game");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Eliminator ends after last game");
      expect(createTab).toHaveClass('objError')
    })
    it('clear eliminator start error', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    

      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const divs = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(divs).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.click(start[2]);
      await user.clear(start[2]);
      await user.type(start[2], '5');

      await user.click(fees[3]);
      await user.clear(fees[3]);
      await user.type(fees[3], '5');

      await user.click(divs[2]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const brktStartErr = await screen.findByTestId('dangerCreateElimStart');
      expect(brktStartErr).toHaveTextContent("Eliminator ends after last game");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Eliminator ends after last game");
      expect(createTab).toHaveClass('objError')

      await user.click(start[2]);
      // clear or type will clear the error
      await user.clear(start[2]);
      await user.type(start[2], '4');
      expect(brktStartErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent(": Error in Create Eliminator - Start cannot be more than");
      expect(createTab).not.toHaveClass('objError')
    })
  })

  describe('render the eliminator games error', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims,
    };

    afterAll(() => {
      mockFullTmnt.elims[0].fee = '5'
      mockFullTmnt.elims[0].start = 1
      mockFullTmnt.elims[0].games = 3
    })

    it('create eliminator with games less than min games', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      const games = screen.getByTestId('createElimGames') as HTMLInputElement;
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.click(games)
      await user.clear(games)
      await user.type(games, '0');

      await user.click(fees[3]);
      await user.clear(fees[3]);
      await user.type(fees[3], '5');

      await user.click(div1s[2]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const brktGamesErr = await screen.findByTestId('dangerCreateElimGames');
      expect(brktGamesErr).toHaveTextContent("Games cannot be less than");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Games cannot be less than");
      expect(createTab).toHaveClass('objError')
    })
    it('create eliminator with games more than max games', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      const games = screen.getByTestId('createElimGames') as HTMLInputElement;
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.click(games)
      await user.clear(games)
      await user.type(games, '100');

      await user.click(fees[3]);
      await user.clear(fees[3]);
      await user.type(fees[3], '5');

      await user.click(div1s[2]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const brktGamesErr = await screen.findByTestId('dangerCreateElimGames');
      expect(brktGamesErr).toHaveTextContent("Games cannot be more than");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Games cannot be more than");
      expect(createTab).toHaveClass('objError')
    })
    it('create eliminator with games setting eleinator to end past last game', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      const games = screen.getByTestId('createElimGames') as HTMLInputElement;
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.click(games)
      await user.clear(games)
      await user.type(games, '10');

      await user.click(fees[3]);
      await user.clear(fees[3]);
      await user.type(fees[3], '5');

      await user.click(div1s[2]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const brktStartErr = await screen.findByTestId('dangerCreateElimStart');
      expect(brktStartErr).toHaveTextContent("Eliminator ends after last game");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Eliminator ends after last game");
      expect(createTab).toHaveClass('objError')
    })
    it('clear eliminator games error', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      const games = screen.getByTestId('createElimGames') as HTMLInputElement;
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads,start[1] - brkts, start[2] - elims
      expect(start).toHaveLength(3);
      await user.click(games)
      await user.clear(games)
      await user.type(games, '100');

      await user.click(fees[3]);
      await user.clear(fees[3]);
      await user.type(fees[3], '5');

      await user.click(div1s[2]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const brktGamesErr = await screen.findByTestId('dangerCreateElimGames');
      expect(brktGamesErr).toHaveTextContent("Games cannot be more than");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Games cannot be more than");
      expect(createTab).toHaveClass('objError')

      await user.click(games)
      await user.clear(games)
      await user.type(games, '3');
      expect(brktGamesErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent(": Error in Create Eliminator - Games cannot be more than");
      expect(createTab).not.toHaveClass('objError')
    })
  })

  describe('render edited eliminator fee errors', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: mockElims,
    };

    afterAll(() => {
      mockFullTmnt.elims[1].fee = '5'
    })

    it('edited eliminator fee less than min error', async () => {
      mockFullTmnt.elims[1].fee = '0'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    
      
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole("button", { name: /eliminator/i });
      await user.click(acdns[0]);
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3,4,5,6,7] - elims
      expect(fees).toHaveLength(8)
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;
      await user.click(scratchGame1Tab);

      await user.click(saveBtn)

      const elimFeeErr2 = await screen.findByTestId('dangerElimFee2');
      expect(elimFeeErr2).toHaveTextContent("Fee cannot be less than");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Scratch: 1-3 - Fee cannot be less than");
      expect(scratchGame1Tab).toHaveClass('objError')
    })
    it('edited eliminator more than max error', async () => {
      mockFullTmnt.elims[1].fee = '1234567'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>);
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole("button", { name: /eliminator/i });
      await user.click(acdns[0]);
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3,4,5,6,7] - elims
      expect(fees).toHaveLength(8)
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;
      await user.click(scratchGame1Tab);
      expect(fees[4]).toHaveValue('$1,234,567.00');

      await user.click(saveBtn)

      const elimFeeErr = await screen.findByTestId('dangerElimFee2');
      expect(elimFeeErr).toHaveTextContent("Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Scratch: 1-3 - Fee cannot be more than");
      expect(scratchGame1Tab).toHaveClass('objError')
    })
    it('clear eliminator fee error', async () => {
      mockFullTmnt.elims[1].fee = '1234567'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    
      
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole("button", { name: /eliminator/i });
      await user.click(acdns[0]);
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3,4,5,6,7] - elims
      expect(fees).toHaveLength(8)
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;
      await user.click(scratchGame1Tab);
      expect(fees[4]).toHaveValue('$1,234,567.00');

      await user.click(saveBtn)

      const elimFeeErr = await screen.findByTestId('dangerElimFee2');
      expect(elimFeeErr).toHaveTextContent("Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Scratch: 1-3 - Fee cannot be more than");
      expect(scratchGame1Tab).toHaveClass('objError')

      await user.click(fees[4]);
      // clear or type will clear the error
      await user.clear(fees[4]);
      await user.type(fees[4], '5');

      expect(elimFeeErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent(": Error in Scratch: 1-3 - Fee cannot be more than");
      expect(scratchGame1Tab).not.toHaveClass('objError')
    })
  })

  describe('render multiple errors', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: mockElims,
    };
    
    afterAll(() => {
      mockFullTmnt.elims[1].fee = '5'      
    })

    it('render multiple errors for different eliminators', async () => {       
      mockFullTmnt.elims[1].fee = '1234567'      

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    
      
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add eliminator/i });
      const scratches = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // scratches[0] - pots, scratches[1] - brkts, scratches[2] - elims
      expect(scratches).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3,4,5,6,7] - elims
      expect(fees).toHaveLength(8)
      // start[0] - squads, start[1] - brkts, start[2,3,4,5,6] - elims
      expect(start).toHaveLength(7);

      await user.clear(fees[3]);
      await user.type(fees[3], "10[Tab]");
      expect(fees[3]).toHaveValue("$10.00");

      await user.click(addBtn);
      await user.click(saveBtn);

      const createTab = await screen.findByRole("tab", { name: /create eliminator/i }) as HTMLInputElement;
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;

      const elimDivErr = await screen.findByTestId('dangerElimDivRadio');    
      expect(elimDivErr).toHaveTextContent("Division is required");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Create Eliminator - Division is required");
      expect(createTab).toHaveClass('objError')
      expect(scratchGame1Tab).toHaveClass('objError')
    
      await user.click(scratches[2]);
      expect(elimDivErr).toHaveTextContent("");
      expect(acdns[0]).toHaveTextContent("Eliminators: Error in Scratch: 1-3 - Fee cannot be more than");
      expect(createTab).not.toHaveClass('objError')
      expect(scratchGame1Tab).toHaveClass('objError')
    })
  })

  describe('delete eliminator', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: mockElims,
    };
    
    it('delete eliminator confirmation', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const loadingMessage = screen.getByText(/loading/i);        
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());    
      
      const acdns = await screen.findAllByRole("button", { name: /eliminators/i });
      await user.click(acdns[0]);
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;
      await user.click(scratchGame1Tab);
      const delBtns = screen.getAllByRole('button', { name: /delete eliminator/i }) as HTMLElement[];
      expect(delBtns).toHaveLength(4);
      await user.click(delBtns[0]);
      const okBtn = await screen.findByRole('button', { name: /ok/i });
      expect(okBtn).toBeInTheDocument();
      const cancelBtn = screen.queryByRole('button', { name: /cancel/i });
      expect(cancelBtn).toBeInTheDocument();
      const confirmDelete = screen.getByText('Confirm Delete')
      expect(confirmDelete).toBeInTheDocument();
    })
  })

})