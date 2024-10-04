import { render, screen, waitFor } from '@testing-library/react';
import { ReduxProvider } from '@/redux/provider';
import TmntDataForm from '@/app/dataEntry/tmnt/form';
import {
  initBrkts,
  initDivs,
  initElims,
  initEvents,
  initLanes,
  initPots,
  initSquads,
  initTmnt,
} from "@/lib/db/initVals";
import { startOfTodayUTC, dateTo_UTC_yyyyMMdd } from '@/lib/dateTools';
import { tmntPropsType } from '@/lib/types/types';
import userEvent from '@testing-library/user-event';

const showingModal = false;
const mockSetTmnts = jest.fn();
const mockSetEvents = jest.fn();
const mockSetDivs = jest.fn();
const mockSetSquads = jest.fn();
const mockSetLanes = jest.fn();
const mockSetPots = jest.fn();
const mockSetBrkts = jest.fn();
const mockSetElims = jest.fn();
const mockSetShowingModal = jest.fn();

describe('TmntDataForm - Component', () => { 

  const blankTmnt = {
    ...initTmnt,
    bowl_id: 'bwl_561540bd64974da9abdd97765fdb3659',
    start_date: startOfTodayUTC(),
    end_date: startOfTodayUTC(),
  };  

  const tmntFormProps: tmntPropsType = {
    tmnt: blankTmnt,
    setTmnt: mockSetTmnts,
    events:initEvents,
    setEvents: mockSetEvents,
    divs: initDivs,
    setDivs: mockSetDivs,
    squads: initSquads,
    setSquads: mockSetSquads,
    lanes: initLanes, 
    setLanes: mockSetLanes,
    pots: initPots,
    setPots: mockSetPots,
    brkts: initBrkts,
    setBrkts: mockSetBrkts,
    elims: initElims,
    setElims: mockSetElims,
    showingModal,
    setShowingModal: mockSetShowingModal
  };

  describe('render TmntDataForm - loading message', () => {
    it('render TmntDataForm loading message', async () => {
      render(<ReduxProvider><TmntDataForm tmntProps={tmntFormProps} /></ReduxProvider>)
      const loadingMessage = screen.getByText(/loading/i); 
      expect(loadingMessage).toBeInTheDocument();
      // wait for loading to stop    
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument()); 
      expect(loadingMessage).not.toBeInTheDocument();

      const bowlLabel = await screen.findByLabelText('Bowl Name');
      expect(bowlLabel).toBeInTheDocument();
    })    
  })
  
  describe('render TmntDataForm - after loaded Bowls data', () => { 
  
    // test all items here, so do not have to re-render each time
    // waiting for "loading" to stop

    it('render tournament items after loaded Bowls', async () => {
      render(<ReduxProvider><TmntDataForm tmntProps={tmntFormProps} /></ReduxProvider>)
      const loadingMessage = screen.getByText(/loading/i); 
      expect(loadingMessage).toBeInTheDocument();
      // wait for loading to stop    
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument()); 
      expect(loadingMessage).not.toBeInTheDocument();

      const tmntLabel = screen.getByLabelText('Tournament Name');
      expect(tmntLabel).toBeInTheDocument();
      
      const tmntNameInput = screen.getByRole('textbox', { name: /tournament name/i }) as HTMLInputElement;
      expect(tmntNameInput).toBeInTheDocument();

      const bowlLabel = screen.getByLabelText('Bowl Name');
      expect(bowlLabel).toBeInTheDocument();

      const bowlSelect = screen.getByRole('combobox', { name: /bowl name/i }) as HTMLInputElement;
      expect(bowlSelect).toBeInTheDocument();
      
      // const bowlOpts = screen.getAllByRole('option');
      // 4 bowl rows inserted in /prisma/seed.ts 
      // 1 for Choose...
      // 1 for Squad Event 
      // expect(bowlOpts).toHaveLength(6);
      expect(screen.getAllByRole('option')).toHaveLength(6); 

      const startDateLabel = screen.getByLabelText('Start Date');
      expect(startDateLabel).toBeInTheDocument();

      const startDateInput = screen.getByTestId('inputStartDate') as HTMLInputElement;
      expect(startDateInput).toBeInTheDocument();   
      expect(startDateInput.value).toBe(dateTo_UTC_yyyyMMdd(startOfTodayUTC()));
      
      const endDateLabel = screen.getByLabelText('End Date');
      expect(endDateLabel).toBeInTheDocument();

      const endDateInput = screen.getByTestId('inputEndDate') as HTMLInputElement;
      expect(endDateInput).toBeInTheDocument();      
      expect(endDateInput.value).toBe(dateTo_UTC_yyyyMMdd(startOfTodayUTC()));

      const saveBtn = screen.getByRole('button', { name: /save tournament/i });
      expect(saveBtn).toBeInTheDocument();
    })
  })

  describe('TmntDataForm - choose a bowl', () => {
    it('render TmntDataForm loading message', async () => {
      render(<ReduxProvider><TmntDataForm tmntProps={tmntFormProps} /></ReduxProvider>)
      const loadingMessage = screen.getByText(/loading/i); 
      expect(loadingMessage).toBeInTheDocument();
      // wait for loading to stop    
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument()); 
      expect(loadingMessage).not.toBeInTheDocument();

      const bowlSelect = screen.getByRole('combobox', { name: /bowl name/i }) as HTMLInputElement;
      expect(bowlSelect).toBeInTheDocument();
      const dublinBowl = screen.getByRole('option', { name: /dublin bowl/i });

      await userEvent.selectOptions(bowlSelect, dublinBowl);
      // id value for yosemite lanes is bwl_561540bd64974da9abdd97765fdb3659
      expect(bowlSelect).toHaveValue('bwl_561540bd64974da9abdd97765fdb3659');      
    })    
  })

  describe('render TmntDataForm - render errors', () => { 
  
    // test all items here, so do not have to re-render each time
    // waiting for "loading" to stop

    const tmntWithErrors = {
      ...tmntFormProps
    }
    tmntWithErrors.tmnt.bowl_id_err = "bowl error";
    tmntWithErrors.tmnt.tmnt_name_err = "tmnt error";
    tmntWithErrors.tmnt.start_date_err = "start date error";
    tmntWithErrors.tmnt.end_date_err = "end date error";

    it('render tournament items after loaded Bowls', async () => {
      render(<ReduxProvider><TmntDataForm tmntProps={tmntWithErrors} /></ReduxProvider>)
      const loadingMessage = screen.getByText(/loading/i); 
      expect(loadingMessage).toBeInTheDocument();
      // wait for loading to stop    
      await waitFor(() => expect(loadingMessage).not.toBeInTheDocument()); 
      expect(loadingMessage).not.toBeInTheDocument();

      const nameError = await screen.findByTestId("dangerTmntName");      
      expect(nameError).toHaveTextContent("tmnt error");

      const bowlError = await screen.findByTestId("dangerBowlName");
      expect(bowlError).toHaveTextContent("bowl error");

      const startError = await screen.findByTestId("dangerStartDate");
      expect(startError).toHaveTextContent("start date error");

      const endError = await screen.findByTestId("dangerEndDate");
      expect(endError).toHaveTextContent("end date error");
    })
  })

})