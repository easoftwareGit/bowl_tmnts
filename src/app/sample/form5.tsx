"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { divType } from "../../lib/types/types";
import { tmntPropsType } from "../../lib/types/types";
import EaCurrencyInput, { EaPercentInput } from "@/components/currency/eaCurrencyInput";

interface FormProps {
  tmntProps: tmntPropsType;
}

export const Form5: React.FC<FormProps> = ({ tmntProps }) => {
  const {
    tmnt,
    setTmnt,
    events,
    setEvents,
    divs,
    setDivs,
    squads,
    setSquads,
    lanes,
    setLanes,
    pots,
    setPots,
    brkts,
    setBrkts,
    elims,
    setElims,
  } = tmntProps;

  const handleButtonCLick = () => {
    console.log("clicked");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDivs(
      divs.map((div) => {
        div.hdcp_per = Number(value) / 100
        return div;
      })
    );
  };

  const handleAmountValueChange = (id: string, name: string) => (value: string | undefined): void => {
    
    let rawValue = value === undefined ? 'undefined' : value;
    rawValue = (rawValue || ' ');
    setDivs(
      divs.map((div) => {
        if (rawValue && Number.isNaN(Number(rawValue))) {
          rawValue = ''
        } 
        const updatedDiv: divType = {
          ...div,
          [name]: rawValue,
        }
        if (name === 'hdcp_per_str') { 
          updatedDiv.hdcp_per = Number(rawValue) / 100
        } else if (name === 'div_name') {
          updatedDiv.div_name = rawValue
        }        
        return updatedDiv;
      })
    );
  };

  return (
    <>
      {divs.map((div) => (
        <div key={div.id}>
          <div className="row g-3 mb-3">
            <div className="col-sm-2">
              <label
                htmlFor={`currency`}
                className="form-label"
              >
                Entry Fee
              </label>
              <EaCurrencyInput
                id={`currency`}                  
                name="entry_fee"
                className={`form-control`}
                value={div.div_name}
                onValueChange={handleAmountValueChange(div.id, 'div_name')}
                // onBlur={handleBlur(event.id)}
              />
            </div> 

            <div className="col-md-3">
              <label className="form-label" htmlFor="hdcpPerUi">
                EA percent
              </label>
              <EaPercentInput
                id="hdcpPerUi"
                name="hdcp_per_str"
                className={`form-control`}
                value={div.hdcp_per_str}
                onValueChange={handleAmountValueChange(div.id, 'hdcp_per_str')}
              />
            </div>  
            <div className="col-sm-2 d-flex justify-content-center align-items-end">
              <button
                className="btn btn-success"
                onClick={() => handleButtonCLick()}
              >
                Click me
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
