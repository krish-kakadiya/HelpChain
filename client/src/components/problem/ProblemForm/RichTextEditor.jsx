import React, { useRef, useState, useEffect } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ onContentChange }) => {
  const editorRef = useRef(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [activeFormats, setActiveFormats] = useState({});
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveFormats();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const updateActiveFormats = () => {
    const formats = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    };
    setActiveFormats(formats);
  };

  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateActiveFormats();
    onContentChange(editorRef.current.innerHTML);
  };

  const applyHeading = (tag) => {
    applyStyle('formatBlock', tag);
    setShowHeadingMenu(false);
  };

  const applyList = (type) => {
    applyStyle(type);
    setShowListMenu(false);
  };

  const insertCodeBlock = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    const codeBlock = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = selectedText || 'Your code here...';
    codeBlock.appendChild(code);
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(codeBlock);
    
    // Add a paragraph after code block for continued typing
    const para = document.createElement('p');
    para.innerHTML = '<br>';
    codeBlock.parentNode.insertBefore(para, codeBlock.nextSibling);
    
    editorRef.current.focus();
    onContentChange(editorRef.current.innerHTML);
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    
    if (rows && cols) {
      let tableHTML = '<table class="editor-table"><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += i === 0 ? '<th>Header</th>' : '<td>Cell</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table><p><br></p>';
      
      document.execCommand('insertHTML', false, tableHTML);
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>&nbsp;`;
      document.execCommand('insertHTML', false, linkHTML);
      setShowLinkModal(false);
      setLinkUrl('');
      setLinkText('');
      editorRef.current.focus();
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const handleInsertImage = () => {
    if (imageUrl) {
      const imgHTML = `<img src="${imageUrl}" alt="${imageAlt}" class="editor-image" /><p><br></p>`;
      document.execCommand('insertHTML', false, imgHTML);
      setShowImageModal(false);
      setImageUrl('');
      setImageAlt('');
      editorRef.current.focus();
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const insertHorizontalRule = () => {
    document.execCommand('insertHTML', false, '<hr/><p><br></p>');
    onContentChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rte-container">
      <div className="rte-toolbar">
        {/* Headings Dropdown */}
        <div className="rte-dropdown">
          <button 
            type="button" 
            className="rte-btn rte-btn-dropdown"
            onClick={() => {
              setShowHeadingMenu(!showHeadingMenu);
              setShowListMenu(false);
            }}
          >
            <span className="rte-btn-text">Heading</span>
            <span className="rte-dropdown-arrow">▼</span>
          </button>
          {showHeadingMenu && (
            <div className="rte-dropdown-menu">
              <button type="button" onClick={() => applyHeading('p')} className="rte-dropdown-item">
                <span className="rte-normal">Normal</span>
              </button>
              <button type="button" onClick={() => applyHeading('h1')} className="rte-dropdown-item">
                <span className="rte-h1">Heading 1</span>
              </button>
              <button type="button" onClick={() => applyHeading('h2')} className="rte-dropdown-item">
                <span className="rte-h2">Heading 2</span>
              </button>
              <button type="button" onClick={() => applyHeading('h3')} className="rte-dropdown-item">
                <span className="rte-h3">Heading 3</span>
              </button>
            </div>
          )}
        </div>

        <div className="rte-divider"></div>

        {/* Text Formatting Group */}
        <div className="rte-group">
          <button 
            type="button" 
            className={`rte-btn ${activeFormats.bold ? 'rte-btn-active' : ''}`}
            title="Bold (Ctrl+B)"
            onClick={() => applyStyle('bold')}
          >
            <span className="rte-icon-bold">B</span>
          </button>
          <button 
            type="button" 
            className={`rte-btn ${activeFormats.italic ? 'rte-btn-active' : ''}`}
            title="Italic (Ctrl+I)"
            onClick={() => applyStyle('italic')}
          >
            <span className="rte-icon-italic">I</span>
          </button>
          <button 
            type="button" 
            className={`rte-btn ${activeFormats.underline ? 'rte-btn-active' : ''}`}
            title="Underline (Ctrl+U)"
            onClick={() => applyStyle('underline')}
          >
            <span className="rte-icon-underline">U</span>
          </button>
          <button 
            type="button" 
            className={`rte-btn ${activeFormats.strikeThrough ? 'rte-btn-active' : ''}`}
            title="Strikethrough"
            onClick={() => applyStyle('strikeThrough')}
          >
            <span className="rte-icon-strike">S</span>
          </button>
        </div>

        <div className="rte-divider"></div>

        {/* Lists Dropdown */}
        <div className="rte-dropdown">
          <button 
            type="button" 
            className={`rte-btn rte-btn-dropdown ${activeFormats.insertUnorderedList || activeFormats.insertOrderedList ? 'rte-btn-active' : ''}`}
            onClick={() => {
              setShowListMenu(!showListMenu);
              setShowHeadingMenu(false);
            }}
          >
            <span className="rte-btn-text">Lists</span>
            <span className="rte-dropdown-arrow">▼</span>
          </button>
          {showListMenu && (
            <div className="rte-dropdown-menu">
              <button 
                type="button" 
                onClick={() => applyList('insertUnorderedList')} 
                className="rte-dropdown-item"
              >
                <span>• Bulleted List</span>
              </button>
              <button 
                type="button" 
                onClick={() => applyList('insertOrderedList')} 
                className="rte-dropdown-item"
              >
                <span>1. Numbered List</span>
              </button>
            </div>
          )}
        </div>

        <div className="rte-divider"></div>

        {/* Code Group */}
        <div className="rte-group">
          <button 
            type="button" 
            className="rte-btn" 
            title="Code Block"
            onClick={insertCodeBlock}
          >
            <span className="rte-code-icon">{'<>'}</span>
          </button>
        </div>

        <div className="rte-divider"></div>

        {/* Insert Group */}
        <div className="rte-group">
          <button 
            type="button" 
            className="rte-btn" 
            title="Insert Link"
            onClick={() => setShowLinkModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/>
            </svg>
          </button>
          <button 
            type="button" 
            className="rte-btn" 
            title="Insert Image"
            onClick={() => setShowImageModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 01.03-.03l6.077-6.078a1.75 1.75 0 012.412-.06L14.5 10.31V2.75a.25.25 0 00-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 01.344-.009l4.298 3.889v.917a.25.25 0 01-.25.25zm1.75-2.5v-9A1.75 1.75 0 0014.25 1H1.75A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-1.75zM5.5 6a.5.5 0 11-1 0 .5.5 0 011 0zM7 6a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </button>
          <button 
            type="button" 
            className="rte-btn" 
            title="Insert Table"
            onClick={insertTable}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v3.5h5V1.5h-4.75zm5 5h-5v3h5v-3zm-5 4.5v3.5c0 .138.112.25.25.25H6.75v-3.75h-5zm6.5 3.75h4.75a.25.25 0 00.25-.25v-3.5h-5v3.75zm5-5.25h-5v-3h5v3zm0-4.5h-5V1.5h4.75a.25.25 0 01.25.25v3.5z"/>
            </svg>
          </button>
          <button 
            type="button" 
            className="rte-btn" 
            title="Horizontal Rule"
            onClick={insertHorizontalRule}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 8a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75A.75.75 0 012 8z"/>
            </svg>
          </button>
        </div>
      </div>

      <div 
        ref={editorRef}
        className="rte-editor"
        contentEditable="true"
        onInput={(e) => {
          onContentChange(e.currentTarget.innerHTML);
          updateActiveFormats();
        }}
        onClick={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        suppressContentEditableWarning={true}
      >
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="rte-modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="rte-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rte-modal-header">
              <h3>Insert Link</h3>
              <button 
                type="button" 
                className="rte-modal-close"
                onClick={() => setShowLinkModal(false)}
              >
                ×
              </button>
            </div>
            <div className="rte-modal-body">
              <div className="rte-modal-field">
                <label>Link Text:</label>
                <input 
                  type="text" 
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  autoFocus
                />
              </div>
              <div className="rte-modal-field">
                <label>URL:</label>
                <input 
                  type="text" 
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  onKeyPress={(e) => e.key === 'Enter' && handleInsertLink()}
                />
              </div>
            </div>
            <div className="rte-modal-footer">
              <button 
                type="button" 
                className="rte-modal-btn rte-modal-btn-cancel"
                onClick={() => setShowLinkModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="rte-modal-btn rte-modal-btn-primary"
                onClick={handleInsertLink}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="rte-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="rte-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rte-modal-header">
              <h3>Insert Image</h3>
              <button 
                type="button" 
                className="rte-modal-close"
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
            </div>
            <div className="rte-modal-body">
              <div className="rte-modal-field">
                <label>Image URL:</label>
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleInsertImage()}
                />
              </div>
              <div className="rte-modal-field">
                <label>Alt Text:</label>
                <input 
                  type="text" 
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Image description"
                />
              </div>
            </div>
            <div className="rte-modal-footer">
              <button 
                type="button" 
                className="rte-modal-btn rte-modal-btn-cancel"
                onClick={() => setShowImageModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="rte-modal-btn rte-modal-btn-primary"
                onClick={handleInsertImage}
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showHeadingMenu || showListMenu) && (
        <div 
          className="rte-dropdown-backdrop"
          onClick={() => {
            setShowHeadingMenu(false);
            setShowListMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default RichTextEditor;