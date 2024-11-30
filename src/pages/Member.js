import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../styles/Member.css'; // CSS 파일 import

const Member = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]); // 필터링된 회원 상태 추가
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [filter, setFilter] = useState('전체'); // 필터 상태 추가
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const fetchMembers = async () => {
        setLoading(true); // 데이터 로딩 시작
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const membersList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    signUpDate: data.signUpDate 
                        ? new Date(data.signUpDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\.$/, '') 
                        : '가입일자 없음' // signUpDate가 없을 경우 기본값 설정
                };
            });

            // 가입일자 순으로 정렬 (최신순)
            membersList.sort((a, b) => {
                const dateA = new Date(a.signUpDate);
                const dateB = new Date(b.signUpDate);
                return dateB - dateA;
            });

            setMembers(membersList);
            setFilteredMembers(membersList); // 초기 로드 시 필터링된 회원 목록 설정
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false); // 데이터 로딩 완료
        }
    };

    useEffect(() => {
        fetchMembers(); // 컴포넌트가 마운트될 때 회원 목록을 가져옴
    }, []);

    useEffect(() => {
        const storedPage = sessionStorage.getItem('currentPage');
        if (storedPage) {
            setCurrentPage(Number(storedPage)); // 저장된 페이지 번호로 설정
        }
    }, []);

    const updateFilteredMembers = useCallback((filter, searchTerm) => {
        const newFilteredMembers = members.filter(member => {
            const matchesFilter = filter === '전체' || member.status === filter;
            const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
        setFilteredMembers(newFilteredMembers);
    }, [members]);

    useEffect(() => {
        updateFilteredMembers(filter, searchTerm); // 필터 또는 검색어가 변경될 때 필터링 업데이트
    }, [members, filter, searchTerm, updateFilteredMembers]);

    const handleDetailClick = (id) => {
        sessionStorage.setItem('currentPage', currentPage); // 현재 페이지 상태 저장
        navigate(`/admin/member/${id}`);
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

    const displayedMembers = filteredMembers.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="member-list">
            <h1>회원 목록</h1>
            <div className="filter-container">
                <select value={filter} onChange={handleFilterChange}>
                    <option value="전체">전체</option>
                    <option value="활성">활성</option>
                    <option value="비활성">비활성</option>
                </select>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="회원 이름 검색"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button onClick={handleSearchClick}>검색</button>
                </div>
            </div>
            <div className="divider"></div> {/* 검은 구분선 추가 */}
            <table className="member-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>가입일자</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedMembers.length > 0 ? (
                        displayedMembers.map(member => (
                            <React.Fragment key={member.id}>
                                <tr className="member-item" onClick={() => handleDetailClick(member.id)}>
                                    <td className="member-name">{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.signUpDate}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="sub-divider"></td> {/* 미세한 구분선 추가 */}
                                </tr>
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">등록된 회원이 없습니다.</td>
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
                    pageCount={Math.ceil(filteredMembers.length / itemsPerPage)}
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

export default Member;