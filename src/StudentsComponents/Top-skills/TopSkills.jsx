import React, { useState, useEffect, useContext } from 'react';
import './TopSkills.css';
import DataContext from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

const TopSkills = () => {
  const navigate = useNavigate();
  const { topSkills, selectedSkills, setSelectedSkills, user } = useContext(DataContext);
console.log(selectedSkills, "selected Skills ");
  useEffect(() => {
    document.getElementById('submitBtn').disabled = selectedSkills.length !== 5;
  }, [selectedSkills]);

  const handleCheckboxChange = (skill) => {
    setSelectedSkills((prevSelectedSkills) => {
      if (prevSelectedSkills.includes(skill)) {
        return prevSelectedSkills.filter((s) => s !== skill);
      }
      if (prevSelectedSkills.length < 5) {
        return [...prevSelectedSkills, skill];
      }
      return prevSelectedSkills;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSkills.length > 5) {
      alert('You can only select up to 5 skills.');
      return;
    }

    const formData = new FormData();
    formData.append('name', user);
    selectedSkills.forEach(skill => formData.append('skill', skill));

    try {
      const response = await fetch('http://localhost:8000/flask/top_skills', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Submitted skills: ${selectedSkills.join(', ')}`);
        navigate('/proficiency');
      } else {
        alert('Failed to submit the skills.');
      }
    } catch (error) {
      console.error('Error submitting the skills:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="top-skills-container">
      <h1 className='top-skills-heading'>Select Your Top 5 Skills</h1>
      <form className="top-skills-form" onSubmit={handleSubmit}>
        {topSkills.map((skill) => (
          <div className="top-skills-item" key={skill}>
            <input
              type="checkbox"
              name="skill"
              value={skill}
              id={skill}
              checked={selectedSkills.includes(skill)}
              onChange={() => handleCheckboxChange(skill)}
              disabled={selectedSkills.length === 5 && !selectedSkills.includes(skill)}
            />
            <label htmlFor={skill}>{skill}</label>
          </div>
        ))}
        <input type="hidden" name="name" value={user} />
        <div className="top-skills-submit-btn-wrapper">
          <button type="submit" className="top-skills-submit-btn" id="submitBtn" disabled>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopSkills;
