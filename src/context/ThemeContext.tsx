import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';
type InterfaceScaling = 'compact' | 'comfortable';

interface ThemeContextProps {
  theme: Theme;
  fontSize: FontSize;
  interfaceScaling: InterfaceScaling;
  reduceAnimations: boolean;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setInterfaceScaling: (scaling: InterfaceScaling) => void;
  setReduceAnimations: (reduce: boolean) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('trustlens_theme') as Theme) || 'system';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('trustlens_font_size') as FontSize) || 'medium';
  });

  const [interfaceScaling, setInterfaceScalingState] = useState<InterfaceScaling>(() => {
    return (localStorage.getItem('trustlens_interface_scaling') as InterfaceScaling) || 'comfortable';
  });

  const [reduceAnimations, setReduceAnimationsState] = useState<boolean>(() => {
    return localStorage.getItem('trustlens_reduce_animations') === 'true';
  });

  // Handle Theme Application
  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();

    // Setup listener for system theme changes if 'system' option is active
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Handle Font Size Application to root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${fontSize}`);
    
    // Also set standard CSS variables for scaling
    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSize]);

  // Handle Interface Scaling
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('scaling-compact', 'scaling-comfortable');
    root.classList.add(`scaling-${interfaceScaling}`);
    
    if (interfaceScaling === 'compact') {
      root.style.setProperty('--spacing-modifier', '0.8');
    } else {
      root.style.setProperty('--spacing-modifier', '1.0');
    }
  }, [interfaceScaling]);

  // Handle Reduce Animations class application
  useEffect(() => {
    const root = document.documentElement;
    if (reduceAnimations) {
      root.classList.add('reduce-animations');
    } else {
      root.classList.remove('reduce-animations');
    }
  }, [reduceAnimations]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('trustlens_theme', newTheme);
  };

  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
    localStorage.setItem('trustlens_font_size', newSize);
  };

  const setInterfaceScaling = (newScaling: InterfaceScaling) => {
    setInterfaceScalingState(newScaling);
    localStorage.setItem('trustlens_interface_scaling', newScaling);
  };

  const setReduceAnimations = (reduce: boolean) => {
    setReduceAnimationsState(reduce);
    localStorage.setItem('trustlens_reduce_animations', String(reduce));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        fontSize,
        interfaceScaling,
        reduceAnimations,
        setTheme,
        setFontSize,
        setInterfaceScaling,
        setReduceAnimations,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
