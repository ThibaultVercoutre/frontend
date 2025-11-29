<script setup lang="ts">
interface Track {
  id: number
  title: string
  subtitle: string
  duration: string
  type: 'epic' | 'celtic' | 'military'
}

const tracks: Track[] = [
  { id: 1, title: 'La Marche des Braves', subtitle: 'Hymne de guerre', duration: '4:32', type: 'military' },
  { id: 2, title: 'Forêt Ancestrale', subtitle: 'Chant celtique', duration: '5:17', type: 'celtic' },
  { id: 3, title: 'L\'Assaut Final', subtitle: 'Bataille épique', duration: '6:45', type: 'epic' },
  { id: 4, title: 'Les Fils de la Terre', subtitle: 'Marche triomphale', duration: '4:58', type: 'military' },
  { id: 5, title: 'Brumes d\'Émeraude', subtitle: 'Ballade mystique', duration: '5:23', type: 'celtic' },
  { id: 6, title: 'Sang et Gloire', subtitle: 'Cri de ralliement', duration: '3:47', type: 'epic' },
  { id: 7, title: 'Le Serment', subtitle: 'Hymne solennel', duration: '4:12', type: 'military' },
  { id: 8, title: 'Racines Profondes', subtitle: 'Mélodie ancestrale', duration: '5:56', type: 'celtic' },
]

const getTypeColor = (type: Track['type']) => {
  switch (type) {
    case 'epic': return 'bg-red-900/60 text-red-300'
    case 'celtic': return 'bg-emerald-900/60 text-emerald-300'
    case 'military': return 'bg-amber-900/60 text-amber-300'
  }
}

const getTypeIcon = (type: Track['type']) => {
  switch (type) {
    case 'epic': return '⚔️'
    case 'celtic': return '🍀'
    case 'military': return '🛡️'
  }
}
</script>

<template>
  <div class="min-h-screen bg-pattern relative overflow-hidden">
    <!-- Floating Decorations - Client Only to avoid hydration mismatch -->
    <ClientOnly>
      <!-- Floating Swords -->
      <div class="fixed top-20 left-10 animate-float opacity-20 pointer-events-none">
        <svg class="w-24 h-48 text-amber-600 sword-icon" viewBox="0 0 50 120" fill="currentColor">
          <path d="M25 0 L28 80 L35 85 L35 90 L28 88 L28 110 L32 115 L32 120 L18 120 L18 115 L22 110 L22 88 L15 90 L15 85 L22 80 Z" />
        </svg>
      </div>
      <div class="fixed top-32 right-16 animate-float-reverse opacity-20 pointer-events-none rotate-12">
        <svg class="w-20 h-40 text-amber-600 sword-icon" viewBox="0 0 50 120" fill="currentColor">
          <path d="M25 0 L28 80 L35 85 L35 90 L28 88 L28 110 L32 115 L32 120 L18 120 L18 115 L22 110 L22 88 L15 90 L15 85 L22 80 Z" />
        </svg>
      </div>

      <!-- Floating Shields -->
      <div class="fixed bottom-32 left-20 animate-swing opacity-15 pointer-events-none">
        <svg class="w-32 h-36 text-emerald-700 shield-icon" viewBox="0 0 100 120" fill="currentColor">
          <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" stroke="currentColor" stroke-width="3" fill="none" />
          <path d="M50 20 L75 30 L75 55 Q75 85 50 95 Q25 85 25 55 L25 30 Z" fill="currentColor" opacity="0.3" />
          <circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
      <div class="fixed bottom-40 right-32 animate-float opacity-15 pointer-events-none">
        <svg class="w-28 h-32 text-red-800 shield-icon" viewBox="0 0 100 120" fill="currentColor">
          <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" stroke="currentColor" stroke-width="3" fill="none" />
          <path d="M50 25 L50 95 M25 50 L75 50" stroke="currentColor" stroke-width="8" opacity="0.4" />
        </svg>
      </div>

      <!-- Celtic Knot Corners -->
      <div class="fixed top-0 left-0 w-48 h-48 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" class="w-full h-full text-emerald-500">
          <path d="M0 50 Q25 25 50 0 M0 70 Q35 35 70 0 M0 90 Q45 45 90 0"
                stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      </div>
      <div class="fixed top-0 right-0 w-48 h-48 opacity-10 pointer-events-none rotate-90">
        <svg viewBox="0 0 100 100" class="w-full h-full text-emerald-500">
          <path d="M0 50 Q25 25 50 0 M0 70 Q35 35 70 0 M0 90 Q45 45 90 0"
                stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      </div>
    </ClientOnly>

    <!-- Main Content -->
    <div class="relative z-10 container mx-auto px-6 py-12">
      <!-- Hero Section -->
      <header class="text-center mb-16 animate-fade-in-up">
        <!-- Crossed Swords above title -->
        <div class="flex justify-center mb-6">
          <svg class="w-16 h-16 text-amber-500 animate-pulse-glow -rotate-45" viewBox="0 0 50 120" fill="currentColor">
            <path d="M25 0 L28 80 L35 85 L35 90 L28 88 L28 110 L32 115 L32 120 L18 120 L18 115 L22 110 L22 88 L15 90 L15 85 L22 80 Z" />
          </svg>
          <svg class="w-16 h-16 text-amber-500 animate-pulse-glow rotate-45 -ml-6" viewBox="0 0 50 120" fill="currentColor">
            <path d="M25 0 L28 80 L35 85 L35 90 L28 88 L28 110 L32 115 L32 120 L18 120 L18 115 L22 110 L22 88 L15 90 L15 85 L22 80 Z" />
          </svg>
        </div>

        <h1 class="text-6xl md:text-8xl font-black text-epic mb-4 tracking-wider">
          GABRIELLE
        </h1>
        <div class="flex items-center justify-center gap-4 mb-6">
          <div class="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          <svg class="w-8 h-8 text-emerald-500" viewBox="0 0 100 120" fill="currentColor">
            <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
          </svg>
          <div class="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        </div>
        <p class="text-xl md:text-2xl text-emerald-200/80 font-light tracking-widest uppercase">
          Chants de Guerre & Mélodies Ancestrales
        </p>
        <p class="mt-4 text-emerald-400/60 text-sm tracking-wide">
          {{ tracks.length }} pistes • Épique • Celtique • Militaire
        </p>
      </header>

      <!-- Decorative Divider -->
      <div class="flex items-center justify-center gap-4 mb-12">
        <div class="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-red-800 to-transparent"></div>
        <div class="flex gap-2">
          <span class="w-2 h-2 bg-red-600 rotate-45 animate-pulse"></span>
          <span class="w-2 h-2 bg-emerald-600 rotate-45 animate-pulse" style="animation-delay: 0.2s"></span>
          <span class="w-2 h-2 bg-red-600 rotate-45 animate-pulse" style="animation-delay: 0.4s"></span>
        </div>
        <div class="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-red-800 to-transparent"></div>
      </div>

      <!-- Track Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="(track, index) in tracks"
          :key="track.id"
          :to="`/track/${track.id}`"
          class="track-card relative rounded-xl p-6 cursor-pointer group"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- Track Number Badge -->
          <div class="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-emerald-700 to-emerald-900
                      rounded-full flex items-center justify-center border-2 border-emerald-500/50
                      group-hover:border-amber-500 group-hover:scale-110 transition-all duration-300
                      shadow-lg">
            <span class="text-emerald-100 font-bold text-sm">{{ String(track.id).padStart(2, '0') }}</span>
          </div>

          <!-- Type Badge -->
          <div class="absolute top-4 right-4">
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider', getTypeColor(track.type)]">
              {{ getTypeIcon(track.type) }} {{ track.type }}
            </span>
          </div>

          <!-- Track Info -->
          <div class="mt-6">
            <h3 class="text-xl font-bold text-emerald-50 group-hover:text-amber-400 transition-colors duration-300 mb-2">
              {{ track.title }}
            </h3>
            <p class="text-emerald-400/70 text-sm mb-4">{{ track.subtitle }}</p>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-emerald-700/30">
            <span class="text-emerald-500/60 text-sm font-mono">{{ track.duration }}</span>
            <div class="flex items-center gap-2 text-emerald-400/50 group-hover:text-amber-500 transition-colors">
              <span class="text-xs uppercase tracking-wider">Écouter</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>

          <!-- Hover Glow Effect -->
          <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      bg-gradient-to-t from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>
        </NuxtLink>
      </div>

      <!-- Bottom Decoration -->
      <footer class="mt-20 text-center">
        <div class="flex items-center justify-center gap-6 mb-8">
          <svg class="w-12 h-14 text-emerald-700/50 animate-float" viewBox="0 0 100 120" fill="currentColor">
            <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
          </svg>
          <div class="text-emerald-600/40 text-4xl font-serif">❧</div>
          <svg class="w-12 h-14 text-red-800/50 animate-float-reverse" viewBox="0 0 100 120" fill="currentColor">
            <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" />
          </svg>
        </div>
        <p class="text-emerald-700/50 text-sm tracking-widest uppercase">
          Pour la gloire et l'honneur
        </p>
      </footer>
    </div>
  </div>
</template>
