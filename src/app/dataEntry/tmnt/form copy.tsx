"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchBowls } from "@/redux/features/bowls/bowlsSlice";
import { maxTmntNameLength, maxEventLength } from "@/lib/validation";
import { Bowl } from "@prisma/client";
import { BowlsFromStateObj } from "@/lib/types/bowlTypes";
import "./form.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

export const TmntDataForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const todayStr = new Date().toISOString().split("T")[0];

  const initVals = {
    tmnt_name: "",
    bowl_id: "",
    start_date: todayStr,
    end_date: todayStr,
    event_name: "Singles",
    team_size: 1,
    event_games: 3,
    num_divs: 1,
  };
  const initErrors = {
    tmnt_name: "",
    bowl_id: "",
    start_date: "",
    end_date: "",
    event_name: "",
    team_size: "",
    event_games: "",    
  };
  
  const initDiv = [
    {
      id: 1,
      name: "Div 1",
      hdcp: 0,
      hdcp_from: 220,
      int_hdcp: true,
      hdcp_for: "game",
      name_err: "",
      hdcp_err: "",
      hdcp_from_err: "",      
    },
  ];

  const [divId, setDivId] = useState(1);
  const [formData, setFormData] = useState(initVals);
  const [formErrors, setFormErrors] = useState(initErrors);
  const [divsData, setDivsData] = useState(initDiv);

  useEffect(() => {
    dispatch(fetchBowls());
  }, [dispatch]);

  const stateBowls = useSelector((state: RootState) => state.bowls);

  let bowlsArr: Bowl[] = [];
  if (!stateBowls.loading && stateBowls.error === "") {
    const bowlsFromState = stateBowls.bowls as unknown as BowlsFromStateObj;
    if (
      Array.isArray(bowlsFromState.bowls) &&
      bowlsFromState.bowls.length > 0
    ) {
      bowlsArr = bowlsFromState.bowls;
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {    
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
    if (name === "start_date") {
      const endDateInput = document.getElementById(
        "inputEndDate"
      ) as HTMLInputElement;
      if (endDateInput && endDateInput.value === "") {
        const endDate = new Date(value);
        const dateStr = endDate.toISOString().split("T")[0];
        setFormData({
          ...formData,
          start_date: dateStr,
          end_date: dateStr,
        });
        setFormErrors({
          ...formErrors,
          start_date: "",
          end_date: "",
        });
        endDateInput.value = dateStr;
        console.log(dateStr);
      }
    }
  };

  const handleAddDivClick = (e: any) => {
    setFormData({
      ...formData,
      num_divs: formData.num_divs + 1
    });
    const newDiv = {      
        id: divId + 1,
        name: "Div " + (divId + 1),
        hdcp: 0,
        hdcp_from: 220,
        int_hdcp: true,
        hdcp_for: "game",
        name_err: "",
        hdcp_err: "",
        hdcp_from_err: "",               
    }
    setDivId(divId + 1)
    setDivsData([...divsData, newDiv])
  }

  const handleDivInputChange = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = e.target;
      const errName = name + "_err";
      setDivsData(
        divsData.map((div) => {
          if (div.id === id) {              
            if (name === "item.int_hdcp") {
              return {
                ...div,
                int_hdcp: checked
              };
            } else if (name.startsWith('hdcp_for'))  {
              return {
                ...div,
                hdcp_for: value                
              };
            } else {
              return {
                ...div,
                [name]: value,
                [errName]: "",
              };
            }
          } else {
            return div;
          }
        })
      );
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      bowl_id: value,
    });
    setFormErrors({
      ...formErrors,
      bowl_id: "",
    });
  };

  const handleDebug = (e: any) => {
    divsData.forEach((item) => {
      console.log('div: ', item)  
    })
  }

  const handleSubmit = (e: any) => {
    console.log('Submitted')  
  }


  return (
    <form onSubmit={handleSubmit}>
      {stateBowls.loading && <div>Loading...</div>}
      {!stateBowls.loading && stateBowls.error ? (
        <div>Error: {stateBowls.error}</div>
      ) : null}

      {!stateBowls.loading && stateBowls.bowls ? (
        <div className="form_container">
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="inputTmntName" className="form-label">
                Tournament Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.tmnt_name && "is-invalid"
                }`}
                id="inputTmntName"
                name="tmnt_name"
                value={formData.tmnt_name}
                maxLength={maxTmntNameLength}
                onChange={handleInputChange}
              />
              <div className="text-danger">{formErrors.tmnt_name}</div>
            </div>
            <div className="col-md-6">
              <label htmlFor="inputTmntName" className="form-label">
                Bowl Name
              </label>
              <select
                id="inputBowlName"
                className={`form-select ${formErrors.bowl_id && "is-invalid"}`}
                onChange={handleSelectChange}
              >
                <option disabled selected>
                  Choose...
                </option>
                {bowlsArr.length > 0 &&
                  bowlsArr.map((bowl) => (
                    <option key={bowl.id} value={bowl.id}>
                      {bowl.bowl_name} - {bowl.city}, {bowl.state}
                    </option>
                  ))}
              </select>
              <div className="text-danger">{formErrors.bowl_id}</div>
            </div>
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <label htmlFor="inputStartDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  formErrors.start_date && "is-invalid"
                }`}
                id="inputStartDate"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
              />
              <div className="text-danger">{formErrors.start_date}</div>
            </div>
            <div className="col-md-3">
              <label htmlFor="inputStartDate" className="form-label">
                End Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  formErrors.end_date && "is-invalid"
                }`}
                id="inputEndDate"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
              <div className="text-danger">{formErrors.end_date}</div>
            </div>
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="inputEventName" className="form-label">
                Event
              </label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.event_name && "is-invalid"
                }`}
                id="inputEventName"
                name="event_name"
                value={formData.event_name}
                maxLength={maxTmntNameLength}
                onChange={handleInputChange}
              />
              <div className="text-danger">{formErrors.event_name}</div>
            </div>
            <div className="col-sm-3">
              <label
                htmlFor="inputTeamSize"
                className="form-label"
                title="Singles = 1, Doubles = 2..."
              >
                Team Size <span className="popup-help">&nbsp;?&nbsp;</span>
              </label>
              <input
                type="number"
                min={1}
                max={9}
                step={1}
                className={`form-control ${formErrors.team_size && "is-invalid"}`}
                id="inputTeamSize"
                name="team_size"
                value={formData.team_size}
                onChange={handleInputChange}
              />
              <div className="text-danger">{formErrors.team_size}</div>
            </div>
            <div className="col-sm-3">
              <label htmlFor="inputEventGames" className="form-label">
                Event Games
              </label>
              <input
                type="number"
                min={1}
                max={99}
                step={1}
                className={`form-control ${
                  formErrors.event_games && "is-invalid"
                }`}
                id="inputEventGames"
                name="event_games"
                value={formData.event_games}
                onChange={handleInputChange}
              />
              <div className="text-danger">{formErrors.event_games}</div>
            </div>
          </div>
          <div className="row g-3 mb-3">
            <Tabs defaultActiveKey="div0" transition={false} id="divisionTabs">
              <Tab eventKey="div0" title="Divisions">
                <div className="col-sm-3">
                  <label htmlFor="inputNumDivs" className="form-label">
                    # Divisions
                  </label>
                  <div className="input-group">
                    <input
                      type="text"   
                      className="form-control"
                      id="inputNumDivs"
                      name="num_divs"
                      readOnly
                      value={formData.num_divs}
                    />
                    <button
                      className="btn btn-success border border-start-0 rounded-end"
                      type="button"                  
                      tabIndex={-1}
                      id="div-plus"
                      onClick={handleAddDivClick}
                    >
                      +                      
                    </button>
                  </div>
                </div>
              </Tab>
              {divsData.map((item) => (
                <Tab key={item.id} eventKey={`div${item.id}`} title={item.name}>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-3">
                      <label htmlFor={`inputDivName${item.id}`} className="form-label">
                        Div Name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${item.name_err && "is-invalid"}`}
                        id={`inputDivName${item.id}`}
                        name="name"
                        value={item.name}
                        maxLength={maxEventLength}
                        onChange={handleDivInputChange(item.id)}                        
                      />
                      <div className="text-danger">{item.name_err}</div>
                    </div>
                    <div className="col-sm-3">
                      <label
                        htmlFor={`inputHdcp${item.id}`}
                        className="form-label"
                        title="0 for scratch"
                      >
                        Hdcp % <span className="popup-help">&nbsp;?&nbsp;</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={110}
                        step={10}        
                        className={`form-control ${item.hdcp_err && "is-invalid"}`}
                        id={`inputHdcp${item.id}`}
                        name="hdcp"
                        value={item.hdcp}                        
                        onChange={handleDivInputChange(item.id)}
                      />
                      <div className="text-danger">{item.hdcp_err}</div>
                    </div>
                    <div className="col-sm-3">
                      <label htmlFor={`inputHdcpFrom${item.id}`} className="form-label">
                        Hdcp From
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={300}
                        step={10}        
                        className={`form-control ${item.hdcp_err && "is-invalid"}`}
                        id={`inputHdcpFrom${item.id}`}
                        name="hdcp_from"
                        value={item.hdcp_from}                        
                        onChange={handleDivInputChange(item.id)}
                      />
                      <div className="text-danger">{item.hdcp_from_err}</div>
                    </div>
                    <div className="col-sm-3">
                      <button className="btn btn-danger" onClick={handleDebug}>
                        Debug
                      </button>
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`inputIntHdcp${item.id}`}                        
                        name='item.int_hdcp'
                        checked={item.int_hdcp}
                        onChange={handleDivInputChange(item.id)}
                      />
                      <label htmlFor={`inputIntHdcp${item.id}`} className="form-label">
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
                        id={`radioHdcpForGame${item.id}`}
                        name={`hdcp_for${item.id}`}
                        value="game"
                        checked={item.hdcp_for === 'game'}
                        onChange={handleDivInputChange(item.id)}
                      />
                      <label htmlFor={`radioHdcpForGame${item.id}`} className="form-check-label">
                        &nbsp;Game &nbsp; 
                      </label>
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`radioHdcpForSeries${item.id}`}
                        name={`hdcp_for${item.id}`}
                        value="series"
                        checked={item.hdcp_for !== 'game'}
                        onChange={handleDivInputChange(item.id)}
                      />
                      <label htmlFor={`radioHdcpForSeries${item.id}`} className="form-check-label">
                        &nbsp;Series
                      </label>
                    </div>
                  </div>
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
      ) : null}
    </form>
  );
};
