// src/AdminPage.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles/AdminPage.css';
import EnvironmentCertification from './EnvironmentCertification';
import Notice from './Notice';
import CustomerService from './CustomerService';
import Member from './Member';
import CertificationDetail from './CertificationDetail'; // CertificationDetail 컴포넌트 import
import Menu from '../components/SidebarMenu'; // Menu 컴포넌트 import

const AdminPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="admin-page">
      <Menu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> {/* Menu 컴포넌트 사용 */}
      <div className="content">
        <Routes>
          <Route path="environment-certification" element={<EnvironmentCertification />} />
          <Route path="notice" element={<Notice />} />
          <Route path="customer-service" element={<CustomerService />} />
          <Route path="member" element={<Member />} />
          <Route path="certification/:id" element={<CertificationDetail />} /> {/* 추가된 라우트 */}
          <Route path="/" element={<h1>관리자 페이지</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
