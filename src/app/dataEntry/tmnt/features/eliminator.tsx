import React, { ChangeEvent }  from 'react'
import { elimType } from '../types';
import EaCurrencyInput from '@/components/currency/eaCurrencyInput';
import { maxGames } from "@/lib/validation";

interface ChildProps {
  elim: elimType;
  setElim: (elim: elimType) => void;  
}

const Eliminator: React.FC<ChildProps> = ({  
  elim,
  setElim
}) => {

  const handleElimFeeAmountChange = (value: string | undefined): void => { 
    let rawValue = value === undefined ? 'undefined' : value;
    rawValue = (rawValue || ' ');
    if (rawValue && Number.isNaN(Number(rawValue))) {
      rawValue = ''
    } 
    setElim({
      ...elim,
      fee: rawValue,
      fee_err: ''
    })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target;
    const nameErr = name + "_err";

    setElim({
      ...elim,
      [name]: value,
      [nameErr]: '',
    })
  }

  return (
    <div className="row">
      <div className="col-sm-3">
        <label htmlFor="inputElimFee" className="form-label">
          Fee
        </label>
        <EaCurrencyInput
          id="inputElimFee"
          name="fee"                              
          className={`form-control ${elim.fee_err && "is-invalid"}`}
          onValueChange={handleElimFeeAmountChange}
          value={elim.fee}
        />
        <div className="text-danger">{elim.fee_err}</div>
      </div>
      <div className="col-sm-3">
        <label htmlFor="inputElimGames" className="form-label">
          Games
        </label>
        <input
          type="number"
          id="inputElimGames"
          name="games"                              
          placeholder="3"
          min={1}
          max={maxGames}
          step={1}                              
          className={`form-control ${elim.games_err && "is-invalid"}`}
          onChange={handleInputChange}
          value={elim.games}
        />
        <div className="text-danger">{elim.games_err}</div> 
      </div>
      <div className="col-sm-3">
        <label
          htmlFor="inputElimStart"
          className="form-label"
          title='The game(s) the eliminator(s) will start, seperated by commas: 1,4'
        >
          Starting <span className="popup-help">&nbsp;?&nbsp;</span>
        </label>
        <input
          type="text"
          id="inputElimStart"
          name="start"          
          placeholder="#,#"                              
          className={`form-control ${elim.start_err && "is-invalid"}`}                              
          onChange={handleInputChange}
          value={elim.start}
        />
        <div className="text-danger">{elim.start_err}</div>
      </div>
    </div>

  )
}

export default Eliminator