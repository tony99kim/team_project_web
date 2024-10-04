// src/components/SidebarMenu.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SidebarMenu.css'; // 스타일 파일 경로 확인

const Sidebar = ({ isMenuOpen, toggleMenu }) => {
  return (
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
  );
};

export default Sidebar;
