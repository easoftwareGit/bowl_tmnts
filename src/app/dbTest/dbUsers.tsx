import React, { useEffect } from "react";
import axios from "axios";
import { baseApi } from "@/lib/tools";

const url = baseApi + "/users";
const userId = "usr_5bcefb5d314fff1ff5da6521a2fa7bde";
const userIdUrl = url + "/" + userId;
const userDelUrl = url + "/usr_07de11929565179487c7a04759ff9866";
const invalidUrl = url + "/invalid";

export const DbUsers = () => {
  const [userCrud, setUserCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
  }, [results]);

  const userCreate = async () => {
    try {
      const userJSON = JSON.stringify({
        email: "test@email.com",
        password: "Test123!",
        first_name: "Test",
        last_name: "Last",
        phone: "+18005551212",
      });
      const response = await axios({
        method: "post",
        data: userJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        setResults(`Success: Created User: ${response.data.user}`);
        return response.data;
      }
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
      return {
        error: error.message,
        status: 500,
      };
    }
  };

  const userReadAll = async () => {
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: url,
      });
      if (response.status === 200) {
        setResults(`Success: Read ${response.data.users.length} Users`);
        return response.data;
      }
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
      return {
        error: error.message,
        status: 500,
      };
    }
  };

  const userRead1 = async () => {
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: userIdUrl,
      });
      if (response.status === 200) {
        setResults(`Success: Read ${response.data.user.email}`);
        return response.data;
      }
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
      return {
        error: error.message,
        status: 500,
      };
    }
  };

  const userUpdateValid = async () => {
    try {
      const userJSON = JSON.stringify({
        email: "testing@email.com",
        password: "Test456!",
        first_name: "Jane",
        last_name: "Jones",
        phone: "+18001234567",
      });
      const response = await axios({
        method: "put",
        data: userJSON,
        withCredentials: true,
        url: userIdUrl,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  };

  const userUpdateInvalidUrl = async () => {
    try {
      const userJSON = JSON.stringify({
        email: "testing@email.com",
        password: "Test456!",
        first_name: "Jane",
        last_name: "Jones",
        phone: "+18001234567",
      });
      const response = await axios({
        method: "put",
        data: userJSON,
        withCredentials: true,
        url: invalidUrl,
      });
      if (response.status === 200) {
        return response;
      }
    } catch (error: any) {
      return error;
    }
  };

  const userUpdate = async () => {
    // test
    // 1) valid full user object
    // 2) invalid user id
    try {
      const updated = await userUpdateValid();
      if (updated.status !== 200) {
        setResults(`Error: ${updated.message}`);
        return updated;
      }
      const notUpdated = await userUpdateInvalidUrl();
      if (notUpdated.status === 200) {
        setResults(`Error: updated invalid url`);
        return notUpdated;
      }

      setResults(`Success: Only updated User: ${updated.data.user.email}`);
      return updated;
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
    }
  };

  const userPatch = async () => {
    // 1) just email - done
    // 2) just password - done
    // 3) just phone - done
    // 4) just first name - done
    // 5) just last name - done
    // 6) valid full user object - done
    // 7) invalid url
    try {
      const userJSON = JSON.stringify({
        email: "testing@email.com",
        password: 'Test456!',
        first_name: "Jane",
        last_name: "Jones",
        phone: "+18001234567",
      })
      const response = await axios({
        method: "patch",
        data: userJSON,
        withCredentials: true,
        url: userIdUrl,
      })      
      // const response = await axios({
      //   method: "put",
      //   data: userJSON,
      //   withCredentials: true,
      //   url: invalidUrl,
      // })
      if (response.status === 200) {
        setResults(`Success: Patched User: ${response.data.user.email}`)
        return response.data;
      }
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
    }
  };

  const userDelete = async () => {
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: userDelUrl,
      });
      if (response.status === 200) {
        setResults(`Success: Deleted User: ${response.data.deleted.email}`);
        return response.data;
      }
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
    }
  };

  const handleUserTest = (e: React.FormEvent) => {
    e.preventDefault();
    switch (userCrud) {
      case "create":
        userCreate();
        break;
      case "read":
        userReadAll();
        break;
      case "read1":
        userRead1();
        break;
      case "update":
        userUpdate();
        break;
      case "patch":
        userPatch();
        break;
      case "delete":
        userDelete();
        break;
      default:
        break;
    }
  };

  const handleUserCrudChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    setUserCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userJSON = JSON.stringify({
        email: "adam@email.com",
        password: "Test123!",
        first_name: "Adam",
        last_name: "Smith",
        phone: "+18005551212",
      });
      const response = await axios({
        method: "put",
        data: userJSON,
        withCredentials: true,
        url: userIdUrl,
      });
      if (response.status === 200) {
        setResults(`Success: Reset User: ${response.data.user.email}`);
        return response.data;
      }
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <hr />
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <h4>Users</h4>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-success"
            id="userTest"
            onClick={handleUserTest}
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
        <div className="col-sm-2">
          <button className="btn btn-info" id="userTest" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="userCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="userCreate"
            name="user"
            value="create"
            checked={userCrud === "create"}
            onChange={handleUserCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="userRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="userRead"
            name="user"
            value="read"
            checked={userCrud === "read"}
            onChange={handleUserCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="userRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="userRead1"
            name="user"
            value="read1"
            checked={userCrud === "read1"}
            onChange={handleUserCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="userUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="userUpdate"
            name="user"
            value="update"
            checked={userCrud === "update"}
            onChange={handleUserCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="userPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="userPatch"
            name="user"
            value="patch"
            checked={userCrud === "patch"}
            onChange={handleUserCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="userDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="userDelete"
            name="user"
            value="delete"
            checked={userCrud === "delete"}
            onChange={handleUserCrudChange}
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
