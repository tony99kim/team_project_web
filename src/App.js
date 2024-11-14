// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage'; // 관리자 페이지 컴포넌트 import
import CreateEvent from './pages/CreateEvent'; // 이벤트 작성 페이지 import
import EventDetail from './pages/EventDetail'; // 이벤트 상세 페이지 import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminPage />} /> {/* 관리자 페이지 경로 */}
        <Route path="/admin/event/create" element={<CreateEvent />} /> {/* 이벤트 작성 페이지 경로 */}
        <Route path="/admin/event/:id" element={<EventDetail />} /> {/* 이벤트 상세 페이지 경로 */}
      </Routes>
    </Router>
  );
};

export default App;