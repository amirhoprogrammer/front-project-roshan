// src/redux/timedTextSlice.js
import { createSlice } from "@reduxjs/toolkit";

const timedTextSlice = createSlice({
  name: "timedText",
  initialState: {
    isTimedText: false,
  },
  reducers: {
    setTimedText: (state, action) => {
      state.isTimedText = action.payload;
    },
  },
});

export const { setTimedText } = timedTextSlice.actions;
export default timedTextSlice.reducer;
