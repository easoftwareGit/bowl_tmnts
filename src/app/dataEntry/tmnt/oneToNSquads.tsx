import React, { ChangeEvent } from "react";
import { squadType } from "./types";
import { maxEventLength } from "@/lib/validation";

interface ChildProps {
  squad: squadType;
  squadCount: number,
  onAddSquad: () => void;
  onDeleteSquad: (id: number) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const OneToNSquads: React.FC<ChildProps> = ({
  squad,
  squadCount,
  onAddSquad,
  onDeleteSquad,
  onInputChange,
}) => { 

  const AddOrDelButton = () => {    
    if (squad.id === 1) {
      return (
        <div className="col-sm-3">
          <label htmlFor="inputNumSquads" className="form-label">
            # Squads
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="inputNumSquads"
              name="num_objs"
              readOnly
              value={squadCount}
            />
            <button
              className="btn btn-success border border-start-0 rounded-end"
              type="button"
              tabIndex={-1}
              id="event-plus"
              onClick={onAddSquad}
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
            onClick={() => onDeleteSquad(squad.id)}
          >
            Delete Squad
          </button>
        </div>
      );
    }
  }

  return (
    <>
      <div className="row g-3">
        {/*  AddOrDelButton has <div className="col-sm-3">...</div>  */}
        <AddOrDelButton />
        <div className="col-sm-4">
          <label htmlFor={`inputSquadName${squad.id}`} className="form-label">
            Squad Name
          </label>
          <input
            type="text"
            className={`form-control ${squad.name_err && "is-invalid"}`}
            id={`inputSquadName${squad.id}`}
            name="name"
            maxLength={maxEventLength}
            value={squad.name}
            onChange={(e) => onInputChange(e)}  
          />
          <div className="text-danger">{squad.name_err}</div>
        </div>
        <div className="col-sm-4">
          <label htmlFor={`inputSquadGames${squad.id}`} className="form-label">
            Squad Games
          </label>
          <input
            type="number"
            min={1}
            max={99}
            step={1}
            className={`form-control ${squad.games_err && "is-invalid"}`}
            id={`inputSquadGames${squad.id}`}
            name="games"
            value={squad.games}
            onChange={(e) => onInputChange(e)}
          />
          <div className="text-danger">{squad.games_err}</div>
        </div>
        <div className="col-sm-2"></div>
      </div>
      <div className="row g-3">
        {/* blank space under button */}
        <div className="col-sm-3"></div>
        <div className="col-sm-4">
          <label htmlFor={`inputSquadDate${squad.id}`} className="form-label" >
            Date 
          </label>
          <input
            type="date"
            className={`form-control ${squad.sqd_date_err && "is-invalid"}`}
            id={`inputSquadDate${squad.id}`}
            name="sqd_date"
            value={squad.sqd_date}
            onChange={(e) => onInputChange(e)}                 
          />
          <div className="text-danger">{squad.sqd_date_err}</div>
        </div>
        <div className="col-sm-4">
          <label htmlFor={`inputSquadTime${squad.id}`} className="form-label">
            Start Time
          </label>
          <input
            type="time"
            className={`form-control ${squad.sqd_time_err && "is-invalid"}`}
            id={`inputSquadTime${squad.id}`}
            name="sqd_time"
            value={squad.sqd_time}                        
            onChange={(e) => onInputChange(e)}
          />
          <div className="text-danger">{squad.sqd_time_err}</div>
        </div>
        <div className="col-sm-2"></div>
      </div>
    </>
  )
}

export default OneToNSquads;