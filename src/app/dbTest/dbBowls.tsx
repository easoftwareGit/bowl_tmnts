import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { bowlType } from "@/lib/types/types";
import { initBowl } from "@/db/initVals";

const url = baseApi + "/bowls";
const bowlId = "bwl_561540bd64974da9abdd97765fdb3659";
const bowlIdUrl = url + "/" + bowlId;
let passed = true;
let allResults = "";

export const DbBowls = () => {
  const [bowlCrud, setBowlCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
    // force textarea to scroll to bottom
    var textarea = document.getElementById("bowlResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const bowlToPost: bowlType = {
    ...initBowl,
    id: "",
    bowl_name: "Test Bowl",
    city: "Somewhere",
    state: "ZZ",
    url: "https://google.com/",
  };

  const bowlToUpdate: bowlType = {
    ...initBowl,
    id: "bwl_561540bd64974da9abdd97765fdb3659",
    bowl_name: "Earl Anthony's Dublin Bowl",
    city: "Dublin",
    state: "CA",
    url: "https://www.earlanthonysdublinbowl.com/",
  };

  const bowlUpdatedTo: bowlType = {
    ...initBowl,
    bowl_name: "Test Bowl",
    city: "Hereville",
    state: "AZ",
    url: "https://www.testbowl.com/",
  };

  const bowlToDel: bowlType = {
    ...initBowl,
    id: "bwl_91c6f24db58349e8856fe1d919e54b9e",
    bowl_name: "Diablo Lanes",
    city: "Concord",
    state: "CA",
    url: "http://diablolanes.com/",
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

  const removeCreatedBowl = async (showResults: boolean) => {
    let testResults = results;
    try {
      const allBowls: bowlType[] = (await bowlReadAll(
        false
      )) as unknown as bowlType[];
      const justPostedBowl = allBowls.filter(
        (bowl) => bowl.url === bowlToPost.url
      );
      if (justPostedBowl.length === 1) {
        bowlDelete(justPostedBowl[0].id, false);
        if (showResults) {
          testResults += addToResults(
            `Reset Created Bowl: ${justPostedBowl[0].bowl_name}`
          );
        }
      }
      return allBowls;
    } catch (error: any) {
      testResults += addToResults(
        `Remove Created Error: ${error.message}`,
        false
      );
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    }
  };

  const resetBowlToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: bowlToUpdate,
        withCredentials: true,
        url: bowlIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Reset Bowl: ${bowlToUpdate.bowl_name}`);
        }
        return response.data;
      } else {
        testResults += addToResults(
          `Error resetting: status: ${response.status}`,
          false
        );
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

  const reAddDeletedBowl = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delBowlUrl = url + "/" + bowlToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delBowlUrl,
        });
        // if bowl already exisits, do not delete it
        if (response.status === 200) {
          return {
            data: bowlToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if bowl does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAddBowl = {
        ...bowlToDel,
      };
      reAddBowl.id = nextPostSecret + reAddBowl.id;
      const bowlJSON = JSON.stringify(reAddBowl);
      response = await axios({
        method: "post",
        data: bowlJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: bowlToDel,
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

  const bowlCreate = async () => {
    let testResults: string = results + "Create Bowl tests: \n";
    let createdBowlId: string = "";
    passed = true;

    const deleteCreated = async () => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url,
        });
        if (response.status === 200) {
          const all: bowlType[] = response.data.bowls as unknown as bowlType[];
          const justCreated = all.filter((bowl) => bowl.url === bowlToPost.url);
          if (justCreated.length === 1) {
            await bowlDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created bowl", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const bowlInvalidCreate = async (propertyName: string, value: any) => {
      try {
        const invalidBowlJSON = JSON.stringify({
          ...bowlToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "post",
          data: invalidBowlJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Bowl Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          setResults(testResults);
          return {
            error: `Error creating bowl with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Bowl, non 422 response for bowl: ${bowlToUpdate.bowl_name} - invalid data`
          );
          return {
            error: "Error Creating Bowl, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create bowl: ${bowlToUpdate.bowl_name} - invalid ${propertyName}`
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
          setResults(testResults);
          return {
            error: `Error Creating bowl with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await deleteCreated();

      const bowlJSON = JSON.stringify(bowlToPost);
      const response = await axios({
        method: "post",
        data: bowlJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdBowlId = response.data.bowl.id;
        testResults += addToResults(
          `Created bowl: ${response.data.bowl.bowl_name}`
        );
        const postedBowl: bowlType = response.data.bowl;
        if (postedBowl.bowl_name !== bowlToPost.bowl_name) {
          testResults += addToResults(
            "Created bowl bowl_name !== bowlToPost.bowl_name",
            false
          );
        } else if (postedBowl.city !== bowlToPost.city) {
          testResults += addToResults(
            "Created bowl city !== bowlToPost.city",
            false
          );
        } else if (postedBowl.state !== bowlToPost.state) {
          testResults += addToResults(
            "Created bowl state !== bowlToPost.state",
            false
          );
        } else if (postedBowl.url !== bowlToPost.url) {
          testResults += addToResults(
            "Created bowl url !== bowlToPost.url",
            false
          );
        } else {
          testResults += addToResults(`Created bowl === bowlToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating bowl: ${bowlToPost.bowl_name}, response statue: ${response.status}`,
          false
        );
        return {
          error: "Did not create bowl",
          status: response.status,
        };
      }

      await bowlInvalidCreate("bowl_name", "");
      await bowlInvalidCreate("city", "<script>alert(1)</script>");
      await bowlInvalidCreate("state", "invalid state");
      await bowlInvalidCreate("url", "example.com");

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdBowlId) {
        await bowlDelete(createdBowlId, false);
      }
      if (passed) {
        testResults += addToResults(`Create Bowl tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create Bowl tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const bowlReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Bowls tests: \n";
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
            `Success: Read ${response.data.bowls.length} Bowls`,
            true
          );
        }
        const allBowls: bowlType[] = response.data
          .bowls as unknown as bowlType[];
        const justPostedBowl = allBowls.filter(
          (bowl) => bowl.url === bowlToPost.url
        );

        // 4 bowls in /prisma/seeds.ts
        const seedBowls = 4;
        if (justPostedBowl.length === 1) {
          // created a test bowl BEFORE testing read all
          if (allBowls.length === seedBowls + 1) {
            testResults += addToResults(`Read all ${seedBowls + 1} bowls`);
          } else {
            testResults += addToResults(
              `Error: Read ${allBowls.length} bowls, expected ${seedBowls + 1}`,
              false
            );
          }
        } else {
          // test bowl not created yet
          if (allBowls.length === seedBowls) {
            testResults += addToResults(`Read all ${seedBowls} bowls`, true);
          } else {
            testResults += addToResults(
              `Error: Read ${allBowls.length} bowls, expected ${seedBowls}`,
              false
            );
          }
        }
        return response.data.bowls;
      } else {
        testResults += addToResults(
          `Error reading all bowls, response statue: ${response.status}`,
          false
        );
        return {
          error: "Did not read all bowls",
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
        testResults += addToResults(`Read All Bowls tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read All Bowls tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const bowlRead1 = async () => {
    let testResults = results + "Read 1 Bowl tests: \n";
    passed = true;

    const bowlReadInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: invalidUrl,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read 1 Bowl Error: did not return 404 for invalid id ${id}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 Bowl, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 Bowl, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read 1 Bowl: invalid id: ${id}`);
          return {
            error: `invalid id: ${id}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read 1 Bowl Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Reading 1 Bowl, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testBowl: bowlType = {
      ...bowlToUpdate,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: bowlIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 Bowl: ${response.data.bowl.bowl_name}`,
          true
        );
        const readBowl: bowlType = response.data.bowl;
        if (readBowl.bowl_name !== testBowl.bowl_name) {
          testResults += addToResults(
            "Read 1 Bowl bowl_name !== testBowl.bowl_name",
            false
          );
        } else if (readBowl.city !== testBowl.city) {
          testResults += addToResults(
            "Read 1 Bowl city !== testBowl.city",
            false
          );
        } else if (readBowl.state !== testBowl.state) {
          testResults += addToResults(
            "Read 1 Bowl state !== testBowl.state",
            false
          );
        } else if (readBowl.url !== testBowl.url) {
          testResults += addToResults(
            "Read 1 Bowl url !== testBowl.url",
            false
          );
        } else {
          testResults += addToResults(`Read 1 Bowl === testBowl`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 Bowl, response statue: ${response.status}`,
          false
        );
        return {
          error: "Did not read 1 bowl",
          status: response.status,
        };
      }

      // test invalid url
      await bowlReadInvalidId("abc_123");
      // test non existing bowl
      await bowlReadInvalidId("bwl_12345678901234567890123456789012");

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Read 1 Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Read 1 Bowl tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 Bowl tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const bowlUpdate = async () => {
    let testResults = results + "Update Bowl tests: \n";
    passed = true;

    const bowlUpdateValid = async () => {
      try {
        const bowlJSON = JSON.stringify(bowlUpdatedTo);
        const response = await axios({
          method: "put",
          data: bowlJSON,
          withCredentials: true,
          url: bowlIdUrl,
        });
        return response;
      } catch (error: any) {
        return error;
      }
    };

    const bowlUpdateInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const tmntJSON = JSON.stringify(bowlUpdatedTo);
        const notUpdatedResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: invalidUrl,
        });

        if (notUpdatedResponse.status === 200) {
          testResults += addToResults(`Error: updated invalid id: ${id}`);
          return notUpdatedResponse;
        } else {
          testResults += addToResults(`DID NOT update Bowl, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT update Bowl, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Update Bowl Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Updating Bowl, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      // 1) valid full bowl object
      const updated = await bowlUpdateValid();
      if (updated.status !== 200) {
        testResults += addToResults(`Error: ${updated.message}`, false);
        return updated;
      }
      const updatedBowl: bowlType = updated.data.bowl;
      if (updatedBowl.bowl_name !== bowlUpdatedTo.bowl_name) {
        testResults += addToResults(
          "Updated bowl bowl_name !== bowlUpdatedTo.bowl_name",
          false
        );
      } else if (updatedBowl.city !== bowlUpdatedTo.city) {
        testResults += addToResults(
          "Updated bowl city !== bowlUpdatedTo.city",
          false
        );
      } else if (updatedBowl.state !== bowlUpdatedTo.state) {
        testResults += addToResults(
          "Updated bowl state !== bowlUpdatedTo.state",
          false
        );
      } else if (updatedBowl.url !== bowlUpdatedTo.url) {
        testResults += addToResults(
          "Updated bowl url !== bowlUpdatedTo.url",
          false
        );
      } else {
        testResults += addToResults(`Updated Bowl: ${updatedBowl.bowl_name}`);
      }
      // 2) invalid bowl id
      await bowlUpdateInvalidId("abc_123");
      // 3 non existing bowl id
      await bowlUpdateInvalidId("bwl_12345678901234567890123456789012");

      return updated;
    } catch (error: any) {
      testResults += addToResults(`Update Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetBowlToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update Bowl tests: PASSED`, true);
      } else {
        testResults += addToResults(`Update Bowl tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const bowlPatch = async () => {
    let testResults = results + "Patch Bowl tests: \n";
    passed = true;

    const doPatchBowl = async (
      propertyName: string,
      value: any,
      matchValue: any
    ) => {
      try {
        const bowlJSON = JSON.stringify({
          [propertyName]: value,
        });
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: bowlIdUrl,
        });
        if (response.status === 200) {
          if (response.data.bowl[propertyName] === matchValue) {
            testResults += addToResults(
              `Patched Bowl: ${bowlToUpdate.bowl_name} - just ${propertyName}`
            );
          } else {
            testResults += addToResults(
              `DID NOT Patch Bowl ${propertyName}`,
              false
            );
          }
          return {
            data: response.data.bowl,
            status: response.status,
          };
        } else {
          testResults += addToResults(`Patch Error: ${propertyName}`, false);
          return {
            error: `Error Patching ${propertyName}`,
            status: response.status,
          };
        }
      } catch (error: any) {
        testResults += addToResults(
          `doPatchBowl Error: ${error.message}`,
          false
        );
        return {
          error: error.message,
          status: 404,
        };
      } finally {
        const reset = await resetBowlToUpdate(false);
      }
    };

    const doNotPatchBowl = async (propertyName: string, value: any) => {
      try {
        const bowlJSON = JSON.stringify({
          ...bowlToUpdate,
          bowl_name:
            "123456789012345678901234567890123456789012345678901234567890",
        });
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: bowlIdUrl,
        });
        if (response.status !== 422) {
          testResults += addToResults(
            `Patch Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: "Error Patching Bowl",
            status: response.status,
          };
        } else {
          testResults += addToResults(
            `Patch Bowl, non 422 response for bowl: ${bowlToUpdate.bowl_name} - invalid ${propertyName}`
          );
          return {
            error: "Error Patching Bowl",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Bowl: ${bowlToUpdate.bowl_name} - invalid ${propertyName}`
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

    const bowlPatchInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const tmntJSON = JSON.stringify(bowlUpdatedTo);
        const notUpdatedResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: invalidUrl,
        });

        if (notUpdatedResponse.status === 200) {
          testResults += addToResults(`Error: patched invalid id: ${id}`);
          return notUpdatedResponse;
        } else {
          testResults += addToResults(`DID NOT patch Bowl, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT patch Bowl, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Patch Bowl Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Patching Bowl, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await doPatchBowl("bowl_name", "Test Bowl", "Test Bowl");
      await doNotPatchBowl("bowl_name", "<script>alert(1)</script>");

      await doPatchBowl("city", "  Somewhere *", "Somewhere");
      await doNotPatchBowl(
        "city",
        "12345678901234567890123456789012345678901234567890"
      );

      await doPatchBowl("state", "NY", "NY");
      await doNotPatchBowl("state", "");

      await doPatchBowl(
        "url",
        "https://www.testbowl.com/",
        "https://www.testbowl.com/"
      );
      await doNotPatchBowl("url", "just some text");

      await bowlPatchInvalidId("abc_123");
      await bowlPatchInvalidId("bwl_12345678901234567890123456789012");

      return bowlToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await resetBowlToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Bowl tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Bowl tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const bowlDelete = async (bowlIdToDel: string, testing: boolean = true) => {
    let testResults = results + "Delete Bowl tests: \n";
    passed = true;

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
            `Did not not delete bowl with invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Error: Could not delete bowl with invalid id: "${invalidId}"`,
            false
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `Did not not delete bowl - invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Delete Bowl Error: ${error.message}`,
            false
          );
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
    };

    const bowlDelUrl = url + "/" + bowlIdToDel;
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: bowlDelUrl,
      });
      if (response.status === 200) {
        // if bowlId !== bowlToDel.id, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (bowlIdToDel === bowlToDel.id) {
          testResults += addToResults(
            `Success: Deleted Bowl: ${response.data.deleted.bowl_name}`
          );
        }
      } else {
        testResults += addToResults("False: could not delete bowl", false);
        return {
          error: "Could not delete bowl",
          status: 404,
        };
      }

      if (testing) {
        // try to delete bowl that is parent to tmnt
        try {
          const cantDelUrl = url + "/" + bowlToUpdate.id;
          const cantDelResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: cantDelUrl,
          });
          if (cantDelResponse.status === 409) {
            testResults += addToResults(
              `Did not not delete bowl: ${bowlToUpdate.bowl_name} with children`
            );
          } else {
            testResults += addToResults(
              `Error: Could not delete bowl: ${bowlToUpdate.bowl_name}`,
              false
            );
          }
        } catch (error: any) {
          if (error.response.status === 409) {
            testResults += addToResults(
              `Did not not delete bowl: ${bowlToUpdate.bowl_name} with children`
            );
          } else {
            testResults += addToResults(
              `Delete Bowl Error: ${error.message}`,
              false
            );
            return {
              error: error.message,
              status: error.response.status,
            };
          }
        }
        await invalidDelete("abc_123");
        await invalidDelete("bwl_12345678901234567890123456789012");
      }
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Error : ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await reAddDeletedBowl();
      if (testing) {
        if (passed) {
          testResults += addToResults(`Delete Bowl tests: PASSED`, true);
        } else {
          testResults += addToResults(`Delete Bowl tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const resetAll = async () => {
    let testResults: string = "";
    try {
      const reset = await resetBowlToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allBowls: any = await removeCreatedBowl(true);
      if (allBowls.error) {
        testResults += addToResults(
          `Error Resetting: ${allBowls.error}`,
          false
        );
        return;
      }

      const reAdded: any = await reAddDeletedBowl();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Bowls`);
      return {
        bowls: allBowls,
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

  const handleBowlCrudChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBowlCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetAll();
  };

  const handleBowlTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (bowlCrud) {
      case "create":
        await bowlCreate();
        break;
      case "read":
        await bowlReadAll(true);
        break;
      case "read1":
        await bowlRead1();
        break;
      case "update":
        await bowlUpdate();
        break;
      case "patch":
        await bowlPatch();
        break;
      case "delete":
        await bowlDelete(bowlToDel.id);
        break;
      default:
        break;
    }
  };

  const handleBowlTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = "Testing all...";
    passed = true;
    try {
      await bowlCreate();
      allResults = results;
      await bowlReadAll(true);
      allResults = results;
      await bowlRead1();
      allResults = results;
      await bowlUpdate();
      allResults = results;
      await bowlPatch();
      allResults = results;
      await bowlDelete(bowlToDel.id);
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
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="bowlTestAll"
            onClick={handleBowlTestAll}
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button
            className="btn btn-warning"
            id="bowlClear"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-info" id="bowlReset" onClick={handleReset}>
            Reset
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
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="bowlRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="bowlRead"
            name="bowl"
            value="read"
            checked={bowlCrud === "read"}
            onChange={handleBowlCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="bowlRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="bowlRead1"
            name="bowl"
            value="read1"
            checked={bowlCrud === "read1"}
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
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="bowlPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="bowlPatch"
            name="bowl"
            value="patch"
            checked={bowlCrud === "patch"}
            onChange={handleBowlCrudChange}
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
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="bowlResults"
            name="bowlResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
