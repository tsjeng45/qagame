import React from 'react';
import PixelButton from './PixelButton';
import PixelContainer from './PixelContainer';

const Result = ({ result, onRestart }) => {
  if (!result) return null;

  const threshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || 3, 10);
  const passed = result.correctCount >= threshold;

  return (
    <PixelContainer>
      <h1 className="blink" style={{ color: passed ? 'var(--text-main)' : 'red' }}>
        {passed ? 'STAGE CLEAR' : 'GAME OVER'}
      </h1>
      
      <div style={{ textAlign: 'left', margin: '2rem auto', width: 'fit-content' }}>
        <p>SCORE: {result.score}</p>
        <p>CORRECT: {result.correctCount} / {result.totalQuestions}</p>
        <br/>
        <p style={{ color: 'var(--text-secondary)' }}>RECORD:</p>
        <p>HIGHEST: {result.highestScore}</p>
        <p>PLAY COUNT: {result.playCount}</p>
        {result.isNew && <p style={{ color: 'var(--text-accent)' }}>NEW CHALLENGER!</p>}
      </div>

      <PixelButton onClick={onRestart}>PLAY AGAIN</PixelButton>
    </PixelContainer>
  );
};

export default Result;
