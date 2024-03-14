import { QuestionType } from "./template";

export interface IQCategory {
  _id: string;
  categoryName: string;
  description?: string;
  questions?: string[];
  createdOn: Date;
  createdBy: string;
  categoryStatus: boolean;
}

export interface IQuestion {
  _id: string;
  category: string;
  createdOn: Date;
  createdBy: string;
  active: boolean;
  type: string;
  question: IQuestionLang[];
}

export interface IQuestionLang {
  _id: string;
  lang: string;
  question?: string;
  answer?: string;
  answeredOn?: Date;
  type: string;
}

//Types for sending new question to db

type QuestionLangPost = {
  lang: string;
  question: string;
};

export interface IQuestionPost {
  category: string;
  type: string;
  question: QuestionLangPost;
}
