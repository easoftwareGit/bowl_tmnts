import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Tmnt } from "@prisma/client";
import { loadStatusType } from "@/redux/statusTypes";
import { RootState } from "@/redux/store";
import { getUserTmnts } from "@/lib/db/tmnts/tmntsAxios";
import { tmntsListType } from "@/lib/types/types";

export interface userTmntSliceState {
  userTmnts: tmntsListType[];
  status: loadStatusType;  
  error: string | undefined;
}

// initial state constant 
const initialState: userTmntSliceState = {
  userTmnts: [],
  status: "idle",  
  error: "",
};

/**
 * gets tmnts with results for a year or all upcoming tmnts
 *
 * @param {string} userId - is of user to get tmnts
 * @return {tmntsListType[]} - array of tmnts from database
 */
export const fetchUserTmnts = createAsyncThunk(
  "userTmnts/fetchUserTmnts",
  async (userId: string) => {

    // Do not use try / catch blocks here. Need the promise to be fulfilled or
    // rejected which will have the appropriate response in the extraReducers.

    return getUserTmnts(userId);    
  }
)

export const userTmntsSlice = createSlice({
  name: "userTmnts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserTmnts.pending, (state: userTmntSliceState) => {
      state.status = "loading";
      state.error = "";
    });
    builder.addCase(fetchUserTmnts.fulfilled, (state: userTmntSliceState, action) => {
      state.status = "succeeded";
      state.userTmnts = action.payload;
      state.error = "";
    });      
    builder.addCase(fetchUserTmnts.rejected, (state: userTmntSliceState, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
  },
});

export const selectUserTmnts = (state: RootState) => state.userTmnts.userTmnts;
export const getUserTmntStatus = (state: RootState) => state.userTmnts.status;
export const getUserTmntError = (state: RootState) => state.userTmnts.error;

export default userTmntsSlice.reducer;