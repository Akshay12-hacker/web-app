'use client';

import { useState, useEffect } from 'react';

export const useCountdown = (seconds: number) => {
  const [count, setCount] = useState(seconds);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    if (count <= 0) {
      setActive(false);
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, active]);

  const reset = () => {
    setCount(seconds);
    setActive(true);
  };

  return { 
    count, 
    expired: count <= 0, 
    reset 
  };
};
