import React from "react";
import { render, screen, waitFor } from '../../../test-utils'
import userEvent from "@testing-library/user-event";
import RootLayout from '../../../../src/app/layout'; 
import TmntDataPage from "../../../../src/app/dataEntry/tmnt/page";
import { dateTo_UTC_MMddyyyy, startOfDayFromString, todayStr } from "@/lib/dateTools";
import { mockTmnt } from "../../../mocks/tmnts/mockTmnt";
import { initBrkts, initDivs, initElims, initEvents, initLanes, initPots, initSquads, initTmnt } from "@/lib/db/initVals";
import { fullTmntDataType } from "@/lib/types/types";

describe('TmntDataPage - Event Component', () => { 
  describe('render the tournement title', () => {       
    it('render the tournrment title', async () => {               
      render(<RootLayout><TmntDataPage /></RootLayout>);
      const title = await screen.findByText('Tournament Info');
      expect(title).toBeInTheDocument();
    })
  })

  describe('render the loading message', () => { 
    it('should render the loading message', async () => { 
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const loadingMessage = await screen.findByText(/loading/i);
      expect(loadingMessage).toBeInTheDocument();
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());
    })
  })

  describe('renders tornament info section - new tounament', () => {      
    it('render the Tounament Name', async () => { 
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const tmntName = await screen.findByRole('textbox', { name: /tournament name/i });      
      expect(tmntName).toHaveValue("");
    })        
    it('DO NOT render the Tournement Error', async () => { 
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const tmntError = await screen.findByTestId('dangerTmntName');      
      expect(tmntError).toHaveTextContent("");      
    })
    it('renders Bowl Name label', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const bowlLabel = await screen.findByText('Bowl Name');
      expect(bowlLabel).toBeInTheDocument();
    })
    it('render the Bowl Name', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const bowlName = await screen.findByRole('combobox', { name: /bowl name/i });      
      expect(bowlName).toHaveValue("Choose...");
    })
    it('DO NOT render the Bowl Error', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const bowlError = await screen.findByTestId('dangerBowlName');      
      expect(bowlError).toHaveTextContent("");
    })
    it('renders Start Date label', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const startLabel = await screen.findByText('Start Date');
      expect(startLabel).toBeInTheDocument();      
    })
    it('render the Start Date', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)      
      const startDate = await screen.findByLabelText(/start date/i);      
      expect(startDate).toHaveValue(todayStr);
    })
    it('DO NOT render the Start Error', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const startError = await screen.findByTestId('dangerStartDate');      
      expect(startError).toHaveTextContent("");
    })
    it('renders End Date label', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const endLabel = await screen.findByText('End Date');
      expect(endLabel).toBeInTheDocument();      
    })
    it('render the End Date', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)      
      const endDate = await screen.findByLabelText(/end date/i);      
      expect(endDate).toHaveValue(todayStr);
    })
    it('DO NOT render the End Error', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const endError = await screen.findByTestId('dangerEndDate');      
      expect(endError).toHaveTextContent("");
    })
    it('render the save button', async () => { 
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      expect(saveBtn).toBeInTheDocument();
    })
  })

  describe('render the tournament errors', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    beforeAll(() => {      
      mockFullTmnt.tmnt.bowl_id_err = "bowl error";
      mockFullTmnt.tmnt.tmnt_name_err = "tmnt error";
      mockFullTmnt.tmnt.start_date_err = "start date error";
      mockFullTmnt.tmnt.end_date_err = "end date error";
    })

    it('render the tournament name error', async () => {      
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const nameError = await screen.findByTestId("dangerTmntName");      
      expect(nameError).toHaveTextContent("tmnt error");
    })
    it('render the bowl name error', async () => {
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const bowlError = await screen.findByTestId("dangerBowlName");
      expect(bowlError).toHaveTextContent("bowl error");
    })
    it('render the start date error', async () => {
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const startError = await screen.findByTestId("dangerStartDate");
      expect(startError).toHaveTextContent("start date error");
    })
    it('render the end date error', async () => {
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const endError = await screen.findByTestId("dangerEndDate");
      expect(endError).toHaveTextContent("end date error");
    })
  })

  describe('render tournament name and bowl name', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('render the Tounament Name', async () => { 
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const tmntName = await screen.findByRole('textbox', { name: /tournament name/i });  
      expect(tmntName).toHaveValue("New Year's Eve 6 Gamer");
    })        
    it('render the Bowl Name', async () => {
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const bowlName = await screen.findByRole('combobox', { name: /bowl name/i }) as HTMLSelectElement;
      expect(bowlName).toHaveValue("bwl_561540bd64974da9abdd97765fdb3659");      
    })
  })

  describe('try to save invalid data', () => {     
    const mockFullTmnt: fullTmntDataType = {
      tmnt: initTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('try to save invalid data, then show errors', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const startDate = await screen.findByLabelText(/start date/i);      
      const endDate = await screen.findByLabelText(/end date/i);      
      await user.clear(startDate);
      await user.clear(endDate);
      await user.click(saveBtn);

      const tmntError = await screen.findByTestId('dangerTmntName');      
      expect(tmntError).not.toHaveTextContent("");      
      const bowlError = await screen.findByTestId('dangerBowlName');      
      expect(bowlError).not.toHaveTextContent("");
      const startError = await screen.findByTestId('dangerStartDate');      
      expect(startError).toHaveTextContent("");
      const endError = await screen.findByTestId('dangerEndDate');      
      expect(endError).toHaveTextContent("");
    })
  })

  describe('show tournament name error and then remove error', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: initTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('show tournament name error and then remove error', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const tmntName = await screen.findByRole('textbox', { name: /tournament name/i });      
      const tmntError = await screen.findByTestId('dangerTmntName');      
      expect(tmntError).not.toHaveTextContent("");   
      // editing tmnt name will cause tmnt name error to clear
      await user.clear(tmntName);
      await user.type(tmntName, 'Test Tournament');
      expect(tmntError).toHaveTextContent("");
      // click will cause invalid data errors to show, should not show tmnt name error
      await user.click(saveBtn);
      expect(tmntError).toHaveTextContent("");
    })
  })

  describe('show bowl name error and then remove error', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: initTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('show bowl name error and then remove error', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const bowlName = await screen.findByRole('combobox', { name: /bowl name/i }) as HTMLSelectElement;      
      const bowlError = await screen.findByTestId('dangerBowlName');      
      expect(bowlError).not.toHaveTextContent("");   
      // editing bowl name will cause bowl name error to clear      
      await user.selectOptions(bowlName, 'bwl_561540bd64974da9abdd97765fdb3659');
      expect(bowlError).toHaveTextContent("");
      // click will cause invalid data errors to show, should not show bowl name error
      await user.click(saveBtn);
      expect(bowlError).toHaveTextContent("");
    })
  })

  describe('show start date error and then remove error', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('show start date error and then remove error', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const startDate = await screen.findByLabelText(/start date/i);      
      await user.clear(startDate);
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const startError = await screen.findByTestId("dangerStartDate");
      expect(startDate).toHaveValue(todayStr);
      expect(startError).not.toHaveTextContent("");
      // // editing start date will cause start date error to clear  
      // expect(startError).toHaveTextContent("");
      // // click will cause invalid data errors to show, should not show start date error
      // await user.click(saveBtn);
      // expect(startError).toHaveTextContent("");
    })
  })

  describe('show end date error and then remove error', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('show end date error and then remove error', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const endDate = await screen.findByLabelText(/end date/i);      
      await user.clear(endDate);
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const endError = await screen.findByTestId("dangerEndDate");
      expect(endDate).toHaveValue(todayStr);
      expect(endError).not.toHaveTextContent("");
      // // editing end date will cause end date error to clear 
      // const todayMmddyyyy = dateTo_UTC_MMddyyyy(new Date(todayStr))
      // await user.type(endDate, todayMmddyyyy);
      // // expect(endError).toHaveTextContent("");
      // // click will cause invalid data errors to show, should not show end date error
      // await user.click(saveBtn);
      // expect(endError).toHaveTextContent("");
    })
  })

  describe('enter invalid end date before start date', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('enter invalid end date before start date', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const endDate = await screen.findByLabelText(/end date/i);      
      // get yesterday's date
      let badEndDate = new Date(todayStr);      
      badEndDate.setDate(badEndDate.getDate() - 1);
      const badDateStr = dateTo_UTC_MMddyyyy(badEndDate);
      // enter bad end date
      await user.clear(endDate);
      await user.type(endDate, badDateStr);
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const endError = await screen.findByTestId("dangerEndDate");
      const todayMmddyyyy = dateTo_UTC_MMddyyyy(new Date(todayStr))
      await user.type(endDate, todayMmddyyyy);
      expect(endError).not.toHaveTextContent("");
    })
  })

})