import React from "react";
import { render, screen } from '../../../test-utils'
import userEvent from "@testing-library/user-event";
import RootLayout from '../../../../src/app/layout'; 
import TmntDataPage from "@/app/dataEntry/tmnt/page";
import { mockSDTmnt } from "../../../mocks/tmnts/singlesAndDoubles/mockSinglesDoublesTmnt";
import { mockEvents } from "../../../mocks/tmnts/singlesAndDoubles/mockEvents";
import { mockSquads } from "../../../mocks/tmnts/singlesAndDoubles/mockSquads";
import { fullTmntDataType } from "@/lib/types/types";
import { initBrkts, initDivs, initElims, initEvents, initLanes, initPots, initSquads } from "@/db/initVals";
import { dateTo_UTC_MMddyyyy, todayStr } from "@/lib/dateTools";

describe('TmntDataPage - Squads Component', () => { 

  describe('click on the squads accordian', () => { 
    it('find and open the squads accordian', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      expect(acdns).toHaveLength(1);
      await user.click(acdns[0]);
    })
    it('render the squads tab', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadsTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadsTab).toBeVisible();
    })
    it('edit the squad name', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadsNames = screen.getAllByRole("textbox", { name: /squad name/i }) as HTMLInputElement[];
      expect(squadsNames).toHaveLength(1);
      expect(squadsNames[0]).toHaveValue("Squad 1");
      await user.click(squadsNames[0]);
      await user.clear(squadsNames[0]);
      expect(squadsNames[0]).toHaveValue("");
      await user.type(squadsNames[0], "Testing");
      expect(squadsNames[0]).toHaveValue("Testing");
      const squadsTab = await screen.findByRole('tab', { name: /testing/i })
      expect(squadsTab).toBeInTheDocument();
    })
    // #squads, squad games, event, Date, Start Date renders in oneToNDivs.test.tsx
  })

  describe('render multiple squads', () => {
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

    it('render multiple squad tabs', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      // singles and doubles tabs also in events, so length = 2, 1 for each
      expect(singlesTabs).toHaveLength(2);
      // singles and doubles tabs also in events, tabs at index 1 are for squads]
      expect(singlesTabs[1]).toBeInTheDocument();
      expect(doublesTabs).toHaveLength(2);
      expect(doublesTabs[1]).toBeInTheDocument();
    })
  })

  describe('changing the squad name changed the squad tab title', () => {
    it('changing the squad name changed the squad tab title', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadNames = screen.getAllByRole("textbox", { name: /squad name/i }) as HTMLInputElement[];
      const squadTabs = await screen.findAllByRole('tab', { name: /squad 1/i })
      expect(squadNames).toHaveLength(1);
      expect(squadNames[0]).toHaveValue("Squad 1");
      await user.click(squadNames[0]);
      await user.clear(squadNames[0]);
      expect(squadNames[0]).toHaveValue("");
      await user.type(squadNames[0], "Testing");
      expect(squadNames[0]).toHaveValue("Testing");
      expect(squadTabs[0]).toHaveTextContent("Testing");
    })
  })

  describe('render the squad name errors', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: mockEvents,
      divs: initDivs,
      squads: mockSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }
    it('render the blank squad name error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      const squadNames = screen.getAllByRole("textbox", { name: /squad name/i }) as HTMLInputElement[];
      expect(squadNames).toHaveLength(2);
      await user.click(squadNames[0]);
      await user.clear(squadNames[0]);
      expect(squadNames[0]).toHaveValue("");
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const squadNameErrors = await screen.findAllByTestId('dangerSquadName');
      expect(squadNameErrors[0]).toHaveTextContent("Squad Name is required");
      expect(acdns[0]).toHaveTextContent("Squads: Error in Squads - Squad Name is required");
      // singlesTabs[0] is for events, singlesTabs[1] is for squads
      expect(singlesTabs[1]).toHaveClass('objError');
    })
    it('redner duplicate event name error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      expect(singlesTabs[1]).toBeInTheDocument();
      expect(doublesTabs[1]).toBeInTheDocument();
      await user.click(doublesTabs[0])
      const squadNames = screen.getAllByRole("textbox", { name: /squad name/i }) as HTMLInputElement[];
      expect(squadNames).toHaveLength(2);
      await user.click(squadNames[1]);
      await user.clear(squadNames[1]);
      await user.type(squadNames[1], 'Singles')
      expect(squadNames[0]).toHaveValue("Singles");
      expect(squadNames[1]).toHaveValue("Singles");
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const squadNameErrors = await screen.findAllByTestId('dangerSquadName');
      expect(squadNameErrors[0]).toHaveTextContent("");
      expect(squadNameErrors[1]).toHaveTextContent("has already been used");
      expect(acdns[0]).toHaveTextContent("has already been used");
      expect(singlesTabs[1]).not.toHaveClass('objError');
      expect(doublesTabs[1]).toHaveClass('objError');
    })
    it('clear the squad name error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      const squadNames = screen.getAllByRole("textbox", { name: /squad name/i }) as HTMLInputElement[];
      expect(squadNames).toHaveLength(2);
      await user.click(squadNames[0]);
      await user.clear(squadNames[0]);
      expect(squadNames[0]).toHaveValue("");
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const squadNameErrors = await screen.findAllByTestId('dangerSquadName');
      expect(squadNameErrors[0]).toHaveTextContent("Squad Name is required");
      expect(acdns[0]).toHaveTextContent("Squads: Error in Squads - Squad Name is required");
      // singlesTabs[0] is for events, singlesTabs[1] is for squads
      expect(singlesTabs[1]).toHaveClass('objError');
      // editing the squad name clears the error
      await user.clear(squadNames[0]);
      await user.type(squadNames[0], 'Testing');
      expect(squadNameErrors[0]).toHaveTextContent("");
      expect(singlesTabs[1]).not.toHaveClass('objError');
      expect(singlesTabs[1]).toHaveTextContent('Testing');
      expect(acdns[0]).not.toHaveTextContent(": Error in Squads - Squad Name is required");
      expect(acdns[0]).toHaveTextContent("Squads");
    })
  })

  describe('render the squad game errors', () => {
    it('render the less than min squad game error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadGames = screen.getByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(squadGames);
      await user.type(squadGames, '0');
      // should show error
      await user.click(saveBtn);
      expect(squadGames).toHaveValue(0);
      const gamesError = await screen.findByTestId('dangerSquadGames');
      expect(gamesError).toHaveTextContent("Games cannot be less than");
      expect(acdns[0]).toHaveTextContent("Games cannot be less than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
    it('render the more than max squad game error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadGames = screen.getByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(squadGames);
      await user.type(squadGames, '4');
      // should show error
      await user.click(saveBtn);
      expect(squadGames).toHaveValue(4);
      const gamesError = await screen.findByTestId('dangerSquadGames');
      expect(gamesError).toHaveTextContent("Games cannot be more than");
      expect(acdns[0]).toHaveTextContent("Games cannot be more than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
    it('max squad games is event games', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const eventAcnds = await screen.findAllByRole('button', { name: /events/i });
      const squadAcdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(eventAcnds[0]);
      const eventGames = screen.getByRole('spinbutton', { name: /event games/i }) as HTMLInputElement;
      await user.clear(eventGames);
      await user.type(eventGames, '6');
      expect(eventGames).toHaveValue(6);
      await user.click(squadAcdns[0]);
      const squadGames = screen.getByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(squadGames);
      await user.type(squadGames, '7');
      // should show error
      await user.click(saveBtn);
      expect(squadGames).toHaveValue(7);
      const gamesError = await screen.findByTestId('dangerSquadGames');
      expect(gamesError).toHaveTextContent("Games cannot be more than 6");
      expect(squadAcdns[0]).toHaveTextContent("Games cannot be more than 6");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
    it('clear the squad game error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadGames = screen.getByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(squadGames);
      await user.type(squadGames, '0');
      // should show error
      await user.click(saveBtn);
      expect(squadGames).toHaveValue(0);
      const gamesError = await screen.findByTestId('dangerSquadGames');
      expect(gamesError).toHaveTextContent("Games cannot be less than");
      expect(acdns[0]).toHaveTextContent("Games cannot be less than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
      await user.clear(squadGames);
      await user.type(squadGames, '6');
      expect(gamesError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Games cannot be less than");
      expect(squadTab).not.toHaveClass('objError');
    })
  })

  describe('render the squad starting lane errors', () => {
    it('render the less than min squad starting lane error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const startingLane = screen.getByRole('spinbutton', { name: /starting lane/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(startingLane);
      // should show error
      await user.click(saveBtn);
      expect(startingLane).toHaveValue(0);
      const gamesError = await screen.findByTestId('dangerStartingLane');
      expect(gamesError).toHaveTextContent("Starting Lane cannot be less than");
      expect(acdns[0]).toHaveTextContent("Starting Lane cannot be less than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
    it('render the more than max squad starting lane error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const startingLane = screen.getByRole('spinbutton', { name: /starting lane/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(startingLane);
      await user.type(startingLane, '234');
      // should show error
      await user.click(saveBtn);
      expect(startingLane).toHaveValue(234);
      const gamesError = await screen.findByTestId('dangerStartingLane');
      expect(gamesError).toHaveTextContent("Starting Lane cannot be more than");
      expect(acdns[0]).toHaveTextContent("Starting Lane cannot be more than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
    it('render the even starting lane error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const startingLane = screen.getByRole('spinbutton', { name: /starting lane/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(startingLane);
      await user.type(startingLane, '2');
      // should show error
      await user.click(saveBtn);
      expect(startingLane).toHaveValue(2);
      const gamesError = await screen.findByTestId('dangerStartingLane');
      expect(gamesError).toHaveTextContent("Starting Lane cannot be even");
      expect(acdns[0]).toHaveTextContent("Starting Lane cannot be even");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
    it('enter "-3" as the squad starting lane, no error, "-" converted to "0"', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const startingLane = screen.getByRole('spinbutton', { name: /starting lane/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(startingLane);
      await user.type(startingLane, '-3');
      // should show error
      await user.click(saveBtn);
      expect(startingLane).toHaveValue(3);
      const gamesError = await screen.findByTestId('dangerStartingLane');
      expect(gamesError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Starting Lane cannot be less than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).not.toHaveClass('objError');
    })
    it('clear the squad starting lane error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const startingLane = screen.getByRole('spinbutton', { name: /starting lane/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(startingLane);
      // should show error
      await user.click(saveBtn);
      expect(startingLane).toHaveValue(0);
      const gamesError = await screen.findByTestId('dangerStartingLane');
      expect(gamesError).toHaveTextContent("Starting Lane cannot be less than");
      expect(acdns[0]).toHaveTextContent("Starting Lane cannot be less than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
      await user.clear(startingLane);
      await user.type(startingLane, '1');
      expect(gamesError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Starting Lane cannot be less than");
      expect(squadTab).not.toHaveClass('objError');
    })
    it('render the odd number of lanes error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const numLanes = screen.getByRole('spinbutton', { name: /# of lanes/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(numLanes);
      await user.type(numLanes, '9');
      // should show error
      await user.click(saveBtn);
      expect(numLanes).toHaveValue(9);
      const numLanesErr = await screen.findByTestId('dangerLaneCount');
      expect(numLanesErr).toHaveTextContent("Number of Lanes cannot be odd");
      expect(acdns[0]).toHaveTextContent("Number of Lanes cannot be odd");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
  })

  describe('render the squad # of lanes errors', () => {
    it('render the less than min squad starting lane error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const numLanes = screen.getByRole('spinbutton', { name: /# of lanes/i }) as HTMLInputElement;
      // enter less than min value
      await user.clear(numLanes);
      // should show error
      await user.click(saveBtn);
      expect(numLanes).toHaveValue(0);
      const numLanesErr = await screen.findByTestId('dangerLaneCount');
      expect(numLanesErr).toHaveTextContent("Number of Lanes cannot be less than");
      expect(acdns[0]).toHaveTextContent("Number of Lanes cannot be less than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
    it('render the more than max squad starting lane error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const numLanes = screen.getByRole('spinbutton', { name: /# of lanes/i }) as HTMLInputElement;
      // enter more than max value
      await user.clear(numLanes);
      await user.type(numLanes, '234');
      // should show error
      await user.click(saveBtn);
      expect(numLanes).toHaveValue(234);
      const numLanesErr = await screen.findByTestId('dangerLaneCount');
      expect(numLanesErr).toHaveTextContent("Number of Lanes cannot be more than");
      expect(acdns[0]).toHaveTextContent("Number of Lanes cannot be more than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
    it('enter an odd numbner of lanes', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const numLanes = screen.getByRole('spinbutton', { name: /# of lanes/i }) as HTMLInputElement;
      // enter more than max value
      await user.clear(numLanes);
      await user.type(numLanes, '9');
      // should show error
      await user.click(saveBtn);
      expect(numLanes).toHaveValue(9);
      const numLanesErr = await screen.findByTestId('dangerLaneCount');
      expect(numLanesErr).toHaveTextContent("Number of Lanes cannot be odd");
      expect(acdns[0]).toHaveTextContent("Number of Lanes cannot be odd");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
    })
    it('enter "-8" as the number of lanes, no error, "-" converted to "0"', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const numLanes = screen.getByRole('spinbutton', { name: /# of lanes/i }) as HTMLInputElement;
      // enter more than max value
      await user.clear(numLanes);
      await user.type(numLanes, '-8');
      // should show error
      await user.click(saveBtn);
      expect(numLanes).toHaveValue(8);
      const numLanesErr = await screen.findByTestId('dangerLaneCount');
      expect(numLanesErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Number of Lanes cannot be less than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).not.toHaveClass('objError');
    })
    it('cleat the number of lanes error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const numLanes = screen.getByRole('spinbutton', { name: /# of lanes/i }) as HTMLInputElement;
      // enter more than max value
      await user.clear(numLanes);
      await user.type(numLanes, '234');
      // should show error
      await user.click(saveBtn);
      expect(numLanes).toHaveValue(234);
      const numLanesErr = await screen.findByTestId('dangerLaneCount');
      expect(numLanesErr).toHaveTextContent("Number of Lanes cannot be more than");
      expect(acdns[0]).toHaveTextContent("Number of Lanes cannot be more than");
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      expect(squadTab).toHaveClass('objError');
      // clear or type will cler the error
      await user.clear(numLanes);
      await user.type(numLanes, '24');
      expect(numLanesErr).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Number of Lanes cannot be more than");
      expect(squadTab).not.toHaveClass('objError');
    })
  })

  describe('render the sqruad date day error', () => {

    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: mockEvents,
      divs: initDivs,
      squads: mockSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    beforeAll(() => {
      mockFullTmnt.squads[0].squad_date = '2000-01-01';
      mockFullTmnt.squads[1].squad_date = '3000-01-01';
    })

    afterAll(() => {
      mockFullTmnt.squads[0].squad_date = todayStr;
      mockFullTmnt.squads[1].squad_date = todayStr;
    })

    it('render the less than min date error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadDates = screen.getAllByTestId('squadDate') as HTMLInputElement[];
      expect(squadDates[0]).toHaveValue('2000-01-01');
      // should show error
      await user.click(saveBtn);
      const dateErrors = await screen.findAllByTestId('dangerSquadDate') as HTMLElement[];
      expect(dateErrors[0]).toHaveTextContent("Earliest date is");
      expect(acdns[0]).toHaveTextContent("Earliest date is");
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      // singlesTabs[0] - events
      // singlesTabs[1] - squads
      expect(singlesTabs[1]).toHaveClass('objError');
    })
    it('render the more than max date error', async () => {
      // make sure squads[0] has valid date
      mockFullTmnt.squads[0].squad_date = todayStr;

      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      await user.click(acdns[0]);
      // doublesTabs[0] - events
      // doublesTabs[1] - squads
      await user.click(doublesTabs[1]);
      const squadDates = screen.getAllByTestId('squadDate') as HTMLInputElement[];
      expect(squadDates[1]).toHaveValue('3000-01-01');
      // should show error
      await user.click(saveBtn);
      const dateErrors = await screen.findAllByTestId('dangerSquadDate') as HTMLElement[];
      expect(dateErrors[1]).toHaveTextContent("Latest date is");
      expect(acdns[0]).toHaveTextContent("Latest date is");
      expect(doublesTabs[1]).toHaveClass('objError');
    })
    it('clear the date error', async () => {
      // make sure squads[0] has valid date
      mockFullTmnt.squads[0].squad_date = todayStr;

      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      await user.click(acdns[0]);
      // doublesTabs[0] - events
      // doublesTabs[1] - squads
      await user.click(doublesTabs[1]);
      const squadDates = screen.getAllByTestId('squadDate') as HTMLInputElement[];
      expect(squadDates[1]).toHaveValue('3000-01-01');
      // should show error
      await user.click(saveBtn);
      const dateErrors = await screen.findAllByTestId('dangerSquadDate') as HTMLElement[];
      expect(dateErrors[1]).toHaveTextContent("Latest date is");
      expect(acdns[0]).toHaveTextContent("Latest date is");
      expect(doublesTabs[1]).toHaveClass('objError');
      await user.click(squadDates[1]);
      // clear or type will clear the error
      await user.clear(squadDates[1]);
      await user.type(squadDates[1], '04');
      expect(dateErrors[1]).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Latest date is");
      expect(doublesTabs[1]).not.toHaveClass('objError');
    })
  })

  describe('render the squad time error', () => {

    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: mockEvents,
      divs: initDivs,
      squads: mockSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    afterAll(() => {
      mockFullTmnt.squads[0].squad_time = '10:00';
      mockFullTmnt.squads[1].squad_time = '12:30';
    })

    it('render the no time error', async () => {
      // for multiple squads, each squad must have a time
      mockFullTmnt.squads[0].squad_time = '';

      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadTimes = screen.getAllByLabelText(/start time/i) as HTMLInputElement[];
      expect(squadTimes[0]).toHaveValue('');
      // should show error
      await user.click(saveBtn);
      const timeErrors = await screen.findAllByTestId('dangerSquadTime') as HTMLElement[];
      expect(timeErrors[0]).toHaveTextContent("Time is required");
      expect(acdns[0]).toHaveTextContent("Time is required");
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      // singlesTabs[0] - events
      // singlesTabs[1] - squads
      expect(singlesTabs[1]).toHaveClass('objError');
    })
    it('render the duplicate date/time error', async () => {
      // set same time in squad 1 as squad 2
      mockFullTmnt.squads[0].squad_time = '12:30';

      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      await user.click(acdns[0]);
      const squadTimes = screen.getAllByLabelText(/start time/i) as HTMLInputElement[];
      expect(squadTimes[0]).toHaveValue('12:30');
      expect(squadTimes[1]).toHaveValue('12:30');
      const squadDates = screen.getAllByTestId('squadDate') as HTMLInputElement[];
      expect(squadDates[0]).toHaveValue(todayStr);
      expect(squadDates[1]).toHaveValue(todayStr);
      // should show error
      await user.click(saveBtn);
      const timeErrors = await screen.findAllByTestId('dangerSquadTime') as HTMLElement[];
      const dateErr = dateTo_UTC_MMddyyyy(new Date(mockFullTmnt.squads[1].squad_date));
      const timeErr = `${dateErr} - ${mockFullTmnt.squads[1].squad_time} has already been used.`;
      expect(timeErrors[1]).toHaveTextContent(timeErr);
      expect(acdns[0]).toHaveTextContent(timeErr);
      // doublesTabs[0] - events
      // doublesTabs[1] - squads
      expect(doublesTabs[1]).toHaveClass('objError');
    })
    it('clear the time error', async () => {
      // for multiple squads, each squad must have a time
      mockFullTmnt.squads[0].squad_time = '';

      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadTimes = screen.getAllByLabelText(/start time/i) as HTMLInputElement[];
      expect(squadTimes[0]).toHaveValue('');
      // should show error
      await user.click(saveBtn);
      const timeErrors = await screen.findAllByTestId('dangerSquadTime') as HTMLElement[];
      expect(timeErrors[0]).toHaveTextContent("Time is required");
      expect(acdns[0]).toHaveTextContent("Time is required");
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      // singlesTabs[0] - events
      // singlesTabs[1] - squads
      expect(singlesTabs[1]).toHaveClass('objError');
      await user.click(squadTimes[0]);
      // clear/type will clear the error
      await user.clear(squadTimes[0]);
      await user.type(squadTimes[0], '1230P');
      expect(timeErrors[0]).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Time is required");
      expect(singlesTabs[1]).not.toHaveClass('objError');
    })
  })

  describe('render multiple errors', () => {

    it('render multiple errors', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      const squadNames = screen.getByRole("textbox", { name: /squad name/i }) as HTMLInputElement;
      await user.click(squadNames);
      await user.clear(squadNames);
      const squadGames = screen.getByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement;
      await user.clear(squadGames);
      await user.type(squadGames, '0');
      // should show error
      await user.click(saveBtn);
          
      expect(squadNames).toHaveValue("");
      const squadNameError = await screen.findByTestId('dangerSquadName');
      expect(squadNameError).toHaveTextContent("Squad Name is required");
      expect(acdns[0]).toHaveTextContent("Squads: Error in Squads - Squad Name is required");
      expect(squadTab).toHaveClass('objError');
      
      expect(squadGames).toHaveValue(0);
      const gamesError = await screen.findByTestId('dangerSquadGames');
      expect(gamesError).toHaveTextContent("Games cannot be less than");
    })
    it('render multiple errors, clear first error, show 2nd in acdn', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const squadTab = await screen.findByRole('tab', { name: /squad 1/i })
      const squadName = screen.getByRole("textbox", { name: /squad name/i }) as HTMLInputElement;
      await user.click(squadName);
      await user.clear(squadName);
      const squadGames = screen.getByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement;
      await user.clear(squadGames);
      await user.type(squadGames, '0');
      // should show error
      await user.click(saveBtn);
          
      expect(squadName).toHaveValue("");
      const squadNameError = await screen.findByTestId('dangerSquadName');
      expect(squadNameError).toHaveTextContent("Squad Name is required");
      expect(acdns[0]).toHaveTextContent("Squads: Error in Squads - Squad Name is required");
      expect(squadTab).toHaveClass('objError');
      
      expect(squadGames).toHaveValue(0);
      const gamesError = await screen.findByTestId('dangerSquadGames');
      expect(gamesError).toHaveTextContent("Games cannot be less than");

      await user.click(squadName);
      await user.type(squadName, 'Squad 1');
      // squad name error cleared, acdn error message changed to games error
      expect(squadNameError).toHaveTextContent("");
      expect(acdns[0]).toHaveTextContent("Games cannot be less than");
      expect(squadTab).toHaveClass('objError');
    })
  })

  describe('show accordian error for next squad', () => {

    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockSDTmnt,
      events: mockEvents,
      divs: initDivs,
      squads: mockSquads,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    beforeAll(() => {
      mockFullTmnt.squads[0].games = 0;
      mockFullTmnt.squads[1].squad_date = '3000-01-01';
    })

    afterAll(() => {
      mockFullTmnt.squads[0].games = 3;
      mockFullTmnt.squads[1].squad_date = todayStr;
    })

    it('render multiple errors', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      await user.click(saveBtn);
      
      const gamesErrors = screen.getAllByTestId('dangerSquadGames') as HTMLElement[];
      expect(gamesErrors[0]).toHaveTextContent("Games cannot be less than");
      expect(acdns[0]).toHaveTextContent("Games cannot be less than");
      expect(singlesTabs[1]).toHaveClass('objError');
  
      const dateErrors = await screen.findAllByTestId('dangerSquadDate') as HTMLElement[];
      expect(dateErrors[1]).toHaveTextContent("Latest date is");
      expect(doublesTabs[1]).toHaveClass('objError');
    })
    it('render multiple errors, clear first error, show 2nd error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const singlesTabs = await screen.findAllByRole('tab', { name: /singles/i })
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i })
      await user.click(saveBtn);

      const squadGames = screen.getAllByRole('spinbutton', { name: /squad games/i }) as HTMLInputElement[];
      const gamesErrors = screen.getAllByTestId('dangerSquadGames') as HTMLElement[];
      expect(gamesErrors[0]).toHaveTextContent("Games cannot be less than");
      expect(acdns[0]).toHaveTextContent("Games cannot be less than");
      expect(singlesTabs[1]).toHaveClass('objError');
  
      const dateErrors = await screen.findAllByTestId('dangerSquadDate') as HTMLElement[];
      expect(dateErrors[1]).toHaveTextContent("Latest date is");
      expect(doublesTabs[1]).toHaveClass('objError');

      await user.click(singlesTabs[1]);
      await user.clear(squadGames[0]);
      await user.click(squadGames[0]);
      await user.type(squadGames[0], '3');

      expect(singlesTabs[1]).not.toHaveClass('objError');
      expect(acdns[0]).toHaveTextContent("Latest date is");
    })

  })

  describe('add squad', () => { 
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

    it('add squad', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const numEvents = screen.getByLabelText('# Squads');
      const addButton = screen.getByTestId('squadAdd');      
      expect(numEvents).toHaveValue("1");
      await user.click(addButton);
    })
  })

  describe('delete squad', () => { 
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
    it('delete squad confirmation', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /squads/i });
      await user.click(acdns[0]);
      const doublesTabs = await screen.findAllByRole('tab', { name: /doubles/i }) as HTMLInputElement[];
      // doubles tabs in events and squads, 
      // doublesTabs[0]: events, doublesTabs[1]: squads
      await user.click(doublesTabs[1]);
      const delBtn = await screen.findByRole('button', { name: /delete event/i });      
      await user.click(delBtn);
      const okBtn = await screen.findByRole('button', { name: /ok/i });
      expect(okBtn).toBeInTheDocument();   
      // const cancelBtn = screen.queryByRole('button', { name: /cancel/i });
      // expect(cancelBtn).toBeInTheDocument();   
      // const confirmDelete = screen.getByText('Confirm Delete')
      // expect(confirmDelete).toBeInTheDocument();  
    })
  })

})