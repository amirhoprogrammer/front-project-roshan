// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import timedTextReducer from "./timedTextSlice";

export const store = configureStore({
  reducer: {
    timedText: timedTextReducer,
  },
});
