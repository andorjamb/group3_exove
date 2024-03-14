//React
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//Redux
import { useGetAllUsersQuery } from "../../features/userApi";
import {
  useGetAllRequestPicksQuery,
  useGetRequestPickByUserIdQuery,
} from "../../features/requestPicksApi";
import { getSecureUserUid } from "../../functions/secureUser";
import { useGetReportSummaryByIdQuery } from "../../features/reportApi";
import { useGetUserByLdapUidQuery } from "../../features/userApi";

//Styles
//import styles from "../../pages/Profile/Profile.module.css";
import styles from "./UserProfile.module.css";
//Types
import { IUserDataGet, loggedInUser } from "../../types/users";
import { IRequestPicks } from "../../types/picks";

//Components
import UserPickBlock from "../DashboardUser/UserPickBlock";
import Card from "../../components/Card/Card";

//translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

type selectedList = {
  userId: string;
  selectionStatus: boolean;
  roleLevel: number;
  feedBackSubmitted: boolean;
  selectedBy: string;
  _id: string;
};

const UserProfile = () => {
  const { t } = useTranslation(["userProfile"]);
  const { userId } = useParams();
  console.log(userId);
  const user = useGetUserByLdapUidQuery(userId as any).data;
  const usersData = useGetAllUsersQuery();
  const allPicks = useGetAllRequestPicksQuery().data;
  const getUserPicks = useGetRequestPickByUserIdQuery(userId as any);

  const [currentUserInfo, setCurrentUserInfo] = useState<loggedInUser>();
  const [userPicks, setUserPicks] = useState<IRequestPicks>();
  const [selectedUserData, setSelectedUserData] = useState<IUserDataGet[]>([]);
  const [selectedIdArray, setSelectedIdArray] = useState<string[]>([]);
  const [selectedListArray, setSelectedListArray] = useState<selectedList[]>(
    []
  );
  console.log(user);
  console.log("all picks", allPicks);
  const getUserInfo = async () => {
    //if (picksData.isFetching || !picksData.data) return;
    const userDetails: loggedInUser = await getSecureUserUid();
    setCurrentUserInfo(userDetails);
  };


  console.log();
  const doneHandler = (picksSelected: IUserDataGet[]) => {
    setSelectedUserData([...picksSelected]);
  };

  useEffect(() => {
    if (allPicks && user) {
      let userPicks = allPicks.filter(
        (pick) => pick.requestedTo === user.ldapUid
      );
      console.log("filtered userpicks", userPicks);
      setUserPicks(userPicks[0]);
  /*     let selectedUserIdArray = userPicks!.SelectedList.map(
        (item) => item.userId
      );
      console.log("array", selectedUserIdArray);
      setSelectedIdArray(selectedUserIdArray); */
    }
  }, [allPicks]);

  useEffect(() => {
    try {
      getUserInfo();
    } catch (err) {
      console.log("error getting user", err);
    }
  }, []);

  return (
    <div>
      <div className={styles.profileHeader}>
        <div className={styles.avatarDiv}>
          {user?.imageUrl ? (
            <img
              className={styles.avatarLarge}
              src={user.imageUrl}
              alt="avatar"
            />
          ) : (
            <img
              className={styles.avatarLarge}
              src="https://www.exove.com/app/uploads/2021/06/Exove-employee-no-image.png"
              alt="avatar"
            />
          )}
        </div>
        <div className={styles.headerTitleDiv}>
          <h1>{user?.firstName + " " + user?.surname}</h1>
          <h4>{user?.title}</h4>
        </div>
        <div className={styles.headerButtonDiv}>
          <button className={styles.buttonOrange}>
            {t("sendAllRequests")}
          </button>
        </div>
      </div>
      <div className={styles.selectionContainer}>
        <section className={styles.selectionBlock}>
          <h2>{t("competenceManager")}</h2>
        </section>
        <section className={styles.selectionBlock}>
          <h2>{t("projectManager")}</h2>
        </section>
        <section className={styles.selectionBlock}>
          <h2>{t("subordinates")}</h2>
        </section>
        <section className={styles.selectionBlock}>
          <h2>{t("colleagues")}</h2>

          {usersData.data && currentUserInfo ? (
            <UserPickBlock
              users={usersData.data.filter((user) =>
                selectedIdArray.includes(user.ldapUid)
              )}
              editHandler={doneHandler}
              doneHandler={() => {
                console.log("placeholder");
              }}
              heading={""}
              defaultEditing={true}
              defaultSelection={[]}
            />
          ) : (
            <p>..... loading .....</p>
          )}
        </section>
        <div className={styles.mainContent}></div>
      </div>
    </div>
  );
};

export default UserProfile;
