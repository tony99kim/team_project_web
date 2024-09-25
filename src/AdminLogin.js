import React, { useState } from 'react';
import { auth } from './firebase'; // Firebase 초기화 파일 import
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // 리다이렉트를 위한 useNavigate import

const allowedEmails = ['admin@gmail.com']; // 허용된 이메일 목록

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    if (!allowedEmails.includes(username)) {
      alert('이 이메일로는 로그인할 수 없습니다.');
      return;
    }
    
    try {
      // Firebase Authentication을 사용하여 로그인
      await signInWithEmailAndPassword(auth, username, password);
      // 로그인 성공 시 관리자 페이지로 리다이렉트
      navigate('/admin'); // '/admin'은 관리자 페이지의 경로
    } catch (error) {
      console.error('로그인 실패:', error.message);
      alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>관리자 로그인</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
