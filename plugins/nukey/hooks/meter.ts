import type { Meter } from '../types'
import { GREY, SCENE_HEIGHT } from './scenes'
import type { Theme } from './themes'
import { DEFAULT_THEME, THEMES } from './themes'

const RED = '#E5534B'
const LIGHT = '#F2C14E'

const PANEL_WIDTH = 80
const BUTTONS_WIDTH = 52
const BARS = 9
const FIVE_HOUR_BUTTONS = 5
const WEEK_BUTTONS = 7
// Past this share the last two units of a gauge turn red: nearly used up.
const NEARLY_FULL = 85

const round = (value: number) => Math.round(value * 10) / 10
const share = (percent: number) => Math.max(0, Math.min(1, percent / 100))

// How many of a gauge's units are lit: everything on the meter fills as it is
// used, the power bars with the context and the buttons with a rate-limit window.
const litOf = (used: number | null, units: number) => (used === null ? 0 : Math.round(share(used) * units))

// The colour of a lit unit, the last two red once the gauge is nearly full;
// nothing for a unit not reached yet, which its gauge draws as a ghost, so the
// whole scale is always in view.
function colourOf(unit: number, units: number, used: number | null, colour: string): string | undefined {
  if (unit >= litOf(used, units)) {
    return undefined
  }

  return (used ?? 0) > NEARLY_FULL && unit >= units - 2 ? RED : colour
}

// A row of buttons that light up one by one as a rate-limit window is used, the
// ones not reached yet in grey. Nothing where the account has no such window.
function buttons(x: number, y: number, radius: number, gap: number, units: number, used: number | null, trim: string): string {
  if (used === null) {
    return ''
  }

  let row = ''

  for (let unit = 0; unit < units; unit++) {
    const fill = colourOf(unit, units, used, LIGHT)

    row +=
      `<circle cx="${round(x + unit * gap)}" cy="${y}" r="${radius}" fill="${fill ?? GREY}"${fill === undefined ? ' opacity="0.6"' : ''} ` +
      `stroke="${trim}" stroke-width="0.8"/>`
  }

  return row
}

// How wide the meter is drawn: the panel alone where the account has no
// rate-limit window, the panel and its two rows of buttons otherwise.
export const meterWidth = (meter: Meter) => PANEL_WIDTH + (meter.fiveHour === null && meter.week === null ? 0 : BUTTONS_WIDTH)

// A microwave's control panel: nine power bars, rising left to right, that
// light up with the context. Beside it a row of five buttons for the five-hour
// window, and below that seven smaller ones for the week. The panel and the lit
// bars take the theme's colours.
export function meterSvg(meter: Meter, theme: Theme = THEMES[DEFAULT_THEME]): string {
  const width = meterWidth(meter)
  const floor = 48
  let bars = ''

  for (let bar = 0; bar < BARS; bar++) {
    const height = round(8 + bar * 3.6)
    const fill = colourOf(bar, BARS, meter.context, theme.accent)

    bars +=
      `<rect x="${round(11 + bar * 6.8)}" y="${round(floor - height)}" width="4.6" height="${height}" rx="1.2" ` +
      `fill="${fill ?? GREY}"${fill === undefined ? ' opacity="0.4"' : ''}/>`
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${SCENE_HEIGHT}" width="${width}" height="${SCENE_HEIGHT}" ` +
    `shape-rendering="geometricPrecision">` +
    `<rect x="3" y="4" width="74" height="52" rx="6" fill="${theme.body}" stroke="${theme.trim}" stroke-width="1.5"/>` +
    `<rect x="7" y="8" width="66" height="44" rx="3" fill="${theme.window}"/>` +
    bars +
    buttons(90.5, 23, 4, 9.1, FIVE_HOUR_BUTTONS, meter.fiveHour, theme.trim) +
    buttons(89.3, 43, 2.8, 6.3, WEEK_BUTTONS, meter.week, theme.trim) +
    `</svg>`
  )
}

// The meter in words, for whoever cannot see the drawing.
export function meterAlt(meter: Meter): string {
  const parts = [
    meter.context === null ? 'Context not measured yet' : `Context ${meter.context}% full`,
    meter.fiveHour === null ? '' : `5-hour limit ${meter.fiveHour}% used`,
    meter.week === null ? '' : `weekly limit ${meter.week}% used`,
  ]

  return parts.filter(part => part !== '').join(', ')
}

// The readings in words and figures, for beside the drawing: one line for each
// gauge that has a reading.
export function meterLines(meter: Meter): readonly { label: string; value: string }[] {
  return [
    meter.context === null ? undefined : { label: 'Context window', value: `${meter.context}%` },
    meter.fiveHour === null ? undefined : { label: '5-hour limit', value: `${meter.fiveHour}%` },
    meter.week === null ? undefined : { label: 'Weekly limit', value: `${meter.week}%` },
  ].filter(line => line !== undefined)
}

const units = (lit: number, total: number, on: string, off: string) => on.repeat(lit) + off.repeat(total - lit)

// The terminal's meter: the power bars as a row of blocks, the buttons as dots.
export function meterRow(meter: Meter): string {
  return [
    units(litOf(meter.context, BARS), BARS, '▰', '▱'),
    meter.fiveHour === null ? '' : units(litOf(meter.fiveHour, FIVE_HOUR_BUTTONS), FIVE_HOUR_BUTTONS, '●', '○'),
    meter.week === null ? '' : units(litOf(meter.week, WEEK_BUTTONS), WEEK_BUTTONS, '●', '○'),
  ]
    .filter(part => part !== '')
    .join(' ')
}
