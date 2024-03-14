//React
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";

//Translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

//Functions and Hooks
import { setIsAdmin, setLoggedIn } from "../../features/authSlice";

// Styling
import styles from "./Login.module.css";
import { AppDispatch } from "../../app/store";
import { secureUserUid } from "../../functions/secureUser";
import ButtonFancySquare from "../UI/ButtonFancySquare/ButtonFancySquare";

interface ILoginParams {
  username: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation(["login"]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loggedIn = useSelector((state: any) => state.auth.loggedIn);
  //const { error } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  // `${process.env.REACT_APP_SERVER_URL}/api/login` as string;
  const prodLoginEndpoint = "https://exove.vercel.app/api/login";

  const [loginParams, setLoginParams] = useState<ILoginParams>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginParams({
      ...loginParams,
      [e.target.name]: e.target.value,
    });
  };

  const userLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      console.log(prodLoginEndpoint, loginParams); //debugging
      await axios
        .post(prodLoginEndpoint, loginParams, {
          withCredentials: true,
        })
        .then(async (res) => {
          console.log("login res", res); //debugging
          await secureUserUid({
            uid: res.data?.uid,
            roleLevel: res.data?.rolesId?.roleLevel,
            displayName: res.data.displayName,
            imageUrl: res.data.imageUrl || "",
          });
          if (res.data?.rolesId?.roleLevel < 3) {
            sessionStorage.setItem("isAdmin", "true");
            dispatch(setIsAdmin(true));
          }
        })
        .then(() => {
          sessionStorage.setItem("loggedIn", "true");
          dispatch(setLoggedIn(true));
          setIsLoading(false);
          setLoginParams({...loginParams, username: "", password: "" });
        });
    } catch (err) {
      console.log(err);
      setLoginParams({...loginParams, username: "", password: "" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    }
    //eslint-disable-next-line
  }, [loggedIn]);

  return (
    <section className={styles.loginContainer}>
      <div className={styles.login}>
        <h1 className={styles.h1}>{t("loginTitle")}</h1>
        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.formElements}>
              <label className={styles.label} htmlFor="username">
                {t("username")}
              </label>
              <input
                type="text"
                className={styles.input}
                name="username"
                id="username"
                onChange={handleChange}
              ></input>
            </div>
            <div className={styles.formElements}>
              <label className={styles.label} htmlFor="password">
                {t("password")}
              </label>
              <input
                type="password"
                className={styles.input}
                name="password"
                id="password"
                onChange={handleChange}
              ></input>
            </div>
            <div className={styles.formElements}>
              <ButtonFancySquare
                type="submit"
                color="purple"
                clickHandler={userLogin}
                children={
                  isLoading ? (
                    <span className="material-symbols-outlined">
                      hourglass_top
                    </span>
                  ) : (
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  )
                }
                disabled={
                  loginParams.password.length === 0 ||
                  loginParams.username.length === 0 ||
                  isLoading
                }
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
