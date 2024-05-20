import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/Main';
import Announces from './pages/announce/Announces';
import InsertAnnounce from './pages/announce/InsertAnnounce';
import Insite from './pages/insite/Insite';
import Layout from './layouts/layout';
import Calendar from './pages/calendar/Calendar';
import RecordCommute from './pages/commute/RecordCommute';
import RecordCorrectionOfCommute from './pages/commute/RecordCorrectionOfCommute';
import CommuteManage from './pages/commute/CommuteManage';
import CommuteCorrectionManage from './pages/commute/CommuteCorrectionManage';
import AnnounceDetail from './pages/announce/AnnounceDetail';
import Login from './pages/member/Login';
import Error from './pages/Error';
import MyProfile from './pages/profile/MyProfile';
import ManageMember from './pages/member/ManageMember';
import RegisterMember from './pages/member/RegisterMember';
import UpdateAnnounce from './pages/announce/UpdateAnnounce';
import ReceiveNoteList from './pages/note/ReceiveNoteList';
import SendNoteList from './pages/note/SendNoteList';
import MyLeave from './pages/leave/MyLeave';
import RoomList from './pages/chatting/RoomList';
import Room from './pages/chatting/Room';
import DepartmentAndPosition from './pages/department&position/departmentAndPosition';
import ApprovalPage from './pages/approval/ApprovalPage';
import LeaveAccrual from './pages/leave/LeaveAccrual';

function App() {
  const isLoggedIn = !!window.localStorage.getItem("accessToken");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Private routes */}
        {isLoggedIn ? (
          <Route element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="main" element={<Main />} />
            <Route path='calendar' element={<Calendar />} />
            <Route path='myProfile' element={<MyProfile />} />
            <Route path="recordCommute" element={<RecordCommute />} />
            <Route path="recordCorrectionOfCommute" element={<RecordCorrectionOfCommute />} />
            <Route path="commuteManage" element={<CommuteManage />} />
            <Route path="commuteCorrectionManage" element={<CommuteCorrectionManage />} />
            <Route path="myLeave" element={<MyLeave />} />
            <Route path="leaveAccrual" element={<LeaveAccrual />} />
            <Route path="announces" element={<Announces />} />
            <Route path="announces/:ancNo" element={<AnnounceDetail />} />
            <Route path="updateAnnounces/:ancNo" element={<UpdateAnnounce />} />
            <Route path="insite" element={<Insite />} />
            <Route path="insertAnnounce" element={<InsertAnnounce />} />
            <Route path='manageMember' element={<ManageMember />} />
            <Route path='registerMember' element={<RegisterMember />} />
            <Route path='receiveNoteList' element={<ReceiveNoteList />} />
            <Route path='sendNoteList' element={<SendNoteList />} />
            <Route path="chatRoomList" element={<RoomList />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path='/departmentAndPosition' element={<DepartmentAndPosition />} />
            <Route path='approvalSendList' element={<SendApprovalList />} />
            <Route path='approvals' element={<ApprovalList />} />
            <Route path='approvals' element={<ApprovalPage />} />
          </Route>
        ) : (
          <Route path="/" element={<Navigate to="/login" replace />} />
        )}
        {/* Error route */}
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
