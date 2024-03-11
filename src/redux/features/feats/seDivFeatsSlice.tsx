import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Se_Div_Feat } from '@prisma/client'
import { divFeatType, seDivFeatType } from '@/app/dataEntry/tmnt/types';
import { loadStatusType } from "@/redux/statusTypes";
import { RootState } from "@/redux/store";

export interface SeDivFeatSlice {
  seDivFeats: seDivFeatType[];
  status: loadStatusType;
  error: string | undefined;  
}

const compareDivFeats = (sdf1: seDivFeatType, sdf2: seDivFeatType): number => {
  return sdf1.sort_order - sdf2.sort_order;
}

const initialState: SeDivFeatSlice = {
  seDivFeats: [],
  status: 'idle',
  error: ''
}

export const seDivFeatsSlice = createSlice({
  name: 'seDivFeats',
  initialState,
  reducers: {
    // addSeDivFeat: {
    //   // do the reducer step
    //   reducer: (state, action: PayloadAction<seDivFeatType>) => {
    //     // ok to mutate state.divFeats here because of redux toolkit + immer
    //     state.seDivFeats.push(action.payload)
    //     state.seDivFeats.sort(compareDivFeats)
    //   },
    //   // prepare the data BEFORE the reducer executes. order here does
    //   // not matter, prepare statement execures BEFROE reducer
    //   // https://redux-toolkit.js.org/api/createAction#using-prepare-callbacks-to-customize-action-contents
    //   prepare: (divFeat: divFeatType) => {
    //     return {
    //       payload: {
    //         // id: 'dvf_' + uuidv4().replace('-', ''),
    //         id: '',
    //         div_feat_id: divFeat.id,
    //         feat_id: divFeat.feat_id,
    //         feat_name: divFeat.feat_name,
    //         sort_order: divFeat.sort_order,
    //         fee: '',
    //         fee_err: '',
    //       }
    //     }
    //   }
    // },
    // delSeDivFeat: (state, action) => {
    //   const { sort_order } = action.payload;
    //   // ok to mutate state.divFeats here because of redux toolkit + immer
    //   state.seDivFeats = state.seDivFeats.filter(seDivFeat => seDivFeat.sort_order !== sort_order);
    // },    
    // resetDivFeats: (state) => {
    //   state = {
    //     ...initialState
    //   }
    // },
    // updateSeDivFeat: (state, action) => {      
    //   state.seDivFeats = state.seDivFeats.map((seDivFeat) => {
    //     if (seDivFeat.feat_name === action.payload.feat_name) {
    //       let updated: seDivFeatType;
    //       if (action.payload.property === 'fee') {
    //         updated = {
    //           ...seDivFeat,
    //           fee: action.payload.rawValue,
    //           fee_err: ''
    //         }
    //       } else {
    //         updated = {
    //           ...seDivFeat,              
    //           fee_err: action.payload.feeErr
    //         }
    //       }
    //       return updated;
    //     } else {
    //       return seDivFeat;
    //     }
    //   })
    // }, 
  }
});

export const selectAllSeDivFeats = (state: RootState) => state.seDivFeats.seDivFeats;
export const selectDivSeFeatsStatus = (state: RootState) => state.seDivFeats.status;
export const selectDivSeFeatsError = (state: RootState) => state.seDivFeats.error;

// export const { addSeDivFeat, delSeDivFeat, resetDivFeats, updateSeDivFeat } = seDivFeatsSlice.actions;
export default seDivFeatsSlice.reducer;