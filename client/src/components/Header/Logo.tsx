import React from "react";

import styles from "./Logo.module.css";
import { NavLink } from "react-router-dom";

const Logo = () => {
  return (
    <NavLink className={styles.logo_link} to="/dashboard">
      <svg
        className={styles.logo}
        width="40px"
        height="40px"
        viewBox="0 0 168 168"
        version="1.1"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <path
            fill="rgb(255, 255, 255)"
            d="M84.0007248,41 C60.2903835,41 41,60.2903835 41,83.9992752 C41,107.711066 60.2903835,127 84.0007248,127 C107.709617,127 127,107.711066 127,83.9992752 C127,60.2903835 107.709617,41 84.0007248,41 M84.000724,168 C37.6829603,168 0,130.31704 0,83.999276 C0,37.6829603 37.6829603,0 84.000724,0 C130.31704,0 168,37.6829603 168,83.999276 C168,130.31704 130.31704,168 84.000724,168"
          ></path>
        </g>
      </svg>
    </NavLink>
  );
};

export default Logo;
