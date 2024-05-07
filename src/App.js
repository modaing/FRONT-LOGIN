import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './pages/Main';
import Announces from './pages/other/announce/Announces';
import InsertAnnounce from './pages/other/announce/InsertAnnounce';
import Insite from './pages/other/Insite';
import Layout from './layouts/layout';
import AnnounceDetail from './pages/other/announce/AnnounceDetail';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="main" element={<Main />} />
          <Route path="announces" element={<Announces />} />
          <Route path="announces/:ancNo" element={<AnnounceDetail />} />
          <Route path="insite" element={<Insite />} />
          <Route path="insertAnnounce" element={<InsertAnnounce />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
