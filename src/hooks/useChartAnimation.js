import { useState, useEffect, useRef } from 'react';

export const useChartAnimation = (data, animationDuration = 300) => {
  const [animatedData, setAnimatedData] = useState(data);
  const animationRef = useRef(null);
  const previousDataRef = useRef(data);

  useEffect(() => {
    // Clear any pending animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    // If data hasn't changed, no need to animate
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    const startTime = Date.now();
    const startData = previousDataRef.current;
    const endData = data;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      // Interpolate between start and end data
      const interpolatedData = interpolateData(startData, endData, easeOutQuart);
      setAnimatedData(interpolatedData);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousDataRef.current = endData;
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, animationDuration]);

  return animatedData;
};

// Helper function to interpolate between two data sets
const interpolateData = (startData, endData, progress) => {
  if (!startData || !endData) return endData || startData || [];

  // Handle arrays
  if (Array.isArray(endData)) {
    if (!Array.isArray(startData)) return endData;
    
    return endData.map((endItem, index) => {
      const startItem = startData[index];
      
      if (typeof endItem === 'number' && typeof startItem === 'number') {
        return startItem + (endItem - startItem) * progress;
      }
      
      if (typeof endItem === 'object' && endItem !== null && typeof startItem === 'object' && startItem !== null) {
        return interpolateObject(startItem, endItem, progress);
      }
      
      return endItem;
    });
  }

  // Handle objects
  if (typeof endData === 'object' && endData !== null) {
    return interpolateObject(startData || {}, endData, progress);
  }

  return endData;
};

// Helper function to interpolate between two objects
const interpolateObject = (startObj, endObj, progress) => {
  const result = {};
  
  for (const key in endObj) {
    const endValue = endObj[key];
    const startValue = startObj[key];
    
    if (typeof endValue === 'number' && typeof startValue === 'number') {
      result[key] = startValue + (endValue - startValue) * progress;
    } else if (typeof endValue === 'object' && endValue !== null && typeof startValue === 'object' && startValue !== null) {
      result[key] = interpolateObject(startValue, endValue, progress);
    } else {
      result[key] = endValue;
    }
  }
  
  return result;
};

export default useChartAnimation;
