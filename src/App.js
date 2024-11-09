// components/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'; // Import CSS for styling
import App2 from './components/Data';
import Home from './components/Home';
import Driver from './components/Driver';
import Calendar from './components/Calendar';
import Predict from './components/Predict';

function App() {
  const [isNavOpen, setNavOpen] = useState(false); // State to control the navbar

  const toggleNavbar = () => {
    setNavOpen(!isNavOpen); // Toggle the navbar state
  };

  return (
    <div className="App">
      <Router>
        <header>
          <nav className="navbar">
            <div className="navbar-brand">
              <Link to="/">Formula MEOW</Link>
            </div>
            <div className="navbar-toggle" onClick={toggleNavbar}>
              &#9776; {/* Hamburger icon */}
            </div>
            <ul className={`navbar-links ${isNavOpen ? 'active' : ''}`}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/driver">Driver</Link></li>
              <li><Link to="/data">Data</Link></li>
              <li><Link to="/calendar">Calendar</Link></li>
              <li><Link to="/predict">Predict</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/data" element={<App2 />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
