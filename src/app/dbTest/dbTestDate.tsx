import React, { ChangeEvent, useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { testDateType } from "@/lib/types/types";
import { initTestDate } from "@/db/initVals";
import { addDays, addMilliseconds, compareAsc, endOfDay, getYear, isValid, startOfDay } from "date-fns";
import { dateTo_UTC_MMddyyyy, dateTo_UTC_yyyyMMdd, dateTo_yyyyMMdd, endOfDayFromString, getYearMonthDays, nowOnDayFromString, startOfDayFromString, todayStr, ymdType } from "@/lib/dateTools";
import { populate } from "dotenv";

const url = baseApi + "/testdate";
const testDateId = 10;
const testDateIdUrl = url + "/" + '10';
let passed = true;
let allResults = "";

export const DbTestDate= () => {
  const [crud, setCrud] = React.useState("create");
  const [results, setResults] = React.useState("");

  const [td1, setTd1] = React.useState(initTestDate);
  const [td2, setTd2] = React.useState(initTestDate);

  useEffect(() => {
    setResults(results);
    // force textarea to scroll to bottom
    var textarea = document.getElementById("testDateResults");
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const tdToPost: testDateType = {
    ...initTestDate,    
    id: 13,
    sod: new Date(Date.UTC(2024, 11, 31)),
    eod: new Date(Date.UTC(2024, 11, 31, 23, 59, 59, 999)),
    gmt: new Date(Date.UTC(2024, 11, 31, 1, 2, 3, 0))        
};
    
  const tdToUpdate: testDateType = {
    ...initTestDate,
    id: 10,
    sod: new Date(Date.UTC(2023, 0, 1)),
    eod: new Date(Date.UTC(2023, 0, 1, 23, 59, 59, 999)),
    gmt: new Date(Date.UTC(2023, 0, 1, 1, 2, 3, 0)) 
  };

  const tdUpdatedTo: testDateType = {
    ...initTestDate,
    id: 11,
    sod: new Date(Date.UTC(2024, 8, 4)),
    eod: new Date(Date.UTC(2024, 8, 4, 23, 59, 59, 999)),
    gmt: new Date(Date.UTC(2024, 8, 4, 1, 2, 3, 0))        
  };

  const tdToDel: testDateType = {
    ...initTestDate,
    id: 12,
    sod: new Date(Date.UTC(2024, 0, 1)),
    eod: new Date(Date.UTC(2024, 0, 1, 23, 59, 59, 999)),
    gmt: new Date(Date.UTC(2024, 0, 1, 1, 2, 3, 0))        
  };
  
  const stringsToDates = (td: testDateType): testDateType => {
    td.sod = new Date(td.sod);
    td.eod = new Date(td.eod);
    td.gmt = new Date(td.gmt);
    return td;
  }

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

  const removeCreatedTd = async (showResults: boolean) => {
    let testResults = results;
    try {
      const all: testDateType[] = (await tdReadAll(false)) as unknown as testDateType[];
      const justPosted = all.filter((obj) => obj.id === tdToPost.id);
      if (justPosted.length === 1) {
        await tdDelete(justPosted[0].id, false);
        if (showResults) {
          testResults += addToResults(`Reset Created Td: ${justPosted[0].id}`);
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

  const resetTdToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: tdToUpdate,
        withCredentials: true,
        url: testDateIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Reset Td: ${tdToUpdate.id}`);
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

  const reAddDeletedTd = async () => {
    let testResults = results;
    try {
      let response;
      try {
        const delUrl = url + "/" + tdToDel.id;
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delUrl,
        });
        // if td already exisits, do not delete it
        if (response.status === 200) {
          return {
            data: tdToDel,
            status: 201,
          };
        } else {
          return {
            error: "Error re-adding",
            status: response.status,
          };
        }
      } catch (error: any) {
        // should get a 404 error if td does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status,
          };
        }
      }
      const reAddTd = {
        ...tdToDel,
      };
      const reAddJSON = JSON.stringify(reAddTd);
      response = await axios({
        method: "post",
        data: reAddJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: tdToDel,
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

  const tdCreate = async () => {
    let testResults: string = results + "Create Td tests: \n";
    let createdId: number = 0;
    passed = true;

    const deleteCreated = async () => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url,
        });
        if (response.status === 200) {
          const all: testDateType[] = response.data.testDates as unknown as testDateType[];
          const justCreated = all.filter((obj) => obj.id > 12);
          if (justCreated.length === 1) {
            await tdDelete(justCreated[0].id, false);
          }
        }
      } catch (error: any) {
        testResults += addToResults("Error deleteing created td", false);
        return {
          error: error.message,
          status: 404,
        };
      }
    };

    try {
      await deleteCreated();

      const createJSON = JSON.stringify(tdToPost);
      const response = await axios({
        method: "post",
        data: createJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdId = response.data.td.id;
        testResults += addToResults(`Created td: ${response.data.td.id}`);
        const postedTd: testDateType = response.data.td;
        stringsToDates(postedTd);
        if (compareAsc(postedTd.sod, tdToPost.sod) !== 0) {
          testResults += addToResults("Created td sod !== tdToPost.sod", false);
        } else if (compareAsc(postedTd.eod, tdToPost.eod) !== 0) {
          testResults += addToResults(
            "Created td eod !== tdToPost.eod",
            false
          );
        } else if (compareAsc(postedTd.gmt, tdToPost.gmt) !== 0) {
          testResults += addToResults(
            "Created td gmt !== tdToPost.gmt",
            false
          );
        } else {
          testResults += addToResults(`Created td === tdToPost`);
        }
      } else {
        testResults += addToResults(
          `Error creating td: ${tdToPost.id}, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not create td",
          status: response.status,
        };
      }

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdId > 0) {
        await tdDelete(createdId, false);
      }
      if (passed) {
        testResults += addToResults(`Create Td tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create Td tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tdReadAll = async (showResults: boolean) => {
    let testResults = results + "Read All Tds tests: \n";
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
            `Success: Read ${response.data.testDates.length} Tds`,
            true
          );
        }
        const all: testDateType[] = response.data.testDates as unknown as testDateType[];
        // 12 tds in /prisma/seeds.ts
        const seedCount = 12;
        if (all.length === seedCount) {
          testResults += addToResults(`Read all ${seedCount} tds`, true);
        } else {
          testResults += addToResults(
            `Error: Read ${all.length} tds, expected ${seedCount}`,
            false
          );
        }
        return response.data.testDates;
      } else {
        testResults += addToResults(
          `Error reading all tds, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read all tds",
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
          testResults += addToResults(`Read All Tds tests: PASSED`, true);
        } else {
          testResults += addToResults(`Read All Tds tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const tdRead1 = async () => {
    let testResults = results + "Read 1 Td tests: \n";
    passed = true;

    const readInvalidId = async (id: number) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: invalidUrl,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(
            `Read 1 Td Error: did not return 404 for invalid id ${id}`,
            false
          );
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(
            `Read 1 Td, non 404 response for invalid id: ${id}`
          );
          return {
            error: `Error Reading 1 Td, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read 1 Td: invalid id: ${id}`);
          return {
            error: `invalid id: ${id}`,
            status: 404,
          };
        } else {
          testResults += addToResults(
            `Read 1 Td Error: did not return 404 for invalid id: ${id}`,
            false
          );
          return {
            error: `Error Reading 1 Td, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };
        }
      }
    };

    const testTd: testDateType = {
      ...tdToUpdate,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: testDateIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Read 1 Td: ${response.data.td.id}`,
          true
        );
        const readTd: testDateType = response.data.td;
        stringsToDates(readTd);

        if (compareAsc(readTd.sod, testTd.sod) !== 0) {
          testResults += addToResults("Read 1 Td sod !== testTd.sod", false);
        } else if (compareAsc(readTd.eod, testTd.eod) !== 0) {
          testResults += addToResults("Read 1 Td eod !== testTd.eod", false);
        } else if (compareAsc(readTd.gmt, testTd.gmt) !== 0) {
          testResults += addToResults("Read 1 Td gmt !== testTd.gmt", false);
        } else {
          testResults += addToResults(`Read 1 Td === testTd`);
        }
      } else {
        testResults += addToResults(
          `Error reading 1 td, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not read 1 td",
          status: response.status,
        };
      }

      // test invalid url
      await readInvalidId(0);
      // test non existing elim
      await readInvalidId(1234567);

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
        testResults += addToResults(`Read 1 Td tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 Td tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tdUpdate = async () => {
    let testResults = results + "Update Td tests: \n";
    passed = true;

    const updateValid = async () => {
      try {
        const updateJSON = JSON.stringify(tdUpdatedTo);
        const response = await axios({
          method: "put",
          data: updateJSON,
          withCredentials: true,
          url: testDateIdUrl,
        });
        if (response.status !== 200) {
          const errMsg = (response as any).message;
          testResults += addToResults(`Error: ${errMsg.message}`, false);
          return response;
        }
        const updated: testDateType = response.data.td;
        stringsToDates(updated);
        if (compareAsc(updated.sod, tdUpdatedTo.sod) !== 0) {
          testResults += addToResults(
            "Updated td sod !== tdUpdatedTo.sod",
            false
          );
        } else if (compareAsc(updated.eod, tdUpdatedTo.eod) !== 0) {
          testResults += addToResults(
            "Updated td eod !== tdUpdatedTo.eod",
            false
          );
        } else if (compareAsc(updated.gmt, tdUpdatedTo.gmt) !== 0) {
          testResults += addToResults(
            "Updated td gmt !== tdUpdatedTo.gmt",
            false
          );
        } else {
          testResults += addToResults(`Updated Td: ${updated.id}`);
        }
        return response;
      } catch (error: any) {
        testResults += addToResults(`Error: ${error.message}`, false);
        return error;
      }
    };

    try {
      // 1) valid full td object
      const updated = await updateValid();

      return updated;
    } catch (error: any) {
      testResults += addToResults(`Update Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetTdToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update Td tests: PASSED`, true);
      } else {
        testResults += addToResults(`Update Td tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tdPatch = async () => {
    let testResults = results + "Patch Td tests: \n";
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
          url: testDateIdUrl,
        });
        if (response.status === 200) {
          const resDate = new Date(response.data.td[propertyName]);
          if (compareAsc(resDate, matchValue) === 0) {
            testResults += addToResults(
              `Patched Td: ${tdToUpdate.id} - just ${propertyName}`
            );
          } else {
            testResults += addToResults(`DID NOT Patch Td ${propertyName}`, false);
          }
          return {
            data: response.data.td,
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
        const reset = await resetTdToUpdate(false);
      }
    };

    try {      
      await doPatch("sod", new Date(Date.UTC(2010, 10, 11)), new Date(Date.UTC(2010, 10, 11)));

      await doPatch("eod", new Date(Date.UTC(2011, 11, 10)), new Date(Date.UTC(2011, 11, 10)));

      const gmtDate = new Date(Date.UTC(2001, 1, 2, 1, 2, 3, 0))
      await doPatch("gmt", gmtDate, gmtDate);

      return tdToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      const reset = await resetTdToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Td tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Td tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tdDelete = async (testDateIdToDel: number, testing: boolean = true) => {
    let testResults = results + "Delete Td tests: \n";
    if (testing) {
      passed = true;
    }    

    const delUrl = url + "/" + testDateIdToDel;
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
        if (testDateIdToDel === tdToDel.id) {
          if (response.data.deleted.id === tdToDel.id) {
            testResults += addToResults(
              `Success: Deleted Td: ${tdToDel.id}`
            );
          } else {
            testResults += addToResults(
              `Error Deleted Td: ${tdToDel.id}`,
              false
            );
            return {
              error: "Error deleting td",
              status: 404,
            };
          }
          testResults += addToResults(
            `Success: Deleted Td: ${response.data.deleted.id}`
          );
        }
      } else {
        testResults += addToResults("Error: could not delete td", false);        
        return {
          error: "Could not delete td",
          status: 404,
        };
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
        await reAddDeletedTd();
        if (passed) {
          testResults += addToResults(`Delete Td tests: PASSED`, true);
        } else {
          testResults += addToResults(`Delete Td tests: FAILED`, false);
        }
        setResults(testResults);
      }
    }
  };

  const resetAll = async () => {
    let testResults: string = "";
    passed = true;
    try {
      const reset = await resetTdToUpdate(false);
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false);
        return;
      }

      const allTds: any = await removeCreatedTd(true);
      if (allTds.error) {
        testResults += addToResults(`Error Resetting: ${allTds.error}`, false);
        return;
      }

      const reAdded: any = await reAddDeletedTd();
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false);
        return;
      }

      testResults += addToResults(`Reset Tds`);
      return {
        divs: allTds,
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
        await tdCreate();
        break;
      case "read":
        await tdReadAll(true);
        break;
      case "read1":
        await tdRead1();
        break;
      case "update":
        await tdUpdate();
        break;
      case "patch":
        await tdPatch();
        break;
      case "delete":
        await tdDelete(tdToDel.id);
        break;
      case 'populate':
        await tdPopulate();
        break;
      case 'pdi':
        await tdPdi();
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
      await tdCreate();
      allResults = results;
      await tdReadAll(true);
      allResults = results;
      await tdRead1();
      allResults = results;
      await tdUpdate();
      allResults = results;
      await tdPatch();
      allResults = results;
      await tdDelete(tdToDel.id);
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

  const tdPopulate = async () => {
    let testResults = results + "Populate Td1 tests: \n";
    passed = true;

    const testTd: testDateType = {
      ...tdToUpdate,
    };
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: testDateIdUrl,
      });
      if (response.status === 200) {
        testResults += addToResults(
          `Success: Populate Td1: ${response.data.td.id}`,
          true
        );
        const readTd: testDateType = response.data.td;
        stringsToDates(readTd);
        setTd1(readTd);    
        setTd2(readTd);
      } else {
        testResults += addToResults(
          `Error populating td1, response status: ${response.status}`,
          false
        );
        return {
          error: "Did not populate td1",
          status: response.status,
        };
      }

      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Populate Td1 Error: ${error.message}`, false);
      setResults(testResults);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Populate Td1 tests: PASSED`, true);
      } else {
        testResults += addToResults(`Populate Td1 tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const tdPdi = async () => {
    let testResults = results + "Pdi Td tests: \n";
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
          url: testDateIdUrl,
        });
        if (response.status === 200) {
          const resDate = new Date(response.data.td[propertyName]);
          if (compareAsc(resDate, matchValue) === 0) {
            testResults += addToResults(
              `Patched Td: ${tdToUpdate.id} - just ${propertyName}`
            );
          } else {
            testResults += addToResults(`DID NOT Patch Td ${propertyName}`, false);
          }
          return {
            data: response.data.td,
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
        // const reset = await resetTdToUpdate(false);
      }
    };

    try {      
      if (compareAsc(td1.sod, td2.sod) !== 0) {
        await doPatch("sod", td1.sod, td1.sod);  
      }
      if (compareAsc(td1.eod, td2.eod) !== 0) {
        await doPatch("eod", td1.eod, td1.eod);
      }
      if (compareAsc(td1.gmt, td2.gmt) !== 0) {
        await doPatch("gmt", td1.gmt, td1.gmt);
      }

      setTd2(td1);
      return tdToUpdate;
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      // const reset = await resetTdToUpdate(false);
      if (passed) {
        testResults += addToResults(`Patch Td tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Td tests: FAILED`, false);
      }
      setResults(testResults);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newTd = {
      ...td1,
    }
    const ymd: ymdType = getYearMonthDays(value);
    const years = Number(value.substring(0, 4));
    const months = Number(value.substring(5, 7)) - 1;    
    const days = Number(value.substring(8, 10));
    if (name === "td1sod") {      
      newTd.sod = new Date(Date.UTC(ymd.year, ymd.month, ymd.days))        
    }
    if (name === "td1eod") {
      newTd.eod = new Date(Date.UTC(ymd.year, ymd.month, ymd.days, 23, 59, 59, 999))        
    }
    if (name === "td1gmt") {
      newTd.gmt = new Date(Date.UTC(ymd.year, ymd.month, ymd.days, 1, 2, 3, 0))        
    }
    setTd1({
      ...newTd
    })
  };

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <h4>Eliminators</h4>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-success" id="tdTest" onClick={handleElimTest}>
            Test
          </button>
        </div>
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="tdTestAll"
            onClick={handleBrktTestAll}
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button className="btn btn-warning" id="tdClear" onClick={handleClear}>
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-info" id="tdReset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="tdCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tdCreate"
            name="td"
            value="create"
            checked={crud === "create"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tdRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tdRead"
            name="td"
            value="read"
            checked={crud === "read"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tdRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tdRead1"
            name="td"
            value="read1"
            checked={crud === "read1"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tdUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tdUpdate"
            name="td"
            value="update"
            checked={crud === "update"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tdPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tdPatch"
            name="td"
            value="patch"
            checked={crud === "patch"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="tdDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tdDelete"
            name="td"
            value="delete"
            checked={crud === "delete"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-4">
          <label htmlFor="tdPopulate" className="form-check-label">
            &nbsp;Populate Date Inputs &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tdPopulate"
            name="td"
            value="populate"
            checked={crud === "populate"}
            onChange={handleCrudChange}            
          />
        </div>
        <div className="col-sm-4">
          <label htmlFor="tdPdi" className="form-check-label">
            &nbsp;Patch Date Inputs &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="tdPdi"
            name="td"
            value="pdi"
            checked={crud === "pdi"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-4">
          <label htmlFor="td1sod" className="form-label">
            TD1 StartOfDay
          </label>
          <input
            type="date"
            className="form-control"
            id="td1sod"
            name="td1sod"
            value={dateTo_UTC_yyyyMMdd(td1.sod)}
            onChange={handleInputChange}            
          />
          <input 
            type="text"
            className="form-control"
            id="td1sodUTC"
            name="td1sodUTC"
            value={dateTo_UTC_MMddyyyy(td1.sod)} 
            readOnly
          />
          <input 
            type="text"
            className="form-control"
            id="td1sodString"
            name="td1sodString"
            value={td1.sod.toString()} 
            readOnly
          />
        </div>
        <div className="col-sm-4">
          <label htmlFor="td1eod" className="form-label">
            TD1 EndOfDay
          </label>
          <input
            type="date"
            className="form-control"
            id="td1eod"
            name="td1eod"
            value={dateTo_UTC_yyyyMMdd(td1.eod)}   
            onChange={handleInputChange}
          />
          <input 
            type="text"
            className="form-control"
            id="td1eodUTC"
            name="td1eodUTC"
            value={dateTo_UTC_MMddyyyy(td1.eod)}
            readOnly
          />
          <input 
            type="text"
            className="form-control"
            id="td1eodLocal"
            name="td1eodLocal"
            value={td1.eod.toString()}
            readOnly
          />
        </div>
        <div className="col-sm-4">
          <label htmlFor="td1gmt" className="form-label">
            TD1 GMT
          </label>
          <input
            type="date"
            className="form-control"
            id="td1gmt"
            name="td1gmt"
            value={dateTo_UTC_yyyyMMdd(td1.gmt)}
            onChange={handleInputChange}
          />
          <input 
            type="text"
            className="form-control"
            id="td1gmtUTC"
            name="td1gmtUTC"
            value={dateTo_UTC_MMddyyyy(td1.gmt)}
            readOnly
          />
          <input 
            type="text"
            className="form-control"
            id="td1gmtLocal"
            name="td1gmtLocal"
            value={td1.gmt.toString()}
            readOnly
          />
        </div>
      </div>      
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <textarea
            id="testDateResults"
            name="testDateResults"
            rows={10}
            value={results}
            readOnly={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};
