import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//Types
import { IReport, IReportPost } from "../types/report";

//const serverApi = process.env.REACT_APP_SERVER_API;
const serverApi = "https://exove.vercel.app/api/";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: serverApi,
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    getAllReports: builder.query<IReport[], void>({
      query: () => "report",
      providesTags: ["Reports"],
    }),
    getReportByDocId: builder.query<IReport, string>({
      query: (docId) => `report/${docId}`,
    }),
    getReportSummaryById: builder.query<IReport, string>({
      query: (id) => `report/${id}`, 
    }),
    getReportSummaryByName: builder.query<IReport[], string>({
      query: (userId) => `summary/${userId}`,
    }),
    postReport: builder.mutation<void, { body: IReportPost }>({
      query: ({ body }) => ({
        url: `report`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `report/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetAllReportsQuery,
  useGetReportByDocIdQuery,
  useGetReportSummaryByIdQuery,
  useGetReportSummaryByNameQuery,
  usePostReportMutation,
  useDeleteReportMutation,
} = reportApi;

export default reportApi.reducer;
