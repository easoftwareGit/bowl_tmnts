import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Bowl } from "@prisma/client";
import { loadStatusType } from "@/redux/statusTypes";
import { RootState } from "@/redux/store";
import { getBowls } from "@/lib/db/bowls/bowlsAxios";

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
      // state.bowls = action.payload.bowls;
      state.bowls = action.payload;
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
