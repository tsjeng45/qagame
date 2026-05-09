import React, { useState } from 'react';
import PixelButton from './PixelButton';
import PixelContainer from './PixelContainer';

const Home = ({ onStart }) => {
  const [id, setId] = useState('');

  const handleStart = () => {
    if (id.trim() === '') {
      alert('請輸入 ID！');
      return;
    }
    onStart(id.trim());
  };

  return (
    <PixelContainer>
      <h1 className="blink" style={{ color: 'var(--text-secondary)' }}>ARCADE QA</h1>
      <h2>Insert ID to Play</h2>
      <input 
        type="text" 
        placeholder="ENTER YOUR ID" 
        value={id}
        onChange={(e) => setId(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
      />
      <br />
      <PixelButton onClick={handleStart}>START GAME</PixelButton>
    </PixelContainer>
  );
};

export default Home;
