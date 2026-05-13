import { intradebasClassicTheme } from './intradebas-classic';
import { zapierWarmTheme } from './zapier-warm';

export type ThemeTokens = Record<`--${string}`, string>;

export type ThemeDefinition = {
  id: string;
  label: string;
  description: string;
  colorScheme: 'light' | 'dark';
  tokens: ThemeTokens;
};

export const themeRegistry = {
  [intradebasClassicTheme.id]: intradebasClassicTheme,
  [zapierWarmTheme.id]: zapierWarmTheme,
} satisfies Record<string, ThemeDefinition>;

export const themes = Object.values(themeRegistry);

export const defaultThemeId = zapierWarmTheme.id;
export const themeStorageKey = 'intradebas.active-theme';

export function isThemeId(value: string): value is keyof typeof themeRegistry {
  return value in themeRegistry;
}

export function getThemeById(themeId: string): ThemeDefinition {
  return themeRegistry[isThemeId(themeId) ? themeId : defaultThemeId];
}

export function serializeThemeTokens(tokens: ThemeTokens): string {
  return Object.entries(tokens)
    .map(([token, value]) => `${token}:${value}`)
    .join(';');
}

export function buildThemeBootScript(): string {
  return `(() => {
    const registry = ${JSON.stringify(themeRegistry)};
    const storageKey = ${JSON.stringify(themeStorageKey)};
    const defaultThemeId = ${JSON.stringify(defaultThemeId)};
    const root = document.documentElement;
    const storedThemeId = window.localStorage.getItem(storageKey);
    const themeId = storedThemeId && registry[storedThemeId] ? storedThemeId : defaultThemeId;
    const theme = registry[themeId];
    root.dataset.theme = themeId;
    root.style.colorScheme = theme.colorScheme;
    Object.entries(theme.tokens).forEach(([token, value]) => {
      root.style.setProperty(token, value);
    });
  })();`;
}
