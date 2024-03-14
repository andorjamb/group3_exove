// React
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { sendNotification } from "../../../functions/notification";
// Axios
import axios from "axios";

// Redux
import {
  useApprovePickMutation,
  useCreatePickMutation,
  useDeletePickMutation,
  useFinalPickSubmitMutation,
  useGetAllRequestPicksQuery,
  useSubmitPickMutation,
} from "../../../features/requestPicksApi";
import { useGetAllUsersQuery } from "../../../features/userApi";

// Components
import UserPickBlock from "../../DashboardUser/UserPickBlock";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";

// Types
import { IRequestPicks, IRequestPicksPost } from "../../../types/picks";
import { IFeedback } from "../../../types/feedback";
import { IUserDataGet } from "../../../types/users";
import { functionData } from "../../../types/notification";

import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

// Styles
import styles from "./PersonRow.module.css";
import { usePostReportMutation } from "../../../features/reportApi";
import { IReport } from "../../../types/report";
import { NavLink, useNavigate } from "react-router-dom";

/* interface ICreatePickData {
  data: string;
}

interface ICreatePickErr {
  error: FetchBaseQueryError | SerializedError;
}
interface ICreatePickResponse {
  res: ICreatePickData | ICreatePickErr;
} */

interface IPersonRowProps {
  userPicks: IRequestPicks | undefined;
  user: IUserDataGet;
  userFeedbacks: IFeedback[];
  allUsersData: IUserDataGet[];
  currentTemplateId: string;
  userReport: IReport | undefined;
  /* showEditPicks: () => void; */
}

const PersonRow: React.FC<IPersonRowProps> = ({
  user,
  userPicks,
  userFeedbacks,
  allUsersData,
  currentTemplateId,
  userReport,
  /* showEditPicks, */
}) => {
  const navigate = useNavigate();
  const [expand, setExpand] = useState(false);
  const [createPick] = useCreatePickMutation();
  const [submitPick] = useSubmitPickMutation();
  const [approvePick] = useApprovePickMutation();
  const [finalPickSubmit] = useFinalPickSubmitMutation();
  const [deletePick] = useDeletePickMutation();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postReport] = usePostReportMutation();

  console.log("user feedbacks for", user.displayName, userFeedbacks);

  const sendPicksEmail = async (pickId: string) => {
    const details: functionData = {
      link: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQScA7p2q5GDil58X2C_xhJ9BrsRAR2YFt1O9MqAbJxPEr8hYi7",
      emailTo: user.email,
      from_name: "Exove HR Office",
      messageBody: `Hi, ${user.displayName}! Please log in at http://localhost:3000/ and select a list of minimum 5 individuals who will access you`,
      applicationid: pickId,
      entityname: "RequestPicks",
      subject: "Submit Reviewee",
      reply_to: "lera.vagapova@gmail.com",
    };
    const sendemail = await sendNotification(details);
    console.log("sendemail ****************", sendemail);
    toast.success("Email sent successfully", {
      className: "toast-message",
    });
  };

  const requestPicks = async () => {
    setIsLoading(true);
    const newPick = {
      requestedTo: user.ldapUid,
      template: currentTemplateId,
    };
    console.log("creating new pick", newPick);
    try {
      const res = await createPick(newPick as IRequestPicksPost);
      console.log("CREATE PICK RES", res);
      /* await sendPicksEmail(res.data); */
    } catch (err: any) {
      console.log(err.message);
    }
    setIsLoading(false);
  };

  const remindToPick = async () => {
    setIsLoading(true);
    console.log("reminding about picks");
    setIsLoading(false);
  };

  const approvePicks = async () => {
    if (!userPicks) return;
    console.log("approving the following pick object", userPicks);
    setIsLoading(true);
    await finalPickSubmit(userPicks._id);
    setIsLoading(false);
  };

  const toggleExpand = () => {
    setExpand((prevExpand) => !prevExpand);
  };

  const showEditPicksHandler = () => {
    setShowModal(true);
  };

  const getDotColour = (userId: string, pickRoleLevel: number) => {
    let colour = "black";

    console.log(userId, "DOT");
    console.log("userFeedbacks", userFeedbacks);
    console.log("userPicks", userPicks);
    console.log("pickRoleLevel", pickRoleLevel);

    if (userPicks && userPicks.submitted) {
      const feedbackFound = userFeedbacks.find(
        (feedback) =>
          feedback.requestpicksId === userPicks._id &&
          feedback.userId === userId &&
          feedback.roleLevel === pickRoleLevel
      );
      if (feedbackFound) colour = "green";
      else colour = "red";
    }
    return colour;
  };

  const getCountColour = (pickRoleLevel: number): string => {
    let colour = "numberBlack";
    if (userPicks && userPicks.submitted) {
      const feedbacksGiven = userFeedbacks.filter(
        (userFeedback) =>
          userFeedback.roleLevel === pickRoleLevel &&
          userFeedback.feedbackTo === user.ldapUid
      );
      const feedbacksNeeded = userPicks.SelectedList.filter(
        (pick) => pick.roleLevel === pickRoleLevel && pick.selectionStatus
      );
      console.log("feedbacksGiven", feedbacksGiven);
      console.log("feedbacksNeeded", feedbacksNeeded);
      if (feedbacksGiven.length < feedbacksNeeded.length) colour = "numberRed";
      else colour = "numberGreen";
    }
    return colour;
  };

  // Returns an array of picked users with given level
  const getUserArrayByRoleLevel = (level: number) => {
    if (!userPicks) return [];
    let res: IUserDataGet[] = [];
    const filteredPicks = userPicks.SelectedList.filter(
      (pick) =>
        pick.roleLevel === level &&
        pick.userId !== user.ldapUid &&
        pick.selectionStatus
    );
   
    //hack for ldap server typos in ldapuid
    filteredPicks.forEach((pick) => {
      console.log("pick.userId and role", pick.roleLevel, pick.userId); //debugging

      let userFound = allUsersData.find((userData) => {
        return userData.ldapUid === pick.userId;
      });
      if (pick.userId === "galileo")
        userFound = allUsersData.find((userData) => {
          console.log("userData", userData);
          return userData.ldapUid === "galieleo";
        });
      if (pick.userId === "eintein")
        userFound = allUsersData.find((userData) => {
          console.log("userData", userData);
          return userData.ldapUid === "einstein";
        });
      console.log("user found", userFound);
      if (userFound) res.push(userFound);
    });
    console.log("res", level, res);
    return res;
  };


/* 
  //TODO: consider refactoring these two functions to one, with third boolean parameter
  // Deletes/deactivates a pick
  const deactivatePick = async (userId: string, pickRoleLevel: number) => {
    if (!userPicks) return;
    const pickFound = userPicks.SelectedList.find(
      (pick) => pick.userId === userId && pick.roleLevel === pickRoleLevel
    );

    if (!pickFound || !pickFound.selectionStatus) return;
    const requestBody = {
      userId: userId,
      selectionStatus: false,
      roleLevel: pickRoleLevel,
    };
    // approvePick
    await approvePick({ body: requestBody, id: userPicks._id });
  }; */
  

  //unified function to replace separate functions 'activatePick' and 'deactivatePick'
const changePick = async (userId: string, pickRoleLevel: number, status:boolean) => {
  if (!userPicks) return;
  const pickFound = userPicks.SelectedList.find(
    (pick) => pick.userId === userId && pick.roleLevel === pickRoleLevel
  );
//case approving an already confirmed pick
  if (pickFound) {
    if (status && pickFound.selectionStatus) return;
//case confirming or rejecting found pick
    else {
      const requestBody = {
        userId: userId,
        selectionStatus: status,
        roleLevel: pickRoleLevel,
      };
      setIsLoading(true);
      await approvePick({ body: requestBody, id: userPicks._id });
      setIsLoading(false);
    }

    } 
    // case pick not found, need to create new pick
    else {
      const requestBody = {
        userId: userId,
        selectionStatus: true,
        roleLevel: pickRoleLevel,
        
      };
      setIsLoading(true);
      await submitPick({ body: requestBody, id: userPicks._id });
      setIsLoading(false);
    }

  }


  
/*   // Adds/activates a pick
  const activatePick = async (userId: string, pickRoleLevel: number) => {
    if (!userPicks) return;
    const pickFound = userPicks.SelectedList.find(
      (pick) => pick.userId === userId && pick.roleLevel === pickRoleLevel
    );
    if (pickFound) {
      if (pickFound.selectionStatus) return;
      else {
        const requestBody = {
          userId: userId,
          selectionStatus: true,
          roleLevel: pickRoleLevel,
        };
        setIsLoading(true);
        await approvePick({ body: requestBody, id: userPicks._id });
        setIsLoading(false);
      }
    } else {
      const requestBody = {
        userId: userId,
        selectionStatus: true,
        roleLevel: pickRoleLevel,
        
      };
      setIsLoading(true);
      await submitPick({ body: requestBody, id: userPicks._id });
      setIsLoading(false);
    }
  };
 */
  // Updates picks according to new selection
  const updateColleaguePicks = async (newSelection: IUserDataGet[]) => {
    await updatePicksByRoleLevel(newSelection, 5);
  };

  const updateSubordinatePicks = async (newSelection: IUserDataGet[]) => {
    await updatePicksByRoleLevel(newSelection, 6);
  };

  const updatePMPicks = async (newSelection: IUserDataGet[]) => {
    await updatePicksByRoleLevel(newSelection, 4);
  };

  const updateCMPicks = async (newSelection: IUserDataGet[]) => {
    await updatePicksByRoleLevel(newSelection, 3);
  };

  const updatePicksByRoleLevel = async (
    newSelection: IUserDataGet[],
    pickRoleLevel: number
  ) => {
    console.log("new Selection", newSelection);
    if (!userPicks) return;
    // Filter picks to only have active pick of needed level
    const levelPicks = userPicks.SelectedList.filter(
      (pick) =>
        pick.roleLevel === pickRoleLevel &&
        pick.selectionStatus &&
        pick.userId !== user.ldapUid
    );
    const deletedPicks = levelPicks.filter(
      (pick) =>
        newSelection.find((user) => user.ldapUid === pick.userId) === undefined
    );
    const addedPicks = newSelection.filter(
      (pick) =>
        levelPicks.find((user) => user.userId === pick.ldapUid) === undefined
    );
    console.log("deletedPicks", deletedPicks);
    console.log("addedPicks", addedPicks);
    if (deletedPicks.length === 0 && addedPicks.length === 0) return;
    setIsLoading(true);
    for (const pick of deletedPicks) {
      await changePick(pick.userId, pickRoleLevel, false); //status:false (formerly deactivePick)
    }
    for (const pick of addedPicks) {
      await changePick(pick.ldapUid, pickRoleLevel, true); //status: true (formerly activePick)
    }
    setIsLoading(false);
  };

  const getFullName = (userId: string) => {
    const userFound = allUsersData.find((user) => user.ldapUid === userId);
    if (!userFound) return userId;
    return userFound.firstName + " " + userFound.surname;
  };

  // creates new report doc in database
  const generateReport = async () => {
    if (!userPicks || !userFeedbacks || !currentTemplateId) return;
    setIsLoading(true);
    const body = {
      feedbacks: userFeedbacks.map((feedback) => feedback._id),
      template: currentTemplateId,
      userId: user.ldapUid,
      requestPicks: userPicks._id,
    };
    console.log("body", body);
    await postReport({ body: body });
    setIsLoading(false);
  };


  if (isLoading)
    return (
      <tr className={styles.row_loading}>
        <td>Row is updating.....</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );

  return (
    <>
      <tr className={styles.table_row}>
        <td className={styles.first_cell} onClick={toggleExpand}>
          <div>
            {expand ? (
              <span className="material-symbols-outlined">expand_more</span>
            ) : (
              <span className="material-symbols-outlined">chevron_right</span>
            )}
            {user.firstName} {user.surname}
          </div>
        </td>
              {/* SELF FEEDBACK COLUMN */}
        <td className={styles[getCountColour(7)]} onClick={toggleExpand}>
        {userPicks && userPicks.submitted && (
            <>
              {
                userFeedbacks.filter(
                  (userFeedback) =>
                    userFeedback.roleLevel === 5 &&
                    userFeedback.userId === user.ldapUid &&
                    userFeedback.requestpicksId === userPicks._id
                ).length
              }
              /
            </>
          )}   {userPicks &&
            userPicks.SelectedList &&
            userPicks.SelectedList.filter(
              (pick) =>
                pick.roleLevel === 5 &&
                pick.userId === user.ldapUid &&
                pick.selectionStatus
            ).length}
        </td>
        {/* COLLEAGUES FEEDBACK COLUMN */}
        <td className={styles[getCountColour(5)]} onClick={toggleExpand}>
          {userPicks && userPicks.submitted && (
            <>
              {
                userFeedbacks.filter(
                  (userFeedback) =>
                    userFeedback.roleLevel === 5 &&
                    userFeedback.feedbackTo === user.ldapUid &&
                    userFeedback.requestpicksId === userPicks._id
                ).length
              }
              /
            </>
          )}
          {userPicks &&
            userPicks.SelectedList &&
            userPicks.SelectedList.filter(
              (pick) =>
                pick.roleLevel === 5 &&
                pick.userId !== user.ldapUid &&
                pick.selectionStatus
            ).length}
        </td>
               {/* SUBORDINATES FEEDBACK COLUMN */}
        <td className={styles[getCountColour(6)]} onClick={toggleExpand}>
          {userPicks && userPicks.submitted && (
            <>
              {
                userFeedbacks.filter(
                  (userFeedback) =>
                    userFeedback.roleLevel === 6 &&
                    userFeedback.feedbackTo === user.ldapUid &&
                    userFeedback.requestpicksId === userPicks._id
                ).length
              }
              /
            </>
          )}
          {userPicks &&
            userPicks.SelectedList &&
            userPicks.SelectedList.filter(
              (pick) => pick.roleLevel === 6 && pick.selectionStatus
            ).length}
        </td>
          {/* PM FEEDBACK COLUMN */}
        <td className={styles[getCountColour(4)]} onClick={toggleExpand}>
          {userPicks && userPicks.submitted && (
            <>
              {
                userFeedbacks.filter(
                  (userFeedback) =>
                    userFeedback.roleLevel === 4 &&
                    userFeedback.feedbackTo === user.ldapUid &&
                    userFeedback.requestpicksId === userPicks._id
                ).length
              }
              /
            </>
          )}
          {userPicks &&
            userPicks.SelectedList &&
            userPicks.SelectedList.filter(
              (pick) => pick.roleLevel === 4 && pick.selectionStatus
            ).length}
        </td>
          {/* CM FEEDBACK COLUMN */}
        <td className={styles[getCountColour(3)]} onClick={toggleExpand}>
          {userPicks && userPicks.submitted && (
            <>
              {
                userFeedbacks.filter(
                  (userFeedback) =>
                    userFeedback.roleLevel === 3 &&
                    userFeedback.feedbackTo === user.ldapUid &&
                    userFeedback.requestpicksId === userPicks._id
                ).length
              }
              /
            </>
          )}
          {userPicks &&
            userPicks.SelectedList &&
            userPicks.SelectedList.filter(
              (pick) => pick.roleLevel === 3 && pick.selectionStatus
            ).length}
        </td>
        <td onClick={toggleExpand}>
          {!userPicks?.submitted && (
            <div className={styles.buttons_container}>
              {/* There is no picks yet */}
              {!userPicks && (
                <Tooltip
                  TransitionComponent={Fade}
                  title={`Request colleague picks from ${user.displayName}`}
                  placement="bottom-start"
                >
                  <button className={styles.request} onClick={requestPicks}>
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </Tooltip>
              )}
              {/* If picks have been requested but not approved yet, display edit button */}
              {userPicks && !userPicks.submitted && (
                <Tooltip
                  TransitionComponent={Fade}
                  title={`Edit picks for ${user.displayName}`}
                  placement="bottom-start"
                >
                  <button
                    onClick={showEditPicksHandler}
                    className={styles.edit}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </Tooltip>
              )}
              {/* If fewer than 5 collagues are picked, display remind button */}
              {userPicks &&
                userPicks.SelectedList &&
                userPicks.SelectedList.filter(
                  (pick) => pick.roleLevel === 5 && pick.userId !== user.ldapUid
                ).length < 5 && (
                  <Tooltip
                    TransitionComponent={Fade}
                    title={`Remind ${user.displayName} to pick colleagues`}
                    placement="bottom-start"
                  >
                    <button className={styles.remind} onClick={remindToPick}>
                      <span className="material-symbols-outlined">timer</span>
                    </button>
                  </Tooltip>
                )}
              {/* If enough collagues picked, display approve option */}
              {userPicks && userPicks.SelectedList && !userPicks.submitted && (
                <Tooltip
                  TransitionComponent={Fade}
                  title={`Approve ${user.displayName}'s picks`}
                  placement="bottom-start"
                >
                  <button className={styles.approve} onClick={approvePicks}>
                    <span className="material-symbols-outlined">done</span>
                  </button>
                </Tooltip>
              )}
              {userPicks && userPicks.submitted && <p>Picks finalised</p>}
            </div>
          )}
        </td>
        <td>
          <div className={styles.buttons_container}>
            {/*             {userPicks?.submitted && !userFeedbacks && (
              <Tooltip
                TransitionComponent={Fade}
                title={`Request feedbacks for ${user.displayName}`}
                placement="bottom-start"
              >
                <button className={styles.request}>
                  <span className="material-symbols-outlined">send</span>
                </button>
              </Tooltip>
            )} */}
            {userPicks &&
              userPicks?.submitted &&
              !userReport &&
              userPicks?.SelectedList.filter((pick) => pick.selectionStatus)
                .length > userFeedbacks.length && (
                <Tooltip
                  TransitionComponent={Fade}
                  title={`Remind everyone to feedback ${user.displayName}`}
                  placement="bottom-start"
                >
                  <button className={styles.remind}>
                    <span className="material-symbols-outlined">timer</span>
                  </button>
                </Tooltip>
              )}
          </div>
        </td>
        <td>
          <div className={styles.buttons_container}>
            {userFeedbacks.length > 0 && !userReport && (
              <Tooltip
                TransitionComponent={Fade}
                title={`Finalise ${user.displayName}'s feedback process`}
                placement="bottom-start"
              >
                <button onClick={generateReport} className={styles.request}>
                  <span className="material-symbols-outlined">description</span>
                </button>
              </Tooltip>
            )}
            {userReport && userPicks && (
              <>
                <Tooltip
                  TransitionComponent={Fade}
                  title={`View ${user.displayName}'s report`}
                  placement="bottom-start"
                >
                  <NavLink to={`/report/${user.ldapUid}`}>
                    <button className={styles.edit}>
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                  </NavLink>
                </Tooltip>
                <Tooltip
                  TransitionComponent={Fade}
                  title={`Make ${user.displayName}'s report available to CM`}
                  placement="bottom-start"
                >
                  <button className={styles.approve}>
                    <span className="material-symbols-outlined">
                      supervisor_account
                    </span>
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        </td>
      </tr>
      {expand &&
        userPicks &&
        userPicks.SelectedList &&
        userPicks.SelectedList.filter(
          (pick) =>
            pick.roleLevel === 5 &&
            pick.userId !== user.ldapUid &&
            pick.selectionStatus
        ).map((pick) => (
          <tr key={pick._id} className={styles.table_row_sub}>
            <td>{getFullName(pick.userId)}</td>
            <td>
              <div className={styles.dot_container}>
                <div
                  className={`${styles.dot} ${
                    styles[getDotColour(pick.userId, 5)]
                  }`}
                ></div>
              </div>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        ))}
      {expand &&
        userPicks &&
        userPicks.SelectedList &&
        userPicks.SelectedList.filter(
          (pick) => pick.roleLevel === 6 && pick.selectionStatus
        ).map((pick) => (
          <tr key={pick._id} className={styles.table_row_sub}>
            <td>{getFullName(pick.userId)}</td>
            <td></td>
            <td>
              <div className={styles.dot_container}>
                <div
                  className={`${styles.dot} ${
                    styles[getDotColour(pick.userId, 6)]
                  }`}
                ></div>
              </div>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        ))}

      {expand &&
        userPicks &&
        userPicks.SelectedList &&
        userPicks.SelectedList.filter(
          (pick) => pick.roleLevel === 4 && pick.selectionStatus
        ).map((pick) => (
          <tr key={pick._id} className={styles.table_row_sub}>
            <td>{getFullName(pick.userId)}</td>
            <td></td>
            <td></td>
            <td>
              <div className={styles.dot_container}>
                <div
                  className={`${styles.dot} ${
                    styles[getDotColour(pick.userId, 4)]
                  }`}
                ></div>
              </div>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        ))}

      {expand &&
        userPicks &&
        userPicks.SelectedList &&
        userPicks.SelectedList.filter(
          (pick) => pick.roleLevel === 3 && pick.selectionStatus
        ).map((pick) => (
          <tr key={pick._id} className={styles.table_row_sub}>
            <td>{getFullName(pick.userId)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <div className={styles.dot_container}>
                <div
                  className={`${styles.dot} ${
                    styles[getDotColour(pick.userId, 3)]
                  }`}
                ></div>
              </div>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        ))}

      {showModal && (
        <div className={styles.modal_container}>
          <div className={styles.modal}>
            <button
              className={styles.close_modal_button}
              onClick={() => setShowModal(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h1>Edit picks for {user.displayName}</h1>
            <UserPickBlock
              users={allUsersData.filter(
                (pick) => pick.ldapUid !== user.ldapUid
              )}
              editHandler={() => {}}
              doneHandler={updateColleaguePicks}
              heading="Colleagues"
              defaultEditing={false}
              defaultSelection={getUserArrayByRoleLevel(5)}
            />
            <UserPickBlock
              users={allUsersData.filter(
                (pick) => pick.ldapUid !== user.ldapUid
              )}
              editHandler={() => {}}
              doneHandler={updateSubordinatePicks}
              heading="Subordinates"
              defaultEditing={false}
              defaultSelection={getUserArrayByRoleLevel(6)}
            />
            <UserPickBlock
              users={allUsersData.filter(
                (pick) => pick.ldapUid !== user.ldapUid
              )}
              editHandler={() => {}}
              doneHandler={updatePMPicks}
              heading="PM"
              defaultEditing={false}
              defaultSelection={getUserArrayByRoleLevel(4)}
            />
            <UserPickBlock
              users={allUsersData.filter(
                (pick) => pick.ldapUid !== user.ldapUid
              )}
              editHandler={() => {}}
              doneHandler={updateCMPicks}
              heading="CM"
              defaultEditing={false}
              defaultSelection={getUserArrayByRoleLevel(3)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PersonRow;
