import { createApi } from "@reduxjs/toolkit/query/react";
import type { enquiryInter, loginInter, UserDetail } from "./types/user.types";
import { dynamicBaseQuery } from "./badRequestHandler";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Enquiries', 'User'],
  endpoints: (builder) => ({
    getUserDetail: builder.query<UserDetail, void>({
      query: () => `/user/profile`,
      providesTags: ['User'], // ✅ Mark query as providing 'User' tag
    }),

    useGymEnquiry: builder.mutation<enquiryInter, any>({
      query: (body) => ({
        url: '/user/enquiry',
        method: "POST",
        body,
      }),
    }),

    userLogin: builder.mutation<loginInter, any>({
      query: (body) => ({
        url: `/auth/login`,
        method: "POST",
        body,
      }),
    }),
    authRegister: builder.mutation<loginInter, any>({
      query: (body) => {
        return {
          url: `/auth/register`,
          method: "POST",
          body,
        };
      },
    }),
    authVerifyOtp: builder.mutation<loginInter, any>({
      query: (body) => {
        return {
          url: `/auth/verify-otp`,
          method: "POST",
          body,
        };
      },
    }),

    userGetEnquiry: builder.query<enquiryInter, void>({
      query: () => ({
        url: `/user/get-enquiry`,
        method: "POST",
      }),
      providesTags: ['Enquiries'], // ✅ Important: mark this query as providing 'Enquiries'
    }),

    userCancelEnquiry: builder.mutation<loginInter, string>({
      query: (id) => ({
        url: `/user/enquiry-cancelled/${id}`,
        method: "POST",
      }),
      invalidatesTags: ['Enquiries'], // ✅ Important: invalidate enquiries list after cancel
    }),
    updateProfile: builder.mutation<any, string>({
      query: ({ body, userId }) => (
        {
          url: `/user/update-profile/${userId}`,
          method: "PUT",
          body
        }),
      invalidatesTags: ['User'], // ✅ Refetch getUserDetail after update
    }),
    gymJoin: builder.mutation<any, any>({
      query: (id) => (
        {
          url: `/user/gym-apply/${id}`,
          method: "POST",
        }),
      invalidatesTags: ['User'], // ✅ Refetch getUserDetail after update
    }),
    gymHistory: builder.query<any, void>({
      query: () => (
        {
          url: `/user/get-gym-history`,
          method: "GET",
        }),
    }),
    gymUserAttendence: builder.query<any, any>({
      query: (id) => (
        {
          url: `/user/get-attendence/${id}`,
          method: "GET",
        }),
    }),
    gymUserProgress: builder.query<any, any>({
      query: (id) => (
        {
          url: `/user/get-progress/${id}`,
          method: "GET",
        }),
    }),
    gymUserMarkAttendance: builder.mutation<any, any>({
      query: (body) => (
        {
          url: `/user/mark-attendance`,
          method: "POST",
          body
        }),
    }),
    gymUserGetAttendence: builder.mutation<any, any>({
      query: (id) => (
        {
          url: `/get-attendence/${id}`,
          method: "POST",
        }),
    }),
    gymUserGetReview: builder.query<any, any>({
      query: (gymId) => ({
        url: `/gym/get-review/${gymId}`,
        method: "GET",
      }),
    }),


    gymUserAddReview: builder.mutation<any, any>({
      query: (payload) => (
        {
          url: `/user/add-review`,
          method: "POST",
          body: payload
        }),
    }),
    getPlanHistory: builder.query<any, string>({
      query: (gymId) => ({
        url: `/user/get-plan-history?gymId=${gymId}`,
        method: "GET",
      }),
    }),
    otpResend: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/resend-otp`,
        method: "POST",
        body
      }),
    }),
    forgotPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body
      }),
    }),
    otpVerify: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/forgot-password-verify-otp`,
        method: "POST",
        body
      }),
    }),
    resetPawword: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body
      }),
    }),
    demoLogin: builder.mutation<any, void>({
      query: (body) => ({
        url: `/auth/demo-login`,
        method: "POST",
        body
      }),
    }),

  }),
});

export const {
  useGetPlanHistoryQuery,
  useGymUserProgressQuery,
  useGetUserDetailQuery,
  useUpdateProfileMutation, // ✅ for mutation hook
  useUserGetEnquiryQuery,        // Changed from Mutation to Query
  useUserCancelEnquiryMutation,
  useUseGymEnquiryMutation,
  useUserLoginMutation,
  useAuthRegisterMutation,
  useGymJoinMutation,
  useAuthVerifyOtpMutation,
  useGymHistoryQuery,
  useGymUserAttendenceQuery,
  useGymUserMarkAttendanceMutation,
  useGymUserGetAttendenceMutation,
  useGymUserAddReviewMutation,
  useGymUserGetReviewQuery,
  useOtpResendMutation,
  useForgotPasswordMutation,
  useOtpVerifyMutation,
  useResetPawwordMutation,
  useDemoLoginMutation
} = userApi;
