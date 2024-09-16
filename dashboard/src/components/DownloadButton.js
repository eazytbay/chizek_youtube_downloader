import React, { useState } from 'react';

function DownloadButton({ url, quality, format }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!url) {
      alert('Please enter a YouTube URL.');
      return;
    }

    setIsDownloading(true);

    try {
      // Send a POST request to the Flask backend
      const response = await fetch('http://localhost:8000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          res: quality, // Video resolution, if applicable
          vid_format: format, // Video format (e.g., mp4, mkv) or audio format (e.g., mp3)
          aud_format: null,  // No audio-only format since it's removed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to download. Please try again.');
      }

      // Handle the response from the backend (which returns a downloadable file)
      const blob = await response.blob();
      // Extraction of the filename from the headers
      const contentDisp = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisp && contentDisp.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'default_filename.txt'; // Provide a default filename if none is set

      // Trigger the download
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Release the object URL after download
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
