import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OneToNDivs from "../../../../src/app/dataEntry/tmnt/oneToNDivs";
import { mockDivs, mockPots, mockBrkts, mockElims } from '../../../mocks/tmnts/twoDivs/mockDivs'
import { initDiv } from "@/app/dataEntry/tmnt/initVals";

const mockSetDivs = jest.fn();
const mockSetAcdnErr = jest.fn();

const mockOneToNDivsProps = {
  divs: mockDivs,
  setDivs: mockSetDivs,
  pots: mockPots,
  brkts: mockBrkts,
  elims: mockElims,
  setAcdnErr: mockSetAcdnErr
}

describe("OneToNDivs - Component", () => { 

  describe("render the component", () => { 

    describe('render the 1st division', () => {
      it('render div label', () => { 
        // ARRANGE
        // const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        // ACT
        const divLabel = screen.getByLabelText("# Divisions");
        // ASSERT
        expect(divLabel).toBeInTheDocument()
      })
      it('render num divs', () => {         
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const numDivs = screen.getByTestId('inputNumDivs') as HTMLInputElement;
        expect(numDivs).toBeInTheDocument()        
        expect(numDivs.value).toBe('2')
        expect(numDivs).toBeDisabled()          
      })
      it('render add button', () => {        
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const addBtn = screen.getByText('Add');          
        expect(addBtn).toBeInTheDocument()          
      })
      it('render div name lables', () => {        
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const nameLabels = screen.getAllByLabelText('Div Name');
        expect(nameLabels.length).toBe(2)          
      })
      it('render div name inputs', () => {        
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const divNames = screen.getAllByTestId('inputDivName') as HTMLInputElement[];
        expect(divNames.length).toBe(2)
        expect(divNames[0].value).toBe('Scratch')
      })
      it('DO NOT render div name errors', () => { 
        render(<OneToNDivs {...mockOneToNDivsProps} />);
        const nameErrors = screen.queryAllByTestId("dangerDivName");
        expect(nameErrors).toHaveLength(2);
        expect(nameErrors[0]).toHaveTextContent("");
      })
      it('render hdcp % labels', () => {        
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const hdcplabels = screen.getAllByLabelText(/hdcp %/i);  
        expect(hdcplabels.length).toBe(2)
      })
      it("render hdcp % titles", () => {
        render(<OneToNDivs {...mockOneToNDivsProps} />);
        const hdcpTitles = screen.getAllByTitle("Enter Hdcp % 0 for scratch");
        expect(hdcpTitles).toHaveLength(2);
        expect(hdcpTitles[0]).toHaveTextContent("?");
      });
      it('render hdcp % inputs', () => {        
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const hdcps = screen.getAllByTestId('inputHdcp') as HTMLInputElement[];  
        expect(hdcps.length).toBe(2)
        expect(hdcps[0].value).toBe('0')
      })
      it('DO NOT render hdcp % errors', () => { 
        render(<OneToNDivs {...mockOneToNDivsProps} />);
        const hdcpErrors = screen.queryAllByTestId("dangerHdcp");
        expect(hdcpErrors).toHaveLength(2);
        expect(hdcpErrors[0]).toHaveTextContent("");
      })
      it('render hdcp from labels', () => {        
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const hdcpFromLabels = screen.getAllByLabelText('Hdcp From');  
        expect(hdcpFromLabels.length).toBe(2)
      })
      it('render hdcp from inputs', () => {        
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const hdcpFroms = screen.getAllByTestId('inputHdcpFrom') as HTMLInputElement[];
        expect(hdcpFroms.length).toBe(2)  
        expect(hdcpFroms[0].value).toBe('220')
        expect(hdcpFroms[0]).toBeDisabled()
      })
      it('DO NOT render hdcp from errors', () => { 
        render(<OneToNDivs {...mockOneToNDivsProps} />);
        const hdcpFromErrors = screen.queryAllByTestId("dangerHdcpFrom");
        expect(hdcpFromErrors).toHaveLength(2);
        expect(hdcpFromErrors[0]).toHaveTextContent("");
      })
      it('render int hdcp checkbox', () => {        
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const intHdcps = screen.getAllByTestId('chkBoxIntHdcp') as HTMLInputElement[];
        expect(intHdcps.length).toBe(2)  
        // 0 hdcp % will have this disabled, not checked in mock for testing
        expect(intHdcps[0]).not.toBeChecked()
        expect(intHdcps[0]).toBeDisabled()
      })
      it('render hdcp for game radio', () => {
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const hdcpForGames = screen.getAllByTestId('radioHdcpForGame') as HTMLInputElement[];  
        expect(hdcpForGames.length).toBe(2)
        // 0 hdcp % will have this disabled, not checked in mock for testing
        expect(hdcpForGames[0]).not.toBeChecked()
        expect(hdcpForGames[0]).toBeDisabled()
        const gameTexts = screen.getAllByLabelText('Game');
        expect(gameTexts).toHaveLength(2);
      })
      it('render hdcp for series radio', () => {        
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const hdcpForSeries = screen.getAllByTestId('radioHdcpForSeries') as HTMLInputElement[];  
        expect(hdcpForSeries.length).toBe(2)
        // 0 hdcp % will have this disabled, checked in mock for testing
        expect(hdcpForSeries[0]).toBeChecked()  
        expect(hdcpForSeries[0]).toBeDisabled()
        const seriesTexts = screen.getAllByLabelText('Series');
        expect(seriesTexts).toHaveLength(2);
      })
      it('render tabs', async () => {
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[0]); // focus on first tab
        expect(tabs).toHaveLength(2);
        expect(tabs[0]).toHaveTextContent(mockDivs[0].tab_title);        
        expect(tabs[0]).toHaveAttribute("aria-selected", "true");                
        expect(tabs[1]).toHaveTextContent(mockDivs[1].tab_title);
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
      })
    })

    describe('render the 2nd division', () => { 
      beforeAll(() => {
        mockDivs[1].div_name_err = 'test div name error';
        mockDivs[1].hdcp_from_err = 'test hdcp from error';
        mockDivs[1].hdcp_err = 'test hdcp error';
      })
      afterAll(() => {
        mockDivs[1].div_name_err = '';
        mockDivs[1].hdcp_from_err = '';
        mockDivs[1].hdcp_err = '';
      })
      it('render the 2nd division', async () => {
        // ARRANGE
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        // ACT
        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(2);
        await user.click(tabs[1]);        
        // ASSERT
        expect(tabs[0]).toHaveAttribute("aria-selected", "false");
        expect(tabs[1]).toHaveAttribute("aria-selected", "true");
      })
      it('render the delete button', async () => {
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const delBtn = screen.getByText('Delete Div');
        expect(delBtn).toBeInTheDocument();
      })
      it('render div name inputs', async () => {        
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const divNames = screen.getAllByTestId('inputDivName') as HTMLInputElement[];
        expect(divNames[1]).toHaveClass("is-invalid");
        expect(divNames[1].value).toBe('Hdcp')
      })
      it('render 2nd div name errors', async () => { 
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const nameErrors = screen.queryAllByTestId("dangerDivName");
        expect(nameErrors).toHaveLength(2);
        expect(nameErrors[1]).toHaveTextContent("test div name error");
      })
      it('render hdcp % inputs', async () => {        
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const hdcps = screen.getAllByTestId('inputHdcp') as HTMLInputElement[];  
        expect(hdcps[1]).toHaveClass("is-invalid");
        expect(hdcps[1].value).toBe('100')
      })
      it('render 2nd hdcp % errors', async () => { 
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const nameErrors = screen.queryAllByTestId("dangerHdcp");
        expect(nameErrors).toHaveLength(2);
        expect(nameErrors[1]).toHaveTextContent("test hdcp error");
      })
      it('render hdcp from inputs', async () => {        
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const hdcpFroms = screen.getAllByTestId('inputHdcpFrom') as HTMLInputElement[];
        expect(hdcpFroms[1]).toHaveClass("is-invalid");
        expect(hdcpFroms[1].value).toBe('230')
        expect(hdcpFroms[1]).toBeEnabled()
      })
      it('render 2nd hdcp % errors', async () => { 
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const nameErrors = screen.queryAllByTestId("dangerHdcpFrom");
        expect(nameErrors).toHaveLength(2);
        expect(nameErrors[1]).toHaveTextContent("test hdcp from error");
      })
      it('render int hdcp checkbox', async () => {        
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const intHdcps = screen.getAllByTestId('chkBoxIntHdcp') as HTMLInputElement[];
        expect(intHdcps.length).toBe(2)  
        expect(intHdcps[1]).toBeChecked()
        expect(intHdcps[1]).toBeEnabled()
      })
      it('render hdcp for game radio', async () => {
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const hdcpForGames = screen.getAllByTestId('radioHdcpForGame') as HTMLInputElement[];  
        expect(hdcpForGames.length).toBe(2)
        expect(hdcpForGames[1]).toBeChecked()
        expect(hdcpForGames[1]).toBeEnabled()
      })
      it('render hdcp for series radio', async () => {        
        const user = userEvent.setup()
        render(<OneToNDivs {...mockOneToNDivsProps} />)      
        const tabs = screen.getAllByRole('tab');  
        await user.click(tabs[1]);
        const hdcpForSeries = screen.getAllByTestId('radioHdcpForSeries') as HTMLInputElement[];  
        expect(hdcpForSeries.length).toBe(2)
        expect(hdcpForSeries[1]).not.toBeChecked()  
        expect(hdcpForSeries[1]).toBeEnabled()
      })
    })
  })

  describe('radio buttons per divsion should have same name (group)', () => { 
    it('test if "Scratch" div radio buttons have same name', () => {      
      render(<OneToNDivs {...mockOneToNDivsProps} />)      
      const ganeRadios = screen.getAllByLabelText("Game");
      const seriesRadios = screen.getAllByLabelText("Series");
      expect(ganeRadios[0]).toHaveAttribute('name', 'divHdcpRadio1');
      expect(seriesRadios[0]).toHaveAttribute('name', 'divHdcpRadio1');
    })
    it('test if "Hdcp" div radio buttons have same name', async () => {
      const user = userEvent.setup()
      render(<OneToNDivs {...mockOneToNDivsProps} />)      
      const tabs = screen.getAllByRole('tab');  
      await user.click(tabs[1]);
      const ganeRadios = screen.getAllByLabelText("Game");
      const seriesRadios = screen.getAllByLabelText("Series");
      expect(ganeRadios[1]).toHaveAttribute('name', 'divHdcpRadio2');
      expect(seriesRadios[1]).toHaveAttribute('name', 'divHdcpRadio2');    
    })
  })

  describe("add division", () => { 
    beforeAll(() => {
      mockDivs.push({
        ...initDiv,
        id: "3",
        sort_order: 3,
        div_name: "50+",
        tab_title: "50+",
      });
    });

    afterAll(() => {
      if (mockDivs.length === 3) mockDivs.pop();
    });

    it('test if added division has the correct tab title', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(<OneToNDivs {...mockOneToNDivsProps} />)      
      const addBtn = screen.getByText('Add');          
      expect(addBtn).toBeInTheDocument()          
      // ACT
      await user.click(addBtn)
      // ASSERT
      expect(mockOneToNDivsProps.setDivs).toHaveBeenCalled();

      // ACT
      const tabs = screen.getAllByRole("tab");
      // ASSERT
      expect(tabs.length).toBe(3);
      expect(tabs[2]).toHaveTextContent("50+");
    })

    it('test added division radio buttons', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(<OneToNDivs {...mockOneToNDivsProps} />)      
      const addBtn = screen.getByText('Add');          
      expect(addBtn).toBeInTheDocument()          
      // ACT
      await user.click(addBtn)
      // ASSERT
      expect(mockOneToNDivsProps.setDivs).toHaveBeenCalled();

      // ACT
      const tabs = screen.getAllByRole("tab");
      // ASSERT
      expect(tabs.length).toBe(3);

      // ARRANGE
      await user.click(tabs[2]);
      
      // ACT
      const hdcpForGames = screen.getAllByTestId('radioHdcpForGame') as HTMLInputElement[];  
      const hdcpForSeries = screen.getAllByTestId('radioHdcpForSeries') as HTMLInputElement[];  

      // ASSERT
      expect(hdcpForGames.length).toBe(3)
      expect(hdcpForSeries.length).toBe(3)      
              
      expect(hdcpForGames[2]).toBeChecked()
      expect(hdcpForSeries[2]).not.toBeChecked()

      // <input> atribute checked is set as: 
      // checked={div.hdcp_for === 'Game'}
      await user.click(hdcpForSeries[2]);
      mockDivs[2].hdcp_for = "Series";
      try {
        expect(hdcpForGames[2]).not.toBeChecked()
      } catch (error) {
        expect(mockOneToNDivsProps.divs[2].hdcp_for).toBe("Series");
      }
      try {
        expect(hdcpForSeries[2]).toBeChecked()  
      } catch (error) {
        expect(mockOneToNDivsProps.divs[2].hdcp_for).toBe("Series");
      }
      
      await user.click(hdcpForGames[2]);
      mockDivs[2].hdcp_for = "Game";
      try {
        expect(hdcpForGames[2]).toBeChecked()  
      } catch (error) {
        expect(mockOneToNDivsProps.divs[2].hdcp_for).toBe("Game");
      }
      try {
        expect(hdcpForSeries[2]).not.toBeChecked()        
      } catch (error) {
        expect(mockOneToNDivsProps.divs[2].hdcp_for).toBe("Game");
      }            
    })

  })

  describe("delete division", () => { 
    beforeAll(() => {
      mockDivs.push({
        ...initDiv,
        id: "3",
        sort_order: 3,
        div_name: "50+",
        tab_title: "50+",
      });
    });

    afterAll(() => {
      if (mockDivs.length === 3) mockDivs.pop();
    });

    it('delete division', async () => { 
      // ARRANGE
      const user = userEvent.setup();
      render(<OneToNDivs {...mockOneToNDivsProps} />) 
      // ACT
      const tabs = screen.getAllByRole("tab");
      // ARRANGE
      await user.click(tabs[2]);
      const delBtns = screen.getAllByText("Delete Div");
      // ASSERT
      expect(delBtns.length).toBe(2);
      // ACT
      await user.click(delBtns[1]);
      // ASSERT
      expect(mockOneToNDivsProps.setDivs).toHaveBeenCalled();
    })
  })
})