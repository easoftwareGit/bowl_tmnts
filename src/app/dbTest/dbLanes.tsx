import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { laneType } from "@/lib/types/types";
import { initLane } from "@/db/initVals";

const url = baseApi + "/lanes";
const laneId = "lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d";
const laneIdUrl = url + "/" + laneId;
const multiLanesSquadId = "sqd_7116ce5f80164830830a7157eb093396";
const noLanesSquadId = "sqd_42be0f9d527e4081972ce8877190489d";
let passed = true;
let allResults = "";

export const DbLanes = () => {
  const [laneCrud, setLaneCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
    // force textarea to scroll to bottom
    var textarea = document.getElementById("laneResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const laneToPost: laneType = {
    ...initLane,
    id: "",
    lane_number: 101,
    squad_id: "sqd_42be0f9d527e4081972ce8877190489d",
  };

  const laneToUpdate: laneType = {
    ...initLane,
    id: "lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d",
    lane_number: 29,
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
  };

  const laneUpdatedTo: laneType = {
    ...initLane,    
    id: "lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d",
    lane_number: 28,
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
  };

  const laneDuplicate: laneType = {
    ...initLane,
    id: "lan_8b78890d8b8e4c5b9f6b7d9e7f9b6c5d",
    lane_number: 30,
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
  };

  const laneToDel: laneType = {
    ...initLane,
    id: "lan_255dd3b8755f4dea956445e7a3511d91",
    lane_number: 99,
    squad_id: "sqd_20c24199328447f8bbe95c05e1b84644",
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

  const removeCreatedLane = async (showResults: boolean) => {
    let testResults = results;
    try {
      const allLanes: laneType[] = (await laneReadAll(
        false
      )) as unknown as laneType[];
      const justPostedLane = allLanes.filter(
        (lane) => lane.lane_number === laneToPost.lane_number
      );
      if (justPostedLane.length === 1) {
        await laneDelete(justPostedLane[0].id, false);
        if (showResults) {
          testResults += addToResults(
            `Reset Created Lane: ${justPostedLane[0].lane_number}`
          );
        }
      }
      return allLanes;
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

  const resetLaneToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: laneToUpdate,
        withCredentials: true,
        url: laneIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(
            `Reset Lane: ${laneToUpdate.lane_number}`
          );
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

  const reAddDeletedLane = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delEventUrl = url + "/" + laneToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delEventUrl,
        });
        // if lane already exisits, do not delete it
        if (response.status === 200) {
          return {
            data: laneToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if lane does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAddLane = {
        ...laneToDel,
      };
      reAddLane.id = nextPostSecret + reAddLane.id;
      const laneJSON = JSON.stringify(reAddLane);
      response = await axios({
        method: "post",
        data: laneJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: laneToDel,
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

  const laneCreate = async () => {
    let testResults: string = results + "Create Lane tests: \n";
    let createdLaneId: string = "";
    passed = true;

    const deleteCreated = async () => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url,
        });
        if (response.status === 200) {
          const all: laneType[] = response.data
            .lanes as unknown as laneType[];
          const justCreated = all.filter(
            (lane) => lane.lane_number === laneToPost.lane_number
          );
          if (justCreated.length === 1) {
            await laneDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created lane", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const laneInvalidCreate = async (propertyName: string, value: any) => {
      try {
        const invalidLaneJSON = JSON.stringify({
          ...laneToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "post",
          data: invalidLaneJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Lane Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error creating lane with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Lane, non 422 response for lane: ${laneToUpdate.lane_number} - invalid data`
          );
          return {
            error: "Error Creating Lane, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create lane: ${laneToUpdate.lane_number} - invalid ${propertyName}`
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
            error: `Error Creating lane with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const laneCreateDuplicate = async () => {
      try {
        const duplicate = {
          ...laneDuplicate,
          id: "",
        };
        const laneJSON = JSON.stringify(duplicate);
        const invalidResponse = await axios({
          method: "post",
          data: laneJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Lane Error: did not return 422 for duplicate lane_number+squad_id`,
            false
          );
          return {
            error: `Error creating lane with duplicate lane_number+squad_id`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Lane, non 422 response for duplicate lane_number+squad_id`
          );
          return {
            error:
              "Error Creating Lane, non 422 response for duplicate lane_number+squad_id",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create lane: duplicate lane_number+squad_id`
          );
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Create Error: did not return 422 for duplicate lane_number+squad_id`,
            false
          );
          return {
            error: `Error Creating lane with duplicate lane_number+squad_id`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await deleteCreated();

      const laneJSON = JSON.stringify(laneToPost);
      const response = await axios({
        method: "post",
        data: laneJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdLaneId = response.data.lane.id;
        testResults += addToResults(
          `Created lane: ${response.data.lane.lane_number}`
        );
        const postedLane: laneType = response.data.lane;
        if (postedLane.lane_number !== laneToPost.lane_number) {
          testResults += addToResults(
            "Created lane lane_number !== squadToPost.lane_number",
            false
          );
        } else if (postedLane.squad_id !== laneToPost.squad_id) {
          testResults += addToResults(
            "Created lane squad_id !== squadToPost.squad_id",
            false
          );        
        } else {
          testResults += addToResults(`Created lane === squadToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating lane: ${laneToPost.lane_number}, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not create lane",
          status: response.status,
        };
      }

      await laneInvalidCreate("squad_id", "bwl_123");
      await laneInvalidCreate("lane_number", -1);

      await laneCreateDuplicate();

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdLaneId) {
        await laneDelete(createdLaneId, false);
      }
      if (passed) {
        testResults += addToResults(`Create Lane tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create Lane tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const laneReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Lanes tests: \n";
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
            `Success: Read ${response.data.lanes.length} Lanes`,
            true
          );
        }
        const allLanes: laneType[] = response.data
          .lanes as unknown as laneType[];

        // 37 lanes in /prisma/seeds.ts
        const seedCount = 37;
        if (allLanes.length === seedCount) {
          testResults += addToResults(`Read all ${seedCount} lanes`, true);
        } else {
          testResults += addToResults(
            `Error: Read ${allLanes.length} lanes, expected ${seedCount}`,
            false
          );
        }
        return response.data.lanes;
      } else {
        testResults += addToResults(
          `Error reading all lanes, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read all lanes",
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
          testResults += addToResults(`Read All Lanes tests: PASSED`, true);
        } else {
          testResults += addToResults(`Read All Lanes tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const laneRead1 = async () => {
    let testResults = results + "Read 1 Lane tests: \n";
    passed = true;

    const laneReadInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: invalidUrl,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read 1 Lane Error: did not return 404 for invalid id ${id}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 Lane, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 Lane, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read 1 Lane: invalid id: ${id}`
          );
          return {
            error: `invalid id: ${id}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read 1 Lane Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Reading 1 Lane, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testLane: laneType = {
      ...initLane,      
      lane_number: 29,
      squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: laneIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 Lane: ${response.data.lane.squad_name}`,
          true
        );
        const readLane: laneType = response.data.lane;
        if (readLane.lane_number !== testLane.lane_number) {
          testResults += addToResults(
            "Read 1 Lane lane_number !== testLane.lane_number",
            false
          );
        } else if (readLane.squad_id !== testLane.squad_id) {
          testResults += addToResults(
            "Read 1 Lane squad_id !== testLane.squad_id",
            false
          );
        } else {
          testResults += addToResults(`Read 1 Lane === testLane`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 lane, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read 1 lane",
          status: response.status,
        };
      }

      // test invalid url
      await laneReadInvalidId("abc_123");
      // test non existing lane
      await laneReadInvalidId("lan_12345678901234567890123456789012");

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
        testResults += addToResults(`Read 1 Lane tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 Lane tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const laneReadForSquad = async () => {
    let testResults = results + "Read Lanes for a Squad tests: \n";
    passed = true;

    const validReadForSquad = async (squadId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/squad/" + squadId,
        });
        if (response.status === 200) {
          testResults += addToResults(
            `Success: Read Lanes for Squad, squadId: ${squadId}`
          );
          const readSquads: laneType[] = response.data.lanes;
          if (squadId === multiLanesSquadId) {
            if (readSquads.length !== 12) {
              testResults += addToResults(
                "Error: Read Lanes for Squad length !== 12",
                false
              );
              return {
                error: "Error: Read Lanes for Squad, length !== 12",
                status: 404,
              };
            }
            readSquads.forEach((lane: laneType) => {
              if (
                !(
                  lane.id === "lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d" ||
                  lane.id === "lan_327d738e43bb4ff680f6b17fac0a61f0" ||
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6c5d' ||
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6123' ||
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6234' ||
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6345' ||
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6456' ||
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6567' ||
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6678' ||
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6789' || 
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6890' ||
                  lane.id === 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6abc'
                )
              ) {
                testResults += addToResults(
                  "Error: Read Lanes for Squad, lane.id invalid",
                  false
                );
                return {
                  error: "Error: Read Lanes for Squad, lane.id invalid",
                  status: 404,
                };
              }
            });
          } else if (squadId === noLanesSquadId) {
            if (readSquads.length !== 0) {
              testResults += addToResults(
                "Error: Read Lanes for Squad length !== 0",
                false
              );
              return {
                error: "Error: Read Lanes for Squad, length !== 0",
                status: 404,
              };
            }
          }
          testResults += addToResults(
            `Success: Read Lanes for Squad, ${readSquads.length} rows returned`
          );
        } else {
          testResults += addToResults(
            `Error reading lanes for Squad, response status: ${response.status}`,
            false
          );
          return {
            error: "Did not read lanes for squad",
            status: response.status,
          };
        }
        return response.data.lanes;
      } catch (error: any) {
        testResults += addToResults(
          `Read Lanes for Squad Error: ${error.message}`,
          false
        );
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
            `Read Lanes for Squad Error: did not return 404 for invalid id ${squadId}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${squadId}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read Lanes for Squad, non 404 response for invalid id: ${squadId}`
          );
          return {
            error: `Error Reading Lanes for Squad, non 404 response for invalid id: ${squadId}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read Lanes for Squad: invalid id: ${squadId}`
          );
          return {
            error: `invalid id: ${squadId}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read Lanes for Squad Error: did not return 404 for invalid id: ${squadId}`,
            false
          );
          return {
            error: `Error Reading Lanes for Squad, non 404 response for invalid id: ${squadId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await validReadForSquad(multiLanesSquadId);
      await validReadForSquad(noLanesSquadId);

      await invalidReadForSquad("sqd_123");
      await invalidReadForSquad("lan_cb97b73cb538418ab993fc867f860510");
      return {
        squads: [],
        status: 200,
      };
    } catch (error: any) {
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Read Lanes for a Squad tests: PASSED`);
      } else {
        testResults += addToResults(
          `Read Lanes for a Squad tests: FAILED`,
          false
        );
      }
      setResults(testResults);
    }
  };

  const laneUpdate = async () => {
    let testResults = results + "Update Lane tests: \n";
    passed = true;

    const laneUpdateValid = async () => {
      try {
        const laneJSON = JSON.stringify(laneUpdatedTo);
        const response = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: laneIdUrl,
        });
        if (response.status !== 200) {
          const errMsg = (response as any).message;
          testResults += addToResults(`Error: ${errMsg.message}`, false);
          return response;
        }
        const updatedLane: laneType = response.data.lane;
        if (updatedLane.lane_number !== laneUpdatedTo.lane_number) {
          testResults += addToResults(
            "Updated lane lane_number !== laneUpdatedTo.lane_number",
            false
          );
        } else if (updatedLane.squad_id !== laneUpdatedTo.squad_id) {
          testResults += addToResults(
            "Updated lane squad_id !== laneUpdatedTo.squad_id",
            false
          );
        } else {
          testResults += addToResults(
            `Updated Lane: ${updatedLane.lane_number}`
          );
        }
        return response;
      } catch (error: any) {
        testResults += addToResults(`Error: ${error.message}`, false);
        return error;
      }
    };

    const laneInvalidUpdate = async (propertyName: string, value: any) => {
      try {
        const invalidLaneJSON = JSON.stringify({
          ...laneToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "put",
          data: invalidLaneJSON,
          withCredentials: true,
          url: laneIdUrl,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Update Lane Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error updating lane with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Update Lane, non 422 response for lane: ${laneToUpdate.lane_number} - invalid data`
          );
          return {
            error: "Error Updating Lane, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Update lane: ${laneToUpdate.lane_number} - invalid ${propertyName}`
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
            error: `Error Updating lane with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const laneUpdateInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const laneJSON = JSON.stringify(laneUpdatedTo);
        const notUpdatedResponse = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: invalidUrl,
        });

        if (notUpdatedResponse.status === 200) {
          testResults += addToResults(`Error: updated invalid id: ${id}`);
          return notUpdatedResponse;
        } else {
          testResults += addToResults(
            `DID NOT update Lane, invalid id: ${id}`
          );
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT update Lane, invalid id: ${id}`
          );
        } else {
          testResults += addToResults(
            `Update Lane Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Updating Lane, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const laneDontUpdateDuplicate = async () => {
      // get url with id of lane to duplicate
      const duplicatIdUrl = url + "/" + "lan_8b78890d8b8e4c5b9f6b7d9e7f9b6c5d";
      try {
        const laneJSON = JSON.stringify(laneDuplicate);
        const response = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: duplicatIdUrl,
        });
        if (response.status === 200) {
          testResults += addToResults(
            `Error: updated duplicate lane_number+squad_id`,
            false
          );
          return response;
        } else {
          testResults += addToResults(
            `DID NOT update Lane, duplicate lane_number+squad_id`,
            false
          );
        }
        return response;
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT update Lane, duplicate lane_number+squad_id`
          );
        } else {
          testResults += addToResults(
            `Update Lane Error: did not return 422 for duplicate lane_number+squad_id`,
            false
          );
          return {
            error: `Error Updating Lane, non 422 response for duplicate lane_number+squad_id`,
            status: error.response.status,
          };
        }
        return error;
      }
    };

    try {
      // 1) valid full lane object
      const updated = await laneUpdateValid();

      // 2) invalid Lane object
      await laneInvalidUpdate("squad_id", "sqd_123");
      await laneInvalidUpdate("lane_number", 222);

      // 3) invalid Lane id
      await laneUpdateInvalidId("lan_123");
      // 4 non existing Lane id
      await laneUpdateInvalidId("lan_12345678901234567890123456789012");

      // 5) duplicate Event
      await laneDontUpdateDuplicate();

      return updated;
    } catch (error: any) {
      testResults += addToResults(`Update Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetLaneToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update Lane tests: PASSED`, true);
      } else {
        testResults += addToResults(`Update Lane tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const lanePatch = async () => {
    let testResults = results + "Patch Lane tests: \n";
    passed = true;

    const doPatch = async (
      propertyName: string,
      value: any,
      matchValue: any
    ) => {
      try {
        const laneJSON = JSON.stringify({
          [propertyName]: value,
        });
        const response = await axios({
          method: "patch",
          data: laneJSON,
          withCredentials: true,
          url: laneIdUrl,
        });
        if (response.status === 200) {
          if (response.data.lane[propertyName] === matchValue) {
            testResults += addToResults(
              `Patched Lane: ${laneToUpdate.lane_number} - just ${propertyName}`
            );
          } else {
            testResults += addToResults(
              `DID NOT Patch Lane ${propertyName}`,
              false
            );
          }
          return {
            data: response.data.lane,
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
        const reset = await resetLaneToUpdate(false);
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
          url: laneIdUrl,
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
            `Patch Lane, non 422 response for lane: ${laneToUpdate.lane_number} - invalid ${propertyName}`
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Lane: ${laneToUpdate.lane_number} - invalid ${propertyName}`
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
        const dontPatchJSON = JSON.stringify(laneUpdatedTo);
        const notUpdatedResponse = await axios({
          method: "patch",
          data: dontPatchJSON,
          withCredentials: true,
          url: invalidUrl,
        });

        if (notUpdatedResponse.status === 200) {
          testResults += addToResults(`Error: patched invalid id: ${id}`);
          return notUpdatedResponse;
        } else {
          testResults += addToResults(`DID NOT patch Lane, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT patch Lane, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Patch Lane Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Patching Lane, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontPatchDuplicate = async (propertyName: string, value: any) => {
      try {
        const duplicateId = "lan_8b78890d8b8e4c5b9f6b7d9e7f9b6c5d";
        const duplicateIdUrl = url + "/" + duplicateId;
        
        // use event id that has two squads
        const dupJSON = JSON.stringify({
          ...laneToUpdate,
          squad_id: 'sqd_7116ce5f80164830830a7157eb093396', 
          [propertyName]: value,
        });
        const response = await axios({
          method: "patch",
          data: dupJSON,
          withCredentials: true,
          url: duplicateIdUrl,
        });
        if (response.status !== 422) {
          testResults += addToResults(
            `Patch Error: did not return 422 for duplicate lane_number+squad_id`,
            false
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        } else {
          testResults += addToResults(
            `Patch Lane, non 422 response for duplicate lane_number+squad_id`
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Lane: ${laneToUpdate.lane_number} - duplicate lane_number+squad_id`
          );
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Patch Error: did not return 422 for duplicate lane_number+squad_id`,
            false
          );
          return {
            error: `Error Patching duplicate lane_number+squad_id`,
            status: error.response.status,
          };
        }
      }
    };

    const donttPatchNonExistentId = async (propertyName: string, value: any) => {
      const nonExitingId = "lan_12345678901234567890123456789012";
      try {
        const invalidPatchUrl = url + "/" + nonExitingId;
        const invalidJSON = JSON.stringify({
          [propertyName]: value,
        });
        const response = await axios({
          method: "patch",
          data: invalidJSON,
          withCredentials: true,
          url: invalidPatchUrl,
        });
        if (response.status === 200) {
          testResults += addToResults(
            `Error: patched non-existing id: ${nonExitingId}`
          );
          return response;
        } else {
          testResults += addToResults(
            `DID NOT patch Lane, non-existing id: ${nonExitingId}`
          );
        }
        return response;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT patch Lane, non-existing id: ${nonExitingId}`
          );
        } else {
          testResults += addToResults(
            `Patch Lane Error: did not return 404 for non-existing id: ${nonExitingId}`,
            false
          );
          return {
            error: `Error Patching Lane, non 404 response for non-existing id: ${nonExitingId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await doPatch("lane_number", 66, 66);
      await dontPatch("lane_number", 250);

      await doPatch("squad_id", 'sqd_796c768572574019a6fa79b3b1c8fa57', 'sqd_796c768572574019a6fa79b3b1c8fa57');
      await dontPatch("squad_id", "sqd_12345678901234567890123456789012");

      await dontPatchDuplicate("lane_number", 30);

      await dontPatchInvalidId("abc_123");
      await dontPatchInvalidId("lan_12345678901234567890123456789012");

      await donttPatchNonExistentId("lane_number", 4);

      return laneToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetLaneToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Lane tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Lane tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const laneDelete = async (idToDel: string, testing: boolean = true) => {    
    let testResults = results + "Delete Lane tests: \n";
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
            `Did not not delete Lane with invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Error: Could not delete Lane with invalid id: "${invalidId}"`,
            false
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `Did not not delete Lane - invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Delete Lane Error: ${error.message}`,
            false
          );
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
    };

    const laneDelUrl = url + "/" + idToDel;
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: laneDelUrl,
      });
      if (response.status === 200) {
        // if idToDel !== laneToDel.id, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (idToDel === laneToDel.id) {
          testResults += addToResults(
            `Success: Deleted Lane: ${response.data.deleted.lane_number}`
          );
        }
      } else {
        testResults += addToResults("Error: could not delete lane", false);
        return {
          error: "Could not delete lane",
          status: 404,
        };
      }

      if (testing) {
        // try to delete Lane that is parent
        // NO children for lanes, so don't test to delete parent

        await invalidDelete("abc_123");
        await invalidDelete("lane_12345678901234567890123456789012");
      }
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Error : ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await reAddDeletedLane();
      if (testing) {
        if (passed) {
          testResults += addToResults(`Delete Lane tests: PASSED`, true);
        } else {
          testResults += addToResults(`Delete Lane tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const resetAll = async () => {
    let testResults: string = "";
    passed = true;
    try {
      const reset = await resetLaneToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allLanes: any = await removeCreatedLane(true);
      if (allLanes.error) {
        testResults += addToResults(
          `Error Resetting: ${allLanes.error}`,
          false
        );
        return;
      }

      const reAdded: any = await reAddDeletedLane();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Events`);
      return {
        squads: allLanes,
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
    setLaneCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetAll();
  };

  const handleLaneTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (laneCrud) {
      case "create":
        await laneCreate();
        break;
      case "read":
        await laneReadAll(true);
        break;
      case "read1":
        await laneRead1();
        break;
      case "update":
        await laneUpdate();
        break;
      case "patch":
        await lanePatch();
        break;
      case "delete":
        await laneDelete(laneToDel.id);
        break;
      case "readSquad":
        await laneReadForSquad();
        break;
      default:
        break;
    }
  };

  const handleLaneTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = "Testing all...";
    passed = true;
    try {
      await laneCreate();
      allResults = results;
      await laneReadAll(true);
      allResults = results;
      await laneRead1();
      allResults = results;
      await laneUpdate();
      allResults = results;
      await lanePatch();
      allResults = results;
      await laneDelete(laneToDel.id);
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
          <h4>Lanes</h4>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-success"
            id="laneTest"
            onClick={handleLaneTest}
          >
            Test
          </button>
        </div>
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="laneTestAll"
            onClick={handleLaneTestAll}
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button
            className="btn btn-warning"
            id="laneClear"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-info"
            id="laneReset"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="laneCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="laneCreate"
            name="lane"
            value="create"
            checked={laneCrud === "create"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="laneRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="laneRead"
            name="lane"
            value="read"
            checked={laneCrud === "read"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="laneRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="laneRead1"
            name="lane"
            value="read1"
            checked={laneCrud === "read1"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="laneUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="laneUpdate"
            name="lane"
            value="update"
            checked={laneCrud === "update"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="lanePatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="lanePatch"
            name="lane"
            value="patch"
            checked={laneCrud === "patch"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="laneDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="laneDelete"
            name="lane"
            value="delete"
            checked={laneCrud === "delete"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-4"></div>
        <div className="col-sm-3">
          <label htmlFor="laneReadSquad" className="form-check-label">
            &nbsp;Read Squad &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="laneReadSquad"
            name="lane"
            value="readSquad"
            checked={laneCrud === "readSquad"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="laneResults"
            name="laneResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
