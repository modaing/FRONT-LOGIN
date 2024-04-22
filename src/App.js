import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Announces from './pages/Announces';
import Main from './pages/Main';
import Insite from './pages/Insite';
import Layout from './layouts/layout';
import InsertAnnounce from './pages/InsertAnnounce';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="main" element={<Main />} />
        <Route path="Announces" element={<Announces />} />
        <Route path="insite" element={<Insite />} />
        <Route path="insertAnnounce" element={<InsertAnnounce />} />
      </Route>
    </Routes>
  </BrowserRouter>
    
  );
}

export default App;
