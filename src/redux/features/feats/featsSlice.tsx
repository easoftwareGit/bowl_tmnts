import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { baseApi } from '@/lib/tools';
import { Feat } from '@prisma/client';
import { featsWChecked } from "@/lib/types/featTypes";
import { loadStatusType } from "@/redux/statusTypes";
import { RootState } from "@/redux/store";

export interface FeatSliceState {
  // feats: Feat[];
  feats: featsWChecked[];
  status: loadStatusType;  
  error: string | undefined;
}

// initial state constant
const initialState: FeatSliceState = {
  feats: [],  
  status: "idle",
  error: ''
} 

export const fetchFeats = createAsyncThunk('feats/fetchFeats', async () => {

  const url = baseApi + '/feats'
  const response = await axios.get(url);
  return response.data.feats;  // response.data.feats is already JSON'ed
  // Do not use try / catch blocks here. Need the promise to be fulfilled or
  // rejected which will have the appropriate response in the extraReducers.
  // try {
  //   const response = await axios.get(url);
  //   if (response.status === 200 && response.data) {
  //     return response.data.feats; // response.data.feats is already JSON'ed
  //   } else {
  //     console.log('Features - Non error return, but not status 200');
  //     return [];
  //   }
  // } catch (error) {
  //   return [];
  // }
})

export const featsSlice = createSlice({
  name: 'feats',
  initialState,
  reducers: {
    featCheckedChanged(state, action) {
      const { featId, checked } = action.payload;
      const existingFeat = state.feats.find(feat => feat.id === featId)
      if (existingFeat) {
        existingFeat.checked = checked;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeats.pending, (state: FeatSliceState) => {
      state.status = "loading";
      state.error = '';
    })
    builder.addCase(fetchFeats.fulfilled, (state: FeatSliceState, action) => {      
      state.status = "succeeded";
      const loadedFeats = action.payload.map((loadedFeat: { checked: boolean; }) => {
        loadedFeat.checked = false;
        return loadedFeat;
      })
      state.feats = [...loadedFeats] as unknown as featsWChecked[];
      state.feats = action.payload;      
      state.error = '';
    })
    builder.addCase(fetchFeats.rejected, (state: FeatSliceState, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
  }
})

export const selectAllFeats = (state: RootState) => state.feats.feats;
export const getFeatsStatus = (state: RootState) => state.feats.status;
export const getFeatsError = (state: RootState) => state.feats.error;

export const { featCheckedChanged } = featsSlice.actions;

export default featsSlice.reducer;