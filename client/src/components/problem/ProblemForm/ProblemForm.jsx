import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import './ProblemForm.css';

const ProblemForm = () => {
  const [formData, setFormData] = useState({
    type: 'Troubleshooting / Debugging',
    title: '',
    body: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (htmlContent) => {
    setFormData(prev => ({ ...prev, body: htmlContent }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim()) && formData.tags.length < 5) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This 'formData' object is exactly what you send to your MongoDB/SQL DB
    console.log("Submitting to HelpChain DB:", formData);
    alert("Check console to see the structured data for your Database!");
  };

  return (
    <div className="hc-page-layout">
      <div className="hc-form-card">
        <h1 className="hc-main-title">Ask a public question</h1>

        <form onSubmit={handleSubmit} className="hc-form">
          {/* Section: Type */}
          <div className="hc-input-group">
            <label className="hc-label">Type<span className="hc-req">*</span></label>
            <select 
              name="type" 
              className="hc-select"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option>Troubleshooting / Debugging</option>
              <option>Project Brainstorming</option>
              <option>Code Review Request</option>
            </select>
          </div>

          {/* Section: Title */}
          <div className="hc-input-group">
            <label className="hc-label">Title<span className="hc-req">*</span></label>
            <p className="hc-helper">Be specific and imagine you’re asking a question to another person.</p>
            <input 
              type="text" 
              name="title" 
              className="hc-input"
              placeholder="e.g. How to implement JWT in a React and Node.js app?" 
              required
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Section: Body (Modular Editor) */}
          <div className="hc-input-group">
            <label className="hc-label">Body<span className="hc-req">*</span></label>
            <p className="hc-helper">Include all information someone would need to answer your question.</p>
            <RichTextEditor onContentChange={handleBodyChange} />
          </div>

          {/* Section: Tags */}
          <div className="hc-input-group">
            <label className="hc-label">Tags<span className="hc-req">*</span></label>
            <p className="hc-helper">Add up to 5 tags to describe what your question is about.</p>
            <div className="hc-tag-box">
              {formData.tags.map(tag => (
                <span key={tag} className="hc-tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hc-tag-remove">×</button>
                </span>
              ))}
              <input 
                type="text" 
                className="hc-tag-input"
                placeholder={formData.tags.length < 5 ? "Add tags..." : "Max 5 tags"}
                value={tagInput}
                disabled={formData.tags.length >= 5}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
            </div>
          </div>

          <button type="submit" className="hc-submit-btn">Post your question</button>
        </form>
      </div>
    </div>
  );
};

export default ProblemForm;