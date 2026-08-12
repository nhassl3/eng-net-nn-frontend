import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CASES } from '../../data/cases';

interface CasesState {
  activeIndex: number;
}

const initialState: CasesState = { activeIndex: 0 };

const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    setIndex(state, action: PayloadAction<number>) {
      state.activeIndex = action.payload;
    },
    next(state) {
      state.activeIndex = (state.activeIndex + 1) % CASES.length;
    },
    prev(state) {
      state.activeIndex = (state.activeIndex - 1 + CASES.length) % CASES.length;
    },
  },
});

export const { setIndex, next, prev } = casesSlice.actions;
export default casesSlice.reducer;
