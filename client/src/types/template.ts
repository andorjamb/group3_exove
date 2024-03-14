//mongodb models:

export enum QuestionType {
  range = "Number",
  open = "String",
  truefalse = "Boolean",
}

export interface IQuestion {
  _id: string;
  category: string; //category id
  createdOn: Date;
  createdBy: string;
  active: boolean;
  type: string;
  question: IQuestionLang[];
}

export interface IQuestionLang {
  _id: string;
  lang: string;
  question?: string; //actual question text
  answer?: string;
  answeredOn?: Date;
  type: string;
}

export interface IQCategory {
  _id: string;
  categoryName: string;
  description?: string;
  questions?: string[];
  createdOn: Date;
  createdBy: string;
  categoryStatus: boolean;
}

//Types for sending new QUESTION to db

type QuestionLangPost = {
  lang: string;
  question: string;
};

export interface IQuestionPost {
  category: string;
  type: string;
  question: QuestionLangPost;
}

//Types for sending new TEMPLATE to db

export interface ICategoryPost {
  category: string;
  questions: string[];
}

export interface ITemplatePost {
  templateTitle: string;
  instructions: string;
  categories: ICategoryPost[];
}

//interfaces for mapping template questions to UI component

export interface ISection {
  id: string; //maps to database category doc id
  name: string; 
  questions: ITemplateQuestion[];
}

export interface ITemplateQuestion {
  id: string; //maps to database question doc id
  question: string;
  isFreeForm: boolean;
}

export interface ActiveCheckboxes {
  [index: string]: string[];
}

//Latest type for getting active and all templates

export interface ITemplate {
  _id: string;
  templateTitle: string;
  instructions: string;
  createdOn: string;
  createdBy: string;
  categories: ICategory[];
  active: boolean;
}

export interface ICategory {
  category: IICategory;   //object with properties category id and category name
  questions: IQuiz[]; //
  _id: string;
}

export interface SingleQuiz {
  lang: string;
  question: string;
  _id: string;
}

interface IQuiz {
  _id: string;
  type: string;
  question: SingleQuiz[];
}

interface IICategory {
  _id: string;
  categoryName: string;
}

/* 
EXPANDED VIEW OF ITemplate
 {
  _id: string;
  templateTitle: string;
  instructions: string;
  createdOn: Date;
  createdBy: string;
  categories: [
    //ISection
    {
      category: string; //category id
      questions: [
        {
          id: string;
          category: string;
          createdBy: string;
          createdOn: Date;
          active: boolean;
          type: any;
          question: [
            {
              lang: string;
              question: string;
              _id: string;
            }
          ];
        }
      ];
    }
  ];
  active: boolean;
}
 */
