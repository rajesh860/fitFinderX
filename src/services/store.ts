// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../services/userService";
import { gymList } from "./gym.services";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [gymList.reducerPath]: gymList.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().
  concat(userApi.middleware).
  concat(gymList.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
