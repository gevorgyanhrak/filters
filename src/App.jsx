import React, { useState, useRef } from 'react';
import './App.css';
import InfiniteCanvas from './components/InfiniteCanvas';
import Toolbar from './components/Toolbar';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [connections, setConnections] = useState([]); // Array of {from: blockId, to: blockId}
  const canvasRef = useRef(null);

  const addBlock = () => {
    const newBlock = {
      id: Date.now(),
      aiModel: 'dall-e-3', // default AI model
      prompt: '',
      generatedResult: null, // URL or data for generated image/video
      isGenerating: false,
      x: 100 + (blocks.length * 20), // offset new blocks
      y: 100 + (blocks.length * 20),
      width: 350,
      height: 250,
      createdAt: new Date().toISOString()
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
    // Also remove connections involving this block
    setConnections(connections.filter(conn => conn.from !== id && conn.to !== id));
    if (selectedBlock === id) {
      setSelectedBlock(null);
    }
  };

  const addConnection = (fromId, toId) => {
    // Check if connection already exists
    const exists = connections.some(
      conn => conn.from === fromId && conn.to === toId
    );
    if (!exists && fromId !== toId) {
      console.log('Adding connection:', fromId, '->', toId);
      setConnections([...connections, { from: fromId, to: toId }]);
    }
  };

  const deleteConnection = (from, to) => {
    setConnections(connections.filter(conn => !(conn.from === from && conn.to === to)));
  };

  const saveData = () => {
    const dataStr = JSON.stringify({ blocks, connections }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `canvas-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target.result);
          setBlocks(loadedData.blocks || []);
          setConnections(loadedData.connections || []);
        } catch (error) {
          alert('Error loading file: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };
  //test

  return (
    <div className="App">
      <Toolbar 
        onAddBlock={addBlock}
        onSave={saveData}
        onLoad={loadData}
        blockCount={blocks.length}
        connectionCount={connections.length}
      />
      <InfiniteCanvas 
        blocks={blocks}
        connections={connections}
        onUpdateBlock={updateBlock}
        onDeleteBlock={deleteBlock}
        onDeleteConnection={deleteConnection}
        onAddConnection={addConnection}
        selectedBlock={selectedBlock}
        onSelectBlock={setSelectedBlock}
      />
    </div>
  );
}

export default App;
