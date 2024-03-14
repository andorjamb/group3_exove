import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//Types
import {
  IRequestPicks,
  IRequestPicksPost,
  IRequestPicksPatch,
  IRequestPicksApprove,
} from "../types/picks";

//const serverApi = process.env.REACT_APP_SERVER_API;
const serverApi = "https://exove.vercel.app/api/";

export const requestPicksApi = createApi({
  reducerPath: "requestPicksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: serverApi,
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }), //for testing
  tagTypes: ["RequestPicks", "UserRequestPicks", "DocIdRequestPicks"],
  endpoints: (builder) => ({
    getAllRequestPicks: builder.query<IRequestPicks[], void>({
      query: () => "picks",
      providesTags: ["RequestPicks"],
    }),
    getRequestPickByUserId: builder.query<IRequestPicks[], string>({
      /** fetches pick object where user=person selected to pick */
      query: (userId) => `picks/${userId}`,
      providesTags: ["UserRequestPicks"],
    }),
    getRequestPickByDocId: builder.query<IRequestPicks, string>({
      query: (id) => `picks/pick-id/${id}`,
      providesTags: ["RequestPicks"],
    }),
    getRequestPicksByUserFeedbacks: builder.query<IRequestPicks[], string>({
      query: (userId) => ({
        url: `picks/feeds_to/${userId}`,
        method: "GET",
      }),
    }),
    createPick: builder.mutation<string, IRequestPicksPost>({
      query: (body) => ({
        url: "picks/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RequestPicks"],
    }),
    submitPick: builder.mutation<void,{ body: IRequestPicksPatch; id: string }>({
      query: ({ body, id }) => ({
        url: `picks/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RequestPicks"],
    }),
    approvePick: builder.mutation<
      void,
      { body: IRequestPicksApprove; id: string }
    >({
      query: ({ body, id }) => ({
        url: `picks/approve-pick/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RequestPicks"],
    }),
    deletePick: builder.mutation<void, string>({
      query: (id) => ({
        url: `/picks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RequestPicks"],
    }),
    finalPickSubmit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/picks/submit/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RequestPicks"],
    }),
  }),
});

export const {
  useGetAllRequestPicksQuery,
  useGetRequestPickByUserIdQuery,
  useGetRequestPickByDocIdQuery,
  useGetRequestPicksByUserFeedbacksQuery,
  useCreatePickMutation,
  useSubmitPickMutation,
  useApprovePickMutation,
  useDeletePickMutation,
  useFinalPickSubmitMutation,
} = requestPicksApi;

export default requestPicksApi.reducer;
