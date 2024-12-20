import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import '../styles/Event.css';

const Event = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]); // 필터링된 이벤트 상태 추가
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'events'));
            const eventsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    content: data.content,
                    imageUrl: data.imageUrl,
                    createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : null
                };
            });

            // 등록일시 기준으로 내림차순 정렬
            eventsData.sort((a, b) => {
                return b.createdAt - a.createdAt;
            });

            setEvents(eventsData);
            setFilteredEvents(eventsData); // 초기 로드 시 필터링된 이벤트 목록 설정
        } catch (error) {
            console.error('Error fetching events: ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(); // 컴포넌트가 마운트될 때 이벤트 목록을 가져옴
    }, []);

    useEffect(() => {
        const storedPage = sessionStorage.getItem('currentPage');
        if (storedPage) {
            setCurrentPage(Number(storedPage)); // 저장된 페이지 번호로 설정
        }
    }, []);

    const updateFilteredEvents = useCallback((searchTerm) => {
        const newFilteredEvents = events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(newFilteredEvents);
    }, [events]);

    useEffect(() => {
        updateFilteredEvents(searchTerm); // 검색어가 변경될 때 필터링 업데이트
    }, [events, searchTerm, updateFilteredEvents]);

    const handleCreateEvent = () => {
        navigate('/admin/event/create');
    };

    const handleEventClick = (event) => {
        sessionStorage.setItem('currentPage', currentPage); // 현재 페이지 상태 저장
        navigate(`/admin/event/${event.id}`, { state: { 
            title: event.title, 
            content: event.content, 
            imageUrl: event.imageUrl,
            createdAt: event.createdAt
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

    const displayedEvents = filteredEvents.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="event-container">
            <h1>이벤트 목록</h1>
            <div className="filter-container">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="이벤트 제목 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearchClick}>검색</button>
                </div>
            </div>
            <div className="divider"></div>
            <table className="event-table">
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>등록일시</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedEvents.length > 0 ? (
                        displayedEvents.map(event => (
                            <React.Fragment key={event.id}>
                                <tr className="event-item" onClick={() => handleEventClick(event)}>
                                    <td className="event-title">{event.title}</td>
                                    <td>
                                        {event.createdAt ? event.createdAt.toLocaleDateString('ko-KR') : '등록일시 없음'}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="sub-divider"></td> {/* 미세한 구분선 추가 */}
                                </tr>
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">등록된 이벤트가 없습니다.</td>
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
                    pageCount={Math.ceil(filteredEvents.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    forcePage={currentPage} // 현재 페이지를 강제로 설정
                />
                <button className="create-button" onClick={handleCreateEvent}>글쓰기</button>
            </div>
        </div>
    );
};

export default Event;