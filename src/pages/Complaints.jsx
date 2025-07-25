import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Filter, Clock, CheckCircle, AlertCircle, X, Send } from 'lucide-react';
import './Complaints.css';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    category: 'electricity',
    description: '',
    location: '',
    priority: 'medium'
  });

  const statusOptions = [
    { value: 'all', label: 'All Status', color: '#6c757d' },
    { value: 'pending', label: 'Pending', color: '#ffc107' },
    { value: 'in-progress', label: 'In Progress', color: '#17a2b8' },
    { value: 'resolved', label: 'Resolved', color: '#28a745' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'water', label: 'Water Supply' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'internet', label: 'Internet/WiFi' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#28a745' },
    { value: 'medium', label: 'Medium', color: '#ffc107' },
    { value: 'high', label: 'High', color: '#dc3545' }
  ];

  // Mock data
  const mockComplaints = [
    {
      id: 1,
      title: "No electricity in Block A - Room 201",
      category: "electricity",
      description: "The power has been out in our room for the past 2 days. We have informed the warden but no action has been taken yet.",
      location: "Block A, Room 201",
      status: "pending",
      priority: "high",
      submittedDate: "2024-01-15",
      resolvedDate: null,
      submittedBy: "John Doe"
    },
    {
      id: 2,
      title: "Water leakage in bathroom",
      category: "water",
      description: "There is continuous water leakage from the bathroom tap. It's causing water wastage and making the floor slippery.",
      location: "Block B, Room 105",
      status: "in-progress",
      priority: "medium",
      submittedDate: "2024-01-12",
      resolvedDate: null,
      submittedBy: "Jane Smith"
    },
    {
      id: 3,
      title: "WiFi not working in common area",
      category: "internet",
      description: "The WiFi connection in the common study area has been down for 3 days. Students are unable to access online resources.",
      location: "Block C, Common Area",
      status: "resolved",
      priority: "medium",
      submittedDate: "2024-01-10",
      resolvedDate: "2024-01-14",
      submittedBy: "Mike Johnson"
    },
    {
      id: 4,
      title: "Broken window in room",
      category: "maintenance",
      description: "The window glass is cracked and needs immediate replacement for security reasons.",
      location: "Block A, Room 315",
      status: "pending",
      priority: "high",
      submittedDate: "2024-01-14",
      resolvedDate: null,
      submittedBy: "Sarah Wilson"
    },
    {
      id: 5,
      title: "Corridor cleaning not done regularly",
      category: "cleanliness",
      description: "The corridor on the 2nd floor is not being cleaned properly. There's accumulated dust and garbage.",
      location: "Block B, 2nd Floor",
      status: "in-progress",
      priority: "low",
      submittedDate: "2024-01-11",
      resolvedDate: null,
      submittedBy: "Alex Kumar"
    }
  ];

  useEffect(() => {
    setComplaints(mockComplaints);
    setFilteredComplaints(mockComplaints);
  }, []);

  useEffect(() => {
    let filtered = complaints;
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === selectedStatus);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === selectedCategory);
    }
    
    setFilteredComplaints(filtered);
  }, [complaints, selectedStatus, selectedCategory]);

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    const complaint = {
      id: Date.now(),
      ...newComplaint,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      resolvedDate: null,
      submittedBy: "Current User"
    };
    setComplaints([complaint, ...complaints]);
    setNewComplaint({
      title: '',
      category: 'electricity',
      description: '',
      location: '',
      priority: 'medium'
    });
    setShowAddForm(false);
  };

  const updateComplaintStatus = (complaintId, newStatus) => {
    setComplaints(prev => prev.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          status: newStatus,
          resolvedDate: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : null
        };
      }
      return complaint;
    }));
  };

  const getStatusColor = (status) => {
    return statusOptions.find(opt => opt.value === status)?.color || '#6c757d';
  };

  const getPriorityColor = (priority) => {
    return priorities.find(p => p.value === priority)?.color || '#ffc107';
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'pending': return 25;
      case 'in-progress': return 65;
      case 'resolved': return 100;
      default: return 0;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'in-progress': return <AlertCircle size={16} />;
      case 'resolved': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="complaints-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Hostel Complaints</h1>
          <p>Register and track complaints for quick resolution</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Submit Complaint
        </button>
      </div>

      <div className="complaints-stats">
        <div className="stat-card">
          <div className="stat-number">{complaints.filter(c => c.status === 'pending').length}</div>
          <div className="stat-label">Pending</div>
          <div className="stat-color" style={{ backgroundColor: '#ffc107' }}></div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{complaints.filter(c => c.status === 'in-progress').length}</div>
          <div className="stat-label">In Progress</div>
          <div className="stat-color" style={{ backgroundColor: '#17a2b8' }}></div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{complaints.filter(c => c.status === 'resolved').length}</div>
          <div className="stat-label">Resolved</div>
          <div className="stat-color" style={{ backgroundColor: '#28a745' }}></div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{complaints.length}</div>
          <div className="stat-label">Total</div>
          <div className="stat-color" style={{ backgroundColor: '#6c757d' }}></div>
        </div>
      </div>

      <div className="complaints-filters">
        <div className="filter-group">
          <label>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="complaints-list">
        {filteredComplaints.map(complaint => (
          <div key={complaint.id} className="complaint-card">
            <div className="complaint-header">
              <div className="complaint-title">
                <h3>{complaint.title}</h3>
                <div className="complaint-meta">
                  <span className="category-tag">{categories.find(c => c.value === complaint.category)?.label}</span>
                  <span 
                    className="priority-tag"
                    style={{ backgroundColor: getPriorityColor(complaint.priority) }}
                  >
                    {priorities.find(p => p.value === complaint.priority)?.label}
                  </span>
                </div>
              </div>
              <div className="complaint-status">
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(complaint.status) }}
                >
                  {getStatusIcon(complaint.status)}
                  {statusOptions.find(s => s.value === complaint.status)?.label}
                </div>
              </div>
            </div>

            <div className="complaint-content">
              <p>{complaint.description}</p>
              <div className="complaint-location">
                <strong>Location:</strong> {complaint.location}
              </div>
            </div>

            <div className="complaint-progress">
              <div className="progress-header">
                <span>Progress</span>
                <span>{getProgressPercentage(complaint.status)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage(complaint.status)}%` }}
                ></div>
              </div>
            </div>

            <div className="complaint-footer">
              <div className="complaint-dates">
                <div>
                  <strong>Submitted:</strong> {formatDate(complaint.submittedDate)}
                </div>
                {complaint.resolvedDate && (
                  <div>
                    <strong>Resolved:</strong> {formatDate(complaint.resolvedDate)}
                  </div>
                )}
              </div>
              <div className="complaint-actions">
                {complaint.status === 'pending' && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => updateComplaintStatus(complaint.id, 'in-progress')}
                  >
                    Mark In Progress
                  </button>
                )}
                {complaint.status === 'in-progress' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="empty-state">
          <MessageSquare size={64} />
          <h3>No complaints found</h3>
          <p>Try adjusting your filters or submit the first complaint</p>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Submit New Complaint</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitComplaint}>
              <div className="form-group">
                <label className="form-label">Complaint Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({
                    ...newComplaint,
                    title: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({
                      ...newComplaint,
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
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({
                      ...newComplaint,
                      priority: e.target.value
                    })}
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Block, Room number, or specific location"
                  value={newComplaint.location}
                  onChange={(e) => setNewComplaint({
                    ...newComplaint,
                    location: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Provide detailed description of the issue..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({
                    ...newComplaint,
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
                  <Send size={16} />
                  Submit Complaint
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