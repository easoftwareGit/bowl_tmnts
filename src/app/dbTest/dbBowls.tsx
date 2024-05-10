import React from "react";
import axios from "axios";
import { baseApi } from "@/lib/tools";

const url = baseApi + "/bowls";

export const DbBowls = () => {
  const [bowlCrud, setBowlCrud] = React.useState("readAll");
  const [results, setResults] = React.useState("");

  const bowlReadAll = async () => {
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: url,
      });
      if (response.status === 200) {
        setResults(`Success: Read ${response.data.data.length} Bowls`);
        return response.data;
      }
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
      return {
        error: error.message,
        status: 500,
      };      
    }
  }

  const handleBowlTest = (e: React.FormEvent) => {
    e.preventDefault();
    switch (bowlCrud) {
      case "readAll":
        bowlReadAll();
        break;
      default:
        break;      
    }
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleBowlCrudChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBowlCrud(e.target.value);
  };

  return (
    <>
      <hr/>
      <div className="row g-3 mb-3">
        <div className="col-sm-8">
          <h4>Bowls</h4>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-success"
            id="bowlTest"
            onClick={handleBowlTest}
          >
            Test
          </button>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-warning"
            id="userTest"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="bowlCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="bowlCreate"
            name="bowl"
            value="create"
            checked={bowlCrud === "create"}
            onChange={handleBowlCrudChange}
            disabled={true}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="bowlReadAll" className="form-check-label">
            &nbsp;Read All&nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="bowlReadAll"
            name="bowl"
            value="readAll"
            checked={bowlCrud === "readAll"}
            onChange={handleBowlCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="bowlUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="bowlUpdate"
            name="bowl"
            value="update"
            checked={bowlCrud === "update"}
            onChange={handleBowlCrudChange}
            disabled={true}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="bowlDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="bowlDelete"
            name="bowl"
            value="delete"
            checked={bowlCrud === "delete"}
            onChange={handleBowlCrudChange}
            disabled={true}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-1">Results:</div>
        <div className="col-sm-11">{results}</div>
      </div>
    </>
  );
};
