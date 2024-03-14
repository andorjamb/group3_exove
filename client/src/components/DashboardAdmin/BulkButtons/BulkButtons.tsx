import axios from "axios";

// Components
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";

// Redux, API
import {
  useCreatePickMutation,
  useGetAllRequestPicksQuery,
} from "../../../features/requestPicksApi";
import { useGetAllUsersQuery } from "../../../features/userApi";

// Styles
import styles from "./BulkButtons.module.css";
import { IRequestPicks } from "../../../types/picks";
import { IUserDataGet } from "../../../types/users";

interface IBulkButtonsProps {
  allPicks: IRequestPicks[];
  allUsers: IUserDataGet[];
  currentTemplateId: string;
}

const BulkButtons: React.FC<IBulkButtonsProps> = ({
  allPicks,
  allUsers,
  currentTemplateId,
}) => {
  const [createPick] = useCreatePickMutation();
  const newPick1 = {
    requestedTo: "tempt",
  };

  const requestAllPicks = async () => {
    try {
      const usersWithoutRequests = [...allUsers]
        .slice(0, 3)
        .filter(
          (user) =>
            allPicks.find((pick) => pick.requestedTo === user.ldapUid) ===
            undefined
        );
      console.log("users with no request picks yet:", usersWithoutRequests);
      for (const user of usersWithoutRequests) {
        console.log("creating pick for", user.displayName);
        await createPick({
          requestedTo: user.ldapUid,
          template: currentTemplateId,
        });
      }
    } catch (err: any) {
      console.log("error requesting some picks", err.message);
    }
  };

  return (
    <div className={styles.buttons_container}>
      <Tooltip
        TransitionComponent={Fade}
        title="Request colleague picks from all users"
        placement="bottom-start"
      >
        <button onClick={requestAllPicks} className={styles.request}>
          <span className="material-symbols-outlined">send</span> Picks
        </button>
      </Tooltip>
      <Tooltip
        TransitionComponent={Fade}
        title="Remind all users to pick colleagues"
        placement="bottom-start"
      >
        <button className={styles.remind}>
          <span className="material-symbols-outlined">timer</span> Picks
        </button>
      </Tooltip>
      <Tooltip
        TransitionComponent={Fade}
        title="Approve all picsk and request feedbacks from all users"
        placement="bottom-start"
      >
        <button className={styles.approve}>
          <span className="material-symbols-outlined">done</span> Picks
        </button>
      </Tooltip>
      <Tooltip
        TransitionComponent={Fade}
        title="Remind all users to give feedbacks"
        placement="bottom-start"
      >
        <button className={styles.remind}>
          <span className="material-symbols-outlined">timer</span> Feedbacks
        </button>
      </Tooltip>
      <Tooltip
        TransitionComponent={Fade}
        title="Generate all complete reports and make them available to competence managers"
        placement="bottom-start"
      >
        <button className={styles.approve}>
          <span className="material-symbols-outlined">description</span>
        </button>
      </Tooltip>
      <Tooltip
        TransitionComponent={Fade}
        title="Generate all reports (including incomplete) and make them available to competence managers"
        placement="bottom-start"
      >
        <button className={styles.warning}>
          <span className="material-symbols-outlined">description</span>
        </button>
      </Tooltip>
    </div>
  );
};

export default BulkButtons;
