import { IUserDataGet } from "../types/users";

//LDAP USERS
/* boyle
curie
einstein
euclid
euler
galieleo
gauss
jmacy
newton
nobel
pasteur
rieman
tesla */

/* interface IUserRolesGet {
  _id: string;
  roleName: string;
  roleLevel: number;
  roleStatus: boolean;
  createBy: string;
  users: string[];
  createdOn: Date;
} */

/* export interface IUserDataGet {
  _id: string;
  firstName: string;
  surname: string;
  ldapUid: string;
  email: string;
  displayName: string;
  rolesId: IUserRolesGet;
  workId: {
    _id: string;
    reportsTo: string;
    workReportStatus: boolean;
  }[];
  title: string;
  phone: string;
  imageUrl: string;
  userStatus: boolean;
} */

export const testEmployeeData: IUserDataGet[] = [
  {
    _id: "jesse01",
    firstName: "Jesse",
    surname: "Mwangi",
    ldapUid: "",
    email: "jesse@fakemail.com",
    displayName: "Jesse Mwangi",
    rolesId: {
      _id: "",
      roleName: "",
      roleLevel: 3,
      roleStatus: true,
      createBy: "HR",
      users: [],
      createdOn: new Date(),
    },
    workId: [{ _id: "", reportsTo: "", workReportStatus: false }],
    title: "Manager",
    phone: "",
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
    userStatus: true,
  },
];
