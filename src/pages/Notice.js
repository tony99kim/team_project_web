// src/pages/Notice.js
import React, { useState } from 'react';
import { db } from '../utils/firebase'; // 경로 수정
import { collection, addDoc } from 'firebase/firestore'; // Firestore의 기능 가져오기

const Notice = () => {
  const [notice, setNotice] = useState(''); // 공지사항 상태
  const [message, setMessage] = useState(''); // 사용자에게 보여줄 메시지 상태

  const handleInputChange = (e) => {
    setNotice(e.target.value); // 입력값 상태 업데이트
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    try {
      // 'notices' 컬렉션에 새로운 문서 추가
      await addDoc(collection(db, 'notices'), { // 컬렉션 이름 수정
        content: notice,
        createdAt: new Date(), // 생성 날짜 추가
      });
      setMessage('공지사항이 성공적으로 추가되었습니다!');
      setNotice(''); // 입력 필드 초기화
    } catch (error) {
      setMessage('공지사항 추가에 실패했습니다: ' + error.message);
    }
  };

  return (
    <div>
      <h2>공지사항 페이지</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={notice}
          onChange={handleInputChange}
          placeholder="공지사항을 입력하세요"
          required
        />
        <button type="submit">추가하기</button>
      </form>
      {message && <p>{message}</p>} {/* 메시지 표시 */}
    </div>
  );
};

export default Notice;
