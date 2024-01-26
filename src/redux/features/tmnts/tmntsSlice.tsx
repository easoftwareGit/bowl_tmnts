import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { baseApi } from '@/lib/tools';
import { Tmnt } from '@prisma/client';

export interface TmntSliceState {
  tmnts: Tmnt[];  
  loading: boolean;
  error: string | undefined;
}

// initial state constant
const initialState: TmntSliceState = {
  tmnts: [],  
  loading: false,
  error: ''
} 

/**
 * gets tmnts with results for a year or all upcoming tmnts
 *
 * @param {year: string} - 'XXXX' get tmnts for year 'XXXX'; '' get tmnts upcoming
 * @return {*}  {Tmnt[]} array of tmnts from database
 */

export const fetchTmnts = createAsyncThunk('tmnts/fetchTmnts', async (year: string) => {
  // ok to pass year as param, API route checks for valid year
  // only 4 digits, between 1900 and 2100
  // const url = 'http://localhost:3000/api/tmnts/results/year'
  // OR
  // const url = 'http://localhost:3000/api/tmnts/upcoming'
  const baseUrl = baseApi + '/tmnts/'
  let url: string
  if (year === '') {
    url = baseUrl + 'upcoming'
  } else {
    url = baseUrl + 'results/' + year;
  }
  
  try {
    const response = await axios.get(url)
    if (response.status === 200 && response.data) {
      return response.data; // response.data is already JSON'ed
    } else {
      console.log('Tmnts - Non error return, but not status 200');
      return [];
    }
  } catch (error) {
    return [];
  }
})

export const tmntsSlice = createSlice({
  name: 'tmnts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTmnts.pending, (state: TmntSliceState) => {      
      state.loading = true;
      state.error = '';
    })
    builder.addCase(fetchTmnts.fulfilled, (state: TmntSliceState, action) => {
      state.loading = false;
      state.tmnts = action.payload;
      state.error = '';
    })
    builder.addCase(fetchTmnts.rejected, (state: TmntSliceState, action) => {
      state.loading = false;
      state.error = action.error.message
    })
  }
});

export default tmntsSlice.reducer;
