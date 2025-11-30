<script setup lang="ts">
const router = useRouter()

interface Props {
  label?: string
  theme?: 'celtic' | 'winter' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Retour',
  theme: 'celtic',
})

const colorClasses = computed(() => {
  if (props.theme === 'winter') {
    return 'text-sky-400/70 hover:text-amber-400'
  }
  if (props.theme === 'celtic') {
    return 'text-emerald-400/70 hover:text-amber-400'
  }
  return 'text-purple-400/70 hover:text-pink-400'
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <button
    type="button"
    :class="['flex items-center gap-2 transition-colors group cursor-pointer', colorClasses]"
    @click="goBack"
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
  </button>
</template>
