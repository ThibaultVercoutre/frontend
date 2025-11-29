import type { Track, TrackType } from '~/types'

// Local data - will be replaced by API calls later
const localTracks: Track[] = [
  { id: 1, title: 'De nos jours plus rien ne va', subtitle: 'Chant de révolte', duration: '3:45', type: 'epic', filename: 'De_nos_jours_plus_rien_de_va' },
  { id: 2, title: "Parangon d'une Soldate", subtitle: 'Hymne héroïque', duration: '4:12', type: 'military', filename: "Parangon_d'une_soldate" },
  { id: 3, title: 'L\'Assaut Final', subtitle: 'Bataille épique', duration: '0:00', type: 'epic' },
  { id: 4, title: 'Les Fils de la Terre', subtitle: 'Marche triomphale', duration: '0:00', type: 'military' },
  { id: 5, title: 'Brumes d\'Émeraude', subtitle: 'Ballade mystique', duration: '0:00', type: 'celtic' },
  { id: 6, title: 'Sang et Gloire', subtitle: 'Cri de ralliement', duration: '0:00', type: 'epic' },
  { id: 7, title: 'Le Serment', subtitle: 'Hymne solennel', duration: '0:00', type: 'military' },
  { id: 8, title: 'Racines Profondes', subtitle: 'Mélodie ancestrale', duration: '0:00', type: 'celtic' },
]

// Shared state across components
const tracks = ref<Track[]>(localTracks)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useTracks() {
  const { get } = useApi()

  // Get all tracks
  const fetchTracks = async (): Promise<void> => {
    // TODO: Replace with API call when backend is ready
    // const response = await get<Track[]>('/tracks')
    // if (response.success) {
    //   tracks.value = response.data
    // }

    // For now, use local data
    tracks.value = localTracks
  }

  // Get a single track by ID
  const getTrackById = (id: number): Track | undefined => {
    return tracks.value.find(t => t.id === id)
  }

  // Get tracks by type
  const getTracksByType = (type: TrackType): Track[] => {
    return tracks.value.filter(t => t.type === type)
  }

  // Get audio source URL for a track
  const getAudioSrc = (track: Track | undefined): string => {
    if (!track?.filename) return ''
    return `/audio/${track.filename}.mp3`
  }

  // Get cover image URL for a track
  const getCoverSrc = (track: Track | undefined): string => {
    if (!track?.filename) return '/vynile/default.jpeg'
    return `/vynile/${track.filename.replace(/'/g, '')}.jpeg`
  }

  // Type styling helpers
  const getTypeColor = (type: TrackType): string => {
    const colors: Record<TrackType, string> = {
      epic: 'bg-red-500/20 text-red-300 border-red-500/30',
      celtic: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      military: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    }
    return colors[type]
  }

  const getTypeIcon = (type: TrackType): string => {
    const icons: Record<TrackType, string> = {
      epic: '⚔️',
      celtic: '🍀',
      military: '🛡️',
    }
    return icons[type]
  }

  const getTypeTextColor = (type: TrackType): string => {
    const colors: Record<TrackType, string> = {
      epic: 'text-red-400',
      celtic: 'text-emerald-400',
      military: 'text-amber-400',
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
    getTracksByType,
    getAudioSrc,
    getCoverSrc,
    getTypeColor,
    getTypeIcon,
    getTypeTextColor,
  }
}
