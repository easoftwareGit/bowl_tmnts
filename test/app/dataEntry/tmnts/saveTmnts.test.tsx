import axios, { AxiosError } from "axios";
import { baseTmntsApi } from "@/lib/db/apiPaths";
import { testBaseTmntsApi } from "../../../testApi";
import { tmntSaveTmnt, exportedForTesting } from "@/app/dataEntry/tmnt/saveTmnt";
import { mockTmnt } from "../../../mocks/tmnts/twoDivs/mockTmnt"; 
import { initEvents, initDivs, initTmnt } from "@/lib/db/initVals";
import {  tmntType } from "@/lib/types/types";
import { startOfDayFromString } from "@/lib/dateTools";

const { tmntPutTmnt } = exportedForTesting;

// import { isValidBtDbId } from "../../../../src/lib/validation";
// import { putTmnt } from "../../../../src/lib/db/tmnts/tmntsAxios";

// before running this test, run the following commands in the terminal:
// 1) clear and re-seed the database
//    a) clear the database
//       npx prisma db push --force-reset
//    b) re-seed
//       npx prisma db seed
//    if just need to re-seed, then only need step 1b
// 2) make sure the server is running
//    in the VS activity bar,
//      a) click on "Run and Debug" (Ctrl+Shift+D)
//      b) at the top of the window, click on the drop-down arrow
//      c) select "Node.js: debug server-side"
//      d) directly to the left of the drop down select, click the green play button
//         This will start the server in debug mode.

describe('saveTmnt', () => {

  describe('save tournaments', () => { 

    const url = testBaseTmntsApi.startsWith("undefined")
      ? baseTmntsApi
      : testBaseTmntsApi;
  
    describe('tmntSaveTmnt', () => { 
      let createdTmnt = false;

      const delTestTmnt = async () => {
        try {
          const response = await axios.get(url);
          const tmnts = response.data.tmnts;
          const toDel = tmnts.find(
            (t: tmntType) => t.tmnt_name === "Test Tournament"
          );
          if (toDel) {
            try {
              const delResponse = await axios({
                method: "delete",
                withCredentials: true,
                url: url + "/" + toDel.id,
              });              
            } catch (err) {
              if (err instanceof AxiosError) console.log(err.message);
            }
          }      
        } catch (error) {
          if (error instanceof AxiosError) console.log(error.message);
        }
      }

      beforeAll(async () => {
        await delTestTmnt();
      });

      beforeEach(() => {
        createdTmnt = false;
      });

      afterEach(async () => {
        if (createdTmnt) {
          await delTestTmnt();
        }
      });

      it('should call mockSetTmnt, mockSetEvents, and mockSetDivs when tmnt.id is blank', async () => {
        const mockSetTmnt = jest.fn();
        const mockSetEvents = jest.fn();
        const mockSetDivs = jest.fn();
    
        const newTmnt = {
          ...mockTmnt,
          id: '1',
          tmnt_name: 'Test Tournament',
        };
        const newMockEvents = [...initEvents];
        const newMockDivs = [...initDivs];
        const mockToSave = {
          tmnt: newTmnt,
          setTmnt: mockSetTmnt,
          events: newMockEvents,
          setEvents: mockSetEvents,
          divs: newMockDivs,
          setDivs: mockSetDivs,
        };

        const result = await tmntSaveTmnt(mockToSave);

        expect(result).toBe(true); 
        createdTmnt = true;

        const response = await axios.get(url);                    
        const tmnts = response.data.tmnts;
        const savedTmnt = tmnts.find((t: tmntType) => t.tmnt_name === "Test Tournament");
        
        expect(mockSetTmnt).toHaveBeenCalledTimes(1);
        expect(mockSetTmnt).toHaveBeenCalledWith(savedTmnt);
        expect(mockSetEvents).toHaveBeenCalledWith(newMockEvents);
        expect(mockSetDivs).toHaveBeenCalledWith(newMockDivs);           
      });


      it('should return false when tmnt data is invalid', async () => { 
        const mockSetTmnt = jest.fn();
        const mockSetEvents = jest.fn();
        const mockSetDivs = jest.fn();

        const newTmnt = {
          ...mockTmnt,
          id: '1',
          tmnt_name: '',
        };
        const mockToSave = {
          tmnt: newTmnt,
          setTmnt: mockSetTmnt,
          events: initEvents,
          setEvents: mockSetEvents,
          divs: initDivs,
          setDivs: mockSetDivs,
        };
        const result = await tmntSaveTmnt(mockToSave);
        expect(result).toBe(false);
      })

      it('should call tmntPutTmnt and return true when tmnt ID is valid', async () => {
        const mockSetTmnt = jest.fn();
        const mockSetEvents = jest.fn();
        const mockSetDivs = jest.fn();
    
        const mockToSave = {
          tmnt: mockTmnt,
          setTmnt: mockSetTmnt,
          events: initEvents,
          setEvents: mockSetEvents,
          divs: initDivs,
          setDivs: mockSetDivs,
        };

        const result = await tmntSaveTmnt(mockToSave);

        expect(result).toBe(true);
        expect(mockSetTmnt).not.toHaveBeenCalledWith(mockTmnt);
        expect(mockSetEvents).not.toHaveBeenCalledWith(initEvents);
        expect(mockSetDivs).not.toHaveBeenCalledWith(initDivs);
      });

      it('should return false when tmnt id is valid, but other tmnt data is invalid', async () => {
        const mockSetTmnt = jest.fn();
        const mockSetEvents = jest.fn();
        const mockSetDivs = jest.fn();

        const tmntToPut = {
          ...mockTmnt,        
          tmnt_name: '',
        }
        const mockToSave = {
          tmnt: tmntToPut,
          setTmnt: mockSetTmnt,
          events: [],
          setEvents: mockSetEvents,
          divs: [],
          setDivs: mockSetDivs,
        };

        const result = await tmntSaveTmnt(mockToSave);
        expect(result).toBe(false);
      });
    })

    describe('tmntPutTmnt', () => { 
      let resetTmnt = {
        ...initTmnt,
        id: "tmt_fd99387c33d9c78aba290286576ddce5",
        user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        tmnt_name: "Gold Pin",
        bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
        start_date: startOfDayFromString('2022-10-23') as Date,
        end_date: startOfDayFromString('2022-10-23') as Date,
      }

      let puttedId = '';

      beforeEach(() => {
        puttedId = "";
      });

      afterEach(async () => {
        if (!puttedId) return;
        try {
          const resetJSON = JSON.stringify(resetTmnt);
          const response = await axios({
            method: "put",
            data: resetJSON,
            withCredentials: true,
            url: url + "/" + resetTmnt.id,
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      });

      it('should call tmntPutTmnt and return true when data is valid', async () => { 
        const toPutTmnt = {
          ...resetTmnt,                
          tmnt_name: 'Test Tournament',
          bowl_id: 'bwl_8b4a5c35ad1247049532ff53a12def0a',
          start_date: startOfDayFromString('2021-09-22') as Date,
          end_date: startOfDayFromString('2021-09-22') as Date,
        }
        const didPut = await tmntPutTmnt(toPutTmnt);
        expect(didPut).toBe(true);
        puttedId = toPutTmnt.id;
      })

      it('should return false when data is invalid', async () => { 
        const toPutTmnt = {
          ...resetTmnt,                
          tmnt_name: '',
        }
        const didPut = await tmntPutTmnt(toPutTmnt);
        expect(didPut).toBe(false);
      })
    })
  
  })
    
});
