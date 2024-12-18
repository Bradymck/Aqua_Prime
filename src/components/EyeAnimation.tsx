import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface EyeAnimationProps {
  defaultEye: string;
}

const EyeAnimation: React.FC<EyeAnimationProps> = ({ defaultEye }) => {
  const [eyeState, setEyeState] = useState('default');
  const [animatedEye, setAnimatedEye] = useState<string | null>(null);

  const animatedEyes = useMemo(() => [
    '/img/eyes_animated/Apathetic.png',
    '/img/eyes_animated/left.png',
    '/img/eyes_animated/Stare.png',
    '/img/eyes_animated/Sneaky.png',
    '/img/eyes_animated/Blink.png',
    '/img/eyes_animated/Squint.png',
    '/img/eyes_animated/Mad.png',
  ], []);

  const changeEyeState = useCallback(() => {
    const eyeStates = [defaultEye, ...animatedEyes].filter(Boolean);
    const newIndex = Math.floor(Math.random() * eyeStates.length);
    setAnimatedEye(eyeStates[newIndex]);
    setEyeState(newIndex === 0 ? 'default' : 'animated');
  }, [defaultEye, animatedEyes]);

  const blinkEye = useCallback(() => {
    const prevState = eyeState;
    setEyeState('blink');
    setTimeout(() => setEyeState(prevState), 100);
  }, [eyeState]);

  useEffect(() => {
    const animationInterval = setInterval(changeEyeState, 5000);
    const blinkInterval = setInterval(blinkEye, Math.random() * 3000 + 2000);

    return () => {
      clearInterval(animationInterval);
      clearInterval(blinkInterval);
    };
  }, [changeEyeState, blinkEye]);

  return (
    <>
      {eyeState === 'animated' && animatedEye && (
        <Image
          src={animatedEye}
          alt="Animated Eyes"
          fill
          style={{ objectFit: 'contain' }}
        />
      )}
    </>
  );
};

export default EyeAnimation;