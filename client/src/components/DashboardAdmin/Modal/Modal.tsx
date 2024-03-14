import React from "react";

import styles from "./Modal.module.css";

const Modal = () => {
  return (
    <div className={styles.modal_container}>
      <div className={styles.modal}></div>
    </div>
  );
};

export default Modal;
