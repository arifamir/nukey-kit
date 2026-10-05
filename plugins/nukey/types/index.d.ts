export type Activity =
  | 'idle'
  | 'thinking'
  | 'reading'
  | 'coding'
  | 'writing'
  | 'designing'
  | 'terminal'
  | 'searching'
  | 'web'
  | 'delegating'
  | 'talking'
  | 'asking'
  | 'planning'
  | 'tool'
  | 'done'
  | 'permission'
  | 'compacting'
  | 'error'
  | 'waiting'
  | 'testing'
  | 'git'
  | 'installing'
  | 'skill'
  | 'memory'
  | 'sharing'

export type Scene = { activity: Activity; detail: string }

// What the control-panel meter shows, each in whole percents used: the context
// window's fill, and the five-hour and weekly rate-limit windows. `null` where
// there is no reading: before the first response, or off a subscription.
export type Meter = { context: number | null; fiveHour: number | null; week: number | null }

declare module 'claude-code' {
  interface PluginState {
    'nukey': {
      scene: Scene
      isHidden: boolean
      frame: number
      meter: Meter
      isMetered: boolean
      isDetailed: boolean
      isRaw: boolean
    }
  }
}
