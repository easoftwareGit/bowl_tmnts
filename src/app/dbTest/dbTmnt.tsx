import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { tmntType, YearObj } from "@/lib/types/types";
import { initTmnt } from "@/db/initVals";
import { startOfTodayUTC, todayStr } from "@/lib/dateTools";
import { addDays, compareAsc } from "date-fns";

const url = baseApi + "/tmnts";
const tmntId = "tmt_fd99387c33d9c78aba290286576ddce5";
const tmntIdUrl = url + "/" + tmntId;
let passed = true;
let allResults = "";

export const DbTmnts = () => {
  const [tmntCrud, setTmntCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
    // force textare to scroll to bottom
    var textarea = document.getElementById("tmntTestResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const tmntToPost: tmntType = {
    ...initTmnt,
    id: "",
    tmnt_name: "Test Tournement",
    user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
    bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
    start_date: startOfTodayUTC(),
    end_date: startOfTodayUTC(),
  };

  const tmntToUpdate: tmntType = {
    ...initTmnt,
    id: "tmt_fd99387c33d9c78aba290286576ddce5",
    tmnt_name: "Gold Pin",
    user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
    bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
    start_date: new Date(Date.UTC(2022, 9, 23)),  // month is -1 
    end_date: new Date(Date.UTC(2022, 9, 23)),    // month is -1
  };

  const tmntUpdatedTo: tmntType = {
    ...initTmnt,
    tmnt_name: "Test Tmnt",
    start_date: new Date(Date.UTC(2022, 0, 1)), // month is -1
    end_date: new Date(Date.UTC(2022, 0, 1)),   // month is -1
    bowl_id: "bwl_8b4a5c35ad1247049532ff53a12def0a",
    user_id: "usr_a24894ed10c5dd835d5cbbfea7ac6dca",
  };

  const tmntToDel: tmntType = {
    ...initTmnt,
    id: "tmt_e134ac14c5234d708d26037ae812ac33",
    tmnt_name: "Gold Pin",
    user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
    bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
    start_date: new Date(Date.UTC(2024, 7, 19)), // month is -1
    end_date: new Date(Date.UTC(2024, 7, 19)),   // month is -1
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

  const removeCreatedTmnt = async (showResults: boolean) => {
    let testResults = results;
    try {
      const allTmnts: tmntType[] = (await tmntReadAll(
        false
      )) as unknown as tmntType[];
      const justPostedTmnt = allTmnts.filter(
        (tmnt) => tmnt.tmnt_name === tmntToPost.tmnt_name
      );
      if (justPostedTmnt.length === 1) {
        tmntDelete(justPostedTmnt[0].id, false);
        if (showResults) {
          testResults += addToResults(
            `Reset Created Tmnt: ${justPostedTmnt[0].tmnt_name}`
          );
        }
      }
      return allTmnts;
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

  const resetTmntToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: tmntToUpdate,
        withCredentials: true,
        url: tmntIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Reset Tmnt: ${tmntToUpdate.tmnt_name}`);
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

  const reAddDeletedTmnt = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delTmntUrl = url + "/" + tmntToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delTmntUrl,
        });
        if (
          response.status === 200 &&
          (response.data.tmnt || response.data.tmnts?.length > 0)
        ) {
          return {
            data: tmntToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if tmnt does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAdd = {
        ...tmntToDel,
      };
      reAdd.id = nextPostSecret + reAdd.id;
      const reAddJSON = JSON.stringify(reAdd);
      response = await axios({
        method: "post",
        data: reAddJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: tmntToDel,
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

  const tmntCreate = async () => {
    let testResults: string = results + "Create Tmnt tests: \n";
    let createdTmntId: string = "";
    passed = true;

    const deleteCreated = async () => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url,
        });
        if (response.status === 200) {
          const all: tmntType[] = response.data.tmnts as unknown as tmntType[];
          const justCreated = all.filter(
            (tmnt) => tmnt.tmnt_name === tmntToPost.tmnt_name
          );
          if (justCreated.length === 1) {
            await tmntDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created tmnt", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const invalidCreate = async (propertyName: string, value: any) => {
      try {
        const invalidJSON = JSON.stringify({
          ...tmntToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "post",
          data: invalidJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Tmnt Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error creating tmnt with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Tmnt, non 422 response for tmnt: ${tmntToUpdate.tmnt_name} - invalid data`
          );
          return {
            error: "Error Creating Tmnt, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create Tmnt: ${tmntToUpdate.tmnt_name} - invalid ${propertyName}`
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
            error: `Error Creating tmnt with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await deleteCreated();

      const creareJSON = JSON.stringify(tmntToPost);
      const response = await axios({
        method: "post",
        data: creareJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdTmntId = response.data.tmnt.id;
        testResults += addToResults(
          `Created Tmnt: ${response.data.tmnt.tmnt_name}`
        );
        const postedTmnt: tmntType = response.data.tmnt;
        if (postedTmnt.tmnt_name !== tmntToPost.tmnt_name) {
          testResults += addToResults(
            "Created Tmnt tmnt_name !== tmntToPost.tmnt_name",
            false
          );
        } else if (compareAsc(postedTmnt.start_date, tmntToPost.start_date) !== 0) {
          testResults += addToResults(
            "Created Tmnt start_date !== tmntToPost.start_date",
            false
          );
        } else if (compareAsc(postedTmnt.end_date, tmntToPost.end_date) !== 0) {
          testResults += addToResults(
            "Created Tmnt end_date !== tmntToPost.end_date",
            false
          );
        } else if (postedTmnt.bowl_id !== tmntToPost.bowl_id) {
          testResults += addToResults(
            "Created Tmnt bowl_id !== tmntToPost.bowl_id",
            false
          );
        } else if (postedTmnt.user_id !== tmntToPost.user_id) {
          testResults += addToResults(
            "Created Tmnt user_id !== tmntToPost.user_id",
            false
          );
        } else {
          testResults += addToResults(`Created Tmnt === tmntToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating tmnt: ${tmntToPost.tmnt_name}, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not create tmnt",
          status: response.status,
        };
      }

      await invalidCreate("tmnt_name", "");
      await invalidCreate("start_date", "<script>alert('hi')</script>");
      await invalidCreate("start_date", addDays( tmntToPost.end_date, 1));
      await invalidCreate("end_date", "2022-11-31");
      await invalidCreate("bowl_id", "1234");
      await invalidCreate("user_id", "abc_def");

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdTmntId) {
        await tmntDelete(createdTmntId, false);
      }
      if (passed) {
        testResults += addToResults(`Create Tmnt tests: PASSED`);
      } else {
        testResults += addToResults(`Create Tmnt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tmntReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Tmnts tests: \n";
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
            `Success: Read ${response.data.tmnts.length} Tmnts`,
            true
          );
        }
        const allTmnts: tmntType[] = response.data
          .tmnts as unknown as tmntType[];
        const justPostedTmnt = allTmnts.filter(
          (tmnt) => tmnt.tmnt_name === tmntToPost.tmnt_name
        );

        // 10 tmnts in /prisma/seeds.ts
        const seedTmnts = 10;
        if (justPostedTmnt.length === 1) {
          // created a test tmnt BEFORE testing read all
          if (allTmnts.length === seedTmnts + 1) {
            testResults += addToResults(`Read all ${seedTmnts + 1} tmnts`);
          } else {
            testResults += addToResults(
              `Error: Read ${allTmnts.length} tmnts, expected ${seedTmnts + 1}`,
              false
            );
          }
        } else {
          // test tmnt not created yet
          if (allTmnts.length === seedTmnts) {
            testResults += addToResults(`Read all ${seedTmnts} tmnts`, true);
          } else {
            testResults += addToResults(
              `Error: Read ${allTmnts.length} tmnts, expected ${seedTmnts}`,
              false
            );
          }
        }
        return response.data.tmnts;
      } else {
        testResults += addToResults(
          `Error reading all tmnts, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read all tmnts",
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
        testResults += addToResults(`Read All Tmnt tests: PASSED`);
      } else {
        testResults += addToResults(`Read All Tmnt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tmntRead1 = async () => {
    let testResults = results + "Read 1 Tmnt tests: \n";
    passed = true;

    const tmntReadInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: invalidUrl,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read 1 Tmnt Error: did not return 404 for invalid id ${id}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 Tmnt, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 Tmnt, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read 1 Tmnt: invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Read 1 Tmnt Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Reading 1 Tmnt, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testTmnt: tmntType = {
      ...tmntToUpdate,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: tmntIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 Tmnt ${response.data.tmnt.tmnt_name}`,
          true
        );
        const readTmnt: tmntType = response.data.tmnt;
        if (readTmnt.tmnt_name !== testTmnt.tmnt_name) {
          testResults += addToResults(
            "Read 1 Tmnt tmnt_name !== testTmnt.tmnt_name",
            false
          );
        } else if (compareAsc(readTmnt.start_date, readTmnt.start_date) !== 0) {
          testResults += addToResults(
            "Read 1 Tmnt start_date !== testTmnt.start_date",
            false
          );
        } else if (compareAsc(readTmnt.end_date, testTmnt.end_date) !== 0) {
          testResults += addToResults(
            "Read 1 Tmnt end_date !== testTmnt.end_date",
            false
          );
        } else if (readTmnt.bowl_id !== testTmnt.bowl_id) {
          testResults += addToResults(
            "Read 1 Tmnt bowl_id !== testTmnt.bowl_id",
            false
          );
        } else if (readTmnt.user_id !== testTmnt.user_id) {
          testResults += addToResults(
            "Read 1 Tmnt user_id !== testTmnt.user_id",
            false
          );
        } else {
          testResults += addToResults(`Read 1 Tmnt === testTmnt`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 Tmnt, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read 1 tmnt",
          status: response.status,
        };
      }

      // test invalid url
      await tmntReadInvalidId("abc_123");
      // test non existing tmnt
      await tmntReadInvalidId("tmt_12345678901234567890123456789012");

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Read 1 Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Read 1 Tmnt tests: PASSED`);
      } else {
        testResults += addToResults(`Read 1 Tmnt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tmntUpdate = async () => {
    let testResults = results + "Update Tmnt tests: \n";
    passed = true;

    const updateValid = async () => {
      try {
        const updateJSON = JSON.stringify(tmntUpdatedTo);
        const response = await axios({
          method: "put",
          data: updateJSON,
          withCredentials: true,
          url: tmntIdUrl,
        });
        return response;
      } catch (error: any) {
        return error;
      }
    };

    const invalidUpadte = async (propertyName: string, value: any) => {
      try {
        const invalidTmntJSON = JSON.stringify({
          ...tmntToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "post",
          data: invalidTmntJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Tmnt Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error creating tmnt with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Tmnt, non 422 response for tmnt: ${tmntToUpdate.tmnt_name} - invalid data`
          );
          return {
            error: "Error Creating Tmnt, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create tmnt: ${tmntToUpdate.tmnt_name} - invalid ${propertyName}`
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
            error: `Error Creating tmnt with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const updateInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidJSON = JSON.stringify(tmntUpdatedTo);
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
          testResults += addToResults(`DID NOT update Tmnt, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT update Tmnt, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Update Tmnt Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Updating Tmnt, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      // 1) valid full tmnt object
      const updated = await updateValid();
      if (updated.status !== 200) {
        testResults += addToResults(`Error: ${updated.message}`, false);
        return updated;
      }
      const updatedTmnt: tmntType = updated.data.tmnt;
      if (updatedTmnt.tmnt_name !== tmntUpdatedTo.tmnt_name) {
        testResults += addToResults(
          "Updated Tmnt tmnt_name !== testTmntToUpdate.tmnt_name",
          false
        );
      } else if (compareAsc(updatedTmnt.start_date, tmntUpdatedTo.start_date) !== 0) {
        testResults += addToResults(
          "Updated Tmnt start_date !== testTmntToUpdate.start_date",
          false
        );
      } else if (compareAsc(updatedTmnt.end_date, tmntUpdatedTo.end_date) !== 0) {
        testResults += addToResults(
          "Updated Tmnt end_date !== testTmntToUpdate.end_date",
          false
        );
      } else if (updatedTmnt.bowl_id !== tmntUpdatedTo.bowl_id) {
        testResults += addToResults(
          "Updated Tmnt bowl_id !== testTmntToUpdate.bowl_id",
          false
        );
      } else if (updatedTmnt.user_id !== tmntUpdatedTo.user_id) {
        testResults += addToResults(
          "Updated Tmnt user_id !== testTmntToUpdate.user_id",
          false
        );
      } else {
        testResults += addToResults(`Updated Tmnt: ${updatedTmnt.tmnt_name}`);
      }
      // 2) invalid tmnt object
      await invalidUpadte("tmnt_name", "*****");
      await invalidUpadte("start_date", "2022-02-32");
      await invalidUpadte("start_date", new Date(Date.UTC(2022, 8, 24))); // after end date, month - 1      
      await invalidUpadte("end_date", "abc");
      await invalidUpadte(
        "bowl_id",
        "usr_12345678901234567890123456789012"
      );
      await invalidUpadte(
        "user_id",
        "bwl_12345678901234567890123456789012"
      );

      // 3) invalid tmnt id
      await updateInvalidId("abc_123");
      // 4) non existing tmnt id
      await updateInvalidId("tmt_12345678901234567890123456789012");

      return updated;
    } catch (error: any) {
      testResults += addToResults(`Update Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await resetTmntToUpdate(false);
      if (passed) {
        testResults += addToResults(`Create Tmnt tests: PASSED`);
      } else {
        testResults += addToResults(`Create Tmnt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tmntPatch = async () => {
    let testResults = results + "Patch Tmnt tests: \n";
    passed = true;

    const doPatch = async (
      propertyName: string,
      value: any,
      matchValue: any
    ) => {
      try {
        let patchJSON: any;
        // if start date or end date, must have both values
        if (propertyName === "start_date" || propertyName === "end_date") {
          patchJSON = JSON.stringify({
            start_date: value,
            end_date: value,
          });
        } else {
          patchJSON = JSON.stringify({
            [propertyName]: value,
          });
        }
        const response = await axios({
          method: "patch",
          data: patchJSON,
          withCredentials: true,
          url: tmntIdUrl,
        });
        if (response.status === 200) {
          if (response.data.tmnt[propertyName] === matchValue) {
            if (propertyName === "start_date" && value === "") {
              testResults += addToResults(
                `Patched Tmnt: ${tmntToUpdate.tmnt_name} - just ${propertyName} = "${value}" and end_date = ""`
              );
            } else {
              testResults += addToResults(
                `Patched Tmnt: ${tmntToUpdate.tmnt_name} - just ${propertyName} = "${value}"`
              );
            }
          } else {
            testResults += addToResults(
              `DID NOT Patch Tmnt ${propertyName}`,
              false
            );
          }
          return {
            data: response.data.tmnt,
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
        testResults += addToResults(
          `doPatch Error: ${error.message}`,
          false
        );
        return {
          error: error.message,
          status: 404,
        };
      } finally {
        const reset = await resetTmntToUpdate(false);
      }
    };

    const doPatchDates = async (
      startDate: any,
      endDate: any      
    ) => {
      try {
        let patchJSON: any;
        if (startDate && endDate) {
          patchJSON = JSON.stringify({
            start_date: startDate,
            end_date: endDate,
          });
        } else if (startDate) {
          patchJSON = JSON.stringify({
            start_date: startDate,
          });
        } else if (endDate) {
          patchJSON = JSON.stringify({
            end_date: endDate,
          });
        } else {
          testResults += addToResults(
            `doPatch Error: no date values`,
            false
          );
          return {
            error: 'no date values',
            status: 404,
          };
        }
        const response = await axios({
          method: "patch",
          data: patchJSON,
          withCredentials: true,
          url: tmntIdUrl,
        });
        if (response.status === 200) {
          if (startDate) {
            const resDate = new Date(response.data.tmnt.start_date);
            if (compareAsc(resDate, startDate) === 0) {
              testResults += addToResults(
                `Patched Tmnt: ${tmntToUpdate.tmnt_name} - start_date = "${startDate}"`
              );
            } else {
              testResults += addToResults(
                `DID NOT Patch Tmnt start_date`,
                false
              );
            }
          } 
          if (endDate) {
            const resDate = new Date(response.data.tmnt.end_date);
            if (compareAsc(resDate, endDate) === 0) {
              testResults += addToResults(
                `Patched Tmnt: ${tmntToUpdate.tmnt_name} - end_date = "${endDate}"`
              );
            } else {
              testResults += addToResults(
                `DID NOT Patch Tmnt end_date`,
                false
              );
            }
          }
          return {
            data: response.data.tmnt,
            status: response.status,
          };
        } else {
          testResults += addToResults(`doPatch Error: dates`, false);
          return {
            error: `Error Patching dates`,
            status: response.status,
          };
        }
      } catch (error: any) {
        testResults += addToResults(
          `doPatchDates Error: ${error.message}`,
          false
        );
        return {
          error: error.message,
          status: 404,
        };
      } finally {
        const reset = await resetTmntToUpdate(false);
      }
    };

    const dontPatch = async (propertyName: string, value: any) => {
      try {
        const dontPatchJSON = JSON.stringify({
          ...tmntToUpdate,
          [propertyName]: value,
        });
        const response = await axios({
          method: "patch",
          data: dontPatchJSON,
          withCredentials: true,
          url: tmntIdUrl,
        });
        if (response.status !== 422) {
          testResults += addToResults(
            `Patch Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: "Error Patching Tmnt",
            status: response.status,
          };
        } else {
          testResults += addToResults(
            `Patch Tmnt, non 422 response for tmnt: ${tmntToUpdate.tmnt_name} - invalid ${propertyName}`
          );
          return {
            error: "Error Patching Tmnt",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Tmnt: ${tmntToUpdate.tmnt_name} - invalid ${propertyName}`
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
        const invalidJSON = JSON.stringify(tmntUpdatedTo);
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
          testResults += addToResults(`DID NOT patch Tmnt, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT patch Tmnt, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Patch Tmnt Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Patching Tmnt, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await doPatch("tmnt_name", "Test Tmnt", "Test Tmnt");
      await doPatch("tmnt_name", "<script>alert(1)</script>", "alert1");
      await dontPatch("tmnt_name", "<script></script>");

      // new Date(Date.UTC(2023, 2, 1)),  // month is -1
      await doPatchDates(new Date(Date.UTC(2023, 1, 1)), new Date(Date.UTC(2023, 1, 1)));
      await doPatchDates(new Date(Date.UTC(1999, 0, 1)), null as any);
      await doPatchDates(null as any, new Date(Date.UTC(2025, 0, 1)), );

      await dontPatch("start_date", "2024-02-31");
      await dontPatch("end_date", new Date(Date.UTC(1980, 2, 1)));

      await doPatch(
        "bowl_id",
        "bwl_8b4a5c35ad1247049532ff53a12def0a",
        "bwl_8b4a5c35ad1247049532ff53a12def0a"
      );
      await dontPatch("bowl_id", "usr_8b4a5c35ad1247049532ff53a12def0a");

      await doPatch(
        "user_id",
        "usr_a24894ed10c5dd835d5cbbfea7ac6dca",
        "usr_a24894ed10c5dd835d5cbbfea7ac6dca"
      );
      await dontPatch("user_id", "bwl_8b4a5c35ad1247049532ff53a12def0a");

      await dontPatchInvalidId("abc_123");
      await dontPatchInvalidId("tmt_12345678901234567890123456789012");

      return tmntToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await resetTmntToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Tmnt tests: PASSED`);
      } else {
        testResults += addToResults(`Patch Tmnt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tmntDelete = async (tmntId: string, testing: boolean = true) => {
    let testResults = results + "Delete Tmnt tests: \n";
    const tmntDelUrl = url + "/" + tmntId;
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
            `Did not not delete tmnt with invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Error: Could not delete tmnt with invalid id: "${invalidId}"`,
            false
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `Did not not delete tmnt - invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Delete Tmnt Error: ${error.message}`,
            false
          );
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
    };

    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: tmntDelUrl,
      });
      if (response.status === 200) {
        // if tmntId !== tmntToDelId, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (tmntId === tmntToDel.id) {
          testResults += addToResults(
            `Success: Deleted Tmnt: ${response.data.deleted.tmnt_name}`
          );
        }
      } else {
        testResults += addToResults("Error: could not delete tmnt", false);
        return {
          error: "Could not delete tmnt",
          status: 404,
        };
      }

      if (testing) {
        // try to delete tmnt that is parent to tmnt
        try {
          const cantDelUrl = url + "/" + tmntToUpdate.id;
          const cantDelResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: cantDelUrl,
          });
          if (cantDelResponse.status === 409) {
            testResults += addToResults(
              `Did not not delete tmnt: ${tmntToUpdate.tmnt_name} with children`
            );
          } else {
            testResults += addToResults(
              `Error: Could not delete tmnt: ${tmntToUpdate.tmnt_name}`,
              false
            );
          }
        } catch (error: any) {
          if (error.response.status === 409) {
            testResults += addToResults(
              `Did not not delete tmnt: ${tmntToUpdate.tmnt_name} with children`
            );
          } else {
            testResults += addToResults(
              `Delete Tmnt Error: ${error.message}`,
              false
            );
            return {
              error: error.message,
              status: error.response.status,
            };
          }
        }

        await invalidDelete("abc_123");
        await invalidDelete("tmt_12345678901234567890123456789012");
      }
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Error : ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {      
      if (testing) {
        await reAddDeletedTmnt();
        if (passed) {
          testResults += addToResults(`Delete Tmnt tests: PASSED`);
        } else {
          testResults += addToResults(`Delete Tmnt tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const tmntYears = async () => {
    let testResults = results + "Read Tmnts Years: \n";
    passed = true;

    const tmntYearsUrl = url + "/years/2023";
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: tmntYearsUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: ${response.data.years.length} Tmnt Year`,
          true
        );

        const years: YearObj[] = response.data.years as unknown as YearObj[];
        // 2 tmnts years before 2024 in /prisma/seeds.ts
        const seedYears = 2;
        if (years.length === seedYears) {
          testResults += addToResults(`got ${seedYears} tmnt yaers`, true);
          years.forEach((y) => {
            y.year = Number(y.year);
          })
          if (years[0].year === 2023 && years[1].year === 2022) {
            testResults += addToResults(`got correct tmnt years`, true);
          } else {
            testResults += addToResults(`got incorrect tmnt years`, false);
          }
        } else {
          testResults += addToResults(
            `Error: got ${years.length} tmnts years, expected ${seedYears}`,
            false
          );
        }        
        return years;
      } else {
        testResults += addToResults(
          `Error getting tmnt years, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not get tmnt years",
          status: response.status,
        };
      }
    } catch (error: any) {
      testResults += addToResults(`Tmnt Years Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Tmnt Years: PASSED`);
      } else {
        testResults += addToResults(`Tmnt Years: FAILED`, false);
      }
      setResults(testResults);
    }
  }

  const tmntResults = async () => {
    let testResults = results + "Tmnts Results: \n";
    passed = true;

    try {
      const urlResults = url + "/results";
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: urlResults,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: ${response.data.tmnts.length} Tmnt Results`,
          true
        );

        const tmnts: tmntType[] = response.data.tmnts as unknown as tmntType[];
        const seedResults = 9;
        if (tmnts.length === seedResults) {
          testResults += addToResults(`got ${seedResults} tmnt results`, true);
        } else {
          testResults += addToResults(
            `Error: got ${tmnts.length} tmnts results, expected ${seedResults}`,
            false
          );
        }        
        return tmnts;
      } else {
        testResults += addToResults(
          `Error getting tmnt results, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not get tmnt results",
          status: response.status,
        };
        
      }
    } catch (error: any) {
      testResults += addToResults(`Tmnt Results Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Tmnt Results: PASSED`);
      } else {
        testResults += addToResults(`Tmnt Results: FAILED`, false);
      }
      setResults(testResults);
    }
  }

  const tmntUpcoming = async () => {
    let testResults = results + "Tmnts Upcoming: \n";
    passed = true;

    try {
      const urlResults = url + "/upcoming";
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: urlResults,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: ${response.data.tmnts.length} Tmnt Upcoming`,
          true
        );

        const tmnts: tmntType[] = response.data.tmnts as unknown as tmntType[];
        const seedResults = 1;
        if (tmnts.length === seedResults) {
          testResults += addToResults(`got ${seedResults} tmnt upcoming`, true);
        } else {
          testResults += addToResults(
            `Error: got ${tmnts.length} tmnts upcoming, expected ${seedResults}`,
            false
          );
        }        
        return tmnts;
      } else {
        testResults += addToResults(
          `Error getting tmnt upcoming, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not get tmnt upcoming",
          status: response.status,
        };
        
      }
    } catch (error: any) {
      testResults += addToResults(`Tmnt Upcoming Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Tmnt Upcoming: PASSED`);
      } else {
        testResults += addToResults(`Tmnt Upcoming: FAILED`, false);
      }
      setResults(testResults);
    }
  }

  const resetAll = async () => {
    let testResults: string = "";
    try {
      const reset = await resetTmntToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allTmnts: any = await removeCreatedTmnt(true);
      if (allTmnts.error) {
        testResults += addToResults(
          `Error Resetting: ${allTmnts.error}`,
          false
        );
        return;
      }

      const reAdded: any = await reAddDeletedTmnt();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Tmnts`);
      return {
        tmnts: allTmnts,
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
    setTmntCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetAll();
  };

  const handleTmntTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (tmntCrud) {
      case "create":
        await tmntCreate();
        break;
      case "read":
        await tmntReadAll(true);
        break;
      case "read1":
        await tmntRead1();
        break;
      case "update":
        await tmntUpdate();
        break;
      case "patch":
        await tmntPatch();
        break;
      case "delete":
        await tmntDelete(tmntToDel.id);
        break;
      case "years":
        await tmntYears();
        break;
      case "results":
        await tmntResults();
        break;
      case "upcoming":
        await tmntUpcoming();
        break;
      default:
        break;
    }
  };

  const handleTmntTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = "Testing all...";
    passed = true;
    try {
      await tmntCreate();
      allResults = results;
      await tmntReadAll(true);
      allResults = results;
      await tmntRead1();
      allResults = results;
      await tmntUpdate();
      allResults = results;
      await tmntPatch();
      allResults = results;
      await tmntDelete(tmntToDel.id);
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
          <h4>Tmnts</h4>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-success"
            id="tmntTest"
            onClick={handleTmntTest}
          >
            Test
          </button>
        </div>
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="tmntTestAll"
            onClick={handleTmntTestAll}
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button
            className="btn btn-warning"
            id="tmntClear"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-info" id="tmntReset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="tmntCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tmntCreate"
            name="tmnt"
            value="create"
            checked={tmntCrud === "create"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tmntRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tmntRead"
            name="tmnt"
            value="read"
            checked={tmntCrud === "read"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tmntRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tmntRead1"
            name="tmnt"
            value="read1"
            checked={tmntCrud === "read1"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tmntUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tmntUpdate"
            name="tmnt"
            value="update"
            checked={tmntCrud === "update"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tmntPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tmntPatch"
            name="tmnt"
            value="patch"
            checked={tmntCrud === "patch"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tmntDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tmntDelete"
            name="tmnt"
            value="delete"
            checked={tmntCrud === "delete"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="tmntYears" className="form-check-label">
            &nbsp;Years &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tmntYears"
            name="tmnt"
            value="years"
            checked={tmntCrud === "years"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tmntResults" className="form-check-label">
            &nbsp;Results &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tmntResults"
            name="tmnt"
            value="results"
            checked={tmntCrud === "results"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-3">
          <label htmlFor="tmntUpcoming" className="form-check-label">
            &nbsp;Upcoming &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tmntUpcoming"
            name="tmnt"
            value="upcoming"
            checked={tmntCrud === "upcoming"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="tmntTestResults"
            name="tmntTestResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
