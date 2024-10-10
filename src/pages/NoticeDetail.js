// src/pages/NoticeDetail.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/SidebarMenu'; // 경로 수정
import '../styles/NoticeDetail.css'; // CSS 파일 import

const NoticeDetail = () => {
  const location = useLocation();
  const { title, content, imageUrl } = location.state;
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 사이드바 상태 관리

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev); // 사이드바 열림 상태 토글
  };

  return (
    <div className="notice-detail-container">
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> {/* 사이드바 추가 */}
      <div className="notice-detail">
        <h1>{title}</h1>
        <p>{content}</p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </div>
    </div>
  );
};

export default NoticeDetail;

