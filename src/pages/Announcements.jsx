import React, { useState, useEffect } from "react";
import { Bell, Calendar, Search, Plus, X } from "lucide-react";
import "./Announcements.css";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { handleApiError, handleFetchSuccess, validateToken, createAuthHeaders } from '../utils/errorHandler';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    category: "event",
    description: "",
  });
  const { token, user } = useAuth();

  const categories = [
    { value: "all", label: "All Categories", color: "#ff6b35" },
    { value: "event", label: "Events", color: "#3498db" },
    { value: "exam", label: "Exams", color: "#e74c3c" },
    { value: "holiday", label: "Holidays", color: "#2ecc71" },
    { value: "general", label: "General", color: "#f39c12" },
  ];

  useEffect(() => {
    if (token) {
      fetchAnnouncements();
    }
  }, [token]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      
      const tokenValidation = validateToken(token);
      if (!tokenValidation.valid) {
        setError(tokenValidation.message);
        setAnnouncements([]);
        setFilteredAnnouncements([]);
        return;
      }

      const response = await axios.get(
        "https://backend-bcex.onrender.com/api/announcements/getann",
        { headers: createAuthHeaders(token) }
      );
      console.log("Fetched announcements:", response.data);
      handleFetchSuccess(response.data, setAnnouncements, setError, "announcements");
      setFilteredAnnouncements(response.data);
    } catch (error) {
      handleApiError(error, setError);
      setAnnouncements([]);
      setFilteredAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...announcements];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((ann) => ann.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (ann) =>
          ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ann.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAnnouncements(filtered);
  }, [announcements, selectedCategory, searchTerm]);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError("Please login to add announcements");
      return;
    }

    if (!newAnnouncement.title.trim() || !newAnnouncement.description.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    const announcement = {
      title: newAnnouncement.title.trim(),
      category: newAnnouncement.category,
      description: newAnnouncement.description.trim(),
    };

    try {
      console.log("Sending announcement:", announcement);
      console.log("Token:", token);
      
      const response = await axios.post(
        "https://backend-bcex.onrender.com/api/announcements/createann",
        announcement,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Response:", response.data);
      
      setAnnouncements([response.data, ...announcements]);
      setNewAnnouncement({
        title: "",
        category: "event",
        description: "",
      });
      setShowAddForm(false);
      setError("");
    } catch (error) {
      console.error("Failed to add announcement:", error);
      setError(error.response?.data?.message || "Failed to add announcement");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    return categories.find((cat) => cat.value === category)?.color || "#ff6b35";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="announcements-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Campus Announcements</h1>
          <p>
            Stay updated with the latest news and events from Sri Eshwar College
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
          disabled={loading}
        >
          <Plus size={20} /> Add Announcement
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

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
          {categories.map((category) => (
            <button
              key={category.value}
              className={`filter-btn ${
                selectedCategory === category.value ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.value)}
              style={{ "--filter-color": category.color }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading...
        </div>
      )}

      <div className="announcements-grid">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement._id} className="announcement-card">
            <div className="card-header">
              <div
                className="category-badge"
                style={{
                  backgroundColor: getCategoryColor(announcement.category),
                }}
              >
                {
                  categories.find((cat) => cat.value === announcement.category)
                    ?.label
                }
              </div>
              <div className="announcement-date">
                <Calendar size={16} />
                {formatDate(announcement.createdAt || announcement.date)}
              </div>
            </div>

            <div className="announcement-body">
              <h3 className="announcement-title">{announcement.title}</h3>
              <p className="announcement-description">
                {announcement.description}
              </p>
            </div>

            <div className="card-footer">
              <Bell size={16} />
              {announcement.createdBy && (
                <span className="created-by">
                  By: {announcement.createdBy.name || 'Unknown'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && !loading && (
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
                onClick={() => {
                  setShowAddForm(false);
                  setError("");
                }}
                disabled={loading}
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
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newAnnouncement.category}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      category: e.target.value,
                    })
                  }
                  disabled={loading}
                >
                  {categories.slice(1).map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={newAnnouncement.description}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      description: e.target.value,
                    })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setError("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Announcement"}
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
