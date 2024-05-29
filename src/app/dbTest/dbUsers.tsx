import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { userType } from "@/lib/types/types";
import { initUser } from "@/db/initVals";

const url = baseApi + "/users";
const userId = "usr_5bcefb5d314fff1ff5da6521a2fa7bde";
const userIdUrl = url + "/" + userId;
// const userToDelId = "usr_07de11929565179487c7a04759ff9866";
const invalidUrl = url + "/invalid";
let passed = true;
let allResults = '';

export const DbUsers = () => {
  const [userCrud, setUserCrud] = React.useState("create");
  const [results, setResults] = React.useState("");  

  // let testResults: string = '';

  useEffect(() => {
    setResults(results);
  }, [results]);

  const userToPost: userType = {
    ...initUser,
    id: '',
    email: "test@email.com",
    password: "Test123!",
    first_name: "Test",
    last_name: "Last",
    phone: "+18005551212",    
  }
  
  const userToUpdate: userType = {
    ...initUser,
    id: 'usr_5bcefb5d314fff1ff5da6521a2fa7bde',
    email: "adam@email.com",
    password: "Test123!",
    first_name: "Adam",
    last_name: "Smith",
    phone: "+18005551212",
    role: 'ADMIN',
  }

  const userToDel: userType = {
    ...initUser,
    id: "usr_07de11929565179487c7a04759ff9866",
    email: "fred@email.com",
    password: "Test123!",
    first_name: "Fred",
    last_name: "Green",
    phone: "+18005554321",
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

  const removeCreatedUser = async (showResults: boolean) => {
    let testResults = results;
    try {
      const allUsers: userType[] = await userReadAll(false) as unknown as userType[]
      const justPostedUser = allUsers.filter(user => user.email === userToPost.email);
      if (justPostedUser.length === 1) {
        userDelete(justPostedUser[0].id, false)
        if (showResults) {
          testResults += addToResults(`Reset Created User: ${justPostedUser[0].email}`);
        }        
      }      
      return allUsers
    } catch (error: any) {
      testResults += addToResults(`Remove Created Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };      
    }
  }

  const resetUserToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: userToUpdate,
        withCredentials: true,
        url: userIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Reset User: ${response.data.user.email}`);
          setResults(testResults)
        }
        return response.data;
      } else {
        testResults += addToResults(`Error resetting: status: ${response.status}`, false);
        setResults(testResults)
        return {
          error: 'Error re-setting',
          status: response.status,
        };  
      }
    } catch (error: any) {
      testResults += addToResults(`Reset Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };
    }
  }

  const reAddDeletedUser = async (showResults: boolean) => {
    let testResults = results;    
    try {
      const delUserUrl = url +'/' + userToDel.id
      let response = await axios({
        method: "get",
        withCredentials: true,
        url: delUserUrl,
      });
      if (response.status === 200 && (response.data.user || response.data.users?.length > 0)) {       
        return {
          data: userToDel,
          status: 201
        }
      }
      const reAddUser = {
        ...userToDel,
      }
      reAddUser.id = nextPostSecret + reAddUser.id;
      const userJSON = JSON.stringify(reAddUser);
      response = await axios({
        method: "post",
        data: userJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: userToDel,
          status: 201
        }
      } else {
        return {
          error: 'Error re-adding',
          status: response.status
        }
      }
    } catch (error: any) {
      testResults += addToResults(`ReAdd Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };
    }
  }

  const userCreate = async () => {
    let testResults: string = results;
    let createdUserId: string = '';
    try {      
      const userJSON = JSON.stringify(userToPost);
      const response = await axios({
        method: "post",
        data: userJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        testResults += addToResults(`Created User: ${response.data.user.email}`)
        const postedUser: userType = response.data.user;
        if (postedUser.first_name !== userToPost.first_name) {
          testResults += addToResults('Created user first_name !== mockPostUser.first_name', false)
        } else if (postedUser.last_name !== userToPost.last_name) {
          testResults += addToResults('Created user last_name !== mockPostUser.last_name', false)
        } else if (postedUser.email !== userToPost.email) {
          testResults += addToResults('Created user email !== mockPostUser.email', false)
        } else if (postedUser.phone !== userToPost.phone) {
          testResults += addToResults('Created user phone !== mockPostUser.phone', false)
        } else if (postedUser.role !== userToPost.role) {
          testResults += addToResults('Created user role !== mockPostUser.role', false)
        } else {
          testResults += addToResults(`Created User === mockPostUser`)
        }
        createdUserId = response.data.user.id;
        setResults(testResults)        
        return response.data;
      } else {
        testResults += addToResults(`Error creating user: ${userToPost.email}, response statue: ${response.status}`, false);        
        setResults(testResults)
        return {
          error: 'Did not create user',
          status: response.status,
        };  
      }
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false)      
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdUserId) {
        await userDelete(createdUserId, false)
      }
    }
  };

  const userReadAll = async (showResults: boolean) => {    
    let testResults = results;
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: url,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Success: Read ${response.data.users.length} Users`, true);
          setResults(testResults)        
        }
        const allUsers: userType[] = response.data.users as unknown as userType[]
        const justPostedUser = allUsers.filter(user => user.email === userToPost.email);

        // 5 users in /prisma/seeds.ts
        if (justPostedUser.length === 1) { 
          // created a test user BEFORE testing read all
          if (allUsers.length === 6) { 
            testResults += addToResults(`Read all 6 users`, true);
          } else {
            testResults += addToResults(`Error: Read ${allUsers.length} users, expected 6`, false);
          }
        } else {
          // test user not created yet
          if (allUsers.length === 5) {
            testResults += addToResults(`Read all 5 users`, true);
          } else {
            testResults += addToResults(`Error: Read ${allUsers.length} users, expected 5`, false);
          }          
        }
        return response.data.users;
      } else {
        testResults += addToResults(`Error reading all users, response statue: ${response.status}`, false);        
        setResults(testResults)
        return {
          error: 'Did not read all users',
          status: response.status,
        };  
      }
    } catch (error: any) {
      testResults += addToResults(`Read All Error: ${error.message}`, false);
      setResults(testResults)      
      return {
        error: error.message,
        status: 404,
      };
    }
  };

  const userRead1 = async () => {
    let testResults = results;
    const testUser: userType = {
      ...userToUpdate,
    }
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: userIdUrl,
      });
      if (response.status === 200) {        
        testResults += addToResults(`Success: Read ${response.data.user.email}`, true);        
        const readUser: userType = response.data.user;
        if (readUser.first_name !== testUser.first_name) {
          testResults += addToResults('Read user first_name !== testUser.first_name', false)
        } else if (readUser.last_name !== testUser.last_name) {
          testResults += addToResults('Read user last_name !== testUser.last_name', false)
        } else if (readUser.email !== testUser.email) {
          testResults += addToResults('Read user email !== testUser.email', false)
        } else if (readUser.phone !== testUser.phone) {
          testResults += addToResults('Read user phone !== testUser.phone', false)
        } else if (readUser.role !== testUser.role) {
          testResults += addToResults('Read user role !== testUser.role', false)
        } else {
          testResults += addToResults(`Read User === testUser`)
        }
        setResults(testResults)
        return response.data;        
      } else {
        testResults += addToResults(`Error reading user, response statue: ${response.status}`, false);        
        setResults(testResults)
        return {
          error: 'Did not read user',
          status: response.status,
        };
      }
    } catch (error: any) {
      testResults += addToResults(`Read 1 Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
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
    let testResults = results;
    try {
      // 1) valid full user object
      const updated = await userUpdateValid();
      if (updated.status !== 200) {
        testResults += addToResults(`Error: ${updated.message}`, false);
        setResults(testResults);
        return updated;
      }
      testResults += addToResults(`Updated User: ${updated.data.user.email}`);
      // 2) invalid user id
      const notUpdated = await userUpdateInvalidUrl();
      if (notUpdated.status === 200) {
        setResults(`Error: updated invalid url`);
        return notUpdated;
      }
      testResults += addToResults(`Update: Returned error if invalid url`);
      setResults(testResults);      
      return updated;
    } catch (error: any) {
      testResults += addToResults(`Update Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };  
    } finally {
      const reset = await resetUserToUpdate(false);
    }
  };

  const userPatch = async () => {

    let testResults = results;
    const doPatchUser = async (propetyName: string, value: any, matchValue: any) => {
      try {
        const userJSON = JSON.stringify({
          ...userToUpdate,
          [propetyName]: value,
        })
        const response = await axios({
          method: "patch",
          data: userJSON,
          withCredentials: true,
          url: userIdUrl,
        })
        if (response.status === 200) {
          testResults += addToResults(`Patched User: ${userToUpdate.email} - just ${propetyName}`)
          if (response.data.user[propetyName] === matchValue) {
            testResults += addToResults(`Patched User ${propetyName}`)
          } else {
            testResults += addToResults(`DID NOT Patch user ${propetyName}`, false)
            setResults(testResults)
          }
          return {
            data: response.data.user,
            status: response.status
          };
        } else {
          testResults += addToResults(`Patch Error: ${propetyName}`, false)
          setResults(testResults)
          return {
            error: `Error Patching ${propetyName}`,
            status: response.status,
          };
        }
      } catch (error: any) {
        testResults += addToResults(`doPatchUser Error: ${error.message}`, false);
        setResults(testResults)
        return {
          error: error.message,
          status: 404,
        };
      } finally {
        const reset = await resetUserToUpdate(false);
      }
    }

    const doNotPatchUser = async (propetyName: string, value: any) => {       
      try {
        const userJSON = JSON.stringify({
          ...userToUpdate,
          email: "updatedemail.com",
        })
        const response = await axios({
          method: "patch",
          data: userJSON,
          withCredentials: true,
          url: userIdUrl,
        })      
        if (response.status !== 422) {
          testResults += addToResults(`Patch Error: did not return 422 for invalid ${propetyName}`, false)
          setResults(testResults)        
          return {
            error: 'Error Patching email',
            status: response.status,
          };          
        } else {
          testResults += addToResults(`Patch User, non 422 response for user: ${userToUpdate.email} - invalid ${propetyName}`)
          return {
            error: 'Error Patching email',
            status: response.status,
          };          
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Patch User: ${userToUpdate.email} - invalid ${propetyName}`)          
        } else {
          testResults += addToResults(`Patch Error: did not return 422 for invalid ${propetyName}`, false)
          setResults(testResults)        
          return {
            error: `Error Patching ${propetyName}`,
            status: error.response.status,
          };          
        }
      }    
    }

    try {      
      await doPatchUser('email', 'updated@email.com', 'updated@email.com')
      await doNotPatchUser('email', 'updatedemail.com')

      await doPatchUser('phone', '800-123-4567', '+18001234567')
      await doNotPatchUser('phone', '123')

      await doPatchUser('first_name', ' Jane *', 'Jane')
      await doNotPatchUser('first_name', '<script>alert(1)</script>')
      
      let userJSON = JSON.stringify({
        ...userToUpdate,
        password: "4321Test!",
      })
      let response = await axios({
        method: "patch",
        data: userJSON,
        withCredentials: true,
        url: userIdUrl,
      })      
      const oldPasswordhash = '$2b$10$pnUACjuOfrOqWMUJQLVTUeiqL3/wE4PdHLYaBmBdMxuO9zTVE8CwW'
      if (response.status === 200) {
        testResults += addToResults(`Patched User: ${response.data.user.email} - just password`)
        if (response.data.user.password_hash !== oldPasswordhash) {
          testResults += addToResults(`Patched User password`)
        } else {
          testResults += addToResults('Patched User password not patched', false)
          setResults(testResults)
          return response.data;
        }
      } else {
        testResults += addToResults('Patch Error: password', false)
        setResults(testResults)        
        return {
          error: 'Error Patching password',
          status: response.status,
        };          
      }
      
      await doNotPatchUser('password', '123')

      // invalid URL test
      try {
        let invalidTestUserJSON = JSON.stringify({
          ...userToUpdate,        
        })
        let invalidResponse = await axios({
          method: "patch",
          data: userJSON,
          withCredentials: true,
          url: invalidUrl,
        })      
        if (invalidResponse.status !== 404) {
          testResults += addToResults(`Patch Error: did not return 404 for invalid url`, false)
          setResults(testResults)        
          return {
            error: 'Error Patching with invalid url',
            status: response.status,
          };          
        } else {
          testResults += addToResults(`Patch User, non 404 response for user: ${userToUpdate.email} - invalid url`)
          return {
            error: 'Error Patching, non 404 response for invalid url',
            status: response.status,
          };          
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Patch User: ${userToUpdate.email} - invalid url`)          
        } else {
          testResults += addToResults(`Patch Error: did not return 404 for invalid url`, false)
          setResults(testResults)        
          return {
            error: `Error Patching, non 404 response for invalid url`,
            status: error.response.status,
          };          
        }        
      }
      
      setResults(testResults)
      return response.data;    
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };  
    } finally {
      const reset = await resetUserToUpdate(false);      
    }
  };

  const userDelete = async (userId: string, testing: boolean = true) => {
    let testResults = results;
    const userDelUrl = url +'/' + userId
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: userDelUrl,
      });
      if (response.status === 200) {
        // if userId !== userToDelId, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (userId === userToDel.id) {
          testResults += addToResults(`Success: Deleted User: ${response.data.deleted.email}`);
          setResults(testResults)
        }        
      } else {
        testResults += addToResults('False: could not delete user', false)
        setResults(testResults)
        return {
          error: 'Could not delete user',
          status: 404,
        };
      }

      if (testing) {
        // try to delete user that is parent to tmnt
        try {
          const cantDelUrl = url + '/' + userToUpdate.id
          const cantDelResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: cantDelUrl,
          })
          if (cantDelResponse.status === 409) {
            testResults += addToResults(`Did not not delete user: ${userToUpdate.email} with children`)
          } else {
            testResults += addToResults(`Error: Could not delete user: ${userToUpdate.email}`, false)
          }
        } catch (error: any) {
          if (error.response.status === 409) {
            testResults += addToResults(`Did not not delete user: ${userToUpdate.email} with children`)
          } else {
            testResults += addToResults(`Delete User Error: ${error.message}`, false);
            setResults(testResults)
            return {
              error: error.message,
              status: error.response.status,
            };
          }
        }
      }

      setResults(testResults)
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Error : ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reAdded: any = await reAddDeletedUser(false)
    }
  };

  const handleUserCrudChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    setUserCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();    
    setResults('');
  };

  const reasetAll = async () => { 
    let testResults: string = ''
    try {
      const reset = await resetUserToUpdate(false);      
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false)
        setResults(testResults)
        return;
      }

      const allUsers: any = await removeCreatedUser(true)
      if (allUsers.error) {
        testResults += addToResults(`Error Resetting: ${allUsers.error}`, false)
        setResults(testResults)
        return;
      }

      const reAdded: any = await reAddDeletedUser(false)
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false)
        setResults(testResults)
        return;
      }
      
      testResults += addToResults(`Reset Users`);;
      setResults(testResults);      
      return {
        users: allUsers,
        status: 200,
      }
    } catch (error: any) {
      testResults += addToResults(`Reset Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };  
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();   
    await reasetAll();
  };

  const handleUserTest = (e: React.FormEvent) => {
    e.preventDefault();
    switch (userCrud) {
      case "create":
        userCreate();
        break;
      case "read":
        userReadAll(true);
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
        userDelete(userToDel.id);
        break;
      default:
        break;
    }
  };

  const handleUserTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = 'Testing all...';    
    passed = true;
    try {
      await userCreate();    
      allResults = results;
      await userReadAll(true);
      allResults = results;
      await userRead1();
      allResults = results;
      await userUpdate();
      allResults = results;
      await userPatch();
      allResults = results;
      await userDelete(userToDel.id);      
      allResults = results;
    } catch (error: any) {
      allResults += addToResults(`Test All Error: ${error.message}`, false);
      setResults(allResults)
      return {
        error: error.message,
        status: 404,
      };  
      
    } finally {
      allResults = results;
      await reasetAll()
      allResults += addToResults(`Test All Complete`, passed);
      setResults(allResults)
    }
  };

  return (
    <>      
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
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="userTestAll"
            onClick={handleUserTestAll}
          >
            Test All
          </button>
        </div> */}
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
        <div className="col-sm-1"></div>
        {/* <div className="col-sm-11">{results}</div> */}
        <div className="col-sm-10">
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
};
