import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Div_Feat } from '@prisma/client';
import { divFeatType } from '@/lib/types/types';
import { loadStatusType } from "@/redux/statusTypes";
import { RootState } from "@/redux/store";

export interface DivFeatSliceState {
  divFeats: divFeatType[];
  status: loadStatusType;
  error: string | undefined;  
}

const compareDivFeats = (df1: divFeatType, df2: divFeatType): number => {
  return df1.sort_order - df2.sort_order;
}

const initialState: DivFeatSliceState = {
  divFeats: [],
  status: 'idle',
  error: ''
}

export const divFeatsSlice = createSlice({
  name: 'divFeats',
  initialState,
  reducers: {
    // addDivFeat: {
    //   // do the reducer step
    //   reducer: (state, action: PayloadAction<divFeatType>) => {
    //     // ok to mutate state.divFeats here because of redux toolkit + immer
    //     state.divFeats.push(action.payload)
    //     state.divFeats.sort(compareDivFeats)
    //   },
    //   // prepare the data BEFORE the reducer executes. order here does
    //   // not matter, prepare statement execures BEFROE reducer
    //   // https://redux-toolkit.js.org/api/createAction#using-prepare-callbacks-to-customize-action-contents
    //   prepare: (feat_name: string, sort_order: number, entry_type: string) => {
    //     return {
    //       payload: {
    //         // id: 'dvf_' + uuidv4().replace('-', ''),
    //         id: '',
    //         div_id: '',
    //         feat_id: '',
    //         feat_name,                
    //         sort_order,
    //         entry_type,
    //         errClassName: '',
    //       }
    //     }
    //   }
    // },
    // delDivFeat: (state, action) => {
    //   const { sort_order } = action.payload;  
    //   const temp = state.divFeats.filter(divFeat => divFeat.sort_order !== sort_order);
    //   // ok to mutate state.divFeats here because of redux toolkit + immer
    //   state.divFeats = state.divFeats.filter(divFeat => divFeat.sort_order !== sort_order);
    // },
    // setDivFeatErrClassName: (state, action) => {
    //   const { featName, errClassName } = action.payload;
    //   state.divFeats = state.divFeats.map(divFeat => {
    //     if (divFeat.feat_name === featName) {
    //       return ({
    //         ...divFeat,
    //         errClassName,
    //       })
    //     } else {
    //       return divFeat;
    //     }
    //   })
    // }
  },
})

export const selectAllDivFeats = (state: RootState) => state.divFeats.divFeats;
export const selectDivFeatsStatus = (state: RootState) => state.divFeats.status;
export const selectDivFeatsError = (state: RootState) => state.divFeats.error;

// export const { addDivFeat, delDivFeat, setDivFeatErrClassName } = divFeatsSlice.actions;
export default divFeatsSlice.reducer;