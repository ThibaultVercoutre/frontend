interface SwipeOptions {
  threshold?: number // Minimum distance to trigger swipe (default: 50px)
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipeGesture(elementRef: Ref<HTMLElement | null>, options: SwipeOptions = {}) {
  const { threshold = 50 } = options

  let touchStartX = 0
  let touchStartY = 0
  let touchEndX = 0
  let touchEndY = 0

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX = event.touches[0]?.clientX ?? 0
    touchStartY = event.touches[0]?.clientY ?? 0
  }

  const handleTouchMove = (event: TouchEvent) => {
    touchEndX = event.touches[0]?.clientX ?? 0
    touchEndY = event.touches[0]?.clientY ?? 0
  }

  const handleTouchEnd = () => {
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Only trigger if swipe is primarily horizontal or vertical (not diagonal)
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        options.onSwipeRight?.()
      } else {
        options.onSwipeLeft?.()
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        options.onSwipeDown?.()
      } else {
        options.onSwipeUp?.()
      }
    }

    // Reset
    touchStartX = 0
    touchStartY = 0
    touchEndX = 0
    touchEndY = 0
  }

  const setupListeners = () => {
    const element = elementRef.value
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  const removeListeners = () => {
    const element = elementRef.value
    if (!element) return

    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchmove', handleTouchMove)
    element.removeEventListener('touchend', handleTouchEnd)
  }

  watch(elementRef, (newElement, oldElement) => {
    if (oldElement) {
      oldElement.removeEventListener('touchstart', handleTouchStart)
      oldElement.removeEventListener('touchmove', handleTouchMove)
      oldElement.removeEventListener('touchend', handleTouchEnd)
    }
    if (newElement) {
      setupListeners()
    }
  }, { immediate: true })

  onMounted(() => {
    setupListeners()
  })

  onUnmounted(() => {
    removeListeners()
  })

  return {
    setupListeners,
    removeListeners,
  }
}
