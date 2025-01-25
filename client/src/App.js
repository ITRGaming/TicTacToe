import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Game from './components/Game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/game/:gameId" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;