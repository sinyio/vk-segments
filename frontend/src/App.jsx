import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Segments from './components/Segments.jsx';
import Users from './components/Users.jsx';
import SegmentDistribution from './components/SegmentDistribution.jsx';
import UserSegments from './components/UserSegments.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>VK Segments Service</h1>
          <nav>
            <Link to="/" className="nav-link">Сегменты</Link>
            <Link to="/users" className="nav-link">Пользователи</Link>
            <Link to="/distribution" className="nav-link">Распределение</Link>
            <Link to="/user-segments" className="nav-link">Сегменты пользователя</Link>
          </nav>
        </header>
        
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Segments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/distribution" element={<SegmentDistribution />} />
            <Route path="/user-segments" element={<UserSegments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
