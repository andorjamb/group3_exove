import { IFeedback } from "../types/feedback";
import { IQuestionLang } from "../types/questions";
/** IQuestionLang
 *  _id: string;
  lang: string;
  question?: string;
  answer?: string | number;
  answeredOn?: Date;
  type: string;

*/
export const testFeedbackData: IFeedback[] = [
  {
    userId: "newton",
    responseDateLog: [],
    template: "",
    progress: "",
    feedbackTo: "curie",
    roleLevel: 3,
    categories: [
      {
        category: "b10e82d5-03be-45c3-85a5-363f2533a908",
        questions: [
          {
            question: "The person produces high quality product",
            type: "number",
            _id: "",
            answer: "5",
            lang: "Eng",
          },
          {
            question:
              "The person aims to improve the quality of the end result beyond expressed requirements",
            type: "number",
            _id: "",
            answer: "4",
            lang: "Eng",
          },
          {
            question: "Other comments about quality focus",
            type: "string",
            _id: "",
            answer: "Performs very well under the circumstances",
            lang: "Eng",
          },
        ],
      },
      {
        category: "2ca3b93b-159f-4788-9a2b-c152eb82de24",
        questions: [
          {
            question: "The person competently directs their own work",
            type: "number",
            _id: "",
            answer: "4",
            lang: "Eng",
          },
          {
            question: "The person is not afraid to ask for help",
            type: "number",
            _id: "",
            answer: "3",
            lang: "Eng",
          },
          {
            question: "Other comments about self-guidance",
            type: "string",
            _id: "",
            answer: "Motivated, self-starter",
            lang: "Eng",
          },
        ],
      },
    ],
  },
  {
    userId: "gauss",
    responseDateLog: [],
    template: "",
    progress: "",
    feedbackTo: "curie",
    roleLevel: 5,
    categories: [
      {
        category: "2ca3b93b-159f-4788-9a2b-c152eb82de24",
        questions: [
          {
            question: "The person has a positive attitude",
            type: "number",
            _id: "",
            answer: "4",
            lang: "Eng",
          },
          {
            question: "The person has a proactive way to take things forward",
            type: "number",
            _id: "",
            answer: "4",
            lang: "Eng",
          },
          {
            question: "Other feedback about self-guidance",
            type: "string",
            _id: "",
            answer: "A joy to work with",
            lang: "Eng",
          },
        ],
      },
      {
        category: "2ca3b93b-159f-4788-9a2b-c152eb82de24",
        questions: [
          {
            question: "The person competently directs their own work",
            type: "number",
            _id: "",
            answer: "3",
            lang: "Eng",
          },
          {
            question: "The person is not afraid to ask for help",
            type: "number",
            _id: "",
            answer: "4",
            lang: "Eng",
          },
          {
            question: "Other comments about self-guidance",
            type: "string",
            _id: "",
            answer: "Diligent and self-directing",
            lang: "Eng",
          },
        ],
      },
    ],
  },
  {
    userId: "curie",
    responseDateLog: [],
    template: "",
    progress: "",
    feedbackTo: "curie",
    roleLevel: 5,
    categories: [
      {
        category: "2ca3b93b-159f-4788-9a2b-c152eb82de24",
        questions: [
          {
            question: "The person has a positive attitude",
            type: "number",
            _id: "",
            answer: "4",
            lang: "Eng",
          },
          {
            question: "The person has a proactive way to take things forward",
            type: "number",
            _id: "",
            answer: "4",
            lang: "Eng",
          },
          {
            question: "Other feedback about self-guidance",
            type: "string",
            _id: "",
            answer: "A joy to work with",
            lang: "Eng",
          },
        ],
      },
      {
        category: "2ca3b93b-159f-4788-9a2b-c152eb82de24",
        questions: [
          {
            question: "The person competently directs their own work",
            type: "number",
            _id: "",
            answer: "5",
            lang: "Eng",
          },
          {
            question: "The person is not afraid to ask for help",
            type: "number",
            _id: "",
            answer: "3",
            lang: "Eng",
          },
          {
            question: "Other comments about self-guidance",
            type: "string",
            _id: "",
            answer: "Diligent and self-directing",
            lang: "Eng",
          },
        ],
      },
    ],
  },
];

/*
feedbacks questions: object array
{
answer: "false",
answeredOn: "2023-05-12T07:38:42.115Z",
question: "The person produces high quality product",
type: "boolean",
_id: "6454aa0d971f4982fdd21b29"
*/

/*feedback.cagories:[]
{
  category: 'b10e82d5-03be-45c3-85a5-363f2533a908', 
  questions: Array(0), 
  _id: '645e25c0235706de4691dcf1'
},
*/

/**
 * Endpoints:
 *
 * feedback/  - get all
 * feedback/:id - get one by doc Id /? or requestPick id?)
 * feedback/name/name  -  get feedbacks by userId (ldapuid?)
 * POST feedback/:id -  post feedback by requestId
 * DELETE feedback/:id -
 * PATCH feedback/submit/:id - requestPicksId: submits a feedback (is this action completed by Essi after approval?)
 */

/* export interface IFeedback {
  _id?: string; //Out generated
  template: string;
  userId?: string; // get current user
  requestpicksId?: string;
  feedbackTo: string;
  progress: string;
  responseByDate?: string;
  responseDateLog: string[]; //logs dates of changes
  categories: IFCategory[];
  roleLevel?: number;
}
*/


export const testing = [
  {
    question: "Question 1",
    questionId: "",
    colleagueAverage: 4,
    colleagues: 4,
    CM: 4,
    self: 3,
  },
  {
    question: "Question 2",
    questionId: "",
    colleagueAverage: 4,
    colleagues: 5,
    CM: 4,
    self: 2,
  },
  {
    question: "Question 3",
    questionId: "",
    colleagueAverage: 4,
    colleagues: 5,
    CM: 4,
    self: 2,
  },
  {
    question: "Question 4",
    questionId: "",
    colleagueAverage: 3,
    colleagues: 3,
    CM: 4,
    self: 2,
  },
  {
    question: "Question 5",
    questionId: "",
    colleagueAverage: 2,
    colleagues: 1,
    CM: 2,
    self: 4,
  },
];