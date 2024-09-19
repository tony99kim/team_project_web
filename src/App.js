// src/App.js
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // 더미 데이터
  const data = [
    { id: 1, name: "Item 1", description: "Description for item 1" },
    { id: 2, name: "Item 2", description: "Description for item 2" },
    { id: 3, name: "Item 3", description: "Description for item 3" },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <h2>Dummy Data:</h2>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong>: {item.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
