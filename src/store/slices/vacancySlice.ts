import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { VACANCIES } from '../../data/vacancies';

interface VacancyState {
  activeId: string;
}

const initialState: VacancyState = { activeId: VACANCIES[0].id };

const vacancySlice = createSlice({
  name: 'vacancy',
  initialState,
  reducers: {
    setActiveVacancy(state, action: PayloadAction<string>) {
      state.activeId = action.payload;
    },
  },
});

export const { setActiveVacancy } = vacancySlice.actions;
export default vacancySlice.reducer;
