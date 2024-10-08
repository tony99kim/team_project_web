// src/pages/Notice.js
import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/Notice.css'; // CSS 파일 import

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'notices'));
        const noticesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content, // content 필드 추가
            imageUrl: data.imageUrl, // imageUrl 필드 추가
            createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : null // Date 객체로 저장
          };
        });

        // 등록일시 기준으로 내림차순 정렬
        noticesData.sort((a, b) => {
          return b.createdAt - a.createdAt; // 최신 공지가 위에 오도록 정렬
        });

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
    navigate('/notices/create');
  };

  const handleNoticeClick = (notice) => {
    navigate('/notices/detail', { state: { 
      title: notice.title, 
      content: notice.content, 
      imageUrl: notice.imageUrl 
    } });
  };

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedNotices = filteredNotices.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="notice-container">
      <h1>공지사항 목록</h1>
      <div className="filter-container">
        <input
          type="text"
          placeholder="공지사항 제목 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleCreateNotice}>쓰기</button>
      </div>
      <div className="divider"></div>
      <table className="notice-table">
        <thead>
          <tr>
            <th>공지 제목</th>
            <th>등록일시</th>
          </tr>
        </thead>
        <tbody>
          {displayedNotices.length > 0 ? (
            displayedNotices.map(notice => (
              <tr key={notice.id} className="notice-item" onClick={() => handleNoticeClick(notice)}>
                <td className="notice-title">{notice.title}</td>
                <td>
                  {notice.createdAt ? notice.createdAt.toLocaleDateString('ko-KR') : '등록일시 없음'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">등록된 공지가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="divider"></div>
      <div className="pagination-container">
        {/* 페이지네이션 컴포넌트 추가 필요 */}
      </div>
    </div>
  );
};

export default Notice;
