//React
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

//Redux
import {
  useGetAllRequestPicksQuery,
  useGetRequestPickByUserIdQuery,
} from "../../features/requestPicksApi";
import {
  useGetAllUsersQuery,
  useGetUserByLdapUidQuery,
} from "../../features/userApi";

//Styling
import styles from "./Profile.module.css";

//Components
import UserProfile from "../../components/UserProfile/UserProfile";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";

import EmailTest from "../../charts/emailTest";
/** this component currently used for testing purposes only  */

const Profile = () => {
  const { data, isFetching } = useGetAllRequestPicksQuery();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("data:", "");
  }, [data]);

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <span className="material-symbols-outlined">arrow_back_ios</span>
      </button>
      <div className={styles.profile}>
        {" "}
        {data ? (
          <UserProfile />
        ) : { isFetching } ? (
          <CustomSpinner />
        ) : (
          <></>
        )}{" "}
      </div>
    </div>
  );
};

export default Profile;
