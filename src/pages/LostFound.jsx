import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MapPin, Calendar, X, Camera } from 'lucide-react';
import './LostFound.css';

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'electronics',
    location: '',
    description: '',
    status: 'lost',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'books', label: 'Books' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'documents', label: 'Documents' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'lost', label: 'Lost' },
    { value: 'found', label: 'Found' }
  ];

  // Mock data
  const mockItems = [
    {
      id: 1,
      title: "iPhone 13 Pro",
      category: "electronics",
      location: "Library - 2nd Floor",
      description: "Black iPhone 13 Pro with a blue case. Lost near the computer section.",
      status: "lost",
      imageUrl: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "2024-01-15",
      postedBy: "John Doe"
    },
    {
      id: 2,
      title: "Data Structures Textbook",
      category: "books",
      location: "CSE Department",
      description: "Data Structures and Algorithms textbook by Cormen. Has my name written inside.",
      status: "found",
      imageUrl: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "2024-01-14",
      postedBy: "Jane Smith"
    },
    {
      id: 3,
      title: "Blue Hoodie",
      category: "clothing",
      location: "Basketball Court",
      description: "Navy blue hoodie with college logo. Size M. Left behind after sports practice.",
      status: "found",
      imageUrl: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "2024-01-13",
      postedBy: "Mike Johnson"
    },
    {
      id: 4,
      title: "Silver Watch",
      category: "accessories",
      location: "Cafeteria",
      description: "Silver wristwatch with black leather strap. Casio brand.",
      status: "lost",
      imageUrl: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "2024-01-12",
      postedBy: "Sarah Wilson"
    },
    {
      id: 5,
      title: "Student ID Card",
      category: "documents",
      location: "Main Gate",
      description: "Student ID card belonging to Alex Kumar, Roll No: 20CS001",
      status: "found",
      imageUrl: "https://images.pexels.com/photos/6804581/pexels-photo-6804581.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "2024-01-11",
      postedBy: "Security Office"
    }
  ];

  // Add mock contact info for demonstration
  const contactInfo = {
    'John Doe': { name: 'John Doe', mobile: '9876543210', email: 'john.doe@example.com' },
    'Jane Smith': { name: 'Jane Smith', mobile: '9123456780', email: 'jane.smith@example.com' },
    'Mike Johnson': { name: 'Mike Johnson', mobile: '9001122334', email: 'mike.johnson@example.com' },
    'Sarah Wilson': { name: 'Sarah Wilson', mobile: '9988776655', email: 'sarah.wilson@example.com' },
    'Security Office': { name: 'Security Office', mobile: '044-123456', email: 'security@sri-eshwar.edu' },
    'Current User': { name: 'Current User', mobile: '9000000000', email: 'current.user@example.com' }
  };
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({ name: '', mobile: '', email: '' });
  const handleContactClick = (postedBy) => {
    setContact(contactInfo[postedBy] || { name: postedBy, mobile: 'N/A', email: 'N/A' });
    setShowContact(true);
  };
  const handleCloseContact = () => setShowContact(false);

  useEffect(() => {
    setItems(mockItems);
    setFilteredItems(mockItems);
  }, []);

  useEffect(() => {
    let filtered = items;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  }, [items, selectedCategory, selectedStatus, searchTerm]);

  const handleAddItem = (e) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      ...newItem,
      postedBy: "Current User",
      imageUrl: newItem.imageUrl || "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400"
    };
    setItems([item, ...items]);
    setNewItem({
      title: '',
      category: 'electronics',
      location: '',
      description: '',
      status: 'lost',
      imageUrl: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      electronics: '📱',
      books: '📚',
      clothing: '👕',
      accessories: '⌚',
      documents: '📄',
      other: '🎒'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="lost-found-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Lost & Found</h1>
          <p>Help your fellow students find their lost belongings</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Report Item
        </button>
      </div>

      <div className="controls-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search items, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
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
        </div>
      </div>

      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-image">
              <img src={item.imageUrl} alt={item.title} />
              <div className={`status-badge ${item.status}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </div>
            </div>
            
            <div className="item-content">
              <div className="item-header">
                <h3>{item.title}</h3>
                <span className="category-icon">
                  {getCategoryIcon(item.category)}
                </span>
              </div>
              
              <p className="item-description">{item.description}</p>
              
              <div className="item-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{item.location}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
              
              <div className="item-footer">
                <span className="posted-by">Posted by {item.postedBy}</span>
                <button className="btn btn-secondary" onClick={() => handleContactClick(item.postedBy)}>Contact</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <Search size={64} />
          <h3>No items found</h3>
          <p>Try adjusting your search criteria or be the first to report an item</p>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Report Lost/Found Item</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label className="form-label">Item Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={newItem.title}
                  onChange={(e) => setNewItem({
                    ...newItem,
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
                    value={newItem.category}
                    onChange={(e) => setNewItem({
                      ...newItem,
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
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newItem.status}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      status: e.target.value
                    })}
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Where was it lost/found?"
                  value={newItem.location}
                  onChange={(e) => setNewItem({
                    ...newItem,
                    location: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Provide detailed description..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({
                    ...newItem,
                    description: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="Add image URL for better identification"
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({
                    ...newItem,
                    imageUrl: e.target.value
                  })}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Camera size={16} />
                  Report Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showContact && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Contact Info</h2>
              <button className="close-btn" onClick={handleCloseContact}><X size={24} /></button>
            </div>
            <div className="contact-info-content">
              <div><strong>Name:</strong> {contact.name}</div>
              <div><strong>Mobile No:</strong> {contact.mobile}</div>
              <div><strong>Email:</strong> {contact.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFound;