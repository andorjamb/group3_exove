import { createSlice } from "@reduxjs/toolkit";

//Types
import { IFCategory, IFeedback } from "../types/feedback";
import { IQuestionLang } from "../types/template";

const date: Date = new Date();
const questions: IQuestionLang = {
  _id: "",
  lang: "",
  question: "",
  answer: "",
  type: "",
};
const category: IFCategory = {
  category: "",
  questions: [questions],
};

const initfeedback: IFeedback = {
  responseDateLog: [date.toISOString()],
  template: "",
  roleLevel: 0,
  feedbackTo: "",
  progress: "",
  categories: [category],
};

const initialState = {
  feedback: initfeedback,
};

const feedBackSlice = createSlice({
  name: "feedback",
  initialState,

  reducers: {
    newfeedback(state, action) {
      state.feedback = { ...state.feedback, ...action.payload };
    },

    addQuestion(state, action) {
      const { category, question } = action.payload;

      const categoryIndex = state.feedback.categories.findIndex(
        (cat) => cat.category === category
      );
      const checkduplicate = state.feedback.categories[
        categoryIndex
      ].questions.findIndex((id) => id._id === question._id);
      if (categoryIndex !== -1) {
        if (checkduplicate !== -1) {
          state.feedback.categories[categoryIndex].questions[checkduplicate] = {
            ...state.feedback.categories[categoryIndex].questions[
              checkduplicate
            ],
            answer: question.answer,
          };
        } else {
          state.feedback.categories[categoryIndex].questions.push(question);
        }
      }
    },
  },
});

export const { addQuestion, newfeedback } = feedBackSlice.actions;  
export default feedBackSlice.reducer;
