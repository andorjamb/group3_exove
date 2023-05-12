//React
import React, { useEffect, useState } from "react";

// Redux
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

interface IUserPickBlockProps {
  doneHandler: (picksSelected: IUserDataGet[]) => void;
  editHandler: (picksSelected: IUserDataGet[]) => void;
  heading: string;
  defaultEditing: boolean;
  defaultSelection: IUserDataGet[];
}

const UserPickBlock: React.FC<IUserPickBlockProps> = ({
  doneHandler,
  editHandler,
  heading,
  defaultEditing,
  defaultSelection,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const { t } = useTranslation(["dashboardUser"]);
  const usersData = useGetAllUsersQuery();
  const [selected, setSelected] = useState<IUserDataGet[]>(defaultSelection);
  const [editing, setEditing] = useState<boolean>(defaultEditing);

  useEffect(() => {
    console.log(selected);
  }, [selected]); //debugging

  const filteredUsersData = usersData.data
    ?.filter((user) => user.userStatus)
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

  if (usersData.isFetching) return <p>{t("Loading...")}</p>;
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2>{heading}</h2>
        {!editing ? (
          <button className={styles.edit} onClick={() => setEditing(true)}>
            Edit
          </button>
        ) : (
          <button
            className={styles.done}
            onClick={() => {
              setEditing(false);
              doneHandler(selected);
            }}
          >
            Done
          </button>
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
