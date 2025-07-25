import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Calendar, MessageSquare, TrendingUp, Users, BookOpen, Star } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Campus Announcements',
      description: 'Stay updated with latest college news, events, and important notices',
      icon: Bell,
      path: '/announcements',
      color: '#ff6b35',
      stats: '12 New'
    },
    {
      title: 'Lost & Found',
      description: 'Report lost items or help others find their belongings',
      icon: Search,
      path: '/lost-found',
      color: '#2ecc71',
      stats: '8 Items'
    },
    {
      title: 'Timetable Scheduler',
      description: 'Organize your weekly schedule and never miss a class',
      icon: Calendar,
      path: '/timetable',
      color: '#3498db',
      stats: '24 Classes'
    },
    {
      title: 'Hostel Complaints',
      description: 'Register and track complaints for quick resolution',
      icon: MessageSquare,
      path: '/complaints',
      color: '#e74c3c',
      stats: '3 Pending'
    },
    {
      title: 'Skill Exchange Marketplace',
      description: 'List skills you can teach or book peer learning sessions',
      icon: BookOpen,
      path: '/skill-exchange',
      color: '#8e44ad',
      stats: 'New'
    }
  ];

  const quickStats = [
    { label: 'Total Students', value: '2,456', icon: Users, trend: '+12%' },
    { label: 'Active Courses', value: '48', icon: BookOpen, trend: '+3%' },
    { label: 'Success Rate', value: '94.5%', icon: TrendingUp, trend: '+2.1%' },
    { label: 'Satisfaction', value: '4.8/5', icon: Star, trend: '+0.2' }
  ];

  const recentActivity = [
    { type: 'announcement', title: 'Mid-term exam schedule released', time: '2 hours ago' },
    { type: 'lost-found', title: 'iPhone found in Library', time: '4 hours ago' },
    { type: 'complaint', title: 'Water supply issue - Block A', time: '6 hours ago' },
    { type: 'timetable', title: 'CS301 class rescheduled', time: '1 day ago' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Services Dashboard</h1>
        <p>Sri Eshwar College of Engineering - Your one-stop solution for campus services</p>
      </div>

      <div className="dashboard-stats">
        <div className="grid grid-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
                <span className="stat-trend">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-main">
        <div className="main-cards">
          <h2>Core Services</h2>
          <div className="grid grid-2">
            {dashboardCards.map((card, index) => (
              <div 
                key={index} 
                className="service-card"
                onClick={() => navigate(card.path)}
                style={{ '--card-color': card.color }}
              >
                <div className="card-header">
                  <div className="card-icon">
                    <card.icon size={32} />
                  </div>
                  <div className="card-stats">
                    {card.stats}
                  </div>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className="card-footer">
                  <span>Click to access</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="activity-widget">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-indicator ${activity.type}`}></div>
                  <div className="activity-content">
                    <p>{activity.title}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations-widget">
            <h3>AI Recommendations</h3>
            <div className="recommendation-list">
              <div className="recommendation-item">
                <span className="rec-icon">🎯</span>
                <p>Check 3 unread announcements</p>
              </div>
              <div className="recommendation-item">
                <span className="rec-icon">📅</span>
                <p>Update your timetable for next week</p>
              </div>
              <div className="recommendation-item">
                <span className="rec-icon">🔍</span>
                <p>2 lost items match your interests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;