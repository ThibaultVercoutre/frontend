<script setup lang="ts">
interface Props {
  previousLyric: string
  currentLyric: string
  nextLyric: string
  theme?: 'celtic' | 'winter' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'celtic'
})

const emit = defineEmits<{
  click: []
}>()

const borderClass = computed(() => {
  if (props.theme === 'winter') return 'border-sky-800/30 hover:border-sky-500/50'
  if (props.theme === 'default') return 'border-purple-800/30 hover:border-purple-500/50'
  return 'border-emerald-800/30 hover:border-amber-500/50'
})

const prevNextColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-400/50'
  if (props.theme === 'default') return 'text-purple-400/50'
  return 'text-emerald-600/50'
})

const currentColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-100'
  if (props.theme === 'default') return 'text-purple-100'
  return 'text-emerald-200'
})

const hintColor = computed(() => {
  if (props.theme === 'winter') return 'text-sky-500/40 group-hover:text-sky-400/60'
  if (props.theme === 'default') return 'text-purple-500/40 group-hover:text-purple-400/60'
  return 'text-emerald-500/40 group-hover:text-amber-500/60'
})
</script>

<template>
  <button
    type="button"
    class="w-full text-center cursor-pointer group"
    aria-label="Ouvrir le mode karaoké"
    @click="emit('click')"
  >
    <div :class="['space-y-1 p-4 rounded-xl bg-zinc-900/50 backdrop-blur-sm border transition-all', borderClass]">
      <p :class="['text-sm', prevNextColor]">{{ previousLyric }}</p>
      <p :class="['text-lg font-medium', currentColor]">{{ currentLyric }}</p>
      <p :class="['text-sm', prevNextColor]">{{ nextLyric }}</p>
    </div>
    <p :class="['mt-2 text-xs uppercase tracking-wider transition-colors', hintColor]">
      Cliquer pour le mode karaoke
    </p>
  </button>
</template>
