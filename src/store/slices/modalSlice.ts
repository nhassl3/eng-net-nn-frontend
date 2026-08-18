import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  quoteOpen: boolean;
  serviceIx: string | null;
  presetDirection: string | null;
}

const initialState: ModalState = { quoteOpen: false, serviceIx: null, presetDirection: null };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openQuote(state, action: PayloadAction<string | undefined>) {
      state.quoteOpen = true;
      if (action.payload) state.presetDirection = action.payload;
    },
    closeQuote(state) { state.quoteOpen = false; state.presetDirection = null; },
    openServiceModal(state, action: PayloadAction<string>) { state.serviceIx = action.payload; },
    closeServiceModal(state) { state.serviceIx = null; },
  },
});

export const { openQuote, closeQuote, openServiceModal, closeServiceModal } = modalSlice.actions;
export default modalSlice.reducer;
