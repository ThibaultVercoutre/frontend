export function useReducedMotion() {
  const prefersReducedMotion = ref(false)

  onMounted(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      prefersReducedMotion.value = event.matches
    }

    mediaQuery.addEventListener('change', handler)

    // Cleanup
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handler)
    })
  })

  return {
    prefersReducedMotion: readonly(prefersReducedMotion),
  }
}
