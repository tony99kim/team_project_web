// src/pages/CreateNotice.js
import React, { useState } from 'react';
import { db } from '../utils/firebase'; // firebase.js 경로 확인
import { collection, addDoc } from 'firebase/firestore'; // Firestore에 문서 추가
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarMenu'; // 사이드 툴바 컴포넌트 import

const CreateNotice = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 사이드바 열림/닫힘 상태
  const navigate = useNavigate(); // navigate 훅 사용

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'notices'), {
        title,
        content,
        createdAt: new Date(), // 생성일 추가
      });
      navigate('/notices'); // 작성 후 공지사항 목록으로 이동
    } catch (error) {
      console.error('Error adding notice: ', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // 사이드바 열림/닫힘 상태 토글
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}> {/* 전체 높이 설정 */}
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> {/* 사이드 툴바 추가 */}
      <div style={{ padding: '20px', marginLeft: isMenuOpen ? '250px' : '60px', flex: 1, overflowY: 'auto' }}> {/* 메인 콘텐츠 여백 조정 */}
        <h1>공지사항 작성</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>제목:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>내용:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              style={{ width: '100%', height: '100px', padding: '8px' }}
              required
            ></textarea>
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>
            작성하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNotice;
