import { createSlice } from "@reduxjs/toolkit";

import { useTranslation } from "react-i18next";

export const headerSlice = createSlice({
  name: "header",
  initialState: { lang: "Eng" },
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = headerSlice.actions;

export default headerSlice.reducer;
