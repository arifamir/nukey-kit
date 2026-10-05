import { expect, test } from 'claude-code/testing'

import { meterSvg } from './meter'
import { nukeySvg, propSvg } from './scenes'
import { DEFAULT_THEME, THEMES, THEME_NAMES, isThemeName, nextTheme } from './themes'

test('every theme draws Nukey in its own colours', () => {
  for (const name of THEME_NAMES) {
    const colours = THEMES[name]
    const svg = nukeySvg('reading', colours)

    expect(svg.includes(colours.body)).toBe(true)
    expect(svg.includes(colours.window)).toBe(true)
    expect(svg.includes(colours.glow)).toBe(true)
  }
})

test('the helpers and the meter follow the theme', () => {
  const colours = THEMES.bubblegum

  expect(propSvg('delegating', colours).includes(colours.body)).toBe(true)
  expect(meterSvg({ context: 50, fiveHour: null, week: null }, colours).includes(colours.accent)).toBe(true)
  expect(meterSvg({ context: 50, fiveHour: null, week: null }, colours).includes(THEMES.classic.accent)).toBe(false)
})

test('the classic theme is the default', () => {
  expect(DEFAULT_THEME).toBe('classic')
  expect(nukeySvg('idle')).toBe(nukeySvg('idle', THEMES.classic))
})

test('cycling the themes visits each once and comes back round', () => {
  let name = DEFAULT_THEME
  const seen = new Set<string>()

  for (let i = 0; i < THEME_NAMES.length; i++) {
    seen.add(name)
    name = nextTheme(name)
  }

  expect(seen.size).toBe(THEME_NAMES.length)
  expect(name).toBe(DEFAULT_THEME)
})

test('only known names are themes', () => {
  expect(isThemeName('retro')).toBe(true)
  expect(isThemeName('toaster')).toBe(false)
  expect(isThemeName(undefined)).toBe(false)
})
