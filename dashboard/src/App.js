import React, { useState } from 'react';
import Header from './components/Header/Header'; // Import Header component
import Footer from './components/Footer';
import DownloadButton from './components/DownloadButton';
import './App.css'; // import the CSS file

function App() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('');
  const [audioFormat, setAudioFormat] = useState('');
  const [videoFormat, setVideoFormat] = useState('');
  const [thumbnail, setThumbnail] = useState(''); // State to hold thumbnail URL

  // Fetch thumbnail URL from the backend
  const fetchThumbnail = async (youtubeUrl) => {
    try {
      const response = await fetch ('http://localhost:8000/api/get-thumbnail', { // backend route
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

  const handleAudioFormatChange = (e) => {
    const format = e.target.value;
    setAudioFormat(format);
    if (format === 'audio-only') {
      setVideoFormat(''); // Clear video format
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

        <label>Video Format:</label>
        <select
          value={videoFormat}
          onChange={(e) => setVideoFormat(e.target.value)}
          disabled={audioFormat === 'audio-only'} // Disable if audio only is selected
        >
          <option value="">Select Video Format</option>
          <option value="mp4">MP4</option>
	  <option value="mkv">MKV</option>
	  <option value="3gp">3GP</option>
          <option value="webm">WebM</option>
        </select>

        <label>Audio Format:</label>
        <select
          value={audioFormat}
          onChange={handleAudioFormatChange}
        >
          <option value="">Select Audio Format</option>
          <option value="audio-only">Audio Only</option>
          <option value="mp3">MP3</option>
          <option value="flac">FLAC</option>
          <option value="wav">WAV</option>
        </select>

        {videoFormat && (
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
          audioFormat={audioFormat}
          videoFormat={videoFormat}
        />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default App;
