import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { potType, PotCategories } from "@/lib/types/types";
import { initPot } from "@/db/initVals";

const url = baseApi + "/pots";
const potId = "pot_b2a7b02d761b4f5ab5438be84f642c3b";
const potIdUrl = url + "/" + potId;
const multiPotsDivId = 'div_1f42042f9ef24029a0a2d48cc276a087'
const multiPotsSquadId = "sqd_1a6c885ee19a49489960389193e8f819";
const noPotsDivId = "div_578834e04e5e4885bbae79229d8b96e8";
const noPotsSquadId = "sqd_42be0f9d527e4081972ce8877190489d";
let passed = true;
let allResults = "";

export const DbPots = () => {
  const [potCrud, setPotCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
    // force textarea to scroll to bottom
    var textarea = document.getElementById("potResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const potToPost: potType = {
    ...initPot,
    id: "",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",    
    fee: '10',
    pot_type: "Series" as PotCategories,
    sort_order: 2,
  };

  const potToUpdate: potType = {
    ...initPot,
    id: "pot_b2a7b02d761b4f5ab5438be84f642c3b",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",    
    fee: '20',
    pot_type: "Game",
    sort_order: 1,
  };

  const potUpdatedTo: potType = {
    ...initPot,
    id: "pot_ab80213899ea424b938f52a062deacfe",
    squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
    div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
    fee: '11',
    pot_type: "Series",
    sort_order: 3,
  };

  const potDuplicate: potType = {
    ...initPot,
    id: "",
    squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
    div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
    pot_type: "Game",
    fee: '10',
    sort_order: 3,    
};

  const potToDel: potType = {
    ...initPot,
    id: "pot_e3758d99c5494efabb3b0d273cf22e7a",
    squad_id: "sqd_20c24199328447f8bbe95c05e1b84644",
    div_id: "div_29b9225d8dd44a4eae276f8bde855729",
    fee: '20',
    pot_type: "Game",
    sort_order: 1,
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

  const removeCreatedPot = async (showResults: boolean) => {
    let testResults = results;
    try {
      const all: potType[] = (await potReadAll(false)) as unknown as potType[];
      const justPosted = all.filter((obj) => obj.pot_type === potToPost.pot_type);
      if (justPosted.length === 1) {
        await potDelete(justPosted[0].id, false);
        if (showResults) {
          testResults += addToResults(`Reset Created Pot: ${justPosted[0].pot_type}`);
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

  const resetPotToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: potToUpdate,
        withCredentials: true,
        url: potIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Reset Pot: ${potToUpdate.pot_type}`);
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

  const reAddDeletedPot = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delUrl = url + "/" + potToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delUrl,
        });
        // if pot already exisits, do not delete it
        if (response.status === 200) {
          return {
            data: potToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if pot does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAddPot = {
        ...potToDel,
      };
      reAddPot.id = nextPostSecret + reAddPot.id;
      const reAddJSON = JSON.stringify(reAddPot);
      response = await axios({
        method: "post",
        data: reAddJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: potToDel,
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

  const potCreate = async () => {
    let testResults: string = results + "Create Pot tests: \n";
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
          const all: potType[] = response.data.pots as unknown as potType[];
          const justCreated = all.filter((obj) => obj.pot_type === potToPost.pot_type);
          if (justCreated.length === 1) {
            await potDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created pot", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const invalidCreate = async (propertyName: string, value: any) => {
      try {
        const invalidJSON = JSON.stringify({
          ...potToUpdate,
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
            `Create Pot Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error creating pot with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Pot, non 422 response for pot: ${potToUpdate.pot_type} - invalid data`
          );
          return {
            error: "Error Creating Pot, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create pot: ${potToUpdate.pot_type} - invalid ${propertyName}`
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
            error: `Error Creating pot with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const createDuplicate = async () => {
      try {
        const duplicate = {
          ...potDuplicate,
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
            `Create Pot Error: did not return 422 for duplicate pot_type+div_id`,
            false
          );
          return {
            error: `Error creating pot with duplicate pot_type+div_id`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Pot, non 422 response for duplicate pot_type+div_id`
          );
          return {
            error: "Error Creating Pot, non 422 response for duplicate pot_type+div_id",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Create pot: duplicate pot_type+div_id`);
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Create Error: did not return 422 for duplicate pot_type+div_id`,
            false
          );
          return {
            error: `Error Creating pot with duplicate pot_type+div_id`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await deleteCreated();

      const createJSON = JSON.stringify(potToPost);
      const response = await axios({
        method: "post",
        data: createJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdId = response.data.pot.id;
        testResults += addToResults(`Created pot: ${response.data.pot.pot_type}`);
        const postedPot: potType = response.data.pot;
        if (postedPot.div_id !== potToPost.div_id) {
          testResults += addToResults("Created pot div_id !== potToPost.div_id", false);
        } else if (postedPot.squad_id !== potToPost.squad_id) {
          testResults += addToResults(
            "Created pot squad_id !== potToPost.squad_id",
            false
          );
        } else if (postedPot.pot_type !== potToPost.pot_type) {
          testResults += addToResults(
            "Created pot div_name !== potToPost.pot_type",
            false
          );
        } else if (postedPot.fee !== potToPost.fee) {
          testResults += addToResults(
            "Created pot fee !== potToPost.fee",
            false
          );
        } else if (postedPot.sort_order !== potToPost.sort_order) {
          testResults += addToResults(
            "Created pot sort_order !== potToPost.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Created pot === potToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating pot: ${potToPost.pot_type}, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not create pot",
          status: response.status,
        };
      }

      await invalidCreate("div_id", "bwl_123");
      await invalidCreate("squad_id", "div_12345678901234567890123456789012");
      await invalidCreate("pot_type", "Test");
      await invalidCreate("fee", '-1');
      await invalidCreate("sort_order", '-1');
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
        await potDelete(createdId, false);
      }
      if (passed) {
        testResults += addToResults(`Create Pot tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create Pot tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const potReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Pots tests: \n";
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
            `Success: Read ${response.data.pots.length} Pots`,
            true
          );
        }
        const all: potType[] = response.data.pots as unknown as potType[];
        // 4 pots in /prisma/seeds.ts
        const seedCount = 4;
        if (all.length === seedCount) {
          testResults += addToResults(`Read all ${seedCount} pots`, true);
        } else {
          testResults += addToResults(
            `Error: Read ${all.length} pots, expected ${seedCount}`,
            false
          );
        }
        return response.data.pots;
      } else {
        testResults += addToResults(
          `Error reading all pots, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read all pots",
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
          testResults += addToResults(`Read All Pots tests: PASSED`, true);
        } else {
          testResults += addToResults(`Read All Pots tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const potRead1 = async () => {
    let testResults = results + "Read 1 Pot tests: \n";
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
            `Read 1 Pot Error: did not return 404 for invalid id ${id}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 Pot, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 Pot, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read 1 Pot: invalid id: ${id}`);
          return {
            error: `invalid id: ${id}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read 1 Pot Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Reading 1 Pot, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testPot: potType = {
      ...potToUpdate,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: potIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 Pot: ${response.data.pot.pot_type}`,
          true
        );
        const readPot: potType = response.data.pot;
        if (readPot.div_id !== testPot.div_id) {
          testResults += addToResults("Read 1 Pot div_id !== testPot.div_id", false);
        } else if (readPot.squad_id !== testPot.squad_id) {
          testResults += addToResults("Read 1 Pot squad_id !== testPot.squad_id", false);
        } else if (readPot.pot_type !== testPot.pot_type) {
          testResults += addToResults("Read 1 Pot pot_type !== testPot.pot_type", false);
        } else if (readPot.fee !== testPot.fee) {
          testResults += addToResults("Read 1 Pot fee !== testPot.fee", false);
        } else if (readPot.sort_order !== testPot.sort_order) {
          testResults += addToResults(
            "Read 1 Pot sort_order !== testPot.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Read 1 Pot === testPot`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 pot, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read 1 pot",
          status: response.status,
        };
      }

      // test invalid url
      await readInvalidId("abc_123");
      // test non existing pot
      await readInvalidId("pot_12345678901234567890123456789012");

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
        testResults += addToResults(`Read 1 Pot tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 Pot tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const potReadForDiv = async () => {
    let testResults = results + "Read Pots for a Div tests: \n";
    passed = true;

    const validReadForDiv = async (divId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/div/" + divId,
        });
        if (response.status === 200) {
          testResults += addToResults(`Success: Read Pots for Div, div_id: ${divId}`);
          const readPots: potType[] = response.data.pots;
          if (divId === multiPotsDivId) {
            if (readPots.length !== 2) {
              testResults += addToResults(
                "Error: Read Pots for Div length !== 2",
                false
              );
              return {
                error: "Error: Read Pots for Div, length !== 2",
                status: 404,
              };
            }
            readPots.forEach((pot: potType) => {
              if (
                !(
                  pot.id === "pot_98b3a008619b43e493abf17d9f462a65" ||
                  pot.id === "pot_ab80213899ea424b938f52a062deacfe"
                )
              ) {
                testResults += addToResults(
                  "Error: Read Pots for Div pot.id invalid",
                  false
                );
                return {
                  error: "Error: Read Pots for Div, pot.id invalid",
                  status: 404,
                };
              }
            });
          } else if (divId === noPotsDivId) {
            if (readPots.length !== 0) {
              testResults += addToResults(
                "Error: Read Pots for Div length !== 0",
                false
              );
              return {
                error: "Error: Read Pots for Div, length !== 0",
                status: 404,
              };
            }
          }
          testResults += addToResults(
            `Success: Read Pots for Div, ${readPots.length} rows returned`
          );
        } else {
          testResults += addToResults(
            `Error reading pots for div, response status: ${response.status}`,
            false
          );
          return {
            error: "Did not read pots for div",
            status: response.status,
          };
        }
        return response.data.pots;
      } catch (error: any) {
        testResults += addToResults(`Read Pots for Div Error: ${error.message}`, false);
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
            `Read Pots for Div Error: did not return 404 for invalid id ${divId}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${divId}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read Pots for Div, non 404 response for invalid id: ${divId}`
          );
          return {
            error: `Error Reading Pots for Div, non 404 response for invalid id: ${divId}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read Pots for Div: invalid id: ${divId}`
          );
          return {
            error: `invalid id: ${divId}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read Pots for Div Error: did not return 404 for invalid id: ${divId}`,
            false
          );
          return {
            error: `Error Reading Pots for Div, non 404 response for invalid id: ${divId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await validReadForDiv(multiPotsDivId);
      await validReadForDiv(noPotsDivId);

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
        testResults += addToResults(`Read Pots for a Div tests: PASSED`);
      } else {
        testResults += addToResults(`Read Pots for a Div tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const potReadForSquad = async () => {
    let testResults = results + "Read Pots for a Squad tests: \n";
    passed = true;

    const validReadForSquad = async (squadId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/squad/" + squadId,
        });
        if (response.status === 200) {
          testResults += addToResults(`Success: Read Pots for Squad, squad_id: ${squadId}`);
          const readPots: potType[] = response.data.pots;
          if (squadId === multiPotsSquadId) {
            if (readPots.length !== 2) {
              testResults += addToResults(
                "Error: Read Pots for Squad length !== 2",
                false
              );
              return {
                error: "Error: Read Pots for Squad, length !== 2",
                status: 404,
              };
            }
            readPots.forEach((pot: potType) => {
              if (
                !(
                  pot.id === "pot_98b3a008619b43e493abf17d9f462a65" ||
                  pot.id === "pot_ab80213899ea424b938f52a062deacfe"
                )
              ) {
                testResults += addToResults(
                  "Error: Read Pots for Squad pot.id invalid",
                  false
                );
                return {
                  error: "Error: Read Pots for Squad, pot.id invalid",
                  status: 404,
                };
              }
            });
          } else if (squadId === noPotsDivId) {
            if (readPots.length !== 0) {
              testResults += addToResults(
                "Error: Read Pots for Squad length !== 0",
                false
              );
              return {
                error: "Error: Read Pots for Squad, length !== 0",
                status: 404,
              };
            }
          }
          testResults += addToResults(
            `Success: Read Pots for Squad, ${readPots.length} rows returned`
          );
        } else {
          testResults += addToResults(
            `Error reading pots for squad, response status: ${response.status}`,
            false
          );
          return {
            error: "Did not read pots for squad",
            status: response.status,
          };
        }
        return response.data.pots;
      } catch (error: any) {
        testResults += addToResults(`Read Pots for Squad Error: ${error.message}`, false);
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
            `Read Pots for Squad Error: did not return 404 for invalid id ${squadId}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${squadId}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read Pots for Squad, non 404 response for invalid id: ${squadId}`
          );
          return {
            error: `Error Reading Pots for Squad, non 404 response for invalid id: ${squadId}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read Pots for Squad: invalid id: ${squadId}`
          );
          return {
            error: `invalid id: ${squadId}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read Pots for Squad Error: did not return 404 for invalid id: ${squadId}`,
            false
          );
          return {
            error: `Error Reading Pots for Squad, non 404 response for invalid id: ${squadId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await validReadForSquad(multiPotsSquadId);
      await validReadForSquad(noPotsSquadId);

      await invalidReadForSquad("tmt_123");
      await invalidReadForSquad("div_12345678901234567890123456789012");
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
        testResults += addToResults(`Read Pots for a Squad tests: PASSED`);
      } else {
        testResults += addToResults(`Read Pots for a Squad tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const potUpdate = async () => {
    let testResults = results + "Update Pot tests: \n";
    passed = true;

    const updateValid = async () => {
      try {
        const updateJSON = JSON.stringify(potUpdatedTo);
        const response = await axios({
          method: "put",
          data: updateJSON,
          withCredentials: true,
          url: potIdUrl,
        });
        if (response.status !== 200) {
          const errMsg = (response as any).message;
          testResults += addToResults(`Error: ${errMsg.message}`, false);
          return response;
        }
        const updated: potType = response.data.pot;
        if (updated.div_id !== potUpdatedTo.div_id) {
          testResults += addToResults(
            "Updated pot div_id !== potUpdatedTo.div_id",
            false
          );
        } else if (updated.squad_id !== potUpdatedTo.squad_id) {
          testResults += addToResults(
            "Updated pot squad_id !== potUpdatedTo.squad_id",
            false
          );
        } else if (updated.pot_type !== potUpdatedTo.pot_type) {
          testResults += addToResults(
            "Updated pot div_name !== potUpdatedTo.pot_type",
            false
          );
        } else if (updated.fee !== potUpdatedTo.fee) {
          testResults += addToResults(
            "Updated pot fee !== potUpdatedTo.fee",
            false
          );
        } else if (updated.sort_order !== potUpdatedTo.sort_order) {
          testResults += addToResults(
            "Updated pot sort_order !== potUpdatedTo.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Updated Pot: ${updated.pot_type}`);
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
          ...potToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "put",
          data: invalidJSON,
          withCredentials: true,
          url: potIdUrl,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Update Pot Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error updating pot with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Update Pot, non 422 response for pot: ${potToUpdate.pot_type} - invalid data`
          );
          return {
            error: "Error Updating Pot, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Update pot: ${potToUpdate.pot_type} - invalid ${propertyName}`
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
            error: `Error Updating pot with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontUpdateInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidJSON = JSON.stringify(potUpdatedTo);
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
          testResults += addToResults(`DID NOT update Pot, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT update Pot, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Update Pot Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Updating Pot, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontUpdateDuplicate = async () => {
      // get url with id of pot to duplicate
      const duplicatIdUrl = url + "/" + "pot_ab80213899ea424b938f52a062deacfe";
      try {
        const dupJSON = JSON.stringify(potDuplicate);
        const response = await axios({
          method: "put",
          data: dupJSON,
          withCredentials: true,
          url: duplicatIdUrl,
        });
        if (response.status === 200) {
          testResults += addToResults(`Error: updated duplicate pot_type+div_id`, false);
          return response;
        } else {
          testResults += addToResults(
            `DID NOT update Pot, duplicate pot_type+div_id`,
            false
          );
        }
        return response;
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT update Pot, duplicate pot_type+div_id`);
        } else {
          testResults += addToResults(
            `Update Pot Error: did not return 422 for duplicate pot_type+div_id`,
            false
          );
          return {
            error: `Error Updating Pot, non 422 response for duplicate pot_type+div_id`,
            status: error.response.status,
          };
        }
        return error;
      }
    };

    try {
      // 1) valid full pot object
      const updated = await updateValid();

      // 2) invalid Pot object
      await invalidUpdate("div_id", "bwl_123");
      await invalidUpdate("squad_id", "usr_12345678901234567890123456789012");
      await invalidUpdate("pot_type", "Test");      
      await invalidUpdate("fee", "0");
      await invalidUpdate("sort_order", "abc");

      // 3) invalid Pot id
      await dontUpdateInvalidId("abc_123");
      // 4 non existing Pot id
      await dontUpdateInvalidId("pot_12345678901234567890123456789012");

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
      const reset = await resetPotToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update Pot tests: PASSED`, true);
      } else {
        testResults += addToResults(`Update Pot tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const potPatch = async () => {
    let testResults = results + "Patch Pot tests: \n";
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
          url: potIdUrl,
        });
        if (response.status === 200) {
          if (response.data.pot[propertyName] === matchValue) {
            testResults += addToResults(
              `Patched Pot: ${potToUpdate.pot_type} - just ${propertyName}`
            );
          } else {
            testResults += addToResults(`DID NOT Patch Pot ${propertyName}`, false);
          }
          return {
            data: response.data.pot,
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
        const reset = await resetPotToUpdate(false);
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
          url: potIdUrl,
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
            `Patch Pot, non 422 response for pot: ${potToUpdate.pot_type} - invalid ${propertyName}`
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Pot: ${potToUpdate.pot_type} - invalid ${propertyName}`
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
        const invalidJSON = JSON.stringify(potUpdatedTo);
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
          testResults += addToResults(`DID NOT patch Pot, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT patch Pot, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Patch Pot Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Patching Pot, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    try {      

      await doPatch("div_id", "div_578834e04e5e4885bbae79229d8b96e8", "div_578834e04e5e4885bbae79229d8b96e8");
      await dontPatch("div_id", "<script>alert(1)</script>");

      await doPatch("squad_id", 'sqd_42be0f9d527e4081972ce8877190489d', 'sqd_42be0f9d527e4081972ce8877190489d');
      await dontPatch("squad_id", 'sqd_12345678901234567890123456789012');

      await doPatch("pot_type", 'Series', 'Series');
      await dontPatch("pot_type", 'Test');

      await doPatch("fee", '15', '15');
      await dontPatch("fee", null);

      await doPatch("sort_order", 5, 5);
      await dontPatch("sort_order", -1);

      await dontPatchInvalidId("abc_123");
      await dontPatchInvalidId("bwl_12345678901234567890123456789012");

      return potToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetPotToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Pot tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Pot tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const potDelete = async (potIdToDel: string, testing: boolean = true) => {
    let testResults = results + "Delete Pot tests: \n";
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
            `Did not not delete Pot with invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Error: Could not delete Pot with invalid id: "${invalidId}"`,
            false
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `Did not not delete Pot - invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(`Delete Pot Error: ${error.message}`, false);
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
    };

    const delUrl = url + "/" + potIdToDel;
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: delUrl,
      });
      if (response.status === 200) {
        // if potIdToDel !== potToDel.id, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (potIdToDel === potToDel.id) {
          if (response.data.deleted.pot_type === potToDel.pot_type) {
            testResults += addToResults(
              `Success: Deleted Pot: ${potToDel.pot_type}`
            );
          } else {
            testResults += addToResults(
              `Error Deleted Pot: ${potToDel.pot_type}: no pot_type in response`,
              false
            );
            return {
              error: "No pot_type in response",
              status: 404,
            };
          }
          testResults += addToResults(
            `Success: Deleted Pot: ${response.data.deleted.pot_type}`
          );
        }
      } else {
        testResults += addToResults("Error: could not delete pot", false);        
        return {
          error: "Could not delete pot",
          status: 404,
        };
      }

      if (testing) {
        // try to delete Pot that is parent to tmnt
        // no child tables for pots
        
        await invalidDelete("abc_123");
        await invalidDelete("pot_12345678901234567890123456789012");
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
      if (testing) {
        await reAddDeletedPot();
        if (passed) {
          testResults += addToResults(`Delete Pot tests: PASSED`, true);
        } else {
          testResults += addToResults(`Delete Pot tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const resetAll = async () => {
    let testResults: string = "";
    passed = true;
    try {
      const reset = await resetPotToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allPots: any = await removeCreatedPot(true);
      if (allPots.error) {
        testResults += addToResults(`Error Resetting: ${allPots.error}`, false);
        return;
      }

      const reAdded: any = await reAddDeletedPot();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Pots`);
      return {
        divs: allPots,
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
    setPotCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetAll();
  };

  const handlePotTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (potCrud) {
      case "create":
        await potCreate();
        break;
      case "read":
        await potReadAll(true);
        break;
      case "read1":
        await potRead1();
        break;
      case "update":
        await potUpdate();
        break;
      case "patch":
        await potPatch();
        break;
      case "delete":
        await potDelete(potToDel.id);
        break;
      case "readDiv":
        await potReadForDiv();
        break;
      case "readSquad":
        await potReadForSquad();
        break;
      default:
        break;
    }
  };

  const handlePotTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = "Testing all...";
    passed = true;
    try {
      await potCreate();
      allResults = results;
      await potReadAll(true);
      allResults = results;
      await potRead1();
      allResults = results;
      await potUpdate();
      allResults = results;
      await potPatch();
      allResults = results;
      await potDelete(potToDel.id);
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
          <h4>Pots</h4>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-success" id="potTest" onClick={handlePotTest}>
            Test
          </button>
        </div>
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="potTestAll"
            onClick={handlePotTestAll}
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button className="btn btn-warning" id="potClear" onClick={handleClear}>
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-info" id="potReset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="potCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="potCreate"
            name="pot"
            value="create"
            checked={potCrud === "create"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="potRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="potRead"
            name="pot"
            value="read"
            checked={potCrud === "read"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="potRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="potRead1"
            name="pot"
            value="read1"
            checked={potCrud === "read1"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="potUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="potUpdate"
            name="pot"
            value="update"
            checked={potCrud === "update"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="potPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="potPatch"
            name="pot"
            value="patch"
            checked={potCrud === "patch"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="potDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="potDelete"
            name="pot"
            value="delete"
            checked={potCrud === "delete"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2"></div>
        <div className="col-sm-2">
          <label htmlFor="potReadDiv" className="form-check-label">
            &nbsp;Read Div &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="potReadDiv"
            name="pot"
            value="readDiv"
            checked={potCrud === "readDiv"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-3">
          <label htmlFor="potReadSquad" className="form-check-label">
            &nbsp;Read Squad &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="potReadSquad"
            name="pot"
            value="readSquad"
            checked={potCrud === "readSquad"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="potResults"
            name="potResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
