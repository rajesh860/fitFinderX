// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../services/userService";
import { gymList } from "./gym.services";
import { trainerService } from "./trainer";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [gymList.reducerPath]: gymList.reducer,
    [trainerService.reducerPath]: trainerService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().
  concat(userApi.middleware).
  concat(gymList.middleware).
  concat(trainerService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
