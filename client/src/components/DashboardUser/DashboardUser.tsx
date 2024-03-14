//react
import { NavLink } from "react-router-dom";

// API, redux
import { useGetAllFeedbacksQuery } from "../../features/feedbackApi";
import {
  useGetAllRequestPicksQuery,
  useGetRequestPickByUserIdQuery,
  useGetRequestPicksByUserFeedbacksQuery,
} from "../../features/requestPicksApi";
import { useGetAllUsersQuery } from "../../features/userApi";
import { useGetActiveTemplateQuery } from "../../features/templateApi";

//components
import CustomSpinner from "../CustomSpinner/CustomSpinner";
import PicksUser from "./PicksUser";

//styles
import styles from "./DashboardUser.module.css";

//types
import { loggedInUser } from "../../types/users";


const DashboardUser: React.FC<{ currentUserInfo: loggedInUser }> = ({
  currentUserInfo,
}) => {
  const feedbackData = useGetAllFeedbacksQuery();
  const picksData = useGetAllRequestPicksQuery();
  const activeTemplateData = useGetActiveTemplateQuery();
  const feedbacksNeededData = useGetRequestPicksByUserFeedbacksQuery(
    currentUserInfo.uid
  );
  const usersData = useGetAllUsersQuery();

  if (
    activeTemplateData.isFetching ||
    feedbackData.isFetching ||
    picksData.isFetching ||
    !picksData.data ||
    feedbacksNeededData.isFetching ||
    !feedbacksNeededData.data ||
    usersData.isFetching ||
    !usersData.data
  )
    return (
      <div className="loading_container">
        <CustomSpinner />
        <p>Loading your dashboard...</p>
      </div>
    );

  if (!activeTemplateData.data)
    return <h1>No feedback action going on right now. Yay!</h1>;

  if (!picksData || !feedbackData.data)
    return (
      <h1>
        Nothing to do here yet, you will be notified when any action is needed.
      </h1>
    );

  // Feedbacks completed by current user on current template
  const userFeedbacks = feedbackData.data.filter(
    (feedback) =>
      feedback.userId === currentUserInfo.uid &&
      feedback.template === activeTemplateData.data?._id
  );

  console.log("Feedbacks given by user:", userFeedbacks);
  console.log("feedbacksNeededData.data", feedbacksNeededData.data);
  console.log('activeTemplate id', activeTemplateData.data._id);

  //  
  const feedbacksNum = feedbacksNeededData.data
    .filter((feedbackNeeded) => feedbackNeeded.submitted)
    .reduce((sum, pick) => {
      console.log(pick.SelectedList);
      return sum + pick.SelectedList.length;
    }, 0);

  const getFullName = (userId: string) => {
    const userFound = usersData.data?.find((user) => user.ldapUid === userId);
    if (!userFound) return userId;
    return userFound.firstName + " " + userFound.surname;
  };

  const getRoleTitle = (pickRoleLevel: number) => {
    let title = "";
    switch (pickRoleLevel) {
      case 7:
        title = "self";
        break;
      case 6:
        title = "subordinate";
        break;
      case 5:
        title = "colleague";
        break;
      case 4:
        title = "project manager";
        break;
      case 3:
        title = "competence manager";
        break;
      default:
        title = "colleague";
    }
    return title;
  };

  return (
    <div className={styles.user_dashboard}>
      <h1>Hi, {currentUserInfo.displayName}!</h1>
      <div className={styles.user_dashboard_block}>
        <PicksUser />
      </div>
      <div className={styles.user_dashboard_block}>
        <h2>
          Please give {feedbacksNum}{" "}
          <span className={styles.keyword}>
            feedback{feedbacksNum === 1 ? "" : "s"}
          </span>{" "}
          to{" "}
          {feedbacksNeededData.data.filter(
              (feedbackNeeded) => feedbackNeeded.submitted
            ).length
          }{" "}

          {feedbacksNeededData.data.filter(
            (feedbackNeeded) => feedbackNeeded.submitted
          ).length === 1
            ? "person"
            : "people"}
          :
        </h2>
        <p></p>
        <ul className={styles.feedbacks_needed_list}>
          {feedbacksNeededData.data
            .filter(
              (firstPick) =>
                firstPick.requestedTo === currentUserInfo.uid &&
                firstPick.submitted
            )
            .map((pick) => (
              <NavLink
                to={`/feedback?id=${pick._id}&to=${currentUserInfo.uid}&role=7`}
              >
                <li>Evaluate your own performance</li>
              </NavLink>
            ))}
          {feedbacksNeededData.data
            .filter(
              (firstPick) =>
                firstPick.requestedTo !== currentUserInfo.uid &&
                firstPick.submitted
            )
            .map((pick) =>
              pick.SelectedList.map((feedbackNeeded) => (
                <li>
                  <NavLink
                    to={`/feedback?id=${pick._id}&to=${pick.requestedTo}&role=${feedbackNeeded.roleLevel}`}
                  >
                    Give feedback to{" "}
                    <span className={styles.username}>
                      {getFullName(pick.requestedTo)}
                    </span>{" "}
                    as a{" "}
                    <span className={styles.keyword}>
                      {getRoleTitle(feedbackNeeded.roleLevel)}
                    </span>
                  </NavLink>
                </li>
              ))
            )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardUser;
