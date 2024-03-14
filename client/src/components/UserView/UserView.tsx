import React, { useState, useEffect } from "react";

import { useGetRequestPicksByUserFeedbacksQuery } from "../../features/requestPicksApi";

import { loggedInUser } from "../../types/users";
import { getSecureUserUid } from "../../functions/secureUser";
import CustomSpinner from "../CustomSpinner/CustomSpinner";
import DashboardUser from "../DashboardUser/DashboardUser";

import styles from "./UserView.module.css";

const UserView: React.FC = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState<loggedInUser>();

  const getUserInfo = async () => {
    const userDetails: loggedInUser = await getSecureUserUid();
    setCurrentUserInfo(userDetails);
  };

  useEffect(() => {
    try {
      getUserInfo();
    } catch (err) {
      console.log("error getting user", err);
    }
  }, []);

  if (!currentUserInfo)
    return (
      <div className="loading_container">
        <CustomSpinner />
        <p>User info loading...</p>
      </div>
    );

  return (
    <div className={styles.user_view_container}>
      <DashboardUser currentUserInfo={currentUserInfo} />
    </div>
  );
};

export default UserView;
