// src/AdminPage.js
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './AdminPage.css';
import EnvironmentCertification from './EnvironmentCertification';
import Notice from './Notice';
import CustomerService from './CustomerService';
import Member from './Member';

const AdminPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="admin-page">
      <div className={`sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className="menu-header" onClick={toggleMenu}>
          <span>{isMenuOpen ? '◀' : '▶'} 메뉴</span>
        </div>
        {isMenuOpen && (
          <ul className="menu-list">
            <li><Link to="/admin/environment-certification">환경 인증</Link></li>
            <li><Link to="/admin/notice">공지사항</Link></li>
            <li><Link to="/admin/customer-service">고객센터</Link></li>
            <li><Link to="/admin/member">회원</Link></li>
          </ul>
        )}
      </div>
      <div className="content">
        <Routes>
          <Route path="environment-certification" element={<EnvironmentCertification />} />
          <Route path="notice" element={<Notice />} />
          <Route path="customer-service" element={<CustomerService />} />
          <Route path="member" element={<Member />} />
          <Route path="/" element={<h1>관리자 페이지</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;