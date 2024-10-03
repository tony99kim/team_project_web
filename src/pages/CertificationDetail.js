// src/CertificationDetail.js
import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import '../styles/CertificationDetail.css'; // CSS 파일 import

const CertificationDetail = () => {
    const { id } = useParams();
    const [certification, setCertification] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificationDetail = async () => {
            try {
                const certRef = doc(db, 'pointAuthentications', id);
                const certSnap = await getDoc(certRef);
                if (certSnap.exists()) {
                    setCertification({ id: certSnap.id, ...certSnap.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching certification detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificationDetail();
    }, [id]);

    const handleApproval = async () => {
        const certRef = doc(db, 'pointAuthentications', id);
        try {
            await updateDoc(certRef, { status: '승인' });
            setCertification(prev => ({ ...prev, status: '승인' }));
        } catch (error) {
            console.error('Error updating certification status:', error);
        }
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
            <p>{certification.description}</p>
            <p>상태: {certification.status}</p>
            <img 
                src={`https://firebasestorage.googleapis.com/v0/b/team-project-12345.appspot.com/o/PointAuthenticationImages%2F${certification.authenticationId}.jpg?alt=media`} 
                alt={certification.title} 
                className="certification-image" 
            />
            {certification.status === '대기' && (
                <button className="approve-button" onClick={handleApproval}>승인</button>
            )}
        </div>
    );
};

export default CertificationDetail;
