import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, postSecret } from "@/lib/tools";
import { userType } from "@/lib/types/types";
import { initUser } from "@/db/initVals";

const url = baseApi + "/users";
const userId = "usr_5bcefb5d314fff1ff5da6521a2fa7bde";
const userIdUrl = url + "/" + userId;
let passed = true;
let allResults = "";

export const DbUsers = () => {
  const [userCrud, setUserCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
    // force textare to scroll to bottom
    var textarea = document.getElementById("userResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const userToPost: userType = {
    ...initUser,
    id: "",
    email: "test@email.com",
    password: "Test123!",
    first_name: "Test",
    last_name: "Last",
    phone: "+18005551212",
  };

  const userToUpdate: userType = {
    ...initUser,
    id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
    email: "adam@email.com",
    password: "Test123!",
    first_name: "Adam",
    last_name: "Smith",
    phone: "+18005551212",
    role: "ADMIN",
  };

  const userUpdatedTo: userType = {
    ...initUser,
    email: "testing@email.com",
    password: "Test456!",
    first_name: "Jane",
    last_name: "Jones",
    phone: "+18001234567",
  };

  const userToDel: userType = {
    ...initUser,
    id: "usr_07de11929565179487c7a04759ff9866",
    email: "fred@email.com",
    password: "Test123!",
    first_name: "Fred",
    last_name: "Green",
    phone: "+18005554321",
  };

  const addToResults = (newText: string, pass: boolean = true): string => {
    if (pass) {
      newText = "🟢" + newText;
    } else {
      newText = "🔴" + newText;
      passed = false;
    }
    allResults += newText + "\n";
    return newText + "\n";
  };

  const removeCreatedUser = async (showResults: boolean) => {
    let testResults = results;
    try {
      const allUsers: userType[] = (await userReadAll(false)) as unknown as userType[];
      const justPostedUser = allUsers.filter((user) => user.email === userToPost.email);
      if (justPostedUser.length === 1) {
        userDelete(justPostedUser[0].id, false);
        if (showResults) {
          testResults += addToResults(`Reset Created User: ${justPostedUser[0].email}`);
        }
      }
      return allUsers;
    } catch (error: any) {
      testResults += addToResults(`Remove Created Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    }
  };

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
          testResults += addToResults(`Reset User: ${userToUpdate.email}`);
        }
        return response.data;
      } else {
        testResults += addToResults(`Error resetting: status: ${response.status}`, false);
        return {
          error: "Error re-setting",
          status: response.status,
        };
      }
    } catch (error: any) {
      testResults += addToResults(`Reset Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      setResults(testResults);
    }
  };

  const reAddDeletedUser = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delUserUrl = url + "/" + userToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delUserUrl,
        });
        // if user already exisits, do not delete it
        if (response.status === 200) {
          return {
            data: userToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if user does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAddUser = {
        ...userToDel,
      };
      reAddUser.id = postSecret + reAddUser.id;
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
          status: 201,
        };
      } else {
        return {
          error: "Error re-adding",
          status: response.status,
        };
      }
    } catch (error: any) {
      testResults += addToResults(`ReAdd Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    }    
  };

  const userCreate = async () => {
    let testResults: string = results + "Create User tests: \n";
    let createdUserId: string = "";
    passed = true;

    const deleteCreated = async () => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url,
        });
        if (response.status === 200) {
          const all: userType[] = response.data.users as unknown as userType[];
          const justCreated = all.filter((user) => user.email === userToPost.email);
          if (justCreated.length === 1) {
            await userDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created user", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const userInvalidCreate = async (propertyName: string, value: any) => {
      try {
        const invalidUserJSON = JSON.stringify({
          ...userToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "post",
          data: invalidUserJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create User Error: did not return 422 for invalid ${propertyName}`,
            false
          );          
          return {
            error: `Error creating user with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create User, non 422 response for user: ${userToUpdate.email} - invalid data`
          );
          return {
            error: "Error Creating User, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create User: ${userToUpdate.email} - invalid ${propertyName}`
          );
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Create Error: did not return 422 for invalid ${propertyName}`,
            false
          );          
          return {
            error: `Error Creating user with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await deleteCreated();

      const userJSON = JSON.stringify(userToPost);
      const response = await axios({
        method: "post",
        data: userJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdUserId = response.data.user.id;
        testResults += addToResults(`Created User: ${response.data.user.email}`);
        const postedUser: userType = response.data.user;
        if (postedUser.first_name !== userToPost.first_name) {
          testResults += addToResults(
            "Created user first_name !== userToPost.first_name",
            false
          );
        } else if (postedUser.last_name !== userToPost.last_name) {
          testResults += addToResults(
            "Created user last_name !== userToPost.last_name",
            false
          );
        } else if (postedUser.email !== userToPost.email) {
          testResults += addToResults("Created user email !== userToPost.email", false);
        } else if (postedUser.phone !== userToPost.phone) {
          testResults += addToResults("Created user phone !== userToPost.phone", false);
        } else if (postedUser.role !== userToPost.role) {
          testResults += addToResults("Created user role !== userToPost.role", false);
        } else {
          testResults += addToResults(`Created User === userToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating user: ${userToPost.email}, response status: ${response.status}`,
          false
        );        
        return {
          error: "Did not create user",
          status: response.status,
        };
      }

      await userInvalidCreate("first_name", "");
      await userInvalidCreate("last_name", "<script>alert(1)</script>");
      await userInvalidCreate("email", "invalid email");
      await userInvalidCreate("phone", "123");
      await userInvalidCreate("password", "test");
      
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdUserId) {
        await userDelete(createdUserId, false);
      }
      if (passed) {
        testResults += addToResults(`Create User tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create User tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const userReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Users tests: \n";
    passed = true;

    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: url,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(
            `Success: Read ${response.data.users.length} Users`,
            true
          );          
        }
        const allUsers: userType[] = response.data.users as unknown as userType[];

        // 5 users in /prisma/seeds.ts
        const seedUsers = 5;
        if (allUsers.length === seedUsers) {
          testResults += addToResults(`Read all ${seedUsers} users`, true);
        } else {
          testResults += addToResults(
            `Error: Read ${allUsers.length} users, expected ${seedUsers}`,
            false
          );
        }
        return response.data.users;
      } else {
        testResults += addToResults(
          `Error reading all users, response status: ${response.status}`,
          false
        );        
        return {
          error: "Did not read all users",
          status: response.status,
        };
      }
    } catch (error: any) {
      testResults += addToResults(`Read All Error: ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Read All Users tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read All Users tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const userRead1 = async () => {
    let testResults = results + "Read 1 User tests: \n";
    passed = true;

    const userReadInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: invalidUrl,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read 1 User Error: did not return 404 for invalid id ${id}`,
            false
          );          
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 User, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 User, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read 1 User: invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Read 1 User Error: did not return 404 for invalid id: ${id}`,
            false
          );          
          return {
            error: `Error Reading 1 User, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testUser: userType = {
      ...userToUpdate,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: userIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 User ${response.data.user.email}`,
          true
        );
        const readUser: userType = response.data.user;
        if (readUser.first_name !== testUser.first_name) {
          testResults += addToResults(
            "Read 1 User first_name !== testUser.first_name",
            false
          );
        } else if (readUser.last_name !== testUser.last_name) {
          testResults += addToResults(
            "Read 1 User last_name !== testUser.last_name",
            false
          );
        } else if (readUser.email !== testUser.email) {
          testResults += addToResults("Read 1 User email !== testUser.email", false);
        } else if (readUser.phone !== testUser.phone) {
          testResults += addToResults("Read 1 User phone !== testUser.phone", false);
        } else if (readUser.role !== testUser.role) {
          testResults += addToResults("Read 1 User role !== testUser.role", false);
        } else {
          testResults += addToResults(`Read 1 User === testUser`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 user, response status: ${response.status}`,
          false
        );        
        return {
          error: "Did not read 1 user",
          status: response.status,
        };
      }

      // test invalid url
      await userReadInvalidId("abc_123");
      // test non existing user
      await userReadInvalidId("usr_12345678901234567890123456789012");
      
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Read 1 Error: ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Read 1 User tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 User tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const userUpdate = async () => {
    let testResults = results + "Update User tests: \n";
    passed = true;

    const userUpdateValid = async () => {
      try {
        const userJSON = JSON.stringify(userUpdatedTo);
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

    const userInvalidUpdate = async (propertyName: string, value: any) => {
      try {
        const invalidUserJSON = JSON.stringify({
          ...userToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "put",
          data: invalidUserJSON,
          withCredentials: true,
          url: userIdUrl,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Update User Error: did not return 422 for invalid ${propertyName}`,
            false
          );          
          return {
            error: `Error updating user with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Update User, non 422 response for user: ${userToUpdate.email} - invalid data`
          );
          return {
            error: "Error Updating User, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Update user: ${userToUpdate.email} - invalid ${propertyName}`
          );
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Update Error: did not return 422 for invalid ${propertyName}`,
            false
          );          
          return {
            error: `Error Updating user with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const userUpdateInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidJSON = JSON.stringify(userUpdatedTo);
        const notUpdatedResponse = await axios({
          method: "put",
          data: invalidJSON,
          withCredentials: true,
          url: invalidUrl,
        });

        if (notUpdatedResponse.status === 200) {
          testResults += addToResults(`Error: updated invalid id: ${id}`);          
          return notUpdatedResponse;
        } else {
          testResults += addToResults(`DID NOT update User, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT update User, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Update User Error: did not return 404 for invalid id: ${id}`,
            false
          );          
          return {
            error: `Error Updating User, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      // 1) valid full user object
      const updated = await userUpdateValid();
      if (updated.status !== 200) {
        testResults += addToResults(`Error: ${updated.message}`, false);       
        return updated;
      }
      const updatedUser: userType = updated.data.user;
      if (updatedUser.first_name !== userUpdatedTo.first_name) {
        testResults += addToResults(
          "Updated user first_name !== userUpdatedTo.first_name",
          false
        );
      } else if (updatedUser.last_name !== userUpdatedTo.last_name) {
        testResults += addToResults(
          "Updated user last_name !== userUpdatedTo.last_name",
          false
        );
      } else if (updatedUser.phone !== userUpdatedTo.phone) {
        testResults += addToResults("Updated user phone !== userUpdatedTo.phone ", false);
      } else if (updatedUser.email !== userUpdatedTo.email) {
        testResults += addToResults("Updated user email !== userUpdatedTo.email", false);
        // don't compare password_hash
        // } else if (updatedUser.password_hash !== userUpdatedTo.password_hash) {
        //   testResults += addToResults('Updated user password_hash !== userUpdatedTo.password_hash', false)
      } else {
        testResults += addToResults(`Updated User: ${updatedUser.email}`);
      }

      // 2) invalid user data
      await userInvalidUpdate("first_name", "1234567890123456789012345678901");
      await userInvalidUpdate("last_name", "*****");
      await userInvalidUpdate("phone", "abc");
      await userInvalidUpdate("email", "no valid email");
      await userInvalidUpdate("password", "invalid");

      // 3) invalid user id
      await userUpdateInvalidId("abc_123");
      // 4 non existing user id
      await userUpdateInvalidId("usr_12345678901234567890123456789012");
      
      return updated;
    } catch (error: any) {
      testResults += addToResults(`Update Error: ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await resetUserToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update User tests: PASSED`);
      } else {
        testResults += addToResults(`Update User tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const userPatch = async () => {
    let testResults = results + "Patch User tests: \n";
    passed = true;

    const doPatch = async (propertyName: string, value: any, matchValue: any) => {
      try {
        const patchJSON = JSON.stringify({
          [propertyName]: value,
        });
        const response = await axios({
          method: "patch",
          data: patchJSON,
          withCredentials: true,
          url: userIdUrl,
        });
        if (response.status === 200) {
          testResults += addToResults(
            `Patched User: ${userToUpdate.email} - just ${propertyName}`
          );
          if (response.data.user[propertyName] === matchValue) {
            testResults += addToResults(`Patched User ${propertyName}`);
          } else {
            testResults += addToResults(`DID NOT Patch User ${propertyName}`, false);            
          }
          return {
            data: response.data.user,
            status: response.status,
          };
        } else {
          testResults += addToResults(`doPatch Error: ${propertyName}`, false);          
          return {
            error: `Error Patching ${propertyName}`,
            status: response.status,
          };
        }
      } catch (error: any) {
        testResults += addToResults(`doPatch Error: ${error.message}`, false);        
        return {
          error: error.message,
          status: 404,
        };
      } finally {
        await resetUserToUpdate(false);
      }
    };

    const dontPatch = async (propertyName: string, value: any) => {
      try {
        const dontPatchJSON = JSON.stringify({               
          [propertyName]: value,
        });
        const response = await axios({
          method: "patch",
          data: dontPatchJSON,
          withCredentials: true,
          url: userIdUrl,
        });
        if (response.status !== 422) {
          testResults += addToResults(
            `Patch Error: did not return 422 for invalid ${propertyName}`,
            false
          );          
          return {
            error: "Error Patching User",
            status: response.status,
          };
        } else {
          testResults += addToResults(
            `Patch User, non 422 response for user: ${userToUpdate.email} - invalid ${propertyName}`
          );
          return {
            error: "Error Patching User",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch User: ${userToUpdate.email} - invalid ${propertyName}`
          );
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Patch Error: did not return 422 for invalid ${propertyName}`,
            false
          );          
          return {
            error: `Error Patching ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontPatchInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidJSON = JSON.stringify(userUpdatedTo);
        const notUpdatedResponse = await axios({
          method: "patch",
          data: invalidJSON,
          withCredentials: true,
          url: invalidUrl,
        });

        if (notUpdatedResponse.status === 200) {
          testResults += addToResults(`Error: patched invalid id: ${id}`);          
          return notUpdatedResponse;
        } else {
          testResults += addToResults(`DID NOT patch User, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT patch User, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Patch User Error: did not return 404 for invalid id: ${id}`,
            false
          );          
          return {
            error: `Error Patching User, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await doPatch("email", "updated@email.com", "updated@email.com");
      await dontPatch("email", "updatedemail.com");

      await doPatch("phone", "800-123-4567", "+18001234567");
      await dontPatch("phone", "123");

      await doPatch("first_name", " Jane *", "Jane");
      await doPatch("first_name", "<script>alert(1)</script>", 'alert1');
      await dontPatch("first_name", "<script></script>");

      await doPatch("last_name", "Doe", "Doe");
      await dontPatch("last_name", "****");

      // dont patch password
      // await doPatchUser('password', '1234Test!', userUpdatedTo.password_hash)
      await dontPatch("password", "123");

      await dontPatchInvalidId("abc_123");
      await dontPatchInvalidId("usr_12345678901234567890123456789012");
      
      return userToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await resetUserToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update User tests: PASSED`);
      } else {
        testResults += addToResults(`Update User tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const userDelete = async (userId: string, testing: boolean = true) => {
    let testResults = results + "Delete User tests: \n";
    if (testing) {
      passed = true;
    }    

    const invalidDelete = async (invalidId: string) => {
      try {
        const invalidDelUrl = url + "/" + invalidId;
        const cantDelResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: invalidDelUrl,
        });
        if (cantDelResponse.status === 404) {
          testResults += addToResults(
            `Did not not delete user with invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Error: Could not delete user with invalid id: "${invalidId}"`,
            false
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `Did not not delete user - invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(`Delete User Error: ${error.message}`, false);          
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
    };

    const userDelUrl = url + "/" + userId;
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
          testResults += addToResults(
            `Success: Deleted User: ${response.data.deleted.email}`
          );
        }
      } else {
        testResults += addToResults("Error: could not delete user", false);        
        return {
          error: "Could not delete user",
          status: 404,
        };
      }

      if (testing) {
        // try to delete user that is parent to tmnt
        try {
          const cantDelUrl = url + "/" + userToUpdate.id;
          const cantDelResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: cantDelUrl,
          });
          if (cantDelResponse.status === 409) {
            testResults += addToResults(
              `Did not not delete user: ${userToUpdate.email} with children`
            );
          } else {
            testResults += addToResults(
              `Error: Could not delete user: ${userToUpdate.email}`,
              false
            );
          }
        } catch (error: any) {
          if (error.response.status === 409) {
            testResults += addToResults(
              `Did not not delete user: ${userToUpdate.email} with children`
            );
          } else {
            testResults += addToResults(`Delete User Error: ${error.message}`, false);            
            return {
              error: error.message,
              status: error.response.status,
            };
          }
        }
        await invalidDelete("abc_123");
        await invalidDelete("usr_12345678901234567890123456789012");
        
      }
      return { data: response.data, status: 200 };
    } catch (error: any) {
      testResults += addToResults(`Error : ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (testing) {
        await reAddDeletedUser();
        if (passed) {
          testResults += addToResults(`Delete User tests: PASSED`);
        } else {
          testResults += addToResults(`Delete User tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const resetAll = async () => {
    let testResults: string = "";
    try {
      const reset = await resetUserToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allUsers: any = await removeCreatedUser(true);
      if (allUsers.error) {
        testResults += addToResults(`Error Resetting: ${allUsers.error}`, false);
        return;
      }

      const reAdded: any = await reAddDeletedUser();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Users`);
      return {
        users: allUsers,
        status: 200,
      };
    } catch (error: any) {
      testResults += addToResults(`Reset Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      setResults(testResults);
    }
  };

  const handleCrudChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetAll();
  };

  const handleUserTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (userCrud) {
      case "create":
        await userCreate();
        break;
      case "read":
        await userReadAll(true);
        break;
      case "read1":
        await userRead1();
        break;
      case "update":
        await userUpdate();
        break;
      case "patch":
        await userPatch();
        break;
      case "delete":
        await userDelete(userToDel.id);
        break;
      default:
        break;
    }
  };

  const handleUserTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = "Testing all...";
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
      setResults(allResults);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      allResults = results;
      await resetAll();
      allResults += addToResults(`Test All Complete`, passed);
      setResults(allResults);
    }
  };

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <h4>Users</h4>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-success" id="userTest" onClick={handleUserTest}>
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
          <button className="btn btn-warning" id="userClear" onClick={handleClear}>
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-info" id="userReset" onClick={handleReset}>
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
            onChange={handleCrudChange}
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
            onChange={handleCrudChange}
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
            onChange={handleCrudChange}
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
            onChange={handleCrudChange}
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
            onChange={handleCrudChange}
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
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="userResults"
            name="userResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
