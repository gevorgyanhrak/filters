import React, { useRef } from 'react';
import './Toolbar.css';

const Toolbar = ({ onAddBlock, onSave, onLoad, blockCount, connectionCount }) => {
  const fileInputRef = useRef(null);

  const handleLoadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h1 className="toolbar-title">Infinite Canvas</h1>
        <div className="toolbar-stats">
          <div className="toolbar-count">
            <span className="count-badge">{blockCount}</span> blocks
          </div>
          <div className="toolbar-count">
            <span className="count-badge connections">{connectionCount}</span> connections
          </div>
        </div>
      </div>
      
      <div className="toolbar-section toolbar-actions">
        <button 
          className="toolbar-btn add-block-btn"
          onClick={onAddBlock}
          title="Add AI Block"
        >
          <span className="btn-icon">✨</span>
          Add Block
        </button>
        
        <div className="toolbar-divider" />
        
        <button 
          className="toolbar-btn save-btn"
          onClick={onSave}
          title="Save Canvas Data"
        >
          <span className="btn-icon">💾</span>
          Save
        </button>
        <button 
          className="toolbar-btn load-btn"
          onClick={handleLoadClick}
          title="Load Canvas Data"
        >
          <span className="btn-icon">📂</span>
          Load
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={onLoad}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default Toolbar;