# Infinite Canvas - AI Generation Tool

An infinite canvas application for organizing and managing AI image and video generation prompts.

## Features

### ✨ Infinite Canvas
- Pan around the canvas by dragging
- Zoom in/out using Ctrl/Cmd + Scroll
- Smooth navigation and interactions
- Grid background for spatial reference

### 🔗 Block Connections
- **Connect Blocks**: Create visual connections between blocks to show relationships
- **Connection Mode**: Toggle connection mode with the "Connect Blocks" button
- **Two-Step Connection**: Click first block, then click second block to connect
- **Delete Connections**: Click the red dot in the middle of any connection line to remove it
- **Auto-Save**: Connections are saved with your canvas data

### 📦 Block System
- **Add Blocks**: Create unlimited AI generation blocks
- **Drag & Drop**: Move blocks anywhere on the canvas
- **AI Model Selection**: Choose from multiple AI models:
  - **Image Generation**: DALL-E 3, DALL-E 2, Midjourney, Stable Diffusion, Leonardo AI
  - **Video Generation**: Runway Gen-3, Pika Labs, OpenAI Sora
- **Prompt Input**: Type your simple idea (e.g., "red car", "sunset over ocean")
- **Generate Button**: Click "Generate" to create the image or video with AI
- **Live Preview**: See the generated result directly in the block
- **Block Selection**: Click to select and highlight blocks
- **Delete Blocks**: Remove unwanted blocks

### 💾 Data Management
- **Save**: Export all blocks and prompts to JSON file
- **Load**: Import previously saved canvas data
- **Auto-tracking**: Each block stores:
  - Unique ID
  - Type (image/video)
  - Prompt text
  - Position (x, y)
  - Size (width, height)
  - Creation timestamp

### 🎨 User Interface
- Modern, dark-themed design
- Color-coded blocks (blue for images, purple for videos)
- Visual feedback for interactions
- Real-time block counter
- Zoom and position indicators

## Usage

### Running the App

**Using Yarn (recommended):**
```bash
yarn dev
```

**Using npm:**
```bash
npm run dev
```

This will start the Vite development server on `http://localhost:3000` and automatically open it in your browser.

### Controls
- **Add Block**: Click "Add Block" button to create a new AI block
- **Connect Blocks**: 
  1. Click "🔗 Connect Blocks" to enter connection mode
  2. Click on the first block (it will glow pink)
  3. Click on the second block to create a connection
  4. Click "Exit Connect Mode" when done
- **Delete Connection**: Click the red dot in the middle of a connection line
- **Type Your Prompt**: Enter simple text like "red car", "dragon flying", "person dancing"
- **Select AI Model**: Choose which AI model to use from the dropdown
- **Generate**: Click "✨ Generate" button to create the image or video
- **View Result**: The generated image/video appears directly in the block
- **Move Block (Mouse)**: Click and drag the block header (☰ icon)
- **Move Block (Keyboard)**: Select a block, then use arrow keys
  - **Arrow Keys**: Move block 1px in any direction
  - **Shift + Arrow Keys**: Move block 10px (faster movement)
- **Pan Canvas**: Click and drag on empty canvas space
- **Zoom**: Hold Ctrl/Cmd and scroll
- **Select Block**: Click on any block
- **Delete Block**: 
  - Click the × button on the block header, OR
  - Select block and press Delete/Backspace key
- **Save Data**: Click "Save" button to download JSON file (includes blocks and connections)
- **Load Data**: Click "Load" button and select a JSON file

### Block Structure
Each block contains:
- **AI Model Selector**: Choose from 8+ AI models for image and video generation
- **Prompt Textarea**: Type your simple idea in plain text
- **Generate Button**: Click to create the image/video with AI
- **Result Preview**: View the generated image or video directly in the block
- **Metadata**: Block ID and creation timestamp

### Example Workflow
1. Add a new block
2. Type: `"red car"`
3. Select AI model: `DALL-E 3`
4. Click "✨ Generate"
5. Wait 2-3 seconds
6. See your generated red car image appear in the block!

## Data Format

Saved data is in JSON format:
```json
[
  {
    "id": 1738334567890,
    "aiModel": "dall-e-3",
    "prompt": "A beautiful sunset over mountains",
    "x": 100,
    "y": 100,
    "width": 350,
    "height": 250,
    "createdAt": "2026-01-31T12:00:00.000Z"
  }
]
```

## Future Enhancements
- Real AI API integration (DALL-E, Midjourney, Stable Diffusion, etc.)
- Download generated images/videos
- Regenerate with different parameters
- Preview thumbnails in blocks
- Block resizing
- Copy/paste blocks
- Search and filter blocks
- Export to different formats
- Collaboration features
- Undo/redo functionality

## Technology Stack
- React 18
- Vite 5.1
- CSS3 with modern features
- Local storage and file system APIs
