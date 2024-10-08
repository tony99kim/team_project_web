// src/InquiryDetail.js
import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/InquiryDetail.css'; // CSS 파일 import

const InquiryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState('');
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchInquiryDetail = async () => {
            try {
                const inqRef = doc(db, 'inquiries', id);
                const inqSnap = await getDoc(inqRef);
                if (inqSnap.exists()) {
                    const data = inqSnap.data();
                    setInquiry({ id: inqSnap.id, ...data });
                    await fetchImages(inqSnap.id); // 이미지 가져오기
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching inquiry detail:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchImages = async (inquiryId) => {
            const storage = getStorage();
            const imagesRef = ref(storage, `inquiry_images/${inquiryId}/`);
            try {
                const res = await listAll(imagesRef);
                const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchInquiryDetail();
    }, [id]);

    const handleResponseChange = (event) => {
        setResponse(event.target.value);
    };

    const handleResponseSubmit = async () => {
        const inqRef = doc(db, 'inquiries', id);
        try {
            await updateDoc(inqRef, { status: '답변 완료', response });
            setInquiry(prev => ({ ...prev, status: '답변 완료', response }));
        } catch (error) {
            console.error('Error updating inquiry status:', error);
        }
    };

    const handleBackToList = () => {
        navigate(-1); // 이전 페이지로 돌아가기
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!inquiry) {
        return <div>문의 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="inquiry-detail">
            <h1>{inquiry.title}</h1>
            <div className="inquiry-info">
                <p>등록일: {inquiry.date}</p>
                <p>상태: {inquiry.status}</p>
            </div>
            <hr />
            <p className="inquiry-content">{inquiry.content}</p>
            <div className="image-gallery">
                {imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                        <img 
                            key={index}
                            src={url} 
                            alt={`${inquiry.title} 이미지 ${index + 1}`} 
                            className="inquiry-image" 
                        />
                    ))
                ) : (
                    <p>이미지가 없습니다.</p>
                )}
            </div>
            <hr />
            {inquiry.status === '답변 대기' && (
                <div className="response-container">
                    <textarea
                        value={response}
                        onChange={handleResponseChange}
                        placeholder="답변 내용을 입력하세요"
                    />
                    <button className="response-button" onClick={handleResponseSubmit}>답변하기</button>
                </div>
            )}
            <button className="back-button" onClick={handleBackToList}>목록으로 돌아가기</button>
        </div>
    );
};

export default InquiryDetail;