import type { ThemeName } from '../types'

// The colours Nukey and its control panel are drawn in: the body and its trim,
// the window that is its face, the eyes that glow in it, the cheeks, the lit
// power bars on the meter, and the colour Nukey takes in the terminal (a theme
// key there, or a raw colour).
export type Theme = {
  name: ThemeName
  label: string
  body: string
  trim: string
  window: string
  glow: string
  cheek: string
  accent: string
  terminal: string
}

export const THEMES: Record<ThemeName, Theme> = {
  classic: {
    name: 'classic',
    label: 'Classic cream',
    body: '#F5F1E8',
    trim: '#4A4F5A',
    window: '#23262E',
    glow: '#F8F4EA',
    cheek: '#F4A6B7',
    accent: '#D97757',
    terminal: 'claude',
  },
  retro: {
    name: 'retro',
    label: 'Retro mint',
    body: '#A8E0CF',
    trim: '#2F5D55',
    window: '#1F2A2A',
    glow: '#FFF6D8',
    cheek: '#F49A8A',
    accent: '#E8735A',
    terminal: '#5FB8A0',
  },
  steel: {
    name: 'steel',
    label: 'Stainless steel',
    body: '#C9CED6',
    trim: '#3D434C',
    window: '#15181D',
    glow: '#9BE7FF',
    cheek: '#E8A0B0',
    accent: '#4FA3E0',
    terminal: '#9AA4B2',
  },
  midnight: {
    name: 'midnight',
    label: 'Midnight',
    body: '#2E3240',
    trim: '#8A93A6',
    window: '#0E1016',
    glow: '#FFB454',
    cheek: '#C9737F',
    accent: '#FFB454',
    terminal: '#FFB454',
  },
  bubblegum: {
    name: 'bubblegum',
    label: 'Bubblegum',
    body: '#FFC6DA',
    trim: '#8C3B5E',
    window: '#3A1F2C',
    glow: '#FFF0F6',
    cheek: '#FF7FA8',
    accent: '#FF5C93',
    terminal: '#FF8FB7',
  },
}

export const THEME_NAMES = Object.keys(THEMES) as ThemeName[]

export const DEFAULT_THEME: ThemeName = 'classic'

export const isThemeName = (value: unknown): value is ThemeName => typeof value === 'string' && value in THEMES

// The theme after this one, for `/nukey theme` with nothing after it.
export function nextTheme(name: ThemeName): ThemeName {
  return THEME_NAMES[(THEME_NAMES.indexOf(name) + 1) % THEME_NAMES.length] ?? DEFAULT_THEME
}
