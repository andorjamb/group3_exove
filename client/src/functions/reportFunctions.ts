import { IReportData, IReportCategory, IChartData } from "../types/report";
import { IFeedback, IFCategory } from "../types/feedback";


type MappedCategories = MappedCategory[];

interface MappedCategory {
  categoryName: string;
  categoryId: string;
  chartData: IChartData[];
  comments: Comments[];
}

interface Comments {}

export class ReportClass {
  requestPicksId: string | undefined;
  feedbackTo: string | undefined; //ldapUid
  reportsTo: string | undefined; //ldapUid of CM
  categories: IReportCategory[];

  constructor(
    requestPicksId: string | undefined,
    feedbackTo: string | undefined,
    reportsTo: string | undefined,
    categories: IReportCategory[]
  ) {
    this.requestPicksId = requestPicksId;
    this.feedbackTo = feedbackTo;
    this.reportsTo = reportsTo;
    this.categories = categories;
  }
}

export function scoreAverage(valueArray: number[]) {
  //valueArray =  question.colleagues;
  let total = 0;
  for (let i = 0; i < valueArray.length; i++) {
    total = total + i;
  }
  return total / valueArray.length;
}

/** for Charts creation only  */
export class ChartDataClass {
  categoryName: string | undefined;
  categoryId: string | undefined;
  chartData: IChartData[] | undefined;
  comments: { self: string; CM: string; colleagues: string[] };

  constructor(
    categoryName: string | undefined,
    categoryId: string | undefined,
    chartData: IChartData[] | undefined,
    comments: { self: string; CM: string; colleagues: string[] }
  ) {
    this.categoryName = categoryName;
    this.categoryId = categoryId;
    this.chartData = chartData;
    this.comments = comments;
  }
}


export function sortData (  mappedCategories: MappedCategories | undefined,
  mappedFeedbacks: Map<(string | number | undefined)[], IFCategory[]>) {
    console.log("mappedCategories in mapByRole:", mappedCategories); //debugging
    console.log("mappedFeedbacks in mapByRole:", mappedFeedbacks); //debugging
    mappedFeedbacks.forEach(mapByRole);
  
  }


/** This is Map.prototype.forEach()
 * function (value, key, map){}
iterated for each key/value pair of map */
export function mapByRole(
  values: IFCategory[],
  key: (string | number | undefined)[],
  map: Map<(string | number | undefined)[], IFCategory[]>
  ) {

/*   for (let value of values) {
    console.log("should print values", value); //debugging
    console.log("should print feedback category id", value.category); //debugging

    mappedCategories?.forEach((category) => {
      if (category.categoryId === value.category) {
        //for each question of the matching category:

        if (value.questions && value.questions.length > 0) {
          value.questions.forEach((question) => { */
            //first check if question already exists in mappedCategories:

            ///////////////////////
          
       /*        let chartObj;
              category.chartData.forEach((item:IChartData) => {
                console.log("checking category.chartData in loop",item);
                if (item.questionId === question._id) {
                  chartObj = { ...item };
                } else {
                  //otherwise make a new chart data object:
                  chartObj = {
                    question: question.question as string,
                    questionId: question._id,
                    colleagueAverage: 0,
                    colleagues: [] as number[],
                    CM: 0,
                    self: 0,
                  };
                }
                console.log("getting chartObj values_", chartObj);
                return chartObj;
              }); */



            //////////////////  

            //   chartObj.question = question.question as string;
            /** organise the data according to role of reviewer */

            /*        if (key[1] && key[1] === revieweeId) {
                console.log("self evaluation:", values); //array of feedback objects
                
                if (question.type === "number" && question.answer) {

                  chartObj.self = +question?.answer as number;
                }
                if (question.type === "string") {
                  //add comment to category's comment object
                  category.comments = {
                    ...category.comments,
                    self: question.answer,
                  };
                }
              } */

            /*         if (key[0] && +key[0] < 5) {
                console.log("CM evaluation: by ", key[1], values); //array of feedback objects
                setCompMan((CM) => key[1] as string | undefined);
                if (question.type === "number" && question.answer) {
                  chartObj.CM = +question.answer as number;
                }
                if (question.type === "string") {
                  //add comment to category's comment object
                  category.comments = {
                    ...category.comments,
                    CM: question.answer,
                  };
                }
              } else {
                console.log("colleague evaluation");
                if (question.type === "number" && question.answer) {
                  chartObj.colleagues.push(+question.answer as number);
                }
                if (question.type === "string") {
                  category.comments = {
                    /*   ...category.comments,
                  colleagues: [...[colleagues], question.answer], */
            //   };
            //   }
            //   } */
/* 
            console.log(chartObj);
          });
        }
      }
    });
  }



} */

/*Backup of modify data  function
  function mapByRole(values: IFCategory[], key: any) {
    let bla = new ChartDataClass();
  
    //make object skeleton here
    if (key[1] === revieweeId) {
      console.log("self evaluation:", values); //array of feedback objects
  
      values.forEach((value) => {
        mappedCategories?.forEach((category: any) => {
  
          if (category.categoryId === value.category) {
            console.log("category chart data:", category.chartData);
            console.log(value.questions);
            value.questions.forEach((question) => {
              if (question.type === "number") {
                let newQuestionObject = {
                  question: question.question,
                  self: quesiton.answer,
                };
              }
              if (question.type === "string") {
              }
  
              //make new let chartDataCopy = [...chartData]
  
              console.log(question.question, question.answer);
            });
            let newData = new ChartDataClass(category.categoryName);
          }
        });
  
        //transformQuestions(value.questions);
      });
    }
    if (key[0] < 5) {
      console.log("CM evaluation: by ", key[1], values); //array of feedback objects
  
      setCM((CM) => key[1]);
    } else {
      console.log("colleague evaluation");
    }
  }
  */

/* for returning category name if only category id is present  */
/* function getCatName(para: string) {
  for (const cat of mappedCategories) {
    if (cat.categoryId === para) {
      return cat.categoryName;
    }
  } */
}
