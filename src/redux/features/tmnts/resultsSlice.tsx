import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { FullTmnt } from '@/app/types/tmntType';
import { baseApi } from '@/lib/tools';

export interface TmntResultsSliceState {
  data: FullTmnt[];  
  loading: boolean;
  error: string | undefined;
}

// initial state constant
const initialState: TmntResultsSliceState = {
  data: [],  
  loading: false,
  error: ''
} 

export const fetchTmntResults = createAsyncThunk('tmnts/fetchTmntsResults', async () => {  
  const url = baseApi + '/tmnts/results'  
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

export const tmntResultsSlice = createSlice({
  name: 'tmntResults',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTmntResults.pending, (state: TmntResultsSliceState) => {      
      state.loading = true;
      state.error = '';
    })
    builder.addCase(fetchTmntResults.fulfilled, (state: TmntResultsSliceState, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = '';
    })
    builder.addCase(fetchTmntResults.rejected, (state: TmntResultsSliceState, action) => {
      state.loading = false;
      state.error = action.error.message
    })
  }
});

export default tmntResultsSlice.reducer;
