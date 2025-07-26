import React, { useState, useEffect } from "react";
import { Plus, X, Clock, Users, Calendar } from "lucide-react";
import "./SkillExchange.css";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { handleApiError, handleFetchSuccess, validateToken, createAuthHeaders } from '../utils/errorHandler';

const SkillExchange = () => {
  const [skills, setSkills] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState({
    skillName: "",
    skillType: "academic",
    description: "",
    category: "programming",
    availability: "",
    contactInfo: "",
  });
  const { token, user } = useAuth();

  const skillTypes = [
    { value: "academic", label: "Academic" },
    { value: "technical", label: "Technical" },
    { value: "creative", label: "Creative" },
    { value: "sports", label: "Sports" },
    { value: "other", label: "Other" },
  ];

  const categories = [
    { value: "programming", label: "Programming" },
    { value: "mathematics", label: "Mathematics" },
    { value: "languages", label: "Languages" },
    { value: "music", label: "Music" },
    { value: "art", label: "Art" },
    { value: "sports", label: "Sports" },
    { value: "cooking", label: "Cooking" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    if (token) {
      fetchSkills();
    }
  }, [token]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");
      
      const tokenValidation = validateToken(token);
      if (!tokenValidation.valid) {
        setError(tokenValidation.message);
        setSkills([]);
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/skill-exchange",
        { headers: createAuthHeaders(token) }
      );
      console.log("Fetched skills:", response.data);
      handleFetchSuccess(response.data, setSkills, setError, "skills");
    } catch (error) {
      handleApiError(error, setError);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    
    const tokenValidation = validateToken(token);
    if (!tokenValidation.valid) {
      setError(tokenValidation.message);
      return;
    }

    if (!newSkill.skillName.trim() || !newSkill.description.trim() || !newSkill.availability.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    const skillData = {
      skillName: newSkill.skillName.trim(),
      skillType: newSkill.skillType,
      description: newSkill.description.trim(),
      category: newSkill.category,
      availability: newSkill.availability.trim(),
      contactInfo: newSkill.contactInfo.trim(),
    };

    try {
      console.log("Sending skill:", skillData);
      console.log("Token:", token);
      
      const response = await axios.post(
        "http://localhost:8000/api/skill-exchange",
        skillData,
        { headers: createAuthHeaders(token) }
      );
      
      console.log("Response:", response.data);
      
      setSkills([response.data, ...skills]);
      setNewSkill({
        skillName: "",
        skillType: "academic",
        description: "",
        category: "programming",
        availability: "",
        contactInfo: "",
      });
      setShowAddForm(false);
      setError("");
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async (skillId) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://localhost:8000/api/skill-exchange/${skillId}`,
        { status: "booked" },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSkills(skills.map(skill => 
        skill._id === skillId ? response.data : skill
      ));
      setError("");
      // Show success alert
      alert("Session booked successfully!");
    } catch (error) {
      console.error("Failed to book session:", error);
      if (error.response?.status === 409) {
        alert("This session is already booked by another student!");
      } else {
        setError("Failed to book session");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        setLoading(true);
        await axios.delete(
          `http://localhost:8000/api/skill-exchange/${skillId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSkills(skills.filter(skill => skill._id !== skillId));
        setError("");
      } catch (error) {
        console.error("Failed to delete skill:", error);
        setError("Failed to delete skill");
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#2ecc71";
      case "booked":
        return "#f39c12";
      case "completed":
        return "#3498db";
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

  return (
    <div className="skill-exchange-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Skill Exchange</h1>
          <p>Share your skills and learn from others in the campus community</p>
        </div>
        <button
          className="add-skill-button"
          onClick={() => setShowAddForm(true)}
          disabled={loading}
        >
          <Plus size={20} /> Add Skill
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

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading...
        </div>
      )}

      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill._id} className="skill-card">
            <div className="skill-header">
              <h3>{skill.skillName}</h3>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(skill.status) }}
              >
                {skill.status}
              </span>
            </div>

            <div className="skill-type">
              {skillTypes.find(type => type.value === skill.skillType)?.label}
            </div>

            <div className="skill-category">
              {categories.find(cat => cat.value === skill.category)?.label}
            </div>

            <div className="skill-description">
              {skill.description}
            </div>

            <div className="skill-details">
              <p>
                <strong>Availability:</strong> {skill.availability}
              </p>
              <p>
                <strong>Contact:</strong> {skill.contactInfo}
              </p>
              <p>
                <Calendar size={16} />
                <strong>Posted:</strong> {formatDate(skill.createdAt || skill.date)}
              </p>
            </div>

            <div className="skill-actions">
              {skill.status === "active" && (
                <button
                  onClick={() => handleBookSession(skill._id)}
                  disabled={loading}
                >
                  Book Session
                </button>
              )}
              {user?.id === skill.postedBy?._id && (
                <>
                  <button
                    onClick={() => handleDeleteSkill(skill._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            <div className="posted-by">
              By: {skill.postedBy?.name || "Unknown"}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && !loading && (
        <div className="empty-state">
          <Users size={64} />
          <h3>No skills available</h3>
          <p>Be the first to share your skills!</p>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Skill</h2>
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

            <form onSubmit={handleAddSkill}>
              <div className="form-group">
                <label>Skill Name</label>
                <input
                  type="text"
                  value={newSkill.skillName}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, skillName: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Skill Type</label>
                <select
                  value={newSkill.skillType}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, skillType: e.target.value })
                  }
                  disabled={loading}
                >
                  {skillTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, category: e.target.value })
                  }
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newSkill.description}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, description: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Availability</label>
                <input
                  type="text"
                  value={newSkill.availability}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, availability: e.target.value })
                  }
                  placeholder="e.g., Weekdays 6-8 PM"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Contact Info</label>
                <input
                  type="text"
                  value={newSkill.contactInfo}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, contactInfo: e.target.value })
                  }
                  placeholder="Phone, Email, or Room number"
                  disabled={loading}
                />
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
                  {loading ? "Adding..." : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillExchange;