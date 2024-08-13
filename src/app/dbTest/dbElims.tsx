import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { elimType } from "@/lib/types/types";
import { initElim } from "@/db/initVals";

const url = baseApi + "/elims";
const elimId = "elm_45d884582e7042bb95b4818ccdd9974c";
const elimIdUrl = url + "/" + elimId;
const multiElimsDivId = 'div_f30aea2c534f4cfe87f4315531cef8ef'
const multiElimsSquadId = "sqd_7116ce5f80164830830a7157eb093396";
const noElimsDivId = "div_578834e04e5e4885bbae79229d8b96e8";
const noElimsSquadId = "sqd_42be0f9d527e4081972ce8877190489d";
let passed = true;
let allResults = "";

export const DbElims = () => {
  const [crud, setCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
    // force textarea to scroll to bottom
    var textarea = document.getElementById("elimResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const elimToPost: elimType = {
    ...initElim,
    id: "",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    sort_order: 3,
    start: 2,
    games: 3,
    fee: '13',
  };

  const elimToUpdate: elimType = {
    ...initElim,
    id: "elm_45d884582e7042bb95b4818ccdd9974c",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    sort_order: 1,
    start: 1,
    games: 3,
    fee: '5',
  };

  const elimUpdatedTo: elimType = {
    ...initElim,
    id: "elm_4f176545e4294a0292732cccada91b9d",
    squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
    div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
    sort_order: 3,
    start: 3,
    games: 3,
    fee: '10',
  };

  const elimDuplicate: elimType = {
    ...initElim,
    id: "",
    squad_id: "brk_37345eb6049946ad83feb9fdbb43a307",
    div_id: "sqd_1a6c885ee19a49489960389193e8f819",
    sort_order: 3,
    start: 1,
    games: 3,
    fee: '5',
  };

  const elimToDel: elimType = {
    ...initElim,
    id: "elm_4c5aad9baa7246c19e07f215561e58c4",
    squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
    div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
    sort_order: 3,
    start: 3,
    games: 4,
    fee: '10',
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

  const removeCreatedElim = async (showResults: boolean) => {
    let testResults = results;
    try {
      const all: elimType[] = (await elimReadAll(false)) as unknown as elimType[];
      const justPosted = all.filter((obj) => obj.fee === elimToPost.fee);
      if (justPosted.length === 1) {
        await elimDelete(justPosted[0].id, false);
        if (showResults) {
          testResults += addToResults(`Reset Created Elim: ${justPosted[0].fee}`);
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

  const resetElimToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: elimToUpdate,
        withCredentials: true,
        url: elimIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Reset Elim: ${elimToUpdate.id}`);
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

  const reAddDeletedElim = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delUrl = url + "/" + elimToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delUrl,
        });
        // if elim already exisits, do not delete it
        if (response.status === 200) {
          return {
            data: elimToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if elim does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAddElim = {
        ...elimToDel,
      };
      reAddElim.id = nextPostSecret + reAddElim.id;
      const reAddJSON = JSON.stringify(reAddElim);
      response = await axios({
        method: "post",
        data: reAddJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: elimToDel,
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

  const elimCreate = async () => {
    let testResults: string = results + "Create Elim tests: \n";
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
          const all: elimType[] = response.data.elims as unknown as elimType[];
          const justCreated = all.filter((obj) => obj.fee === elimToPost.fee);
          if (justCreated.length === 1) {
            await elimDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created elim", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const invalidCreate = async (propertyName: string, value: any) => {
      try {
        const invalidJSON = JSON.stringify({
          ...elimToUpdate,
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
            `Create Elim Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error creating elim with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Brkt, non 422 response for elim: ${elimToUpdate.fee} - invalid data`
          );
          return {
            error: "Error Creating Brkt, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create elim: ${elimToUpdate.fee} - invalid ${propertyName}`
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
            error: `Error Creating elim with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const createDuplicate = async () => {
      try {
        const duplicate = {
          ...elimDuplicate,
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
            `Create Elim Error: did not return 422 for duplicate start+games+div_id`,
            false
          );
          return {
            error: `Error creating elim with duplicate start+games+div_id`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Brkt, non 422 response for duplicate start+games+div_id`
          );
          return {
            error: "Error Creating Brkt, non 422 response for duplicate start+games+div_id",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Create elim: duplicate start+games+div_id`);
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Create Error: did not return 422 for duplicate start+games+div_id`,
            false
          );
          return {
            error: `Error Creating elim with duplicate start+games+div_id`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await deleteCreated();

      const createJSON = JSON.stringify(elimToPost);
      const response = await axios({
        method: "post",
        data: createJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdId = response.data.elim.id;
        testResults += addToResults(`Created elim: ${response.data.elim.fee}`);
        const postedElim: elimType = response.data.elim;
        if (postedElim.div_id !== elimToPost.div_id) {
          testResults += addToResults("Created elim div_id !== elimToPost.div_id", false);
        } else if (postedElim.squad_id !== elimToPost.squad_id) {
          testResults += addToResults(
            "Created elim squad_id !== elimToPost.squad_id",
            false
          );
        } else if (postedElim.fee !== elimToPost.fee) {
          testResults += addToResults(
            "Created elim fee !== elimToPost.fee",
            false
          );
        } else if (postedElim.start !== elimToPost.start) {
          testResults += addToResults(
            "Created elim start !== elimToPost.start",
            false
          );
        } else if (postedElim.games !== elimToPost.games) {
          testResults += addToResults(
            "Created elim games !== elimToPost.games",
            false
          );
        } else if (postedElim.sort_order !== elimToPost.sort_order) {
          testResults += addToResults(
            "Created elim sort_order !== elimToPost.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Created elim === elimToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating elim: ${elimToPost.fee}, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not create elim",
          status: response.status,
        };
      }

      await invalidCreate("div_id", "bwl_123");
      await invalidCreate("squad_id", "div_12345678901234567890123456789012");
      await invalidCreate("fee", "-1");
      await invalidCreate("start", 0);
      await invalidCreate("games", 12345);
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
        await elimDelete(createdId, false);
      }
      if (passed) {
        testResults += addToResults(`Create Elim tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create Elim tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const elimReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Elims tests: \n";
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
            `Success: Read ${response.data.elims.length} Elims`,
            true
          );
        }
        const all: elimType[] = response.data.elims as unknown as elimType[];
        // 5 elims in /prisma/seeds.ts
        const seedCount = 5;
        if (all.length === seedCount) {
          testResults += addToResults(`Read all ${seedCount} elims`, true);
        } else {
          testResults += addToResults(
            `Error: Read ${all.length} elims, expected ${seedCount}`,
            false
          );
        }
        return response.data.elims;
      } else {
        testResults += addToResults(
          `Error reading all elims, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read all elims",
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
          testResults += addToResults(`Read All Elims tests: PASSED`, true);
        } else {
          testResults += addToResults(`Read All Elims tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const elimRead1 = async () => {
    let testResults = results + "Read 1 Elim tests: \n";
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
            `Read 1 Elim Error: did not return 404 for invalid id ${id}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 Elim, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 Elim, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read 1 Elim: invalid id: ${id}`);
          return {
            error: `invalid id: ${id}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read 1 Elim Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Reading 1 Elim, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testElim: elimType = {
      ...elimToUpdate,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: elimIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 Elim: ${response.data.elim.fee}`,
          true
        );
        const readElim: elimType = response.data.elim;
        if (readElim.div_id !== testElim.div_id) {
          testResults += addToResults("Read 1 Elim div_id !== testElim.div_id", false);
        } else if (readElim.squad_id !== testElim.squad_id) {
          testResults += addToResults("Read 1 Elim squad_id !== testElim.squad_id", false);
        } else if (readElim.fee !== testElim.fee) {
          testResults += addToResults("Read 1 Elim fee !== testElim.fee", false);
        } else if (readElim.start !== testElim.start) {
          testResults += addToResults("Read 1 Elim start !== testElim.start", false);
        } else if (readElim.games !== testElim.games) {
          testResults += addToResults("Read 1 Elim games !== testElim.games", false);
        } else if (readElim.sort_order !== testElim.sort_order) {
          testResults += addToResults(
            "Read 1 Elim sort_order !== testElim.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Read 1 Elim === testElim`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 elim, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read 1 elim",
          status: response.status,
        };
      }

      // test invalid url
      await readInvalidId("abc_123");
      // test non existing elim
      await readInvalidId("elm_12345678901234567890123456789012");

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
        testResults += addToResults(`Read 1 Elim tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 Elim tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const elimReadForDiv = async () => {
    let testResults = results + "Read Elims for a Div tests: \n";
    passed = true;

    const validReadForDiv = async (divId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/div/" + divId,
        });
        if (response.status === 200) {
          testResults += addToResults(`Success: Read Elims for Div, div_id: ${divId}`);
          const readElims: elimType[] = response.data.elims;
          if (divId === multiElimsDivId) {
            if (readElims.length !== 2) {
              testResults += addToResults(
                "Error: Read Elims for Div length !== 2",
                false
              );
              return {
                error: "Error: Read Elims for Div, length !== 2",
                status: 404,
              };
            }
            readElims.forEach((elim: elimType) => {
              if (
                !(
                  elim.id === "elm_45d884582e7042bb95b4818ccdd9974c" ||
                  elim.id === "elm_9d01015272b54962a375cf3c91007a12"
                )
              ) {
                testResults += addToResults(
                  "Error: Read Elims for Div elim.id invalid",
                  false
                );
                return {
                  error: "Error: Read Elims for Div, elim.id invalid",
                  status: 404,
                };
              }
            });
          } else if (divId === noElimsDivId) {
            if (readElims.length !== 0) {
              testResults += addToResults(
                "Error: Read Elims for Div length !== 0",
                false
              );
              return {
                error: "Error: Read Elims for Div, length !== 0",
                status: 404,
              };
            }
          }
          testResults += addToResults(
            `Success: Read Elims for Div, ${readElims.length} rows returned`
          );
        } else {
          testResults += addToResults(
            `Error reading elims for div, response status: ${response.status}`,
            false
          );
          return {
            error: "Did not read elims for div",
            status: response.status,
          };
        }
        return response.data.elims;
      } catch (error: any) {
        testResults += addToResults(`Read Elims for Div Error: ${error.message}`, false);
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
            `Read Elims for Div Error: did not return 404 for invalid id ${divId}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${divId}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read Elims for Div, non 404 response for invalid id: ${divId}`
          );
          return {
            error: `Error Reading Elims for Div, non 404 response for invalid id: ${divId}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read Elims for Div: invalid id: ${divId}`
          );
          return {
            error: `invalid id: ${divId}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read Elims for Div Error: did not return 404 for invalid id: ${divId}`,
            false
          );
          return {
            error: `Error Reading Elims for Div, non 404 response for invalid id: ${divId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await validReadForDiv(multiElimsDivId);
      await validReadForDiv(noElimsDivId);

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
        testResults += addToResults(`Read Elims for a Div tests: PASSED`);
      } else {
        testResults += addToResults(`Read Elims for a Div tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const elimReadForSquad = async () => {
    let testResults = results + "Read Elims for a Squad tests: \n";
    passed = true;

    const validReadForSquad = async (squadId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/squad/" + squadId,
        });
        if (response.status === 200) {
          testResults += addToResults(`Success: Read Elims for Squad, squad_id: ${squadId}`);
          const readBrkts: elimType[] = response.data.elims;
          if (squadId === multiElimsSquadId) {
            if (readBrkts.length !== 2) {
              testResults += addToResults(
                "Error: Read Elims for Squad length !== 2",
                false
              );
              return {
                error: "Error: Read Elims for Squad, length !== 2",
                status: 404,
              };
            }
            readBrkts.forEach((elim: elimType) => {
              if (
                !(
                  elim.id === "elm_45d884582e7042bb95b4818ccdd9974c" ||
                  elim.id === "elm_9d01015272b54962a375cf3c91007a12"
                )
              ) {
                testResults += addToResults(
                  "Error: Read Elims for Squad elim.id invalid",
                  false
                );
                return {
                  error: "Error: Read Elims for Squad, elim.id invalid",
                  status: 404,
                };
              }
            });
          } else if (squadId === noElimsDivId) {
            if (readBrkts.length !== 0) {
              testResults += addToResults(
                "Error: Read Elims for Squad length !== 0",
                false
              );
              return {
                error: "Error: Read Elims for Squad, length !== 0",
                status: 404,
              };
            }
          }
          testResults += addToResults(
            `Success: Read Elims for Squad, ${readBrkts.length} rows returned`
          );
        } else {
          testResults += addToResults(
            `Error reading elims for squad, response status: ${response.status}`,
            false
          );
          return {
            error: "Did not read elims for squad",
            status: response.status,
          };
        }
        return response.data.elims;
      } catch (error: any) {
        testResults += addToResults(`Read Elims for Squad Error: ${error.message}`, false);
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
            `Read Elims for Squad Error: did not return 404 for invalid id ${squadId}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${squadId}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read Elims for Squad, non 404 response for invalid id: ${squadId}`
          );
          return {
            error: `Error Reading Elims for Squad, non 404 response for invalid id: ${squadId}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read Elims for Squad: invalid id: ${squadId}`
          );
          return {
            error: `invalid id: ${squadId}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read Elims for Squad Error: did not return 404 for invalid id: ${squadId}`,
            false
          );
          return {
            error: `Error Reading Elims for Squad, non 404 response for invalid id: ${squadId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await validReadForSquad(multiElimsSquadId);
      await validReadForSquad(noElimsSquadId);

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
        testResults += addToResults(`Read Elims for a Squad tests: PASSED`);
      } else {
        testResults += addToResults(`Read Elims for a Squad tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const elimUpdate = async () => {
    let testResults = results + "Update Elim tests: \n";
    passed = true;

    const updateValid = async () => {
      try {
        const updateJSON = JSON.stringify(elimUpdatedTo);
        const response = await axios({
          method: "put",
          data: updateJSON,
          withCredentials: true,
          url: elimIdUrl,
        });
        if (response.status !== 200) {
          const errMsg = (response as any).message;
          testResults += addToResults(`Error: ${errMsg.message}`, false);
          return response;
        }
        const updated: elimType = response.data.elim;
        if (updated.div_id !== elimUpdatedTo.div_id) {
          testResults += addToResults(
            "Updated elim div_id !== elimUpdatedTo.div_id",
            false
          );
        } else if (updated.squad_id !== elimUpdatedTo.squad_id) {
          testResults += addToResults(
            "Updated elim squad_id !== elimUpdatedTo.squad_id",
            false
          );
        } else if (updated.fee !== elimUpdatedTo.fee) {
          testResults += addToResults(
            "Updated elim fee !== elimUpdatedTo.fee",
            false
          );
        } else if (updated.start !== elimUpdatedTo.start) {
          testResults += addToResults(
            "Updated elim start !== elimUpdatedTo.start",
            false
          );
        } else if (updated.games !== elimUpdatedTo.games) {
          testResults += addToResults(
            "Updated elim games !== elimUpdatedTo.games",
            false
          );
        } else if (updated.sort_order !== elimUpdatedTo.sort_order) {
          testResults += addToResults(
            "Updated elim sort_order !== elimUpdatedTo.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Updated Elim: ${updated.id}`);
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
          ...elimToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "put",
          data: invalidJSON,
          withCredentials: true,
          url: elimIdUrl,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Update Elim Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error updating elim with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Update Brkt, non 422 response for elim: ${elimToUpdate.id} - invalid data`
          );
          return {
            error: "Error Updating Brkt, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Update elim: ${elimToUpdate.id} - invalid ${propertyName}`
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
            error: `Error Updating elim with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontUpdateInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidJSON = JSON.stringify(elimUpdatedTo);
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
            `Update Elim Error: did not return 404 for invalid id: ${id}`,
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
      // get url with id of elim to duplicate
      const duplicatIdUrl = url + "/" + "elm_4f176545e4294a0292732cccada91b9d";
      try {
        const dupJSON = JSON.stringify(elimDuplicate);
        const response = await axios({
          method: "put",
          data: dupJSON,
          withCredentials: true,
          url: duplicatIdUrl,
        });
        if (response.status === 200) {
          testResults += addToResults(`Error: updated duplicate start+games+div_id`, false);
          return response;
        } else {
          testResults += addToResults(
            `DID NOT update Brkt, duplicate start+games+div_id`,
            false
          );
        }
        return response;
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT update Brkt, duplicate start+games+div_id`);
        } else {
          testResults += addToResults(
            `Update Elim Error: did not return 422 for duplicate start+games+div_id`,
            false
          );
          return {
            error: `Error Updating Brkt, non 422 response for duplicate start+games+div_id`,
            status: error.response.status,
          };
        }
        return error;
      }
    };

    try {
      // 1) valid full elim object
      const updated = await updateValid();

      // 2) invalid Elim object
      await invalidUpdate("div_id", "bwl_123");
      await invalidUpdate("squad_id", "usr_12345678901234567890123456789012");
      await invalidUpdate("fee", "0");
      await invalidUpdate("start", 0);      
      await invalidUpdate("games", 1234);      
      await invalidUpdate("sort_order", "abc");

      // 3) invalid Elim id
      await dontUpdateInvalidId("abc_123");
      // 4 non existing Elim id
      await dontUpdateInvalidId("elm_12345678901234567890123456789012");

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
      const reset = await resetElimToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update Elim tests: PASSED`, true);
      } else {
        testResults += addToResults(`Update Elim tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const elimPatch = async () => {
    let testResults = results + "Patch Elim tests: \n";
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
          url: elimIdUrl,
        });
        if (response.status === 200) {
          if (response.data.elim[propertyName] === matchValue) {
            testResults += addToResults(
              `Patched Elim: ${elimToUpdate.id} - just ${propertyName}`
            );
          } else {
            testResults += addToResults(`DID NOT Patch Elim ${propertyName}`, false);
          }
          return {
            data: response.data.elim,
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
        const reset = await resetElimToUpdate(false);
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
          url: elimIdUrl,
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
            `Patch Brkt, non 422 response for elim: ${elimToUpdate.id} - invalid ${propertyName}`
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Elim: ${elimToUpdate.id} - invalid ${propertyName}`
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
        const invalidJSON = JSON.stringify(elimUpdatedTo);
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
            `Patch Elim Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Patching Brkt, non 404 response for invalid id: ${id}`,
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

      await doPatch("start", 2, 2);
      await dontPatch("start", 0);

      await doPatch("games", 4, 4);
      await dontPatch("games", 0);

      await doPatch("fee", '15', '15');
      await dontPatch("fee", 'abc');

      await doPatch("sort_order", 5, 5);
      await dontPatch("sort_order", -1);      

      await dontPatchInvalidId("abc_123");
      await dontPatchInvalidId("bwl_12345678901234567890123456789012");

      return elimToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetElimToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Elim tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Elim tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const elimDelete = async (elimIdToDel: string, testing: boolean = true) => {
    let testResults = results + "Delete Elim tests: \n";
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
            `Did not not delete Elim with invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Error: Could not delete Elim with invalid id: "${invalidId}"`,
            false
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `Did not not delete Elim - invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(`Delete Elim Error: ${error.message}`, false);
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
    };

    const delUrl = url + "/" + elimIdToDel;
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: delUrl,
      });
      if (response.status === 200) {
        // if elimIdToDel !== elimToDel.id, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (elimIdToDel === elimToDel.id) {
          if (response.data.deleted.id === elimToDel.id) {
            testResults += addToResults(
              `Success: Deleted Elim: ${elimToDel.id}`
            );
          } else {
            testResults += addToResults(
              `Error Deleted Elim: ${elimToDel.id}`,
              false
            );
            return {
              error: "Error deleting elim",
              status: 404,
            };
          }
          testResults += addToResults(
            `Success: Deleted Elim: ${response.data.deleted.id}`
          );
        }
      } else {
        testResults += addToResults("Error: could not delete elim", false);        
        return {
          error: "Could not delete elim",
          status: 404,
        };
      }

      if (testing) {
        // try to delete Elim that is parent to tmnt
        // no child tables for pots
        
        await invalidDelete("abc_123");
        await invalidDelete("elm_12345678901234567890123456789012");
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
        await reAddDeletedElim();
        if (passed) {
          testResults += addToResults(`Delete Elim tests: PASSED`, true);
        } else {
          testResults += addToResults(`Delete Elim tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const resetAll = async () => {
    let testResults: string = "";
    passed = true;
    try {
      const reset = await resetElimToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allElims: any = await removeCreatedElim(true);
      if (allElims.error) {
        testResults += addToResults(`Error Resetting: ${allElims.error}`, false);
        return;
      }

      const reAdded: any = await reAddDeletedElim();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Elims`);
      return {
        divs: allElims,
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
    setCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetAll();
  };

  const handleElimTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (crud) {
      case "create":
        await elimCreate();
        break;
      case "read":
        await elimReadAll(true);
        break;
      case "read1":
        await elimRead1();
        break;
      case "update":
        await elimUpdate();
        break;
      case "patch":
        await elimPatch();
        break;
      case "delete":
        await elimDelete(elimToDel.id);
        break;
      case "readDiv":
        await elimReadForDiv();
        break;
      case "readSquad":
        await elimReadForSquad();
        break;
      default:
        break;
    }
  };

  const handleElimTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = "Testing all...";
    passed = true;
    try {
      await elimCreate();
      allResults = results;
      await elimReadAll(true);
      allResults = results;
      await elimRead1();
      allResults = results;
      await elimUpdate();
      allResults = results;
      await elimPatch();
      allResults = results;
      await elimDelete(elimToDel.id);
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
          <h4>Eliminators</h4>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-success" id="elimTest" onClick={handleElimTest}>
            Test
          </button>
        </div>
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="elimTestAll"
            onClick={handleBrktTestAll}
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button className="btn btn-warning" id="elimClear" onClick={handleClear}>
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-info" id="elimReset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="elimCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="elimCreate"
            name="elim"
            value="create"
            checked={crud === "create"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="elimRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="elimRead"
            name="elim"
            value="read"
            checked={crud === "read"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="elimRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="elimRead1"
            name="elim"
            value="read1"
            checked={crud === "read1"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="elimUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="elimUpdate"
            name="elim"
            value="update"
            checked={crud === "update"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="elimPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="elimPatch"
            name="elim"
            value="patch"
            checked={crud === "patch"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="elimDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="elimDelete"
            name="elim"
            value="delete"
            checked={crud === "delete"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2"></div>
        <div className="col-sm-2">
          <label htmlFor="elimReadDiv" className="form-check-label">
            &nbsp;Read Div &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="elimReadDiv"
            name="elim"
            value="readDiv"
            checked={crud === "readDiv"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-3">
          <label htmlFor="elimReadSquad" className="form-check-label">
            &nbsp;Read Squad &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="elimReadSquad"
            name="elim"
            value="readSquad"
            checked={crud === "readSquad"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="elimResults"
            name="elimResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
