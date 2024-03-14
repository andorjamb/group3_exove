//React
import React, { useEffect, useState } from "react";

//Redux
import { useSelector } from "react-redux";

//Pages and Components
import Card from "../Card/Card";
import SearchBar from "../DashboardAdmin/SearchBar/SearchBar";

//Styling
import styles from "./UserPickBlock.module.css";

//Translations
import "../../translations/i18next";
import { useTranslation } from "react-i18next";

//Types
import { IUserDataGet } from "../../types/users";

//Testing data
import { useGetAllUsersQuery } from "../../features/userApi";
import ButtonFancy from "../UI/ButtonFancy/ButtonFancy";

interface IUserPickBlockProps {
  users: IUserDataGet[];
  doneHandler: (picksSelected: IUserDataGet[]) => void;
  editHandler: (picksSelected: IUserDataGet[]) => void;
  heading: string;
  defaultEditing: boolean;
  defaultSelection: IUserDataGet[];
}

const UserPickBlock: React.FC<IUserPickBlockProps> = ({
  users,
  doneHandler,
  editHandler,
  heading,
  defaultEditing,
  defaultSelection,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const { t } = useTranslation(["dashboardUser"]);
  const [selected, setSelected] = useState<IUserDataGet[]>(defaultSelection);
  const [editing, setEditing] = useState<boolean>(defaultEditing);

  useEffect(() => {
    console.log(selected);
  }, [selected]); //debugging

  const filteredUsersData = users
    .filter((user) => user.userStatus)
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.surname.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchInput.toLowerCase())
    );

  const clickHandler = (
    e: React.MouseEvent<HTMLDivElement>,
    clickedUser: IUserDataGet
  ) => {
    let newSelected;
    if (selected.find((user) => user.ldapUid === clickedUser.ldapUid)) {
      newSelected = selected.filter(
        (item) => item.ldapUid !== clickedUser.ldapUid
      );
    } else newSelected = [...selected, clickedUser];
    setSelected(newSelected);
    editHandler(newSelected);
  };

  const searchChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchInput(e.currentTarget.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2>{heading}</h2>
        {!editing ? (
          <ButtonFancy
            type="button"
            color="medGray"
            children="Edit"
            disabled={false}
            clickHandler={() => setEditing(true)}
          ></ButtonFancy>
        ) : (
          <ButtonFancy
            type="button"
            color="purple"
            children="Done"
            disabled={false}
            clickHandler={() => {
              setEditing(false);
              doneHandler(selected);
            }}
          ></ButtonFancy>
        )}
      </div>

      {editing ? (
        <>
          <div className={styles.search_container}>
            <SearchBar
              onChangeHandler={searchChangeHandler}
              inputValue={searchInput}
            />
          </div>
          <div className={styles.selectionGrid}>
            {selected.map((item) => (
              <Card
                key={item._id}
                employee={item}
                clickCallback={(e: any) => {
                  clickHandler(e, item);
                }}
                picked={
                  selected.find((user) => user.ldapUid === item.ldapUid) !==
                  undefined
                }
                clickable={editing}
              />
            ))}
            {filteredUsersData!
              .filter(
                (user) =>
                  selected.find(
                    (selectedUser) => selectedUser.ldapUid === user.ldapUid
                  ) === undefined
              )
              .map((item) => (
                <Card
                  key={item._id}
                  employee={item}
                  clickCallback={(e: any) => clickHandler(e, item)}
                  picked={
                    selected.find((user) => user.ldapUid === item.ldapUid) !==
                    undefined
                  }
                  clickable={editing}
                />
              ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.selectionGrid}>
            {selected.map((item) => (
              <Card
                key={item._id}
                employee={item}
                clickCallback={() => {}}
                picked={
                  selected.find((user) => user.ldapUid === item.ldapUid) !==
                  undefined
                }
                clickable={editing}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserPickBlock;
