import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ModalState {
  quoteOpen: boolean;
  serviceIx: string | null;
  presetDirection: string | null;
  certsIdx: number | null;
}

const initialState: ModalState = { quoteOpen: false, serviceIx: null, presetDirection: null, certsIdx: null };

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
    openCertsModal(state, action: PayloadAction<number>) { state.certsIdx = action.payload; },
    closeCertsModal(state) { state.certsIdx = null; },
  },
});

export const { openQuote, closeQuote, openServiceModal, closeServiceModal, openCertsModal, closeCertsModal } = modalSlice.actions;
export default modalSlice.reducer;
