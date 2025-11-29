// Track types
export interface Track {
  id: number
  title: string
  subtitle: string
  duration: string
  type: TrackType
  filename?: string
}

export type TrackType = 'epic' | 'celtic' | 'military'

// Lyrics types
export interface LyricLine {
  time: number // in seconds
  text: string
}

export interface LyricsData {
  trackId: number
  lines: LyricLine[]
}

// API types
export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

export interface ApiRequestOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number>
}

// Audio player types
export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
}

// Visualizer types
export interface VisualizerOptions {
  mode?: number
  barSpace?: number
  gradient?: string
  mirror?: number
  showPeaks?: boolean
  smoothing?: number
}
