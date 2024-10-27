import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ioStatusType } from "@/redux/statusTypes";
import { RootState } from "@/redux/store";
import { allDataOneTmntType, ioDataErrorsType } from "@/lib/types/types";
import { blankTmnt, initDiv, initEvent, initLane, initSquad, initTmnt } from "@/lib/db/initVals";
import { btDbUuid } from "@/lib/uuid";
import { deleteAllDataForTmnt, getAllDataForTmnt } from "@/lib/db/tmnts/tmntsAxios";

export interface allDataOneTmntState {
  tmntData: allDataOneTmntType | null;
  status: ioStatusType;
  error: string | undefined;
}

// initial state constant
const initialState: allDataOneTmntState = {
  tmntData: {
    tmnt: {...blankTmnt},
    events: [],
    divs: [],
    squads: [],
    lanes: [],
    pots: [],
    brkts: [],
    elims: [],
  },
  status: 'idle',
  error: '',
};

/**
 * gets all data for one tmnt
 * 
 * @param {string} tmntId - id of tmnt to get data for
 * @returns {allDataOneTmntType | null} - all data for tmnt or null
 */
export const fetchAllDataForTmnt = createAsyncThunk(
  "allDataOneTmnt/fetchAllDataForTmnt",
  async (tmntId: string) => {

    // Do not use try / catch blocks here. Need the promise to be fulfilled or
    // rejected which will have the appropriate response in the extraReducers.

    return getAllDataForTmnt(tmntId);
  }
)

export const postAllDataForTmnt = createAsyncThunk(
  "allDataOneTmnt/postAllDataForTmnt",
  async (tmntData: allDataOneTmntType) => {
    return await getAllDataForTmnt(tmntData.tmnt.id);
  }
)

export const allDataOneTmntSlice = createSlice({
  name: "allDataOneTmnt",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllDataForTmnt.pending, (state: allDataOneTmntState) => {
      state.status = 'loading';
      state.error = '';
    });
    builder.addCase(fetchAllDataForTmnt.fulfilled, (state: allDataOneTmntState, action) => {
      state.status = 'succeeded';
      state.tmntData = action.payload;
      state.error = '';
    });
    builder.addCase(fetchAllDataForTmnt.rejected, (state: allDataOneTmntState, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    })
  }
});