import { expect, test } from 'claude-code/testing'

import { nukeySvg, propSvg, sceneRows } from './scenes'

test('Nukey wears its mood on its window in the terminal', () => {
  expect(sceneRows('reading', 0).nukey[1]).toBe('│ ◕ ◕ │▪│')
  expect(sceneRows('idle', 0).nukey[1]).toBe('│ - - │▪│')
  expect(sceneRows('done', 1).nukey[1]).toBe('│ ^ ^ │▪│')
  expect(sceneRows('error', 0).nukey[1]).toBe('│ x x │▪│')
})

test('the dial light blinks while Nukey works and stays lit at rest', () => {
  expect(sceneRows('coding', 1).nukey[1].endsWith('▫│')).toBe(true)
  expect(sceneRows('idle', 1).nukey[1].endsWith('▪│')).toBe(true)
})

test('every terminal row of Nukey is the same width', () => {
  for (const row of sceneRows('thinking', 0).nukey) {
    expect([...row].length).toBe(9)
  }
})

test('a finished turn goes DING', () => {
  expect(propSvg('done').includes('DING!')).toBe(true)
  expect(sceneRows('done', 0).prop[1]).toBe(' DING! ')
})

test('Nukey is drawn as a microwave with a window and a dial', () => {
  const svg = nukeySvg('idle')

  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg.includes('#23262E')).toBe(true)
  expect(svg.includes('<circle cx="37.5"')).toBe(true)
})
