//React
import React from "react";

//Components and Pages
import Header from "../Header/Header";
import Main from "../Main/Main";

//Styling
import styles from "./Layout.module.css";

//toastify

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  return (
    <div className={styles.container}>
      <ToastContainer />
      <Header />
      <Main />
    </div>
  );
};

export default Layout;
