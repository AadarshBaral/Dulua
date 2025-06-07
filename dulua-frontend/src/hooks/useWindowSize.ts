'use client'

import { useState, useEffect } from 'react';

interface windowProperties  {
    width : number | undefined;
    height : number | undefined;
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<windowProperties>({
    width:  undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default useWindowSize;