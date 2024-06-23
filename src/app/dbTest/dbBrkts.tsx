import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { brktType } from "@/lib/types/types";
import { initBrkt } from "@/db/initVals";

const url = baseApi + "/brkts";
const brktId = "brk_5109b54c2cc44ff9a3721de42c80c8c1";
const brktIdUrl = url + "/" + brktId;
const multiBrktsDivId = 'div_f30aea2c534f4cfe87f4315531cef8ef'
const multiBrktsSquadId = "sqd_7116ce5f80164830830a7157eb093396";
const noBrktsDivId = "div_578834e04e5e4885bbae79229d8b96e8";
const noBrktsSquadId = "sqd_42be0f9d527e4081972ce8877190489d";
let passed = true;
let allResults = "";

export const DbBrkts = () => {
  const [brktCrud, setBrktCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
    // force textarea to scroll to bottom
    var textarea = document.getElementById("brktResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const brktToPost: brktType = {
    ...initBrkt,
    id: "",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    sort_order: 3,
    start: 2,
    games: 3,
    players: 8,
    fee: '3',
    first: '15',
    second: '6',
    admin: '3',
    fsa: '24',    
  };

  const brktToUpdate: brktType = {
    ...initBrkt,
    id: "brk_5109b54c2cc44ff9a3721de42c80c8c1",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    sort_order: 1,
    start: 1,
    games: 3,
    players: 8,
    fee: '5',
    first: '25',
    second: '10',
    admin: '5',
    fsa: '40',
  };

  const brktUpdatedTo: brktType = {
    ...initBrkt,
    id: "brk_37345eb6049946ad83feb9fdbb43a307",
    squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
    div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
    sort_order: 3,
    start: 3,
    games: 3,
    players: 8,
    fee: '10',
    first: '50',
    second: '20',
    admin: '10',
    fsa: '80',
  };

  const brktDuplicate: brktType = {
    ...initBrkt,
    id: "",
    squad_id: "brk_37345eb6049946ad83feb9fdbb43a307",
    div_id: "sqd_1a6c885ee19a49489960389193e8f819",
    sort_order: 3,
    start: 1,
    games: 3,
    players: 8,
    fee: '5',
    first: '25',
    second: '10',
    admin: '5',
    fsa: '40',
  };

  const brktToDel: brktType = {
    ...initBrkt,
    id: "brk_400737cab3584ab7a59b7a4411da4474",
    squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
    div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
    sort_order: 3,
    start: 2,
    games: 3,
    players: 8,
    fee: '5',
    first: '25',
    second: '10',
    admin: '5',
    fsa: '40',
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

  const removeCreatedBrkt = async (showResults: boolean) => {
    let testResults = results;
    try {
      const all: brktType[] = (await brktReadAll(false)) as unknown as brktType[];
      const justPosted = all.filter((obj) => obj.fee === brktToPost.fee);
      if (justPosted.length === 1) {
        await brktDelete(justPosted[0].id, false);
        if (showResults) {
          testResults += addToResults(`Reset Created Brkt: ${justPosted[0].fee}`);
        }
      }
      return all;
    } catch (error: any) {
      testResults += addToResults(`Remove Created Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    }
  };

  const resetBrktToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: brktToUpdate,
        withCredentials: true,
        url: brktIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Reset Brkt: ${brktToUpdate.fee}`);
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

  const reAddDeletedBrkt = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delUrl = url + "/" + brktToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delUrl,
        });
        // if brkt already exisits, do not delete it
        if (response.status === 200) {
          return {
            data: brktToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if brkt does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAddBrkt = {
        ...brktToDel,
      };
      reAddBrkt.id = nextPostSecret + reAddBrkt.id;
      const reAddJSON = JSON.stringify(reAddBrkt);
      response = await axios({
        method: "post",
        data: reAddJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: brktToDel,
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

  const brktCreate = async () => {
    let testResults: string = results + "Create Brkt tests: \n";
    let createdId: string = "";
    passed = true;

    const deleteCreated = async () => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url,
        });
        if (response.status === 200) {
          const all: brktType[] = response.data.brkts as unknown as brktType[];
          const justCreated = all.filter((obj) => obj.fee === brktToPost.fee);
          if (justCreated.length === 1) {
            await brktDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created brkt", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const invalidCreate = async (propertyName: string, value: any) => {
      try {
        const invalidJSON = JSON.stringify({
          ...brktToUpdate,
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
            `Create Brkt Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error creating brkt with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Brkt, non 422 response for brkt: ${brktToUpdate.fee} - invalid data`
          );
          return {
            error: "Error Creating Brkt, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create brkt: ${brktToUpdate.fee} - invalid ${propertyName}`
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
            error: `Error Creating brkt with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const createDuplicate = async () => {
      try {
        const duplicate = {
          ...brktDuplicate,
          id: "",
        };
        const dupJSON = JSON.stringify(duplicate);
        const invalidResponse = await axios({
          method: "post",
          data: dupJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Brkt Error: did not return 422 for duplicate start+div_id`,
            false
          );
          return {
            error: `Error creating brkt with duplicate start+div_id`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Brkt, non 422 response for duplicate start+div_id`
          );
          return {
            error: "Error Creating Brkt, non 422 response for duplicate start+div_id",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Create brkt: duplicate start+div_id`);
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Create Error: did not return 422 for duplicate start+div_id`,
            false
          );
          return {
            error: `Error Creating brkt with duplicate start+div_id`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await deleteCreated();

      const createJSON = JSON.stringify(brktToPost);
      const response = await axios({
        method: "post",
        data: createJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdId = response.data.brkt.id;
        testResults += addToResults(`Created brkt: ${response.data.brkt.fee}`);
        const postedBrkt: brktType = response.data.brkt;
        if (postedBrkt.div_id !== brktToPost.div_id) {
          testResults += addToResults("Created brkt div_id !== brktToPost.div_id", false);
        } else if (postedBrkt.squad_id !== brktToPost.squad_id) {
          testResults += addToResults(
            "Created brkt squad_id !== brktToPost.squad_id",
            false
          );
        } else if (postedBrkt.fee !== brktToPost.fee) {
          testResults += addToResults(
            "Created brkt fee !== brktToPost.fee",
            false
          );
        } else if (postedBrkt.start !== brktToPost.start) {
          testResults += addToResults(
            "Created brkt start !== brktToPost.start",
            false
          );
        } else if (postedBrkt.games !== brktToPost.games) {
          testResults += addToResults(
            "Created brkt games !== brktToPost.games",
            false
          );
        } else if (postedBrkt.first !== brktToPost.first) {
          testResults += addToResults(
            "Created brkt first !== brktToPost.first",
            false
          );
        } else if (postedBrkt.second !== brktToPost.second) {
          testResults += addToResults(
            "Created brkt second !== brktToPost.second",
            false
          );
        } else if (postedBrkt.admin !== brktToPost.admin) {
          testResults += addToResults(
            "Created brkt admin !== brktToPost.admin",
            false
          );
        } else if (postedBrkt.fsa !== brktToPost.fsa) {
          testResults += addToResults(
            "Created brkt fsa !== brktToPost.fsa",
            false
          );
        } else if (postedBrkt.sort_order !== brktToPost.sort_order) {
          testResults += addToResults(
            "Created brkt sort_order !== brktToPost.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Created brkt === brktToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating brkt: ${brktToPost.fee}, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not create brkt",
          status: response.status,
        };
      }

      await invalidCreate("div_id", "bwl_123");
      await invalidCreate("squad_id", "div_12345678901234567890123456789012");
      await invalidCreate("fee", "-1");
      await invalidCreate("start", 0);
      await invalidCreate("games", 12345);
      await invalidCreate("first", '');
      await invalidCreate("second", "1234567890");
      await invalidCreate("admin", "abc");
      await invalidCreate("sort_order", -1);
      await invalidCreate("fsa", '41');   // fee * players !== fsa
      await invalidCreate("fee", '6');    // fee * players !== fsa
      await invalidCreate('first', '10'); // fee * players !== first + second + admin
      await createDuplicate();

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdId) {
        await brktDelete(createdId, false);
      }
      if (passed) {
        testResults += addToResults(`Create Brkt tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create Brkt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const brktReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Brkts tests: \n";
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
            `Success: Read ${response.data.brkts.length} Brkts`,
            true
          );
        }
        const all: brktType[] = response.data.brkts as unknown as brktType[];
        // 5 brkts in /prisma/seeds.ts
        const seedCount = 5;
        if (all.length === seedCount) {
          testResults += addToResults(`Read all ${seedCount} brkts`, true);
        } else {
          testResults += addToResults(
            `Error: Read ${all.length} brkts, expected ${seedCount}`,
            false
          );
        }
        return response.data.brkts;
      } else {
        testResults += addToResults(
          `Error reading all brkts, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read all brkts",
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
          testResults += addToResults(`Read All Brkts tests: PASSED`, true);
        } else {
          testResults += addToResults(`Read All Brkts tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const brktRead1 = async () => {
    let testResults = results + "Read 1 Brkt tests: \n";
    passed = true;

    const readInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: invalidUrl,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read 1 Brkt Error: did not return 404 for invalid id ${id}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 Brkt, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 Brkt, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read 1 Brkt: invalid id: ${id}`);
          return {
            error: `invalid id: ${id}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read 1 Brkt Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Reading 1 Brkt, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testBrkt: brktType = {
      ...brktToUpdate,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: brktIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 Brkt: ${response.data.brkt.fee}`,
          true
        );
        const readBrkt: brktType = response.data.brkt;
        if (readBrkt.div_id !== testBrkt.div_id) {
          testResults += addToResults("Read 1 Brkt div_id !== testBrkt.div_id", false);
        } else if (readBrkt.squad_id !== testBrkt.squad_id) {
          testResults += addToResults("Read 1 Brkt squad_id !== testBrkt.squad_id", false);
        } else if (readBrkt.fee !== testBrkt.fee) {
          testResults += addToResults("Read 1 Brkt fee !== testBrkt.fee", false);
        } else if (readBrkt.start !== testBrkt.start) {
          testResults += addToResults("Read 1 Brkt start !== testBrkt.start", false);
        } else if (readBrkt.games !== testBrkt.games) {
          testResults += addToResults("Read 1 Brkt games !== testBrkt.games", false);
        } else if (readBrkt.players !== testBrkt.players) {
          testResults += addToResults("Read 1 Brkt players !== testBrkt.players", false);
        } else if (readBrkt.first !== testBrkt.first) {
          testResults += addToResults("Read 1 Brkt first !== testBrkt.first", false);
        } else if (readBrkt.second !== testBrkt.second) {
          testResults += addToResults("Read 1 Brkt second !== testBrkt.second", false);
        } else if (readBrkt.admin !== testBrkt.admin) {
          testResults += addToResults("Read 1 Brkt admin !== testBrkt.admin", false);
        } else if (readBrkt.fsa !== testBrkt.fsa) {
          testResults += addToResults("Read 1 Brkt fsa !== testBrkt.fsa", false);
        } else if (readBrkt.sort_order !== testBrkt.sort_order) {
          testResults += addToResults(
            "Read 1 Brkt sort_order !== testBrkt.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Read 1 Brkt === testBrkt`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 brkt, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read 1 brkt",
          status: response.status,
        };
      }

      // test invalid url
      await readInvalidId("abc_123");
      // test non existing brkt
      await readInvalidId("brk_12345678901234567890123456789012");

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
        testResults += addToResults(`Read 1 Brkt tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 Brkt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const brktReadForDiv = async () => {
    let testResults = results + "Read Brkts for a Div tests: \n";
    passed = true;

    const validReadForDiv = async (divId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/div/" + divId,
        });
        if (response.status === 200) {
          testResults += addToResults(`Success: Read Brkts for Div, div_id: ${divId}`);
          const readBrkts: brktType[] = response.data.brkts;
          if (divId === multiBrktsDivId) {
            if (readBrkts.length !== 2) {
              testResults += addToResults(
                "Error: Read Brkts for Div length !== 2",
                false
              );
              return {
                error: "Error: Read Brkts for Div, length !== 2",
                status: 404,
              };
            }
            readBrkts.forEach((brkt: brktType) => {
              if (
                !(
                  brkt.id === "brk_5109b54c2cc44ff9a3721de42c80c8c1" ||
                  brkt.id === "brk_6ede2512c7d4409ca7b055505990a499"
                )
              ) {
                testResults += addToResults(
                  "Error: Read Brkts for Div brkt.id invalid",
                  false
                );
                return {
                  error: "Error: Read Brkts for Div, brkt.id invalid",
                  status: 404,
                };
              }
            });
          } else if (divId === noBrktsDivId) {
            if (readBrkts.length !== 0) {
              testResults += addToResults(
                "Error: Read Brkts for Div length !== 0",
                false
              );
              return {
                error: "Error: Read Brkts for Div, length !== 0",
                status: 404,
              };
            }
          }
          testResults += addToResults(
            `Success: Read Brkts for Div, ${readBrkts.length} rows returned`
          );
        } else {
          testResults += addToResults(
            `Error reading brkts for div, response status: ${response.status}`,
            false
          );
          return {
            error: "Did not read brkts for div",
            status: response.status,
          };
        }
        return response.data.brkts;
      } catch (error: any) {
        testResults += addToResults(`Read Brkts for Div Error: ${error.message}`, false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const invalidReadForDiv = async (divId: string) => {
      try {
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/div/" + divId,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read Brkts for Div Error: did not return 404 for invalid id ${divId}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${divId}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read Brkts for Div, non 404 response for invalid id: ${divId}`
          );
          return {
            error: `Error Reading Brkts for Div, non 404 response for invalid id: ${divId}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read Brkts for Div: invalid id: ${divId}`
          );
          return {
            error: `invalid id: ${divId}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read Brkts for Div Error: did not return 404 for invalid id: ${divId}`,
            false
          );
          return {
            error: `Error Reading Brkts for Div, non 404 response for invalid id: ${divId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await validReadForDiv(multiBrktsDivId);
      await validReadForDiv(noBrktsDivId);

      await invalidReadForDiv("tmt_123");
      await invalidReadForDiv("sqd_12345678901234567890123456789012");
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
        testResults += addToResults(`Read Brkts for a Div tests: PASSED`);
      } else {
        testResults += addToResults(`Read Brkts for a Div tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const brktReadForSquad = async () => {
    let testResults = results + "Read Brkts for a Squad tests: \n";
    passed = true;

    const validReadForSquad = async (squadId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/squad/" + squadId,
        });
        if (response.status === 200) {
          testResults += addToResults(`Success: Read Brkts for Squad, squad_id: ${squadId}`);
          const readBrkts: brktType[] = response.data.brkts;
          if (squadId === multiBrktsSquadId) {
            if (readBrkts.length !== 2) {
              testResults += addToResults(
                "Error: Read Brkts for Squad length !== 2",
                false
              );
              return {
                error: "Error: Read Brkts for Squad, length !== 2",
                status: 404,
              };
            }
            readBrkts.forEach((brkt: brktType) => {
              if (
                !(
                  brkt.id === "brk_5109b54c2cc44ff9a3721de42c80c8c1" ||
                  brkt.id === "brk_6ede2512c7d4409ca7b055505990a499"
                )
              ) {
                testResults += addToResults(
                  "Error: Read Brkts for Squad brkt.id invalid",
                  false
                );
                return {
                  error: "Error: Read Brkts for Squad, brkt.id invalid",
                  status: 404,
                };
              }
            });
          } else if (squadId === noBrktsDivId) {
            if (readBrkts.length !== 0) {
              testResults += addToResults(
                "Error: Read Brkts for Squad length !== 0",
                false
              );
              return {
                error: "Error: Read Brkts for Squad, length !== 0",
                status: 404,
              };
            }
          }
          testResults += addToResults(
            `Success: Read Brkts for Squad, ${readBrkts.length} rows returned`
          );
        } else {
          testResults += addToResults(
            `Error reading brkts for squad, response status: ${response.status}`,
            false
          );
          return {
            error: "Did not read brkts for squad",
            status: response.status,
          };
        }
        return response.data.brkts;
      } catch (error: any) {
        testResults += addToResults(`Read Brkts for Squad Error: ${error.message}`, false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const invalidReadForSquad = async (squadId: string) => {
      try {
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/squad/" + squadId,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read Brkts for Squad Error: did not return 404 for invalid id ${squadId}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${squadId}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read Brkts for Squad, non 404 response for invalid id: ${squadId}`
          );
          return {
            error: `Error Reading Brkts for Squad, non 404 response for invalid id: ${squadId}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read Brkts for Squad: invalid id: ${squadId}`
          );
          return {
            error: `invalid id: ${squadId}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read Brkts for Squad Error: did not return 404 for invalid id: ${squadId}`,
            false
          );
          return {
            error: `Error Reading Brkts for Squad, non 404 response for invalid id: ${squadId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await validReadForSquad(multiBrktsSquadId);
      await validReadForSquad(noBrktsSquadId);

      await invalidReadForSquad("tmt_123");
      await invalidReadForSquad("sqd_12345678901234567890123456789012");
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
        testResults += addToResults(`Read Brkts for a Squad tests: PASSED`);
      } else {
        testResults += addToResults(`Read Brkts for a Squad tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const brktUpdate = async () => {
    let testResults = results + "Update Brkt tests: \n";
    passed = true;

    const updateValid = async () => {
      try {
        const updateJSON = JSON.stringify(brktUpdatedTo);
        const response = await axios({
          method: "put",
          data: updateJSON,
          withCredentials: true,
          url: brktIdUrl,
        });
        if (response.status !== 200) {
          const errMsg = (response as any).message;
          testResults += addToResults(`Error: ${errMsg.message}`, false);
          return response;
        }
        const updated: brktType = response.data.brkt;
        if (updated.div_id !== brktUpdatedTo.div_id) {
          testResults += addToResults(
            "Updated brkt div_id !== potUpdatedTo.div_id",
            false
          );
        } else if (updated.squad_id !== brktUpdatedTo.squad_id) {
          testResults += addToResults(
            "Updated brkt squad_id !== potUpdatedTo.squad_id",
            false
          );
        } else if (updated.fee !== brktUpdatedTo.fee) {
          testResults += addToResults(
            "Updated brkt div_name !== potUpdatedTo.fee",
            false
          );
        } else if (updated.start !== brktUpdatedTo.start) {
          testResults += addToResults(
            "Updated brkt start !== potUpdatedTo.start",
            false
          );
        } else if (updated.games !== brktUpdatedTo.games) {
          testResults += addToResults(
            "Updated brkt games !== potUpdatedTo.games",
            false
          );
        } else if (updated.players !== brktUpdatedTo.players) {
          testResults += addToResults(
            "Updated brkt players !== potUpdatedTo.players",
            false
          );
        } else if (updated.first !== brktUpdatedTo.first) {
          testResults += addToResults(
            "Updated brkt first !== potUpdatedTo.first",
            false
          );
        } else if (updated.second !== brktUpdatedTo.second) {
          testResults += addToResults(
            "Updated brkt second !== potUpdatedTo.second",
            false
          );
        } else if (updated.admin !== brktUpdatedTo.admin) {
          testResults += addToResults(
            "Updated brkt admin !== potUpdatedTo.admin",
            false
          );
        } else if (updated.fsa !== brktUpdatedTo.fsa) {
          testResults += addToResults(
            "Updated brkt fsa !== potUpdatedTo.fsa",
            false
          );
        } else if (updated.sort_order !== brktUpdatedTo.sort_order) {
          testResults += addToResults(
            "Updated brkt sort_order !== potUpdatedTo.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Updated Brkt: ${updated.id}`);
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
          ...brktToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "put",
          data: invalidJSON,
          withCredentials: true,
          url: brktIdUrl,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Update Brkt Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error updating brkt with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Update Brkt, non 422 response for brkt: ${brktToUpdate.id} - invalid data`
          );
          return {
            error: "Error Updating Brkt, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Update brkt: ${brktToUpdate.id} - invalid ${propertyName}`
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
            error: `Error Updating brkt with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontUpdateInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidJSON = JSON.stringify(brktUpdatedTo);
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
          testResults += addToResults(`DID NOT update Brkt, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT update Brkt, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Update Brkt Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Updating Brkt, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontUpdateDuplicate = async () => {
      // get url with id of brkt to duplicate
      const duplicatIdUrl = url + "/" + "brk_37345eb6049946ad83feb9fdbb43a307";
      try {
        const dupJSON = JSON.stringify(brktDuplicate);
        const response = await axios({
          method: "put",
          data: dupJSON,
          withCredentials: true,
          url: duplicatIdUrl,
        });
        if (response.status === 200) {
          testResults += addToResults(`Error: updated duplicate start+div_id`, false);
          return response;
        } else {
          testResults += addToResults(
            `DID NOT update Brkt, duplicate start+div_id`,
            false
          );
        }
        return response;
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT update Brkt, duplicate start+div_id`);
        } else {
          testResults += addToResults(
            `Update Brkt Error: did not return 422 for duplicate start+div_id`,
            false
          );
          return {
            error: `Error Updating Brkt, non 422 response for duplicate start+div_id`,
            status: error.response.status,
          };
        }
        return error;
      }
    };

    try {
      // 1) valid full brkt object
      const updated = await updateValid();

      // 2) invalid Brkt object
      await invalidUpdate("div_id", "bwl_123");
      await invalidUpdate("squad_id", "usr_12345678901234567890123456789012");
      await invalidUpdate("fee", "0");
      await invalidUpdate("start", 0);      
      await invalidUpdate("sort_order", "abc");

      // 3) invalid Brkt id
      await dontUpdateInvalidId("abc_123");
      // 4 non existing Brkt id
      await dontUpdateInvalidId("brk_12345678901234567890123456789012");

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
      const reset = await resetBrktToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update Brkt tests: PASSED`, true);
      } else {
        testResults += addToResults(`Update Brkt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const brktPatch = async () => {
    let testResults = results + "Patch Brkt tests: \n";
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
          url: brktIdUrl,
        });
        if (response.status === 200) {
          if (response.data.brkt[propertyName] === matchValue) {
            testResults += addToResults(
              `Patched Brkt: ${brktToUpdate.id} - just ${propertyName}`
            );
          } else {
            testResults += addToResults(`DID NOT Patch Brkt ${propertyName}`, false);
          }
          return {
            data: response.data.brkt,
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
        testResults += addToResults(`doPatch Error: ${error.message} for ${propertyName}`, false);
        return {
          error: error.message,
          status: 404,
        };
      } finally {
        const reset = await resetBrktToUpdate(false);
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
          url: brktIdUrl,
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
            `Patch Brkt, non 422 response for brkt: ${brktToUpdate.id} - invalid ${propertyName}`
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Brkt: ${brktToUpdate.id} - invalid ${propertyName}`
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
        const invalidJSON = JSON.stringify(brktUpdatedTo);
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
          testResults += addToResults(`DID NOT patch Brkt, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT patch Brkt, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Patch Brkt Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Patching Brkt, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const doPatchFsa = async () => {      
      try {
        const patchJSON = JSON.stringify({
          fee: "3",
          first: "15",
          second: "6",
          admin: "3",
        });
        const response = await axios({
          method: "patch",
          data: patchJSON,
          withCredentials: true,
          url: brktIdUrl,
        });
        if (response.status === 200) {
          if (response.data.brkt.fee === '3' &&
              response.data.brkt.first === '15' &&
              response.data.brkt.second === '6' &&
              response.data.brkt.admin === '3') {
            testResults += addToResults(
              `Patched Brkt: ${brktToUpdate.id} - fee & fsa values`
            );
          } else {
            testResults += addToResults(`DID NOT Patch Brkt fee & fsa values`, false);
          }
          return {
            data: response.data.brkt,
            status: response.status,
          };
        } else {
          testResults += addToResults(`doPatch Error: fee & fsa values`, false);
          return {
            error: `Error Patching fee & fsa values`,
            status: response.status,
          };
        }        
      } catch (err: any) {
        testResults += addToResults(`doPatch Error: ${err.message} for fee & fsa values`, false);
        return {
          error: err.message,
          status: 404,
        };
      } finally {
        const reset = await resetBrktToUpdate(false);        
      }
    }

    try {      

      await doPatch("div_id", "div_578834e04e5e4885bbae79229d8b96e8", "div_578834e04e5e4885bbae79229d8b96e8");
      await dontPatch("div_id", "<script>alert(1)</script>");

      await doPatch("squad_id", 'sqd_42be0f9d527e4081972ce8877190489d', 'sqd_42be0f9d527e4081972ce8877190489d');
      await dontPatch("squad_id", 'sqd_12345678901234567890123456789012');

      await doPatch("start", 2, 2);
      await dontPatch("start", 0);

      await dontPatch("fee", '15');
      await dontPatch("fee", 'abc');

      await dontPatch("first", '15');
      await dontPatch("first", '');

      await dontPatch("second", '15');
      await dontPatch("second", '-1');

      await dontPatch('admin', '4');
      await dontPatch('admin', '1234567890');

      await doPatch("sort_order", 5, 5);
      await dontPatch("sort_order", -1);

      await doPatchFsa();

      await dontPatchInvalidId("abc_123");
      await dontPatchInvalidId("bwl_12345678901234567890123456789012");

      return brktToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetBrktToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Brkt tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Brkt tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const brktDelete = async (brktIdToDel: string, testing: boolean = true) => {
    let testResults = results + "Delete Brkt tests: \n";
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
            `Did not not delete Brkt with invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Error: Could not delete Brkt with invalid id: "${invalidId}"`,
            false
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `Did not not delete Brkt - invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(`Delete Brkt Error: ${error.message}`, false);
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
    };

    const delUrl = url + "/" + brktIdToDel;
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: delUrl,
      });
      if (response.status === 200) {
        // if brktIdToDel !== brktToDel.id, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (brktIdToDel === brktToDel.id) {
          if (response.data.deleted.fee === brktToDel.fee) {
            testResults += addToResults(
              `Success: Deleted Brkt: ${brktToDel.fee} - got fsa in response`
            );
          } else {
            testResults += addToResults(
              `Error Deleted Brkt: ${brktToDel.fee}: no fsa in response`,
              false
            );
            return {
              error: "No fsa in response",
              status: 404,
            };
          }
          testResults += addToResults(
            `Success: Deleted Brkt: ${response.data.deleted.fee}`
          );
        }
      } else {
        testResults += addToResults("Error: could not delete brkt", false);        
        return {
          error: "Could not delete brkt",
          status: 404,
        };
      }

      if (testing) {
        // try to delete Brkt that is parent to tmnt
        // no child tables for pots
        
        await invalidDelete("abc_123");
        await invalidDelete("brk_12345678901234567890123456789012");
      }
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Error : ${error.message}`, false);
      // if testing, finally will not show error
      if (!testing) {
        setResults(testResults);
      }
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await reAddDeletedBrkt();
      if (testing) {
        if (passed) {
          testResults += addToResults(`Delete Brkt tests: PASSED`, true);
        } else {
          testResults += addToResults(`Delete Brkt tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const resetAll = async () => {
    let testResults: string = "";
    passed = true;
    try {
      const reset = await resetBrktToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allBrkts: any = await removeCreatedBrkt(true);
      if (allBrkts.error) {
        testResults += addToResults(`Error Resetting: ${allBrkts.error}`, false);
        return;
      }

      const reAdded: any = await reAddDeletedBrkt();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Brkts`);
      return {
        divs: allBrkts,
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
    setBrktCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetAll();
  };

  const handleBrktTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (brktCrud) {
      case "create":
        await brktCreate();
        break;
      case "read":
        await brktReadAll(true);
        break;
      case "read1":
        await brktRead1();
        break;
      case "update":
        await brktUpdate();
        break;
      case "patch":
        await brktPatch();
        break;
      case "delete":
        await brktDelete(brktToDel.id);
        break;
      case "readDiv":
        await brktReadForDiv();
        break;
      case "readSquad":
        await brktReadForSquad();
        break;
      default:
        break;
    }
  };

  const handleBrktTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = "Testing all...";
    passed = true;
    try {
      await brktCreate();
      allResults = results;
      await brktReadAll(true);
      allResults = results;
      await brktRead1();
      allResults = results;
      await brktUpdate();
      allResults = results;
      await brktPatch();
      allResults = results;
      await brktDelete(brktToDel.id);
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
          <h4>Brackets</h4>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-success" id="brktTest" onClick={handleBrktTest}>
            Test
          </button>
        </div>
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="brktTestAll"
            onClick={handleBrktTestAll}
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button className="btn btn-warning" id="brktClear" onClick={handleClear}>
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-info" id="brktReset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="brktCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="brktCreate"
            name="brkt"
            value="create"
            checked={brktCrud === "create"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="brktRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="brktRead"
            name="brkt"
            value="read"
            checked={brktCrud === "read"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="brktRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="brktRead1"
            name="brkt"
            value="read1"
            checked={brktCrud === "read1"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="brktUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="brktUpdate"
            name="brkt"
            value="update"
            checked={brktCrud === "update"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="brktPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="brktPatch"
            name="brkt"
            value="patch"
            checked={brktCrud === "patch"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="brktDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="brktDelete"
            name="brkt"
            value="delete"
            checked={brktCrud === "delete"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2"></div>
        <div className="col-sm-2">
          <label htmlFor="brktReadDiv" className="form-check-label">
            &nbsp;Read Div &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="brktReadDiv"
            name="brkt"
            value="readDiv"
            checked={brktCrud === "readDiv"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-3">
          <label htmlFor="brktReadSquad" className="form-check-label">
            &nbsp;Read Squad &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="brktReadSquad"
            name="brkt"
            value="readSquad"
            checked={brktCrud === "readSquad"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="brktResults"
            name="brktResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
