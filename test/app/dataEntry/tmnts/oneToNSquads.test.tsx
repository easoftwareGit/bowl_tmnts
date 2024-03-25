import React  from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OneToNSquads from "../../../../src/app/dataEntry/tmnt/oneToNSquads";
import { mockSquads } from "../../../mocks/tmnts/singlesAndDoubles/mockSquads";
import { mockEvents } from "../../../mocks/tmnts/singlesAndDoubles/mockEvents";
import { initSquad } from "@/app/dataEntry/tmnt/initVals";
import { squadType } from "@/app/dataEntry/tmnt/types";

const mockSetSquads = jest.fn();
const mockSetAcdnErr = jest.fn();

const mockOneToNSquadsProps = {
  squads: mockSquads,
  setSquads: mockSetSquads,
  events: mockEvents,
  setAcdnErr: mockSetAcdnErr,
};

describe("OneToNSquads - Component", () => { 

  describe("render the component - 2 squads", () => {

    describe('render the 1st squad', () => { 
      
      it('render squads label', () => { 
        // ARRANGE
        // const user = userEvent.setup()
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        // ACT
        const eventLabel = screen.getByLabelText("# Squads");
        // ASSERT
        expect(eventLabel).toBeInTheDocument();
      })
      it('render number of squads', () => { 
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadNum = screen.getByTestId("inputNumSquads") as HTMLInputElement;
        expect(squadNum).toBeInTheDocument();
        expect(squadNum.value).toBe("2");
        expect(squadNum).toBeDisabled();
      })
      it("render add button", () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const addBtn = screen.getByText("Add");
        expect(addBtn).toBeInTheDocument();
      });
      it('render squad name labels', () => { 
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const nameLabels = screen.getAllByLabelText("Squad Name");
        expect(nameLabels).toHaveLength(2);
      })
      it('render squad names', () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadNames = screen.getAllByTestId("inputSquadName");
        expect(squadNames).toHaveLength(2);
        expect(squadNames[0]).toHaveValue(mockSquads[0].squad_name);
      })
      it('DO NOT render event name errors', () => { 
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadNameErrs = screen.queryAllByTestId("dangerSquadName");
        expect(squadNameErrs).toHaveLength(2);
        expect(squadNameErrs[0]).toHaveTextContent("");
      })
      it('render squad games labels', () => { 
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const gameLabels = screen.getAllByLabelText("Squad Games");
        expect(gameLabels).toHaveLength(2);
      })
      it('render squad games', () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadGames = screen.getAllByTestId("inputSquadGames");
        expect(squadGames).toHaveLength(2);
        expect(squadGames[0]).toHaveValue(mockSquads[0].games);
      })
      it('DO NOT render squad games errors', () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadGameErrs = screen.queryAllByTestId("dangerSquadGames");
        expect(squadGameErrs).toHaveLength(2);
        expect(squadGameErrs[0]).toHaveTextContent("");
      })
      it('render squad events labels', () => { 
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const eventLabels = screen.getAllByLabelText("Event");
        expect(eventLabels).toHaveLength(2);
      })
      it('render squad events', () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadEvents = screen.getAllByTestId("inputSquadEvent");
        expect(squadEvents).toHaveLength(2);
        expect(squadEvents[0]).toHaveValue(mockEvents[0].id);
      })
      it('DO NOT render squad events errors', () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadEventErrs = screen.queryAllByTestId("dangerSquadEvent");
        expect(squadEventErrs).toHaveLength(2);
        expect(squadEventErrs[0]).toHaveTextContent("");
      })
      it('render squad date labels', () => { 
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const dateLabels = screen.getAllByLabelText("Date");
        expect(dateLabels).toHaveLength(2);
      })
      it('render squad dates', () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadDates = screen.getAllByTestId("inputSquadDate");
        expect(squadDates).toHaveLength(2);
        expect(squadDates[0]).toHaveValue(mockSquads[0].squad_date);
      })
      it('DO NOT render squad dates errors', () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadDateErrs = screen.queryAllByTestId("dangerSquadDate");
        expect(squadDateErrs).toHaveLength(2);
        expect(squadDateErrs[0]).toHaveTextContent("");
      })
      it('render start time labels', () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const timeLabels = screen.getAllByLabelText("Start Time");
        expect(timeLabels).toHaveLength(2);
      })
      it('render start times', () => { 
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadTimes = screen.getAllByTestId("inputSquadTime");
        expect(squadTimes).toHaveLength(2);
        expect(squadTimes[0]).toHaveValue(mockSquads[0].squad_time);
      })
      it('DO NOT render squad times errors', () => {
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const squadTimeErrs = screen.queryAllByTestId("dangerSquadTime");
        expect(squadTimeErrs).toHaveLength(2);
        expect(squadTimeErrs[0]).toHaveTextContent("");
      })
      it("render the tabs", async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[0]); // focus on first tab
        expect(tabs[0]).toHaveTextContent(mockEvents[0].tab_title);
        expect(tabs[0]).toHaveAttribute("aria-selected", "true");
        expect(tabs[1]).toHaveTextContent(mockEvents[1].tab_title);
        expect(tabs[1]).toHaveAttribute("aria-selected", "false");
      });
    })

    describe('render the 2nd squad', () => { 
      beforeAll(() => {
        mockSquads[1].event_id_err = 'test event error';
        mockSquads[1].squad_date_err = 'test date error';
        mockSquads[1].squad_time_err = 'test time error';
        mockSquads[1].games_err = 'test games error';
        mockSquads[1].squad_name_err = 'test name error';
      })
      afterAll(() => {
        mockSquads[1].event_id_err = '';
        mockSquads[1].squad_date_err = '';
        mockSquads[1].squad_time_err = '';
        mockSquads[1].games_err = '';
        mockSquads[1].squad_name_err = '';
      })
      it("render the 2nd event", async () => {
        // ARRANGE
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        // ACT
        const tabs = screen.getAllByRole("tab");
        // ARRANGE
        expect(tabs).toHaveLength(2);
        // ARRANGE
        await user.click(tabs[1]);

        // ASSERT
        expect(tabs).toHaveLength(2);
        expect(tabs[0]).toHaveAttribute("aria-selected", "false"),
        expect(tabs[1]).toHaveAttribute("aria-selected", "true");
      });
      it("render delete button", async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        expect(tabs).toHaveLength(2);
        await user.click(tabs[1]);        
        const delBtn = screen.getByText("Delete Squad");
        expect(delBtn).toBeInTheDocument();
      });
      it('render squad names', async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const squadNames = screen.getAllByTestId("inputSquadName");
        expect(squadNames).toHaveLength(2);
        expect(squadNames[1]).toHaveClass("is-invalid");
        expect(squadNames[1]).toHaveValue(mockSquads[1].squad_name);
      })
      it("render 2nd squad name errors", async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const nameErrors = screen.queryAllByTestId("dangerSquadName");
        expect(nameErrors).toHaveLength(2);
        expect(nameErrors[1]).toHaveTextContent("test name error");
      });
      it('render squad games', async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const squadGames = screen.getAllByTestId("inputSquadGames");
        expect(squadGames).toHaveLength(2);
        expect(squadGames[1]).toHaveClass("is-invalid");
        expect(squadGames[1]).toHaveValue(mockSquads[1].games);
      })
      it("render 2nd squad game errors", async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const nameErrors = screen.queryAllByTestId("dangerSquadGames");
        expect(nameErrors).toHaveLength(2);
        expect(nameErrors[1]).toHaveTextContent("test games error");
      });
      it('render squad events', async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const squadEvents = screen.getAllByTestId("inputSquadEvent");
        expect(squadEvents).toHaveLength(2);
        expect(squadEvents[1]).toHaveClass("is-invalid");
        expect(squadEvents[1]).toHaveValue(mockEvents[1].id);
      })
      it("render 2nd squad event errors", async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const eventErrors = screen.queryAllByTestId("dangerSquadEvent");
        expect(eventErrors).toHaveLength(2);
        expect(eventErrors[1]).toHaveTextContent("test event error");
      });
      it('render squad dates', async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const squadDates = screen.getAllByTestId("inputSquadDate");        
        expect(squadDates).toHaveLength(2);
        expect(squadDates[1]).toHaveClass("is-invalid");
        expect(squadDates[1]).toHaveValue(mockSquads[1].squad_date);
      })
      it("render 2nd squad date errors", async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const dateErrors = screen.queryAllByTestId("dangerSquadDate");
        expect(dateErrors).toHaveLength(2);
        expect(dateErrors[1]).toHaveTextContent("test date error");
      });
      it('render start times', async () => { 
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const squadTimes = screen.getAllByTestId("inputSquadTime");
        expect(squadTimes).toHaveLength(2);
        expect(squadTimes[1]).toHaveClass("is-invalid");
        expect(squadTimes[1]).toHaveValue(mockSquads[1].squad_time);
      })
      it("render 2nd squad date errors", async () => {
        const user = userEvent.setup();
        render(<OneToNSquads {...mockOneToNSquadsProps} />);
        const tabs = screen.getAllByRole("tab");
        await user.click(tabs[1]);
        const timeErrors = screen.queryAllByTestId("dangerSquadTime");
        expect(timeErrors).toHaveLength(2);
        expect(timeErrors[1]).toHaveTextContent("test time error");
      });
    })
  })

  describe('render just one squad', () => { 

    const mockSquad: squadType[] = [
      {
        ...mockSquads[0],
        squad_time: "",
      }
    ]
    const mockSquadProps = {
      squads: mockSquad,
      setSquads: mockSetSquads,
      events: mockEvents,
      setAcdnErr: mockSetAcdnErr,
    };
    
    it('render number of squads', () => { 
      render(<OneToNSquads {...mockSquadProps} />);
      const squadNum = screen.getByTestId("inputNumSquads") as HTMLInputElement;
      expect(squadNum).toBeInTheDocument();
      expect(squadNum.value).toBe("1");
      expect(squadNum).toBeDisabled();
    })
    it('render squad names', () => {
      render(<OneToNSquads {...mockSquadProps} />);
      const squadNames = screen.getAllByTestId("inputSquadName");
      expect(squadNames).toHaveLength(1);
      expect(squadNames[0]).toHaveValue(mockSquad[0].squad_name);
    })
    it('render start times', () => { 
      render(<OneToNSquads {...mockSquadProps} />);
      const squadTimes = screen.getAllByTestId("inputSquadTime");
      expect(squadTimes).toHaveLength(1);
      expect(squadTimes[0]).toHaveValue(mockSquad[0].squad_time);
      expect(squadTimes[0]).toHaveValue('');
    })
    it("render the tabs", async () => {
      const user = userEvent.setup();
      render(<OneToNSquads {...mockSquadProps} />);
      const tabs = screen.getAllByRole("tab");
      await user.click(tabs[0]); // focus on first tab
      expect(tabs).toHaveLength(1);
      expect(tabs[0]).toHaveTextContent(mockSquad[0].tab_title);
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });
  })

  describe("add squad", () => {
    beforeAll(() => {
      mockSquads.push({
        ...initSquad,
        id: "3",
        sort_order: 3,
        squad_name: "Trios",
        tab_title: "Trios",
      });
    });

    afterAll(() => {
      if (mockSquads.length === 3) mockSquads.pop();
    });

    it("test if added event has correct tab title", async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(<OneToNSquads {...mockOneToNSquadsProps} />);
      const addBtn = screen.getByText("Add");
      // ACT
      await user.click(addBtn);
      // ASSERT
      expect(mockOneToNSquadsProps.setSquads).toHaveBeenCalled();

      // ACT
      const tabs = screen.getAllByRole("tab");
      // ASSERT
      expect(tabs.length).toBe(3);
      expect(tabs[2]).toHaveTextContent("Trios");
    });
  })

  describe('delete squad', () => { 
    beforeAll(() => {
      mockSquads.push({
        ...initSquad,
        id: "3",
        sort_order: 3,
        squad_name: "Trios",
        tab_title: "Trios",
      });
    });

    afterAll(() => {
      if (mockSquads.length === 3) mockSquads.pop();
    });

    it('delete squad', async () => { 
      // ARRANGE
      const user = userEvent.setup();
      render(<OneToNSquads {...mockOneToNSquadsProps} />);
      // ACT
      const tabs = screen.getAllByRole("tab");
      // ARRANGE
      await user.click(tabs[2]);
      const delBtns = screen.getAllByText("Delete Squad");
      // ASSERT
      expect(delBtns.length).toBe(2);
      // ACT
      await user.click(delBtns[1]);
      // ASSERT
      expect(mockOneToNSquadsProps.setSquads).toHaveBeenCalled();      
    })
  })

})