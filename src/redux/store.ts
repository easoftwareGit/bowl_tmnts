import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import tmntsReducer from './features/tmnts/tmntsSlice';
import tmntYearsReducer from './features/tmnts/yearsSlice';
import bowlsReducer from './features/bowls/bowlsSlice';
import featsSlice from './features/feats/featsSlice';
import divFeatsSlice from './features/feats/divFeatsSlice';
import seDivFeatsSlice from './features/feats/seDivFeatsSlice';

// create the store, include reduces in object
export const store = configureStore({
  reducer: {
    tmnts: tmntsReducer,
    tmntYears: tmntYearsReducer,
    bowls: bowlsReducer,
    feats: featsSlice,
    divFeats: divFeatsSlice,
    seDivFeats: seDivFeatsSlice,
  }
});

// export types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// export useAppSelector, so can use it instead of useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector