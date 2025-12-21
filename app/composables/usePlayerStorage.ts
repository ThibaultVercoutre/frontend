const STORAGE_KEYS = {
  VOLUME: 'gabrielle-player-volume',
  MUTED: 'gabrielle-player-muted',
  LAST_TRACK: 'gabrielle-last-track',
  LAST_POSITION: 'gabrielle-last-position',
  SHUFFLE_MODE: 'gabrielle-shuffle-mode',
  AUTO_PLAY: 'gabrielle-auto-play',
  KARAOKE_MODE: 'gabrielle-karaoke-mode',
} as const

interface LastTrackData {
  albumId: string
  trackId: number
  position: number
  timestamp: number
}

export function usePlayerStorage() {
  // Volume (0-1)
  const saveVolume = (volume: number) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEYS.VOLUME, String(volume))
    }
  }

  const loadVolume = (): number => {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEYS.VOLUME)
      if (saved !== null) {
        const parsed = parseFloat(saved)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          return parsed
        }
      }
    }
    return 0.5 // Default volume
  }

  // Muted state
  const saveMuted = (muted: boolean) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEYS.MUTED, String(muted))
    }
  }

  const loadMuted = (): boolean => {
    if (import.meta.client) {
      return localStorage.getItem(STORAGE_KEYS.MUTED) === 'true'
    }
    return false
  }

  // Last track and position
  const saveLastTrack = (albumId: string, trackId: number, position: number) => {
    if (import.meta.client) {
      const data: LastTrackData = {
        albumId,
        trackId,
        position,
        timestamp: Date.now(),
      }
      localStorage.setItem(STORAGE_KEYS.LAST_TRACK, JSON.stringify(data))
    }
  }

  const loadLastTrack = (): LastTrackData | null => {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_TRACK)
      if (saved) {
        try {
          const data = JSON.parse(saved) as LastTrackData
          // Only return if less than 24 hours old
          if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
            return data
          }
        } catch {
          // Invalid JSON
        }
      }
    }
    return null
  }

  const clearLastTrack = () => {
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEYS.LAST_TRACK)
    }
  }

  // Shuffle mode
  const saveShuffleMode = (enabled: boolean) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEYS.SHUFFLE_MODE, String(enabled))
    }
  }

  const loadShuffleMode = (): boolean => {
    if (import.meta.client) {
      return localStorage.getItem(STORAGE_KEYS.SHUFFLE_MODE) === 'true'
    }
    return false
  }

  // Auto-play mode
  const saveAutoPlay = (enabled: boolean) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEYS.AUTO_PLAY, String(enabled))
    }
  }

  const loadAutoPlay = (): boolean => {
    if (import.meta.client) {
      return localStorage.getItem(STORAGE_KEYS.AUTO_PLAY) === 'true'
    }
    return false
  }

  // Karaoke mode
  const saveKaraokeMode = (enabled: boolean) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEYS.KARAOKE_MODE, String(enabled))
    }
  }

  const loadKaraokeMode = (): boolean => {
    if (import.meta.client) {
      return localStorage.getItem(STORAGE_KEYS.KARAOKE_MODE) === 'true'
    }
    return false
  }

  return {
    // Volume
    saveVolume,
    loadVolume,

    // Muted
    saveMuted,
    loadMuted,

    // Last track
    saveLastTrack,
    loadLastTrack,
    clearLastTrack,

    // Shuffle
    saveShuffleMode,
    loadShuffleMode,

    // Auto-play
    saveAutoPlay,
    loadAutoPlay,

    // Karaoke
    saveKaraokeMode,
    loadKaraokeMode,
  }
}
