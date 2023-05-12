import React, { useEffect, useState } from "react";
import style from "./FeedbackForm.module.css";
import StringQuestions from "./StringQuestions";
import RangeQuestions from "./RangeQuestions";
import BoleanQuestions from "./BoleanQuestions";
import { useGetActiveTemplateQuery } from "../../features/templateApi";
import { ITemplate } from "../../types/template";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { IFCategory, IFeedback } from "../../types/feedback";
import { newfeedback } from "../../features/feedBackSlice";
import { getSecureUserUid } from "../../functions/secureUser";
import { loggedInUser } from "../../types/users";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FeedbackForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useGetActiveTemplateQuery() || [];

  const [loadigState, setLoadingState] = useState<boolean>(true);
  const [qTemplate, setActiveTmpt] = useState<ITemplate>();
  const [userInfo, setUserInfo] = useState<loggedInUser>();
  const { feedback } = useSelector((state: any) => state.feedback);
  const navigate = useNavigate();
  const [language, setLang] = useState<string>("Eng");

  useEffect(() => {
    if (data) {
      const categories: IFCategory[] = [];

      data.categories.forEach((cat) => {
        const cate: IFCategory = {
          category: cat.category._id,
          questions: [],
        };
        categories.push(cate);
      });
      const newFeedbacks: IFeedback = {
        template: data._id,
        requestpicksId: "da3040ce-43e9-4d2b-89a1-cefe27563492",
        feedbackTo: "einstein",
        progress: "started",
        responseDateLog: [new Date().toISOString()],
        categories: categories,
        roleLevel: 5,
        userId: userInfo?.uid,
      };
      dispatch(newfeedback(newFeedbacks));
      setActiveTmpt(data);

      setLoadingState(false);
    } else {
      setLoadingState(true);
    }
  }, [data, dispatch, userInfo?.uid]);

  const handleSubmitFeedBack = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const url =
        "https://exove.vercel.app/api/feedback/da3040ce-43e9-4d2b-89a1-cefe27563492";
      const { data } = await axios.post(
        url,
        { ...feedback },
        { withCredentials: true }
      );
      console.log(data);
      alert(data);
    } catch (error) {}
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoadingState(true);
        const userDetails: loggedInUser = await getSecureUserUid();
        if (userDetails) {
          setUserInfo(userDetails);
        } else {
          navigate("/login");
        }
        setLoadingState(false);
      } catch (error) {
        console.log(error);
        setLoadingState(false);
      }
    };
    getUser();
  }, [navigate]);

  return (
    <div className={style.main}>
      <div className={style.user} style={{}}>
        <h1 className={style.header}>{qTemplate?.templateTitle}</h1>
        <h2 className={style.username}>
          Moi {userInfo ? userInfo.displayName : "Guest"}
        </h2>
      </div>

      <h3 className={style.instructionsTitle}>Instruction</h3>

      <p className={style.instructions}>{qTemplate?.instructions}</p>
      <>
        {loadigState ? (
          <>
            <h1>Getting Data .........</h1>
          </>
        ) : (
          <div className={style.questionContainer}>
            {qTemplate &&
              qTemplate.categories?.map((cat) => (
                <div className={style.catQuest} key={cat.category._id}>
                  <h2>{cat.category.categoryName}</h2>

                  {cat.category.questions.map((quiz) => (
                    <div key={quiz._id}>
                      {quiz.type.toLowerCase() === "string" ? (
                        <>
                          <StringQuestions
                            key={quiz._id}
                            category={quiz.category}
                            questions={
                              quiz.question.find(
                                (quiz) => quiz.lang === language
                              )!
                            }
                          />
                        </>
                      ) : quiz.type.toLowerCase() === "number" ? (
                        <RangeQuestions
                          key={quiz._id}
                          category={quiz.category}
                          questions={
                            quiz.question.find(
                              (quiz) => quiz.lang === language
                            )!
                          }
                        />
                      ) : (
                        <BoleanQuestions
                          key={quiz._id}
                          category={quiz.category}
                          questions={
                            quiz.question.find(
                              (quiz) => quiz.lang === language
                            )!
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}
      </>

      <div className={style.formElements}>
        <button
          className={[style.button, style.loginButton].join(" ")}
          onClick={(e) => handleSubmitFeedBack(e)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
