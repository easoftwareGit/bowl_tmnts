import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { baseApi } from "@/lib/tools";
import { findUserByEmail } from "@/lib/db/users";

const authUrl = baseApi + "/auth/register"
const loginUrl = baseApi + "/auth/login"

export const DbAuth = () => {

  const router = useRouter()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/user';

  const [authCrud, setAuthCrud] = React.useState("register");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
  }, [results]);

  const authRegister = async () => {
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
        url: authUrl,
      });
      if (response.status === 201) {
        setResults(`Success: Registered User: ${response.data.user.email}`);
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

  const authLogin = async () => {
    try {
      const userJSON = JSON.stringify({
        email: "test@email.com",
        password: "Test123!",
      });
      const res = await signIn("credentials", {
        redirect: false,
        email: "test@email.com",
        password: "Test123!",
        callbackUrl,
      });
      if (!res?.error) {
        setResults(`Success: Logged In: "test@email.com"`);
      }
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
      return {
        error: error.message,
        status: 500,
      };    
    }
  }

  const handleAuthTest = (e: React.FormEvent) => { 
    e.preventDefault();
    switch (authCrud) {
      case "register":
        authRegister();
        break;
      case "login":
        authLogin();
        break;
      default:
        break;
    }
  }

  const handleAuthCrudChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    setAuthCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signOut();
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <hr />
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <h4>Auth</h4>
        </div>    
        <div className="col-sm-2">
          <button
            className="btn btn-success"
            id="userTest"
            onClick={handleAuthTest}
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
          <button
            className="btn btn-info"
            id="userTest"  
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="authRegister" className="form-check-label">
            &nbsp;Regsiter &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="authRegister"
            name="auth"
            value="register"
            checked={authCrud === "register"}
            onChange={handleAuthCrudChange}
          />
        </div>      
        <div className="col-sm-2">
          <label htmlFor="authLogin" className="form-check-label">
            &nbsp;Log In &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="authLogin"
            name="auth"
            value="login"
            checked={authCrud === "login"}
            onChange={handleAuthCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-1">Results:</div>
        <div className="col-sm-11">{results}</div>
      </div>
    </>
  );
}