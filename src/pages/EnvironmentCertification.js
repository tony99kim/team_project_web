// src/EnvironmentCertification.js
import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../styles/EnvironmentCertification.css'; // CSS 파일 import

const EnvironmentCertification = () => {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [filter, setFilter] = useState('전체'); // 필터 상태 추가
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
    const [filteredCertifications, setFilteredCertifications] = useState([]); // 필터링된 인증 상태 추가
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const fetchCertifications = async () => {
        setLoading(true); // 데이터 로딩 시작
        try {
            const querySnapshot = await getDocs(collection(db, 'pointAuthentications'));
            const certs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp 
                    ? new Date(doc.data().timestamp).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\.$/, '') // 마지막 점 제거
                    : '등록일시 없음' // timestamp가 없을 경우 기본값 설정
            }));
            setCertifications(certs);
            setFilteredCertifications(certs); // 초기 로드 시 필터링된 인증 목록 설정
        } catch (error) {
            console.error('Error fetching certifications:', error);
        } finally {
            setLoading(false); // 데이터 로딩 완료
        }
    };

    useEffect(() => {
        fetchCertifications(); // 컴포넌트가 마운트될 때 인증 목록을 가져옴
    }, []); // 빈 배열로 설정하여 처음 한 번만 실행

    useEffect(() => {
        const storedPage = sessionStorage.getItem('currentPage');
        if (storedPage) {
            setCurrentPage(Number(storedPage)); // 저장된 페이지 번호로 설정
        }
    }, []);

    const handleDetailClick = (id) => {
        sessionStorage.setItem('currentPage', currentPage); // 현재 페이지 상태 저장
        navigate(`/admin/certification/${id}`, { state: { from: 'certification' } });
    };

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setCurrentPage(selectedPage);
        sessionStorage.setItem('currentPage', selectedPage); // 페이지 변경 시 상태 저장
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(0); // 필터 변경 시 페이지를 첫 페이지로 리셋
        updateFilteredCertifications(event.target.value, searchTerm); // 필터 변경 시 필터링 업데이트
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        setCurrentPage(0); // 검색어 변경 시 페이지를 첫 페이지로 리셋
        updateFilteredCertifications(filter, searchTerm); // 검색 버튼 클릭 시 필터링 업데이트
    };

    const updateFilteredCertifications = (filter, searchTerm) => {
        const newFilteredCertifications = certifications.filter(cert => {
            const matchesFilter = filter === '전체' || cert.status === filter;
            const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
        setFilteredCertifications(newFilteredCertifications);
    };

    const displayedCertifications = filteredCertifications.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="environment-certification">
            <h1>환경 인증 목록</h1>
            <div className="filter-container">
                <select value={filter} onChange={handleFilterChange}>
                    <option value="전체">전체</option>
                    <option value="승인">승인</option>
                    <option value="대기">대기</option>
                </select>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="인증 제목 검색"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button onClick={handleSearchClick}>검색</button>
                </div>
            </div>
            <div className="divider"></div> {/* 검은 구분선 추가 */}
            <table className="certification-table">
                <thead>
                    <tr>
                        <th>인증 제목</th>
                        <th>등록일시</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedCertifications.length > 0 ? (
                        displayedCertifications.map(cert => (
                            <React.Fragment key={cert.id}>
                                <tr className="certification-item" onClick={() => handleDetailClick(cert.id)}>
                                    <td className="certification-title">{cert.title}</td>
                                    <td>{cert.timestamp}</td>
                                    <td>{cert.status}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="sub-divider"></td> {/* 미세한 구분선 추가 */}
                                </tr>
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">등록된 인증이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="divider"></div> {/* 검은 구분선 추가 */}
            <div className="pagination-container">
                <ReactPaginate
                    previousLabel={'이전'}
                    nextLabel={'다음'}
                    breakLabel={''} // 구분 기호를 빈 문자열로 설정
                    pageCount={Math.ceil(filteredCertifications.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    forcePage={currentPage} // 현재 페이지를 강제로 설정
                />
            </div>
        </div>
    );
};

export default EnvironmentCertification;
