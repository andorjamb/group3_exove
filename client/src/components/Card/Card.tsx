import React from "react";

//Styling
import styles from "./Card.module.css";

//Types
import { IUserDataGet } from "../../types/users";

interface ICardProps {
  employee: IUserDataGet;
  clickCallback: React.MouseEventHandler<HTMLDivElement>;
  picked: boolean;
  clickable: boolean;
}

const Card: React.FC<ICardProps> = ({
  employee,
  clickCallback,
  picked,
  clickable,
}) => {
  function clickHandler(e: any) {
    if (!clickable) return;
    e.currentTarget.classList.toggle(`${styles.selected}`);
    clickCallback(e);
  }

  return (
    <div
      className={`${styles.card} ${picked ? styles.selected : ""} ${
        clickable ? styles.clickable : styles.unclickable
      }`}
      onClick={clickHandler}
    >
      <div className={styles.avatar_container}>
        {employee.imageUrl ? (
          <img className={styles.avatar} src={employee.imageUrl} alt="avatar" />
        ) : (
          <img
            className={styles.avatar}
            src="https://www.exove.com/app/uploads/2021/06/Exove-employee-no-image.png"
            alt="avatar"
          />
        )}
      </div>

      <div>
        <h3 className={styles.name}>{employee.displayName}</h3>
        <p className={styles.title}>{employee.title}</p>
      </div>
    </div>
  );
};

export default Card;
