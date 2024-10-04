// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage'; // 관리자 페이지 컴포넌트 import
import Notice from './pages/Notice'; // 공지사항 페이지 import
import CreateNotice from './pages/CreateNotice'; // 공지사항 작성 페이지 import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminPage />} /> {/* 관리자 페이지 경로 */}
        <Route path="/notices" element={<Notice />} /> {/* 공지사항 페이지 경로 */}
        <Route path="/notices/create" element={<CreateNotice />} /> {/* 공지사항 작성 페이지 경로 */}
      </Routes>
    </Router>
  );
};

export default App;
