import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//Types
import { IQuestion, IQuestionPost } from "../types/questions";

//const serverApi = process.env.REACT_APP_SERVER_API;
const serverApi = "https://exove.vercel.app/api/";

export const questionApi = createApi({
  reducerPath: "questionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: serverApi,
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Questions"],
  endpoints: (builder) => ({
    getAllQuestions: builder.query<IQuestion[], void>({
      query: () => "question",
      providesTags: ["Questions"],
    }),
    getQuestionId: builder.query<IQuestion, string>({
      query: (id) => `question/${id}`,
    }),
    addQuestion: builder.mutation<void, IQuestionPost>({
      query: (body) => ({
        url: "question",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Questions"],
    }),
    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `question/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const {
  useGetAllQuestionsQuery,
  useGetQuestionIdQuery,
  useAddQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;

export default questionApi.reducer;
