import React, { useState } from 'react';

function DownloadButton({ url, quality, audioFormat, videoFormat }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!url) {
      alert('Please enter a YouTube URL.');
      return;
    }

    setIsDownloading(true);

    try {
      const isAudioOnly = audioFormat === 'audio-only';

      // Send a POST request to the Flask backend
      const response = await fetch('http://localhost:8000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          res: isAudioOnly ? null : quality, // Only send resolution if it's a video download
          aud_format: isAudioOnly ? audioFormat : null, // Send audio format if audio-only
          vid_format: isAudioOnly ? null : videoFormat, // Send video format if not audio-only
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to download. Please try again.');
      }

      // Handle the response from the backend (which returns a downloadable file)
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `downloaded_file.${isAudioOnly ? audioFormat : videoFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      console.error('Download failed:', error);
      alert('Error: Could not download the file.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? 'Downloading...' : 'Download'}
    </button>
  );
}

export default DownloadButton;
