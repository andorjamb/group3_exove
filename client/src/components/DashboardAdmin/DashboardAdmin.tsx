// React
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

// API, redux
import { useGetAllFeedbacksQuery } from "../../features/feedbackApi";
import { useGetAllRequestPicksQuery } from "../../features/requestPicksApi";
import { useGetAllUsersQuery } from "../../features/userApi";
import { useGetActiveTemplateQuery } from "../../features/templateApi";
import { useGetAllReportsQuery } from "../../features/reportApi";

// Components
import BulkButtons from "./BulkButtons/BulkButtons";
import SearchBar from "./SearchBar/SearchBar";
import PersonRow from "./PersonRow/PersonRow";
import CustomSpinner from "../CustomSpinner/CustomSpinner";

// Types
import { IUserDataGet } from "../../types/users";
import { IFeedback } from "../../types/feedback";
import { IRequestPicks } from "../../types/picks";

// Styles
import styles from "./DashboardAdmin.module.css";

const DashboardAdmin = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const feedbackData = useGetAllFeedbacksQuery();
  const usersData = useGetAllUsersQuery();
  const picksData = useGetAllRequestPicksQuery();
  const activeTemplateData = useGetActiveTemplateQuery();
  const reportsData = useGetAllReportsQuery();
  const [showModal, setShowModal] = useState(false);

  if (
    activeTemplateData.isFetching ||
    !usersData ||
    usersData.isFetching ||
    !usersData.data ||
    feedbackData.isFetching ||
    picksData.isFetching ||
    !picksData.data ||
    reportsData.isFetching ||
    !reportsData.data
  )
    return (
      <div className="loading_container">
        <CustomSpinner />
        <p>Loading dashboard...</p>
      </div>
    );

  if (!activeTemplateData.data)
    return (
      <h2>
        No active templates. Create one <NavLink to="/template">here</NavLink>
      </h2>
    );

  const searchChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchInput(e.currentTarget.value);
  };

  let filteredUsers: IUserDataGet[];

  if (!usersData.isFetching && usersData.data)
    filteredUsers = usersData.data
      .filter((user) => user.userStatus)
      .filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
          user.surname.toLowerCase().includes(searchInput.toLowerCase()) ||
          user.displayName.toLowerCase().includes(searchInput.toLowerCase())
      );

  if (!usersData.data)
    return (
      <div className="loading_container">
        <CustomSpinner />
        <p>Loading...</p>
      </div>
    );
  console.log("ALL REPORTS", reportsData.data);
  return (
    <div className={styles.dashboard_wrapper}>
      <div className={styles.dashboard_container}>
        <h1>
          {activeTemplateData.data
            ? activeTemplateData.data.templateTitle
            : "No active template"}
        </h1>
        <div className={styles.search_buttons_container}>
          <SearchBar
            inputValue={searchInput}
            onChangeHandler={searchChangeHandler}
          />
          <BulkButtons
            allPicks={picksData.data}
            allUsers={usersData.data}
            currentTemplateId={activeTemplateData.data._id}
          />
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee name</th>
              <th>Self</th>
              <th>Coll.</th>
              <th>Sub.</th>
              <th>PM</th>
              <th>CM</th>
              <th>Picks</th>
              <th>Feedbacks</th>
              <th>Report</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers!.map((currUser) => {
              return (
                <PersonRow
                  key={currUser._id}
                  currentTemplateId={activeTemplateData.data!._id}
                  user={currUser}
                  userPicks={picksData.data!.find(
                    (pick: IRequestPicks) =>
                      pick.requestedTo === currUser.ldapUid &&
                      pick.template === activeTemplateData.data?._id
                  )}
                  userFeedbacks={feedbackData.data!.filter(
                    (feedback: IFeedback) =>
                      feedback.feedbackTo === currUser.ldapUid &&
                      feedback.template === activeTemplateData.data?._id
                  )}
                  userReport={reportsData.data?.find(
                    (report) =>
                      report.userId === currUser.ldapUid &&
                      report.template === activeTemplateData.data?._id
                  )}
                  allUsersData={usersData.data ? usersData.data : []}
                  /* showEditPicks={() => setShowModal(true)} */
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdmin;
