import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./ProfileSetup.css";
import { useNavigate } from "react-router-dom";

const ProfileSetup = ({ onComplete }) => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/dashboard");
  };
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    graduation: "",
    github: "",
    linkedin: "",
  });

  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedStacks, setSelectedStacks] = useState([]);

  const technologies = [
    "React", "HTML", "CSS", "JavaScript", "TypeScript",
    "Python", "Java", "C++", "C", "Node.js",
    "Angular", "Vue.js", "PHP", "Ruby", "Go",
    "Swift", "Kotlin", "SQL", "MongoDB", "Docker"
  ];

  const techStacks = [
    "Web Developer",
    "App Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "ML/DL Engineer",
    "Data Scientist",
    "DevOps Engineer",
    "Debugging",
    "Bug Solving",
    "Logical Problem Solving",
    "Cybersecurity",
    "Cloud Computing",
    "UI/UX Design",
    "Database Management",
    "API Development"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleTechnology = (tech) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const toggleStack = (stack) => {
    setSelectedStacks(prev =>
      prev.includes(stack)
        ? prev.filter(s => s !== stack)
        : [...prev, stack]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.age || !formData.graduation) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedTechnologies.length === 0) {
      alert("Please select at least one technology");
      return;
    }

    if (selectedStacks.length === 0) {
      alert("Please select at least one tech stack");
      return;
    }

    const profileData = {
      ...formData,
      technologies: selectedTechnologies,
      techStacks: selectedStacks
    };

    console.log("Profile Data:", profileData);
    
    if (onComplete) {
      onComplete(profileData);
    }
  };

  // Use Portal to render at body level, escaping any parent containers
  return createPortal(
    <div className="profile-overlay">
      <div className="profile-container">
        <div className="profile-header">
          <div className="header-icon">
            <i className='bx bxs-user-circle'></i>
          </div>
          <h2>Complete Your Profile</h2>
          <p>Tell us about yourself to personalize your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age <span className="required">*</span></label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  min="15"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label>Graduation <span className="required">*</span></label>
                <input
                  type="text"
                  name="graduation"
                  value={formData.graduation}
                  onChange={handleInputChange}
                  placeholder="e.g., B.Tech in CSE"
                  required
                />
              </div>
            </div>
          </div>

          {/* Technology Languages */}
          <div className="form-section">
            <h3>Technology Languages <span className="required">*</span></h3>
            <p className="section-subtitle">Select the technologies you're familiar with</p>
            
            <div className="tags-container">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  className={`tag ${selectedTechnologies.includes(tech) ? 'selected' : ''}`}
                  onClick={() => toggleTechnology(tech)}
                >
                  {tech}
                  {selectedTechnologies.includes(tech) && (
                    <span className="tag-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="form-section">
            <h3>Tech Stack / Expertise <span className="required">*</span></h3>
            <p className="section-subtitle">Select your areas of expertise</p>
            
            <div className="tags-container">
              {techStacks.map((stack) => (
                <button
                  key={stack}
                  type="button"
                  className={`tag ${selectedStacks.includes(stack) ? 'selected' : ''}`}
                  onClick={() => toggleStack(stack)}
                >
                  {stack}
                  {selectedStacks.includes(stack) && (
                    <span className="tag-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="form-section">
            <h3>Social Links <span className="optional">(Optional)</span></h3>
            
            <div className="form-group">
              <label>
                <i className='bx bxl-github'></i> GitHub Profile
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div className="form-group">
              <label>
                <i className='bx bxl-linkedin'></i> LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
          </div>

          <button onClick={handleProfile} type="submit" className="submit-btn">
            Complete Profile
            <i className='bx bx-right-arrow-alt'></i>
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProfileSetup;