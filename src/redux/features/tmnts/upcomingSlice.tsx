import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import type { FullTmnt } from '@/app/types/tmntType';
import { baseApi } from '@/lib/tools';

export interface TmntUpcomingSliceState {
  data: FullTmnt[];
  loading: boolean;
  error: string | undefined;
}

// initial state constant
const initialState: TmntUpcomingSliceState = {
  data: [],  
  loading: false,
  error: ''
} 

export const fetchTmntUpcoming = createAsyncThunk('tmnts/fetchTmntsUpcoming', async () => {  
  const url = baseApi + '/tmnts/upcoming'  
  try {
    const response = await axios.get(url)
    if (response.status === 200 && response.data) {
      return response.data; // response.data is already JSON'ed
    } else {
      console.log('Tmnt Upcoming - Non error return, but not status 200');
      return [];
    }
  } catch (error) {
    return [];
  }
})

export const tmntUpcomingSlice = createSlice({
  name: 'tmntUpcoming',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTmntUpcoming.pending, (state: TmntUpcomingSliceState) => {      
      state.loading = true;
      state.error = '';
    })
    builder.addCase(fetchTmntUpcoming.fulfilled, (state: TmntUpcomingSliceState, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = '';
    })
    builder.addCase(fetchTmntUpcoming.rejected, (state: TmntUpcomingSliceState, action) => {
      state.loading = false;
      state.error = action.error.message
    })
  }
});

export default tmntUpcomingSlice.reducer;
