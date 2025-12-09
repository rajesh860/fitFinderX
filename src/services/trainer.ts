

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
    addAvailability: builder.mutation<trainer, string | any>({
      query: ({body,trainerId}) => ({
        url: `/trainer/update-profile/${trainerId}`,
        method: "POST",
        body:body
      })
    }),
    trainerProfile: builder.query<trainer, string | void>({
      query: () => ({
        url: `/trainer/profile`,
        method: "GET",
      })
    }),
  
    trainerDetail: builder.query<trainer, string | void>({
      query: (trainerId) => ({
        url: `/trainer/detail/${trainerId}`,
        method: "GET",
      })
    }),
    addTrainer: builder.mutation<trainer, string | any>({
      query: ({body,trainerId}) => ({
        url: `/trainer/add-review/${trainerId}`,
        method: "POST",
        body:body
      })
    }),
    getTrainerReview: builder.query<trainer, string | any>({
      query: (trainerId) => ({
        url: `/trainer/get-review/${trainerId}`,
        method: "GET",
      })
    }),
    trainerBooking: builder.mutation<trainer, string | any>({
      query: (body) => ({
        url: `/trainer/hire/`,
        method: "POST",
        body
      })
    }),
    availableSlots: builder.query<trainer, string | any>({
      query: (trainerId) => ({
        url: `/trainer/available-slots/${trainerId}`,
        method: "GET",
      })
    }),
   
  
  }),
});

export const {useAvailableSlotsQuery,useTrainerBookingMutation,useGetTrainerReviewQuery,useAddTrainerMutation,useTrainerDetailQuery, useAllTrainerListQuery,useAddAvailabilityMutation,useTrainerProfileQuery } = trainerService;
