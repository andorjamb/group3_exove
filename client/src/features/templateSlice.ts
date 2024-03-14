import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActiveCheckboxes {
  [index: string]: string[];
}

export const templateSlice = createSlice({
  name: "template",
  initialState: { templateSelection: {}, activeTemplateId: "" },
  reducers: {
    updateTemplateSelection: (
      state,
      action: PayloadAction<ActiveCheckboxes>
    ) => {
      state.templateSelection = {
        ...state.templateSelection,
        ...action.payload,
      };
    },
    setActiveTemplateId: (state, action: PayloadAction<string>) => {
      state.activeTemplateId = action.payload;
    },
  },
});

export const { updateTemplateSelection } = templateSlice.actions;

export default templateSlice.reducer;
