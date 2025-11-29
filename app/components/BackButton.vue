<script setup lang="ts">
interface Props {
  to?: string
  label?: string
}

withDefaults(defineProps<Props>(), {
  to: '/',
  label: 'Retour',
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2 text-emerald-400/70 hover:text-amber-400 transition-colors group"
  >
    <svg
      class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span class="text-sm uppercase tracking-wider">{{ label }}</span>
  </NuxtLink>
</template>
