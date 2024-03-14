import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//Types
import { IUserDataGet } from "../types/users";

//const serverApi = process.env.REACT_APP_SERVER_API;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://exove.vercel.app/api/",
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<IUserDataGet[], void>({
      query: () => "users",
    }),
    getUserByLdapUid: builder.query<IUserDataGet, string>({
      query: (ldapUid) => `users/${ldapUid}`,
    }),
    getUserById: builder.query<IUserDataGet, string>({
      query: (userId) => `users/id/${userId}`,
    }),
    addUser: builder.mutation<IUserDataGet, void>({
      query: () => ({
        url: "users",
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<IUserDataGet, string>({
      query: (docId) => ({
        url: `users/${docId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Users"],
    }),
    updateUserReportsTo: builder.mutation({
      query: (docId) => ({
        url: `users/${docId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetUserByLdapUidQuery,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useUpdateUserReportsToMutation,
} = userApi;

export default userApi.reducer;
