import type { Track, TrackType } from '~/types'

// Local data - will be replaced by API calls later
const localTracks: Track[] = [
  // Album: Gabrielle
  { id: 1, albumId: 'gabrielle', title: 'De nos jours plus rien ne va', subtitle: 'Chant de révolte', duration: '3:45', type: 'epic', filename: 'De_nos_jours_plus_rien_de_va', cover: 'De_nos_jour_plus_rien_ne_va.png' },
  { id: 2, albumId: 'gabrielle', title: "Parangon d'une Soldate", subtitle: 'Hymne héroïque', duration: '4:12', type: 'military', filename: "Parangon_d'une_soldate", cover: 'Parangon_dune_soldate' },
  { id: 3, albumId: 'gabrielle', title: 'L\'Assaut Final', subtitle: 'Bataille épique', duration: '0:00', type: 'epic' },
  { id: 4, albumId: 'gabrielle', title: 'Les Fils de la Terre', subtitle: 'Marche triomphale', duration: '0:00', type: 'military' },
  { id: 5, albumId: 'gabrielle', title: 'Brumes d\'Émeraude', subtitle: 'Ballade mystique', duration: '0:00', type: 'celtic' },
  { id: 6, albumId: 'gabrielle', title: 'Sang et Gloire', subtitle: 'Cri de ralliement', duration: '0:00', type: 'epic' },
  { id: 7, albumId: 'gabrielle', title: 'Le Serment', subtitle: 'Hymne solennel', duration: '0:00', type: 'military' },
  { id: 8, albumId: 'gabrielle', title: 'Racines Profondes', subtitle: 'Mélodie ancestrale', duration: '0:00', type: 'celtic' },

  // Album: Noël 2024
  { id: 101, albumId: 'noel-2024', title: "C'est la belle nuit de Noël", subtitle: 'Cantique traditionnel', duration: '0:00', type: 'festive', filename: 'Cest_la_belle_nuit_de_Noel', cover: 'Cest_la_belle_nuit_de_noel' },
  { id: 102, albumId: 'noel-2024', title: 'Douce nuit, sainte nuit', subtitle: 'Classique de Noël', duration: '0:00', type: 'festive', filename: 'Douce_nuit_sainte_nuit', cover: 'Douce_nuit_sainte_nuit' },
  { id: 103, albumId: 'noel-2024', title: 'Il est levé le divin soldat', subtitle: 'Chant patriotique', duration: '0:00', type: 'festive', filename: 'Il_est_levé_le_divin_soldat', cover: 'Il_est_leve_le_divin_soldat' },
  { id: 104, albumId: 'noel-2024', title: 'Mon beau gros sapin, roi adoré', subtitle: 'Parodie festive', duration: '0:00', type: 'parody', filename: 'Mon_beau_gros_sexe_roi_adoré', cover: 'Mon_beau_gros_sexe_roi_adore' },
  { id: 105, albumId: 'noel-2024', title: 'Pour notre dernière chanson', subtitle: 'Ballade hivernale', duration: '0:00', type: 'festive', filename: 'Pour_notre_dernière_chanson', cover: 'Pour_notre_derniere_chanson' },
  { id: 106, albumId: 'noel-2024', title: 'Vive Chicoute, vive Chicoute !', subtitle: 'Parodie québécoise', duration: '0:00', type: 'parody', filename: 'Vive_Chicoute_vive_Chicoute', cover: 'Vive_chicout_vive_chicout' },

  // Album: Noël 2025
  // (pas encore de pistes)
]

// Shared state across components
const tracks = ref<Track[]>(localTracks)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useTracks() {
  // Get all tracks
  const fetchTracks = async (): Promise<void> => {
    // TODO: Replace with API call when backend is ready
    // const { get } = useApi()
    // const response = await get<Track[]>('/tracks')
    // if (response.success) tracks.value = response.data
    tracks.value = localTracks
  }

  // Get a single track by ID (global)
  const getTrackById = (id: number): Track | undefined => {
    return tracks.value.find(t => t.id === id)
  }

  // Get track by album and track number
  const getTrackByAlbumAndIndex = (albumId: string, index: number): Track | undefined => {
    const albumTracks = getTracksByAlbum(albumId)
    return albumTracks[index]
  }

  // Get all tracks for an album
  const getTracksByAlbum = (albumId: string): Track[] => {
    return tracks.value.filter(t => t.albumId === albumId)
  }

  // Get tracks by type
  const getTracksByType = (type: TrackType): Track[] => {
    return tracks.value.filter(t => t.type === type)
  }

  // Get track index within its album (1-based)
  const getTrackIndexInAlbum = (track: Track | undefined): number => {
    if (!track) return 0
    const albumTracks = getTracksByAlbum(track.albumId)
    return albumTracks.findIndex(t => t.id === track.id) + 1
  }

  // Get total tracks in album
  const getAlbumTrackCount = (albumId: string): number => {
    return getTracksByAlbum(albumId).length
  }

  // Get audio source URL for a track
  const getAudioSrc = (track: Track | undefined): string => {
    if (!track?.filename) return ''
    return `/audio/${track.albumId}/${track.filename}.mp3`
  }

  // Get cover image URL for a track
  const getCoverSrc = (track: Track | undefined): string => {
    if (!track) return '/covers/default.jpeg'
    // Use cover property if available, otherwise fallback to filename
    const coverName = track.cover || track.filename
    if (!coverName) return '/covers/default.jpeg'
    // Check if cover already has an extension
    const hasExtension = /\.(png|jpg|jpeg|webp)$/i.test(coverName)
    const cleanName = coverName.replace(/'/g, '')
    return `/covers/${track.albumId}/${cleanName}${hasExtension ? '' : '.jpeg'}`
  }

  // Type styling helpers
  const getTypeColor = (type: TrackType): string => {
    const colors: Record<TrackType, string> = {
      epic: 'bg-red-500/20 text-red-300 border-red-500/30',
      celtic: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      military: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      festive: 'bg-red-500/20 text-red-300 border-red-500/30',
      parody: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    }
    return colors[type]
  }

  const getTypeIcon = (type: TrackType): string => {
    const icons: Record<TrackType, string> = {
      epic: '⚔️',
      celtic: '🍀',
      military: '🛡️',
      festive: '🎄',
      parody: '🎭',
    }
    return icons[type]
  }

  const getTypeTextColor = (type: TrackType): string => {
    const colors: Record<TrackType, string> = {
      epic: 'text-red-400',
      celtic: 'text-emerald-400',
      military: 'text-amber-400',
      festive: 'text-red-400',
      parody: 'text-purple-400',
    }
    return colors[type]
  }

  return {
    // State
    tracks: readonly(tracks),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchTracks,
    getTrackById,
    getTrackByAlbumAndIndex,
    getTracksByAlbum,
    getTracksByType,
    getTrackIndexInAlbum,
    getAlbumTrackCount,
    getAudioSrc,
    getCoverSrc,
    getTypeColor,
    getTypeIcon,
    getTypeTextColor,
  }
}
