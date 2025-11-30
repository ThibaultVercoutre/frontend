import AudioMotionAnalyzer from 'audiomotion-analyzer'
import type { VisualizerOptions } from '~/types'

const defaultOptions: VisualizerOptions = {
  mode: 2,
  barSpace: 0.25,
  gradient: 'celtic',
  mirror: 1,
  showPeaks: true,
  smoothing: 0.7,
}

export function useAudioVisualizer() {
  let audioMotion: AudioMotionAnalyzer | null = null
  const isInitialized = ref(false)

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

  // Resize canvas
  const resize = (width: number, height: number) => {
    if (audioMotion) {
      audioMotion.setCanvasSize(width, height)
    }
  }

  // Destroy visualizer
  const destroy = () => {
    if (audioMotion) {
      audioMotion.destroy()
      audioMotion = null
      isInitialized.value = false
    }
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
    resize,
    destroy,
    getCanvas,
  }
}
