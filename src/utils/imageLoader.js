export const preloadImages = async (count = 10) => {
  // 產生不同的 seed 以獲取不同的 pixel-art
  const seeds = Array.from({ length: count }, (_, i) => `boss-${Date.now()}-${i}`);
  const promises = seeds.map(seed => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${seed}`;
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = () => resolve(url); // 即使失敗也 resolve，避免 Promise.all 卡住
    });
  });

  return Promise.all(promises);
};
