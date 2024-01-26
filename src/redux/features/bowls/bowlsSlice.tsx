import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { baseApi } from '@/lib/tools';
import { Bowl } from '@prisma/client';
import { fetchTmntYears } from '../tmnts/yearsSlice';

export interface BowlSliceState {
  bowls: Bowl[];
  loading: boolean;
  error: string | undefined;
}

// initial state constant
const initialState: BowlSliceState = {
  bowls: [],  
  loading: false,
  error: ''
} 

export const fetchBowls = createAsyncThunk('bowls/fetchBowls', async () => {

  const url = baseApi + '/bowls'
  try {
    const response = await axios.get(url);
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

export const bowlsSlice = createSlice({
  name: 'bowls',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBowls.pending, (state: BowlSliceState) => {
      state.loading = true;
      state.error = '';
    })
    builder.addCase(fetchBowls.fulfilled, (state: BowlSliceState, action) => {
      state.loading = false;
      state.bowls = action.payload;
      state.error = '';
    })
    builder.addCase(fetchBowls.rejected, (state: BowlSliceState, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
  }
})

export default bowlsSlice.reducer;