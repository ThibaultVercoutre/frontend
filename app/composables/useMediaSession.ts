import type { Track } from '~/types'

interface MediaSessionOptions {
  onPlay?: () => void
  onPause?: () => void
  onSeekBackward?: () => void
  onSeekForward?: () => void
  onPreviousTrack?: () => void
  onNextTrack?: () => void
}

export function useMediaSession() {
  // Check immediately (not in onMounted) so metadata can be set during setup
  const isSupported = ref(import.meta.client ? 'mediaSession' in navigator : false)

  // Update media session metadata
  const updateMetadata = (track: Track | undefined, coverUrl?: string) => {
    if (!isSupported.value || !track) return

    const artwork: MediaImage[] = []
    if (coverUrl) {
      artwork.push(
        { src: coverUrl, sizes: '96x96', type: 'image/jpeg' },
        { src: coverUrl, sizes: '128x128', type: 'image/jpeg' },
        { src: coverUrl, sizes: '192x192', type: 'image/jpeg' },
        { src: coverUrl, sizes: '256x256', type: 'image/jpeg' },
        { src: coverUrl, sizes: '384x384', type: 'image/jpeg' },
        { src: coverUrl, sizes: '512x512', type: 'image/jpeg' },
      )
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.subtitle || 'Gabrielle',
      album: 'Gabrielle',
      artwork,
    })
  }

  // Update playback state
  const updatePlaybackState = (state: 'playing' | 'paused' | 'none') => {
    if (!isSupported.value) return
    navigator.mediaSession.playbackState = state
  }

  // Update position state for seek bar
  const updatePositionState = (duration: number, position: number, playbackRate = 1) => {
    if (!isSupported.value) return
    if (duration <= 0 || !isFinite(duration)) return

    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate,
        position: Math.min(position, duration),
      })
    } catch {
      // Position state not supported or invalid values
    }
  }

  // Set up action handlers
  const setActionHandlers = (options: MediaSessionOptions) => {
    if (!isSupported.value) return

    const handlers: Array<[MediaSessionAction, (() => void) | undefined]> = [
      ['play', options.onPlay],
      ['pause', options.onPause],
      ['seekbackward', options.onSeekBackward],
      ['seekforward', options.onSeekForward],
      ['previoustrack', options.onPreviousTrack],
      ['nexttrack', options.onNextTrack],
    ]

    handlers.forEach(([action, handler]) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler || null)
      } catch {
        // Action not supported
      }
    })
  }

  // Clear all handlers
  const clearActionHandlers = () => {
    if (!isSupported.value) return

    const actions: MediaSessionAction[] = [
      'play',
      'pause',
      'seekbackward',
      'seekforward',
      'previoustrack',
      'nexttrack',
    ]

    actions.forEach((action) => {
      try {
        navigator.mediaSession.setActionHandler(action, null)
      } catch {
        // Action not supported
      }
    })
  }

  return {
    isSupported: readonly(isSupported),
    updateMetadata,
    updatePlaybackState,
    updatePositionState,
    setActionHandlers,
    clearActionHandlers,
  }
}
