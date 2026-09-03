import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface VacancyState {
  activeId: string;
}

// Список грузится асинхронно (см. useVacancyList) — первая вакансия становится
// активной, когда он приходит, а не здесь.
const initialState: VacancyState = { activeId: '' };

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
