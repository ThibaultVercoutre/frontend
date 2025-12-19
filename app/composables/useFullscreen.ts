export function useFullscreen(elementRef?: Ref<HTMLElement | null>) {
  const isFullscreen = ref(false)
  const isSupported = ref(false)

  // Check support on mount
  onMounted(() => {
    isSupported.value = !!(
      document.fullscreenEnabled ||
      (document as Document & { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled
    )

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', updateFullscreenState)
    document.addEventListener('webkitfullscreenchange', updateFullscreenState)
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', updateFullscreenState)
    document.removeEventListener('webkitfullscreenchange', updateFullscreenState)
  })

  const updateFullscreenState = () => {
    isFullscreen.value = !!(
      document.fullscreenElement ||
      (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
    )
  }

  const enterFullscreen = async (element?: HTMLElement) => {
    const target = element || elementRef?.value || document.documentElement
    if (!target) return false

    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen()
      } else if ((target as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (target as HTMLElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen()
      }
      return true
    } catch {
      return false
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen()
      }
      return true
    } catch {
      return false
    }
  }

  const toggleFullscreen = async (element?: HTMLElement) => {
    if (isFullscreen.value) {
      return exitFullscreen()
    } else {
      return enterFullscreen(element)
    }
  }

  return {
    isFullscreen: readonly(isFullscreen),
    isSupported: readonly(isSupported),
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  }
}
