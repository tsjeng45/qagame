import React from 'react';

const PixelButton = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
  const baseClass = variant === 'secondary' ? 'pixel-button secondary' : 'pixel-button';
  return (
    <button 
      className={`${baseClass} ${className}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PixelButton;
