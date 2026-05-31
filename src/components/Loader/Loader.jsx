import React from 'react';
import './Loader.css';

const Loader = ({ size = 'md', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className={`loader loader--${size}`} />
      </div>
    );
  }
  return <div className={`loader loader--${size}`} />;
};

export default Loader;
