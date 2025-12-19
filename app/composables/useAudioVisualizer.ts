import AudioMotionAnalyzer from 'audiomotion-analyzer'
import type { VisualizerOptions } from '~/types'
import type { LyricLine } from '~/types'

type SectionType = LyricLine['type']

const defaultOptions: VisualizerOptions = {
  mode: 2,
  barSpace: 0.25,
  gradient: 'celtic',
  mirror: 1,
  showPeaks: true,
  smoothing: 0.7,
}

// Section-based visualizer presets
interface SectionPreset {
  gradient: string
  mode: number
  barSpace: number
  mirror: number
}

const sectionPresets: Record<SectionType, SectionPreset> = {
  INTRO: { gradient: 'section-intro', mode: 2, barSpace: 0.25, mirror: 1 },
  COUPLET: { gradient: 'section-couplet', mode: 2, barSpace: 0.25, mirror: 1 },
  REFRAIN: { gradient: 'section-refrain', mode: 2, barSpace: 0.25, mirror: 1 },
  CHORUS: { gradient: 'section-chorus', mode: 2, barSpace: 0.25, mirror: 1 },
  VERSE: { gradient: 'section-verse', mode: 2, barSpace: 0.25, mirror: 1 },
  BRIDGE: { gradient: 'section-bridge', mode: 2, barSpace: 0.25, mirror: 1 },
  OUTRO: { gradient: 'section-outro', mode: 2, barSpace: 0.25, mirror: 1 },
  INSTRUMENTAL: { gradient: 'section-instrumental', mode: 2, barSpace: 0.25, mirror: 1 },
}

// Color interpolation helpers
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(result[1] ?? '0', 16),
    g: parseInt(result[2] ?? '0', 16),
    b: parseInt(result[3] ?? '0', 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const clamped = Math.max(0, Math.min(255, Math.round(x)))
    const hex = clamped.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  return rgbToHex(
    rgb1.r + (rgb2.r - rgb1.r) * factor,
    rgb1.g + (rgb2.g - rgb1.g) * factor,
    rgb1.b + (rgb2.b - rgb1.b) * factor,
  )
}

// Gradient color definitions for interpolation
const gradientColors: Record<string, Array<{ color: string, pos: number }>> = {
  // Theme gradients
  'celtic': [
    { color: '#8b1a1a', pos: 0 },
    { color: '#10b981', pos: 0.5 },
    { color: '#c9a227', pos: 1 },
  ],
  'winter': [
    { color: '#0c4a6e', pos: 0 },
    { color: '#7dd3fc', pos: 0.5 },
    { color: '#f59e0b', pos: 1 },
  ],
  'default': [
    { color: '#581c87', pos: 0 },
    { color: '#a855f7', pos: 0.5 },
    { color: '#ec4899', pos: 1 },
  ],
  // Section gradients
  'section-intro': [
    { color: '#1e3a5f', pos: 0 },
    { color: '#3b82f6', pos: 0.5 },
    { color: '#93c5fd', pos: 1 },
  ],
  'section-couplet': [
    { color: '#14532d', pos: 0 },
    { color: '#22c55e', pos: 0.5 },
    { color: '#86efac', pos: 1 },
  ],
  'section-refrain': [
    { color: '#7c2d12', pos: 0 },
    { color: '#f97316', pos: 0.33 },
    { color: '#fbbf24', pos: 0.66 },
    { color: '#fef08a', pos: 1 },
  ],
  // Pride flag gradient for "Majorité de Minorité" refrain
  'section-refrain-pride': [
    { color: '#EF4444', pos: 0 },      // Red
    { color: '#F97316', pos: 0.2 },    // Orange
    { color: '#FACC15', pos: 0.4 },    // Yellow
    { color: '#22C55E', pos: 0.6 },    // Green
    { color: '#3B82F6', pos: 0.8 },    // Blue
    { color: '#9333EA', pos: 1 },      // Purple
  ],
  'section-chorus': [
    { color: '#be123c', pos: 0 },
    { color: '#f43f5e', pos: 0.33 },
    { color: '#fb7185', pos: 0.66 },
    { color: '#fda4af', pos: 1 },
  ],
  'section-verse': [
    { color: '#0f766e', pos: 0 },
    { color: '#14b8a6', pos: 0.5 },
    { color: '#5eead4', pos: 1 },
  ],
  'section-bridge': [
    { color: '#6b21a8', pos: 0 },
    { color: '#a855f7', pos: 0.4 },
    { color: '#e879f9', pos: 0.7 },
    { color: '#f0abfc', pos: 1 },
  ],
  'section-outro': [
    { color: '#374151', pos: 0 },
    { color: '#6b7280', pos: 0.5 },
    { color: '#9ca3af', pos: 1 },
  ],
  'section-instrumental': [
    { color: '#78350f', pos: 0 },
    { color: '#d97706', pos: 0.33 },
    { color: '#10b981', pos: 0.66 },
    { color: '#06b6d4', pos: 1 },
  ],
}

export function useAudioVisualizer() {
  let audioMotion: AudioMotionAnalyzer | null = null
  const isInitialized = ref(false)
  let currentGradientName = 'celtic'
  let transitionAnimationId: number | null = null

  // Initialize visualizer
  const init = (
    container: HTMLElement,
    audioElement: HTMLAudioElement,
    options: VisualizerOptions = {}
  ): boolean => {
    if (audioMotion) return true

    try {
      const mergedOptions = { ...defaultOptions, ...options }

      audioMotion = new AudioMotionAnalyzer(container, {
        source: audioElement,
        mode: mergedOptions.mode,
        barSpace: mergedOptions.barSpace,
        bgAlpha: 0,
        gradient: 'prism',
        ledBars: false,
        lumiBars: false,
        mirror: mergedOptions.mirror,
        radial: false,
        reflexAlpha: 0.25,
        reflexRatio: 0.35,
        reflexBright: 1,
        reflexFit: true,
        roundBars: true,
        showBgColor: false,
        showPeaks: mergedOptions.showPeaks,
        peakFadeTime: 500,
        peakHoldTime: 100,
        showScaleX: false,
        showScaleY: false,
        smoothing: mergedOptions.smoothing,
        overlay: true,
        maxDecibels: -25,
        minDecibels: -85,
      })

      // Register custom gradients for each theme
      audioMotion.registerGradient('celtic', {
        colorStops: [
          { color: '#8b1a1a', pos: 0 },    // blood red
          { color: '#10b981', pos: 0.5 },  // emerald
          { color: '#c9a227', pos: 1 },    // gold
        ],
      })

      audioMotion.registerGradient('winter', {
        colorStops: [
          { color: '#0c4a6e', pos: 0 },    // dark sky
          { color: '#7dd3fc', pos: 0.5 },  // ice blue
          { color: '#f59e0b', pos: 1 },    // cabin amber
        ],
      })

      audioMotion.registerGradient('default', {
        colorStops: [
          { color: '#581c87', pos: 0 },    // purple dark
          { color: '#a855f7', pos: 0.5 },  // purple
          { color: '#ec4899', pos: 1 },    // pink
        ],
      })

      // Section-based gradients
      audioMotion.registerGradient('section-intro', {
        colorStops: [
          { color: '#1e3a5f', pos: 0 },    // deep blue
          { color: '#3b82f6', pos: 0.5 },  // blue
          { color: '#93c5fd', pos: 1 },    // light blue
        ],
      })

      audioMotion.registerGradient('section-couplet', {
        colorStops: [
          { color: '#14532d', pos: 0 },    // dark green
          { color: '#22c55e', pos: 0.5 },  // green
          { color: '#86efac', pos: 1 },    // light green
        ],
      })

      audioMotion.registerGradient('section-refrain', {
        colorStops: [
          { color: '#7c2d12', pos: 0 },    // dark orange
          { color: '#f97316', pos: 0.3 },  // orange
          { color: '#fbbf24', pos: 0.6 },  // amber
          { color: '#fef08a', pos: 1 },    // yellow
        ],
      })

      // Pride flag gradient for "Majorité de Minorité" refrain
      audioMotion.registerGradient('section-refrain-pride', {
        colorStops: [
          { color: '#EF4444', pos: 0 },    // Red
          { color: '#F97316', pos: 0.2 },  // Orange
          { color: '#FACC15', pos: 0.4 },  // Yellow
          { color: '#22C55E', pos: 0.6 },  // Green
          { color: '#3B82F6', pos: 0.8 },  // Blue
          { color: '#9333EA', pos: 1 },    // Purple
        ],
      })

      audioMotion.registerGradient('section-chorus', {
        colorStops: [
          { color: '#be123c', pos: 0 },    // dark rose
          { color: '#f43f5e', pos: 0.3 },  // rose
          { color: '#fb7185', pos: 0.6 },  // pink
          { color: '#fda4af', pos: 1 },    // light pink
        ],
      })

      audioMotion.registerGradient('section-verse', {
        colorStops: [
          { color: '#0f766e', pos: 0 },    // dark teal
          { color: '#14b8a6', pos: 0.5 },  // teal
          { color: '#5eead4', pos: 1 },    // light teal
        ],
      })

      audioMotion.registerGradient('section-bridge', {
        colorStops: [
          { color: '#6b21a8', pos: 0 },    // dark purple
          { color: '#a855f7', pos: 0.4 },  // purple
          { color: '#e879f9', pos: 0.7 },  // fuchsia
          { color: '#f0abfc', pos: 1 },    // light fuchsia
        ],
      })

      audioMotion.registerGradient('section-outro', {
        colorStops: [
          { color: '#374151', pos: 0 },    // gray dark
          { color: '#6b7280', pos: 0.5 },  // gray
          { color: '#9ca3af', pos: 1 },    // light gray
        ],
      })

      audioMotion.registerGradient('section-instrumental', {
        colorStops: [
          { color: '#78350f', pos: 0 },    // dark amber
          { color: '#d97706', pos: 0.3 },  // amber
          { color: '#10b981', pos: 0.6 },  // emerald
          { color: '#06b6d4', pos: 1 },    // cyan
        ],
      })

      audioMotion.gradient = 'celtic'

      isInitialized.value = true
      return true
    } catch (e) {
      console.error('Failed to initialize AudioMotion:', e)
      return false
    }
  }

  // Move canvas to a different container
  const moveTo = (container: HTMLElement) => {
    if (!audioMotion) return

    const canvas = audioMotion.canvas
    if (canvas && canvas.parentElement !== container) {
      container.appendChild(canvas)
      audioMotion.setCanvasSize(container.clientWidth, container.clientHeight)
    }
  }

  // Resume audio context (needed after user interaction)
  const resume = async () => {
    if (audioMotion?.audioCtx?.state === 'suspended') {
      await audioMotion.audioCtx.resume()
    }
  }

  // Set gradient
  const setGradient = (gradient: string) => {
    if (audioMotion) {
      audioMotion.gradient = gradient
    }
  }

  // Set mode
  const setMode = (mode: number) => {
    if (audioMotion) {
      audioMotion.mode = mode
    }
  }

  // Interpolate between two gradient color arrays
  const interpolateGradient = (
    from: Array<{ color: string, pos: number }>,
    to: Array<{ color: string, pos: number }>,
    factor: number,
  ): Array<{ color: string, pos: number }> => {
    // Normalize both gradients to same number of stops
    const maxStops = Math.max(from.length, to.length)
    const result: Array<{ color: string, pos: number }> = []

    for (let i = 0; i < maxStops; i++) {
      const pos = i / (maxStops - 1)
      const fromColor = getColorAtPosition(from, pos)
      const toColor = getColorAtPosition(to, pos)
      result.push({
        color: interpolateColor(fromColor, toColor, factor),
        pos,
      })
    }
    return result
  }

  // Get color at a specific position in gradient
  const getColorAtPosition = (stops: Array<{ color: string, pos: number }>, pos: number): string => {
    if (stops.length === 0) return '#000000'
    if (stops.length === 1) return stops[0]?.color ?? '#000000'

    // Find surrounding stops
    let lower = stops[0]!
    let upper = stops[stops.length - 1]!

    for (let i = 0; i < stops.length - 1; i++) {
      const current = stops[i]!
      const next = stops[i + 1]!
      if (pos >= current.pos && pos <= next.pos) {
        lower = current
        upper = next
        break
      }
    }

    if (lower.pos === upper.pos) return lower.color

    const factor = (pos - lower.pos) / (upper.pos - lower.pos)
    return interpolateColor(lower.color, upper.color, factor)
  }

  // Set section style with smooth color transition
  // trackId is optional and used for track-specific color overrides
  const setSectionStyle = (sectionType: SectionType, _sectionNumber: number, trackId?: number) => {
    if (!audioMotion) return

    const preset = sectionPresets[sectionType]
    if (!preset) return

    // Check for track-specific gradient overrides
    let targetGradientName = preset.gradient

    // "Majorité de Minorité" (track 3) - Pride flag colors for REFRAIN
    if (trackId === 3 && sectionType === 'REFRAIN') {
      targetGradientName = 'section-refrain-pride'
    }
    if (targetGradientName === currentGradientName) return

    const targetColors = gradientColors[targetGradientName]
    const fromColors = gradientColors[currentGradientName] || targetColors
    if (!targetColors) {
      audioMotion.gradient = targetGradientName
      currentGradientName = targetGradientName
      return
    }

    // Cancel any ongoing transition
    if (transitionAnimationId !== null) {
      cancelAnimationFrame(transitionAnimationId)
    }

    // Animate transition over 500ms
    const duration = 500
    const startTime = performance.now()
    let transitionGradientId = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)

      // Create interpolated gradient
      const interpolated = interpolateGradient(fromColors!, targetColors, eased)

      // Register and apply the transitional gradient
      const tempGradientName = `transition-${transitionGradientId++}`
      audioMotion!.registerGradient(tempGradientName, {
        colorStops: interpolated,
      })
      audioMotion!.gradient = tempGradientName

      if (progress < 1) {
        transitionAnimationId = requestAnimationFrame(animate)
      } else {
        // Transition complete, use final gradient
        audioMotion!.gradient = targetGradientName
        currentGradientName = targetGradientName
        transitionAnimationId = null
      }
    }

    transitionAnimationId = requestAnimationFrame(animate)
  }

  // Resize canvas
  const resize = (width: number, height: number) => {
    if (audioMotion) {
      audioMotion.setCanvasSize(width, height)
    }
  }

  // Destroy visualizer
  const destroy = () => {
    // Cancel any ongoing transition
    if (transitionAnimationId !== null) {
      cancelAnimationFrame(transitionAnimationId)
      transitionAnimationId = null
    }
    if (audioMotion) {
      audioMotion.destroy()
      audioMotion = null
      isInitialized.value = false
    }
    currentGradientName = 'celtic'
  }

  // Get canvas element
  const getCanvas = (): HTMLCanvasElement | null => {
    return audioMotion?.canvas ?? null
  }

  return {
    // State
    isInitialized: readonly(isInitialized),

    // Methods
    init,
    moveTo,
    resume,
    setGradient,
    setMode,
    setSectionStyle,
    resize,
    destroy,
    getCanvas,
  }
}
