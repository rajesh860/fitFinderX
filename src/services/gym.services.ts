// src/services/userService.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GymList } from "./types/user.types";
import { dynamicBaseQuery } from "./badRequestHandler";

export const gymList = createApi({
  reducerPath: "gymList",
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    // get all gyms OR search by name
    getAllGymList: builder.query<GymList, any>({
      query: ({ search, page, limit, premium, minPrice, lat, lng }) => {
        let apiUrl = "/gym/list?";
    
        if (search) {
          apiUrl += `name=${search}`;
        } else {
          apiUrl += `page=${page}&limit=${limit}`;
    
          if (minPrice !== undefined) apiUrl += `&minPrice=${minPrice}`;
          if (premium !== undefined) apiUrl += `&premium=${premium}`;
    
          if (lat !== undefined && lng !== undefined) apiUrl += `&lat=${lat}&lng=${lng}`;
        }
    
        return apiUrl;
      },
    }),
    gymRegister: builder.mutation<GymList, string | void>({
      query: (body) => ({
        url: `/gym/register`,
        method: "POST",
        body
      })
    }),
    gymDetail: builder.query<any, any>({
      query: (id) => ({
        url: `/gym/detail/${id}`,
        method: "GET",
      })
    }),
  }),
});

export const { useGetAllGymListQuery, useGymRegisterMutation, useGymDetailQuery } = gymList;
