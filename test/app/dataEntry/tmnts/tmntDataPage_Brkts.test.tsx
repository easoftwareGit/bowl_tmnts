import React from "react";
import { render, screen } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import RootLayout from "../../../../src/app/layout";
import TmntDataPage from "@/app/dataEntry/tmnt/page";
import { mockTmnt } from "../../../mocks/tmnts/twoDivs/mockTmnt";
import { mockDivs, mockBrkts } from "../../../mocks/tmnts/twoDivs/mockDivs";
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

describe("TmntDataPage - Brackets Component", () => { 

  describe("click on the brackets accordian", () => {
    it("find and open the brackets accordian", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      expect(acdns).toHaveLength(1);
      await user.click(acdns[0]);
    });
    it("render the create brackets tab", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const createTab = await screen.findByRole("tab", { name: /create bracket/i });
      expect(createTab).toBeVisible();
    });
  });  

  describe('click the bracket division radio buttons', () => { 
    const mockFullTmnt: dataOneTmntType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims,
    };

    it('initially one division for brackets, radio buton not checked', async () => { 
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const div1s = screen.getAllByRole("radio", {name: /division 1/i}) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);
      expect(div1s[1]).not.toBeChecked();
    })
    it('render multiple division radio buttons', async () => { 
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      // scratchs[0] - pots, scratchs[1] - brkts, scratchs[2] - elims
      expect(scratchs).toHaveLength(3);
      // hdcps[0] - pots, hdcps[1] - brkts, hdcps[2] - elims
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[1]).not.toBeChecked();      
      expect(hdcps[1]).not.toBeChecked();
    })
    it("check 1st div radio radio button", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      expect(scratchs).toHaveLength(3);
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[1]).not.toBeChecked();      
      expect(hdcps[1]).not.toBeChecked();
      await user.click(scratchs[1]);
      expect(scratchs[1]).toBeChecked();      
      expect(hdcps[1]).not.toBeChecked();
    });
    it("check 2nd div radio radio button", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      expect(scratchs).toHaveLength(3);
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[1]).not.toBeChecked();      
      expect(hdcps[1]).not.toBeChecked();
      await user.click(hdcps[1]);
      expect(scratchs[1]).not.toBeChecked();      
      expect(hdcps[1]).toBeChecked();
    });
    it("cycle through radio buttons", async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const scratchs = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];      
      const hdcps = screen.getAllByRole("radio", {name: /hdcp/i }) as HTMLInputElement[];
      expect(scratchs).toHaveLength(3);
      expect(hdcps).toHaveLength(3);      
      expect(scratchs[1]).not.toBeChecked();      
      expect(hdcps[1]).not.toBeChecked();
      await user.click(scratchs[1]);
      expect(scratchs[1]).toBeChecked();      
      expect(hdcps[1]).not.toBeChecked();
      await user.click(hdcps[1]);
      expect(scratchs[1]).not.toBeChecked();      
      expect(hdcps[1]).toBeChecked();
      await user.click(scratchs[1]);
      expect(scratchs[1]).toBeChecked();      
      expect(hdcps[1]).not.toBeChecked();
    });
  })

  describe('render bracket divison error', () => { 

    const mockFullTmnt: dataOneTmntType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };

    it('create bracket without a division', async () => { 
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add bracket/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - brkts, start[1] - elims
      expect(start).toHaveLength(3);
      await user.clear(fees[2]);
      await user.type(fees[2], "20[Tab]");
      expect(fees[2]).toHaveValue("$20.00");

      await user.click(addBtn);
      
      const createTab = await screen.findByRole("tab", { name: /create bracket/i }) as HTMLInputElement;
      const brktDivErr = await screen.findByTestId('dangerBrktDivRadio');    
      expect(brktDivErr).toHaveTextContent("Division is required");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Create Bracket - Division is required");
      expect(createTab).toHaveClass('objError')
    })
    it('clear no division error', async () => { 
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add bracket/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - brkts, start[1] - elims
      expect(start).toHaveLength(3);
      await user.clear(fees[2]);
      await user.type(fees[2], "20");
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create bracket/i }) as HTMLInputElement;
      const brktDivErr = await screen.findByTestId('dangerBrktDivRadio');    
      expect(brktDivErr).toHaveTextContent("Division is required");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Create Bracket - Division is required");
      expect(createTab).toHaveClass('objError')
      await user.click(div1s[1]);
      expect(brktDivErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Brackets: Error in Create Bracket - Division is required");
      expect(createTab).not.toHaveClass('objError')
    })
  })

  describe('render bracket fee error', () => { 
    const mockFullTmnt: dataOneTmntType = {
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
      mockFullTmnt.brkts[0].fee = ''
    })

    it('create bracket with fee less than min fee', async () => {
      mockFullTmnt.brkts[0].fee = '0'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add bracket/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - brkts, start[1] - elims
      expect(start).toHaveLength(3);
      expect(fees[2]).toHaveTextContent("");
      await user.click(div1s[1]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create bracket/i }) as HTMLInputElement;
      const brktFeeErr = await screen.findByTestId('dangerCreateBrktFee');    
      expect(brktFeeErr).toHaveTextContent("Fee cannot be less than");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Create Bracket - Fee cannot be less than");
      expect(createTab).toHaveClass('objError')      
    })
    it('create bracket with fee more than max fee', async () => {      
      mockFullTmnt.brkts[0].fee = '1234567'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add bracket/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - brkts, start[1] - elims
      expect(start).toHaveLength(3);
      await user.click(div1s[1]);
      expect(fees[2]).toHaveValue("$1,234,567.00");

      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create bracket/i }) as HTMLInputElement;
      const brktFeeErr = await screen.findByTestId('dangerCreateBrktFee');    
      expect(brktFeeErr).toHaveTextContent("Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent(": Error in Create Bracket - Fee cannot be more than");
      expect(createTab).toHaveClass('objError')      
    })
    it('clear bracket fee error', async () => {      
      mockFullTmnt.brkts[0].fee = '1234567'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add bracket/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];      
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);      
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - brkts, start[1] - elims
      expect(start).toHaveLength(3);
      await user.click(div1s[1]);
      expect(fees[2]).toHaveValue("$1,234,567.00");

      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create bracket/i }) as HTMLInputElement;
      const brktFeeErr = await screen.findByTestId('dangerCreateBrktFee');    
      expect(brktFeeErr).toHaveTextContent("Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent(": Error in Create Bracket - Fee cannot be more than");
      expect(createTab).toHaveClass('objError')      
      await user.click(fees[2]);
      // clear or type clears the error
      await user.clear(fees[2]);
      await user.type(fees[2], "5");
      expect(brktFeeErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent(": Error in Create Bracket - Fee cannot be more than");
      expect(createTab).not.toHaveClass('objError')      
    })
  })
  
  describe('render the bracket start error', () => { 
    const mockFullTmnt: dataOneTmntType = {
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
      mockFullTmnt.brkts[0].fee = '5'
      mockFullTmnt.brkts[0].start = 1
    })

    it('create bracket with start less than min start', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add bracket/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads, start[1] - brkts, start[1] - elims
      expect(start).toHaveLength(3);
      await user.click(start[1]);
      await user.clear(start[1]);
      await user.type(start[1], '0');

      await user.click(fees[2]);
      await user.clear(fees[2]);
      await user.type(fees[2], '5');

      await user.click(div1s[1]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create bracket/i }) as HTMLInputElement;
      const brktStartErr = await screen.findByTestId('dangerCreateBrktStart');
      expect(brktStartErr).toHaveTextContent("Start cannot be less than");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Create Bracket - Start cannot be less than");
      expect(createTab).toHaveClass('objError')
    })
    it('create bracket with start more than max start', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add bracket/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - squads, start[1] - brkts, start[1] - elims
      expect(start).toHaveLength(3);
      await user.click(start[1]);
      await user.clear(start[1]);
      await user.type(start[1], '5');

      await user.click(fees[2]);
      await user.clear(fees[2]);
      await user.type(fees[2], '5');

      await user.click(div1s[1]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create bracket/i }) as HTMLInputElement;
      const brktStartErr = await screen.findByTestId('dangerCreateBrktStart');
      expect(brktStartErr).toHaveTextContent("Start cannot be more than");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Create Bracket - Start cannot be more than");
      expect(createTab).toHaveClass('objError')
    })
    it('clear bracket start error', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add bracket/i });
      const div1s = screen.getAllByRole("radio", { name: /division 1/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // divs1[0] - pots, divs1[1] - brkts, divs1[2] - elims
      expect(div1s).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2] - brkts, fees[3] - elims
      expect(fees).toHaveLength(4)
      // start[0] - lanes, start[1] - brkts, start[1] - elims
      expect(start).toHaveLength(3);
      await user.click(start[1]);
      await user.clear(start[1]);
      await user.type(start[1], '5');

      await user.click(fees[2]);
      await user.clear(fees[2]);
      await user.type(fees[2], '5');

      await user.click(div1s[1]);
      await user.click(addBtn);
      const createTab = await screen.findByRole("tab", { name: /create bracket/i }) as HTMLInputElement;
      const brktStartErr = await screen.findByTestId('dangerCreateBrktStart');
      expect(brktStartErr).toHaveTextContent("Start cannot be more than");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Create Bracket - Start cannot be more than");
      expect(createTab).toHaveClass('objError')

      await user.click(start[1]);
      // clear or type will clear the error
      await user.clear(start[1]);
      await user.type(start[1], '4');
      expect(brktStartErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent(": Error in Create Bracket - Start cannot be more than");
      expect(createTab).not.toHaveClass('objError')
    })
  })

  describe('render edited bracket fee errors', () => {
    const mockFullTmnt: dataOneTmntType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: mockBrkts,
      elims: initElims,
    };

    afterAll(() => {
      mockFullTmnt.brkts[1].fee = '5'
    })

    it('edited bracket fee less than min error', async () => {
      mockFullTmnt.brkts[1].fee = '0'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>);
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // fees[0] - events, fees[1] - pots, fees[2,3,4,5,6] - brkts, fees[7] - elims
      expect(fees).toHaveLength(8)
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;
      await user.click(scratchGame1Tab);

      await user.click(saveBtn)

      const brktFeeErr2 = await screen.findByTestId('dangerBrktFee2');
      expect(brktFeeErr2).toHaveTextContent("Fee cannot be less than");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Scratch: 1-3 - Fee cannot be less than");
      expect(scratchGame1Tab).toHaveClass('objError')
    })
    it('edited bracket more than max error', async () => {
      mockFullTmnt.brkts[1].fee = '1234567'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>);
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // fees[0] - events, fees[1] - pots, fees[2,3,4,5,6] - brkts, fees[7] - elims
      expect(fees).toHaveLength(8)
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;
      await user.click(scratchGame1Tab);
      expect(fees[3]).toHaveValue('$1,234,567.00');

      await user.click(saveBtn)

      const brktFeeErr = await screen.findByTestId('dangerBrktFee2');
      expect(brktFeeErr).toHaveTextContent("Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Scratch: 1-3 - Fee cannot be more than");
      expect(scratchGame1Tab).toHaveClass('objError')
    })
    it('clear bracket fee error', async () => {
      mockFullTmnt.brkts[1].fee = '1234567'

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>);
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      // fees[0] - events, fees[1] - pots, fees[2,3,4,5,6] - brkts, fees[7] - elims
      expect(fees).toHaveLength(8)
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;
      await user.click(scratchGame1Tab);
      expect(fees[3]).toHaveValue('$1,234,567.00');

      await user.click(saveBtn)

      const brktFeeErr = await screen.findByTestId('dangerBrktFee2');
      expect(brktFeeErr).toHaveTextContent("Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Scratch: 1-3 - Fee cannot be more than");
      expect(scratchGame1Tab).toHaveClass('objError')

      await user.click(fees[3]);
      // clear or type will clear the error
      await user.clear(fees[3]);
      await user.type(fees[3], '5');

      expect(brktFeeErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent(": Error in Scratch: 1-3 - Fee cannot be more than");
      expect(scratchGame1Tab).not.toHaveClass('objError')
    })
  })

  describe('render multiple errors', () => { 
    const mockFullTmnt: dataOneTmntType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: mockBrkts,
      elims: initElims,
    };
    
    afterAll(() => {
      mockFullTmnt.brkts[1].fee = '5'      
    })

    it('render multiple errors for different brackets', async () => {       
      mockFullTmnt.brkts[1].fee = '1234567'      

      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>);
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const addBtn = await screen.findByRole("button", { name: /add bracket/i });
      const scratches = screen.getAllByRole("radio", { name: /scratch/i }) as HTMLInputElement[];
      const fees = screen.getAllByRole('textbox', { name: /fee/i }) as HTMLInputElement[];
      const start = screen.getAllByRole("spinbutton", { name: /start/i }) as HTMLInputElement[];
      // scratches[0] - pots, scratches[1] - brkts, scratches[2] - elims
      expect(scratches).toHaveLength(3);
      // fees[0] - events, fees[1] - pots, fees[2,3,4,5,6] - brkts, fees[7] - elims
      expect(fees).toHaveLength(8)
      // start[0] - squad start[1,2,3,4,5] - brkts, start[6] - elims
      expect(start).toHaveLength(7);

      await user.clear(fees[2]);
      await user.type(fees[2], "20[Tab]");
      expect(fees[2]).toHaveValue("$20.00");

      await user.click(addBtn);
      await user.click(saveBtn);

      const createTab = await screen.findByRole("tab", { name: /create bracket/i }) as HTMLInputElement;
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;

      const brktDivErr = await screen.findByTestId('dangerBrktDivRadio');    
      expect(brktDivErr).toHaveTextContent("Division is required");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Create Bracket - Division is required");
      expect(createTab).toHaveClass('objError')
      expect(scratchGame1Tab).toHaveClass('objError')
    
      await user.click(scratches[1]);
      expect(brktDivErr).toHaveTextContent("");
      expect(acdns[0]).toHaveTextContent("Brackets: Error in Scratch: 1-3 - Fee cannot be more than");
      expect(createTab).not.toHaveClass('objError')
      expect(scratchGame1Tab).toHaveClass('objError')
    })
  })

  describe('delete bracket', () => {
    const mockFullTmnt: dataOneTmntType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: mockDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: mockBrkts,
      elims: initElims,
    };
    
    it('delete bracket confirmation', async () => {
      const user = userEvent.setup();
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>);
      const acdns = await screen.findAllByRole("button", { name: /brackets/i });
      await user.click(acdns[0]);
      const scratchGame1Tab = screen.getByRole("tab", { name: /scratch: 1-3/i }) as HTMLInputElement;
      await user.click(scratchGame1Tab);
      const delBtns = screen.getAllByRole('button', { name: /delete bracket/i }) as HTMLElement[];
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