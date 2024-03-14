//React
import React from "react";
import { NavLink } from "react-router-dom";

//styles
import styles from "./Nav.module.css";

//Translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

const Nav = () => {
  const { t } = useTranslation(["header"]);
  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? `${styles.navlink} ${styles.pending}`
              : isActive
              ? `${styles.navlink} ${styles.active}`
              : styles.navlink
          }
          to="/dashboard"
        >
          <li className={styles.li}>{t("dashboard")}</li>
        </NavLink>
      </ul>
    </nav>
  );
};

export default Nav;
