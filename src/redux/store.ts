import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux';
// import reducers
import tmntsReducer from './features/tmnts/tmntsSlice';
import tmntResultsReducer from './features/tmnts/resultsSlice'
import tmntUpcomingSlice from './features/tmnts/upcomingSlice';

// create the store, include reduces in object
export const store = configureStore({
  reducer: {
    tmnts: tmntsReducer,
    tmntResults: tmntResultsReducer,
    tmntUpcomping: tmntUpcomingSlice
  }
});

// export types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// export useAppSelector, so can use it instead of useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector