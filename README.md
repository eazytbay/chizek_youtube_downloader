# Chizek YouTube Downloader
Chizek YouTube Downloader is a simple, user-friendly web application that allows users to download YouTube videos in various formats and resolutions. The frontend is built with React, while the backend uses Flask (Python) for managing API requests and ytdl-core for video/audio downloading from YouTube.

# Table of Contents
- Features
- Project Overview
- Technologies Used
- Frontend Installation
- Backend Installation
- Usage
- Folder Structure
- Contributing
- License

# Features
- Allows users to input a YouTube video URL.
- Option to choose the video resolution (e.g., 360p, 720p, 1080p).
- Select audio and video formats.
- Simple and responsive UI.
- Downloads video or audio with the selected preferences.

# Project Overview
Chizek YouTube Downloader provides a seamless interface for downloading YouTube videos. The user can select video/audio formats and resolutions, and the app handles fetching and downloading content from YouTube.

# Technologies Used
- Frontend:
    - React (JavaScript library for building user interfaces)
    - CSS (for styling)
    - HTML (for markup)
- Backend:
    - Python 3
    - Flask (lightweight web framework for Python)
    - ytdl-core (for downloading videos from YouTube)

# Frontend Installation
- Prerequisites
  - Make sure you have the following installed:
    - Node.js (version 14.x or higher)
    - npm (Node Package Manager)

- Steps to Run the Frontend Locally
    1. Clone the repository:
       - '''bash
       - '''git clone https://github.com/your-username/chizek-youtube-downloader.git
       - '''cd chizek-youtube-downloader

    2. Navigate to the frontend/ directory:
       - '''bash
       - '''cd dashboard/

    3. Install frontend dependencies:
       - '''bash
       - '''npm install

    5. Start the React development server:
       - '''bash
       - '''npm start

The frontend app should now be running on http://localhost:3000/.

# Building for Production
To build the app for production, run:
   - '''bash
   - '''npm run build

This will create a build/ directory with the production-ready files.

# Backend Installation
- Prerequisites
  - Ensure you have the following installed:
    - Python 3 (version 3.6 or higher)
    - Flask (Python web framework)
    - Node.js (for ytdl-core)

- Steps to Run the Backend Locally
    1. Navigate to the backend/ directory:
       - '''bash
       - '''cd chizek_youtube_downloader/
 
    2. Create and activate a Python virtual environment:
       - '''bash
       - '''python3 -m venv venv
       - '''source venv/bin/activate  # On Windows, use: venv\Scripts\activate

    3. Install Python dependencies:
       - '''bash
       - '''pip install -r requirements.txt

    4. Install ytdl-core:
       - Navigate to the backend folder and run:
       - '''bash
       - '''npm install ytdl-core

    5. Start the Flask server:
       - '''bash
       - '''flask run

The backend server should now be running on http://localhost:8000/.

# Backend Routes
- POST /api/download
This endpoint accepts a JSON payload containing the YouTube URL and selected download options (resolution, format) and returns the download link for the requested video/audio.

# Usage
- Run both the frontend and backend servers (npm start for the frontend and flask run for the backend).
- In your browser, go to http://localhost:3000/.
- Enter a valid YouTube video URL in the input field.
- Choose the desired resolution and format (audio/video).
- Click the Download button to start the process.

# Folder Structure
Here's a basic overview of the project structure:
graphql                                                 
chizek-youtube-downloader/
├── backend/
│   ├── chizek.py                     # Flask app file
│   ├── requirements.txt              # Python dependencies
├── frontend/
│   ├── dashboard
│   │   ├──node_modules/              #Installed node modules
│   │   ├── public/
│   │   │   ├── favicon.ico           # Custom favicon
│   │   │   ├── chizek_logo.png       # Custom logo
│   │   │   ├── index.html            # HTML entry point
│   │   │   ├── manifest.json         # Manifest file
│   │   ├── src/
│   │   │   ├── components/           # React components
│   │   │   │   ├── Header
│   │   │   │   │   ├──Header.js      # Header component
│   │   │   │   │   ├──Header.css     # Header styling
│   │   │   │   ├── URLInput.js       # Input for YouTube URL
│   │   │   │   ├── DownloadButton.js # Download button
│   │   │   │   ├── Dropdown.js       # Dropdowns for formats/resolution
│   │   │   │   ├── Footer.js         # Footer component
│   │   │   ├── App.js                # Main app component
│   │   │   ├── App.css               # App styling
│   │   │   ├── index.js              # Main entry point
│   │   ├── .eslintrc.js              # ESLint style rules
│   │   ├── .gitignore                # Files to be ignored by GIT
│   │   ├── package.json              # Frontend dependencies
│   │   ├── package-lock.json         # Lock files
└── README.md                         # Project documentation

# Contributing
Contributions are welcome! To contribute:
- Fork the repository.
- Create a new branch: git checkout -b feature-branch-name.
- Make your changes.
- Commit your changes: git commit -m 'Add some feature'.
- Push to the branch: git push origin feature-branch-name.
- Open a pull request.

# License
This project is licensed under the MIT License. See the LICENSE file for more details.
