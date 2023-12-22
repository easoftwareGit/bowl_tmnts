import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
// import { Tmnt } from '@prisma/client';
// import { FullTmnt } from '@/app/types/tmntType';
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

export const fetchTmnts = createAsyncThunk('tmnts/fetchTmnts', async () => {
  // const url = 'http://localhost:3000/api/tmnts'
  const url = baseApi + '/tmnts'
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
      // state.status = 'loading'
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
