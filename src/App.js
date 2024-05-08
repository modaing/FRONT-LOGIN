import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './pages/Main';
import Insite from './pages/other/Insite';
import Layout from './layouts/layout';
import RecordCommute from './pages/commute/RecordCommute';
import RecordCorrectionOfCommute from './pages/commute/RecordCorrectionOfCommute';
import CommuteManage from './pages/commute/CommuteManage';
import CommuteCorrectionManage from './pages/commute/CommuteCorrectionManage';
import AnnounceDetail from './pages/other/announce/AnnounceDetail';
import Announces from './pages/other/announce/Announces';
import InsertAnnounce from './pages/other/announce/InsertAnnounce';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="main" element={<Main />} />

          {/* 출퇴근 */}
          <Route path='recordCommute' element={<RecordCommute />} />
          <Route path='recordCorrectionOfCommute' element={<RecordCorrectionOfCommute />} />
          <Route path='commuteManage' element={<CommuteManage />} />
          <Route path='commuteCorrectionManage' elemen={<CommuteCorrectionManage />} />

          {/* 공지사항 */}
          <Route path="announces" element={<Announces />} />
          <Route path="announces/:ancNo" element={<AnnounceDetail />} />
          <Route path="insertAnnounce" element={<InsertAnnounce />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
// 정희님이 주신 APP.JS