//on object creation: get CM of 'requestedTo', push CM to selectedList
//has 'role' been added?v should the object contain email?

export interface IRequestPicks {
  _id: string;
  template: string;
  requestedTo: string;
  requestedBy: string;
  requestedOn: Date;
  SelectedList: {
    userId: string;
    selectionStatus: boolean; // for HR to approve
    roleLevel: number;
    feedBackSubmitted: boolean;
    selectedBy: string;
    _id: string;
  }[];
  submitted: boolean;
  submittedOn: Date;
}

export interface IRequestPicksPost {
  requestedTo: string;
  template: string;
}

export interface IRequestPicksPatch {
  userId: string;
  roleLevel: number;
  selectionStatus: boolean;
}

export interface IRequestPicksApprove {
  userId: string;
  roleLevel: number;
  selectionStatus: boolean;
}
