import React from 'react';
import './Header.css';

function Header() {
  return (
    <div className="header">
      <img src="/chizek_logo.png" alt="Chizek Logo" style={{ height: '50px', width: 'auto' }} />
      <h1 className="app-title">Chizek YouTube Downloader</h1>
    </div>
  );
}

export default Header;
