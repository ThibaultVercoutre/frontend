<script setup lang="ts">
interface Props {
  previousLyric: string
  currentLyric: string
  nextLyric: string
  currentIndex: number
}

defineProps<Props>()
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center overflow-hidden">
    <div class="text-center max-w-5xl mx-auto px-4 karaoke-carousel overflow-hidden">
      <!-- Previous line -->
      <div class="lyric-line-container relative">
        <Transition name="lyric-up">
          <p
            :key="'prev-' + currentIndex"
            class="text-xl md:text-2xl text-emerald-600/30 leading-relaxed py-2"
          >
            {{ previousLyric }}
          </p>
        </Transition>
      </div>

      <!-- Current line -->
      <div class="lyric-line-container relative">
        <Transition name="lyric-up">
          <p
            :key="'current-' + currentIndex"
            class="text-4xl md:text-6xl font-bold text-epic karaoke-current leading-normal py-4"
          >
            {{ currentLyric }}
          </p>
        </Transition>
      </div>

      <!-- Next line -->
      <div class="lyric-line-container relative">
        <Transition name="lyric-up">
          <p
            :key="'next-' + currentIndex"
            class="text-xl md:text-2xl text-emerald-600/40 leading-relaxed py-2"
          >
            {{ nextLyric }}
          </p>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.karaoke-current {
  text-shadow:
    0 0 20px rgba(201, 162, 39, 0.4),
    0 0 40px rgba(201, 162, 39, 0.2),
    0 0 60px rgba(201, 162, 39, 0.1);
}

.lyric-line-container {
  overflow: hidden;
}

/* Simple fade transition */
.lyric-up-enter-active,
.lyric-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.lyric-up-leave-active {
  position: absolute;
  left: 0;
  right: 0;
}

.lyric-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.lyric-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
