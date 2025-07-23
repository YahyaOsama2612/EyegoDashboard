import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import sortingReducer from "./sortingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    sorting: sortingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
