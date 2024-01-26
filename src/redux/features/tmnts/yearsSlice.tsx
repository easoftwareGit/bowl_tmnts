import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { baseApi } from '@/lib/tools';

export interface TmntYearsSliceState {
  data: number[];  
  loading: boolean;
  error: string | undefined;
}

// initial state constant
const initialState: TmntYearsSliceState = {
  data: [],  
  loading: false,
  error: ''
} 

// get list of years from today and before
export const fetchTmntYears = createAsyncThunk('tmnts/fetchTmntsYears', async () => {  
  const year = new Date().getFullYear().toString()
  // error checking for year is done in the API
  const url = baseApi + '/tmnts/years/' + year
  try {
    const response = await axios.get(url)
    if (response.status === 200 && response.data) {
      return response.data; // response.data is already JSON'ed
    } else {
      console.log('Tmnt Results - Non error return, but not status 200');
      return [];
    }
  } catch (error) {
    return [];
  }
})

export const tmntYearsSlice = createSlice({
  name: 'tmntYears',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTmntYears.pending, (state: TmntYearsSliceState) => {      
      state.loading = true;
      state.error = '';
    })
    builder.addCase(fetchTmntYears.fulfilled, (state: TmntYearsSliceState, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = '';
    })
    builder.addCase(fetchTmntYears.rejected, (state: TmntYearsSliceState, action) => {
      state.loading = false;
      state.error = action.error.message
    })
  }
});

export default tmntYearsSlice.reducer;