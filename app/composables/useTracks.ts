import type { Track, TrackType } from '~/types'

// Local data - will be replaced by API calls later
const localTracks: Track[] = [
  // Album: Gabrielle
  { id: 1, albumId: 'gabrielle', title: 'De nos jours plus rien ne va', subtitle: 'Chant de révolte', duration: '3:45', type: 'epic', filename: 'De_nos_jours_plus_rien_de_va' },
  { id: 2, albumId: 'gabrielle', title: "Parangon d'une Soldate", subtitle: 'Hymne héroïque', duration: '4:12', type: 'military', filename: "Parangon_d'une_soldate" },
  { id: 3, albumId: 'gabrielle', title: 'L\'Assaut Final', subtitle: 'Bataille épique', duration: '0:00', type: 'epic' },
  { id: 4, albumId: 'gabrielle', title: 'Les Fils de la Terre', subtitle: 'Marche triomphale', duration: '0:00', type: 'military' },
  { id: 5, albumId: 'gabrielle', title: 'Brumes d\'Émeraude', subtitle: 'Ballade mystique', duration: '0:00', type: 'celtic' },
  { id: 6, albumId: 'gabrielle', title: 'Sang et Gloire', subtitle: 'Cri de ralliement', duration: '0:00', type: 'epic' },
  { id: 7, albumId: 'gabrielle', title: 'Le Serment', subtitle: 'Hymne solennel', duration: '0:00', type: 'military' },
  { id: 8, albumId: 'gabrielle', title: 'Racines Profondes', subtitle: 'Mélodie ancestrale', duration: '0:00', type: 'celtic' },

  // Album: Noël 2024
  // (pas encore de pistes)

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
    if (!track?.filename) return '/covers/default.jpeg'
    return `/covers/${track.albumId}/${track.filename.replace(/'/g, '')}.jpeg`
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
