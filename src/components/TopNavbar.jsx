import React from 'react';
import { Menu, Sun, Moon, User } from 'lucide-react';
import './TopNavbar.css';

const TopNavbar = ({ onToggleSidebar, theme, onToggleTheme }) => {
  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="greeting">
          <h2>Welcome back, Student!</h2>
          <p>Have a productive day at Sri Eshwar College</p>
        </div>
      </div>
      
      <div className="navbar-right">
        <button className="theme-toggle" onClick={onToggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-role">Computer Science</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;