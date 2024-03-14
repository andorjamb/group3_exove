import React from "react";
//Styles
import styles from "./CustomSpinner.module.css";

const CustomSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.shadowCircle}>
        <div className={styles.outerCircle}>
          <div className={styles.innerCircle}></div>
        </div>
      </div>
    </div>
  );
};

export default CustomSpinner;
