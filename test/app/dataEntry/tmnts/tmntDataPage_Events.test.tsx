import React from "react";
import { render, screen } from '../../../test-utils'
import userEvent from "@testing-library/user-event";
import RootLayout from '../../../../src/app/layout'; 
import TmntDataPage from "@/app/dataEntry/tmnt/page";
import { mockSDTmnt } from "../../../mocks/tmnts/singlesAndDoubles/mockSinglesDoublesTmnt";
import { mockEvents } from "../../../mocks/tmnts/singlesAndDoubles/mockEvents";
import { mockSquads } from "../../../mocks/tmnts/singlesAndDoubles/mockSquads";
import { fullTmntDataType } from "@/lib/types/types";
import { initBrkts, initDivs, initElims, initEvents, initLanes, initPots, initSquads } from "@/lib/db/initVals";

describe('TmntDataPage - Event Component', () => { 

  describe('Events - Component', () => {        
    it('wait for the bowls data to load ', async () => {
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const bowlLabel = await screen.findByText('Bowl Name');
      expect(bowlLabel).toBeInTheDocument();
    })
  })
  
  describe('click on the events accordian', () => {
    it('find and open the events accordian', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      expect(acdns).toHaveLength(1);
      await user.click(acdns[0]);
    })
    it('render the event tab', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toBeVisible();
    })
  })

  describe('editing the event name changes the event name in other locations', () => {
    it('edit the event name, change the event tab title', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventNames = screen.getAllByRole("textbox", { name: /event name/i }) as HTMLInputElement[];
      expect(eventNames).toHaveLength(1);
      expect(eventNames[0]).toHaveValue("Singles");
      await user.click(eventNames[0]);
      await user.clear(eventNames[0]);
      expect(eventNames[0]).toHaveValue("");
      await user.type(eventNames[0], "Testing");
      expect(eventNames[0]).toHaveValue("Testing");
      const eventTab = await screen.findByRole('tab', { name: /testing/i })
      expect(eventTab).toBeInTheDocument();
    })
    it('changing event name changes squad event name', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventNames = screen.getAllByRole("textbox", { name: /event name/i }) as HTMLInputElement[];
      expect(eventNames).toHaveLength(1);
      expect(eventNames[0]).toHaveValue("Singles");
      await user.click(eventNames[0]);
      await user.clear(eventNames[0]);
      expect(eventNames[0]).toHaveValue("");
      await user.type(eventNames[0], "Testing");
      expect(eventNames[0]).toHaveValue("Testing");
      const squadAcdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(squadAcdns[0]);
      const squadEvents = screen.getAllByRole("combobox", { name: /event/i }) as HTMLInputElement[];
      expect(squadEvents).toHaveLength(1);
      expect(squadEvents[0]).toHaveValue('1'); // event_id has not been set,
      expect(squadEvents[0]).toHaveDisplayValue("Testing");
    })
  })

  describe('changing Event Games changes squad event games', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: mockEvents,
      divs: initDivs,
      squads: mockSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };
    
    it('changing event games changes squad event games', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventGames = screen.getAllByRole("spinbutton", { name: /event games/i }) as HTMLInputElement[];
      expect(eventGames).toHaveLength(1);
      await user.click(eventGames[0]);
      await user.clear(eventGames[0]);
      expect(eventGames[0]).toHaveValue(0);
      await user.type(eventGames[0], "6");
      expect(eventGames[0]).toHaveValue(6);
      const squadAcdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(squadAcdns[0]);
      const squadGames = screen.getAllByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement[];
      expect(squadGames).toHaveLength(1);
      expect(squadGames[0]).toHaveValue(6);
    })
    it('changing event games to invalid value changes squad event games to last valid value', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventGames = screen.getAllByRole("spinbutton", { name: /event games/i }) as HTMLInputElement[];
      expect(eventGames).toHaveLength(1);
      await user.click(eventGames[0]);
      await user.clear(eventGames[0]);
      expect(eventGames[0]).toHaveValue(0);
      await user.type(eventGames[0], "123");
      expect(eventGames[0]).toHaveValue(123);
      const squadAcdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(squadAcdns[0]);
      const squadGames = screen.getAllByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement[];
      expect(squadGames).toHaveLength(1);
      expect(squadGames[0]).toHaveValue(12);
    })
    it('multi events, multi squads, change event games only changes squad games for squads for that event', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventGames = screen.getAllByRole("spinbutton", { name: /event games/i }) as HTMLInputElement[];
      expect(eventGames).toHaveLength(2);
      await user.click(eventGames[0]);
      await user.clear(eventGames[0]);
      expect(eventGames[0]).toHaveValue(0);
      await user.type(eventGames[0], "4");
      const squadAcdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(squadAcdns[0]);
      const squadGames = screen.getAllByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement[];
      expect(squadGames).toHaveLength(2);
      expect(squadGames[0]).toHaveValue(4);
      expect(squadGames[1]).toHaveValue(3);
    })
  })

  describe('enter the added $ value', () => {
    
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };  

    it('enter the added $ amount', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);      
      const addeds = screen.getAllByRole('textbox', { name: /added \$/i }) as HTMLInputElement[];
      const entryFees = screen.getAllByRole('textbox', { name: /entry fee/i }) as HTMLInputElement[];
      // enter less than min value - will not accept negative sign, enter value w/o "-"
      await user.clear(addeds[0]);
      await user.clear(addeds[0]);
      await user.type(addeds[0], '100');
      expect(addeds[0]).toHaveValue('$100');
    })
  })  

  describe('enter the entry fee and disbursals', () => {
    // team size, event games & added $ renders in oneToNEvents.test.tsx
    it('enter event fee amount', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const entryFees = screen.getAllByRole('textbox', { name: /entry fee/i }) as HTMLInputElement[];
      expect(entryFees).toHaveLength(1);
      const lineages = screen.getAllByRole('textbox', { name: /lineage/i }) as HTMLInputElement[];
      expect(lineages).toHaveLength(1);
      await user.click(entryFees[0]);
      await user.clear(entryFees[0]);
      await user.type(entryFees[0], "80[Tab]");
      expect(entryFees[0]).toHaveValue("$80.00");
      expect(lineages[0]).toHaveFocus();
      const lpoxs = screen.getAllByRole('textbox', { name: /L\+P\+O\+X/i }) as HTMLInputElement[];
      expect(lpoxs).toHaveLength(1);
      expect(lpoxs[0]).toHaveClass("is-invalid");
    })
    it('enter lineage amount', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const entryFees = screen.getAllByRole('textbox', { name: /entry fee/i }) as HTMLInputElement[];
      expect(entryFees).toHaveLength(1);
      const lineages = screen.getAllByRole('textbox', { name: /lineage/i }) as HTMLInputElement[];
      expect(lineages).toHaveLength(1);
      const prizes = screen.getAllByRole('textbox', { name: /prize fund/i }) as HTMLInputElement[];
      expect(prizes).toHaveLength(1);
      await user.click(entryFees[0]);
      await user.clear(entryFees[0]);
      await user.type(entryFees[0], "80[Tab]");
      expect(entryFees[0]).toHaveValue("$80.00");
      expect(lineages[0]).toHaveFocus();
      await user.clear(lineages[0]);
      await user.type(lineages[0], "18[Tab]");
      expect(lineages[0]).toHaveValue("$18.00");
      expect(prizes[0]).toHaveFocus();
      const lpoxs = screen.getAllByRole('textbox', { name: /L\+P\+O\+X/i }) as HTMLInputElement[];
      expect(lpoxs).toHaveLength(1);
      expect(lpoxs[0]).toHaveClass("is-invalid");
    })
    it('enter prize fund amount', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const entryFees = screen.getAllByRole('textbox', { name: /entry fee/i }) as HTMLInputElement[];
      expect(entryFees).toHaveLength(1);
      const lineages = screen.getAllByRole('textbox', { name: /lineage/i }) as HTMLInputElement[];
      expect(lineages).toHaveLength(1);
      const prizes = screen.getAllByRole('textbox', { name: /prize fund/i }) as HTMLInputElement[];
      expect(prizes).toHaveLength(1);
      const others = screen.getAllByRole('textbox', { name: /other/i }) as HTMLInputElement[];
      expect(others).toHaveLength(1);
      await user.click(entryFees[0]);
      await user.clear(entryFees[0]);
      await user.type(entryFees[0], "80[Tab]");
      await user.clear(lineages[0]);
      await user.type(lineages[0], "18[Tab]");
      await user.clear(prizes[0]);
      await user.type(prizes[0], "55[Tab]");
      expect(prizes[0]).toHaveValue("$55.00");
      expect(others[0]).toHaveFocus();
      const lpoxs = screen.getAllByRole('textbox', { name: /L\+P\+O\+X/i }) as HTMLInputElement[];
      expect(lpoxs).toHaveLength(1);
      expect(lpoxs[0]).toHaveClass("is-invalid");
    })
    it('enter other amount', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const entryFees = screen.getAllByRole('textbox', { name: /entry fee/i }) as HTMLInputElement[];
      expect(entryFees).toHaveLength(1);
      const lineages = screen.getAllByRole('textbox', { name: /lineage/i }) as HTMLInputElement[];
      expect(lineages).toHaveLength(1);
      const prizes = screen.getAllByRole('textbox', { name: /prize fund/i }) as HTMLInputElement[];
      expect(prizes).toHaveLength(1);
      const others = screen.getAllByRole('textbox', { name: /other/i }) as HTMLInputElement[];
      expect(others).toHaveLength(1);
      const expenses = screen.getAllByRole('textbox', { name: /expenses/i }) as HTMLInputElement[];
      expect(expenses).toHaveLength(1);
      await user.click(entryFees[0]);
      await user.clear(entryFees[0]);
      await user.type(entryFees[0], "80[Tab]");
      await user.clear(lineages[0]);
      await user.type(lineages[0], "18[Tab]");
      await user.clear(prizes[0]);
      await user.type(prizes[0], "55[Tab]");
      await user.clear(others[0]);
      await user.type(others[0], "2[Tab]");
      expect(others[0]).toHaveValue("$2.00");
      expect(expenses[0]).toHaveFocus();
      const lpoxs = screen.getAllByRole('textbox', { name: /L\+P\+O\+X/i }) as HTMLInputElement[];
      expect(lpoxs).toHaveLength(1);
      expect(lpoxs[0]).toHaveClass("is-invalid");
    })
    it('enter expenses amount', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const entryFees = screen.getAllByRole('textbox', { name: /entry fee/i }) as HTMLInputElement[];
      expect(entryFees).toHaveLength(1);
      const lineages = screen.getAllByRole('textbox', { name: /lineage/i }) as HTMLInputElement[];
      expect(lineages).toHaveLength(1);
      const prizes = screen.getAllByRole('textbox', { name: /prize fund/i }) as HTMLInputElement[];
      expect(prizes).toHaveLength(1);
      const others = screen.getAllByRole('textbox', { name: /other/i }) as HTMLInputElement[];
      expect(others).toHaveLength(1);
      const expenses = screen.getAllByRole('textbox', { name: /expenses/i }) as HTMLInputElement[];
      expect(expenses).toHaveLength(1);
      await user.click(entryFees[0]);
      await user.clear(entryFees[0]);
      await user.type(entryFees[0], "80[Tab]");
      await user.clear(lineages[0]);
      await user.type(lineages[0], "18[Tab]");
      await user.clear(prizes[0]);
      await user.type(prizes[0], "55[Tab]");
      await user.clear(others[0]);
      await user.type(others[0], "2[Tab]");
      await user.clear(expenses[0]);
      await user.type(expenses[0], "5{Shift>}[Tab]{/Shift}");
      expect(expenses[0]).toHaveValue("$5.00");
      expect(others[0]).toHaveFocus();
      const lpoxs = screen.getAllByRole('textbox', { name: /L\+P\+O\+X/i }) as HTMLInputElement[];
      expect(lpoxs).toHaveLength(1);
      expect(lpoxs[0]).toHaveClass("is-valid");
    })
  })

  describe('render multiple events', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: mockEvents,
      divs: initDivs,
      squads: mockSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };
    
    it('render multiple event tabs', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      expect(singlesTabs[0]).toBeInTheDocument();
      expect(doublesTabs[0]).toBeInTheDocument();
    })
  })

  describe('render the event name errors', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: mockEvents,
      divs: initDivs,
      squads: mockSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };
    it('render the event name required error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      // expect 3 singles tab buttos 1 each in events, squads and lanes
      expect(singlesTabs).toHaveLength(3);
      const eventNames = screen.getAllByRole("textbox", { name: /event name/i }) as HTMLInputElement[];
      expect(eventNames).toHaveLength(2);
      await user.clear(eventNames[0]);
      expect(singlesTabs[0]).toHaveTextContent('');
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const eventNameErrors = await screen.findAllByTestId('dangerEventName');
      expect(eventNameErrors).toHaveLength(2);
      expect(eventNameErrors[0]).toHaveTextContent("Event Name is required");
      expect(acdns[0]).toHaveTextContent("Events: Error in Events - Event Name is required");
      expect(singlesTabs[0]).toHaveClass('objError');
    })
    it('redner duplicate event name error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      expect(singlesTabs[0]).toBeInTheDocument();
      expect(doublesTabs[0]).toBeInTheDocument();
      await user.click(doublesTabs[0])
      const eventNames = screen.getAllByRole("textbox", { name: /event name/i }) as HTMLInputElement[];
      await user.clear(eventNames[1]);
      await user.type(eventNames[1], 'Singles')
      expect(eventNames[0]).toHaveValue("Singles");
      expect(eventNames[1]).toHaveValue("Singles");
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const eventNameErrors = await screen.findAllByTestId('dangerEventName');
      expect(eventNameErrors[0]).toHaveTextContent('');
      expect(eventNameErrors[1]).toHaveTextContent("has already been used");
      expect(acdns[0]).toHaveTextContent("has already been used");
      expect(singlesTabs[0]).not.toHaveClass('objError');
      expect(doublesTabs[0]).toHaveClass('objError');
    })
    it('clear the event name error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i });
      const eventNames = screen.getAllByRole("textbox", { name: /event name/i }) as HTMLInputElement[];
      await user.clear(eventNames[0]);
      expect(singlesTabs[0]).toHaveTextContent('');
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const eventNameErrors = await screen.findAllByTestId('dangerEventName');
      expect(eventNameErrors[0]).toHaveTextContent("Event Name is required");
      expect(acdns[0]).toHaveTextContent("Events: Error in Events - Event Name is required");
      expect(singlesTabs[0]).toHaveClass('objError');
      // editing event name should clear the error
      await user.click(eventNames[0]);
      await user.type(eventNames[0], 'Singles');
      expect(eventNameErrors[0]).toHaveTextContent("");
      expect(singlesTabs[0]).not.toHaveClass('objError');
      expect(singlesTabs[0]).toHaveTextContent('Singles');
      expect(acdns[0]).not.toHaveTextContent(": Error in Events - Event Name is required");
      expect(acdns[0]).toHaveTextContent("Events");
    })
  })

  describe('render the team size errors', () => {

    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };

    it('enter value less than min team size', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const teamSizes = screen.getAllByRole('spinbutton', { name: /team size/i }) as HTMLInputElement[];
      // enter less than min value
      await user.clear(teamSizes[0]);
      await user.type(teamSizes[0], '0');
      expect(teamSizes[0]).toHaveValue(0);
      // should show error
      await user.click(saveBtn);
      const teamSizeError = await screen.findByTestId('dangerTeamSize');
      expect(teamSizeError).toHaveTextContent("Team Size cannot be less than");
      expect(acdns[0]).toHaveTextContent("Team Size cannot be less than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
    })
    it('enter value greater than max team size', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const teamSizes = screen.getAllByRole('spinbutton', { name: /team size/i }) as HTMLInputElement[];
      // enter greater than max value
      await user.clear(teamSizes[0]);
      await user.type(teamSizes[0], '11');
      expect(teamSizes[0]).toHaveValue(11);
      // should show error
      await user.click(saveBtn);
      const teamSizeError = await screen.findByTestId('dangerTeamSize');
      expect(teamSizeError).toHaveTextContent("Team Size cannot be more than");
      expect(acdns[0]).toHaveTextContent("Team Size cannot be more than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
    })
    it('enter negative value', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const teamSizes = screen.getAllByRole('spinbutton', { name: /team size/i }) as HTMLInputElement[];
      // enter less than min value
      await user.clear(teamSizes[0]);
      await user.type(teamSizes[0], '-1');
      // negitive sign ignored, conveted to 0
      expect(teamSizes[0]).toHaveValue(1);
      // should show error
      await user.click(saveBtn);
      const teamSizeErrors = await screen.findAllByTestId('dangerTeamSize');
      expect(teamSizeErrors[0]).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Team Size cannot be less than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).not.toHaveClass('objError');
    })
    it('enter text value', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const teamSizes = screen.getAllByRole('spinbutton', { name: /team size/i }) as HTMLInputElement[];
      // enter less than min value
      await user.clear(teamSizes[0]);
      await user.type(teamSizes[0], 'abc');
      expect(teamSizes[0]).toHaveValue(0);
      // should show error
      await user.click(saveBtn);
      const teamSizeError = await screen.findByTestId('dangerTeamSize');
      expect(teamSizeError).toHaveTextContent("Team Size cannot be less than");
      expect(acdns[0]).toHaveTextContent("Team Size cannot be less than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
    })
    it('after error, entering a new value clears error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const teamSizes = screen.getAllByRole('spinbutton', { name: /team size/i }) as HTMLInputElement[];
      // enter greater than max value
      await user.clear(teamSizes[0]);
      await user.type(teamSizes[0], '11');
      expect(teamSizes[0]).toHaveValue(11);
      // should show error
      await user.click(saveBtn);
      const teamSizeError = await screen.findByTestId('dangerTeamSize');
      expect(teamSizeError).toHaveTextContent("Team Size cannot be more than");
      expect(acdns[0]).toHaveTextContent("Team Size cannot be more than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
      // clear error by entering new text
      await user.clear(teamSizes[0]);
      await user.type(teamSizes[0], '1');
      // DO NOT call await user.click(saveBtn);
      expect(teamSizeError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Team Size cannot be less than");
      expect(eventTab).not.toHaveClass('objError');
    })

    // it('paste value less than min team size', async () => {
    //   const user = userEvent.setup()
    //   render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
    //   const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
    //   const acdns = await screen.findAllByRole('button', { name: /events/i });
    //   await user.click(acdns[0]);
    //   const teamSizes = screen.getAllByRole('spinbutton', { name: /team size/i }) as HTMLInputElement[];
    //   // enter less than min value
    //   await user.clear(teamSizes[0]);
    //   await user.paste('-1');
    //   await user.click(saveBtn);
    //   expect(teamSizes[0]).toHaveValue(-1);
    //   const teamSizeError = await screen.findByTestId('dangerTeamSize');
    //   expect(teamSizeError).toHaveTextContent("Team Size cannot be less than");
    //   expect(acdns[0]).toHaveTextContent("Team Size cannot be less than");
    //   const eventTab = await screen.findByRole('tab', { name: /singles/i })
    //   expect(eventTab).toHaveClass('objError');
    // })
  })

  describe('render the event game errors', () => {

    it('enter value less than min event ganes', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventGames = screen.getByRole('spinbutton', { name: /event games/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(eventGames);
      await user.type(eventGames, '0');
      expect(eventGames).toHaveValue(0);
      // should show error
      await user.click(saveBtn);
      const gamesError = await screen.findByTestId('dangerEventGames');
      expect(gamesError).toHaveTextContent("Games cannot be less than");
      expect(acdns[0]).toHaveTextContent("Games cannot be less than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
    })
    it('enter value more than max event ganes', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventGames = screen.getByRole('spinbutton', { name: /event games/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(eventGames);
      await user.type(eventGames, '123');
      expect(eventGames).toHaveValue(123);
      // should show error
      await user.click(saveBtn);
      const gamesError = await screen.findByTestId('dangerEventGames');
      expect(gamesError).toHaveTextContent("Games cannot be more than");
      expect(acdns[0]).toHaveTextContent("Games cannot be more than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
    })
    it('enter negative value', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventGames = screen.getByRole('spinbutton', { name: /event games/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(eventGames);
      await user.type(eventGames, '-1');
      // negitive sign ignored, conveted to 0
      expect(eventGames).toHaveValue(1);
      // should show error
      await user.click(saveBtn);
      const gamesError = await screen.findByTestId('dangerEventGames');
      expect(gamesError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Games cannot be less than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).not.toHaveClass('objError');
    })
    it('enter text value', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventGames = screen.getByRole('spinbutton', { name: /event games/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(eventGames);
      await user.type(eventGames, '0');
      expect(eventGames).toHaveValue(0);
      // should show error
      await user.click(saveBtn);
      const gamesError = await screen.findByTestId('dangerEventGames');
      expect(gamesError).toHaveTextContent("Games cannot be less than");
      expect(acdns[0]).toHaveTextContent("Games cannot be less than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
    })
    it('after error, entering a new value clears error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const eventGames = screen.getByRole('spinbutton', { name: /event games/i }) as HTMLInputElement;
      // enter greater than max value
      await user.clear(eventGames);
      await user.type(eventGames, '123');
      expect(eventGames).toHaveValue(123);
      // should show error
      await user.click(saveBtn);
      const gamesError = await screen.findByTestId('dangerEventGames');
      expect(gamesError).toHaveTextContent("Games cannot be more than");
      expect(acdns[0]).toHaveTextContent("Games cannot be more than");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
      // clear error by entering new text
      await user.clear(eventGames);
      await user.type(eventGames, '3');
      // DO NOT call await user.click(saveBtn);
      expect(gamesError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Games cannot be less than");
      expect(eventTab).not.toHaveClass('objError');
    })
  })

  describe('render the event errors', () => { 

    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims      
    };  

    it('render the added $ errors', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);      
      const addeds = screen.getAllByRole('textbox', { name: /added \$/i }) as HTMLInputElement[];
      // enter less than min value - will not accept negative sign, enter value w/o "-"
      await user.clear(addeds[0]);
      await user.type(addeds[0], '-1');
      expect(addeds[0]).toHaveValue('$1');
      await user.click(saveBtn);
      const addedErrors = screen.queryAllByTestId("dangerEventAddedMoney");
      expect(addedErrors[0]).toHaveTextContent('');
      expect(acdns[0]).not.toHaveTextContent("Added $ cannot be");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).not.toHaveClass('objError');
      // enter value over max value
      await user.clear(addeds[0]);
      await user.type(addeds[0], '1000000');
      // expect(addeds[0]).toHaveValue('$1,000,000'); 
      await user.click(saveBtn);
      try {
        expect(addeds[0]).toHaveValue('$1,000,000.00');   
        expect(addedErrors[0]).toHaveTextContent("Added $ cannot be more than");
        expect(acdns[0]).toHaveTextContent("Added $ cannot be more than $999,999");
        expect(eventTab).toHaveClass('objError');
      } catch (error) {
        expect(addeds[0]).toHaveValue('');   
      }
      // enter value at max, clears error
      await user.clear(addeds[0]);
      await user.type(addeds[0], '999999');
      expect(addedErrors[0]).toHaveTextContent('');
      expect(acdns[0]).not.toHaveTextContent("Added $ cannot be");
      expect(eventTab).not.toHaveClass('objError');
    })
    it('render the entry fee error and lpox error ', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);      
      const entryFees = screen.getAllByRole('textbox', { name: /entry fee/i }) as HTMLInputElement[];
      // enter negative value
      await user.clear(entryFees[0]);
      await user.type(entryFees[0], '-1');
      await user.click(saveBtn);
      expect(entryFees[0]).toHaveValue('$1.00');
      expect(acdns[0]).not.toHaveTextContent("Entry Fee cannot be");
      const feeErrors = await screen.findAllByTestId('dangerEventEntryFee');      
      expect(feeErrors[0]).toHaveTextContent("");
      const lpoxErrors = await screen.findAllByTestId('dangerEventLpox');
      expect(lpoxErrors[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      expect(acdns[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
      // enter value over max value
      await user.clear(entryFees[0]);
      await user.type(entryFees[0], '1234567{enter}');      
      expect(entryFees[0]).toHaveValue('$1,234,567');
      // new value entered clears error
      expect(acdns[0]).not.toHaveTextContent("Entry Fee ≠ LPOX");      
      expect(lpoxErrors[0]).toHaveTextContent("");      
      expect(eventTab).toHaveClass('objError');
      // await user.click(saveBtn);
      expect(feeErrors[0]).toHaveTextContent("Entry Fee cannot be more than");
      expect(acdns[0]).toHaveTextContent("Entry Fee cannot be more than");
      await user.clear(entryFees[0]);
      await user.type(entryFees[0], '80');
      await user.tab
      expect(entryFees[0]).toHaveValue("$80");
      expect(feeErrors[0]).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Entry Fee cannot be");
      expect(lpoxErrors[0]).toHaveTextContent(""); 
      expect(eventTab).not.toHaveClass('objError');
    })
    it('render the lineage error and lpox error ', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);      
      const lineages = screen.getAllByRole('textbox', { name: /lineage/i }) as HTMLInputElement[];
      // enter negative value
      await user.clear(lineages[0]);
      await user.type(lineages[0], '-1');
      await user.click(saveBtn);
      expect(lineages[0]).toHaveValue('$1.00');
      expect(acdns[0]).not.toHaveTextContent("Lineage cannot be");      
      const lineageErrors = await screen.findAllByTestId('dangerEventLineage');      
      expect(lineageErrors[0]).toHaveTextContent("");
      const lpoxErrors = await screen.findAllByTestId('dangerEventLpox');
      expect(lpoxErrors[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      expect(acdns[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
      // enter value over max value
      await user.clear(lineages[0]);
      await user.type(lineages[0], '1234567{enter}');      
      // new value entered clears error
      expect(acdns[0]).not.toHaveTextContent("Entry Fee ≠ LPOX");      
      expect(lpoxErrors[0]).toHaveTextContent(""); 
      expect(eventTab).toHaveClass('objError');      
      expect(lineageErrors[0]).toHaveTextContent("Lineage cannot be more than");
      expect(acdns[0]).toHaveTextContent("Lineage cannot be more than");
      expect(eventTab).toHaveClass('objError');
      await user.clear(lineages[0]);
      await user.type(lineages[0], '18');
      await user.tab      
      expect(lineages[0]).toHaveValue("$18");
      expect(lineageErrors[0]).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Entry Fee cannot be");
      expect(lpoxErrors[0]).toHaveTextContent("");  
      expect(eventTab).not.toHaveClass('objError');
    })
    it('render the prize fund error and lpox error ', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);      
      const prizes = screen.getAllByRole('textbox', { name: /prize fund/i }) as HTMLInputElement[];
      // enter negative value
      await user.clear(prizes[0]);
      await user.type(prizes[0], '-1');
      await user.click(saveBtn);
      expect(prizes[0]).toHaveValue('$1.00');
      expect(acdns[0]).not.toHaveTextContent("Prize Fund cannot be");
      const prizeErrors = await screen.findAllByTestId('dangerEventPrizeFund');      
      expect(prizeErrors[0]).toHaveTextContent("");
      const lpoxErrors = await screen.findAllByTestId('dangerEventLpox');
      expect(lpoxErrors[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      expect(acdns[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
      // enter value over max value
      await user.clear(prizes[0]);
      await user.type(prizes[0], '1234567{enter}');      
      // new value entered clears error
      expect(acdns[0]).not.toHaveTextContent("Entry Fee ≠ LPOX");      
      expect(lpoxErrors[0]).toHaveTextContent("");            
      expect(prizeErrors[0]).toHaveTextContent("Prize Fund cannot be more than");
      expect(acdns[0]).toHaveTextContent("Prize Fund cannot be more than");
      expect(eventTab).toHaveClass('objError');
      await user.clear(prizes[0]);
      await user.type(prizes[0], '55');
      await user.tab
      expect(prizes[0]).toHaveValue("$55");
      expect(prizeErrors[0]).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Entry Fee cannot be");
      expect(lpoxErrors[0]).toHaveTextContent("");      
      expect(eventTab).not.toHaveClass('objError');
    })
    it('render the other error and lpox error ', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);      
      const others = screen.getAllByRole('textbox', { name: /other/i }) as HTMLInputElement[];
      // enter negative value
      await user.clear(others[0]);
      await user.type(others[0], '-1');
      await user.click(saveBtn);
      expect(others[0]).toHaveValue('$1.00');
      expect(acdns[0]).not.toHaveTextContent("Other cannot be");
      const otherErrors = await screen.findAllByTestId('dangerEventOther');      
      expect(otherErrors[0]).toHaveTextContent("");
      const lpoxErrors = await screen.findAllByTestId('dangerEventLpox');
      expect(lpoxErrors[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      expect(acdns[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
      // enter value over max value
      await user.clear(others[0]);
      await user.type(others[0], '1234567{enter}');      
      // new value entered clears error
      expect(acdns[0]).not.toHaveTextContent("Entry Fee ≠ LPOX");      
      expect(lpoxErrors[0]).toHaveTextContent("");            
      expect(otherErrors[0]).toHaveTextContent("Other cannot be more than");
      expect(acdns[0]).toHaveTextContent("Other cannot be more than");
      expect(eventTab).toHaveClass('objError');
      await user.clear(others[0]);
      await user.type(others[0], '2');
      await user.tab
      expect(others[0]).toHaveValue("$2");
      expect(otherErrors[0]).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Entry Fee cannot be");
      expect(lpoxErrors[0]).toHaveTextContent("");      
      expect(eventTab).not.toHaveClass('objError');
    })
    it('render the expenses error and lpox error ', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);      
      const expenses = screen.getAllByRole('textbox', { name: /expenses/i }) as HTMLInputElement[];
      // enter negative value
      await user.clear(expenses[0]);
      await user.type(expenses[0], '-1');
      await user.click(saveBtn);
      expect(expenses[0]).toHaveValue('$1.00');
      expect(acdns[0]).not.toHaveTextContent("Expenses cannot be");
      const expensesErrors = await screen.findAllByTestId('dangerEventExpenses');      
      expect(expensesErrors[0]).toHaveTextContent("");
      const lpoxErrors = await screen.findAllByTestId('dangerEventLpox');
      expect(lpoxErrors[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      expect(acdns[0]).toHaveTextContent("Entry Fee ≠ LPOX");
      const eventTab = await screen.findByRole('tab', { name: /singles/i })
      expect(eventTab).toHaveClass('objError');
      // enter value over max value
      await user.clear(expenses[0]);
      await user.type(expenses[0], '1234567{enter}');      
      // new value entered clears error
      expect(acdns[0]).not.toHaveTextContent("Entry Fee ≠ LPOX");      
      expect(lpoxErrors[0]).toHaveTextContent("");            
      expect(expensesErrors[0]).toHaveTextContent("Expenses cannot be more than");
      expect(acdns[0]).toHaveTextContent("Expenses cannot be more than");
      expect(eventTab).toHaveClass('objError');
      await user.clear(expenses[0]);
      await user.type(expenses[0], '5');
      await user.tab
      expect(expenses[0]).toHaveValue("$5");
      expect(expensesErrors[0]).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Entry Fee cannot be");
      expect(lpoxErrors[0]).toHaveTextContent("");      
      expect(eventTab).not.toHaveClass('objError');
    })
  })

  describe('render multiple errors', () => { 

    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };

    it('render multiple errors, first error in accordian title ', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const teamSizes = screen.getAllByRole('spinbutton', { name: /team size/i }) as HTMLInputElement[];
      const eventGames = screen.getAllByRole('spinbutton', { name: /event games/i }) as HTMLInputElement[];
      // enter less than min value
      await user.clear(teamSizes[0]);
      await user.type(teamSizes[0], '0');
      expect(teamSizes[0]).toHaveValue(0);
      await user.clear(eventGames[0]);
      await user.type(eventGames[0], '0');
      expect(eventGames[0]).toHaveValue(0);
      // should show error
      await user.click(saveBtn);
      const teamSizeError = await screen.findByTestId('dangerTeamSize');
      expect(teamSizeError).toHaveTextContent("Team Size cannot be less than");
      const gamesError = await screen.findByTestId('dangerEventGames');
      expect(gamesError).toHaveTextContent("Event Games cannot be less than");
      // acdn error is the first error (team size)
      expect(acdns[0]).toHaveTextContent("Team Size cannot be less than");
    })
    it('render multiple errors, 1st error in accordian title. clear 1st error then show 2nd ', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const teamSizes = screen.getAllByRole('spinbutton', { name: /team size/i }) as HTMLInputElement[];
      const eventGames = screen.getAllByRole('spinbutton', { name: /event games/i }) as HTMLInputElement[];
      // enter less than min value
      await user.clear(teamSizes[0]);
      await user.type(teamSizes[0], '0');
      expect(teamSizes[0]).toHaveValue(0);
      await user.clear(eventGames[0]);
      await user.type(eventGames[0], '0');
      expect(eventGames[0]).toHaveValue(0);
      // should show error
      await user.click(saveBtn);
      const teamSizeError = await screen.findByTestId('dangerTeamSize');
      expect(teamSizeError).toHaveTextContent("Team Size cannot be less than");
      const gamesError = await screen.findByTestId('dangerEventGames');
      expect(gamesError).toHaveTextContent("Event Games cannot be less than");
      // acdn error is the first error (team size)
      expect(acdns[0]).toHaveTextContent("Team Size cannot be less than");
      // edit team size, clear error for team size and show 2nd error in acdn
      await user.clear(teamSizes[0]);
      await user.type(teamSizes[0], '1');
      expect(teamSizes[0]).toHaveValue(1);
      expect(teamSizeError).toHaveTextContent("");
      expect(gamesError).toHaveTextContent("Event Games cannot be less than");
      expect(acdns[0]).toHaveTextContent("Event Games cannot be less than");
    })
  })

  describe('show accordian error for next event', () => {

    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: mockEvents,
      divs: initDivs,
      squads: mockSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };

    beforeAll(() => {
      mockFullTmnt.events[0].team_size = 6;
      mockFullTmnt.events[1].games = 123;
    })

    afterAll(() => {
      mockFullTmnt.events[0].team_size = 1;
      mockFullTmnt.events[1].games = 3;
    })

    it('show accordian error for first event', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const teamSizes = screen.getAllByRole('spinbutton', { name: /team size/i }) as HTMLInputElement[];
      const eventGames = screen.getAllByRole('spinbutton', { name: /event games/i }) as HTMLInputElement[];
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      const acdnEvent = await screen.findByTestId('acdnEvents');
      expect(teamSizes[0]).toHaveValue(6);
      expect(teamSizes[1]).toHaveValue(2);
      expect(eventGames[0]).toHaveValue(3);
      expect(eventGames[1]).toHaveValue(123);
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const eventTeamSizeErrors = await screen.findAllByTestId('dangerTeamSize');
      expect(eventTeamSizeErrors[0]).toHaveTextContent("Team Size cannot be more than");
      expect(eventTeamSizeErrors[1]).toHaveTextContent("");
      expect(acdns[0]).toHaveTextContent("Team Size cannot be more than");
      expect(acdnEvent).toHaveClass('acdnError');
      expect(singlesTabs[0]).toHaveClass('objError');
      expect(doublesTabs[0]).toHaveClass('objError');

      // editing team size should clear the error
      await user.click(teamSizes[0]);
      await user.type(teamSizes[0], '1');
      expect(eventTeamSizeErrors[0]).toHaveTextContent("");
      expect(singlesTabs[0]).toHaveTextContent('Singles');
      expect(acdns[0]).not.toHaveTextContent("Team Size cannot be more than");
      expect(singlesTabs[0]).not.toHaveClass('objError');
      expect(acdns[0]).toHaveTextContent("Games cannot be more than");
      expect(acdnEvent).toHaveClass('acdnError');

      const eventGamesErrors = await screen.findAllByTestId('dangerEventGames');
      expect(eventGamesErrors[0]).toHaveTextContent("");
      expect(eventGamesErrors[1]).toHaveTextContent("Games cannot be more than");
      await user.click(doublesTabs[0]);
      await user.click(eventGames[1]);
      await user.type(eventGames[1], '2');
      expect(eventGamesErrors[1]).toHaveTextContent("");
      expect(acdns[0]).toHaveTextContent("Events");
      expect(acdnEvent).not.toHaveClass('acdnError');
      expect(doublesTabs[0]).not.toHaveClass('objError');
    })

  })

  describe('add event', () => {

    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: initEvents,
      divs: initDivs,
      squads: initSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    };

    it('add event', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const numEvents = screen.getByLabelText('# Events');
      const addButton = screen.getByTestId('eventAdd');
      expect(numEvents).toHaveValue('1');
      await user.click(addButton);    
      // const event2Tab = await screen.findAllByRole('tab', { name: /event 2/i })
      // const eventNames = await screen.findAllByRole('textbox', { name: /event name/i }) as HTMLInputElement[];
      // expect(numEvents).toHaveValue('2');
      // expect(event2Tab[0]).toBeInTheDocument();      
      // expect(mockFullTmnt.events).toHaveLength(2);
    })    
  })

  describe('delete event error, when deleted event has a squad', () => {
   
    it('delete event error, when deleted event has a squad', async () => { 
      const mockFullTmnt: fullTmntDataType = {
        tmnt: mockSDTmnt,
        events: mockEvents,
        divs: initDivs,
        squads: mockSquads,
        lanes: initLanes,
        pots: initPots,
        brkts: initBrkts,
        elims: initElims
      };
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i }) as HTMLInputElement[];
      // doubles tabs in events and squads, 
      // doublesTabs[0]: events, doublesTabs[1]: squads
      await user.click(doublesTabs[0]);
      const delBtn = await screen.findByRole('button', { name: /delete event/i });
      await user.click(delBtn);
      const okBtn = await screen.findByRole('button', { name: /ok/i });
      expect(okBtn).toBeInTheDocument(); 
      const cancelBtn = screen.queryByRole('button', { name: /cancel/i });
      expect(cancelBtn).toBeNull
      const cannotDelete = screen.getByText('Cannot Delete')
      expect(cannotDelete).toBeInTheDocument();
    })

    it('delete event confirmation', async () => { 

      const mockFullTmnt: fullTmntDataType = {
        tmnt: mockSDTmnt,
        events: mockEvents,
        divs: initDivs,
        squads: initSquads,
        lanes: initLanes,
        pots: initPots,
        brkts: initBrkts,
        elims: initElims
      };

      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /events/i });
      await user.click(acdns[0]);
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i }) as HTMLInputElement[];
      // doubles tabs in events and squads, 
      // doublesTabs[0]: events, doublesTabs[1]: squads
      await user.click(doublesTabs[0]);
      const delBtn = await screen.findByRole('button', { name: /delete event/i });
      await user.click(delBtn);
      const okBtn = await screen.findByRole('button', { name: /ok/i });
      expect(okBtn).toBeInTheDocument();   
      const cancelBtn = screen.queryByRole('button', { name: /cancel/i });
      expect(cancelBtn).toBeInTheDocument();   
      const confirmDelete = screen.getByText('Confirm Delete')
      expect(confirmDelete).toBeInTheDocument();  
    })
  })

})