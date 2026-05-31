import { useState, useEffect, useRef } from 'react';

export function useCountUp(target, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const frameRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const range = target - start;

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + range * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    }

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, start]);

  return count;
}
