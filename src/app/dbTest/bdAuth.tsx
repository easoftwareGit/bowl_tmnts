import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { baseApi } from "@/lib/tools";
import { userType } from "@/lib/types/types";
import { initUser } from "@/db/initVals";
import { useSession } from "next-auth/react"; 

const authUrl = baseApi + "/auth/register"
const loginUrl = baseApi + "/auth/login"
const usersUrl = baseApi + "/users";

let passed = true;
let allResults = '';

export const DbAuth = () => {
  
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/user';
  const { status, data } = useSession();  

  const [authCrud, setAuthCrud] = React.useState("register");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
  }, [results]);

  const userToLogin = {
    ...initUser,
    email: "test@email.com",
    password: "Test123!",
    first_name: "Test",
    last_name: "Last",
    phone: "+18005551212",
  }

  const currentUser = {
    ...initUser,      
    id: 'usr_5bcefb5d314fff1ff5da6521a2fa7bde',
    email: "adam@email.com",
    password: "Test123!",
    first_name: "Adam",
    last_name: "Smith",
    phone: "+18005551212",
    role: 'ADMIN',  
  }

  const addToResults = (newText: string, pass: boolean = true): string => { 
    if (pass) {
      newText = '🟢' + newText;
    } else {
      newText = '🔴' + newText; 
      passed = false;
    }
    allResults += newText + '\n'
    return newText + '\n'    
  }

  const userDelete = async (userId: string) => {
    let testResults = results;
    const userDelUrl = usersUrl +'/' + userId
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: userDelUrl,
      });
      if (response.status !== 200) {
        testResults += addToResults('False: could not delete registered user', false)
        setResults(testResults)
        return {
          error: 'Could not delete registered user',
          status: 404,
        };
      }      
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };
    } 
  };

  const readAllUsers = async () => {
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: usersUrl,
      });
      if (response.status === 200) { 
        return response.data.users;
      } else {
        return {
          error: 'Error reading users',
          status: 404,
        };
      }
    } catch (error: any) {
      return {
        error: error.message,
        status: 404,
      };      
    }
  }

  const removeRegisteredUser = async () => {
    let testResults = results;
    try {
      const allUsers: userType[] = await readAllUsers() as unknown as userType[]
      const justPostedUser = allUsers.filter(user => user.email === userToLogin.email);
      if (justPostedUser.length === 1) {
        userDelete(justPostedUser[0].id)
      }      
      return allUsers
    } catch (error: any) {
      testResults += addToResults(`Remove Registered Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };      
    }
  }

  const authRegister = async () => {
    let testResults: string = results;    
    let createdUserId: string = '';
    passed = true;

    try {      
      const userJSON = JSON.stringify(userToLogin);
      const response = await axios({
        method: "post",
        data: userJSON,
        withCredentials: true,
        url: authUrl,
      });
      if (response.status === 201) {
        testResults += addToResults(`Success: Registered User: ${response.data.user.email}`);        
        const logedInUser: userType = response.data.user;
        if (logedInUser.first_name !== userToLogin.first_name) {
          testResults += addToResults('Created user first_name !== mockPostUser.first_name', false)
        } else if (logedInUser.last_name !== userToLogin.last_name) {
          testResults += addToResults('Created user last_name !== mockPostUser.last_name', false)
        } else if (logedInUser.email !== userToLogin.email) {
          testResults += addToResults('Created user email !== mockPostUser.email', false)
        } else if (logedInUser.phone !== userToLogin.phone) {
          testResults += addToResults('Created user phone !== mockPostUser.phone', false)
        } else if (logedInUser.role !== userToLogin.role) {
          testResults += addToResults('Created user role !== mockPostUser.role', false)
        } else {
          testResults += addToResults(`Created User === mockPostUser`)
        }        
        createdUserId = response.data.user.id;                       
      } else {
        testResults += addToResults(`Error logging in user: ${userToLogin.email}`, false)
        // setResults(testResults)
        return {
          error: 'Did not login user',
          status: response.status,
        };  
      }

      // test registering user with a duplicate email
      try {
        const invalidUserJson = JSON.stringify(currentUser);        
        const iuResponse = await axios({
          method: "post",
          data: invalidUserJson,
          withCredentials: true,
          url: authUrl,
        });
      } catch (error: any) {
        if (error.response.status === 409) {
          testResults += addToResults('Did not add user with duplicate email')          
        } else {
          testResults += addToResults(`Error registering user with duplicate email: ${error.message}`, false)
          // setResults(testResults)
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      
      // setResults(testResults)
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Register Error: ${error.message}`);
      // setResults(testResults)
      return {
        error: error.message,
        status: 500,
      };      
    } finally {
      if (createdUserId) {
        const deletedUser = await userDelete(createdUserId);        
      }
      if (passed) {
        testResults += addToResults(`Registered tests: PASSED`, true);
      } else {
        testResults += addToResults(`Registered tests: FAILED`, false);
      }
      setResults(testResults) 
    }
  }

  const authLogin = async () => {
    let testResults = results;
    let loggedIn = false;
    passed = true;

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: currentUser.email,
        password: currentUser.password,
        callbackUrl,
      });
      if (!response?.error) {
        // testResults += addToResults(`Success: Logged In: ${currentUser.email}`);                
        testResults += addToResults(`Success: Logged In: ${data?.user?.name}`);
        loggedIn = true;
      } else {
        testResults += addToResults(`Error logging in user: ${userToLogin.email}`, false)
        // setResults(testResults)
        return {
          error: 'Did not login user',
          status: response.status,
        };  
      }

      // setResults(testResults)
      return response;
    } catch (error: any) {
      // setResults(`Error: ${error.message}`);
      return {
        error: error.message,
        status: 500,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Log In tests: PASSED`, true);
      } else {
        testResults += addToResults(`Log In tests: FAILED`, false);
      }
      setResults(testResults) 
    }
  }

  const authLogout = () => {
    let testResults = results;
    passed = true;

    try {
      if (status === "authenticated") {
        signOut();
        testResults += addToResults('Logged Out')
      } else {
        testResults += addToResults('Not Logged Out, was not loggin in', false)
      }      
    } catch (error: any) {
      testResults += addToResults(`Error logging out: ${error.message}`, false)
    } finally {
      if (passed) {
        testResults += addToResults(`Log Out tests: PASSED`, true);
      } else {
        testResults += addToResults(`Log Out tests: FAILED`, false);
      }
      setResults(testResults) 
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
      case "logout":
        authLogout();
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
    let testResults = results;
    try {
      await removeRegisteredUser();

      if (status === "authenticated") {
        signOut();
      }
      
      testResults += addToResults('Reset Auth')
      setResults(testResults)
    } catch (error: any) {
      testResults += addToResults(`Reset Error: ${error.message}`);
      setResults(testResults)
      return {
        error: error.message,
        status: 500,
      };      
    }
  };

  return (
    <>      
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
        <div className="col-sm-2">
          <label htmlFor="authLogout" className="form-check-label">
            &nbsp;Log Out &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="authLogout"
            name="auth"
            value="logout"
            checked={authCrud === "logout"}
            onChange={handleAuthCrudChange}            
          />
        </div>

      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            name="multiLineResults"               
            rows={10}            
            value={results}            
            readOnly={true}
          >            
          </textarea>
        </div>
      </div>      
    </>
  );
}