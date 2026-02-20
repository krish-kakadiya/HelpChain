import React, { useState, useRef, useEffect } from "react";
import "./ProfileSetup.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMe } from "../../api/authApi";
import api from "../../api/axios.js";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, loading, setUser } = useAuth();

  const fileInputRef = useRef(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
    "Web Developer", "App Developer", "Frontend Developer",
    "Backend Developer", "Full Stack Developer", "ML/DL Engineer",
    "Data Scientist", "DevOps Engineer", "Debugging", "Bug Solving",
    "Logical Problem Solving", "Cybersecurity", "Cloud Computing",
    "UI/UX Design", "Database Management", "API Development"
  ];

  // 🔥 Safe redirect (no render navigation)
  useEffect(() => {
    if (!loading && user?.isProfileCompleted) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setProfilePhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("age", formData.age);
      data.append("graduation", formData.graduation);
      data.append("github", formData.github);
      data.append("linkedin", formData.linkedin);
      data.append("technologies", JSON.stringify(selectedTechnologies));
      data.append("techStacks", JSON.stringify(selectedStacks));

      if (profileFile) {
        data.append("profilePhoto", profileFile);
      }

      await api.post("/profile/create", data);

      // 🔥 Refresh user state after profile completion
      const meRes = await getMe();
      setUser(meRes.data);

      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Profile creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        <div className="profile-header">

          <div className="profile-photo-wrap">
            <div className="profile-photo-ring">
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Profile"
                  className="profile-photo-img"
                />
              ) : (
                <div className="profile-photo-placeholder">
                  <i className="bx bxs-user"></i>
                </div>
              )}

              <button
                type="button"
                className="profile-photo-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="bx bx-camera"></i>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />

            <button
              type="button"
              className="profile-photo-text-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePhotoPreview ? "Change Photo" : "Upload Photo"}
            </button>
          </div>

          <h2>Complete Your Profile</h2>
          <p>Tell us about yourself to personalize your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">

          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="15"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label>Graduation *</label>
                <input
                  type="text"
                  name="graduation"
                  value={formData.graduation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="form-section">
            <h3>Technology Languages *</h3>
            <div className="tags-container">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  className={`tag ${selectedTechnologies.includes(tech) ? "selected" : ""}`}
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
            <h3>Tech Stack / Expertise *</h3>
            <div className="tags-container">
              {techStacks.map((stack) => (
                <button
                  key={stack}
                  type="button"
                  className={`tag ${selectedStacks.includes(stack) ? "selected" : ""}`}
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
            <h3>Social Links</h3>

            <div className="form-group">
              <label>GitHub</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Saving..." : "Complete Profile"}
            <i className="bx bx-right-arrow-alt"></i>
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;