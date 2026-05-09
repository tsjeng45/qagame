import React, { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import Result from './components/Result';
import PixelContainer from './components/PixelContainer';
import { fetchQuestions, submitAnswers } from './services/api';
import { preloadImages } from './utils/imageLoader';

function App() {
  const [gameState, setGameState] = useState('home'); // home, loading, playing, submitting, result
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [bossImages, setBossImages] = useState([]);
  const [result, setResult] = useState(null);

  const startFlow = async (id) => {
    setUserId(id);
    setGameState('loading');
    
    try {
      const questionCount = parseInt(import.meta.env.VITE_QUESTION_COUNT || 5, 10);
      
      // 並行撈取題目與預載圖片
      const [fetchedQuestions, loadedImages] = await Promise.all([
        fetchQuestions(questionCount),
        preloadImages(questionCount)
      ]);

      setQuestions(fetchedQuestions);
      setBossImages(loadedImages);
      setGameState('playing');
    } catch (error) {
      alert('載入失敗：' + error.message);
      setGameState('home');
    }
  };

  const handleGameComplete = async (answers) => {
    setGameState('submitting');
    try {
      const threshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || 3, 10);
      const res = await submitAnswers(userId, answers, threshold);
      setResult(res);
      setGameState('result');
    } catch (error) {
      alert('成績送出失敗：' + error.message);
      setGameState('home');
    }
  };

  const restartGame = () => {
    setGameState('home');
    setUserId('');
    setQuestions([]);
    setResult(null);
  };

  return (
    <div className="App">
      {gameState === 'home' && <Home onStart={startFlow} />}
      
      {(gameState === 'loading' || gameState === 'submitting') && (
        <PixelContainer>
          <div className="loader blink">
            {gameState === 'loading' ? 'LOADING STAGE...' : 'CALCULATING SCORE...'}
          </div>
        </PixelContainer>
      )}

      {gameState === 'playing' && (
        <Game 
          questions={questions} 
          bossImages={bossImages} 
          onComplete={handleGameComplete} 
        />
      )}

      {gameState === 'result' && (
        <Result 
          result={result} 
          onRestart={restartGame} 
        />
      )}
    </div>
  );
}

export default App;
