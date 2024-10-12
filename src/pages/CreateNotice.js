// src/pages/CreateNotice.js
import React, { useState } from 'react';
import { db, storage } from '../utils/firebase'; // firebase.js 경로 확인
import { collection, addDoc } from 'firebase/firestore'; // Firestore에 문서 추가
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // 파일 업로드 관련 함수
import { useNavigate } from 'react-router-dom';
import '../styles/CreateNotice.css'; // CSS 파일 import

const CreateNotice = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // navigate 훅 사용

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    if (image) {
      const imageRef = ref(storage, `notices/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      await addDoc(collection(db, 'notices'), {
        title,
        content,
        imageUrl,
        createdAt: new Date(), // 생성일 추가
      });
      navigate('/admin/notice'); // 작성 후 공지사항 목록으로 이동
    } catch (error) {
      console.error('Error adding notice: ', error);
    }
  };

  const handleBackToList = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <div className="create-notice-container">
      <h1>공지사항 작성</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>이미지 업로드:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="submit-button">작성하기</button>
        <button type="button" className="back-button" onClick={handleBackToList}>목록으로 돌아가기</button>
      </form>
    </div>
  );
};

export default CreateNotice;