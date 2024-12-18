export const playSound = (type: 'mint' | 'burn' | 'subscription') => {
  const sounds = {
    mint: '/sounds/mint.mp3',
    burn: '/sounds/burn.mp3',
    subscription: '/sounds/notification.mp3'
  };

  const audio = new Audio(sounds[type]);
  audio.volume = 0.3;
  return audio.play().catch(console.error);
};

export const preloadSounds = () => {
  const sounds = [
    '/sounds/mint.mp3',
    '/sounds/burn.mp3',
    '/sounds/notification.mp3'
  ];

  sounds.forEach(src => {
    const audio = new Audio();
    audio.src = src;
  });
}; 