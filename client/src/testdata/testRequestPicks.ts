//on object creation: get CM of 'requestedTo', push CM to selectedList
//has 'role' been added?v should the object contain email? 
//selectedlist needs to show roles

import  {IRequestPicks} from '../types/picks'; 

const testRequestPicks = 
{
    _id: '456',
    requestedTo: 'ivan01',
    requestedBy: 'essi01', 
    requestedOn: new Date(),
    selectedList: [
      {
        userId: 'anna01',
        selectionStatus: true, // for HR to approve
        selectedBy: 'ivan01',
        feedBackSubmitted:true 
      },
      {
        userId: 'simon01',
        selectionStatus: true, // for HR to approve
        selectedBy: 'ivan01',
        feedBackSubmitted:true 
      },
      {
        userId: 'john01',
        selectionStatus: true, // for HR to approve
        selectedBy: 'ivan01',
        feedBackSubmitted:true 
      },
      {
        userId: 'sophie01',
        selectionStatus: true, // for HR to approve
        selectedBy: 'ivan01',
        feedBackSubmitted:true 
      },
      {
        userId: 'suvi01',
        selectionStatus: true, // for HR to approve
        selectedBy: 'ivan01',
        feedBackSubmitted:true 
      },
      {
        userId: 'mustafa01',
        selectionStatus: true, // for HR to approve
        selectedBy: 'essi01',
        feedBackSubmitted:true 
      },
      ],
      submitted: true,
    submittedOn: new Date(),
}