export function useReducedMotion() {
  const prefersReducedMotion = ref(false)

  let mediaQuery: MediaQueryList | null = null
  let handler: ((event: MediaQueryListEvent) => void) | null = null

  onMounted(() => {
    // Check initial preference
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches

    // Listen for changes
    handler = (event: MediaQueryListEvent) => {
      prefersReducedMotion.value = event.matches
    }
    mediaQuery.addEventListener('change', handler)
  })

  onUnmounted(() => {
    if (mediaQuery && handler) {
      mediaQuery.removeEventListener('change', handler)
    }
  })

  return {
    prefersReducedMotion: readonly(prefersReducedMotion),
  }
}
