import { useState } from 'react';

export const useMoonstonePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => setIsOpen(!isOpen);

  return { isOpen, togglePopup };
};
