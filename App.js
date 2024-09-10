import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [resolution, setResolution] = useState('720p');
  const [videoFormat, setVideoFormat] = useState('mp4');
  const [audioFormat, setAudioFormat] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();

    const requestBody = {
      url,
      res: resolution,
      vid_format: videoFormat,
      aud_format: audioFormat ? audioFormat : null,
    };

    try {
      const response = await fetch('http://localhost:5000/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'downloaded_video';
        a.click();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error downloading the video:', error);
      alert('An error occurred during the download.');
    }
  };

  return (
    <div className="app-container">
      <h1>Chizek YouTube Downloader</h1>
      <p>Download your favorite YouTube videos easily!</p>
      <form onSubmit={handleDownload}>
        <label htmlFor="url">YouTube URL:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          required
        />

        <label htmlFor="resolution">Select Resolution:</label>
        <select
          id="resolution"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        >
          <option value="1080p">1080p</option>
          <option value="720p">720p</option>
          <option value="480p">480p</option>
          <option value="360p">360p</option>
        </select>

        <label htmlFor="videoFormat">Select Video Format:</label>
        <select
          id="videoFormat"
          value={videoFormat}
          onChange={(e) => setVideoFormat(e.target.value)}
        >
          <option value="mp4">MP4</option>
          <option value="webm">WebM</option>
        </select>

        <label htmlFor="audioFormat">Select Audio Format (Optional):</label>
        <select
          id="audioFormat"
          value={audioFormat}
          onChange={(e) => setAudioFormat(e.target.value)}
        >
          <option value="">None</option>
          <option value="mp3">MP3</option>
          <option value="flac">FLAC</option>
          <option value="wav">WAV</option>
        </select>

        <button type="submit">Download</button>
      </form>
      <footer>
        <p>&copy; 2024 Chizek YouTube Downloader. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
