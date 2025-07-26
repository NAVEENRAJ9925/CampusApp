import React, { useState, useEffect } from "react";
import { Plus, X, AlertCircle, Clock, CheckCircle } from "lucide-react";
import "./Complaints.css";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { handleApiError, handleFetchSuccess, validateToken, createAuthHeaders } from '../utils/errorHandler';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    category: "electricity",
    description: "",
    location: "",
    priority: "medium",
  });
  const { token, user } = useAuth();

  const categories = [
    { value: "electricity", label: "Electricity" },
    { value: "water", label: "Water" },
    { value: "maintenance", label: "Maintenance" },
    { value: "cleanliness", label: "Cleanliness" },
    { value: "internet", label: "Internet" },
    { value: "other", label: "Other" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "#2ecc71" },
    { value: "medium", label: "Medium", color: "#f39c12" },
    { value: "high", label: "High", color: "#e74c3c" },
  ];

  useEffect(() => {
    if (token) {
      fetchComplaints();
    }
  }, [token]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      
      const tokenValidation = validateToken(token);
      if (!tokenValidation.valid) {
        setError(tokenValidation.message);
        setComplaints([]);
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/complaints",
        { headers: createAuthHeaders(token) }
      );
      console.log("Fetched complaints:", response.data);
      handleFetchSuccess(response.data, setComplaints, setError, "complaints");
    } catch (error) {
      handleApiError(error, setError);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    
    const tokenValidation = validateToken(token);
    if (!tokenValidation.valid) {
      setError(tokenValidation.message);
      return;
    }

    if (!newComplaint.title.trim() || !newComplaint.description.trim() || !newComplaint.location.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    const complaintData = {
      title: newComplaint.title.trim(),
      category: newComplaint.category,
      description: newComplaint.description.trim(),
      location: newComplaint.location.trim(),
      priority: newComplaint.priority,
    };

    try {
      console.log("Sending complaint:", complaintData);
      console.log("Token:", token);
      
      const response = await axios.post(
        "http://localhost:8000/api/complaints",
        complaintData,
        { headers: createAuthHeaders(token) }
      );
      
      console.log("Response:", response.data);
      
      setComplaints([response.data, ...complaints]);
      setNewComplaint({
        title: "",
        category: "electricity",
        description: "",
        location: "",
        priority: "medium",
      });
      setShowForm(false);
      setError("");
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://localhost:8000/api/complaints/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setComplaints(complaints.map(complaint => 
        complaint._id === id ? response.data : complaint
      ));
      setError("");
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update complaint status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "in-progress":
        return <AlertCircle size={16} />;
      case "resolved":
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f39c12";
      case "in-progress":
        return "#3498db";
      case "resolved":
        return "#2ecc71";
      default:
        return "#95a5a6";
    }
  };

  const getPriorityColor = (priority) => {
    return priorities.find(p => p.value === priority)?.color || "#f39c12";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="complaints-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Campus Complaints</h1>
          <p>Report issues and track their resolution status</p>
        </div>
        <button 
          className="add-complaint-button"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          <Plus size={20} /> Submit Complaint
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

      <div className="complaints-grid">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="complaint-card">
            <div className="complaint-header">
                <h3>{complaint.title}</h3>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(complaint.status) }}>
                  {getStatusIcon(complaint.status)}
                {complaint.status}
              </div>
            </div>

            <div className="complaint-details">
              <div className="detail-item">
                <strong>Category:</strong> {complaint.category}
              </div>
              <div className="detail-item">
                <strong>Description:</strong> {complaint.description}
              </div>
              <div className="detail-item">
                <strong>Location:</strong> {complaint.location}
              </div>
              <div className="detail-item">
                <strong>Priority:</strong>
                <span style={{ color: getPriorityColor(complaint.priority) }}>
                  {complaint.priority}
                </span>
              </div>
              <div className="detail-item">
                <strong>Submitted:</strong> {formatDate(complaint.createdAt || complaint.submittedDate)}
              </div>
            </div>

            <div className="complaint-footer">
              <div className="submitted-by">
                By: {complaint.submittedBy?.name || "Unknown"}
              </div>
              {user?.role === "admin" && (
                <div className="status-actions">
                  <select
                    value={complaint.status}
                    onChange={(e) => updateComplaintStatus(complaint._id, e.target.value)}
                    disabled={loading}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {complaints.length === 0 && !loading && (
        <div className="empty-state">
          <AlertCircle size={64} />
          <h3>No complaints found</h3>
          <p>Submit your first complaint to get started</p>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Submit New Complaint</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitComplaint}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newComplaint.title}
                  onChange={(e) =>
                    setNewComplaint({ ...newComplaint, title: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
              
                <div className="form-group">
                <label>Category</label>
                  <select
                    value={newComplaint.category}
                  onChange={(e) =>
                    setNewComplaint({ ...newComplaint, category: e.target.value })
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
                  value={newComplaint.description}
                  onChange={(e) =>
                    setNewComplaint({ ...newComplaint, description: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newComplaint.location}
                  onChange={(e) =>
                    setNewComplaint({ ...newComplaint, location: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newComplaint.priority}
                  onChange={(e) =>
                    setNewComplaint({ ...newComplaint, priority: e.target.value })
                  }
                  disabled={loading}
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;