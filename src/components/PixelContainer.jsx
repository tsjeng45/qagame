import React from 'react';

const PixelContainer = ({ children, className = '' }) => {
  return (
    <div className={`pixel-box ${className}`}>
      {children}
    </div>
  );
};

export default PixelContainer;
