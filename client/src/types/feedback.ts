import { IQuestionLang } from "./questions";

export interface IFeedback {
  _id?: string; 
  template: string;
  userId?: string; // user completing feedback instance
  requestpicksId?: string;
  feedbackTo: string;
  progress: string;
  responseByDate?: string;
  responseDateLog: string[]; //logs dates of changes
  categories: IFCategory[];
  roleLevel?: number;
  submitted?: boolean;
}

export interface IFCategory {
  category: string;
  questions: IQuestionLang[];
}

export interface ITableEntry {
  _id: string;
  emp_id: string;
  emp_name: string;
  res_coll: string; //a number as string, represents the number of responses received
  res_pm: string;
  res_cm: string;
  status_picks: {
    ready: boolean;
    approved: boolean;
  };
  status_surveys: {
    ready: boolean;
    approved: boolean;
  };
  status_report: {
    ready: boolean;
    approved: boolean;
  };
}

/** should this also have roleLevel:number ?  */
export interface ISearchParams {
  id: string;
  feedbackTo: string;
}
