import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./userSlice";
import sortingreducer from "./sortingSlice"

export const store = configureStore({
  reducer: {
    user: useReducer,
    sorting: sortingreducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
