import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//Types
import { ITemplatePost, ITemplate } from "../types/template";

//const serverApi = process.env.REACT_APP_SERVER_API;
const serverApi = "https://exove.vercel.app/api/";

export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: serverApi,
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Templates", "ActiveTemplate"],
  endpoints: (builder) => ({
    getAllTemplates: builder.query<ITemplate[], void>({
      query: () => `template/`,
      providesTags: ["Templates"],
    }),
    getActiveTemplate: builder.query<ITemplate, void>({
      query: () => `template/active`,
      providesTags: ["ActiveTemplate"],
    }),
    addTemplate: builder.mutation<void, ITemplatePost>({
      query: (body) => ({
        url: `template`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Templates", "ActiveTemplate"],
    }),
    setActiveTemplate: builder.mutation<void, string>({
      //sets {active : true} on specified template id
      query: (id) => ({
        url: `template/${id}`,
        method: "PATCH",
        body: id,
      }),
      invalidatesTags: ["ActiveTemplate"],
    }),
  }),
});

export const {
  useGetAllTemplatesQuery,
  useGetActiveTemplateQuery,
  useAddTemplateMutation,
  useSetActiveTemplateMutation,
} = templateApi;

export default templateApi.reducer;
