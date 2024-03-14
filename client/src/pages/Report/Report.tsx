//React
import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

//styles
import styles from "./Report.module.css";

//Types
import { IChartData } from "../../types/report";
import { IFeedback, IFCategory } from "../../types/feedback";
import { ITemplate } from "../../types/template";
import { loggedInUser } from "../../types/users";

//Redux
import { useGetFeedbacksByNameQuery } from "../../features/feedbackApi";
import { useGetUserByLdapUidQuery } from "../../features/userApi";
import { useGetActiveTemplateQuery } from "../../features/templateApi";

//Translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

//Components
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import ChartBar from "../../charts/ChartBar";
import ChartRadar from "../../charts/ChartRadar";

//Functions
import { printMultiPdf } from "../../functions/printPdf";
import { testing } from "../../testdata/testFeedbackData"; //chart testing only
import { getSecureUserUid } from "../../functions/secureUser";

type MappedCategories = MappedCategory[] | undefined;

interface MappedCategory {
  categoryName: string | undefined;
  categoryId: string | undefined;
  chartData: IChartData[];
  comments: Comments;
}

interface Comments {
  self: string;
  CM: string;
  colleagues: string[];
}

const Report = () => {
  const { t } = useTranslation(["report"]);
  const { revieweeId } = useParams();
  //const reportRoot = useRef<HTMLDivElement>(null);
  const elementArray = useRef<HTMLDivElement[]>([]); //try to use this on mapped elements instead of converting entire page to one canvas
  const date = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation(); //convert path to queryParams later

  const [CompMan, setCompMan] = useState<string | undefined>("");
  const [mappedCategories, setMappedCategories] = useState<MappedCategories>();
  const [mappedFeedbacks, setMappedFeedbacks] =
    useState<Map<(string | number | undefined)[], IFCategory[]>>(); //
  const [template, setTemplate] = useState<ITemplate>();
  const [userInfo, setUserInfo] = useState<loggedInUser>();
  const [selfEval, setSelfEval] = useState<IFeedback>();
  const [cmEval, setCmEval] = useState<IFeedback>();
  const [colleagueEvals, setColleagueEvals] = useState<IFeedback[]>();

  const activeTemplate = useGetActiveTemplateQuery().data;
  const revieweeData = useGetUserByLdapUidQuery(revieweeId as string).data;
  const CompManData = useGetUserByLdapUidQuery(CompMan as string).data;
  const categories = template?.categories;

  const { isLoading, isFetching } = useGetFeedbacksByNameQuery(
    revieweeId as string
  );

  let feedbacks: IFeedback[] | undefined = useGetFeedbacksByNameQuery(
    revieweeId as string
  ).data;
  
  const blankChartData:IChartData = {
    question: "",
    questionId:"",
    colleagueAverage: 0,
    colleagues: [],
    self: "",
    CM: ""}

  function mapQuestionsToCharts (evalObject:IFeedback, role:string){
    evalObject?.categories.forEach((evalCategory) => {
      mappedCategories?.forEach((chartCategory) => {
        if (evalCategory.category === chartCategory.categoryId) {
          console.log("whats happening", evalCategory.questions);
          console.log("chartCategory", chartCategory);

          evalCategory.questions.forEach((question) => {
            if (question.type === "string".toString()) {
              console.log('string question', question.question);
              chartCategory.comments = {
                ...chartCategory.comments,
                [role]: question.answer as string,
              };
            }
            if (question.type === "number") {
              let getIndex:number = chartCategory.chartData.findIndex((item)=>item.questionId === question._id);
              if (getIndex === -1){
                console.log('not found')
                let copy:IChartData = {...blankChartData, question: question.question as string,
                  questionId: question._id,
                  [role]: question.answer}
                chartCategory.chartData.push(copy) 
              }
              else {
                chartCategory.chartData[getIndex] = {
                  ...chartCategory.chartData[getIndex],
                  question: question.question as string,
                  [role]: question.answer,
                }
              }
            }        
          });
        }
      });
      console.log(
        `mappedCategories after adding ${role} response`,
        mappedCategories
      );
    });

  }

  /** currently assumed that activeTemplate is the same as template._id in feedbacks */
  useEffect(() => {
    setTemplate(activeTemplate);
  }, [activeTemplate]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userDetails: loggedInUser = await getSecureUserUid();
        if (userDetails) {
          //console.log("user details", userDetails);  //Debugging
          setUserInfo(userDetails);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [navigate]);

  /** set name of competence manager */ //--> note: it may be wiser to include this as a search param
  useEffect(() => {
    if (revieweeData) {
      if (
        revieweeData.workId[0].reportsTo &&
        revieweeData.workId[0].reportsTo !== undefined
      ) {
        let compman = revieweeData.workId[0].reportsTo;
        setCompMan(compman);
      } else {
        setCompMan("No CM found");
      }
    }
  }, [revieweeData]);

//return to login if unauthorised
  useEffect(() => {
    if (userInfo) {
      if (userInfo.roleLevel > 2 && userInfo.uid !== CompMan) {
        console.log("Not authorised to view this page");
        navigate("/login");
      }
    }
    //eslint-disable-next-line
  }, [CompMan]);


  /** prepare chart data objects */
  useEffect(() => {
    let mappedCategories: MappedCategories = categories?.map((category) => {
      return {
        categoryName: category.category.categoryName,
        categoryId: category.category._id,
        chartData: [],
        comments: { self: "", CM: "", colleagues: [] },
      };
    });
   // console.log("MAPPEDCATEGORIES", mappedCategories); //debugging
    setMappedCategories(mappedCategories);
  }, [categories]);



  // sort feedbacks by reviewer role 
  useEffect(() => {
    let colleagues: IFeedback[] = [];
    console.log('FEEDBACKS', feedbacks);
    if (feedbacks && feedbacks !== undefined) {
      
      let feedbacksCopy = [...feedbacks];
      feedbacksCopy.forEach((feedback) => {
        if (feedback.userId === revieweeId) {
          setSelfEval(feedback);
        } else if (feedback.userId === CompMan) {
          setCmEval(feedback);
        } else {
          colleagues.push(feedback);
        }
      });
      console.log('running sort feedbacks useeffect') //debugging
      setColleagueEvals(colleagues);
    }
  }, [CompMan, revieweeId]);

  /* map feedback responses to chartData objects */
  useEffect(() => {
    mapQuestionsToCharts(cmEval as IFeedback,"CM");
  }, [cmEval]);

  useEffect(() => {
    mapQuestionsToCharts(selfEval as IFeedback,"self");
  }, [selfEval]);





  if (isLoading || isFetching) {
    return (
      <div className="loading_container">
        <CustomSpinner />
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.report} /* ref={reportRoot} */>
        <div className={styles.reportHeader}></div>
        <section>
          <h1>{date} Colleague Feedback Report</h1>

          <div className={styles.feedbackInfo}>
            <h2>Template: {template?.templateTitle}</h2>
            <p>
              Competence Manager:{" "}
              {CompManData?.firstName + " " + CompManData?.surname}
            </p>
            <p>
              Reviewee: {revieweeData?.firstName + " " + revieweeData?.surname}
            </p>
          </div>
        </section>
        {mappedCategories?.map((item: any) => (
          <section className={styles.section} key={item.categoryId}>
            <div>
              <h3>{item.categoryName}</h3>
            </div>
            <div className={styles.charts}>
              <ChartBar barChartData={testing} />
              <ChartRadar radarChartData={testing} />
            </div>
            <div className={styles.openComments}>
              <p>
                <span className={styles.commentSpan}>
                  Own comments: {item.comments?.self}
                </span>
              </p>
              <p>
                <span className={styles.commentSpan}>
                  Other comments:{item.comments?.CM}
                </span>
              </p>
            </div>
          </section>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.buttonOrange}
          onClick={() => printMultiPdf(elementArray.current, revieweeId)}
        >
          {t("generatePdf")}
        </button>
      </div>
    </div>
  );
};

export default Report;
