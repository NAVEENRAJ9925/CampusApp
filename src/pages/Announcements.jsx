import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Filter, Search, Plus, X } from 'lucide-react';
import './Announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    category: 'event',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { value: 'all', label: 'All Categories', color: '#ff6b35' },
    { value: 'event', label: 'Events', color: '#3498db' },
    { value: 'exam', label: 'Exams', color: '#e74c3c' },
    { value: 'holiday', label: 'Holidays', color: '#2ecc71' },
    { value: 'general', label: 'General', color: '#f39c12' }
  ];

  // Mock data
  const mockAnnouncements = [
    {
      id: 1,
      title: "Mid-Term Examinations Schedule Released",
      category: "exam",
      description: "The mid-term examination schedule for all departments has been released. Please check your respective department notice boards for detailed timetables.",
      date: "2024-01-15",
      author: "Academic Office"
    },
    {
      id: 2,
      title: "Tech Fest 2024 - Registration Open",
      category: "event",
      description: "Annual tech fest registration is now open. Participate in coding competitions, hackathons, and technical presentations. Last date for registration: January 25th.",
      date: "2024-01-10",
      author: "Student Affairs"
    },
    {
      id: 3,
      title: "Republic Day Holiday",
      category: "holiday",
      description: "College will remain closed on January 26th, 2024 on account of Republic Day. Regular classes will resume on January 27th.",
      date: "2024-01-20",
      author: "Administration"
    },
    {
      id: 4,
      title: "Library Hours Extended",
      category: "general",
      description: "Library hours have been extended during examination period. New timings: 7:00 AM to 11:00 PM on all working days.",
      date: "2024-01-12",
      author: "Library Staff"
    },
    {
      id: 5,
      title: "Placement Drive - TCS",
      category: "event",
      description: "TCS placement drive for final year students. Eligible students must register through the placement portal by January 22nd.",
      date: "2024-01-18",
      author: "Placement Cell"
    }
  ];

  useEffect(() => {
    setAnnouncements(mockAnnouncements);
    setFilteredAnnouncements(mockAnnouncements);
  }, []);

  useEffect(() => {
    let filtered = announcements;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ann => ann.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(ann => 
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredAnnouncements(filtered);
  }, [announcements, selectedCategory, searchTerm]);

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    const announcement = {
      id: Date.now(),
      ...newAnnouncement,
      author: "Admin"
    };
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: '',
      category: 'event',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const getCategoryColor = (category) => {
    return categories.find(cat => cat.value === category)?.color || '#ff6b35';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="announcements-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Campus Announcements</h1>
          <p>Stay updated with the latest news and events from Sri Eshwar College</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Add Announcement
        </button>
      </div>

      <div className="announcements-controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.value}
              className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.value)}
              style={{ '--filter-color': category.color }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="announcements-grid">
        {filteredAnnouncements.map(announcement => (
          <div key={announcement.id} className="announcement-card">
            <div className="card-header">
              <div 
                className="category-badge"
                style={{ backgroundColor: getCategoryColor(announcement.category) }}
              >
                {categories.find(cat => cat.value === announcement.category)?.label}
              </div>
              <div className="announcement-date">
                <Calendar size={16} />
                {formatDate(announcement.date)}
              </div>
            </div>
            
            <h3>{announcement.title}</h3>
            <p>{announcement.description}</p>
            
            <div className="card-footer">
              <span className="author">By {announcement.author}</span>
              <Bell size={16} />
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="empty-state">
          <Bell size={64} />
          <h3>No announcements found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Announcement</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddAnnouncement}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({
                    ...newAnnouncement,
                    title: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newAnnouncement.category}
                  onChange={(e) => setNewAnnouncement({
                    ...newAnnouncement,
                    category: e.target.value
                  })}
                >
                  {categories.slice(1).map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newAnnouncement.date}
                  onChange={(e) => setNewAnnouncement({
                    ...newAnnouncement,
                    date: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={newAnnouncement.description}
                  onChange={(e) => setNewAnnouncement({
                    ...newAnnouncement,
                    description: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;