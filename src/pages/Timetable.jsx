import React, { useState, useEffect } from "react";
import { Plus, X, Clock, MapPin, Calendar } from "lucide-react";
import "./Timetable.css";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { handleApiError, validateToken, createAuthHeaders } from '../utils/errorHandler';

const Timetable = () => {
  const [schedule, setSchedule] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newClass, setNewClass] = useState({
    courseName: "",
    instructor: "",
    day: "monday",
    period: 1,
    room: "",
  });
  const { token, user } = useAuth();

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // Simplified 7-period timetable from 8:40 AM to 4:10 PM
  const periods = [
    { period: 1, startTime: "08:40", endTime: "09:30" },
    { period: 2, startTime: "09:30", endTime: "10:20" },
    { period: 3, startTime: "10:20", endTime: "11:10" },
    { period: 4, startTime: "11:10", endTime: "12:00" },
    { period: 5, startTime: "12:00", endTime: "12:50" },
    { period: 6, startTime: "12:50", endTime: "13:40" },
    { period: 7, startTime: "13:40", endTime: "14:30" }
  ];

  useEffect(() => {
    if (token) {
    fetchTimetable();
    }
  }, [token]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError("");
      
      const tokenValidation = validateToken(token);
      if (!tokenValidation.valid) {
        setError(tokenValidation.message);
        setSchedule({ courses: [] });
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/timetable",
        { headers: createAuthHeaders(token) }
      );
      console.log("Fetched timetable:", response.data);
      
      if (response.data && response.data.courses) {
        setSchedule(response.data);
        if (response.data.courses.length === 0) {
          setError("No classes found. Add your first class!");
        }
      } else {
        setSchedule({ courses: [] });
        setError("No classes found. Add your first class!");
      }
    } catch (error) {
      handleApiError(error, setError);
      setSchedule({ courses: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    
    const tokenValidation = validateToken(token);
    if (!tokenValidation.valid) {
      setError(tokenValidation.message);
      return;
    }

    if (!newClass.courseName.trim() || !newClass.instructor.trim() || !newClass.room.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    // Get the selected period's start and end times
    const selectedPeriod = periods.find(p => p.period === newClass.period);
    
    const classData = {
      courseName: newClass.courseName.trim(),
      instructor: newClass.instructor.trim(),
      day: newClass.day,
      period: newClass.period,
      startTime: selectedPeriod.startTime,
      endTime: selectedPeriod.endTime,
      room: newClass.room.trim(),
    };

    try {
      console.log("Sending class:", classData);
      console.log("Token:", token);
      
      const response = await axios.post(
        "http://localhost:8000/api/timetable",
        {
          semester: "Fall 2024",
          year: 2024,
          courses: [classData]
        },
        { headers: createAuthHeaders(token) }
      );
      
      console.log("Response:", response.data);
      
      setSchedule(response.data);
      setNewClass({
        courseName: "",
        instructor: "",
        day: "monday",
        period: 1,
        room: "",
      });
      setShowAddForm(false);
      setError("");
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async (classId, updatedClass) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8000/api/timetable/${classId}`,
        updatedClass,
        {
        headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSchedule(response.data);
      setError("");
    } catch (error) {
      console.error("Failed to update class:", error);
      setError("Failed to update class");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        setLoading(true);
        await axios.delete(
          `http://localhost:8000/api/timetable/${classId}`,
          {
          headers: { Authorization: `Bearer ${token}` }
          }
        );
        await fetchTimetable();
        setError("");
      } catch (error) {
        console.error("Failed to delete class:", error);
        setError("Failed to delete class");
      } finally {
        setLoading(false);
      }
    }
  };

  const getClassesForDay = (day) => {
    return schedule.courses?.filter(cls => cls.day === day) || [];
  };

  const formatTime = (time) => {
    return time.replace(":", ".");
  };

  return (
    <div className="timetable-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Class Timetable</h1>
          <p>Manage your class schedule and view upcoming sessions</p>
        </div>
        <button
          className="add-class-button"
          onClick={() => setShowAddForm(true)}
          disabled={loading}
        >
          <Plus size={20} /> Add Class
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

      <div className="schedule-grid">
        {days.map((day) => (
          <div key={day} className="day-column">
            <div className="day-header">
              <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            </div>
            <div className="period-slots">
              {periods.map((period) => {
                const classesAtPeriod = getClassesForDay(day).filter(
                  cls => cls.period === period.period
                );
                return (
                  <div key={period.period} className="period-slot">
                    <div className="period-label">
                      <Clock size={12} />
                      Period {period.period}
                      <br />
                      <small>{period.startTime} - {period.endTime}</small>
                    </div>
                    {classesAtPeriod.map((cls) => (
                      <div key={cls._id} className="class-block">
                        <div className="class-info">
                          <h4>{cls.courseName}</h4>
                          <p>
                            <Clock size={14} />
                            {cls.startTime} - {cls.endTime}
                          </p>
                          <p>
                            <MapPin size={14} />
                            {cls.room}
                          </p>
                          <p>Instructor: {cls.instructor}</p>
                        </div>
                        <div className="class-actions">
                          <button
                            onClick={() => handleUpdateClass(cls._id, cls)}
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls._id)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {(!schedule.courses || schedule.courses.length === 0) && !loading && (
        <div className="empty-state">
          <Calendar size={64} />
          <h3>No classes scheduled</h3>
          <p>Add your first class to get started</p>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Class</h2>
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

            <form onSubmit={handleAddClass}>
            <div className="form-group">
              <label>Course Name</label>
              <input
                type="text"
                value={newClass.courseName}
                  onChange={(e) =>
                    setNewClass({ ...newClass, courseName: e.target.value })
                  }
                required
                  disabled={loading}
              />
            </div>

            <div className="form-group">
                <label>Instructor</label>
              <input
                type="text"
                  value={newClass.instructor}
                  onChange={(e) =>
                    setNewClass({ ...newClass, instructor: e.target.value })
                  }
                required
                  disabled={loading}
              />
            </div>

              <div className="form-group">
                <label>Day</label>
                <select
                  value={newClass.day}
                  onChange={(e) =>
                    setNewClass({ ...newClass, day: e.target.value })
                  }
                  disabled={loading}
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Period</label>
                <select
                  value={newClass.period}
                  onChange={(e) =>
                    setNewClass({ ...newClass, period: parseInt(e.target.value) })
                  }
                  required
                  disabled={loading}
                >
                  {periods.map((period) => (
                    <option key={period.period} value={period.period}>
                      Period {period.period} ({period.startTime} - {period.endTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Room</label>
                <input
                  type="text"
                  value={newClass.room}
                  onChange={(e) =>
                    setNewClass({ ...newClass, room: e.target.value })
                  }
                  required
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
                  {loading ? "Adding..." : "Add Class"}
                </button>
            </div>
          </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;