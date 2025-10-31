// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../services/userService";
import { gymList } from "./gym.services";
import { trainerService } from "./trainer";
import authReducer from "./authSlice";
export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [gymList.reducerPath]: gymList.reducer,
    [trainerService.reducerPath]: trainerService.reducer,
        auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().
  concat(userApi.middleware).
  concat(gymList.middleware).
  concat(trainerService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
