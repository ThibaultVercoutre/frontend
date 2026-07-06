// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    // "Snowfall" is intentionally a single-word name (purely decorative background component).
    files: ['app/components/Snowfall.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
