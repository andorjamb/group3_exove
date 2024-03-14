//React
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { useLocation, useNavigate } from "react-router-dom";

//Redux
import { useGetActiveTemplateQuery } from "../../features/templateApi";
import { newfeedback } from "../../features/feedBackSlice";
import { useGetAllUsersQuery } from "../../features/userApi";
import { usePostFeedbackMutation } from "../../features/feedbackApi";

//Styling
import style from "./FeedbackForm.module.css";

//Types
import { ITemplate } from "../../types/template";
import { IFCategory, IFeedback, ISearchParams } from "../../types/feedback";
import { loggedInUser } from "../../types/users";

//Components
import StringQuestions from "./StringQuestions";
import RangeQuestions from "./RangeQuestions";
import BooleanQuestions from "./BooleanQuestions";
import ButtonFancy from "../UI/ButtonFancy/ButtonFancy";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import { toast } from "react-toastify";

//Functions
import { getSecureUserUid } from "../../functions/secureUser";

const FeedbackForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const lang = useSelector((state: any) => state.header.lang);
  const { feedback } = useSelector((state: any) => state.feedback);
  const [unAnsweredQuestions, setUnAnsweredQuestions] = useState<number>();
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [activeTemplate, setActiveTemplate] = useState<ITemplate>();
  const [userInfo, setUserInfo] = useState<loggedInUser>();

  const [postFeedback] = usePostFeedbackMutation();

  const { data } = useGetActiveTemplateQuery() || [];
  const usersData = useGetAllUsersQuery();

  const request: string | null = params.get("id");
  const feed: string | null = params.get("to");
  const role: string | null = params.get("role");
  let requestpicksId: string = "";
  let feedbackTo: string = "";
  let roleLevel: number;

  useEffect(() => {
    if (data) {
      const categories: IFCategory[] = [];
      data.categories.forEach((cat) => {
        const mapCatToFeedback: IFCategory = {
          category: cat.category._id,
          questions: [],
        };
        categories.push(mapCatToFeedback);
      });

      const newFeedbacks: IFeedback = {
        template: data._id,
        requestpicksId,
        feedbackTo,
        progress: "started",
        responseDateLog: [new Date().toISOString()],
        categories: categories,
        roleLevel,
        userId: userInfo?.uid,
      };

      dispatch(newfeedback(newFeedbacks));
      setActiveTemplate(data);
      setLoadingState(false);
    } else {
      setLoadingState(true);
    }
    //eslint-disable-next-line
  }, [data, dispatch, userInfo?.uid]);

  useEffect(() => {
    const validateNumber = () => {
      const stringQuestions =
        activeTemplate?.categories?.flatMap((category) =>
          category.questions.filter(
            (quiz: { type: string }) => quiz.type.toLowerCase() === "number"
          )
        ) || [];

      const feedbacked: IFeedback = feedback;

      const stringQuestionsAnswers =
        feedbacked?.categories?.flatMap((category) =>
          category.questions.filter(
            (quiz) => quiz.type.toLowerCase() === "number"
          )
        ) || [];
      console.log("filter stringQuestionsAnswers", stringQuestionsAnswers);

      setUnAnsweredQuestions(
        stringQuestions.length - stringQuestionsAnswers.length
      );
    };
    validateNumber();
  }, [feedback, activeTemplate?.categories]);

  const handleSubmitFeedBack = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (unAnsweredQuestions !== 0) {
      alert(`Please answer all questions`);
      return false;
    }

    try {
      /*   const url = `https://exove.vercel.app/api/feedback/${requestpicksId}`; //REPLACE
      const { data } = await axios.post(
        url,
        { ...feedback },
        { withCredentials: true }
      ); */
      await postFeedback({ body: feedback, pickId: requestpicksId }).then(
        () => {
          toast.success("feedback posted sucessfully", {
            className: "toast-message",
          });
        }
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error("Apologies, we have encountered an error", {
        className: "toast-message",
      });
    }
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

  if (usersData.isFetching || !usersData.data) return <CustomSpinner />;

  if (
    request === "null" ||
    feedbackTo === null ||
    role === null ||
    parseInt(role!) === 0
  ) {
    return (
      <div className={style.placeholder}>
        <h1>You don't have any feedbacks to submit.</h1>
      </div>
    );
  } else {
    requestpicksId = request!;
    feedbackTo = feed!;
    roleLevel = parseInt(role!);
  }

  const getRoleTitle = (pickRoleLevel: number) => {
    let title = "";
    switch (pickRoleLevel) {
      case 7:
        title = "self";
        break;
      case 6:
        title = "subordinate";
        break;
      case 5:
        title = "colleague";
        break;
      case 4:
        title = "project manager";
        break;
      case 3:
        title = "competence manager";
        break;
      default:
        title = "colleague";
    }
    return title;
  };

  const getMyRoleTitle = (pickRoleLevel: number) => {
    let title = "";
    switch (pickRoleLevel) {
      case 7:
        title = "self"; //?
        break;
      case 6:
        title = "manager";
        break;
      case 5:
        title = "colleague";
        break;
      case 4:
        title = "subordinate";
        break;
      case 3:
        title = "subordinate";
        break;
      default:
        title = "colleague";
    }
    return title;
  };

  const getFullName = (userId: string) => {
    const userFound = usersData.data?.find((user) => user.ldapUid === userId);
    if (!userFound) return userId;
    return userFound.firstName + " " + userFound.surname;
  };

  return (
    <div className={style.main}>
      <div className={style.user} style={{}}>
        <h1 className={style.header}>
          You're giving feedback to your {getMyRoleTitle(roleLevel)}{" "}
          <span className={style.username}> {getFullName(feedbackTo)}{" "}</span>
          {roleLevel === 7 ? (
            <></>
          ) : (
            <>
              as their{" "}
              <span className={style.role}> {getRoleTitle(roleLevel)} </span>
            </>
          )}
        </h1>
      </div>

      <>
        {loadingState ? (
          <CustomSpinner />
        ) : (
          <div className={style.questionContainer}>
            <div className={style.instructionsContainer}>
              <h2 className={style.instructionsTitle}>Instructions</h2>

              <p className={style.instructions}>
                {activeTemplate?.instructions}
              </p>
            </div>
            {activeTemplate &&
              activeTemplate.categories?.map((cat) => (
                <div className={style.catQuest} key={cat.category._id}>
                  <h2>{cat.category.categoryName}</h2>

                  {cat.questions.map((quiz) => (
                    <div className={style.question_container} key={quiz._id}>
                      {quiz.type.toLowerCase() === "string" ? (
                        <>
                          <StringQuestions
                            key={quiz._id}
                            category={cat.category._id}
                            questions={
                              quiz.question.find(
                                (quiz: { lang: any }) => quiz.lang === lang
                              )!
                            }
                          />
                        </>
                      ) : quiz.type.toLowerCase() === "number" ? (
                        <RangeQuestions
                          key={quiz._id}
                          category={cat.category._id}
                          questions={
                            quiz.question.find(
                              (quiz: { lang: any }) => quiz.lang === lang
                            )!
                          }
                        />
                      ) : (
                        <BooleanQuestions
                          key={quiz._id}
                          category={cat.category._id}
                          questions={
                            quiz.question.find(
                              (quiz: { lang: any }) => quiz.lang === lang
                            )!
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            <div className={style.formElements}>
              <ButtonFancy
                type="submit"
                color="green"
                children="Submit"
                clickHandler={(e) => handleSubmitFeedBack(e)}
                disabled={unAnsweredQuestions !== 0}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default FeedbackForm;
