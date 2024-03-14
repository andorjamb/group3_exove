//React
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//Styles
import "../../pages/Template/Template.css";

//Translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

//Types
import {
  ITemplate,
  ITemplatePost,
  ITemplateQuestion,
  IQuestionPost,
  ISection,
  ICategoryPost,
  ActiveCheckboxes,
} from "../../types/template";

//Redux
import {
  useGetActiveTemplateQuery,
  useAddTemplateMutation,
} from "../../features/templateApi";
import {
  useGetAllQuestionsQuery,
  useAddQuestionMutation,
} from "../../features/questionApi";
import { useGetAllCategoriesQuery } from "../../features/categoryApi";
import { updateTemplateSelection } from "../../features/templateSlice";

//Components and internal imports
import Accordion from "../../components/Accordion/Accordion";
import { preface } from "../../assets/preface";
import { gradingGuidance } from "../../assets/gradingGuidance";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";

type accordion = {
  open: boolean;
};

class SectionClass {
  id: string;
  name: string;
  questions: ITemplateQuestion[];
  constructor(id: string, name: string, questions: ITemplateQuestion[]) {
    this.id = id;
    this.name = name;
    this.questions = questions;
  }
}

const Template = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["template"]);

  /** data fetching and state */
  const getActiveTemplate = useGetActiveTemplateQuery();
  const getCategories = useGetAllCategoriesQuery();
  const getQuestions = useGetAllQuestionsQuery(); //IQuestion[]
  const { isLoading } = useGetAllQuestionsQuery();

  const [addQuestion] = useAddQuestionMutation();
  const [addTemplate] = useAddTemplateMutation();

  const [accordion, setAccordion] = useState<accordion[]>([]);
  const [templateTitle, setTemplateTitle] = useState<string>("");
  const activeCheckboxState = useSelector(
    (state: any) => state.template.templateSelection
  );
  const lang = useSelector((state: any) => state.header.lang);

  console.log("activeCheckboxState", activeCheckboxState); //debugging  - working
  const categories = getCategories.data;
  const questions = getQuestions.data;
  const [newQuestionState, setNewQuestionState] = useState<{
    categoryId: string;
    value: string;
    type: string;
  }>({
    categoryId: "",
    value: "",
    type: "",
  });

  /** data manipulations  */
  let newCategoryArray: ISection[] = dataParser();

  /** used to set default checked value of checkboxes,
   *  returns all active questions indexed by category  */
  function makeActiveCategoryObject(activeTemplate: ITemplate) {
    if (
      getActiveTemplate.data !== undefined &&
      getActiveTemplate.data.categories.length
    ) {
      let activeCategoryObject = getActiveTemplate.data.categories.reduce(
        (accumulator: any, currentValue: any) => {
          return {
            ...accumulator,
            ...{ [currentValue.category._id]: currentValue.questions },
          };
        },
        {}
      );
      dispatch(updateTemplateSelection(activeCategoryObject));
      return activeCategoryObject;
    } else {
      console.log("categories not populated.");
    }
  }

  /** used to manipulate fetched template data into a form useful for rendering  */
  function dataParser() {
    let categoryArray: ISection[] = [];
    let arrayQuestion: ITemplateQuestion = {
      id: "",
      question: "",
      isFreeForm: false,
    };
    categories?.forEach((category) => {
      let questionArray: ITemplateQuestion[] = [];
      // console.log("data parse question array:", questionArray); //debugging
      questions?.forEach((question) => {
        //makes assumption that questions will only be 'number' or 'string' type

        if (question.category === category._id) {
          if (question.type.toLowerCase() === "number") {
            arrayQuestion = {
              ...arrayQuestion,
              id: question._id,
              question: question.question[0].question as string, //TOFIX: this could cause bugs if 'Eng' is not first in array
              isFreeForm: false,
            };
          }
          if (question.type.toLowerCase() === "string") {
            arrayQuestion = {
              ...arrayQuestion,
              id: question._id,
              question: question.question[0].question as string,
              isFreeForm: true,
            };
          }
          questionArray.push(arrayQuestion);
        }
      });

      let correctedCategory = new SectionClass(
        category._id,
        category.categoryName,
        questionArray
      );
      categoryArray.push(correctedCategory);
    });
    return categoryArray;
  }

  /////** event handlers *///////

  function titleChangeHandler(e: any) {
    setTemplateTitle((title) => e.target.value);
  }

  /* onChange handler for text input */
  function createQuestionChangeHandler(
    e: any,
    categoryId: string,
    value: string
  ) {
    if (value) {
      if (value.length > 2) {
        setNewQuestionState((newQuestionState) => {
          return {
            ...newQuestionState,
            value: e.target.value,
            categoryId: categoryId,
          };
        });
      }

      if (value === "on") {
        setNewQuestionState((newQuestionState) => {
          return { ...newQuestionState, type: "string" };
        });
      } else {
        setNewQuestionState((newQuestionState) => {
          return { ...newQuestionState, type: "number" };
        });
      }
    }
  }

  /** validator for checking data before sending */
  const validator = (obj: {
    categoryId: string;
    value: string;
    type: string;
  }) => {
    let values = Object.values(obj);

    for (const v in values) {
      if (v === "" || v === undefined || v === null) {
        return false;
      } else return true;
    }
  };

  /** submit function for creating new question  */
  function createQuestion() {
    if (validator(newQuestionState)) {
      let newQuestion: IQuestionPost = {
        category: newQuestionState.categoryId,
        question: { lang: "Eng", question: newQuestionState.value },
        type: newQuestionState.type,
      };
      addQuestion(newQuestion).then((res) => {
        console.log(res);
      });
    } else alert("Unable to send, incomplete data");
  }

  /* onChange event handler for selecting/deselecting questions to be added to template  */
  function checkboxChangeHandler(
    e: React.ChangeEvent<HTMLInputElement>,
    categoryId: string, //passed from mapped all-category values
    questionId: string
  ) {
    let checkboxStateCopy = { ...activeCheckboxState };
    Object.isExtensible(checkboxStateCopy);

    if (e.target.checked) {
      if (checkboxStateCopy[categoryId]) {
        console.log("found category in state");
        let questionArray = [...checkboxStateCopy[categoryId]];
        //console.log("current state", questionArray);
        let newQuestionArray = [...questionArray, e.target.value];
        //console.log("after adding:", newQuestionArray);
        checkboxStateCopy = {
          ...checkboxStateCopy,
          [categoryId]: newQuestionArray,
        };

        dispatch(updateTemplateSelection(checkboxStateCopy));
        console.log("/////adding item/////,", checkboxStateCopy); //debugging
      }
    } else {
      console.log(`question ${questionId} deselected`); //debugging
      //TODO: error handler for case where this category does not exist in current active template
      if (checkboxStateCopy[categoryId]) {
        console.log("checking for category id, found");
      }
      let questionArray = [...checkboxStateCopy[categoryId]];

      console.log("question array before filtering", questionArray); //debugging
      let newQuestionArray = questionArray.filter((item) => {
        return item !== e.target.value;
      });
      console.log("copy, after filtering:", newQuestionArray);
      checkboxStateCopy = {
        ...checkboxStateCopy,
        [categoryId]: newQuestionArray,
      };
      dispatch(updateTemplateSelection(checkboxStateCopy));
      console.log("active checkbox state after update:", activeCheckboxState); //debugging
    }
  }

  //convert activeCheckboxState to db post form
  function postCategoryConverter(obj: ActiveCheckboxes) {
    let categoryArray: ICategoryPost[] = [];
    let categoryIds = Object.keys(activeCheckboxState);
    categoryIds.forEach((id) => {
      let questionArray = activeCheckboxState[id];
      let categoryObject = { category: id, questions: questionArray };
      categoryArray.push(categoryObject);
    });

    return categoryArray;
  }

  /* onSubmit handler for saving template to db  */
  async function saveTemplate(e: any) {
    e.preventDefault();
    let categoryArray = postCategoryConverter(activeCheckboxState);
    let newTemplate: ITemplatePost = {
      templateTitle: templateTitle,
      instructions: preface,
      categories: categoryArray,
    };
    await addTemplate(newTemplate).then((res) => {
      console.log(res);
    });
  }

  function toggleAccordion(e: any, i: number) {
    let currentValue = accordion[i]?.open;
    setAccordion((accordion) => {
      return accordion.map((item) => {
        return accordion.indexOf(item) === i
          ? { ...item, open: !currentValue }
          : item;
      });
    });
  }

  /** set initial open state of accordion divs when categories are fetched */
  useEffect(() => {
    if (categories?.length) {
      let accordionCopy = [...accordion];
      for (let i = 0; i < categories.length; i++) {
        accordionCopy.push({ open: false });
      }
      setAccordion((accordion) => [...accordionCopy]);
    }
    //eslint-disable-next-line
  }, [categories]);

  /* for rendering active template categories and questions */
  useEffect(() => {
    if (
      getActiveTemplate.data !== undefined &&
      getActiveTemplate.data.categories.length
    ) {
      console.log("active template categories found"); //debugging
      makeActiveCategoryObject(getActiveTemplate.data!);
    } else {
      console.log("active template categories unavailable");
    }
    //eslint-disable-next-line
  }, [getActiveTemplate]);

  /* for rendering active template title */
  useEffect(() => {
    if (
      getActiveTemplate.data !== undefined &&
      getActiveTemplate.data.templateTitle
    ) {
      console.log("title found"); //debugging
      setTemplateTitle((title) => getActiveTemplate.data!.templateTitle);
    }
    //eslint-disable-next-line
  }, [getActiveTemplate]);

  return (
    <div className={"container"}>
      <h1>{t("pageTitle")}</h1>
      <form className={"form"}>
        <div className={"formRow"}>
          <label htmlFor="templateTitle">
            <h3 className={"h3"}>{t("templateTitle")}</h3>
          </label>
        </div>
        <div className={"formRow"}>
          <input
            className={"input"}
            name="templateTitle"
            value={templateTitle}
            onChange={titleChangeHandler}
          />
          <div className={"iconDiv"}>
            <span className={"materialIcons"}>edit</span>
          </div>
        </div>
        <section>
          <div className={"formRow"}>
            <label htmlFor="preface">
              <h3 className={"h3"}>{t("introductoryText")}</h3>
            </label>
            <span>{t("noEdit")}</span>
          </div>
          <div className={`${"noedit"} ${"preface"}`}>{preface}</div>
        </section>
        {/* END SECTION */}
        <section>
          <div className={"formRow"}>
            <label htmlFor="gradingGuidance">
              <h3 className={"h3"}>{t("gradingGuidance")}</h3>
            </label>
            <span>{t("noEdit")}</span>
          </div>
          <div className={`${"noedit"} ${"preface"}`}>{gradingGuidance}</div>
        </section>
        {/* END SECTION */}
        <div className={"formRow"}>
          <h3 className={"h3"}>{t("questions")}</h3>
        </div>
        {/* ACCORDIONS */}
        {isLoading ? (
          <div className="loading_container">
            <CustomSpinner />
            <p>Fetching questions...</p>
          </div>
        ) : (
          <>
            {newCategoryArray.map((item, i) => (
              <Accordion
                key={i}
                category={item}
                clickHandler={(e: any) => toggleAccordion(e, i)}
                isOpen={accordion[i]?.open}
                checkboxChangeHandler={(e) =>
                  checkboxChangeHandler(e, item.id, e.target.value)
                }
                createQuestionChangeHandler={(e) =>
                  createQuestionChangeHandler(e, item.id, e.target.value)
                }
                createQuestion={createQuestion}
              />
            ))}
          </>
        )}
        <div className={"formRow"}>
          <button
            className={"greenButton"}
            type="submit"
            onClick={saveTemplate}
          >
            {t("save")}
          </button>
          <button type="button">{t("preview")}</button>
        </div>
      </form>
    </div>
  );
};

export default Template;
