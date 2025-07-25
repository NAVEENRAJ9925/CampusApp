import React, { useState } from 'react';
import { Plus, BookOpen, User } from 'lucide-react';
import './SkillExchange.css';

const initialSkills = [
  {
    id: 1,
    name: 'Python Programming',
    description: 'Learn Python basics and problem solving.',
    teacher: 'Alice Johnson',
    availableSlots: 3,
    bookings: []
  },
  {
    id: 2,
    name: 'Graphic Design',
    description: 'Introduction to Photoshop and Illustrator.',
    teacher: 'Bob Smith',
    availableSlots: 2,
    bookings: []
  }
];

const SkillExchange = () => {
  const [skills, setSkills] = useState(initialSkills);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    teacher: '',
    availableSlots: 1
  });
  const [bookingName, setBookingName] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const handleAddSkill = (e) => {
    e.preventDefault();
    setSkills([
      {
        id: Date.now(),
        ...newSkill,
        bookings: []
      },
      ...skills
    ]);
    setNewSkill({ name: '', description: '', teacher: '', availableSlots: 1 });
    setShowAddForm(false);
  };

  const handleBookSession = (skillId) => {
    if (!bookingName) return;
    setSkills(skills.map(skill => {
      if (skill.id === skillId && skill.availableSlots > skill.bookings.length) {
        return {
          ...skill,
          bookings: [...skill.bookings, bookingName]
        };
      }
      return skill;
    }));
    setBookingName('');
    setSelectedSkill(null);
  };

  return (
    <div className="skill-exchange-container">
      <h2><BookOpen size={24} /> Skill Exchange Marketplace</h2>
      <p>List a skill you can teach, or book a peer learning session!</p>
      <button className="add-skill-btn" onClick={() => setShowAddForm(!showAddForm)}>
        <Plus size={18} /> {showAddForm ? 'Cancel' : 'List a Skill'}
      </button>
      {showAddForm && (
        <form className="add-skill-form" onSubmit={handleAddSkill}>
          <input
            type="text"
            placeholder="Skill Name"
            value={newSkill.name}
            onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newSkill.description}
            onChange={e => setNewSkill({ ...newSkill, description: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Your Name"
            value={newSkill.teacher}
            onChange={e => setNewSkill({ ...newSkill, teacher: e.target.value })}
            required
          />
          <input
            type="number"
            min={1}
            placeholder="Available Slots"
            value={newSkill.availableSlots}
            onChange={e => setNewSkill({ ...newSkill, availableSlots: Number(e.target.value) })}
            required
          />
          <button type="submit">Add Skill</button>
        </form>
      )}
      <div className="skills-list">
        {skills.length === 0 && <p>No skills listed yet.</p>}
        {skills.map(skill => (
          <div className="skill-card" key={skill.id}>
            <h3>{skill.name}</h3>
            <p>{skill.description}</p>
            <div className="skill-meta">
              <span><User size={16} /> {skill.teacher}</span>
              <span>Slots: {skill.availableSlots - skill.bookings.length} / {skill.availableSlots}</span>
            </div>
            <div className="bookings">
              <strong>Booked by:</strong> {skill.bookings.length === 0 ? 'None' : skill.bookings.join(', ')}
            </div>
            {skill.availableSlots > skill.bookings.length && (
              <div className="book-session">
                {selectedSkill === skill.id ? (
                  <form onSubmit={e => { e.preventDefault(); handleBookSession(skill.id); }}>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={bookingName}
                      onChange={e => setBookingName(e.target.value)}
                      required
                    />
                    <button type="submit">Book</button>
                  </form>
                ) : (
                  <button onClick={() => setSelectedSkill(skill.id)}>Book Session</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillExchange; 