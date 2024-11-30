// src/pages/Notice.js
import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../styles/Notice.css'; // CSS 파일 import

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]); // 필터링된 공지 상태 추가
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  const navigate = useNavigate();

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
      setFilteredNotices(noticesData); // 초기 로드 시 필터링된 공지 목록 설정
    } catch (error) {
      console.error('Error fetching notices: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(); // 컴포넌트가 마운트될 때 공지 목록을 가져옴
  }, []);

  useEffect(() => {
    const storedPage = sessionStorage.getItem('currentPage');
    if (storedPage) {
      setCurrentPage(Number(storedPage)); // 저장된 페이지 번호로 설정
    }
  }, []);

  const updateFilteredNotices = useCallback((searchTerm) => {
    const newFilteredNotices = notices.filter(notice =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotices(newFilteredNotices);
  }, [notices]);

  useEffect(() => {
    updateFilteredNotices(searchTerm); // 검색어가 변경될 때 필터링 업데이트
  }, [notices, searchTerm, updateFilteredNotices]);

  const handleCreateNotice = () => {
    navigate('/admin/notice/create');
  };

  const handleNoticeClick = (notice) => {
    sessionStorage.setItem('currentPage', currentPage); // 현재 페이지 상태 저장
    navigate(`/admin/notice/${notice.id}`, { state: { 
      title: notice.title, 
      content: notice.content, 
      imageUrl: notice.imageUrl,
      createdAt: notice.createdAt
    } });
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
    sessionStorage.setItem('currentPage', selectedPage); // 페이지 변경 시 상태 저장
  };

  const handleSearchClick = () => {
    setCurrentPage(0); // 검색어 변경 시 페이지를 첫 페이지로 리셋
  };

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
        <div className="search-container">
          <input
            type="text"
            placeholder="공지사항 제목 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearchClick}>검색</button>
        </div>
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
              <React.Fragment key={notice.id}>
                <tr className="notice-item" onClick={() => handleNoticeClick(notice)}>
                  <td className="notice-title">{notice.title}</td>
                  <td>
                    {notice.createdAt ? notice.createdAt.toLocaleDateString('ko-KR') : '등록일시 없음'}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="sub-divider"></td> {/* 미세한 구분선 추가 */}
                </tr>
              </React.Fragment>
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
        <ReactPaginate
          previousLabel={'이전'}
          nextLabel={'다음'}
          breakLabel={''} // 구분 기호를 빈 문자열로 설정
          pageCount={Math.ceil(filteredNotices.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          forcePage={currentPage} // 현재 페이지를 강제로 설정
        />
        <button className="create-button" onClick={handleCreateNotice}>글쓰기</button>
      </div>
    </div>
  );
};

export default Notice;