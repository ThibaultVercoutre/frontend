<script setup lang="ts">
interface Props {
  previousLyric: string
  currentLyric: string
  nextLyric: string
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="text-center cursor-pointer group"
    @click="emit('click')"
  >
    <div class="space-y-1 p-4 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-emerald-800/30 hover:border-amber-500/50 transition-all">
      <p class="text-emerald-600/50 text-sm">{{ previousLyric }}</p>
      <p class="text-emerald-200 text-lg font-medium">{{ currentLyric }}</p>
      <p class="text-emerald-600/50 text-sm">{{ nextLyric }}</p>
    </div>
    <p class="mt-2 text-emerald-500/40 text-xs uppercase tracking-wider group-hover:text-amber-500/60 transition-colors">
      Cliquer pour le mode karaoké
    </p>
  </div>
</template>
