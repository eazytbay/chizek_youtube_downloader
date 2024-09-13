import React, { useState } from 'react';

function URLInput() {
  const [url, setUrl] = useState('');

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  return (
    <div>
      <label htmlFor="url-input">YouTube URL: </label>
      <input
        type="text"
        id="url-input"
        value={url}
        onChange={handleChange}
        placeholder="Paste YouTube URL here"
      />
    </div>
  );
}

export default URLInput;
