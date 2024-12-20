import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import '../styles/CertificationDetail.css'; // CSS 파일 import

const CertificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [certification, setCertification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchCertificationDetail = async () => {
            try {
                const certRef = doc(db, 'pointAuthentications', id);
                const certSnap = await getDoc(certRef);
                if (certSnap.exists()) {
                    const data = certSnap.data();
                    const createdAt = data.timestamp || '등록일시 없음';
                    setCertification({ id: certSnap.id, ...data, createdAt });
                    await fetchImages(data.authenticationId); // 이미지 가져오기
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching certification detail:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchImages = async (authenticationId) => {
            const storage = getStorage();
            const imagesRef = ref(storage, `PointAuthenticationImages/${authenticationId}/`);
            try {
                const res = await listAll(imagesRef);
                const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchCertificationDetail();
    }, [id]);

    const handleApproval = async () => {
        const certRef = doc(db, 'pointAuthentications', id);
        try {
            await updateDoc(certRef, { status: '승인' });
            setCertification(prev => ({ ...prev, status: '승인' }));

            // 포인트 업데이트 로직 추가
            const userRef = doc(db, 'users', certification.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const newPoints = (userData.environmentPoint || 0) + 100;
                await updateDoc(userRef, { environmentPoint: newPoints });
            }
        } catch (error) {
            console.error('Error updating certification status or user points:', error);
        }
    };

    const handlePending = async () => {
        const certRef = doc(db, 'pointAuthentications', id);
        try {
            await updateDoc(certRef, { status: '대기' });
            setCertification(prev => ({ ...prev, status: '대기' }));
        } catch (error) {
            console.error('Error updating certification status to pending:', error);
        }
    };

    const handleRejection = async () => {
        const certRef = doc(db, 'pointAuthentications', id);
        try {
            await updateDoc(certRef, { status: '승인 거부' });
            setCertification(prev => ({ ...prev, status: '승인 거부' }));
        } catch (error) {
            console.error('Error updating certification status to rejected:', error);
        }
    };

    const handleBackToList = () => {
        navigate(-1); // 이전 페이지로 돌아가기
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!certification) {
        return <div>인증 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="certification-detail">
            <h1>{certification.title}</h1>
            <div className="certification-info">
                <p>등록일: {certification.createdAt}</p>
                <p>상태: {certification.status}</p>
            </div>
            <hr />
            <div className="image-gallery">
                {imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                        <img 
                            key={index}
                            src={url} 
                            alt={`${certification.title} 이미지 ${index + 1}`} 
                            className="certification-image" 
                        />
                    ))
                ) : (
                    <p>이미지가 없습니다.</p>
                )}
            </div>
            <p className="certification-description">{certification.description}</p>
            <hr />
            <div className="button-group">
                {certification.status === '대기' && (
                    <>
                        <button className="approve-button" onClick={handleApproval}>승인</button>
                        <button className="pending-button" onClick={handlePending}>대기</button>
                        <button className="reject-button" onClick={handleRejection}>승인 거부</button>
                    </>
                )}
                {certification.status === '승인' && (
                    <>
                        <button className="pending-button" onClick={handlePending}>대기</button>
                        <button className="reject-button" onClick={handleRejection}>승인 거부</button>
                    </>
                )}
                {certification.status === '승인 거부' && (
                    <>
                        <button className="approve-button" onClick={handleApproval}>승인</button>
                        <button className="pending-button" onClick={handlePending}>대기</button>
                    </>
                )}
            </div>
            <button className="back-button" onClick={handleBackToList}>목록으로 돌아가기</button>
        </div>
    );
};

export default CertificationDetail;