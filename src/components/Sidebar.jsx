import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Bell, 
  Search, 
  Calendar, 
  MessageSquare,
  BookOpen,
  TrendingUp,
  Vote
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed }) => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/announcements', icon: Bell, label: 'Announcements' },
    { path: '/lost-found', icon: Search, label: 'Lost & Found' },
    { path: '/timetable', icon: Calendar, label: 'Timetable' },
    { path: '/complaints', icon: MessageSquare, label: 'Complaints' },
    { path: '/skill-exchange', icon: BookOpen, label: 'Skill Exchange' },
    { path: '/tech-news', icon: TrendingUp, label: 'Tech News' },
    { path: '/polls', icon: Vote, label: 'Polls' }
  ];

  return (
    <aside className={`sidebar${isCollapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="college-logo">
          <BookOpen size={32} />
        </div>
        {!isCollapsed && (
          <div className="college-info">
            <h3>Sri Eshwar College</h3>
            <p>of Engineering</p>
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item${isActive ? ' active' : ''}`
            }
          >
            <item.icon size={24} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;