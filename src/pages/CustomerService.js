// src/pages/CustomerService.js
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../styles/CustomerService.css'; // CSS 파일 import

const CustomerService = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [filter, setFilter] = useState('전체'); // 필터 상태 추가
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
    const [filteredInquiries, setFilteredInquiries] = useState([]); // 필터링된 문의 상태 추가
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const fetchInquiries = async () => {
        setLoading(true); // 데이터 로딩 시작
        try {
            const querySnapshot = await getDocs(collection(db, 'inquiries'));
            const inqs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: data.date 
                        ? new Date(data.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\.$/, '') 
                        : '등록일시 없음' // date가 없을 경우 기본값 설정
                };
            });

            // 등록일시 순으로 정렬 (최신순)
            inqs.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });

            setInquiries(inqs);
            setFilteredInquiries(inqs); // 초기 로드 시 필터링된 문의 목록 설정
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false); // 데이터 로딩 완료
        }
    };

    useEffect(() => {
        fetchInquiries(); // 컴포넌트가 마운트될 때 문의 목록을 가져옴
    }, []);

    useEffect(() => {
        const storedPage = sessionStorage.getItem('currentPage');
        if (storedPage) {
            setCurrentPage(Number(storedPage)); // 저장된 페이지 번호로 설정
        }
    }, []);

    const updateFilteredInquiries = useCallback((filter, searchTerm) => {
        const newFilteredInquiries = inquiries.filter(inq => {
            const matchesFilter = filter === '전체' || inq.status === filter;
            const matchesSearch = inq.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
        setFilteredInquiries(newFilteredInquiries);
    }, [inquiries]);

    useEffect(() => {
        updateFilteredInquiries(filter, searchTerm); // 필터 또는 검색어가 변경될 때 필터링 업데이트
    }, [inquiries, filter, searchTerm, updateFilteredInquiries]);

    const handleDetailClick = (id) => {
        sessionStorage.setItem('currentPage', currentPage); // 현재 페이지 상태 저장
        navigate(`/admin/customer-service/inquiry/${id}`, { state: { from: 'customerService' } });
    };

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setCurrentPage(selectedPage);
        sessionStorage.setItem('currentPage', selectedPage); // 페이지 변경 시 상태 저장
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(0); // 필터 변경 시 페이지를 첫 페이지로 리셋
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        setCurrentPage(0); // 검색어 변경 시 페이지를 첫 페이지로 리셋
    };

    const displayedInquiries = filteredInquiries.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="customer-service">
            <h1>고객센터 문의 목록</h1>
            <div className="filter-container">
                <select value={filter} onChange={handleFilterChange}>
                    <option value="전체">전체</option>
                    <option value="답변 대기">답변 대기</option>
                    <option value="답변 완료">답변 완료</option>
                </select>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="문의 제목 검색"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button onClick={handleSearchClick}>검색</button>
                </div>
            </div>
            <div className="divider"></div> {/* 검은 구분선 추가 */}
            <table className="inquiry-table">
                <thead>
                    <tr>
                        <th>문의 제목</th>
                        <th>등록일시</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedInquiries.length > 0 ? (
                        displayedInquiries.map(inq => (
                            <React.Fragment key={inq.id}>
                                <tr className="inquiry-item" onClick={() => handleDetailClick(inq.id)}>
                                    <td className="inquiry-title">{inq.title}</td>
                                    <td>{inq.date}</td>
                                    <td>{inq.status}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="sub-divider"></td> {/* 미세한 구분선 추가 */}
                                </tr>
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">등록된 문의가 없습니다.</td>
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
                    pageCount={Math.ceil(filteredInquiries.length / itemsPerPage)}
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

export default CustomerService;