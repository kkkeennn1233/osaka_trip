import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose' | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone';

export interface Theme {
  id: string;
  name: string;
  primary: ThemeColor;
  neutral: ThemeColor;
  accent: ThemeColor;
}

export interface Font {
  id: string;
  name: string;
  className: string;
}

interface ThemeContextType {
  currentTheme: Theme;
  currentFont: Font;
  setThemeId: (id: string) => void;
  setFontId: (id: string) => void;
  themes: Theme[];
  fonts: Font[];
}

const THEMES: Theme[] = [
  { id: 'maple', name: '🍁 楓葉紅', primary: 'red', neutral: 'stone', accent: 'orange' },
  { id: 'sakura', name: '🌸 櫻花粉', primary: 'pink', neutral: 'stone', accent: 'rose' },
  { id: 'matcha', name: '🍵 抹茶綠', primary: 'emerald', neutral: 'stone', accent: 'lime' },
  { id: 'ocean', name: '🌊 海洋藍', primary: 'sky', neutral: 'slate', accent: 'blue' },
  { id: 'lavender', name: '💜 薰衣草', primary: 'violet', neutral: 'zinc', accent: 'fuchsia' },
  { id: 'night', name: '🌃 經典黑', primary: 'neutral', neutral: 'gray', accent: 'zinc' },
];

const FONTS: Font[] = [
  { id: 'sans', name: '現代黑體', className: 'font-sans' },
  { id: 'serif', name: '優雅明體', className: 'font-serif' },
  { id: 'cute', name: '可愛圓體', className: 'font-cute' },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: React.PropsWithChildren<{}>) {
  // Try to load from localStorage
  const [themeId, setThemeIdState] = useState(() => {
    try {
      return localStorage.getItem('app-theme') || 'maple';
    } catch {
      return 'maple';
    }
  });
  
  const [fontId, setFontIdState] = useState(() => {
    try {
      return localStorage.getItem('app-font') || 'sans';
    } catch {
      return 'sans';
    }
  });

  const setThemeId = (id: string) => {
    setThemeIdState(id);
    try { localStorage.setItem('app-theme', id); } catch {}
  };

  const setFontId = (id: string) => {
    setFontIdState(id);
    try { localStorage.setItem('app-font', id); } catch {}
  };

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const currentFont = FONTS.find(f => f.id === fontId) || FONTS[0];

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      currentFont, 
      setThemeId, 
      setFontId,
      themes: THEMES,
      fonts: FONTS
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}