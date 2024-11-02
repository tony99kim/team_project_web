import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../styles/EnvironmentCertification.css'; // CSS 파일 import
import axios from 'axios'; // axios 추가

const EnvironmentCertification = () => {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [filter, setFilter] = useState('전체'); // 필터 상태 추가
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
    const [filteredCertifications, setFilteredCertifications] = useState([]); // 필터링된 인증 상태 추가
    const [autoApproval, setAutoApproval] = useState(false); // 자동 승인 상태 추가
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
                    : '등록일시 없음', // timestamp가 없을 경우 기본값 설정
                images: doc.data().images || [] // images 속성 추가, 기본값은 빈 배열
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

    const handleAutoApprovalToggle = async () => {
        setAutoApproval(!autoApproval); // 자동 승인 상태 토글
        if (!autoApproval) {
            // 자동 승인 상태일 때, API 호출
            const certificationsToSend = filteredCertifications
                .filter(cert => cert.status === '대기') // 대기 상태인 인증글만 필터링
                .map(cert => ({
                    id: cert.id,
                    title: cert.title,
                    description: cert.description,
                    images: cert.images // 이미지 URL 배열 추가
                }));
            
            console.log('Sending certifications:', certificationsToSend); // API 호출 전에 certifications 로그 출력
            
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/autoApprove', { certifications: certificationsToSend });
                console.log('Response from server:', response.data); // 서버 응답 로그 출력
                fetchCertifications(); // 인증 목록을 다시 가져옴
            } catch (error) {
                console.error('Error during auto approval:', error);
            }
        }
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
                    <option value="승인 거부">승인 거부</option>
                </select>
                <button 
                    onClick={handleAutoApprovalToggle}
                    className={autoApproval ? 'auto-approval-on' : 'auto-approval-off'}
                >
                    {autoApproval ? 'AI 자동 승인 ON' : 'AI 자동 승인 OFF'}
                </button>
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
            <div className="divider"></div>
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
                                    <td colSpan="3" className="sub-divider"></td>
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
            <div className="divider"></div>
            <div className="pagination-container">
                <ReactPaginate
                    previousLabel={'이전'}
                    nextLabel={'다음'}
                    breakLabel={''}
                    pageCount={Math.ceil(filteredCertifications.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    forcePage={currentPage}
                />
            </div>
        </div>
    );
};

export default EnvironmentCertification;
