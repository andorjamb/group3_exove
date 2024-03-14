//React
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//Redux
import { setLoggedIn, setIsAdmin } from "../../features/authSlice";

// Components and pages
import AdminNav from "../AdminNav/AdminNav";
import Nav from "../Nav/Nav";
import { getSecureUserUid } from "../../functions/secureUser";

//Types
import { loggedInUser } from "../../types/users";

//Styling
import styles from "./Header.module.css";

//Translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

import axios from "axios";
import { setLanguage } from "../../features/headerSlice";
import Logo from "./Logo";

const Header = () => {
  const { t, i18n } = useTranslation(["header"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<loggedInUser>();

  //const lang = useSelector((state: any) => state.header.lang);
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
    dispatch(setLoggedIn(false));
    dispatch(setIsAdmin(false));
    sessionStorage.clear();
    navigate("/");
    axios.get(`${process.env.REACT_APP_SERVER_URL}/logout`);
    document.location.reload();
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userDetails: loggedInUser = await getSecureUserUid();
        if (userDetails) {
          setUserInfo(userDetails);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logo_nav_container}>
        <Logo />
        {loggedIn || sessionStorage.getItem("loggedIn") === "true" ? (
          isAdmin || sessionStorage.getItem("isAdmin") === "true" ? (
            <AdminNav />
          ) : (
            <Nav />
          )
        ) : (
          <></>
        )}
      </div>
      <div className={styles.lang_login_container}>
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
        <div className={styles.headerBar}>
          {loggedIn || sessionStorage.getItem("loggedIn") === "true" ? (
            <>
              <span className={styles.displayName}>
                {userInfo?.displayName}
              </span>
              <button className={styles.loginButton} onClick={logout}>
                {t("logout")}
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
