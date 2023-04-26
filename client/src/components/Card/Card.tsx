import React from "react";

//Styling
import styles from "./Card.module.css";

//Types
import { IUserData } from "../../types/users";
interface Props {
  employee: IUserData;
  clickHandler: React.MouseEventHandler<HTMLDivElement>;
}

const Card = ({ employee, clickHandler }: Props) => {
  return (
    <div className={styles.card} onClick={clickHandler}>
      <img className={styles.avatar} src={employee.about.avatar} alt="avatar" />
      <div>
        <h3 className={styles.h3}>{employee.displayName}</h3>
        <h5 className={styles.h5}>{employee.work.title}</h5>
      </div>
    </div>
  );
};

export default Card;