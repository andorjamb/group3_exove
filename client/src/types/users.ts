interface IUserRolesGet {
  _id: string;
  roleName: string;
  roleLevel: number;
  roleStatus: boolean;
  createBy: string;
  users: string[];
  createdOn: Date;
}

export interface IUserDataGet {
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
}

//////////////

/** this is a model of the JSON object used by Exove, not mongodb schema */
/* 
export interface IUserData {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  displayName: string;
  personal: {
    honorific: string;
    shortBirthDate: string;
    gender: string;
  };
  about: {
    avatar: string;
    hobbies: string[];
  };
  work: {
    reportsTo: {
      id: string;
      firstName: string;
      surname: string;
      email: string;
    };
    title: string;
    department: string;
    site: string;
    startDate: string;
  };
}
 */
export interface loggedInUser {
  uid: string,
  roleLevel: number,
  displayName: string,
  imageUrl: string
}