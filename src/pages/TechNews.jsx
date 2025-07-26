import React, { useState, useEffect } from "react";
import { Plus, X, ExternalLink, Filter, TrendingUp, Briefcase, Code, Newspaper, Users } from "lucide-react";
import "./TechNews.css";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { handleApiError, handleFetchSuccess, validateToken, createAuthHeaders } from '../utils/errorHandler';

const TechNews = () => {
  const [techNews, setTechNews] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [newTechNews, setNewTechNews] = useState({
    title: "",
    description: "",
    type: "tech_news",
    link: "",
    imageUrl: "",
    priority: 1,
  });
  const { token, user } = useAuth();

  const newsTypes = [
    { value: "all", label: "All", icon: Newspaper },
    { value: "hackathon", label: "Hackathons", icon: Code },
    { value: "internship", label: "Internships", icon: Briefcase },
    { value: "tech_news", label: "Tech News", icon: Newspaper },
    { value: "opportunity", label: "Opportunities", icon: TrendingUp },
    { value: "workshop", label: "Workshops", icon: Users },
  ];

  useEffect(() => {
    if (token) {
      fetchTechNews();
    }
  }, [token, selectedType]);

  const fetchTechNews = async () => {
    try {
      setLoading(true);
      setError("");
      
      const tokenValidation = validateToken(token);
      if (!tokenValidation.valid) {
        setError(tokenValidation.message);
        setTechNews([]);
        return;
      }

      const url = selectedType === "all" 
        ? "https://backend-bcex.onrender.com/api/tech-news"
        : `https://backend-bcex.onrender.com/api/tech-news/type/${selectedType}`;

      const response = await axios.get(url, { headers: createAuthHeaders(token) });
      console.log("Fetched tech news:", response.data);
      handleFetchSuccess(response.data, setTechNews, setError, "tech news");
    } catch (error) {
      handleApiError(error, setError);
      setTechNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTechNews = async (e) => {
    e.preventDefault();
    
    const tokenValidation = validateToken(token);
    if (!tokenValidation.valid) {
      setError(tokenValidation.message);
      return;
    }

    if (!newTechNews.title.trim() || !newTechNews.description.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    const techNewsData = {
      title: newTechNews.title.trim(),
      description: newTechNews.description.trim(),
      type: newTechNews.type,
      link: newTechNews.link.trim(),
      imageUrl: newTechNews.imageUrl.trim(),
      priority: parseInt(newTechNews.priority),
    };

    try {
      console.log("Sending tech news:", techNewsData);
      
      const response = await axios.post(
        "https://backend-bcex.onrender.com/api/tech-news",
        techNewsData,
        { headers: createAuthHeaders(token) }
      );
      
      console.log("Response:", response.data);
      
      setTechNews([response.data, ...techNews]);
      setNewTechNews({
        title: "",
        description: "",
        type: "tech_news",
        link: "",
        imageUrl: "",
        priority: 1,
      });
      setShowAddForm(false);
      setError("");
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTechNews = async (newsId) => {
    if (window.confirm("Are you sure you want to delete this tech news?")) {
      try {
        setLoading(true);
        await axios.delete(
          `https://backend-bcex.onrender.com/api/tech-news/${newsId}`,
          { headers: createAuthHeaders(token) }
        );
        setTechNews(techNews.filter(news => news._id !== newsId));
        setError("");
      } catch (error) {
        console.error("Failed to delete tech news:", error);
        setError("Failed to delete tech news");
      } finally {
        setLoading(false);
      }
    }
  };

  const getTypeIcon = (type) => {
    const typeInfo = newsTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.icon : Newspaper;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "hackathon":
        return "#ff6b6b";
      case "internship":
        return "#4ecdc4";
      case "tech_news":
        return "#45b7d1";
      case "opportunity":
        return "#96ceb4";
      case "workshop":
        return "#feca57";
      default:
        return "#95a5a6";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredNews = selectedType === "all" 
    ? techNews 
    : techNews.filter(news => news.type === selectedType);

  return (
    <div className="tech-news-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Tech News & Opportunities</h1>
          <p>Stay updated with the latest tech news, hackathons, internships, and opportunities</p>
        </div>
        {user?.role === 'admin' && (
          <button
            className="add-news-button"
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            <Plus size={20} /> Add News
          </button>
        )}
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <Filter size={20} />
          <span>Filter by Type:</span>
        </div>
        <div className="filter-options">
          {newsTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                className={`filter-option ${selectedType === type.value ? 'active' : ''}`}
                onClick={() => setSelectedType(type.value)}
              >
                <IconComponent size={16} />
                {type.label}
              </button>
            );
          })}
        </div>
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

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading...
        </div>
      )}

      <div className="news-grid">
        {filteredNews.map((news) => {
          const TypeIcon = getTypeIcon(news.type);
          return (
            <div key={news._id} className="news-card">
              <div className="news-header">
                <div className="news-type-badge" style={{ backgroundColor: getTypeColor(news.type) }}>
                  <TypeIcon size={16} />
                  {newsTypes.find(t => t.value === news.type)?.label}
                </div>
                {news.priority > 1 && (
                  <div className="priority-badge">
                    Priority {news.priority}
                  </div>
                )}
              </div>

              <div className="news-content">
                <h3>{news.title}</h3>
                <p className="news-description">{news.description}</p>
                
                {news.imageUrl && (
                  <div className="news-image">
                    <img src={news.imageUrl} alt={news.title} />
                  </div>
                )}
              </div>

              <div className="news-footer">
                <div className="news-meta">
                  <p>
                    <strong>Posted:</strong> {formatDate(news.createdAt)}
                  </p>
                  <p>
                    <strong>By:</strong> {news.postedBy?.name || "Admin"}
                  </p>
                </div>

                <div className="news-actions">
                  {news.link && (
                    <a
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      <ExternalLink size={16} />
                      Visit Link
                    </a>
                  )}
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteTechNews(news._id)}
                      disabled={loading}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNews.length === 0 && !loading && (
        <div className="empty-state">
          <Newspaper size={64} />
          <h3>No tech news available</h3>
          <p>Check back later for updates!</p>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Tech News</h2>
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

            <form onSubmit={handleAddTechNews}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTechNews.title}
                  onChange={(e) =>
                    setNewTechNews({ ...newTechNews, title: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={newTechNews.type}
                  onChange={(e) =>
                    setNewTechNews({ ...newTechNews, type: e.target.value })
                  }
                  disabled={loading}
                >
                  {newsTypes.filter(type => type.value !== 'all').map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTechNews.description}
                  onChange={(e) =>
                    setNewTechNews({ ...newTechNews, description: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Link (Optional)</label>
                <input
                  type="url"
                  value={newTechNews.link}
                  onChange={(e) =>
                    setNewTechNews({ ...newTechNews, link: e.target.value })
                  }
                  placeholder="https://example.com"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input
                  type="url"
                  value={newTechNews.imageUrl}
                  onChange={(e) =>
                    setNewTechNews({ ...newTechNews, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Priority (1-5)</label>
                <select
                  value={newTechNews.priority}
                  onChange={(e) =>
                    setNewTechNews({ ...newTechNews, priority: e.target.value })
                  }
                  disabled={loading}
                >
                  {[1, 2, 3, 4, 5].map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setError("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add News"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechNews; 