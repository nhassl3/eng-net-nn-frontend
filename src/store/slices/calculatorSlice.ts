import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type NetworkType = 'water' | 'heat' | 'power' | 'gas' | 'vent';

interface CalculatorState {
  networkType: NetworkType;
  length: number;
}

const initialState: CalculatorState = {
  networkType: 'water',
  length: 500,
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setNetworkType(state, action: PayloadAction<NetworkType>) {
      state.networkType = action.payload;
    },
    setLength(state, action: PayloadAction<number>) {
      state.length = action.payload;
    },
  },
});

export const { setNetworkType, setLength } = calculatorSlice.actions;
export default calculatorSlice.reducer;
