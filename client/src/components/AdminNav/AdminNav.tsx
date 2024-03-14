//React
import React from "react";
import { NavLink } from "react-router-dom";

//Styling
import styles from "./AdminNav.module.css";

//Translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

const AdminNav = () => {
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

        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? `${styles.navlink} ${styles.pending}`
              : isActive
              ? `${styles.navlink} ${styles.active}`
              : styles.navlink
          }
          to="/template"
        >
          <li className={styles.li}>{t("templates")}</li>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending
              ? `${styles.navlink} ${styles.pending}`
              : isActive
              ? `${styles.navlink} ${styles.active}`
              : styles.navlink
          }
          to="/userview"
        >
          <li className={styles.li}>{t("userView")}</li>
        </NavLink>
      </ul>
    </nav>
  );
};

export default AdminNav;
