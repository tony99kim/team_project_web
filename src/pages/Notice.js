// src/pages/Notice.js
import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase'; // firebase.js 경로 수정
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // navigate 훅 사용

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'notices'));
        const noticesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotices(noticesData);
      } catch (error) {
        console.error('Error fetching notices: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleCreateNotice = () => {
    navigate('/notices/create'); // 글쓰기 페이지로 이동
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>공지사항</h1>
      <button onClick={handleCreateNotice} style={{ float: 'right', margin: '10px' }}>
        글쓰기
      </button>
      <ul>
        {notices.map(notice => (
          <li key={notice.id}>
            <h2>{notice.title}</h2>
            <p>{notice.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notice;
