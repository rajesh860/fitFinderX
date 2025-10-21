

// src/services/userService.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { trainer } from "./types/user.types";
import { dynamicBaseQuery } from "./badRequestHandler";

export const trainerService = createApi({
  reducerPath: "trainer",
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
 
    allTrainerList: builder.query<trainer, string | void>({
      query: (body) => ({
        url: `/trainer/list`,
        method: "GET",
        body
      })
    }),
  
  }),
});

export const { useAllTrainerListQuery } = trainerService;
