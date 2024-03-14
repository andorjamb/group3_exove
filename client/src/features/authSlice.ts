//React
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Types

//const serverApi = process.env.REACT_APP_SERVER_API as string;
const serverApi = "https://exove.vercel.app/api/";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: false, //set as needed when ldap server down
    isAdmin: false, //set as needed when ldap server down
    error: null,
    success: false,
    loading: false,
    user: {},
  },
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
  },
});

export const { setLoggedIn, setIsAdmin } = authSlice.actions;

export default authSlice.reducer;
