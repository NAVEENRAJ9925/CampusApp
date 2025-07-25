import React, { useState } from 'react';
import { Menu, Sun, Moon, User } from 'lucide-react';
import './TopNavbar.css';

const initialProfile = {
  name: 'John Doe',
  role: 'Computer Science',
  age: '',
  rollNo: '',
  dept: '',
  section: '',
  mobile: '',
  year: '1st',
  gender: ''
};

const TopNavbar = ({ onToggleSidebar, theme, onToggleTheme }) => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  const handleProfileClick = () => setShowProfileForm(true);
  const handleClose = () => setShowProfileForm(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowProfileForm(false);
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="greeting">
          <h2>Welcome back, Student!</h2>
          <p>Have a productive day at Sri Eshwar College</p>
        </div>
      </div>
      <div className="navbar-right">
        <button className="theme-toggle" onClick={onToggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="user-profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{profile.name}</span>
            <span className="user-role">{profile.role}</span>
          </div>
        </div>
      </div>
      {showProfileForm && (
        <div className="profile-popup-overlay">
          <div className="profile-popup">
            <button className="close-btn" onClick={handleClose}>&times;</button>
            <h3>Edit Profile</h3>
            <form className="profile-form" onSubmit={handleSubmit}>
              <label>Name
                <input name="name" value={profile.name} onChange={handleChange} required />
              </label>
              <label>Age
                <input name="age" value={profile.age} onChange={handleChange} type="number" min="16" max="30" required />
              </label>
              <label>Roll No
                <input name="rollNo" value={profile.rollNo} onChange={handleChange} required />
              </label>
              <label>Dept
                <input name="dept" value={profile.dept} onChange={handleChange} required />
              </label>
              <label>Section
                <input name="section" value={profile.section} onChange={handleChange} required />
              </label>
              <label>Mobile No
                <input name="mobile" value={profile.mobile} onChange={handleChange} type="tel" pattern="[0-9]{10}" required />
              </label>
              <label>Year
                <select name="year" value={profile.year} onChange={handleChange} required>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>
              </label>
              <label>Gender
                <select name="gender" value={profile.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNavbar;