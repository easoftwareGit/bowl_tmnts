import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { divType } from "@/lib/types/types";
import { initDiv } from "@/db/initVals";

const url = baseApi + "/divs";
const divId = "div_f30aea2c534f4cfe87f4315531cef8ef";
const divIdUrl = url + "/" + divId;
const multiDivsTmntId = "tmt_56d916ece6b50e6293300248c6792316";
const noDivsTmntId = "tmt_718fe20f53dd4e539692c6c64f991bbe";
let passed = true;
let allResults = "";

export const DbDivs = () => {
  const [divCrud, setDivCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
    // force textarea to scroll to bottom
    var textarea = document.getElementById("divResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const divToPost: divType = {
    ...initDiv,
    id: "",
    tmnt_id: "tmt_718fe20f53dd4e539692c6c64f991bbe",
    div_name: "Test Div",
    hdcp_per: 0.9,
    hdcp_per_str: "90.00",
    hdcp_from: 230,
    int_hdcp: true,
    hdcp_for: "Game",
    sort_order: 1,
  };

  const divToUpdate: divType = {
    ...initDiv,
    id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
    div_name: "Scratch",
    hdcp_per: 0,
    hdcp_per_str: "0.00",
    hdcp_from: 230,
    int_hdcp: true,
    hdcp_for: "Game",
    sort_order: 1,
  };

  const divUpdatedTo: divType = {
    ...initDiv,
    id: "div_29b9225d8dd44a4eae276f8bde855729",
    tmnt_id: "tmt_56d916ece6b50e6293300248c6792316",
    div_name: "56+ Hdcp",
    hdcp_per: 0.9,
    hdcp_per_str: "90.00",
    hdcp_from: 225,
    int_hdcp: false,
    hdcp_for: "Series",
    sort_order: 3,
  };

  const divDuplicate: divType = {
    ...initDiv,
    id: "div_578834e04e5e4885bbae79229d8b96e8",
    tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
    div_name: "Scratch",
    hdcp_per: 0,
    hdcp_per_str: "0.00",
    hdcp_from: 230,
    int_hdcp: true,
    hdcp_for: "Game",
    sort_order: 1,
  };

  const divToDel: divType = {
    ...initDiv,
    id: "div_66d39a83d7a84a8c85d28d8d1b2c7a90",
    tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
    div_name: "Women's",
    hdcp_per: 0.9,
    hdcp_per_str: "90.00",
    hdcp_from: 230,
    int_hdcp: true,
    hdcp_for: "Game",
    sort_order: 4,
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

  const removeCreatedDiv = async (showResults: boolean) => {
    let testResults = results;
    try {
      const allDivs: divType[] = (await divReadAll(false)) as unknown as divType[];
      const justPostedDiv = allDivs.filter((div) => div.div_name === divToPost.div_name);
      if (justPostedDiv.length === 1) {
        await divDelete(justPostedDiv[0].id, false);
        if (showResults) {
          testResults += addToResults(`Reset Created Div: ${justPostedDiv[0].div_name}`);
        }
      }
      return allDivs;
    } catch (error: any) {
      testResults += addToResults(`Remove Created Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    }
  };

  const resetDivToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: divToUpdate,
        withCredentials: true,
        url: divIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Reset Div: ${divToUpdate.div_name}`);
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

  const reAddDeletedDiv = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delDivUrl = url + "/" + divToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delDivUrl,
        });
        // if div already exisits, do not delete it
        if (response.status === 200) {
          return {
            data: divToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if Div does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAddDiv = {
        ...divToDel,
      };
      reAddDiv.id = nextPostSecret + reAddDiv.id;
      const divJSON = JSON.stringify(reAddDiv);
      response = await axios({
        method: "post",
        data: divJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: divToDel,
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

  const divCreate = async () => {
    let testResults: string = results + "Create Div tests: \n";
    let createdDivId: string = "";
    passed = true;

    const deleteCreated = async () => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url,
        });
        if (response.status === 200) {
          const all: divType[] = response.data.divs as unknown as divType[];
          const justCreated = all.filter((div) => div.div_name === divToPost.div_name);
          if (justCreated.length === 1) {
            await divDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created div", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const divInvalidCreate = async (propertyName: string, value: any) => {
      try {
        const invalidDivJSON = JSON.stringify({
          ...divToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "post",
          data: invalidDivJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Div Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error creating div with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Div, non 422 response for div: ${divToUpdate.div_name} - invalid data`
          );
          return {
            error: "Error Creating Div, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create div: ${divToUpdate.div_name} - invalid ${propertyName}`
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
            error: `Error Creating div with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const divCreateDuplicate = async () => {
      try {
        const duplicate = {
          ...divDuplicate,
          id: "",
        };
        const divJSON = JSON.stringify(duplicate);
        const invalidResponse = await axios({
          method: "post",
          data: divJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Div Error: did not return 422 for duplicate div_name+tmnt_id`,
            false
          );
          return {
            error: `Error creating div with duplicate div_name+tmnt_id`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Div, non 422 response for duplicate div_name+tmnt_id`
          );
          return {
            error: "Error Creating Div, non 422 response for duplicate div_name+tmnt_id",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Create div: duplicate div_name+tmnt_id`);
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Create Error: did not return 422 for duplicate div_name+tmnt_id`,
            false
          );
          return {
            error: `Error Creating div with duplicate div_name+tmnt_id`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await deleteCreated();

      const divJSON = JSON.stringify(divToPost);
      const response = await axios({
        method: "post",
        data: divJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdDivId = response.data.div.id;
        testResults += addToResults(`Created div: ${response.data.div.div_name}`);
        const postedDiv: divType = response.data.div;
        if (postedDiv.tmnt_id !== divToPost.tmnt_id) {
          testResults += addToResults("Created div tmnt_id !== divToPost.tmnt_id", false);
        } else if (postedDiv.div_name !== divToPost.div_name) {
          testResults += addToResults(
            "Created div div_name !== divToPost.div_name",
            false
          );
        } else if (postedDiv.hdcp_per !== divToPost.hdcp_per) {
          testResults += addToResults(
            "Created div hdcp_per !== divToPost.hdcp_per",
            false
          );
        } else if (postedDiv.hdcp_from !== divToPost.hdcp_from) {
          testResults += addToResults(
            "Created div hdcp_from !== divToPost.hdcp_from",
            false
          );
        } else if (postedDiv.int_hdcp !== divToPost.int_hdcp) {
          testResults += addToResults(
            "Created div int_hdcp !== divToPost.int_hdcp",
            false
          );
        } else if (postedDiv.hdcp_for !== divToPost.hdcp_for) {
          testResults += addToResults(
            "Created div hdcp_for !== divToPost.hdcp_for",
            false
          );
        } else if (postedDiv.sort_order !== divToPost.sort_order) {
          testResults += addToResults(
            "Created div sort_order !== divToPost.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Created div === divToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating div: ${divToPost.div_name}, response statue: ${response.status}`,
          false
        );
        return {
          error: "Did not create div",
          status: response.status,
        };
      }

      await divInvalidCreate("tmnt_id", "bwl_123");
      await divInvalidCreate("div_name", "");
      await divInvalidCreate("hdcp_per", 2);
      await divInvalidCreate("hdcp_from", -1);
      await divInvalidCreate("int_hdcp", null);
      await divInvalidCreate("hdcp_for", "Test");

      await divCreateDuplicate();

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdDivId) {
        await divDelete(createdDivId, false);
      }
      if (passed) {
        testResults += addToResults(`Create Div tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create Div tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const divReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Divs tests: \n";
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
            `Success: Read ${response.data.divs.length} Events`,
            true
          );
        }
        const allDivs: divType[] = response.data.divs as unknown as divType[];
        // 7 divs in /prisma/seeds.ts
        const seedDivs = 7;
        if (allDivs.length === seedDivs) {
          testResults += addToResults(`Read all ${seedDivs} divs`, true);
        } else {
          testResults += addToResults(
            `Error: Read ${allDivs.length} divs, expected ${seedDivs}`,
            false
          );
        }
        return response.data.divs;
      } else {
        testResults += addToResults(
          `Error reading all divs, response statue: ${response.status}`,
          false
        );
        return {
          error: "Did not read all divs",
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
      if (showResults) {
        if (passed) {
          testResults += addToResults(`Read All Divs tests: PASSED`, true);
        } else {
          testResults += addToResults(`Read All Divs tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const divRead1 = async () => {
    let testResults = results + "Read 1 Div tests: \n";
    passed = true;

    const divReadInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: invalidUrl,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read 1 Div Error: did not return 404 for invalid id ${id}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 Div, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 Div, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read 1 Div: invalid id: ${id}`);
          return {
            error: `invalid id: ${id}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read 1 Div Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Reading 1 Div, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testDiv: divType = {
      ...divToUpdate,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: divIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 Div: ${response.data.div.div_name}`,
          true
        );
        const readDiv: divType = response.data.div;
        if (readDiv.tmnt_id !== testDiv.tmnt_id) {
          testResults += addToResults("Read 1 Div tmnt_id !== testDiv.tmnt_id", false);
        } else if (readDiv.div_name !== testDiv.div_name) {
          testResults += addToResults("Read 1 Div div_name !== testDiv.div_name", false);
        } else if (readDiv.hdcp_per !== testDiv.hdcp_per) {
          testResults += addToResults("Read 1 Div hdcp_per !== testDiv.hdcp_per", false);
        } else if (readDiv.hdcp_from !== testDiv.hdcp_from) {
          testResults += addToResults(
            "Read 1 Div hdcp_from !== testDiv.hdcp_from",
            false
          );
        } else if (readDiv.int_hdcp !== testDiv.int_hdcp) {
          testResults += addToResults("Read 1 Div int_hdcp !== testDiv.int_hdcp", false);
        } else if (readDiv.hdcp_for !== testDiv.hdcp_for) {
          testResults += addToResults("Read 1 Div hdcp_for !== testDiv.hdcp_for", false);
        } else if (readDiv.sort_order !== testDiv.sort_order) {
          testResults += addToResults(
            "Read 1 Div sort_order !== testDiv.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Read 1 Div === testDiv`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 div, response statue: ${response.status}`,
          false
        );
        return {
          error: "Did not read 1 div",
          status: response.status,
        };
      }

      // test invalid url
      await divReadInvalidId("abc_123");
      // test non existing div
      await divReadInvalidId("div_12345678901234567890123456789012");

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Read 1 Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Read 1 Div tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 Div tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const divReadForTmnt = async () => {
    let testResults = results + "Read Divs for a Tmnt tests: \n";
    passed = true;

    const validReadForTmnt = async (tmntId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/tmnt/" + tmntId,
        });
        if (response.status === 200) {
          testResults += addToResults(`Success: Read Divs for Tmnt, tmnt_id: ${tmntId}`);
          const readDivs: divType[] = response.data.divs;
          if (tmntId === multiDivsTmntId) {
            if (readDivs.length !== 2) {
              testResults += addToResults(
                "Error: Read Divs for Tmnt length !== 2",
                false
              );
              return {
                error: "Error: Read Divs for Tmnt, length !== 2",
                status: 404,
              };
            }
            readDivs.forEach((div: divType) => {
              if (
                !(
                  div.id === "div_1f42042f9ef24029a0a2d48cc276a087" ||
                  div.id === "div_29b9225d8dd44a4eae276f8bde855729"
                )
              ) {
                testResults += addToResults(
                  "Error: Read Divs for Tmnt div.id invalid",
                  false
                );
                return {
                  error: "Error: Read Divs for Tmnt, div.id invalid",
                  status: 404,
                };
              }
            });
          } else if (tmntId === noDivsTmntId) {
            if (readDivs.length !== 0) {
              testResults += addToResults(
                "Error: Read Divs for Tmnt length !== 0",
                false
              );
              return {
                error: "Error: Read Divs for Tmnt, length !== 0",
                status: 404,
              };
            }
          }
          testResults += addToResults(
            `Success: Read Divs for Tmnt, ${readDivs.length} rows returned`
          );
        } else {
          testResults += addToResults(
            `Error reading divs for tmnt, response statue: ${response.status}`,
            false
          );
          return {
            error: "Did not read divs for tmnt",
            status: response.status,
          };
        }
        return response.data.divs;
      } catch (error: any) {
        testResults += addToResults(`Read Divs for Tmnt Error: ${error.message}`, false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const invalidReadForTmnt = async (tmntId: string) => {
      try {
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/tmnt/" + tmntId,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read Divs for Tmnt Error: did not return 404 for invalid id ${tmntId}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${tmntId}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read Divs for Tmnt, non 404 response for invalid id: ${tmntId}`
          );
          return {
            error: `Error Reading Divs for Tmnt, non 404 response for invalid id: ${tmntId}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read Divs for Tmnt: invalid id: ${tmntId}`
          );
          return {
            error: `invalid id: ${tmntId}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read Divs for Tmnt Error: did not return 404 for invalid id: ${tmntId}`,
            false
          );
          return {
            error: `Error Reading Divs for Tmnt, non 404 response for invalid id: ${tmntId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await validReadForTmnt(multiDivsTmntId);
      await validReadForTmnt(noDivsTmntId);

      await invalidReadForTmnt("tmt_123");
      await invalidReadForTmnt("div_cb97b73cb538418ab993fc867f860510");
      return {
        divs: [],
        status: 200,
      };
    } catch (error: any) {
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Read Divs for a Tmnt tests: PASSED`);
      } else {
        testResults += addToResults(`Read Divs for a Tmnt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const divUpdate = async () => {
    let testResults = results + "Update Div tests: \n";
    passed = true;

    const updateValid = async () => {
      try {
        const updateJSON = JSON.stringify(divUpdatedTo);
        const response = await axios({
          method: "put",
          data: updateJSON,
          withCredentials: true,
          url: divIdUrl,
        });
        if (response.status !== 200) {
          const errMsg = (response as any).message;
          testResults += addToResults(`Error: ${errMsg.message}`, false);
          return response;
        }
        const updated: divType = response.data.div;
        if (updated.tmnt_id !== divUpdatedTo.tmnt_id) {
          testResults += addToResults(
            "Updated div tmnt_id !== divUpdatedTo.tmnt_id",
            false
          );
        } else if (updated.div_name !== divUpdatedTo.div_name) {
          testResults += addToResults(
            "Updated div div_name !== divUpdatedTo.div_name",
            false
          );
        } else if (updated.hdcp_per !== divUpdatedTo.hdcp_per) {
          testResults += addToResults(
            "Updated div hdcp_per !== divUpdatedTo.hdcp_per",
            false
          );
        } else if (updated.hdcp_from !== divUpdatedTo.hdcp_from) {
          testResults += addToResults(
            "Updated div hdcp_from !== divUpdatedTo.hdcp_from",
            false
          );
        } else if (updated.int_hdcp !== divUpdatedTo.int_hdcp) {
          testResults += addToResults(
            "Updated div int_hdcp !== divUpdatedTo.int_hdcp",
            false
          );
        } else if (updated.hdcp_for !== divUpdatedTo.hdcp_for) {
          testResults += addToResults(
            "Updated div hdcp_for !== divUpdatedTo.hdcp_for",
            false
          );
        } else if (updated.sort_order !== divUpdatedTo.sort_order) {
          testResults += addToResults(
            "Updated div sort_order !== divUpdatedTo.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Updated Div: ${updated.div_name}`);
        }
        return response;
      } catch (error: any) {
        testResults += addToResults(`Error: ${error.message}`, false);
        return error;
      }
    };

    const invalidUpdate = async (propertyName: string, value: any) => {
      try {
        const invalidJSON = JSON.stringify({
          ...divToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "put",
          data: invalidJSON,
          withCredentials: true,
          url: divIdUrl,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Update Div Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error updating div with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Update Div, non 422 response for div: ${divToUpdate.div_name} - invalid data`
          );
          return {
            error: "Error Updating Div, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Update div: ${divToUpdate.div_name} - invalid ${propertyName}`
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
            error: `Error Updating div with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontUpdateInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidJSON = JSON.stringify(divUpdatedTo);
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
          testResults += addToResults(`DID NOT update Div, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT update Div, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Update Div Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Updating Div, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontUpdateDuplicate = async () => {
      // get url with id of div to duplicate
      const duplicatIdUrl = url + "/" + "div_24b1cd5dee0542038a1244fc2978e862";
      try {
        const dupJSON = JSON.stringify(divDuplicate);
        const response = await axios({
          method: "put",
          data: dupJSON,
          withCredentials: true,
          url: duplicatIdUrl,
        });
        if (response.status === 200) {
          testResults += addToResults(`Error: updated duplicate div_name+tmnt_id`, false);
          return response;
        } else {
          testResults += addToResults(
            `DID NOT update Div, duplicate div_name+tmnt_id`,
            false
          );
        }
        return response;
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT update Div, duplicate div_name+tmnt_id`);
        } else {
          testResults += addToResults(
            `Update Div Error: did not return 422 for duplicate div_name+tmnt_id`,
            false
          );
          return {
            error: `Error Updating Div, non 422 response for duplicate div_name+tmnt_id`,
            status: error.response.status,
          };
        }
        return error;
      }
    };

    try {
      // 1) valid full div object
      const updated = await updateValid();

      // 2) invalid Div object
      await invalidUpdate("tmnt_id", "bwl_123");
      await invalidUpdate("div_name", "");
      await invalidUpdate("hdcp_per", 2);
      await invalidUpdate("hdcp_from", 301);
      await invalidUpdate("int_hdcp", undefined);
      await invalidUpdate("hdcp_for", "");
      await invalidUpdate("sort_order", "abc");

      // 3) invalid Div id
      await dontUpdateInvalidId("abc_123");
      // 4 non existing Div id
      await dontUpdateInvalidId("div_12345678901234567890123456789012");

      // 5) duplicate Div
      await dontUpdateDuplicate();

      return updated;
    } catch (error: any) {
      testResults += addToResults(`Update Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetDivToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update Div tests: PASSED`, true);
      } else {
        testResults += addToResults(`Update Div tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const divPatch = async () => {
    let testResults = results + "Patch Div tests: \n";
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
          url: divIdUrl,
        });
        if (response.status === 200) {
          if (response.data.div[propertyName] === matchValue) {
            testResults += addToResults(
              `Patched Div: ${divToUpdate.div_name} - just ${propertyName}`
            );
          } else {
            testResults += addToResults(`DID NOT Patch Div ${propertyName}`, false);
          }
          return {
            data: response.data.div,
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
        const reset = await resetDivToUpdate(false);
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
          url: divIdUrl,
        });
        if (response.status !== 422) {
          testResults += addToResults(
            `Patch Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        } else {
          testResults += addToResults(
            `Patch Div, non 422 response for div: ${divToUpdate.div_name} - invalid ${propertyName}`
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Div: ${divToUpdate.div_name} - invalid ${propertyName}`
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
        const invalidJSON = JSON.stringify(divUpdatedTo);
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
          testResults += addToResults(`DID NOT patch Div, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT patch Div, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Patch Div Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Patching Div, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      // cant patch the tmnt_id

      await doPatch("div_name", "Testing Div * ", "Testing Div");
      await doPatch("div_name", "<script>alert(1)</script>", 'alert1');
      await dontPatch("div_name", "<script></script>");

      await doPatch("hdcp_per", 0.95, 0.95);
      await dontPatch("hdcp_per", -1);

      await doPatch("hdcp_from", 222, 222);
      await dontPatch("hdcp_from", -1);

      await doPatch("int_hdcp", false, false);
      await dontPatch("int_hdcp", null);

      await doPatch("hdcp_for", "Series", "Series");
      await dontPatch("hdcp_for", "abc123");

      await doPatch("sort_order", 5, 5);
      await dontPatch("sort_order", -1);

      await dontPatchInvalidId("abc_123");
      await dontPatchInvalidId("bwl_12345678901234567890123456789012");

      return divToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetDivToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Div tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Div tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const divDelete = async (divIdToDel: string, testing: boolean = true) => {
    let testResults = results + "Delete Div tests: \n";
    if (!testing) {
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
            `Did not not delete Div with invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Error: Could not delete Div with invalid id: "${invalidId}"`,
            false
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `Did not not delete Div - invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(`Delete Div Error: ${error.message}`, false);
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
    };

    const divDelUrl = url + "/" + divIdToDel;
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: divDelUrl,
      });
      if (response.status === 200) {
        // if divIdToDel !== divToDel.id, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (divIdToDel === divToDel.id) {
          if (response.data.deleted.hdcp_per_str === divToDel.hdcp_per_str) {
            testResults += addToResults(
              `Success: Deleted Div: ${divToDel.div_name} - got hdcp_per_str in response`
            );
          } else {
            testResults += addToResults(
              `Error Deleted Div: ${divToDel.div_name}: no hdcp_per_str in response`,
              false
            );
            return {
              error: "No hdcp_per_str in response",
              status: 404,
            };
          }
          testResults += addToResults(
            `Success: Deleted Div: ${response.data.deleted.div_name}`
          );
        }
      } else {
        testResults += addToResults("Error: could not delete div", false);
        return {
          error: "Could not delete div",
          status: 404,
        };
      }

      if (testing) {
        // try to delete Div that is parent to tmnt
        try {
          const cantDelUrl = url + "/" + divToUpdate.id;
          const cantDelResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: cantDelUrl,
          });
          if (cantDelResponse.status === 409) {
            testResults += addToResults(
              `Did not not delete div: ${divToUpdate.div_name} with children`
            );
          } else {
            testResults += addToResults(
              `Error: Could not delete div: ${divToUpdate.div_name}`,
              false
            );
          }
        } catch (error: any) {
          if (error.response.status === 409) {
            testResults += addToResults(
              `Did not not delete div: ${divToUpdate.div_name} with children`
            );
          } else {
            testResults += addToResults(`Delete Div Error: ${error.message}`, false);
            return {
              error: error.message,
              status: error.response.status,
            };
          }
        }
        await invalidDelete("abc_123");
        await invalidDelete("div_12345678901234567890123456789012");
      }
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Error : ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await reAddDeletedDiv();
      if (testing) {
        if (passed) {
          testResults += addToResults(`Delete Div tests: PASSED`, true);
        } else {
          testResults += addToResults(`Delete Div tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const resetAll = async () => {
    let testResults: string = "";
    passed = true;
    try {
      const reset = await resetDivToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allDivs: any = await removeCreatedDiv(true);
      if (allDivs.error) {
        testResults += addToResults(`Error Resetting: ${allDivs.error}`, false);
        return;
      }

      const reAdded: any = await reAddDeletedDiv();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Divs`);
      return {
        divs: allDivs,
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
    setDivCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetAll();
  };

  const handleDivTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (divCrud) {
      case "create":
        await divCreate();
        break;
      case "read":
        await divReadAll(true);
        break;
      case "read1":
        await divRead1();
        break;
      case "update":
        await divUpdate();
        break;
      case "patch":
        await divPatch();
        break;
      case "delete":
        await divDelete(divToDel.id);
        break;
      case "readTmnt":
        await divReadForTmnt();
        break;
      default:
        break;
    }
  };

  const handleDivTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = "Testing all...";
    passed = true;
    try {
      await divCreate();
      allResults = results;
      await divReadAll(true);
      allResults = results;
      await divRead1();
      allResults = results;
      await divUpdate();
      allResults = results;
      await divPatch();
      allResults = results;
      await divDelete(divToDel.id);
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
          <h4>Divs</h4>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-success" id="divTest" onClick={handleDivTest}>
            Test
          </button>
        </div>
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="divTestAll"
            onClick={handleDivTestAll}
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button className="btn btn-warning" id="divClear" onClick={handleClear}>
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-info" id="divReset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="divCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="divCreate"
            name="div"
            value="create"
            checked={divCrud === "create"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="divRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="divRead"
            name="div"
            value="read"
            checked={divCrud === "read"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="divRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="divRead1"
            name="div"
            value="read1"
            checked={divCrud === "read1"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="divUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="divUpdate"
            name="div"
            value="update"
            checked={divCrud === "update"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="divPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="divPatch"
            name="div"
            value="patch"
            checked={divCrud === "patch"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="divDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="divDelete"
            name="div"
            value="delete"
            checked={divCrud === "delete"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-4"></div>
        <div className="col-sm-3">
          <label htmlFor="divReadTmnt" className="form-check-label">
            &nbsp;Read Tmnt &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="divReadTmnt"
            name="div"
            value="readTmnt"
            checked={divCrud === "readTmnt"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="divResults"
            name="divResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
