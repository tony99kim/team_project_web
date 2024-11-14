// src/pages/EventDetail.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Menu from '../components/SidebarMenu'; // SidebarMenu 컴포넌트 import
import '../styles/EventDetail.css'; // CSS 파일 import

const EventDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, content, imageUrl, createdAt } = location.state;
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBackToList = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <div className="event-detail-page">
      <Menu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> {/* Menu 컴포넌트 사용 */}
      <div className="content">
        <div className="event-detail-container">
          <div className="event-detail">
            <h1>{title}</h1>
            <div className="event-info">
              <p>등록일시: {createdAt ? new Date(createdAt.seconds * 1000).toLocaleDateString('ko-KR') : '등록일시 없음'}</p>
            </div>
            <hr />
            <p className="event-content">{content}</p>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            <hr />
            <button className="back-button" onClick={handleBackToList}>목록으로 돌아가기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;