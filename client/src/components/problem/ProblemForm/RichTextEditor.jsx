import React, { useRef } from 'react';

const RichTextEditor = ({ onContentChange }) => {
  const editorRef = useRef(null);

  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
    onContentChange(editorRef.current.innerHTML);
  };

  return (
    <div className="hc-editor-container">
      <div className="hc-toolbar">
        <button type="button" title="Bold" onClick={() => applyStyle('bold')}><b>B</b></button>
        <button type="button" title="Italic" onClick={() => applyStyle('italic')}><i>I</i></button>
        <button type="button" title="Header" onClick={() => applyStyle('formatBlock', 'h3')}>H</button>
        <div className="hc-divider"></div>
        <button type="button" title="List" onClick={() => applyStyle('insertUnorderedList')}>• List</button>
        <button type="button" title="Code" onClick={() => applyStyle('formatBlock', 'pre')}>{"< >"}</button>
        <button type="button" title="Link" onClick={() => {
          const url = prompt("Enter URL:");
          if(url) applyStyle('createLink', url);
        }}>Link</button>
      </div>
      <div 
        ref={editorRef}
        className="hc-editor-body"
        contentEditable="true"
        onInput={(e) => onContentChange(e.currentTarget.innerHTML)}
        placeholder="Type your question body here..."
      ></div>
    </div>
  );
};

export default RichTextEditor;