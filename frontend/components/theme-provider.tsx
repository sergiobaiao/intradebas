'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  defaultThemeId,
  getThemeById,
  themeRegistry,
  themeStorageKey,
  themes,
  type ThemeDefinition,
} from '@/designs';

type ThemeContextValue = {
  theme: ThemeDefinition;
  themes: ThemeDefinition[];
  setTheme: (themeId: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeDefinition) {
  const root = document.documentElement;

  root.dataset.theme = theme.id;
  root.style.colorScheme = theme.colorScheme;

  for (const [token, value] of Object.entries(theme.tokens)) {
    root.style.setProperty(token, value);
  }
}

function resolveInitialThemeId() {
  if (typeof document === 'undefined') {
    return defaultThemeId;
  }

  const datasetTheme = document.documentElement.dataset.theme;
  if (datasetTheme && datasetTheme in themeRegistry) {
    return datasetTheme;
  }

  const storedThemeId = window.localStorage.getItem(themeStorageKey);
  if (storedThemeId && storedThemeId in themeRegistry) {
    return storedThemeId;
  }

  return defaultThemeId;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(resolveInitialThemeId);

  useEffect(() => {
    const theme = getThemeById(themeId);

    applyTheme(theme);
    window.localStorage.setItem(themeStorageKey, theme.id);
  }, [themeId]);

  const setTheme = useCallback((nextThemeId: string) => {
    setThemeId(getThemeById(nextThemeId).id);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme: getThemeById(themeId),
      themes,
      setTheme,
    };
  }, [setTheme, themeId]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
