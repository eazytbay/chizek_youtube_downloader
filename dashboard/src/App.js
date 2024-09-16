import React, { useState } from 'react';
import Header from './components/Header/Header'; // Import Header component
import Footer from './components/Footer';
import DownloadButton from './components/DownloadButton';
import './App.css'; // import the CSS file

function App() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('');
  const [format, setFormat] = useState(''); // Single format for both video/audio
  const [thumbnail, setThumbnail] = useState(''); // State to hold thumbnail URL

  // Fetch thumbnail URL from the backend
  const fetchThumbnail = async (youtubeUrl) => {
    try {
      const response = await fetch('http://localhost:8000/api/get-thumbnail', { // backend route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      });
      const data = await response.json();
      setThumbnail(data.thumbnailUrl); // Update thumbnail URL state
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
    }
  };

  const handleUrlChange = (e) => {
    const youtubeUrl = e.target.value;
    setUrl(youtubeUrl);

    // Fetch thumbnail when a new URL is input
    if (youtubeUrl) {
      fetchThumbnail(youtubeUrl);
    } else {
      setThumbnail(''); // Clear thumbnail if URL is empty
    }
  };

  const handleFormatChange = (e) => {
    const selectedFormat = e.target.value;
    setFormat(selectedFormat);
    if (selectedFormat === 'audio-only') {
      setQuality(''); // Clear video quality if audio-only is selected
    }
  };

  return (
    <>
      <div className="container">
        <Header /> {/* Use the Header component here */}

        <input
          type="text"
          placeholder="Paste YouTube URL here"
          value={url}
          onChange={handleUrlChange} // Call handleUrlChange on URL input
        />

        {thumbnail && (
          <div className="thumbnail">
            <img src={thumbnail} alt="Video Thumbnail" style={{ width: '100%' }} />
          </div>
        )}

        {/* Single format toggle for both audio and video */}
        <label>Format (Audio/Video):</label>
        <select
          value={format}
          onChange={handleFormatChange}
        >
          <option value="">Select Format</option>
	  {/* Video formats */}
          <option value="mp4">MP4 (Video)</option>
          <option value="mkv">MKV (Video)</option>
          <option value="3gp">3GP (Video)</option>
          <option value="webm">WebM (Video)</option>
	  {/* Audio formats */}
          <option value="mp3">MP3 (Audio)</option>
          <option value="flac">FLAC (Audio)</option>
          <option value="wav">WAV (Audio)</option>
        </select>

        {/* Resolution dropdown - only show when a video format is selected */}
        {(format === 'mp4' || format === 'mkv' || format === '3gp' || format === 'webm') && (
          <>
            <label>Resolution/Quality:</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option value="">Select Video Resolution</option>
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
              <option value="360p">360p</option>
            </select>
          </>
        )}

        <DownloadButton
          url={url}
          quality={quality}
          format={format}
        />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default App;
