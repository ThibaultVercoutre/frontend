import type { LyricLine, LyricsData } from '~/types'

// Local lyrics data - will be replaced by API calls later
const localLyricsData: Record<number, LyricLine[]> = {
  1: [
    { time: 0, text: '...' },
    { time: 15, text: 'De nos jours plus rien de va,' },
    { time: 17, text: 'Que ce soit ici ou là-bas,' },
    { time: 20, text: 'Ils sont ici pour nous faire chier' },
    { time: 23, text: 'Je parle bien sur des étrangers !' },
    { time: 26, text: 'Il y en a de toute sorte,' },
    { time: 28, text: "C'est comme des cartes pokémon," },
    { time: 31, text: 'Mais malheureusement sur leur carte' },
    { time: 33, text: 'Que des statistiques qui déconnent !' },
    { time: 36, text: 'On ne veut aussi pas les collectionner !' },
    { time: 39, text: "Car un pokédex c'est fait pour être parfait" },
    { time: 42, text: "La dernière fois que j'en ai vu" },
    { time: 44, text: "C'était pour leur cracher dessus." },
    { time: 49, text: "Les Arabes c'est dehors !" },
    { time: 52, text: "On n'en veut plus dans le décor !" },
    { time: 55, text: "Les maghrébins c'est dehors !" },
    { time: 57, text: "Impossible qu'ils ne s'améliorent !" },
    { time: 60, text: "Les bridés c'est dehors !" },
    { time: 63, text: 'Ce ne sont pas des trésor !' },
    { time: 65, text: "Les négros c'est dehors !" },
    { time: 68, text: 'Ah non pas eux,' },
    { time: 69, text: 'On en veut pour nos champs !' },
    { time: 72, text: '...' },
    { time: 76, text: "Avec la monté de l'extrême droite" },
    { time: 79, text: "Oh mon dieu qu'elle aubaine" },
    { time: 81, text: 'Depuis maintenant quelques années à droites' },
    { time: 84, text: 'On voit cette magnifique Madame Le Pen' },
    { time: 87, text: 'Ça lui a valu la prison' },
    { time: 90, text: 'Justice imparfaite' },
    { time: 92, text: 'Heureusement, il est bientôt là,' },
    { time: 95, text: 'On le verra en 2027' },
    { time: 97, text: 'Je parle bien sûr de ce magnifique Bardella !' },
    { time: 100, text: "Certains pensent qu'il n'a aucune chance" },
    { time: 103, text: 'Moi je pense qu\'il peut se hisser' },
    { time: 105, text: "Avec sa beauté d'esprit et son intelligence" },
    { time: 108, text: 'Sur le siège le plus haut et le plus prisé de France' },
    { time: 114, text: "Les Arabes c'est dehors !" },
    { time: 117, text: "On n'en veut plus dans le décor !" },
    { time: 120, text: "Les maghrébins c'est dehors !" },
    { time: 123, text: "Impossible qu'ils ne s'améliorent !" },
    { time: 126, text: "Les bridés c'est dehors !" },
    { time: 128, text: 'Ce ne sont pas des trésor !' },
    { time: 130, text: "Les négros c'est dehors !" },
    { time: 133, text: 'Ah non pas eux,' },
    { time: 135, text: 'On en veut pour nos champs !' },
    { time: 137, text: '...' },
    { time: 138, text: 'On les sent à 10 000' },
    { time: 139, text: 'Et ça remplit nos narines' },
    { time: 140, text: "Ce n'est pas de la vanille" },
    { time: 142, text: 'Mais je dirais des latrines' },
    { time: 143, text: 'Avec un mélange de poubelles' },
    { time: 145, text: "Qu'on utilise pour le compost" },
    { time: 148, text: "Bien pourris au fond d'une ruelle" },
    { time: 151, text: "Où n'y va même pas la poste" },
    { time: 153, text: 'Ça sent même la marée basse' },
    { time: 156, text: "Pas étonnant vu qu'ils y meurent" },
    { time: 159, text: 'On leur dit buvez pas la tasse' },
    { time: 161, text: 'Mais ils sont plus cons que des chômeurs' },
    { time: 169, text: "Les Arabes c'est dehors !" },
    { time: 172, text: 'Hey ! Hey ! Hey ! Hey !' },
    { time: 175, text: "Les Magrébins c'est dehors !" },
    { time: 177, text: 'Hey ! Hey ! Hey ! Hey !' },
    { time: 185, text: "Les Arabes c'est dehors !" },
    { time: 188, text: "On n'en veut plus dans le décor !" },
    { time: 191, text: "Les maghrébins c'est dehors !" },
    { time: 193, text: "Impossible qu'ils ne s'améliorent !" },
    { time: 196, text: "Les bridés c'est dehors !" },
    { time: 199, text: 'Ce ne sont pas des trésor !' },
    { time: 202, text: "Les négros c'est dehors !" },
    { time: 204, text: 'Ah non pas eux,' },
    { time: 206, text: 'On en veut pour nos champs !' },
  ],
  101: [
    { time: 0, text: '...' },
    { time: 7, text: 'C\'est la belle nuit de Noël' },
    { time: 7, text: 'Ma lance est dans son manteau blanc' },
    { time: 10, text: 'Et mon gland levé vers le ciel' },
    { time: 18, text: 'A genoux les demandant' },
    { time: 22, text: 'Avant de fermer les paupières' },
    { time: 26, text: 'Buvons une dernière bière' },
    { time: 29, text: 'Petit papa Noël' },
    { time: 32, text: 'Quand tu descendras du ciel' },
    { time: 36, text: 'Avec des dildos par milliers' },
    { time: 40, text: 'N\'oublie pas mon petit gode michet' },
    { time: 44, text: 'Mais avant de partir' },
    { time: 47, text: 'Il faudra bien me faire jouir' },
    { time: 51, text: 'Tu n\'as qu\'à penser à Gaïa' },
    { time: 55, text: 'Pour la mettre au fond de moi' },
    { time: 59, text: 'Il me tarde tant que le jour se lève' },
    { time: 63, text: 'Pour voir si tu m\'as inséré' },
    { time: 66, text: 'Tous les beaux joujous que je vois en rêve' },
    { time: 70, text: 'Et que je t\'ai commandé' },
    { time: 74, text: 'Petit papa Noël' },
    { time: 77, text: 'Quand tu descendras du ciel' },
    { time: 81, text: 'Avec des dildos par milliers' },
    { time: 85, text: 'N\'oublie pas mon petit gode michet' },
    { time: 104, text: 'Le roumain est passé' },
    { time: 108, text: 'Certains vont se faire sodo' },
    { time: 112, text: 'Et tu vas pouvoir commencer' },
    { time: 115, text: 'Avec ta capote sur le barreau' },
    { time: 119, text: 'Au son des cloches des églises' },
    { time: 123, text: 'Les prêtres auront une surprise' },
    { time: 127, text: 'Et quand tu gicleras sur mon visage' },
    { time: 131, text: 'C\'est comme ça que nous baiserons' },
    { time: 134, text: 'Je n\'ai pas été tous les jours très sage' },
    { time: 138, text: 'Punis-moi pour mon pardon' },
    { time: 141, text: 'Petit papa Noël' },
    { time: 145, text: 'Quand tu descendras du ciel' },
    { time: 149, text: 'Avec des dildos par milliers' },
    { time: 153, text: 'N\'oublie pas mon petit gode michet' },
    { time: 156, text: 'Petit papa Noël' },
  ],
  102: [
    { time: 0, text: '...' },
    { time: 14, text: 'Douce nuit, sainte nuit,' },
    { time: 19, text: 'Dans mon lit, l\'astre luit' },
    { time: 24, text: 'Du haut de son centimètre,' },
    { time: 29, text: 'Il aimerait bien lui mettre' },
    { time: 32, text: 'C\'est l\'amour infini, c\'est l\'amour infini' },
    { time: 40, text: 'Saint-Soldat, Saint barreau' },
    { time: 44, text: 'Qu\'il est grand, qu\'il est beau' },
    { time: 48, text: 'Il aimerait bien se faire sauter' },
    { time: 52, text: 'Mais toujours au fond de son tombeau' },
    { time: 56, text: 'Vers son humble berceau, vers son humble berceau' },
    { time: 64, text: 'Oh là là, qu\'il est court' },
    { time: 68, text: 'Il faudra que je la bourre' },
    { time: 72, text: 'Je ne ferai pas de gros détour' },
    { time: 76, text: 'Je ne ferai pas de demi-tour' },
    { time: 80, text: 'Comme la dinde de Noël Comme la dinde de Noël' },
    { time: 88, text: 'C\'est fini, j\'ai joui' },
    { time: 92, text: 'Tout au fond de mon lit' },
    { time: 96, text: 'Mère Noël, est-ce que tu es contente' },
    { time: 100, text: 'Tu me le disais, je suis partante' },
    { time: 104, text: 'Et cela depuis mille ans Et cela depuis mille ans' }, 
    { time: 112, text: 'Je suis prête pour la tournée' },
    { time: 116, text: 'Mère Noël, je reviendrai' },
    { time: 120, text: 'Prend soin de mes lutins préférés' },
    { time: 124, text: 'Ils ont besoin de se masturber' },
    { time: 128, text: 'Ils ne l\'ont pas fait durant une année' },
    { time: 132, text: 'Ils ne l\'ont pas fait durant une année' },
  ],
  103: [
    { time: 0, text: '...' },
    { time: 3, text: 'Il est levé le divin soldat,' },
    { time: 7, text: 'Tous à poil et on se caresse,' },
    { time: 11, text: 'Il est levé le divin soldat,' },
    { time: 15, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 18, text: 'Pour Noël j\'ai pris du Viagra,' },
    { time: 22, text: 'Mais j\'ai peur de lever la table,' },
    { time: 26, text: 'Pour Noël j\'ai pris du Viagra,' },
    { time: 30, text: 'Mais elle n\'est pas si redoutable.' },
    { time: 33, text: 'Il est levé le divin soldat,' },
    { time: 37, text: 'Tous à poil et on se caresse,' },
    { time: 41, text: 'Il est levé le divin soldat,' },
    { time: 45, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 49, text: 'J\'ai hâte d\'ouvrir mon cadeau,' },
    { time: 53, text: 'Mais faut attendre le gateau.' },
    { time: 57, text: 'J\'ai hâte d\'ouvrir mon cadeau,' },
    { time: 60, text: 'Pour voir si j\'ai eu mon vibro.' },
    { time: 64, text: 'Il est levé le divin soldat,' },
    { time: 68, text: 'Tous à poil et on se caresse,' },
    { time: 72, text: 'Il est levé le divin soldat,' },
    { time: 76, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 79, text: 'Partez ! Il faut que je l\'essaie,' },
    { time: 83, text: 'Pour voir si je peux faire la fête.' },
    { time: 87, text: 'Partez ! Il faut que je l\'essaie,' },
    { time: 91, text: 'Je voudrais le faire en cachette.' },
    { time: 94, text: 'Il est levé le divin soldat,' },
    { time: 98, text: 'Tous à poil et on se caresse,' },
    { time: 102, text: 'Il est levé le divin soldat,' },
    { time: 106, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 109, text: 'Oh Jésus, oh roi tout puissant,' },
    { time: 113, text: 'Pourrais-tu te réincarner ?' },
    { time: 117, text: 'Oh Jésus, oh roi tout puissant,' },
    { time: 121, text: 'Prends contrôle de mon gode michet !' },
    { time: 125, text: 'Il est levé le divin soldat,' },
    { time: 129, text: 'Tous à poil et on se caresse,' },
    { time: 133, text: 'Il est levé le divin soldat,' },
    { time: 137, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 141, text: '...' },
  ],
}

export function useLyrics(trackId: Ref<number>) {
  const lyrics = ref<LyricLine[]>([])
  const currentTime = ref(0)
  const isLoading = ref(false)

  // Fetch lyrics for a track
  const fetchLyrics = async (): Promise<void> => {
    isLoading.value = true

    // TODO: Replace with API call when backend is ready
    // const { get } = useApi()
    // const response = await get<LyricsData>(`/tracks/${trackId.value}/lyrics`)
    // if (response.success) {
    //   lyrics.value = response.data.lines
    // }

    // For now, use local data
    lyrics.value = localLyricsData[trackId.value] || []
    isLoading.value = false
  }

  // Current lyric index based on time
  const currentLyricIndex = computed(() => {
    const time = currentTime.value
    for (let i = lyrics.value.length - 1; i >= 0; i--) {
      const lyric = lyrics.value[i]
      if (lyric && time >= lyric.time) {
        return i
      }
    }
    return 0
  })

  // Previous, current, and next lyrics
  const previousLyric = computed(() => {
    const idx = currentLyricIndex.value
    return idx > 0 ? lyrics.value[idx - 1]?.text ?? '' : ''
  })

  const currentLyric = computed(() => {
    return lyrics.value[currentLyricIndex.value]?.text ?? ''
  })

  const nextLyric = computed(() => {
    const idx = currentLyricIndex.value
    return idx < lyrics.value.length - 1 ? lyrics.value[idx + 1]?.text ?? '' : ''
  })

  // Check if track has lyrics
  const hasLyrics = computed(() => {
    return trackId.value in localLyricsData
  })

  // Update current time (called from audio player)
  const updateTime = (time: number) => {
    currentTime.value = time
  }

  // Watch for track changes
  watch(trackId, () => {
    fetchLyrics()
  }, { immediate: true })

  return {
    // State
    lyrics: readonly(lyrics),
    isLoading: readonly(isLoading),
    currentLyricIndex,
    previousLyric,
    currentLyric,
    nextLyric,
    hasLyrics,

    // Methods
    fetchLyrics,
    updateTime,
  }
}
