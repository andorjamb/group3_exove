//React
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Redux
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../features/userApi";
import {
  useGetAllRequestPicksQuery,
  useSubmitPickMutation,
  useApprovePickMutation,
} from "../../features/requestPicksApi";
import { getSecureUserUid } from "../../functions/secureUser";
import { useGetRequestPickByUserIdQuery } from "../../features/requestPicksApi";
import { useGetActiveTemplateQuery } from "../../features/templateApi";

//Pages and Components
import SearchBar from "../DashboardAdmin/SearchBar/SearchBar";
import UserPickBlock from "./UserPickBlock";
import CustomSpinner from "../CustomSpinner/CustomSpinner";
import Submitted from "./Submitted";
import ButtonFancy from "../UI/ButtonFancy/ButtonFancy";

//Styling
import styles from "./PicksUser.module.css";

//Translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

//Types
import { IUserDataGet, loggedInUser } from "../../types/users";
import { IRequestPicks } from "../../types/picks";

const PicksUser = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["dashboardUser"]);
  const usersData = useGetAllUsersQuery();
  const picksData = useGetAllRequestPicksQuery();
  const activeTemplateData = useGetActiveTemplateQuery();
  const [approvePick] = useApprovePickMutation();
  const [submitPick] = useSubmitPickMutation();

  const [selected, setSelected] = useState<IUserDataGet[]>([]);
  const [currentUserInfo, setCurrentUserInfo] = useState<loggedInUser>();
  const [currentUserPick, setCurrentUserPick] = useState<IRequestPicks>();
  // replace with navigate later?
  const [submitted, setSubmitted] = useState(false);
  
  const getUserInfo = async () => {
    if (
      picksData.isFetching ||
      !picksData.data ||
      activeTemplateData.isFetching ||
      !activeTemplateData.data
    )
      return;
      console.log("picksData", picksData.data); //Debugging
    const userDetails: loggedInUser = await getSecureUserUid();
    setCurrentUserInfo(userDetails);
    setCurrentUserPick(
      picksData.data.find(
        (pick) =>
          pick.requestedTo === userDetails.uid &&
          pick.template === activeTemplateData.data?._id
      )
    );
  };

  useEffect(() => {
    try {
      getUserInfo();
    } catch (err) {
      console.log("error getting user", err);
    }
    //eslint-disable-next-line
  }, [picksData]);

  // Differentiate between loading and no pick found?
  if (
    usersData.isFetching ||
    !usersData.data ||
    !currentUserInfo ||
    activeTemplateData.isFetching ||
    !activeTemplateData.data
  ) {
    // Debugging loading
    if (usersData.isFetching || !usersData.data)
      console.log("usersData", usersData);
    if (!currentUserInfo) console.log("currentUserInfo", currentUserInfo);
    return (
      <div className="loading_container">
        <CustomSpinner />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  //picksData object for this user will not exist if HR has not requested user picks yet
  if (!currentUserPick)
    return (
      <p>
        No <span className={styles.keyword}>picks</span> needed just yet.
      </p>
    );

  const picksDone = () => {
    return (
      currentUserPick.SelectedList.filter(
        (pick) =>
          pick.roleLevel === 5 &&
          pick.userId !== currentUserInfo.uid &&
          pick.selectionStatus
      ).length >= 5
    );
  };

  if (picksDone())
    return (
      <h2>{t('picksSubmitted')}
        {/* You have submitted your <span className={styles.keyword}>picks</span>{" "}
        already, thank you! */}
      </h2>
    );

  const activatePick = async (userId: string, pickRoleLevel: number) => {
    if (!currentUserPick) return;
    const pickFound = currentUserPick.SelectedList.find(
      (pick) => pick.userId === userId && pick.roleLevel === pickRoleLevel
    );
    if (pickFound) {
      if (pickFound.selectionStatus === true) return;
      else {
        const requestBody = {
          userId: userId,
          roleLevel: pickRoleLevel,
          selectionStatus: true,
        };
        await approvePick({ body: requestBody, id: currentUserPick._id });
      }
    } else {
      const requestBody = {
        userId: userId,
        roleLevel: pickRoleLevel,
        selectionStatus: true,
      };
      await submitPick({ body: requestBody, id: currentUserPick._id });
    }
  };

  const submitHandler = async () => {
    console.log("currentUserPick", currentUserPick);
    if (!currentUserPick) return;
    console.log("Submitting:", selected);
    setSubmitted(true);
    for (const selectedUser of selected) {
      await activatePick(selectedUser.ldapUid, 5);
    }
  };

  const doneHandler = (picksSelected: IUserDataGet[]) => {
    setSelected([...picksSelected]);
  };

  return (
    <div className={styles.container}>
      {submitted ? (
        <Submitted />
      ) : (
        <div className={styles.mainContent}>
          <UserPickBlock
            users={usersData.data.filter(
              (user) => user.ldapUid !== currentUserInfo.uid
            )}
            editHandler={doneHandler}
            doneHandler={() => {}}
            heading={t("title")}
            defaultEditing={true}
            defaultSelection={[]}
          />
          <div className={styles.submit_container}>
            <ButtonFancy
              type="button"
              disabled={selected.length < 5}
              clickHandler={submitHandler}
              children={t("submit")}
              color="green"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PicksUser;
