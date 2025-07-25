import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import './Timetable.css';

const Timetable = () => {
  const [schedule, setSchedule] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({
    subject: '',
    time: '',
    location: '',
    day: 'monday',
    color: '#ff6b35'
  });

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const subjectColors = [
    '#ff6b35', '#3498db', '#2ecc71', '#e74c3c', '#f39c12',
    '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6'
  ];

  // Mock data
  const mockSchedule = {
    monday: [
      { id: 1, subject: 'Data Structures', time: '9:00 AM', location: 'Room 101', color: '#3498db' },
      { id: 2, subject: 'Computer Networks', time: '11:00 AM', location: 'Room 205', color: '#2ecc71' },
      { id: 3, subject: 'Database Systems', time: '2:00 PM', location: 'Lab 3', color: '#e74c3c' }
    ],
    tuesday: [
      { id: 4, subject: 'Operating Systems', time: '10:00 AM', location: 'Room 102', color: '#f39c12' },
      { id: 5, subject: 'Software Engineering', time: '1:00 PM', location: 'Room 301', color: '#9b59b6' },
      { id: 6, subject: 'Web Development', time: '3:00 PM', location: 'Lab 1', color: '#1abc9c' }
    ],
    wednesday: [
      { id: 7, subject: 'Machine Learning', time: '9:00 AM', location: 'Room 201', color: '#34495e' },
      { id: 8, subject: 'Data Structures Lab', time: '2:00 PM', location: 'Lab 2', color: '#3498db' }
    ],
    thursday: [
      { id: 9, subject: 'Algorithms', time: '10:00 AM', location: 'Room 103', color: '#e67e22' },
      { id: 10, subject: 'Computer Graphics', time: '12:00 PM', location: 'Lab 4', color: '#95a5a6' },
      { id: 11, subject: 'Project Work', time: '3:00 PM', location: 'Room 401', color: '#ff6b35' }
    ],
    friday: [
      { id: 12, subject: 'Compiler Design', time: '9:00 AM', location: 'Room 202', color: '#2ecc71' },
      { id: 13, subject: 'Artificial Intelligence', time: '11:00 AM', location: 'Room 302', color: '#e74c3c' }
    ],
    saturday: [
      { id: 14, subject: 'Seminar', time: '10:00 AM', location: 'Auditorium', color: '#f39c12' }
    ]
  };

  useEffect(() => {
    setSchedule(mockSchedule);
  }, []);

  const handleAddClass = (e) => {
    e.preventDefault();
    const classItem = {
      id: Date.now(),
      ...newClass
    };
    
    setSchedule(prev => ({
      ...prev,
      [newClass.day]: [...(prev[newClass.day] || []), classItem].sort((a, b) => 
        timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time)
      )
    }));
    
    setNewClass({
      subject: '',
      time: '',
      location: '',
      day: 'monday',
      color: '#ff6b35'
    });
    setShowAddForm(false);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setNewClass(classItem);
    setShowAddForm(true);
  };

  const handleUpdateClass = (e) => {
    e.preventDefault();
    setSchedule(prev => {
      const updatedSchedule = { ...prev };
      
      // Remove from old day if day changed
      if (editingClass.day !== newClass.day) {
        updatedSchedule[editingClass.day] = updatedSchedule[editingClass.day].filter(
          cls => cls.id !== editingClass.id
        );
      }
      
      // Update or add to new day
      const daySchedule = updatedSchedule[newClass.day] || [];
      const existingIndex = daySchedule.findIndex(cls => cls.id === editingClass.id);
      
      if (existingIndex >= 0) {
        daySchedule[existingIndex] = { ...newClass, id: editingClass.id };
      } else {
        daySchedule.push({ ...newClass, id: editingClass.id });
      }
      
      updatedSchedule[newClass.day] = daySchedule.sort((a, b) => 
        timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time)
      );
      
      return updatedSchedule;
    });
    
    setEditingClass(null);
    setNewClass({
      subject: '',
      time: '',
      location: '',
      day: 'monday',
      color: '#ff6b35'
    });
    setShowAddForm(false);
  };

  const handleDeleteClass = (day, classId) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(cls => cls.id !== classId)
    }));
  };

  const formatDay = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getTimeSlotClasses = (day, time) => {
    return schedule[day]?.filter(cls => cls.time === time) || [];
  };

  return (
    <div className="timetable-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Class Timetable</h1>
          <p>Organize your weekly schedule and never miss a class</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Add Class
        </button>
      </div>

      <div className="timetable-container">
        <div className="timetable-grid">
          <div className="time-header">Time</div>
          {days.map(day => (
            <div key={day} className="day-header">
              {formatDay(day)}
            </div>
          ))}
          
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div className="time-slot">{time}</div>
              {days.map(day => (
                <div key={`${day}-${time}`} className="schedule-cell">
                  {getTimeSlotClasses(day, time).map(classItem => (
                    <div 
                      key={classItem.id}
                      className="class-item"
                      style={{ backgroundColor: classItem.color }}
                    >
                      <div className="class-header">
                        <h4>{classItem.subject}</h4>
                        <div className="class-actions">
                          <button 
                            className="action-btn"
                            onClick={() => handleEditClass(classItem)}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="action-btn"
                            onClick={() => handleDeleteClass(day, classItem.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="class-details">
                        <div className="detail-item">
                          <Clock size={12} />
                          <span>{classItem.time}</span>
                        </div>
                        <div className="detail-item">
                          <MapPin size={12} />
                          <span>{classItem.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="timetable-legend">
        <h3>Subject Legend</h3>
        <div className="legend-items">
          {Object.entries(schedule).map(([day, classes]) => 
            classes.map(classItem => (
              <div key={classItem.id} className="legend-item">
                <div 
                  className="legend-color"
                  style={{ backgroundColor: classItem.color }}
                ></div>
                <span>{classItem.subject}</span>
              </div>
            ))
          ).flat().filter((item, index, self) => 
            index === self.findIndex(i => i.key === item.key)
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingClass(null);
                  setNewClass({
                    subject: '',
                    time: '',
                    location: '',
                    day: 'monday',
                    color: '#ff6b35'
                  });
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={editingClass ? handleUpdateClass : handleAddClass}>
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newClass.subject}
                  onChange={(e) => setNewClass({
                    ...newClass,
                    subject: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Day</label>
                  <select
                    className="form-select"
                    value={newClass.day}
                    onChange={(e) => setNewClass({
                      ...newClass,
                      day: e.target.value
                    })}
                  >
                    {days.map(day => (
                      <option key={day} value={day}>
                        {formatDay(day)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <select
                    className="form-select"
                    value={newClass.time}
                    onChange={(e) => setNewClass({
                      ...newClass,
                      time: e.target.value
                    })}
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>
                        {time}
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
                  placeholder="Room number or location"
                  value={newClass.location}
                  onChange={(e) => setNewClass({
                    ...newClass,
                    location: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Subject Color</label>
                <div className="color-picker">
                  {subjectColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${newClass.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewClass({
                        ...newClass,
                        color: color
                      })}
                    />
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingClass(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  {editingClass ? 'Update Class' : 'Add Class'}
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