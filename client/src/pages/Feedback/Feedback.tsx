import React from "react";

//Components
import FeedbackForm from "../../components/FeedbackForm/FeedbackForm";
import styles from "./Feedback.module.css";
const Feedback = () => {
  return (
    <div className={styles.feedback}>
      <FeedbackForm />
    </div>
  );
};

export default Feedback;
