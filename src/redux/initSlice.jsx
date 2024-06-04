import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  landingData: null,
};

const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {
    setLandingData: (state, action) => {
      state.landingData = action.payload;
    },
  },
});

export const { setLandingData } = landingSlice.actions;

export default landingSlice.reducer;
