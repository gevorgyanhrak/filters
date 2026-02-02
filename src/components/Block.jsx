import React, { useState, useRef, useEffect } from 'react';
import './Block.css';

// AI Models configuration
const AI_MODELS = [
  { id: 'dall-e-3', name: 'DALL-E 3', icon: '🎨', type: 'image' },
  { id: 'dall-e-2', name: 'DALL-E 2', icon: '🎨', type: 'image' },
  { id: 'midjourney', name: 'Midjourney', icon: '🖼️', type: 'image' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', icon: '🎭', type: 'image' },
  { id: 'leonardo-ai', name: 'Leonardo AI', icon: '🎪', type: 'image' },
  { id: 'runway', name: 'Runway Gen-3', icon: '🎬', type: 'video' },
  { id: 'pika', name: 'Pika Labs', icon: '🎥', type: 'video' },
  { id: 'sora', name: 'OpenAI Sora', icon: '🎞️', type: 'video' },
];

// Simulate AI generation (replace with real API calls later)
const generateWithAI = async (prompt, modelId, modelType) => {
  // This simulates API call - replace with real API integration
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return placeholder URL based on type
      if (modelType === 'video') {
        resolve({
          type: 'video',
          url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
          prompt: prompt,
          model: modelId
        });
      } else {
        // Use a demo image service
        resolve({
          type: 'image',
          url: `https://picsum.photos/seed/${Date.now()}/400/400`,
          prompt: prompt,
          model: modelId
        });
      }
    }, 2000); // 2 second delay to simulate API call
  });
};

const Block = ({ block, blocks, isSelected, onUpdate, onDelete, onSelect, onAddConnection, zoom }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [showConnectMenu, setShowConnectMenu] = useState(false);
  const blockRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('block-header') || e.target.classList.contains('block-drag-handle')) {
      e.stopPropagation();
      setIsDragging(true);
      const rect = blockRef.current.getBoundingClientRect();
      setDragOffset({
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom
      });
      onSelect(block.id);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = (e.clientX / zoom) - dragOffset.x - (window.innerWidth / 2 / zoom);
      const newY = (e.clientY / zoom) - dragOffset.y - (window.innerHeight / 2 / zoom);
      onUpdate(block.id, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, zoom]);

  const handlePromptChange = (e) => {
    onUpdate(block.id, { prompt: e.target.value });
  };

  const handleModelChange = (e) => {
    onUpdate(block.id, { aiModel: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.stopPropagation();
    
    if (!block.prompt || block.prompt.trim() === '') {
      alert('Please enter a prompt first!');
      return;
    }

    // Set generating state
    onUpdate(block.id, { isGenerating: true });

    try {
      // Call AI generation (simulated for now)
      const result = await generateWithAI(block.prompt, block.aiModel, selectedModel.type);
      
      // Update block with result
      onUpdate(block.id, { 
        generatedResult: result,
        isGenerating: false 
      });
    } catch (error) {
      console.error('Generation error:', error);
      onUpdate(block.id, { isGenerating: false });
      alert('Failed to generate. Please try again.');
    }
  };

  const handleClick = (e) => {
    if (!isDragging && e.target !== e.currentTarget) {
      e.stopPropagation();
      onSelect(block.id);
    }
  };

  const handleConnectTo = (targetBlockId) => {
    onAddConnection(block.id, targetBlockId);
    setShowConnectMenu(false);
  };

  const toggleConnectMenu = (e) => {
    e.stopPropagation();
    setShowConnectMenu(!showConnectMenu);
  };

  // Get available blocks to connect to (exclude current block)
  const availableBlocks = blocks.filter(b => b.id !== block.id);

  const selectedModel = AI_MODELS.find(m => m.id === block.aiModel) || AI_MODELS[0];

  return (
    <div
      ref={blockRef}
      className={`block ${isSelected ? 'selected' : ''} block-${selectedModel.type}`}
      style={{
        left: block.x,
        top: block.y,
        width: block.width,
        minHeight: block.height
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <div className="block-header">
        <div className="block-drag-handle">
          <span>☰</span>
        </div>
        <div className="block-model-selector">
          <span className="model-icon">{selectedModel.icon}</span>
          <select 
            className="model-select"
            value={block.aiModel}
            onChange={handleModelChange}
            onClick={(e) => e.stopPropagation()}
          >
            {AI_MODELS.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Connect To Button */}
        <div className="connect-dropdown">
          <button 
            className="connect-btn"
            onClick={toggleConnectMenu}
            title="Connect to another block"
          >
            🔗
          </button>
          {showConnectMenu && (
            <div className="connect-menu" onClick={(e) => e.stopPropagation()}>
              <div className="connect-menu-header">Connect to:</div>
              {availableBlocks.length > 0 ? (
                availableBlocks.map(targetBlock => (
                  <div 
                    key={targetBlock.id}
                    className="connect-menu-item"
                    onClick={() => handleConnectTo(targetBlock.id)}
                  >
                    <span className="menu-icon">{AI_MODELS.find(m => m.id === targetBlock.aiModel)?.icon || '📦'}</span>
                    <span className="menu-text">Block {targetBlock.id}</span>
                  </div>
                ))
              ) : (
                <div className="connect-menu-empty">No other blocks available</div>
              )}
            </div>
          )}
        </div>
        
        <button 
          className="delete-btn"
          onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
        >
          ✕
        </button>
      </div>
      <div className="block-content">
        <div className="prompt-section">
          <textarea
            className="prompt-input"
            placeholder={`Type your idea for ${selectedModel.name}... (e.g., "red car")`}
            value={block.prompt}
            onChange={handlePromptChange}
            onClick={(e) => e.stopPropagation()}
            disabled={block.isGenerating}
          />
          <button 
            className={`generate-prompt-btn ${block.isGenerating ? 'generating' : ''}`}
            onClick={handleGenerate}
            disabled={block.isGenerating}
            title="Generate with AI"
          >
            <span className="btn-icon">{block.isGenerating ? '⏳' : '✨'}</span>
            {block.isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        
        {block.generatedResult && (
          <div className="result-preview">
            {block.generatedResult.type === 'image' ? (
              <img 
                src={block.generatedResult.url} 
                alt={block.prompt}
                className="generated-image"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video 
                src={block.generatedResult.url}
                className="generated-video"
                controls
                onClick={(e) => e.stopPropagation()}
              >
                Your browser does not support video.
              </video>
            )}
          </div>
        )}
        
        <div className="block-info">
          <span className="block-id">ID: {block.id}</span>
          <span className="block-timestamp">
            {new Date(block.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Block;