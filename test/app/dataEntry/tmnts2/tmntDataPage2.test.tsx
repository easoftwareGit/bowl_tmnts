import { render, screen, waitFor } from '../../../test-utils'
import RootLayout from '../../../../src/app/layout'; 
import TmntDataPage from "../../../../src/app/dataEntry/tmnt/page";

describe('TmntDataPage 2 - Component', () => { 

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
    it('render the Tounament Name', async () => { 
      render(<RootLayout><TmntDataPage /></RootLayout>)
      const tmntName = await screen.findByRole('textbox', { name: /tournament name/i });      
      expect(tmntName).toHaveValue("");
    })        

  })
})