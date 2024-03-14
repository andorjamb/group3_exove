import React, { useState } from "react";
import styles from "./FeedbackForm.module.css";
import { IQuestionLang, SingleQuiz } from "../../types/template";
import { useDispatch } from "react-redux";
import { addQuestion } from "../../features/feedBackSlice";

interface question {
  questions: SingleQuiz;
  category: string;
}
const RangeQuestions = ({ questions, category }: question) => {
  const [value, setValue] = useState(0);
  const [selectedValue, setSelectedValue] = useState<number>();
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(Number(e.target.value));
    setSelectedValue(Number(e.target.value));
    const question: IQuestionLang = {
      _id: questions._id,
      lang: questions.lang,
      question: questions.question,
      answer: e.target.value,
      type: "number",
    };

    dispatch(addQuestion({ question, category }));
  };

  const getGradientStyle = () => {
    if (value === -1) {
      return {
        background: `var(--lightGray)`,
      };
    } else if (value === 0) {
      const percentage = (value / 4) * 100;
      return {
        background: `linear-gradient(to right, #4bebde ,#a76acd ${percentage}%, #e8e8e8 ${percentage}%)`,
      };
    } else if (value === 1) {
      const percentage = ((value - 1) / 4) * 100;
      return {
        background: `linear-gradient(to right, #4bebde , #a76acd ${percentage}%, #e8e8e8 ${percentage}%)`,
      };
    } else if (value === 2) {
      const percentage = ((value - 1) / 4) * 100;
      return {
        background: `linear-gradient(to right, #4bebde , #a76acd ${percentage}%, #e8e8e8 ${percentage}%)`,
      };
    } else if (value === 3) {
      const percentage = ((value - 1) / 4) * 100;
      return {
        background: `linear-gradient(to right, #4bebde , #a76acd ,#e130a3 ${percentage}%, #e8e8e8 ${percentage}%)`,
      };
    } else if (value === 4) {
      const percentage = ((value - 1) / 4) * 100;
      return {
        background: `linear-gradient(to right, #4bebde , #a76acd ,#e130a3, #f85b6b ${percentage}%, #e8e8e8 ${percentage}%)`,
      };
    } else if (value === 5) {
      const percentage = ((value - 1) / 4) * 100;
      return {
        background: `linear-gradient(to right, #4bebde , #a76acd ,#e130a3, #f85b6b , #ffc94d  ${percentage}%)`,
      };
    }
  };
  const renderRadio = (index: number) => {
    const colors = ["#4BEBDD", "#A567CC", "#DF2C9F", "#F85B6B", "#FFC94D"];

    let radioColor = "#e8e8e8";

    if (index <= value) {
      radioColor = colors[index - 1];
    } else if (value === 5) {
      radioColor = colors[4];
    }

    return (
      <label
        key={index}
        className={`${styles.rLabel}`}
        style={{ backgroundColor: radioColor }}
      >
        <input
          type="radio"
          value={index}
          checked={index === value}
          onChange={(e) => {
            handleInputChange(e);
          }}
          style={{ display: "none" }}
        />
        <span className={styles.rSpan}>{index}</span>
      </label>
    );
  };

  const validateSelection = () => {
    return selectedValue !== undefined;
  };

  return (
    <div className={styles.rMainDiv}>
      <p>
        {questions.question}{" "}
        {!validateSelection() && <span style={{ color: "red" }}>*</span>}
      </p>
      <div className={styles.rAnswer} style={{ ...getGradientStyle() }}>
        {[1, 2, 3, 4, 5].map((index) => renderRadio(index))}
      </div>
    </div>
  );
};
export default RangeQuestions;
