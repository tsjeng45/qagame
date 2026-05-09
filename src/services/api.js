export async function fetchQuestions(count) {
  const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
  if (!url || url.includes('請填入')) {
    console.warn("GAS URL 未設定，回傳 Mock 題目資料。");
    return Array.from({ length: count }, (_, i) => ({
      id: `q${i + 1}`,
      text: `這是一道街機測試題目 ${i + 1}？`,
      options: {
        A: '選項 A (正確)',
        B: '選項 B',
        C: '選項 C',
        D: '選項 D'
      }
    }));
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action: 'getQuestions', count })
    });
    const result = await response.json();
    if (result.success) return result.data;
    throw new Error(result.error);
  } catch (err) {
    console.error("fetchQuestions error:", err);
    throw err;
  }
}

export async function submitAnswers(id, answers, threshold) {
  const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
  if (!url || url.includes('請填入')) {
    console.warn("GAS URL 未設定，回傳 Mock 成績結果。");
    const correctCount = Math.floor(Math.random() * answers.length);
    return {
      score: correctCount,
      correctCount,
      totalQuestions: answers.length,
      highestScore: correctCount,
      playCount: 1,
      isNew: true
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action: 'submitScore', id, answers, threshold })
    });
    const result = await response.json();
    if (result.success) return result.data;
    throw new Error(result.error);
  } catch (err) {
    console.error("submitAnswers error:", err);
    throw err;
  }
}
