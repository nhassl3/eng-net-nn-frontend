import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  quoteOpen: boolean;
}

const initialState: ModalState = { quoteOpen: false };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openQuote(state) { state.quoteOpen = true; },
    closeQuote(state) { state.quoteOpen = false; },
  },
});

export const { openQuote, closeQuote } = modalSlice.actions;
export default modalSlice.reducer;
