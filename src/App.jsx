import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import TopNavbar from './components/TopNavbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Announcements from './pages/Announcements.jsx';
import LostFound from './pages/LostFound.jsx';
import Timetable from './pages/Timetable.jsx';
import Complaints from './pages/Complaints.jsx';
import SkillExchange from './pages/SkillExchange.jsx';
import './App.css';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopNavbar 
          onToggleSidebar={toggleSidebar}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/skill-exchange" element={<SkillExchange />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;