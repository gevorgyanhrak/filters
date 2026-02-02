import React, { useState, useRef, useEffect } from 'react';
import Block from './Block';
import './InfiniteCanvas.css';

const InfiniteCanvas = ({ 
  blocks, 
  connections,
  onUpdateBlock, 
  onDeleteBlock, 
  onDeleteConnection,
  onAddConnection,
  selectedBlock, 
  onSelectBlock
}) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Keyboard controls for moving blocks
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedBlock) return;
      
      const moveAmount = e.shiftKey ? 10 : 1; // Hold Shift for faster movement
      
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          const blockUp = blocks.find(b => b.id === selectedBlock);
          if (blockUp) {
            onUpdateBlock(selectedBlock, { y: blockUp.y - moveAmount });
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          const blockDown = blocks.find(b => b.id === selectedBlock);
          if (blockDown) {
            onUpdateBlock(selectedBlock, { y: blockDown.y + moveAmount });
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          const blockLeft = blocks.find(b => b.id === selectedBlock);
          if (blockLeft) {
            onUpdateBlock(selectedBlock, { x: blockLeft.x - moveAmount });
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          const blockRight = blocks.find(b => b.id === selectedBlock);
          if (blockRight) {
            onUpdateBlock(selectedBlock, { x: blockRight.x + moveAmount });
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (!e.target.matches('input, textarea')) {
            e.preventDefault();
            onDeleteBlock(selectedBlock);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlock, blocks, onUpdateBlock, onDeleteBlock]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        const newZoom = Math.min(Math.max(0.1, zoom + delta * 0.1), 3);
        setZoom(newZoom);
      }
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [zoom]);

  const handleMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-content')) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onSelectBlock(null);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Calculate connection line positions at block edges
  const getBlockEdgePoint = (blockId, targetBlockId) => {
    const block = blocks.find(b => b.id === blockId);
    const targetBlock = blocks.find(b => b.id === targetBlockId);
    
    if (!block || !targetBlock) {
      return { x: 0, y: 0 };
    }
    
    // Calculate centers
    const centerX = block.x + block.width / 2;
    const centerY = block.y + block.height / 2;
    const targetCenterX = targetBlock.x + targetBlock.width / 2;
    const targetCenterY = targetBlock.y + targetBlock.height / 2;
    
    // Calculate angle from this block to target
    const dx = targetCenterX - centerX;
    const dy = targetCenterY - centerY;
    const angle = Math.atan2(dy, dx);
    
    // Calculate intersection with block border
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Check which edge the line intersects
    const halfWidth = block.width / 2;
    const halfHeight = block.height / 2;
    
    let edgeX, edgeY;
    
    // Determine which edge based on angle
    if (Math.abs(cos) > Math.abs(sin) * (halfWidth / halfHeight)) {
      // Intersects left or right edge
      edgeX = cos > 0 ? halfWidth : -halfWidth;
      edgeY = edgeX * Math.tan(angle);
    } else {
      // Intersects top or bottom edge
      edgeY = sin > 0 ? halfHeight : -halfHeight;
      edgeX = edgeY / Math.tan(angle);
    }
    
    return {
      x: centerX + edgeX,
      y: centerY + edgeY
    };
  };

  return (
    <div 
      className="infinite-canvas"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="canvas-content"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        <div className="grid-background" />
        
        {/* Draw connections as HTML divs */}
        {connections.map((conn) => {
          const from = getBlockEdgePoint(conn.from, conn.to);
          const to = getBlockEdgePoint(conn.to, conn.from);
          
          // Calculate angle and length
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          
          return (
            <div key={`conn-${conn.from}-${conn.to}`}>
              {/* Thicker line with strong gradient and glow */}
              <div
                style={{
                  position: 'absolute',
                  left: `${from.x}px`,
                  top: `${from.y}px`,
                  width: `${length}px`,
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea 0%, #f093fb 50%, #764ba2 100%)',
                  transformOrigin: '0 0',
                  transform: `rotate(${angle}deg)`,
                  pointerEvents: 'none',
                  zIndex: 1,
                  boxShadow: '0 0 12px rgba(102, 126, 234, 0.8), 0 0 20px rgba(240, 147, 251, 0.4)',
                  borderRadius: '3px',
                  opacity: 0.95
                }}
              />
              
              {/* Larger glowing arrow circle */}
              <div
                style={{
                  position: 'absolute',
                  left: `${to.x - 10}px`,
                  top: `${to.y - 10}px`,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #764ba2 0%, #667eea 100%)',
                  pointerEvents: 'none',
                  zIndex: 2,
                  boxShadow: '0 0 15px rgba(102, 126, 234, 1), 0 0 25px rgba(118, 75, 162, 0.6), 0 3px 6px rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              />
              
              {/* Larger delete button with strong effects */}
              <div
                className="connection-delete-btn"
                style={{
                  position: 'absolute',
                  left: `${(from.x + to.x) / 2 - 16}px`,
                  top: `${(from.y + to.y) / 2 - 16}px`,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%)',
                  border: '3px solid white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  zIndex: 3,
                  boxShadow: '0 3px 12px rgba(255, 59, 48, 0.6), 0 0 20px rgba(255, 59, 48, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.3)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(255, 59, 48, 0.8), 0 0 30px rgba(255, 59, 48, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(255, 59, 48, 0.6), 0 0 20px rgba(255, 59, 48, 0.3)';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConnection(conn.from, conn.to);
                }}
              >
                ×
              </div>
            </div>
          );
        })}
        
        {blocks.map(block => (
          <Block
            key={block.id}
            block={block}
            blocks={blocks}
            isSelected={selectedBlock === block.id}
            onUpdate={onUpdateBlock}
            onDelete={onDeleteBlock}
            onSelect={onSelectBlock}
            onAddConnection={onAddConnection}
            zoom={zoom}
          />
        ))}
      </div>
      <div className="canvas-info">
        <div>Zoom: {(zoom * 100).toFixed(0)}%</div>
        <div>Blocks: {blocks.length}</div>
        {selectedBlock && <div className="selected-indicator">✓ Block Selected</div>}
        <div className="hint">
          <div>• Ctrl/Cmd + Scroll to zoom</div>
          <div>• Drag canvas to pan</div>
          <div>• Arrow keys to move selected block</div>
          <div>• Shift + Arrow for faster movement</div>
          <div>• Delete/Backspace to remove block</div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteCanvas;