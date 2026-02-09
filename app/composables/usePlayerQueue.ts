import type { Track } from '~/types'

// Shared state across components (persists during navigation)
const isAutoPlay = ref<boolean>(false)
const isShuffleMode = ref<boolean>(false)
const shuffledQueue = ref<number[]>([]) // Track IDs in shuffled order
const playHistory = ref<number[]>([]) // History of played track IDs for back navigation
const currentAlbumId = ref<string>('') // Track which album the queue is for

export function usePlayerQueue() {
  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = shuffled[i]
      shuffled[i] = shuffled[j] as T
      shuffled[j] = temp as T
    }
    return shuffled
  }

  // Generate a new shuffled queue from album tracks
  const generateShuffledQueue = (albumTracks: Track[], currentTrackId?: number) => {
    // Get all track IDs and shuffle them
    const allTrackIds = albumTracks.map(t => t.id)
    let shuffled = shuffleArray(allTrackIds)

    // If we have a current track, make sure it's not first in queue
    // (to avoid playing the same track twice in a row)
    if (currentTrackId !== undefined) {
      // Remove current track from shuffle and add to end
      shuffled = shuffled.filter(id => id !== currentTrackId)
      // Don't add current track back - we'll regenerate when queue is empty
    }

    shuffledQueue.value = shuffled
  }

  // Peek at next track without modifying state (for UI display)
  const peekNextTrack = (albumTracks: Track[], currentTrackId: number): Track | null => {
    if (albumTracks.length === 0) return null

    if (isShuffleMode.value) {
      // In shuffle mode, peek at next in queue
      if (shuffledQueue.value.length > 0) {
        const nextId = shuffledQueue.value[0]
        return albumTracks.find(t => t.id === nextId) ?? null
      }
      // Queue empty - would regenerate, so return a random track (not current)
      const otherTracks = albumTracks.filter(t => t.id !== currentTrackId)
      return otherTracks.length > 0 ? otherTracks[0] ?? null : albumTracks[0] ?? null
    } else {
      // Sequential mode - return next track in order
      const currentIndex = albumTracks.findIndex(t => t.id === currentTrackId)
      if (currentIndex < albumTracks.length - 1) {
        return albumTracks[currentIndex + 1] ?? null
      }
      // At end of album - loop if autoplay, else null
      return isAutoPlay.value ? (albumTracks[0] ?? null) : null
    }
  }

  // Peek at previous track without modifying state
  const peekPrevTrack = (albumTracks: Track[], currentTrackId: number): Track | null => {
    if (albumTracks.length === 0) return null

    if (isShuffleMode.value && playHistory.value.length > 0) {
      // In shuffle mode, check play history
      const prevId = playHistory.value[playHistory.value.length - 1]
      return albumTracks.find(t => t.id === prevId) ?? null
    } else {
      // Sequential mode - return previous track in order
      const currentIndex = albumTracks.findIndex(t => t.id === currentTrackId)
      if (currentIndex > 0) {
        return albumTracks[currentIndex - 1] ?? null
      }
      return null
    }
  }

  // Get and consume next track (modifies queue state)
  const consumeNextTrack = (albumTracks: Track[], currentTrackId: number): Track | null => {
    if (albumTracks.length === 0) return null

    // Add current track to history (allow duplicates for proper linear back-navigation)
    playHistory.value.push(currentTrackId)
    // Keep history limited to prevent memory issues
    if (playHistory.value.length > 50) {
      playHistory.value = playHistory.value.slice(-30)
    }

    if (isShuffleMode.value) {
      // If queue is empty, regenerate
      if (shuffledQueue.value.length === 0) {
        generateShuffledQueue(albumTracks, currentTrackId)
      }

      // Still empty? (single track album)
      if (shuffledQueue.value.length === 0) {
        return isAutoPlay.value ? (albumTracks[0] ?? null) : null
      }

      // Take first track from queue
      const nextId = shuffledQueue.value.shift()!
      return albumTracks.find(t => t.id === nextId) ?? null
    } else {
      // Sequential mode
      const currentIndex = albumTracks.findIndex(t => t.id === currentTrackId)
      if (currentIndex < albumTracks.length - 1) {
        return albumTracks[currentIndex + 1] ?? null
      }
      // Loop to beginning if autoplay is on
      return isAutoPlay.value ? (albumTracks[0] ?? null) : null
    }
  }

  // Get and consume previous track (modifies history state)
  const consumePrevTrack = (albumTracks: Track[], currentTrackId: number): Track | null => {
    if (albumTracks.length === 0) return null

    if (isShuffleMode.value && playHistory.value.length > 0) {
      // Pop from history and put current track back at front of queue
      const prevId = playHistory.value.pop()!

      // Put current track back at start of shuffle queue
      shuffledQueue.value.unshift(currentTrackId)

      return albumTracks.find(t => t.id === prevId) ?? null
    } else {
      // Sequential mode
      const currentIndex = albumTracks.findIndex(t => t.id === currentTrackId)
      if (currentIndex > 0) {
        return albumTracks[currentIndex - 1] ?? null
      }
      return null
    }
  }

  // Toggle autoplay
  const toggleAutoPlay = () => {
    isAutoPlay.value = !isAutoPlay.value
  }

  // Toggle shuffle mode
  const toggleShuffleMode = (albumTracks: Track[], currentTrackId: number) => {
    isShuffleMode.value = !isShuffleMode.value

    if (isShuffleMode.value) {
      // Generate initial shuffled queue and clear history
      generateShuffledQueue(albumTracks, currentTrackId)
      playHistory.value = []
      currentAlbumId.value = albumTracks[0]?.albumId || ''
    } else {
      // Clear queue and history when disabling shuffle
      shuffledQueue.value = []
      playHistory.value = []
    }
  }

  // Initialize/reset queue when entering a new album
  const initializeQueue = (albumTracks: Track[], currentTrackId: number) => {
    const albumId = albumTracks[0]?.albumId || ''

    // If album changed, reset everything
    if (currentAlbumId.value !== albumId) {
      currentAlbumId.value = albumId
      playHistory.value = []

      if (isShuffleMode.value) {
        generateShuffledQueue(albumTracks, currentTrackId)
      }
    } else if (isShuffleMode.value && shuffledQueue.value.length === 0) {
      // Same album but queue is empty, regenerate
      generateShuffledQueue(albumTracks, currentTrackId)
    }
  }

  // Get next track URL for display (doesn't consume)
  const getNextTrackUrl = (albumId: string, albumTracks: Track[], currentTrackId: number): string | undefined => {
    const nextTrack = peekNextTrack(albumTracks, currentTrackId)
    return nextTrack ? `/album/${albumId}/track/${nextTrack.id}` : undefined
  }

  // Get previous track URL for display (doesn't consume)
  const getPrevTrackUrl = (albumId: string, albumTracks: Track[], currentTrackId: number): string | undefined => {
    const prevTrack = peekPrevTrack(albumTracks, currentTrackId)
    return prevTrack ? `/album/${albumId}/track/${prevTrack.id}` : undefined
  }

  // Navigate to next track (consumes from queue)
  const goToNextTrack = (albumId: string, albumTracks: Track[], currentTrackId: number): string | undefined => {
    const nextTrack = consumeNextTrack(albumTracks, currentTrackId)
    return nextTrack ? `/album/${albumId}/track/${nextTrack.id}` : undefined
  }

  // Navigate to previous track (consumes from history)
  const goToPrevTrack = (albumId: string, albumTracks: Track[], currentTrackId: number): string | undefined => {
    const prevTrack = consumePrevTrack(albumTracks, currentTrackId)
    return prevTrack ? `/album/${albumId}/track/${prevTrack.id}` : undefined
  }

  // Check if there's a next track available
  const hasNextTrack = (albumTracks: Track[], currentTrackId: number): boolean => {
    if (isShuffleMode.value) {
      // In shuffle, there's always a next track (we regenerate queue)
      return albumTracks.length > 1 || isAutoPlay.value
    }
    if (isAutoPlay.value) {
      // In autoplay, we loop
      return albumTracks.length > 0
    }
    // Sequential without autoplay - check if at end
    const currentIndex = albumTracks.findIndex(t => t.id === currentTrackId)
    return currentIndex < albumTracks.length - 1
  }

  // Check if there's a previous track available
  const hasPrevTrack = (albumTracks: Track[], currentTrackId: number): boolean => {
    if (isShuffleMode.value) {
      return playHistory.value.length > 0
    }
    const currentIndex = albumTracks.findIndex(t => t.id === currentTrackId)
    return currentIndex > 0
  }

  return {
    // State (readonly for external use)
    isAutoPlay: readonly(isAutoPlay),
    isShuffleMode: readonly(isShuffleMode),
    shuffledQueue: readonly(shuffledQueue),
    playHistory: readonly(playHistory),

    // Methods
    toggleAutoPlay,
    toggleShuffleMode,
    initializeQueue,

    // Peek methods (no side effects, for UI)
    peekNextTrack,
    peekPrevTrack,
    getNextTrackUrl,
    getPrevTrackUrl,
    hasNextTrack,
    hasPrevTrack,

    // Consume methods (modify state, for navigation)
    goToNextTrack,
    goToPrevTrack,
  }
}
