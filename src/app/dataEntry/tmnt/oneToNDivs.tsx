import React, { ChangeEvent } from "react";
import { divType } from "./types";
import { maxEventLength } from "@/lib/validation";

interface ChildProps {
  div: divType;
  divCount: number,
  onAddDiv: () => void;
  onDeleteDiv: (id: number) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onHdcpBlur: (e: ChangeEvent<HTMLInputElement>) => void;
}

const OneToNDivs: React.FC<ChildProps> = ({
  div,
  divCount,
  onAddDiv,
  onDeleteDiv,
  onInputChange,
  onHdcpBlur,
}) => { 

  const AddOrDelButton = () => {    
    if (div.id === 1) {
      return (
        <div className="col-sm-3">
          <label htmlFor="inputNumDivs" className="form-label">
            # Events
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="inputNumDivs"
              name="num_objs"
              readOnly
              value={divCount}
            />
            <button
              className="btn btn-success border border-start-0 rounded-end"
              type="button"
              tabIndex={-1}
              id="event-plus"
              onClick={onAddDiv}
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
            onClick={() => onDeleteDiv(div.id)}
          >
            Delete Div
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
          <label htmlFor={`inputDivName${div.id}`} className="form-label">
            Div Name
          </label>
          <input
            type="text"
            className={`form-control ${div.name_err && "is-invalid"}`}
            id={`inputDivName${div.id}`}
            name="name"
            maxLength={maxEventLength}
            value={div.name}
            onChange={(e) => onInputChange(e)}
          />
          <div className="text-danger">{div.name_err}</div>
        </div>
        <div className="col-sm-3">
          <label
            htmlFor={`inputHdcp${div.id}`}
            className="form-label"
            title="Enter Hdcp % 0 for scratch"
          >
            Hdcp % <span className="popup-help">&nbsp;?&nbsp;</span>
          </label>
          <input
            type="number"
            min={0}
            max={110}
            step={10}
            className={`form-control ${div.hdcp_err && "is-invalid"}`}
            id={`inputHdcp${div.id}`}
            name="hdcp"
            value={div.hdcp}
            onChange={(e) => onInputChange(e)}
            onBlur={(e) => onHdcpBlur(e)}            
          />
          <div className="text-danger">{div.hdcp_err}</div>
        </div>   
        <div className="col-sm-3">
          <label htmlFor={`inputHdcpFrom${div.id}`} className="form-label">
            Hdcp From
          </label>
          <input
            type="number"
            min={0}
            max={300}
            step={10}        
            className={`form-control ${div.hdcp_err && "is-invalid"}`}
            id={`inputHdcpFrom${div.id}`}
            name="hdcp_from"
            value={div.hdcp_from}                        
            onChange={(e) => onInputChange(e)}
            onBlur={(e) => onHdcpBlur(e)}            
          />
          <div className="text-danger">{div.hdcp_from_err}</div>
        </div>                    
      </div>
      <div className="row g-3 mb-3">
        {/* blank space under button */}
        <div className="col-sm-3"></div>
        <div className="col-sm-3">
          <input
            type="checkbox"
            className="form-check-input"
            id={`chkBoxIntHdcp${div.id}`}                        
            name='item.int_hdcp'
            checked={div.int_hdcp}
            onChange={(e) => onInputChange(e)}
          />
          <label htmlFor={`chkBoxIntHdcp${div.id}`} className="form-label">
            &nbsp;Integer Hdcp
          </label>
        </div>
        <div className="col-sm-6">
          <label className="form-label">
            Hdcp for &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id={`radioHdcpForGame${div.id}`}
            name={`hdcp_for${div.id}`}
            value="game"
            checked={div.hdcp_for === 'game'}
            onChange={(e) => onInputChange(e)}
          />
          <label htmlFor={`radioHdcpForGame${div.id}`} className="form-check-label">
            &nbsp;Game &nbsp; 
          </label>
          <input
            type="radio"
            className="form-check-input"
            id={`radioHdcpForSeries${div.id}`}
            name={`hdcp_for${div.id}`}
            value="series"
            checked={div.hdcp_for !== 'game'}
            onChange={(e) => onInputChange(e)}
          />
          <label htmlFor={`radioHdcpForSeries${div.id}`} className="form-check-label">
            &nbsp;Series
          </label>
        </div>
      </div>
    </>
  )
}

export default OneToNDivs;