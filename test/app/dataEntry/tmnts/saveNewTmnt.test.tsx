import { render, screen, waitFor } from '@testing-library/react';
import { ReduxProvider } from '@/redux/provider';
import userEvent from '@testing-library/user-event';
import TmntDataForm from '@/app/dataEntry/tmnt/form';
import { tmntPropsType } from '@/lib/types/types';
import { mockTmnt, mockEvents, mockDivs, mockSquads, mockLanes, mockPots, mockBrkts, mockElims } from '../../../mocks/tmnts/newTmnt/mockNewTmnt';

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

describe('Save New Tmnt', () => {

  const tmntFormProps: tmntPropsType = {
    tmnt: mockTmnt,
    setTmnt: mockSetTmnts,
    events: mockEvents,
    setEvents: mockSetEvents,
    divs: mockDivs,
    setDivs: mockSetDivs,
    squads: mockSquads,
    setSquads: mockSetSquads,
    lanes: mockLanes, 
    setLanes: mockSetLanes,
    pots: mockPots,
    setPots: mockSetPots,
    brkts: mockBrkts,
    setBrkts: mockSetBrkts,
    elims: mockElims,
    setElims: mockSetElims,
    showingModal,
    setShowingModal: mockSetShowingModal
  };

  it('render tournament items after loaded Bowls', async () => {
    render(<ReduxProvider><TmntDataForm tmntProps={tmntFormProps} /></ReduxProvider>)
    const loadingMessage = screen.getByText(/loading/i);
    expect(loadingMessage).toBeInTheDocument();
    // wait for loading to stop    
    await waitFor(() => expect(loadingMessage).not.toBeInTheDocument());
    expect(loadingMessage).not.toBeInTheDocument();
    
  })

})