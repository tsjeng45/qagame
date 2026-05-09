import React, { useState } from 'react';
import PixelContainer from './PixelContainer';

const Game = ({ questions, bossImages, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [animating, setAnimating] = useState(false);

  const currentQuestion = questions[currentIndex];
  const bossImage = bossImages[currentIndex % bossImages.length];

  const handleOptionClick = (optionKey) => {
    if (animating) return;
    
    const newAnswers = [...answers, {
      questionId: currentQuestion.id,
      selectedOption: optionKey
    }];
    
    setAnswers(newAnswers);
    setAnimating(true);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setAnimating(false);
      } else {
        onComplete(newAnswers);
      }
    }, 500);
  };

  if (!currentQuestion) return null;

  return (
    <PixelContainer className={animating ? 'blink' : ''}>
      <h2 style={{ color: 'var(--text-secondary)' }}>STAGE {currentIndex + 1}</h2>
      
      {bossImage && (
        <img src={bossImage} alt="Boss" className="boss-image" />
      )}
      
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>{currentQuestion.text}</p>
      
      <div className="options">
        {Object.entries(currentQuestion.options).map(([key, value]) => (
          <button 
            key={key} 
            className="pixel-button option-button"
            onClick={() => handleOptionClick(key)}
            disabled={animating}
          >
            {key}. {value}
          </button>
        ))}
      </div>
    </PixelContainer>
  );
};

export default Game;
