import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Bowl } from "@prisma/client";
import { loadStatusType } from "@/redux/statusTypes";
import { RootState } from "@/redux/store";
import { getBowls } from "@/db/bowls/bowls";

export interface bowlSliceState {
  bowls: Bowl[];
  status: loadStatusType;
  error: string | undefined;
}

// initial state constant
const initialState: bowlSliceState = {
  bowls: [],
  status: "idle",
  error: "",
};

export const fetchBowls = createAsyncThunk("bowls/fetchBowls", async () => {

  // Do not use try / catch blocks here. Need the promise to be fulfilled or
  // rejected which will have the appropriate response in the extraReducers.

  return getBowls();

  // const url = baseApi + "/bowls";
  // const response = await axios.get(url);
  // return response.data.bowls; // response.data.bowls is already JSON'ed

  // Do not use try / catch blocks here. Need the promise to be fulfilled or
  // rejected which will have the appropriate response in the extraReducers.
  // try {
  //   const response = await axios.get(url);
  //   if (response.status === 200 && response.data) {
  //     return response.data.bowls; // response.data.bowls is already JSON'ed
  //   } else {
  //     console.log('Bowls - Non error return, but not status 200');
  //     return [];
  //   }
  // } catch (error) {
  //   return [];
  // }
});

export const bowlsSlice = createSlice({
  name: "bowls",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBowls.pending, (state: bowlSliceState) => {
      state.status = "loading";
      state.error = "";
    });
    builder.addCase(fetchBowls.fulfilled, (state: bowlSliceState, action) => {
      state.status = "succeeded";
      state.bowls = action.payload.data;
      state.error = "";
    });
    builder.addCase(fetchBowls.rejected, (state: bowlSliceState, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export const selectAllBowls = (state: RootState) => state.bowls.bowls;
export const getBowlsStatus = (state: RootState) => state.bowls.status;
export const getBowlsError = (state: RootState) => state.bowls.error;

export default bowlsSlice.reducer;
