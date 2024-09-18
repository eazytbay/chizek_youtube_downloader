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
  Make sure you have the following installed:
    - Node.js (version 14.x or higher)
    - npm (Node Package Manager)

- Steps to Run the Frontend Locally
    1. Clone the repository:
bash
Copy code
git clone https://github.com/your-username/chizek-youtube-downloader.git
cd chizek-youtube-downloader

    2. Navigate to the frontend/ directory:
bash
Copy code
cd frontend/

    3. Install frontend dependencies:
bash
Copy code
npm install

    5. Start the React development server:
bash
Copy code
npm start

The frontend app should now be running on http://localhost:3000/.
