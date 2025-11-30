export function useAudioPlayer() {
  const audioRef = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.5)
  const isMuted = ref(false)

  let animationId: number | null = null

  // Progress percentage
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  // Format time in mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formattedCurrentTime = computed(() => formatTime(currentTime.value))
  const formattedDuration = computed(() => formatTime(duration.value))

  // Timeline update loop
  const updateTimeline = () => {
    if (audioRef.value && !audioRef.value.paused) {
      currentTime.value = audioRef.value.currentTime
    }
    animationId = requestAnimationFrame(updateTimeline)
  }

  // Initialize audio element
  const initAudio = (element: HTMLAudioElement) => {
    audioRef.value = element
    audioRef.value.volume = volume.value
  }

  // Play/Pause toggle
  const togglePlay = async (): Promise<boolean> => {
    if (!audioRef.value) return false

    if (isPlaying.value) {
      audioRef.value.pause()
      isPlaying.value = false
      return false
    } else {
      try {
        await audioRef.value.play()
        isPlaying.value = true
        return true
      } catch (error) {
        console.error('Error playing audio:', error)
        return false
      }
    }
  }

  // Play
  const play = async (): Promise<boolean> => {
    if (!audioRef.value || isPlaying.value) return isPlaying.value

    try {
      await audioRef.value.play()
      isPlaying.value = true
      return true
    } catch (error) {
      console.error('Error playing audio:', error)
      return false
    }
  }

  // Pause
  const pause = () => {
    if (!audioRef.value) return
    audioRef.value.pause()
    isPlaying.value = false
  }

  // Seek to time
  const seek = (time: number) => {
    if (!audioRef.value) return
    currentTime.value = time
    audioRef.value.currentTime = time
  }

  // Seek by percentage
  const seekByPercent = (percent: number) => {
    if (!audioRef.value || duration.value === 0) return
    const time = (percent / 100) * duration.value
    seek(time)
  }

  // Set volume (0-1)
  const setVolume = (value: number) => {
    volume.value = Math.max(0, Math.min(1, value))
    if (audioRef.value) {
      audioRef.value.volume = volume.value
    }
    if (volume.value > 0) {
      isMuted.value = false
    }
  }

  // Toggle mute
  const toggleMute = () => {
    isMuted.value = !isMuted.value
    if (audioRef.value) {
      audioRef.value.muted = isMuted.value
    }
  }

  // Event handlers - use event target for reliability after page refresh
  const onTimeUpdate = (event?: Event) => {
    const audio = (event?.target as HTMLAudioElement) || audioRef.value
    if (audio) {
      currentTime.value = audio.currentTime
    }
  }

  const onLoadedMetadata = (event?: Event) => {
    const audio = (event?.target as HTMLAudioElement) || audioRef.value
    if (audio) {
      duration.value = audio.duration
    }
  }

  const onEnded = () => {
    isPlaying.value = false
  }

  const onPlay = () => {
    isPlaying.value = true
  }

  const onPause = () => {
    isPlaying.value = false
  }

  // Start timeline loop
  const startLoop = () => {
    if (!animationId) {
      animationId = requestAnimationFrame(updateTimeline)
    }
  }

  // Stop timeline loop
  const stopLoop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  // Cleanup
  const cleanup = () => {
    stopLoop()
    audioRef.value = null
  }

  return {
    // Refs
    audioRef,

    // State
    isPlaying: readonly(isPlaying),
    currentTime: readonly(currentTime),
    duration: readonly(duration),
    volume,
    isMuted: readonly(isMuted),
    progress,
    formattedCurrentTime,
    formattedDuration,

    // Methods
    initAudio,
    togglePlay,
    play,
    pause,
    seek,
    seekByPercent,
    setVolume,
    toggleMute,
    formatTime,

    // Event handlers
    onTimeUpdate,
    onLoadedMetadata,
    onEnded,
    onPlay,
    onPause,

    // Lifecycle
    startLoop,
    stopLoop,
    cleanup,
  }
}
