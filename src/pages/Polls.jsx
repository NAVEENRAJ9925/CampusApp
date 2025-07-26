import React, { useState, useEffect } from "react";
import { Plus, X, Vote, BarChart3, Filter, Users, Calendar, CheckCircle } from "lucide-react";
import "./Polls.css";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { handleApiError, handleFetchSuccess, validateToken, createAuthHeaders } from '../utils/errorHandler';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResults, setShowResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPoll, setNewPoll] = useState({
    question: "",
    description: "",
    options: ["", ""],
    allowMultipleVotes: false,
    endDate: "",
    category: "general",
  });
  const { token, user } = useAuth();

  const pollCategories = [
    { value: "all", label: "All", icon: Vote },
    { value: "academic", label: "Academic", icon: Users },
    { value: "campus", label: "Campus", icon: Users },
    { value: "events", label: "Events", icon: Calendar },
    { value: "feedback", label: "Feedback", icon: BarChart3 },
    { value: "general", label: "General", icon: Vote },
  ];

  useEffect(() => {
    if (token) {
      fetchPolls();
    }
  }, [token, selectedCategory]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError("");
      
      const tokenValidation = validateToken(token);
      if (!tokenValidation.valid) {
        setError(tokenValidation.message);
        setPolls([]);
        return;
      }

      const url = selectedCategory === "all" 
        ? "https://backend-bcex.onrender.com/api/polls"
        : `https://backend-bcex.onrender.com/api/polls/category/${selectedCategory}`;

      const response = await axios.get(url, { headers: createAuthHeaders(token) });
      console.log("Fetched polls:", response.data);
      handleFetchSuccess(response.data, setPolls, setError, "polls");
    } catch (error) {
      handleApiError(error, setError);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoll = async (e) => {
    e.preventDefault();
    
    const tokenValidation = validateToken(token);
    if (!tokenValidation.valid) {
      setError(tokenValidation.message);
      return;
    }

    if (!newPoll.question.trim() || newPoll.options.filter(opt => opt.trim()).length < 2) {
      setError("Please fill in the question and at least 2 options");
      return;
    }

    setLoading(true);
    setError("");

    const pollData = {
      question: newPoll.question.trim(),
      description: newPoll.description.trim(),
      options: newPoll.options.filter(opt => opt.trim()),
      allowMultipleVotes: newPoll.allowMultipleVotes,
      endDate: newPoll.endDate || null,
      category: newPoll.category,
    };

    try {
      console.log("Sending poll:", pollData);
      
      const response = await axios.post(
        "https://backend-bcex.onrender.com/api/polls",
        pollData,
        { headers: createAuthHeaders(token) }
      );
      
      console.log("Response:", response.data);
      
      setPolls([response.data, ...polls]);
      setNewPoll({
        question: "",
        description: "",
        options: ["", ""],
        allowMultipleVotes: false,
        endDate: "",
        category: "general",
      });
      setShowAddForm(false);
      setError("");
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `https://backend-bcex.onrender.com/api/polls/${pollId}/vote`,
        { optionIndex },
        { headers: createAuthHeaders(token) }
      );
      
      setPolls(polls.map(poll => 
        poll._id === pollId ? response.data : poll
      ));
      
      // Show success message
      alert("Vote submitted successfully!");
      setError("");
    } catch (error) {
      console.error("Failed to vote:", error);
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        setError("Failed to submit vote");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = async (pollId) => {
    try {
      const response = await axios.get(
        `https://backend-bcex.onrender.com/api/polls/${pollId}/results`,
        { headers: createAuthHeaders(token) }
      );
      
      setShowResults(prev => ({
        ...prev,
        [pollId]: response.data
      }));
    } catch (error) {
      console.error("Failed to fetch results:", error);
      setError("Failed to fetch poll results");
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      try {
        setLoading(true);
        await axios.delete(
          `https://backend-bcex.onrender.com/api/polls/${pollId}`,
          { headers: createAuthHeaders(token) }
        );
        setPolls(polls.filter(poll => poll._id !== pollId));
        setError("");
      } catch (error) {
        console.error("Failed to delete poll:", error);
        setError("Failed to delete poll");
      } finally {
        setLoading(false);
      }
    }
  };

  const addOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, ""]
    }));
  };

  const removeOption = (index) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index, value) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const getCategoryIcon = (category) => {
    const categoryInfo = pollCategories.find(c => c.value === category);
    return categoryInfo ? categoryInfo.icon : Vote;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "academic":
        return "#4ecdc4";
      case "campus":
        return "#45b7d1";
      case "events":
        return "#ff6b6b";
      case "feedback":
        return "#96ceb4";
      case "general":
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

  const isPollEnded = (poll) => {
    if (!poll.endDate) return false;
    return new Date() > new Date(poll.endDate);
  };

  const hasUserVoted = (poll) => {
    return poll.options.some(option => 
      option.votes.some(vote => vote.user === user?.id)
    );
  };

  const filteredPolls = selectedCategory === "all" 
    ? polls 
    : polls.filter(poll => poll.category === selectedCategory);

  return (
    <div className="polls-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Polls & Feedback</h1>
          <p>Participate in polls and provide feedback to help improve campus life</p>
        </div>
        {user?.role === 'admin' && (
          <button
            className="add-poll-button"
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            <Plus size={20} /> Create Poll
          </button>
        )}
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <Filter size={20} />
          <span>Filter by Category:</span>
        </div>
        <div className="filter-options">
          {pollCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.value}
                className={`filter-option ${selectedCategory === category.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <IconComponent size={16} />
                {category.label}
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

      <div className="polls-grid">
        {filteredPolls.map((poll) => {
          const CategoryIcon = getCategoryIcon(poll.category);
          const pollResults = showResults[poll._id];
          const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
          const userVoted = hasUserVoted(poll);
          const ended = isPollEnded(poll);

          return (
            <div key={poll._id} className="poll-card">
              <div className="poll-header">
                <div className="poll-category-badge" style={{ backgroundColor: getCategoryColor(poll.category) }}>
                  <CategoryIcon size={16} />
                  {pollCategories.find(c => c.value === poll.category)?.label}
                </div>
                {ended && (
                  <div className="ended-badge">
                    Ended
                  </div>
                )}
              </div>

              <div className="poll-content">
                <h3>{poll.question}</h3>
                {poll.description && (
                  <p className="poll-description">{poll.description}</p>
                )}
                
                {poll.endDate && (
                  <p className="poll-end-date">
                    <Calendar size={14} />
                    Ends: {formatDate(poll.endDate)}
                  </p>
                )}

                {pollResults ? (
                  <div className="poll-results">
                    <h4>Results</h4>
                    <div className="results-list">
                      {pollResults.results.map((result, index) => (
                        <div key={index} className="result-item">
                          <div className="result-header">
                            <span className="result-text">{result.text}</span>
                            <span className="result-stats">
                              {result.votes} votes ({result.percentage}%)
                            </span>
                          </div>
                          <div className="result-bar">
                            <div 
                              className="result-fill" 
                              style={{ width: `${result.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="total-votes">Total votes: {pollResults.totalVotes}</p>
                  </div>
                ) : (
                  <div className="poll-options">
                    {poll.options.map((option, index) => (
                      <button
                        key={index}
                        className={`poll-option ${userVoted ? 'voted' : ''}`}
                        onClick={() => !userVoted && !ended && handleVote(poll._id, index)}
                        disabled={userVoted || ended || loading}
                      >
                        <span className="option-text">{option.text}</span>
                        <span className="option-votes">{option.votes.length} votes</span>
                        {userVoted && option.votes.some(vote => vote.user === user?.id) && (
                          <CheckCircle size={16} className="voted-icon" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="poll-footer">
                <div className="poll-meta">
                  <p>
                    <strong>Created:</strong> {formatDate(poll.createdAt)}
                  </p>
                  <p>
                    <strong>By:</strong> {poll.createdBy?.name || "Admin"}
                  </p>
                  <p>
                    <strong>Total Votes:</strong> {totalVotes}
                  </p>
                </div>

                <div className="poll-actions">
                  {!pollResults && (
                    <button
                      onClick={() => handleViewResults(poll._id)}
                      className="view-results-btn"
                    >
                      <BarChart3 size={16} />
                      View Results
                    </button>
                  )}
                  {pollResults && (
                    <button
                      onClick={() => setShowResults(prev => ({ ...prev, [poll._id]: null }))}
                      className="hide-results-btn"
                    >
                      Hide Results
                    </button>
                  )}
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDeletePoll(poll._id)}
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

      {filteredPolls.length === 0 && !loading && (
        <div className="empty-state">
          <Vote size={64} />
          <h3>No polls available</h3>
          <p>Check back later for new polls!</p>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Poll</h2>
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

            <form onSubmit={handleAddPoll}>
              <div className="form-group">
                <label>Question</label>
                <input
                  type="text"
                  value={newPoll.question}
                  onChange={(e) =>
                    setNewPoll({ ...newPoll, question: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={newPoll.description}
                  onChange={(e) =>
                    setNewPoll({ ...newPoll, description: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={newPoll.category}
                  onChange={(e) =>
                    setNewPoll({ ...newPoll, category: e.target.value })
                  }
                  disabled={loading}
                >
                  {pollCategories.filter(cat => cat.value !== 'all').map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Options</label>
                {newPoll.options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                      disabled={loading}
                    />
                    {newPoll.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="remove-option-btn"
                        disabled={loading}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="add-option-btn"
                  disabled={loading}
                >
                  <Plus size={16} /> Add Option
                </button>
              </div>

              <div className="form-group">
                <label>End Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={newPoll.endDate}
                  onChange={(e) =>
                    setNewPoll({ ...newPoll, endDate: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newPoll.allowMultipleVotes}
                    onChange={(e) =>
                      setNewPoll({ ...newPoll, allowMultipleVotes: e.target.checked })
                    }
                    disabled={loading}
                  />
                  Allow multiple votes per user
                </label>
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
                  {loading ? "Creating..." : "Create Poll"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Polls; 