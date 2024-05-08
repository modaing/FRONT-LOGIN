import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Main from './pages/Main';
import Announces from './pages/other/announce/Announces';
import InsertAnnounce from './pages/other/announce/InsertAnnounce';
import Insite from './pages/other/Insite';
import Layout from './layouts/layout';
import Calendar from './pages/calendar/Calendar';
import RecordCommute from './pages/commute/RecordCommute';
import RecordCorrectionOfCommute from './pages/commute/RecordCorrectionOfCommute';
import CommuteManage from './pages/commute/CommuteManage';
import CommuteCorrectionManage from './pages/commute/CommuteCorrectionManage';
import AnnounceDetail from './pages/other/announce/AnnounceDetail';
import Login from './pages/member/Login';
import Error from './pages/Error';

function App() {
  const isLoggedIn = !!window.localStorage.getItem("accessToken");

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to main page if logged in */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/main" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Authenticated routes */}
        {isLoggedIn && (
          <Route element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="main" element={<Main />} />
            <Route path='calendar' element={<Calendar/>}/>
            <Route path="recordCommute" element={<RecordCommute />} />
            <Route path="recordCorrectionOfCommute" element={<RecordCorrectionOfCommute />} />
            <Route path="commuteManage" element={<CommuteManage />} />
            <Route path="commuteCorrectionManage" element={<CommuteCorrectionManage />} />
            <Route path="announces" element={<Announces />} />
            <Route path="announces/:ancNo" element={<AnnounceDetail />} />
            <Route path="insite" element={<Insite />} />
            <Route path="insertAnnounce" element={<InsertAnnounce />} />
          </Route>
        )}
        {/* Login route */}
        <Route path="/login" element={<Login />} />
        {/* Error route */}
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;