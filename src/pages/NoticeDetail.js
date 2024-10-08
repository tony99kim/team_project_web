import React from 'react';
import { useLocation } from 'react-router-dom';

const NoticeDetail = () => {
  const location = useLocation();
  const { title, content, imageUrl } = location.state;

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
    </div>
  );
};

export default NoticeDetail;
