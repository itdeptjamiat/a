import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface WindowDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
  isTablet: boolean;
}

export const useWindowDimensions = (): WindowDimensions => {
  const [dimensions, setDimensions] = useState<WindowDimensions>(() => {
    const window = Dimensions.get('window');
    return {
      width: window.width,
      height: window.height,
      scale: window.scale,
      fontScale: window.fontScale,
      isTablet: window.width >= 768,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', (result: { window: ScaledSize }) => {
      setDimensions({
        width: result.window.width,
        height: result.window.height,
        scale: result.window.scale,
        fontScale: result.window.fontScale,
        isTablet: result.window.width >= 768,
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
}; 