// src/pages/NoticeDetail.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/NoticeDetail.css'; // CSS 파일 import

const NoticeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, content, imageUrl, createdAt } = location.state;

  const handleBackToList = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <div className="notice-detail-container">
      <div className="notice-detail">
        <h1>{title}</h1>
        <div className="notice-info">
          <p>등록일시: {createdAt ? new Date(createdAt.seconds * 1000).toLocaleDateString('ko-KR') : '등록일시 없음'}</p>
        </div>
        <hr />
        <p className="notice-content">{content}</p>
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
  );
};

export default NoticeDetail;