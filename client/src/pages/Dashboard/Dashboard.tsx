import React, { useState, useEffect } from "react";

//Pages and Components
import DashboardAdmin from "../../components/DashboardAdmin/DashboardAdmin";
import DashboardUser from "../../components/DashboardUser/DashboardUser";
import DashboardManager from "../../components/DashboardManager/DashboardManager";

// Types
import { loggedInUser } from "../../types/users";

// Functions
import { getSecureUserUid } from "../../functions/secureUser";

//Styling
import styles from "./Dashboard.module.css";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";

const Dashboard = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState<loggedInUser>();
  const [isHR, setIsHR] = useState<boolean | undefined>();

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

  useEffect(() => {
    // When user info is ready, determine if user is HR
    if (!currentUserInfo) {
      return;
    }
    if (currentUserInfo.roleLevel < 3) setIsHR(true);
    else setIsHR(false);
  }, [currentUserInfo]);

  if (!currentUserInfo)
    return (
      <div className="loading_container">
        <CustomSpinner />
        <p>User info loading...</p>
      </div>
    );

  return (
    <div className={styles.container}>
      {isHR ? (
        <DashboardAdmin />
      ) : (
        <DashboardUser currentUserInfo={currentUserInfo} />
      )}
    </div>
  );
};

export default Dashboard;
