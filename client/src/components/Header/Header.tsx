//React
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components and pages
import AdminNav from "../AdminNav/AdminNav";
import Nav from "../Nav/Nav";

import { setLoggedIn, setIsAdmin } from "../../features/authSlice";

//Styling
import styles from "./Header.module.css";

//Translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

import axios from "axios";
import { setLanguage } from "../../features/headerSlice";

/** if user == admin, return AdminNav, else return Nav */

const Header = () => {
  const { t, i18n } = useTranslation(["header"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const lang = useSelector((state: any) => state.header.lang);
  const loggedIn = useSelector((state: any) => state.auth.loggedIn);
  const isAdmin = useSelector((state: any) => state.auth.isAdmin);

  const selectEng = () => {
    i18n.changeLanguage("en");
    dispatch(setLanguage("Eng"));
  };
  const selectFi = () => {
    i18n.changeLanguage("fi");
    dispatch(setLanguage("Fin"));
  };

  const logout = () => {
    //sessionStorage.clear();   if using session storage
    dispatch(setLoggedIn(false));
    dispatch(setIsAdmin(false));
    sessionStorage.clear();
    navigate("/");
    axios.get(`${process.env.REACT_APP_SERVER_URL}/logout`);
    document.location.reload();
  };

  return (
    <div className={styles.container}>
      {loggedIn || sessionStorage.getItem("loggedIn") === "true" ? (
        isAdmin || sessionStorage.getItem("isAdmin") === "true" ? (
          <AdminNav />
        ) : (
          <Nav />
        )
      ) : (
        <></>
      )}

      <div className={styles.langButtonDiv}>
        <button
          className={[styles.button, styles.langButton].join(" ")}
          onClick={selectEng}
        >
          EN
        </button>
        <button
          className={[styles.button, styles.langButton].join(" ")}
          onClick={selectFi}
        >
          FI
        </button>
      </div>
      {loggedIn || sessionStorage.getItem("loggedIn") === "true" ? (
        <button className={styles.loginButton} onClick={logout}>
          {t("logout")}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;

