import type { Track } from '~/types'

// Shared state across components (persists during navigation)
const isAutoPlay = ref<boolean>(false)
const isShuffleMode = ref(false)
const shuffledQueue = ref<number[]>([]) // Track IDs in shuffled order
const currentQueueIndex = ref(0)

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

  // Generate a new shuffled queue from album tracks, excluding current track
  const generateShuffledQueue = (albumTracks: Track[], currentTrackId: number) => {
    // Get IDs of tracks excluding current
    const otherTrackIds = albumTracks
      .filter(t => t.id !== currentTrackId)
      .map(t => t.id)

    // Shuffle and set queue
    shuffledQueue.value = shuffleArray(otherTrackIds)
    currentQueueIndex.value = 0
  }

  // Generate a full shuffled queue (when we've gone through all tracks)
  const generateFullShuffledQueue = (albumTracks: Track[]) => {
    const allTrackIds = albumTracks.map(t => t.id)
    shuffledQueue.value = shuffleArray(allTrackIds)
    currentQueueIndex.value = 0
  }

  // Get next track based on mode (shuffle or sequential)
  const getNextTrack = (albumTracks: Track[], currentTrackId: number): Track | null => {
    if (isShuffleMode.value) {
      // If queue is empty or we've reached the end, regenerate
      if (shuffledQueue.value.length === 0 || currentQueueIndex.value >= shuffledQueue.value.length) {
        generateFullShuffledQueue(albumTracks)
      }

      const nextTrackId = shuffledQueue.value[currentQueueIndex.value]
      currentQueueIndex.value++

      return albumTracks.find(t => t.id === nextTrackId) ?? null
    } else {
      // Sequential mode
      const currentIndex = albumTracks.findIndex(t => t.id === currentTrackId)
      if (currentIndex < albumTracks.length - 1) {
        return albumTracks[currentIndex + 1] ?? null
      }
      // Loop back to first track if autoplay is on
      if (isAutoPlay.value) {
        return albumTracks[0] ?? null
      }
      return null
    }
  }

  // Get previous track (always sequential, but respects current position in shuffle)
  const getPrevTrack = (albumTracks: Track[], currentTrackId: number): Track | null => {
    if (isShuffleMode.value && currentQueueIndex.value > 1) {
      // Go back in shuffle queue
      currentQueueIndex.value -= 2 // -2 because we already incremented when we got here
      if (currentQueueIndex.value < 0) currentQueueIndex.value = 0

      const prevTrackId = shuffledQueue.value[currentQueueIndex.value]
      currentQueueIndex.value++

      return albumTracks.find(t => t.id === prevTrackId) ?? null
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
      // Generate initial shuffled queue
      generateShuffledQueue(albumTracks, currentTrackId)
    } else {
      // Clear queue when disabling shuffle
      shuffledQueue.value = []
      currentQueueIndex.value = 0
    }
  }

  // Initialize queue when entering a track (useful for maintaining state)
  const initializeQueue = (albumTracks: Track[], currentTrackId: number) => {
    if (isShuffleMode.value && shuffledQueue.value.length === 0) {
      generateShuffledQueue(albumTracks, currentTrackId)
    }
  }

  // Get next track URL for navigation
  const getNextTrackUrl = (albumId: string, albumTracks: Track[], currentTrackId: number): string | undefined => {
    const nextTrack = getNextTrack(albumTracks, currentTrackId)
    // Reset index since we're just peeking, not actually navigating
    if (isShuffleMode.value && shuffledQueue.value.length > 0) {
      currentQueueIndex.value = Math.max(0, currentQueueIndex.value - 1)
    }
    return nextTrack ? `/album/${albumId}/track/${nextTrack.id}` : undefined
  }

  // Actually navigate to next track (increments queue index)
  const goToNextTrack = (albumId: string, albumTracks: Track[], currentTrackId: number): string | undefined => {
    const nextTrack = getNextTrack(albumTracks, currentTrackId)
    return nextTrack ? `/album/${albumId}/track/${nextTrack.id}` : undefined
  }

  return {
    // State
    isAutoPlay: readonly(isAutoPlay),
    isShuffleMode: readonly(isShuffleMode),
    shuffledQueue: readonly(shuffledQueue),

    // Methods
    toggleAutoPlay,
    toggleShuffleMode,
    initializeQueue,
    getNextTrack,
    getPrevTrack,
    getNextTrackUrl,
    goToNextTrack,
  }
}
