import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modalSlice';
import casesReducer from './slices/casesSlice';
import calculatorReducer from './slices/calculatorSlice';
import vacancyReducer from './slices/vacancySlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    cases: casesReducer,
    calculator: calculatorReducer,
    vacancy: vacancyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
