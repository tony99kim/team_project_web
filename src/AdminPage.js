// src/AdminPage.js
import React from 'react';

const AdminPage = () => {
  // 더미 데이터
  const data = [
    { id: 1, name: "Admin Item 1", description: "Description for admin item 1" },
    { id: 2, name: "Admin Item 2", description: "Description for admin item 2" },
    { id: 3, name: "Admin Item 3", description: "Description for admin item 3" },
  ];

  return (
    <div>
      <h1>Admin Page</h1>
      <h2>Admin Data:</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
          </li> // 더미 데이터 표시
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
