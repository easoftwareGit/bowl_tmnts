import React from "react";
import { render, screen, waitFor } from '../../../test-utils'
import userEvent from "@testing-library/user-event";
import RootLayout from '../../../../src/app/layout'; 
import TmntDataPage from "@/app/dataEntry/tmnt/page";
import { mockTmnt } from "../../../mocks/tmnts/twoDivs/mockTmnt";
import { mockEvent } from "../../../mocks/tmnts/twoDivs/mockEvent";
import { mockDivs, mockPots, mockBrkts, mockElims } from "../../../mocks/tmnts/twoDivs/mockDivs";
import { mockSquad } from "../../../mocks/tmnts/twoDivs/mockSquad";
import { fullTmntDataType } from "@/lib/types/types";
import { defaultHdcpPer, defaultHdcpFrom, initBrkts, initDivs, initElims, initEvents, initPots, initSquads, initLanes, initDiv } from "@/lib/db/initVals";
import { formatValuePercent2Dec } from "@/lib/currency/formatValue";

describe('TmntDataPage - Divs Component', () => { 

  describe('click on the divs accordian', () => { 
    it('find and open the divs accordian', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      expect(acdns).toHaveLength(1);
      await user.click(acdns[0]);
    })
    it('render the divs tab', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divsTab = await screen.findByRole('tab', { name: /division 1/i })
      expect(divsTab).toBeVisible();
    })
    it('edit the div name', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divNames = screen.getAllByRole("textbox", { name: /div name/i }) as HTMLInputElement[];
      expect(divNames).toHaveLength(1);
      expect(divNames[0]).toHaveValue("Division 1");
      await user.click(divNames[0]);
      await user.clear(divNames[0]);
      expect(divNames[0]).toHaveValue("");
      await user.type(divNames[0], "Testing");
      expect(divNames[0]).toHaveValue("Testing");
      const divsTab = await screen.findByRole('tab', { name: /testing/i })
      expect(divsTab).toBeInTheDocument();
    })
    // # divs, hdcp %, Hdcp From, Integer Hdcp, Hdcp For renders in oneToNDivs.test.tsx
  })

  describe('render multiple divs', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: mockEvent,
      divs: mockDivs,
      squads: mockSquad,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('render multiple divs', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      expect(acdns).toHaveLength(1);
      await user.click(acdns[0]);
      const scratchTab = await screen.findByRole('tab', { name: /scratch/i })
      const hdcpTab = await screen.findByRole('tab', { name: /hdcp/i })
      expect(scratchTab).toBeInTheDocument();
      expect(hdcpTab).toBeInTheDocument();
    })
  })

  describe('changing the div name changes the div tab title', () => {
    it('changing the div name changes the div tab title', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divNames = screen.getAllByRole("textbox", { name: /div name/i }) as HTMLInputElement[];
      const divTabs = await screen.findAllByRole('tab', { name: /division 1/i })
      expect(divNames).toHaveLength(1);
      expect(divNames[0]).toHaveValue("Division 1");
      await user.click(divNames[0]);
      await user.clear(divNames[0]);
      expect(divNames[0]).toHaveValue("");
      await user.type(divNames[0], "Testing");
      expect(divNames[0]).toHaveValue("Testing");
      expect(divTabs[0]).toHaveTextContent("Testing");
    })
  })

  describe('changing the div name changes the divisions radio buttons', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: mockEvent,
      divs: mockDivs,
      squads: mockSquad,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('changing the 1st div name changes the Pots divisions radio buttons', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divNames = screen.getAllByRole("textbox", { name: /div name/i }) as HTMLInputElement[];
      expect(divNames).toHaveLength(2);
      expect(divNames[0]).toHaveValue("Scratch");
      await user.click(divNames[0]);
      await user.clear(divNames[0]);
      expect(divNames[0]).toHaveValue("");
      await user.type(divNames[0], "Open");
      expect(divNames[0]).toHaveValue("Open");
      const potsAcdn = await screen.findAllByRole('button', { name: /pots/i });
      await user.click(potsAcdn[0]);
      const testingRadios = screen.getAllByRole('radio', { name: /open/i }) as HTMLInputElement[];
      expect(testingRadios).toHaveLength(3);      // pots, brackets & elims
      expect(testingRadios[0]).not.toBeChecked(); // pots
      expect(testingRadios[1]).not.toBeChecked(); // brackets
      expect(testingRadios[2]).not.toBeChecked(); // elims
    })
    it('changing the 2nd div name changes the Pots divisions radio buttons', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divNames = screen.getAllByRole("textbox", { name: /div name/i }) as HTMLInputElement[];
      expect(divNames).toHaveLength(2);
      expect(divNames[1]).toHaveValue("Hdcp");
      const hdcpTab = await screen.findByRole('tab', { name: /hdcp/i })
      await user.click(hdcpTab);
      await user.click(divNames[1]);
      await user.clear(divNames[1]);
      expect(divNames[1]).toHaveValue("");
      await user.type(divNames[1], "Handicap");
      expect(divNames[1]).toHaveValue("Handicap");
      const potsAcdn = await screen.findAllByRole('button', { name: /pots/i });
      await user.click(potsAcdn[0]);
      const testingRadios = screen.getAllByRole('radio', { name: /handicap/i }) as HTMLInputElement[];
      expect(testingRadios).toHaveLength(3);      // pots, brackets & elims
      expect(testingRadios[0]).not.toBeChecked(); // pots
      expect(testingRadios[1]).not.toBeChecked(); // brackets
      expect(testingRadios[2]).not.toBeChecked(); // elims
    })
  })

  describe('disable/enable hdcp specific inputs', () => {
    it('set hdcp to 0, disable hdcp from', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const hdcpFrom = screen.getByRole("spinbutton", { name: /hdcp from/i });
      expect(hdcpFrom).toBeEnabled();
      const hdcp = screen.getByRole("textbox", { name: /hdcp %/i });
      await user.clear(hdcp);
      await user.type(hdcp, '0');
      expect(hdcp).toHaveValue('0%'); // focus stays on hdcp, no trailing ".00"
      expect(hdcpFrom).toBeDisabled();
    })
    it('set hdcp to 0%, disable hdcp int checkbox', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const intHdcp = screen.getByRole('checkbox', { name: /integer hdcp/i }) ;
      expect(intHdcp).toBeEnabled();
      const hdcp = screen.getByRole("textbox", { name: /hdcp %/i });
      await user.clear(hdcp);
      await user.type(hdcp, '0');
      expect(hdcp).toHaveValue('0%');
      expect(intHdcp).toBeDisabled();
    })
    it('set hdcp to 0%, disable hdcp for game radio', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const hdcpForGames = screen.getAllByRole('radio', { name: /game/i }) as HTMLInputElement[];
      expect(hdcpForGames[0]).toBeEnabled();
      const hdcp = screen.getByRole("textbox", { name: /hdcp %/i });
      await user.clear(hdcp);
      await user.type(hdcp, '0');
      expect(hdcp).toHaveValue('0%');
      expect(hdcpForGames[0]).toBeDisabled();
    })
    it('set hdcp to 0%, disable hdcp for series radio', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const hdcpForSeries = screen.getAllByRole('radio', { name: /series/i }) as HTMLInputElement[];
      expect(hdcpForSeries[0]).toBeEnabled();
      const hdcp = screen.getByRole("textbox", { name: /hdcp %/i });
      await user.clear(hdcp);
      await user.type(hdcp, '0');
      expect(hdcp).toHaveValue('0%');
      expect(hdcpForSeries[0]).toBeDisabled();
    })
    it('set hdcp to 100%, enable hdcp from', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const hdcpFrom = screen.getByRole("spinbutton", { name: /hdcp from/i });
      expect(hdcpFrom).toBeEnabled();
      const hdcp = screen.getByRole("textbox", { name: /hdcp %/i });
      await user.clear(hdcp);
      await user.type(hdcp, '0');
      expect(hdcp).toHaveValue('0%');
      expect(hdcpFrom).toBeDisabled();
      await user.clear(hdcp);
      await user.type(hdcp, '100');
      expect(hdcp).toHaveValue('100%');
      expect(hdcpFrom).toBeEnabled();
    })
    it('set hdcp to 100%, enable hdcp int checkbox', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const intHdcp = screen.getByRole('checkbox', { name: /integer hdcp/i }) ;
      expect(intHdcp).toBeEnabled();
      const hdcp = screen.getByRole("textbox", { name: /hdcp %/i });
      await user.clear(hdcp);
      await user.type(hdcp, '0');
      expect(hdcp).toHaveValue('0%');
      expect(intHdcp).toBeDisabled();
      await user.clear(hdcp);
      await user.type(hdcp, '100');
      expect(hdcp).toHaveValue('100%');
      expect(intHdcp).toBeEnabled();
    })
    it('set hdcp to 100%, disable hdcp for game radio', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const hdcpForGames = screen.getAllByRole('radio', { name: /game/i }) as HTMLInputElement[];
      expect(hdcpForGames[0]).toBeEnabled();
      const hdcp = screen.getByRole("textbox", { name: /hdcp %/i });
      await user.clear(hdcp);
      await user.type(hdcp, '0');
      expect(hdcp).toHaveValue('0%');
      expect(hdcpForGames[0]).toBeDisabled();
      await user.clear(hdcp);
      await user.type(hdcp, '100');
      expect(hdcp).toHaveValue('100%');
      expect(hdcpForGames[0]).toBeEnabled();
    })
    it('set hdcp to 100%, enable hdcp for series radio', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const hdcpForSeries = screen.getAllByRole('radio', { name: /series/i }) as HTMLInputElement[];
      expect(hdcpForSeries[0]).toBeEnabled();
      const hdcp = screen.getByRole("textbox", { name: /hdcp %/i });
      await user.clear(hdcp);
      await user.type(hdcp, '0');
      expect(hdcp).toHaveValue('0%');
      expect(hdcpForSeries[0]).toBeDisabled();
      await user.clear(hdcp);
      await user.type(hdcp, '100');
      expect(hdcp).toHaveValue('100%');
      expect(hdcpForSeries[0]).toBeEnabled();
    })
  })

  describe('render the div name errors', () => {
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: mockEvent,
      divs: mockDivs,
      squads: mockSquad,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('render the div name required error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const loadingMessage = screen.getByText(/loading/i);
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divName = screen.getByRole("textbox", { name: /div name/i }) as HTMLInputElement;
      const divTab = await screen.findByRole('tab', { name: /division 1/i })      
      expect(divName).toHaveValue("Division 1");
      await user.click(divName);
      await user.clear(divName);
      expect(divName).toHaveValue("");
      await user.click(saveBtn);
      const divNameError = await screen.findByTestId('dangerDivName');    
      expect(divNameError).toHaveTextContent("Div Name is required");
      expect(acdns[0]).toHaveTextContent("Divisions: Error in Divisions - Div Name is required");
      expect(divTab).toHaveClass('objError')
    })
    it('render error for duplicate div names', async () => { 
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const scratchTab = await screen.findByRole('tab', { name: /scratch/i })
      const hdcpTab = await screen.findByRole('tab', { name: /hdcp/i })
      const divNames = screen.getAllByRole("textbox", { name: /div name/i }) as HTMLInputElement[];      
      await user.clear(divNames[1]);
      await user.type(divNames[1], 'Scratch')
      expect(divNames[0]).toHaveValue("Scratch")
      expect(divNames[1]).toHaveValue("Scratch")
      // click will cause invalid data errors to show
      await user.click(saveBtn);
      const divNameErrors = await screen.findAllByTestId('dangerDivName');    
      expect(divNameErrors[1]).toHaveTextContent("has already been used");
      expect(acdns[0]).toHaveTextContent("has already been used");
      expect(hdcpTab).toHaveClass('objError');
    })
    it('clear the div name error', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divName = screen.getByRole("textbox", { name: /div name/i }) as HTMLInputElement;
      const divTab = await screen.findByRole('tab', { name: /division 1/i })      
      expect(divName).toHaveValue("Division 1");
      await user.click(divName);
      await user.clear(divName);
      expect(divName).toHaveValue("");
      await user.click(saveBtn);
      const divNameError = await screen.findByTestId('dangerDivName');    
      expect(divNameError).toHaveTextContent("Div Name is required");
      expect(acdns[0]).toHaveTextContent("Divisions: Error in Divisions - Div Name is required");
      expect(divTab).toHaveClass('objError')
      await user.click(divName);
      // editing div name should clear the error
      await user.type(divName, 'Testing')
      expect(divNameError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent(": Error in Divisions - Div Name is required");
      expect(divTab).not.toHaveClass('objError')
    })
  })

  describe('render hdcp % errors', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: mockEvent,
      divs: mockDivs,
      squads: mockSquad,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }
    it('render Hdcp % over max error', async () => {
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });      
      await user.click(acdns[0]);      
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcp = screen.getByRole('textbox', { name: /hdcp %/i }) as HTMLInputElement;      
      expect(hdcp).toHaveValue(formatValuePercent2Dec(defaultHdcpPer));
      await user.clear(hdcp);      
      await user.type(hdcp, '234')            
      expect(hdcp).toHaveValue('234%');      
      const divHdcpError = await screen.findByTestId('dangerHdcp');          
      await user.click(saveBtn);
      expect(hdcp).toHaveValue('234.00%');
      expect(divHdcpError).toHaveTextContent("Hdcp % cannot be more than");
      expect(acdns[0]).toHaveTextContent("Hdcp % cannot be more than");
      expect(divTab).toHaveClass('objError');            
    })
    it('clear Hdcp %, no error, reset hdcp % to 0', async () => {
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });      
      await user.click(acdns[0]);      
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcp = screen.getByRole('textbox', { name: /hdcp %/i }) as HTMLInputElement;      
      expect(hdcp).toHaveValue(formatValuePercent2Dec(defaultHdcpPer))
      // clear hdcp %, resets to 0 if blank. 0 is valid
      await user.clear(hdcp);
      await user.click(saveBtn);      
      expect(hdcp).toHaveValue('0.00%');
      const divHdcpError = await screen.findByTestId('dangerHdcp');          
      await user.click(saveBtn);
      expect(divHdcpError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Hdcp %");
      expect(divTab).not.toHaveClass('objError');            
    })    
    it('type "-1" into hdcp %, converts to 01, NO error', async () => { 
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });      
      await user.click(acdns[0]);      
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcp = screen.getByRole('textbox', { name: /hdcp %/i }) as HTMLInputElement;      
      expect(hdcp).toHaveValue(formatValuePercent2Dec(defaultHdcpPer))
      await user.clear(hdcp);
      await user.type(hdcp, '-1');
      await user.click(saveBtn);      
      expect(hdcp).toHaveValue('1.00%');
      const divHdcpError = await screen.findByTestId('dangerHdcp');          
      await user.click(saveBtn);
      expect(divHdcpError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Hdcp %");
      expect(divTab).not.toHaveClass('objError');            
    })    
    it('paste "-2" into hdcp %', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcp = screen.getByRole('textbox', { name: /hdcp %/i }) as HTMLInputElement;
      expect(hdcp).toHaveValue(formatValuePercent2Dec(defaultHdcpPer))      
      await user.clear(hdcp);
      await user.paste('-2');
      await user.click(saveBtn);
      expect(hdcp).toHaveValue('2.00%');
    })
    it('clear hdcp % error', async () => { 
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });      
      await user.click(acdns[0]);      
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcp = screen.getByRole('textbox', { name: /hdcp %/i }) as HTMLInputElement;      
      expect(hdcp).toHaveValue(formatValuePercent2Dec(defaultHdcpPer))      
      await user.clear(hdcp);
      await user.type(hdcp, '234')
      await user.click(saveBtn);      
      expect(hdcp).toHaveValue('234.00%');
      const divHdcpError = await screen.findByTestId('dangerHdcp');          
      await user.click(saveBtn);
      expect(divHdcpError).toHaveTextContent("Hdcp % cannot be more than");
      expect(acdns[0]).toHaveTextContent("Hdcp % cannot be more than");
      expect(divTab).toHaveClass('objError');            
      await user.clear(hdcp);
      // entering value clears error
      await user.type(hdcp, '100');      
      expect(divHdcpError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Hdcp % cannot be more than");
      expect(divTab).not.toHaveClass('objError');            
    })
  })

  describe('render the hdcp from errors', () => {
    it('render the hdcp from error', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcpfrom = screen.getByRole('spinbutton', { name: /hdcp from/i }) as HTMLInputElement;
      expect(hdcpfrom).toHaveValue(defaultHdcpFrom)
      await user.clear(hdcpfrom);      
      await user.type(hdcpfrom, '301');
      await user.click(saveBtn);
      const divHdcpError = await screen.findByTestId('dangerHdcpFrom');
      expect(divHdcpError).toHaveTextContent("Hdcp From cannot be more than");
      expect(acdns[0]).toHaveTextContent("Hdcp From cannot be more than");
      expect(divTab).toHaveClass('objError');
    })
    it('clear Hdcp From, no error, reset hdcp from to 0', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcpfrom = screen.getByRole('spinbutton', { name: /hdcp from/i }) as HTMLInputElement;
      expect(hdcpfrom).toHaveValue(defaultHdcpFrom)
      // clear hdcp from, resets to 0 if blank. 0 is valid
      await user.clear(hdcpfrom);      
      await user.click(saveBtn);
      expect(hdcpfrom).toHaveValue(0)
      const divHdcpError = await screen.findByTestId('dangerHdcpFrom');
      expect(divHdcpError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Hdcp From cannot be more than");
      expect(divTab).not.toHaveClass('objError');
    })
    it('type "-1" into hdcp from, converts to 01, NO error', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcpfrom = screen.getByRole('spinbutton', { name: /hdcp from/i }) as HTMLInputElement;
      expect(hdcpfrom).toHaveValue(defaultHdcpFrom)
      await user.clear(hdcpfrom);
      await user.type(hdcpfrom, '-1');
      await user.click(saveBtn);
      expect(hdcpfrom).toHaveValue(1)
      const divHdcpError = await screen.findByTestId('dangerHdcpFrom');
      expect(divHdcpError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Hdcp From cannot be more than");
      expect(divTab).not.toHaveClass('objError');
    })    
    it('enter -20 into hdcp from', async () => {
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcpfrom = screen.getByRole('spinbutton', { name: /hdcp from/i }) as HTMLInputElement;
      expect(hdcpfrom).toHaveValue(defaultHdcpFrom)      
      await user.clear(hdcpfrom);
      await user.click(hdcpfrom);
      await user.type(hdcpfrom, '{arrowleft}-2'); // 0 remains, gives -20
      await user.click(saveBtn);
      expect(hdcpfrom).toHaveValue(-20);
      const divHdcpError = await screen.findByTestId('dangerHdcpFrom');
      expect(divHdcpError).toHaveTextContent("Hdcp From cannot be less than");
      expect(acdns[0]).toHaveTextContent("Hdcp From cannot be less than");
      expect(divTab).toHaveClass('objError');
    })
    it('clear hdcp % error', async () => { 
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const hdcpfrom = screen.getByRole('spinbutton', { name: /hdcp from/i }) as HTMLInputElement;
      expect(hdcpfrom).toHaveValue(defaultHdcpFrom)
      await user.clear(hdcpfrom);      
      await user.type(hdcpfrom, '301');
      await user.click(saveBtn);
      const divHdcpError = await screen.findByTestId('dangerHdcpFrom');
      expect(divHdcpError).toHaveTextContent("Hdcp From cannot be more than");
      expect(acdns[0]).toHaveTextContent("Hdcp From cannot be more than");
      expect(divTab).toHaveClass('objError');
      await user.clear(hdcpfrom);
      // entering value clears error
      await user.type(hdcpfrom, '230');
      expect(divHdcpError).toHaveTextContent("");
      expect(acdns[0]).not.toHaveTextContent("Hdcp From cannot be more than");
      expect(divTab).not.toHaveClass('objError');
    })
  })

  describe('render multiple errors', () => { 
    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: mockEvent,
      divs: mockDivs,
      squads: mockSquad,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('should render multiple errors', async () => { 
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const divTab = await screen.findByRole('tab', { name: /division 1/i })
      const divNames = screen.getAllByRole("textbox", { name: /div name/i }) as HTMLInputElement[];      
      const hdcpFroms = screen.getAllByRole('spinbutton', { name: /hdcp from/i }) as HTMLInputElement[];
      const hdcps = screen.getAllByRole('textbox', { name: /hdcp %/i }) as HTMLInputElement[];                
      await user.clear(divNames[0]);
      await user.clear(hdcps[0]);      
      await user.type(hdcps[0], '150')            
      expect(hdcps[0]).toHaveValue('150%')      
      await user.clear(hdcpFroms[0]);
      await user.type(hdcpFroms[0], '301')      
      expect(hdcpFroms[0]).toHaveValue(301)
      await user.click(saveBtn);    
      expect(divTab).toHaveClass('objError');      
      expect(acdns[0]).toHaveTextContent("Div Name is required");
      await user.clear(divNames[0]);
      await user.type(divNames[0], 'Testing');
      expect(acdns[0]).toHaveTextContent("Hdcp % cannot be more than");               
      await user.clear(hdcps[0]);      
      await user.type(hdcps[0], '234');
      expect(hdcps[0]).toHaveValue('234%');
      await user.click(saveBtn);    
      expect(divTab).toHaveClass('objError');      
      expect(acdns[0]).toHaveTextContent("Hdcp % cannot be more than");
    })
    it('clear hdcp from error, reset hdcp from to default if hdcp set to 0', async () => { 
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const scratchTab = await screen.findByRole('tab', { name: /scratch/i })
      const hdcpTab = await screen.findByRole('tab', { name: /hdcp/i })

      const hdcps = screen.getAllByRole('textbox', { name: /hdcp %/i }) as HTMLInputElement[];      
      const hdcpFroms = screen.getAllByRole('spinbutton', { name: /hdcp from/i }) as HTMLInputElement[];
      expect(hdcps[0]).toHaveValue('0.00%')
      await user.clear(hdcps[0]);      
      await user.type(hdcps[0], '150')
      await user.clear(hdcpFroms[0]);
      await user.type(hdcpFroms[0], '301')
      await user.click(saveBtn);    
      expect(scratchTab).toHaveClass('objError');      
      expect(acdns[0]).toHaveTextContent("Hdcp % cannot be more than");
      const divHdcpFromErrors = await screen.findAllByTestId('dangerHdcpFrom');          
      expect(divHdcpFromErrors[0]).toHaveTextContent("Hdcp From cannot be more than");
      await user.clear(hdcps[0]);
      await user.type(hdcps[0], '0');
      expect(hdcps[0]).toHaveValue('0%');
      await user.click(saveBtn);    
      expect(hdcpFroms[0]).toHaveValue(defaultHdcpFrom);
      expect(divHdcpFromErrors[0]).toHaveTextContent("");      
      expect(scratchTab).not.toHaveClass('objError');            
      expect(acdns[0]).not.toHaveTextContent("Hdcp % cannot be more than");
      expect(acdns[0]).not.toHaveTextContent("Hdcp From cannot be more than");
    })
    it('render errors in different divisions', async () => { 
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const scratchTab = await screen.findByRole('tab', { name: /scratch/i })
      const hdcpTab = await screen.findByRole('tab', { name: /hdcp/i })

      const hdcps = screen.getAllByRole('textbox', { name: /hdcp %/i }) as HTMLInputElement[];      
      const hdcpFroms = screen.getAllByRole('spinbutton', { name: /hdcp from/i }) as HTMLInputElement[];
      expect(hdcps[0]).toHaveValue('0.00%')
      await user.clear(hdcps[0]);      
      await user.type(hdcps[0], '150')
      await user.click(hdcpTab);
      await user.clear(hdcpFroms[1]);
      await user.type(hdcpFroms[1], '301')
      await user.click(saveBtn);
      expect(scratchTab).toHaveClass('objError');      
      // show 1st division error before 2nd division error
      expect(acdns[0]).toHaveTextContent("Hdcp % cannot be more than");
      expect(hdcpTab).toHaveClass('objError');
      await user.click(scratchTab);
      await user.clear(hdcps[0]);
      await user.type(hdcps[0], '0')
      // show 2nd division error
      expect(acdns[0]).toHaveTextContent("Hdcp From cannot be more than");
    })
  })

  describe('delete division errors', () => {

    it('delete division error, when division to delete has a pot', async () => {
      const mockFullTmnt: fullTmntDataType = {
        tmnt: mockTmnt,
        events: mockEvent,
        divs: mockDivs,
        squads: mockSquad,
        lanes: initLanes,
        pots: mockPots,
        brkts: initBrkts,
        elims: initElims,
      }
  
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const scratchTab = screen.getByRole('tab', { name: "Scratch" }) as HTMLElement;
      await user.click(scratchTab);
      const deleteBtn = screen.getByRole('button', { name: /delete div/i }) as HTMLElement;
      await user.click(deleteBtn);
      const okBtn = await screen.findByRole('button', { name: /ok/i });
      expect(okBtn).toBeInTheDocument();
      const cancelBtn = screen.queryByRole('button', { name: /cancel/i });
      expect(cancelBtn).toBeNull
      const cannotDelete = screen.getByText('Cannot Delete')
      expect(cannotDelete).toBeInTheDocument();
    })
    it('delete division error, when division to delete has a bracket', async () => {
      const mockFullTmnt: fullTmntDataType = {
        tmnt: mockTmnt,
        events: mockEvent,
        divs: mockDivs,
        squads: mockSquad,
        lanes: initLanes,
        pots: initPots,
        brkts: mockBrkts,
        elims: initElims,
      }
      
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const scratchTab = screen.getByRole('tab', { name: "Scratch" }) as HTMLElement;
      await user.click(scratchTab);
      const deleteBtn = screen.getByRole('button', { name: /delete div/i }) as HTMLElement;
      await user.click(deleteBtn);
      const okBtn = await screen.findByRole('button', { name: /ok/i });
      expect(okBtn).toBeInTheDocument();
      const cancelBtn = screen.queryByRole('button', { name: /cancel/i });
      expect(cancelBtn).toBeNull
      const cannotDelete = screen.getByText('Cannot Delete')
      expect(cannotDelete).toBeInTheDocument();
    })
    it('delete division error, when division to delete has an eliminator', async () => {
      const mockFullTmnt: fullTmntDataType = {
        tmnt: mockTmnt,
        events: mockEvent,
        divs: mockDivs,
        squads: mockSquad,
        lanes: initLanes,
        pots: initPots,
        brkts: initBrkts,
        elims: mockBrkts,
      }
      
      const user = userEvent.setup()
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const scratchTab = screen.getByRole('tab', { name: "Scratch" }) as HTMLElement;
      await user.click(scratchTab);
      const deleteBtn = screen.getByRole('button', { name: /delete div/i }) as HTMLElement;
      await user.click(deleteBtn);
      const okBtn = await screen.findByRole('button', { name: /ok/i });
      expect(okBtn).toBeInTheDocument();
      const cancelBtn = screen.queryByRole('button', { name: /cancel/i });
      expect(cancelBtn).toBeNull
      const cannotDelete = screen.getByText('Cannot Delete')
      expect(cannotDelete).toBeInTheDocument();
    })
  })

  describe('add new division', () => { 

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

    it('should add new division', async () => { 
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt}/></RootLayout>)      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const numDivs = screen.getByLabelText('# Divisions');
      const addButton = screen.getByTestId('divAdd');
      expect(numDivs).toHaveValue('1');
      await user.click(addButton);    
    })
  })

  describe('delete division', () => { 

    const mockFullTmnt: fullTmntDataType = {
      tmnt: mockTmnt,
      events: mockEvent,
      divs: mockDivs,
      squads: mockSquad,
      lanes: initLanes,
      pots: initPots,
      brkts: initBrkts,
      elims: initElims
    }

    it('should delete the division', async () => { 
      const user = userEvent.setup()      
      render(<RootLayout><TmntDataPage fullTmntData={mockFullTmnt} /></RootLayout>)
      const saveBtn = await screen.findByRole('button', { name: /save tournament/i });      
      const acdns = await screen.findAllByRole('button', { name: /divisions/i });
      await user.click(acdns[0]);
      const scratchTab = await screen.findByRole('tab', { name: /scratch/i })
      const hdcpTab = await screen.findByRole('tab', { name: /hdcp/i })
      await user.click(hdcpTab);
      const delBtn = await screen.findByRole('button', { name: /delete div/i });
      await user.click(delBtn);    
    }) 
  })

})