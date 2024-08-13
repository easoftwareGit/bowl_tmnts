import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { squadType } from "@/lib/types/types";
import { initSquad } from "@/db/initVals";
import { compareAsc } from "date-fns";

const url = baseApi + "/squads";
const squadId = "sqd_7116ce5f80164830830a7157eb093396";
const squadIdUrl = url + "/" + squadId;
const multiSquadsEventId = "evt_06055deb80674bd592a357a4716d8ef2";
const noSquadsEventId = "evt_adfcff4846474a25ad2936aca121bd37";
let passed = true;
let allResults = "";

export const DbSquads = () => {
  const [squadCrud, setSquadCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  useEffect(() => {
    setResults(results);
    // force textarea to scroll to bottom
    var textarea = document.getElementById("squadResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const squadToPost: squadType = {
    ...initSquad,
    id: "",
    event_id: "evt_cb55703a8a084acb86306e2944320e8d",
    squad_name: "Test Squad",
    games: 6,
    starting_lane: 1,
    lane_count: 16,
    squad_date: new Date(Date.UTC(2022, 1, 2)), // month is -1
    sort_order: 2,
  };

  const squadToUpdate: squadType = {
    ...initSquad,
    id: "sqd_7116ce5f80164830830a7157eb093396",
    event_id: "evt_cb97b73cb538418ab993fc867f860510",
    squad_name: "Squad 1",
    squad_date: new Date(Date.UTC(2022, 9, 23)), // month is -1
    squad_time: "",
    games: 4,
    starting_lane: 29,
    lane_count: 12,
    sort_order: 2,
  };

  const squadUpdatedTo: squadType = {
    ...initSquad,
    id: "sqd_7116ce5f80164830830a7157eb093396",
    event_id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
    squad_name: "Squad Test",
    games: 5,
    starting_lane: 1,
    lane_count: 10,
    squad_date: new Date(Date.UTC(2022, 2, 3)), // month is -1
    squad_time: "12:07 PM",
    sort_order: 4,
  };

  const squadDuplicate: squadType = {
    ...initSquad,
    id: "sqd_796c768572574019a6fa79b3b1c8fa57",
    event_id: "evt_06055deb80674bd592a357a4716d8ef2",
    squad_name: "A Squad",
    games: 6,
    starting_lane: 5,
    lane_count: 20,
    squad_date: new Date(Date.UTC(2022, 1, 2)), // month is -1
    squad_time: "11:00 AM",
    sort_order: 1,
  };

  const squadToDel: squadType = {
    ...initSquad,
    id: "sqd_3397da1adc014cf58c44e07c19914f72",
    event_id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
    squad_name: "Squad 1",
    squad_date: new Date(Date.UTC(2023, 8, 16)), // month is -1
    squad_time: "01:00 PM",
    games: 6,
    lane_count: 24,
    starting_lane: 1,
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

  const removeCreatedSquad = async (showResults: boolean) => {
    let testResults = results;
    try {
      const allSquads: squadType[] = (await squadReadAll(
        false
      )) as unknown as squadType[];
      const justPostedSquad = allSquads.filter(
        (squad) => squad.squad_name === squadToPost.squad_name
      );
      if (justPostedSquad.length === 1) {
        await squadDelete(justPostedSquad[0].id, false);
        if (showResults) {
          testResults += addToResults(
            `Reset Created Squad: ${justPostedSquad[0].squad_name}`
          );
        }
      }
      return allSquads;
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

  const resetSquadToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: squadToUpdate,
        withCredentials: true,
        url: squadIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(
            `Reset Squad: ${squadToUpdate.squad_name}`
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

  const reAddDeletedSquad = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delEventUrl = url + "/" + squadToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delEventUrl,
        });
        // if squad already exisits, do not delete it
        if (response.status === 200) {
          return {
            data: squadToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if Squad does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAddSquad = {
        ...squadToDel,
      };
      reAddSquad.id = nextPostSecret + reAddSquad.id;
      const squadJSON = JSON.stringify(reAddSquad);
      response = await axios({
        method: "post",
        data: squadJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: squadToDel,
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

  const squadCreate = async () => {
    let testResults: string = results + "Create Squad tests: \n";
    let createdSquadId: string = "";
    passed = true;

    const deleteCreated = async () => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url,
        });
        if (response.status === 200) {
          const all: squadType[] = response.data
            .squads as unknown as squadType[];
          const justCreated = all.filter(
            (squad) => squad.squad_name === squadToPost.squad_name
          );
          if (justCreated.length === 1) {
            await squadDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created squad", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const squadInvalidCreate = async (propertyName: string, value: any) => {
      try {
        const invalidSquadJSON = JSON.stringify({
          ...squadToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "post",
          data: invalidSquadJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Squad Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error creating squad with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Squad, non 422 response for squad: ${squadToUpdate.squad_name} - invalid data`
          );
          return {
            error: "Error Creating Squad, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create squad: ${squadToUpdate.squad_name} - invalid ${propertyName}`
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
            error: `Error Creating squad with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const squadCreateDuplicate = async () => {
      try {
        const duplicate = {
          ...squadDuplicate,
          id: "",
        };
        const squadJSON = JSON.stringify(duplicate);
        const invalidResponse = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Create Squad Error: did not return 422 for duplicate event_id+squad_name`,
            false
          );
          return {
            error: `Error creating squad with duplicate event_id+squad_name`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Create Squad, non 422 response for duplicate event_id+squad_name`
          );
          return {
            error:
              "Error Creating Squad, non 422 response for duplicate event_id+squad_name",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Create squad: duplicate event_id+squad_name`
          );
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Create Error: did not return 422 for duplicate event_id+squad_name`,
            false
          );
          return {
            error: `Error Creating squad with duplicate event_id+squad_name`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await deleteCreated();

      const squadJSON = JSON.stringify(squadToPost);
      const response = await axios({
        method: "post",
        data: squadJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdSquadId = response.data.squad.id;
        testResults += addToResults(
          `Created squad: ${response.data.squad.squad_name}`
        );
        const postedSquad: squadType = response.data.squad;
        if (postedSquad.event_id !== squadToPost.event_id) {
          testResults += addToResults(
            "Created squad event_id !== squadToPost.event_id",
            false
          );
        } else if (postedSquad.squad_name !== squadToPost.squad_name) {
          testResults += addToResults(
            "Created squad squad_name !== squadToPost.squad_name",
            false
          );
        } else if (postedSquad.games !== squadToPost.games) {
          testResults += addToResults(
            "Created squad games !== squadToPost.games",
            false
          );
        } else if (postedSquad.starting_lane !== squadToPost.starting_lane) {
          testResults += addToResults(
            "Created squad starting_lane !== squadToPost.starting_lane",
            false
          );
        } else if (postedSquad.lane_count !== squadToPost.lane_count) {
          testResults += addToResults(
            "Created squad lane_count !== squadToPost.lane_count",
            false
          );
        } else if (
          compareAsc(postedSquad.squad_date, squadToPost.squad_date) !== 0
        ) {
          testResults += addToResults(
            "Created squad squad_date !== squadToPost.squad_date",
            false
          );
        } else if (postedSquad.squad_time !== squadToPost.squad_time) {
          testResults += addToResults(
            "Created squad squad_time !== squadToPost.squad_time",
            false
          );
        } else if (postedSquad.sort_order !== squadToPost.sort_order) {
          testResults += addToResults(
            "Created squad sort_order !== squadToPost.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Created squad === squadToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating squad: ${squadToPost.squad_name}, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not create squad",
          status: response.status,
        };
      }

      await squadInvalidCreate("event_id", "bwl_123");
      await squadInvalidCreate("squad_name", "");
      await squadInvalidCreate("games", 0);
      await squadInvalidCreate("lane_count", -1);
      await squadInvalidCreate("starting_lane", 1234);
      await squadInvalidCreate("squad_date", "2222-13-30T12:34:56.789Z");
      await squadInvalidCreate("squad_time", "13:00 PM");
      await squadInvalidCreate("sort_order", "abc");

      await squadCreateDuplicate();

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdSquadId) {
        await squadDelete(createdSquadId, false);
      }
      if (passed) {
        testResults += addToResults(`Create Squad tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create Squad tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const squadReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Squads tests: \n";
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
            `Success: Read ${response.data.squads.length} Squads`,
            true
          );
        }
        const allSquads: squadType[] = response.data
          .squads as unknown as squadType[];
        // 7 squads in /prisma/seeds.ts
        const seedCount = 7;
        if (allSquads.length === seedCount) {
          testResults += addToResults(`Read all ${seedCount} squads`, true);
        } else {
          testResults += addToResults(
            `Error: Read ${allSquads.length} squads, expected ${seedCount}`,
            false
          );
        }

        return response.data.squads;
      } else {
        testResults += addToResults(
          `Error reading all squads, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read all squads",
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
          testResults += addToResults(`Read All Squads tests: PASSED`, true);
        } else {
          testResults += addToResults(`Read All Squads tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const squadRead1 = async () => {
    let testResults = results + "Read 1 Squad tests: \n";
    passed = true;

    const squadReadInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: invalidUrl,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read 1 Squad Error: did not return 404 for invalid id ${id}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 Squad, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 Squad, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read 1 Squad: invalid id: ${id}`
          );
          return {
            error: `invalid id: ${id}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read 1 Squad Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Reading 1 Squad, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testSquad: squadType = {
      ...initSquad,
      event_id: "evt_cb97b73cb538418ab993fc867f860510",
      squad_name: "Squad 1",
      squad_date: new Date(Date.UTC(2022, 9, 23)), // month is -1
      squad_time: null,
      games: 6,
      lane_count: 12,
      starting_lane: 29,
      sort_order: 1,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: squadIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 Squad: ${response.data.squad.squad_name}`,
          true
        );
        const readSquad: squadType = response.data.squad;
        if (readSquad.event_id !== testSquad.event_id) {
          testResults += addToResults(
            "Read 1 Squad event_id !== testSquad.event_id",
            false
          );
        } else if (readSquad.squad_name !== testSquad.squad_name) {
          testResults += addToResults(
            "Read 1 Squad squad_name !== testSquad.squad_name",
            false
          );
        } else if (readSquad.games !== testSquad.games) {
          testResults += addToResults(
            "Read 1 Squad games !== testSquad.games",
            false
          );
        } else if (readSquad.lane_count !== testSquad.lane_count) {
          testResults += addToResults(
            "Read 1 Squad lane_count !== testSquad.lane_count",
            false
          );
        } else if (readSquad.starting_lane !== testSquad.starting_lane) {
          testResults += addToResults(
            "Read 1 Squad starting_lane !== testSquad.starting_lane",
            false
          );
        } else if (
          compareAsc(readSquad.squad_date, testSquad.squad_date) !== 0
        ) {
          testResults += addToResults(
            "Read 1 Squad squad_date !== testSquad.squad_date",
            false
          );
        } else if (readSquad.squad_time !== testSquad.squad_time) {
          testResults += addToResults(
            "Read 1 Squad squad_time !== testSquad.squad_time",
            false
          );
        } else if (readSquad.sort_order !== testSquad.sort_order) {
          testResults += addToResults(
            "Read 1 Squad sort_order !== testSquad.sort_order",
            false
          );
        } else {
          testResults += addToResults(`Read 1 Squad === testSquad`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 squad, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read 1 squad",
          status: response.status,
        };
      }

      // test invalid url
      await squadReadInvalidId("abc_123");
      // test non existing squad
      await squadReadInvalidId("sqd_12345678901234567890123456789012");

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Read 1 Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Read 1 Squad tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 Squad tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const squadReadForEvent = async () => {
    let testResults = results + "Read Squads for an Event tests: \n";
    passed = true;

    const validReadForEvent = async (eventId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/event/" + eventId,
        });
        if (response.status === 200) {
          testResults += addToResults(
            `Success: Read Squads for Event, eventId: ${eventId}`
          );
          const readSquads: squadType[] = response.data.squads;
          if (eventId === multiSquadsEventId) {
            if (readSquads.length !== 2) {
              testResults += addToResults(
                "Error: Read Squads for Event length !== 2",
                false
              );
              return {
                error: "Error: Read Squads for Event, length !== 2",
                status: 404,
              };
            }
            readSquads.forEach((squad: squadType) => {
              if (
                !(
                  squad.id === "sqd_42be0f9d527e4081972ce8877190489d" ||
                  squad.id === "sqd_796c768572574019a6fa79b3b1c8fa57"
                )
              ) {
                testResults += addToResults(
                  "Error: Read Squads for Event squad.id invalid",
                  false
                );
                return {
                  error: "Error: Read Squads for Event, squad.id invalid",
                  status: 404,
                };
              }
            });
          } else if (eventId === noSquadsEventId) {
            if (readSquads.length !== 0) {
              testResults += addToResults(
                "Error: Read Squads for Event length !== 0",
                false
              );
              return {
                error: "Error: Read Squads for Event, length !== 0",
                status: 404,
              };
            }
          }
          testResults += addToResults(
            `Success: Read Squads for Event, ${readSquads.length} rows returned`
          );
        } else {
          testResults += addToResults(
            `Error reading squads for Event, response status: ${response.status}`,
            false
          );
          return {
            error: "Did not read squads for event",
            status: response.status,
          };
        }
        return response.data.squads;
      } catch (error: any) {
        testResults += addToResults(
          `Read Squads for Event Error: ${error.message}`,
          false
        );
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    const invalidReadForEvent = async (eventId: string) => {
      try {
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/event/" + eventId,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read Squads for Event Error: did not return 404 for invalid id ${eventId}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${eventId}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read Squads for Event, non 404 response for invalid id: ${eventId}`
          );
          return {
            error: `Error Reading Squads for Event, non 404 response for invalid id: ${eventId}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT Read Squads for Event: invalid id: ${eventId}`
          );
          return {
            error: `invalid id: ${eventId}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read Squads for Event Error: did not return 404 for invalid id: ${eventId}`,
            false
          );
          return {
            error: `Error Reading Squads for Event, non 404 response for invalid id: ${eventId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await validReadForEvent(multiSquadsEventId);
      await validReadForEvent(noSquadsEventId);

      await invalidReadForEvent("evt_123");
      await invalidReadForEvent("usr_cb97b73cb538418ab993fc867f860510");
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
        testResults += addToResults(`Read Squads for an Event tests: PASSED`);
      } else {
        testResults += addToResults(
          `Read Squads for an Event tests: FAILED`,
          false
        );
      }
      setResults(testResults);
    }
  };

  const squadUpdate = async () => {
    let testResults = results + "Update Squad tests: \n";
    passed = true;

    const squadUpdateValid = async () => {
      try {
        const squadJSON = JSON.stringify(squadUpdatedTo);
        const response = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: squadIdUrl,
        });
        if (response.status !== 200) {
          const errMsg = (response as any).message;
          testResults += addToResults(`Error: ${errMsg.message}`, false);
          return response;
        }
        const updatedSquad: squadType = response.data.squad;
        if (updatedSquad.event_id !== squadUpdatedTo.event_id) {
          testResults += addToResults(
            "Updated squad event_id !== squadUpdatedTo.event_id",
            false
          );
        } else if (updatedSquad.squad_name !== squadUpdatedTo.squad_name) {
          testResults += addToResults(
            "Updated squad squad_name !== squadUpdatedTo.squad_name",
            false
          );
        } else if (updatedSquad.games !== squadUpdatedTo.games) {
          testResults += addToResults(
            "Updated squad games !== squadUpdatedTo.games",
            false
          );
        } else if (
          updatedSquad.starting_lane !== squadUpdatedTo.starting_lane
        ) {
          testResults += addToResults(
            "Updated squad starting_lane !== squadUpdatedTo.starting_lane",
            false
          );
        } else if (updatedSquad.lane_count !== squadUpdatedTo.lane_count) {
          testResults += addToResults(
            "Updated squad lane_count !== squadUpdatedTo.lane_count",
            false
          );
        } else if (
          compareAsc(updatedSquad.squad_date, squadUpdatedTo.squad_date) !== 0
        ) {
          testResults += addToResults(
            "Updated squad squad_date !== squadUpdatedTo.squad_date",
            false
          );
        } else if (updatedSquad.squad_time !== squadUpdatedTo.squad_time) {
          testResults += addToResults(
            "Updated squad squad_time !== squadUpdatedTo.squad_time",
            false
          );
        } else if (updatedSquad.sort_order !== squadUpdatedTo.sort_order) {
          testResults += addToResults(
            "Updated squad sort_order !== squadUpdatedTo.sort_order",
            false
          );
        } else {
          testResults += addToResults(
            `Updated Squad: ${updatedSquad.squad_name}`
          );
        }
        return response;
      } catch (error: any) {
        testResults += addToResults(`Error: ${error.message}`, false);
        return error;
      }
    };

    const squadInvalidUpdate = async (propertyName: string, value: any) => {
      try {
        const invalidSquadJSON = JSON.stringify({
          ...squadToUpdate,
          [propertyName]: value,
        });
        const invalidResponse = await axios({
          method: "put",
          data: invalidSquadJSON,
          withCredentials: true,
          url: squadIdUrl,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(
            `Update Squad Error: did not return 422 for invalid ${propertyName}`,
            false
          );
          return {
            error: `Error updating squad with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Update Squad, non 422 response for squad: ${squadToUpdate.squad_name} - invalid data`
          );
          return {
            error: "Error Updating Squad, non 422 response for invalid data",
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Update squad: ${squadToUpdate.squad_name} - invalid ${propertyName}`
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
            error: `Error Updating squad with invalid ${propertyName}`,
            status: error.response.status,
          };
        }
      }
    };

    const squadUpdateInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const squadJSON = JSON.stringify(squadUpdatedTo);
        const notUpdatedResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: invalidUrl,
        });

        if (notUpdatedResponse.status === 200) {
          testResults += addToResults(`Error: updated invalid id: ${id}`);
          return notUpdatedResponse;
        } else {
          testResults += addToResults(
            `DID NOT update Squad, invalid id: ${id}`
          );
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT update Squad, invalid id: ${id}`
          );
        } else {
          testResults += addToResults(
            `Update Squad Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Updating Squad, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const squadDontUpdateDuplicate = async () => {
      // get url with id of squad to duplicate
      const duplicatIdUrl = url + "/" + "sqd_796c768572574019a6fa79b3b1c8fa57";
      try {
        const squadJSON = JSON.stringify(squadDuplicate);
        const response = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: duplicatIdUrl,
        });
        if (response.status === 200) {
          testResults += addToResults(
            `Error: updated duplicate event_id+squad_name`,
            false
          );
          return response;
        } else {
          testResults += addToResults(
            `DID NOT update Squad, duplicate event_id+squad_name`,
            false
          );
        }
        return response;
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT update Squad, duplicate event_id+squad_name`
          );
        } else {
          testResults += addToResults(
            `Update Squad Error: did not return 422 for duplicate event_id+squad_name`,
            false
          );
          return {
            error: `Error Updating Squad, non 422 response for duplicate event_id+squad_name`,
            status: error.response.status,
          };
        }
        return error;
      }
    };

    try {
      // 1) valid full squad object
      const updated = await squadUpdateValid();

      // 2) invalid Squad object
      await squadInvalidUpdate("event_id", "bwl_123");
      await squadInvalidUpdate("squad_name", "");
      await squadInvalidUpdate("games", 0);
      await squadInvalidUpdate("starting_lane", "abc");
      await squadInvalidUpdate("lane_count", 11);
      await squadInvalidUpdate("squad_date", "abc");
      await squadInvalidUpdate("squad_time", "1234567890");
      await squadInvalidUpdate("sort_order", "abc");

      // 3) invalid Squad id
      await squadUpdateInvalidId("abc_123");
      // 4 non existing Squad id
      await squadUpdateInvalidId("sqd_12345678901234567890123456789012");

      // 5) duplicate Event
      await squadDontUpdateDuplicate();

      return updated;
    } catch (error: any) {
      testResults += addToResults(`Update Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetSquadToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update Squad tests: PASSED`, true);
      } else {
        testResults += addToResults(`Update Squad tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const squadPatch = async () => {
    let testResults = results + "Patch Squad tests: \n";
    passed = true;

    const doPatch = async (
      propertyName: string,
      value: any,
      matchValue: any
    ) => {
      try {
        const patchJSON = JSON.stringify({
          [propertyName]: value,
        });
        const response = await axios({
          method: "patch",
          data: patchJSON,
          withCredentials: true,
          url: squadIdUrl,
        });
        if (response.status === 200) {
          if (propertyName === "squad_date") {
            const resDate = new Date(response.data.squad.squad_date);
            if (compareAsc(resDate, matchValue) === 0) {
              testResults += addToResults(
                `Patched Squad: ${squadToUpdate.squad_name} - just ${propertyName}`
              );
            } else {
              testResults += addToResults(
                `DID NOT Patch Squad ${propertyName}`,
                false
              );
            }
          } else {
            if (response.data.squad[propertyName] === matchValue) {
              testResults += addToResults(
                `Patched Squad: ${squadToUpdate.squad_name} - just ${propertyName} - value: "${value}"`,
              );
            } else {
              testResults += addToResults(
                `DID NOT Patch Squad ${propertyName} - value: "${value}"`,
                false
              );
            }
          }
          return {
            data: response.data.squad,
            status: response.status,
          };
        } else {
          testResults += addToResults(`doPatch Error: ${propertyName} - value: "${value}"`, false);
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
        const reset = await resetSquadToUpdate(false);
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
          url: squadIdUrl,
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
            `Patch Squad, non 422 response for squad: ${squadToUpdate.squad_name} - invalid ${propertyName}`
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Squad: ${squadToUpdate.squad_name} - invalid ${propertyName}`
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
        const invalidJSON = JSON.stringify(squadUpdatedTo);
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
          testResults += addToResults(`DID NOT patch Squad, invalid id: ${id}`);
        }
        return notUpdatedResponse;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT patch Squad, invalid id: ${id}`);
        } else {
          testResults += addToResults(
            `Patch Squad Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Patching Squad, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const dontPatchDuplicate = async (propertyName: string, value: any) => {
      try {
        const duplicateId = "sqd_796c768572574019a6fa79b3b1c8fa57";
        const duplicateIdUrl = url + "/" + duplicateId;

        // use event id that has two squads
        const dupJSON = JSON.stringify({
          ...squadToUpdate,
          event_id: "evt_06055deb80674bd592a357a4716d8ef2",
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
            `Patch Error: did not return 422 for duplicate squad_name+event_id`,
            false
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        } else {
          testResults += addToResults(
            `Patch Squad, non 422 response for duplicate squad_name+event_id`
          );
          return {
            error: "Error Patching Event",
            status: response.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(
            `DID NOT Patch Squad: ${squadToUpdate.squad_name} - duplicate squad_name+event_id`
          );
          return {
            error: "",
            status: error.response.status,
          };
        } else {
          testResults += addToResults(
            `Patch Error: did not return 422 for duplicate squad_name+event_id`,
            false
          );
          return {
            error: `Error Patching duplicate squad_name+event_id`,
            status: error.response.status,
          };
        }
      }
    };

    const dontPatchNonExistentId = async (propertyName: string, value: any) => {
      const nonExitingId = "sqd_12345678901234567890123456789012";
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
            `DID NOT patch Squad, non-existing id: ${nonExitingId}`
          );
        }
        return response;
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `DID NOT patch Squad, non-existing id: ${nonExitingId}`
          );
        } else {
          testResults += addToResults(
            `Patch Squad Error: did not return 404 for non-existing id: ${nonExitingId}`,
            false
          );
          return {
            error: `Error Patching Squad, non 404 response for non-existing id: ${nonExitingId}`,
            status: error.response.status,
          };
        }
      }
    };

    try {
      await doPatch(
        "event_id",
        "evt_adfcff4846474a25ad2936aca121bd37",
        "evt_adfcff4846474a25ad2936aca121bd37"
      );
      await dontPatch("event_id", "evt_12345678901234567890123456789012");

      await doPatch("squad_name", "Testing Squad * ", "Testing Squad");
      await doPatch("squad_name", "<script>alert(1)</script>", "alert1");
      await dontPatch("squad_name", "<script></script>");

      await doPatch("games", 2, 2);
      await dontPatch("games", 123);

      await doPatch("starting_lane", 29, 29);
      await dontPatch("starting_lane", 202);

      await doPatch("lane_count", 14, 14);
      await dontPatch("lane_count", "abc");

      await doPatch(
        "squad_date",
        new Date(Date.UTC(2022, 3, 4)),
        new Date(Date.UTC(2022, 3, 4))
      ); // month is -1
      await dontPatch("squad_date", "2022-22-22");

      await doPatch("squad_time", "05:00 PM", "05:00 PM");
      await doPatch("squad_time", "", "");
      await doPatch("squad_time", null, null);
      await dontPatch("squad_time", "15:00 PM");

      await doPatch("sort_order", 5, 5);
      await dontPatch("sort_order", 1.5);

      await dontPatchDuplicate("squad_name", "A Squad");

      await dontPatchInvalidId("abc_123");
      await dontPatchInvalidId("bwl_12345678901234567890123456789012");

      await dontPatchNonExistentId("squad_name", "C Squad");

      return squadToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetSquadToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Squad tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Squad tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const squadDelete = async (idToDel: string, testing: boolean = true) => {
    let testResults = results + "Delete Squad tests: \n";
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
            `Did not not delete Squad with invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Error: Could not delete Squad with invalid id: "${invalidId}"`,
            false
          );
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(
            `Did not not delete Squad - invalid id: "${invalidId}"`
          );
        } else {
          testResults += addToResults(
            `Delete Squad Error: ${error.message}`,
            false
          );
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
    };

    const squadDelUrl = url + "/" + idToDel;
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: squadDelUrl,
      });
      if (response.status === 200) {
        // if idToDel !== squadToDel.id, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (idToDel === squadToDel.id) {
          testResults += addToResults(
            `Success: Deleted Squad: ${response.data.deleted.squad_name}`
          );
        }
      } else {
        testResults += addToResults("Error: could not delete squad", false);
        return {
          error: "Could not delete squad",
          status: 404,
        };
      }

      if (testing) {
        // try to delete Squad that is parent
        try {
          const cantDelUrl = url + "/" + squadToUpdate.id;
          const cantDelResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: cantDelUrl,
          });
          if (cantDelResponse.status === 409) {
            testResults += addToResults(
              `Did not not delete squad: ${squadToUpdate.squad_name} with children`
            );
          } else {
            testResults += addToResults(
              `Error: Could not delete squad: ${squadToUpdate.squad_name}`,
              false
            );
          }
        } catch (error: any) {
          if (error.response.status === 409) {
            testResults += addToResults(
              `Did not not delete squad: ${squadToUpdate.squad_name} with children`
            );
          } else {
            testResults += addToResults(
              `Delete Squad Error: ${error.message}`,
              false
            );
            return {
              error: error.message,
              status: error.response.status,
            };
          }
        }
        await invalidDelete("abc_123");
        await invalidDelete("sqd_12345678901234567890123456789012");
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
        await reAddDeletedSquad();
        if (passed) {
          testResults += addToResults(`Delete Squad tests: PASSED`, true);
        } else {
          testResults += addToResults(`Delete Squad tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const resetAll = async () => {
    let testResults: string = "";
    passed = true;
    try {
      const reset = await resetSquadToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allSquads: any = await removeCreatedSquad(true);
      if (allSquads.error) {
        testResults += addToResults(
          `Error Resetting: ${allSquads.error}`,
          false
        );
        return;
      }

      const reAdded: any = await reAddDeletedSquad();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Events`);
      return {
        squads: allSquads,
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
    setSquadCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setResults("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetAll();
  };

  const handleSquadTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (squadCrud) {
      case "create":
        await squadCreate();
        break;
      case "read":
        await squadReadAll(true);
        break;
      case "read1":
        await squadRead1();
        break;
      case "update":
        await squadUpdate();
        break;
      case "patch":
        await squadPatch();
        break;
      case "delete":
        await squadDelete(squadToDel.id);
        break;
      case "readEvent":
        await squadReadForEvent();
        break;
      default:
        break;
    }
  };

  const handleSquadTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = "Testing all...";
    passed = true;
    try {
      await squadCreate();
      allResults = results;
      await squadReadAll(true);
      allResults = results;
      await squadRead1();
      allResults = results;
      await squadUpdate();
      allResults = results;
      await squadPatch();
      allResults = results;
      await squadDelete(squadToDel.id);
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
          <h4>Squads</h4>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-success"
            id="squadTest"
            onClick={handleSquadTest}
          >
            Test
          </button>
        </div>
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="squadTestAll"
            onClick={handleSquadTestAll}            
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button
            className="btn btn-warning"
            id="squadClear"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-info"
            id="squadReset"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="squadCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="squadCreate"
            name="squad"
            value="create"
            checked={squadCrud === "create"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="squadRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="squadRead"
            name="squad"
            value="read"
            checked={squadCrud === "read"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="squadRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="squadRead1"
            name="squad"
            value="read1"
            checked={squadCrud === "read1"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="squadUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="squadUpdate"
            name="squad"
            value="update"
            checked={squadCrud === "update"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="squadPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="squadPatch"
            name="squad"
            value="patch"
            checked={squadCrud === "patch"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="squadDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="squadDelete"
            name="squad"
            value="delete"
            checked={squadCrud === "delete"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-4"></div>
        <div className="col-sm-3">
          <label htmlFor="squadReadEvent" className="form-check-label">
            &nbsp;Read Event &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="squadReadEvent"
            name="squad"
            value="readEvent"
            checked={squadCrud === "readEvent"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="squadResults"
            name="squadResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
