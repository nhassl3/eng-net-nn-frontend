import { configureStore } from '@reduxjs/toolkit'
import casesReducer from './slices/casesSlice'
import modalReducer from './slices/modalSlice'
import vacancyReducer from './slices/vacancySlice'

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    cases: casesReducer,
    vacancy: vacancyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
