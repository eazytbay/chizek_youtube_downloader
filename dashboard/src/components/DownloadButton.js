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
      // Extraction of the filename from the headers
      const contentDisp = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisp && contentDisp.match(/filename="(.+)"/); //match expression adjusted
      const filename = filenameMatch ? filenameMatch[1] : 'default_filename.txt'; //Provision of a default filename
      // Triggering the download
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Object URL is released after download
      window.URL.revokeObjectURL(downloadUrl);

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
