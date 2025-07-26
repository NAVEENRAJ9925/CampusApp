import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, X, MapPin, Calendar } from "lucide-react";
import "./LostFound.css";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { handleApiError, handleFetchSuccess, validateToken, createAuthHeaders } from '../utils/errorHandler';

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newItem, setNewItem] = useState({
    itemType: "",
    title: "",
    description: "",
    location: "",
    contactInfo: "",
    status: "lost",
  });
  const { token, user } = useAuth();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "books", label: "Books" },
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" },
    { value: "other", label: "Other" },
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "lost", label: "Lost" },
    { value: "found", label: "Found" },
    { value: "claimed", label: "Claimed" },
  ];

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      
      const tokenValidation = validateToken(token);
      if (!tokenValidation.valid) {
        setError(tokenValidation.message);
        setItems([]);
        setFilteredItems([]);
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/lost-found",
        { headers: createAuthHeaders(token) }
      );
      
      console.log("Fetched items:", response.data);
      handleFetchSuccess(response.data, setItems, setError, "items");
      setFilteredItems(response.data);
    } catch (error) {
      handleApiError(error, setError);
      setItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [items, selectedCategory, selectedStatus, searchTerm]);

  const handleFilterChange = () => {
    let filtered = [...items];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.itemType === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    const tokenValidation = validateToken(token);
    if (!tokenValidation.valid) {
      setError(tokenValidation.message);
      return;
    }

    if (!newItem.title.trim() || !newItem.description.trim() || !newItem.location.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    const itemData = {
      itemType: newItem.itemType,
      title: newItem.title.trim(),
      description: newItem.description.trim(),
      location: newItem.location.trim(),
      contactInfo: newItem.contactInfo.trim(),
      status: newItem.status,
    };

    try {
      console.log("Sending item:", itemData);
      console.log("Token:", token);
      
      const response = await axios.post(
        "http://localhost:8000/api/lost-found",
        itemData,
        { headers: createAuthHeaders(token) }
      );
      
      console.log("Response:", response.data);
      
      setItems([response.data, ...items]);
      setNewItem({
        itemType: "",
        title: "",
        description: "",
        location: "",
        contactInfo: "",
        status: "lost",
      });
      setShowAddForm(false);
      setError("");
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (id, updatedData) => {
    try {
      setLoading(true);
      setError("");
      
      const tokenValidation = validateToken(token);
      if (!tokenValidation.valid) {
        setError(tokenValidation.message);
        return;
      }

      const response = await axios.put(
        `http://localhost:8000/api/lost-found/${id}`,
        updatedData,
        { headers: createAuthHeaders(token) }
      );
      setItems(items.map(item => item._id === id ? response.data : item));
      setError("");
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        setLoading(true);
        setError("");
        
        const tokenValidation = validateToken(token);
        if (!tokenValidation.valid) {
          setError(tokenValidation.message);
          return;
        }

        await axios.delete(`http://localhost:8000/api/lost-found/${id}`, {
          headers: createAuthHeaders(token)
        });
        setItems(items.filter(item => item._id !== id));
        setError("");
      } catch (error) {
        handleApiError(error, setError);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "lost":
        return "#e74c3c";
      case "found":
        return "#2ecc71";
      case "claimed":
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
    <div className="lost-found-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Lost & Found</h1>
          <p>Help others find their lost items or report found items</p>
        </div>
        <button
          className="add-item-button"
          onClick={() => setShowAddForm(true)}
          disabled={loading}
        >
          <Plus size={20} /> Add Item
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

      <div className="controls-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading...
        </div>
      )}

      <div className="items-grid">
        {filteredItems.map((item) => (
          <div key={item._id} className="item-card">
            <div className="item-content">
              <div className="item-header">
                <h3>{item.title}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(item.status) }}
                >
                  {item.status}
                </span>
              </div>

              <div className="item-details">
                <div className="detail-item">
                  <strong>Type:</strong> {item.itemType}
                </div>
                <div className="detail-item">
                  <strong>Description:</strong> {item.description}
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <strong>Location:</strong> {item.location}
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <strong>Posted:</strong> {formatDate(item.createdAt || item.date)}
                </div>
              </div>

              <div className="item-footer">
                <div className="posted-by">
                  Posted by: {item.postedBy?.name || "Unknown"}
                </div>
                {user?.id === item.postedBy?._id && (
                  <div className="item-actions">
                    <button
                      onClick={() => handleUpdateItem(item._id, { status: "claimed" })}
                      disabled={loading}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No items found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Item</h2>
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

            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Item Type</label>
                <select
                  value={newItem.itemType}
                  onChange={(e) =>
                    setNewItem({ ...newItem, itemType: e.target.value })
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Type</option>
                  {categories.slice(1).map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newItem.location}
                  onChange={(e) =>
                    setNewItem({ ...newItem, location: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Contact Info</label>
                <input
                  type="text"
                  value={newItem.contactInfo}
                  onChange={(e) =>
                    setNewItem({ ...newItem, contactInfo: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={newItem.status}
                  onChange={(e) =>
                    setNewItem({ ...newItem, status: e.target.value })
                  }
                  disabled={loading}
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
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
                  {loading ? "Adding..." : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFound;