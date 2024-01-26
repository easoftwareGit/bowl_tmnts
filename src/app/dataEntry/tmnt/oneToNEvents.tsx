import React, { ChangeEvent } from "react";
import { eventType } from "./types";
import { maxEventLength } from "@/lib/validation";

interface ChildProps {
  event: eventType;
  eventCount: number,
  onAddEvent: () => void;
  onDeleteEvent: (id: number) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const OneToNEvents: React.FC<ChildProps> = ({
  event,
  eventCount,
  onAddEvent,
  onDeleteEvent,
  onInputChange,
}) => {

  const AddOrDelButton = () => {    
    if (event.id === 1) {
      return (
        <div className="col-sm-3">
          <label htmlFor="inputNumEvents" className="form-label">
            # Events
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="inputNumEvents"
              name="num_objs"
              readOnly
              value={eventCount}
            />
            <button
              className="btn btn-success border border-start-0 rounded-end"
              type="button"
              tabIndex={-1}
              id="event-plus"
              onClick={onAddEvent}
            >
              +
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-sm-3 d-flex align-items-end">
          <button
            className="btn btn-danger"
            onClick={() => onDeleteEvent(event.id)}
          >
            Delete Event
          </button>
        </div>
      );
    }
  }

  return (
    <>
      <div className="row g-3 mb-3">
        {/*  AddOrDelButton has <div className="col-sm-3">...</div>  */}
        <AddOrDelButton />
        <div className="col-sm-3">
          <label htmlFor={`inputEventName${event.id}`} className="form-label">
            Event Name
          </label>
          <input
            type="text"
            className={`form-control ${event.name_err && "is-invalid"}`}
            id={`inputEventName${event.id}`}
            name="name"
            value={event.name}
            maxLength={maxEventLength}
            onChange={(e) => onInputChange(e)}            
          />  
          <div className="text-danger">{event.name_err}</div>
        </div>
        <div className="col-sm-3">
          <label htmlFor={`inputTeamSize${event.id}`} className="form-label"title="Singles = 1, Doubles = 2...">
            Team Size <span className="popup-help">&nbsp;?&nbsp;</span>
          </label>
          <input
            type="number"
            min={1}
            max={9}
            step={1}
            className={`form-control ${event.team_size_err && "is-invalid"}`}
            id={`inputTeamSize${event.id}`}
            name="team_size"
            value={event.team_size}
            onChange={(e) => onInputChange(e)}
          />
          <div className="text-danger">{event.team_size_err}</div>          
        </div>
        <div className="col-sm-3">
          <label htmlFor={`inputEventGames${event.id}`} className="form-label">
            Event Games
          </label>
          <input
            type="number"
            min={1}
            max={99}
            step={1}
            className={`form-control ${event.games_err && "is-invalid"}`}
            id={`inputEventGames${event.id}`}
            name="games"
            value={event.games}
            onChange={(e) => onInputChange(e)}
          />
          <div className="text-danger">{event.games_err}</div>          
        </div>
      </div>
    </>
  );
};

export default OneToNEvents;
