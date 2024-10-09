// src/MemberDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../styles/MemberDetail.css'; // CSS 파일 import

const MemberDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'users', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setMember(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching member:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMember(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const docRef = doc(db, 'users', id);
            await updateDoc(docRef, member);
            alert('회원 정보가 수정되었습니다.');
            navigate('/admin/member');
        } catch (error) {
            console.error('Error updating document:', error);
            alert('회원 정보 수정에 실패했습니다.');
        }
    };

    const handleBackToList = () => {
        navigate(-1); // 이전 페이지로 돌아가기
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="member-detail-content">
            <h1>회원 정보 수정</h1>
            {member ? (
                <div>
                    <div className="form-group">
                        <label>이름</label>
                        <input
                            type="text"
                            name="name"
                            value={member.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={member.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>전화번호</label>
                        <input
                            type="text"
                            name="phone"
                            value={member.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>생년월일</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={member.birthDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>성별</label>
                        <select
                            name="gender"
                            value={member.gender}
                            onChange={handleInputChange}
                        >
                            <option value="Male">남성</option>
                            <option value="Female">여성</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>주소</label>
                        <input
                            type="text"
                            name="address"
                            value={member.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>상세 주소</label>
                        <input
                            type="text"
                            name="detailAddress"
                            value={member.detailAddress}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>가입 날짜</label>
                        <input
                            type="text"
                            name="signUpDate"
                            value={member.signUpDate}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>사용자 이름</label>
                        <input
                            type="text"
                            name="username"
                            value={member.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="save-button" onClick={handleSave}>저장</button>
                </div>
            ) : (
                <p>회원 정보를 불러올 수 없습니다.</p>
            )}
            <button className="back-button" onClick={handleBackToList}>목록으로 돌아가기</button>
        </div>
    );
};

export default MemberDetail;