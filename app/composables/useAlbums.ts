import type { Album, AlbumType } from '~/types'

// Local albums data - will be replaced by API calls later
const localAlbums: Album[] = [
  {
    id: 'gabrielle',
    title: 'Gabrielle',
    subtitle: 'L\'album fondateur',
    year: 2024,
    coverImage: '/albums/gabrielle.jpeg',
    trackCount: 8,
    type: 'album',
  },
  {
    id: 'noel-2024',
    title: 'Noël 2024',
    subtitle: 'Édition spéciale fêtes',
    year: 2024,
    coverImage: '/albums/noel-2024.jpeg',
    trackCount: 0,
    type: 'special',
  },
  {
    id: 'noel-2025',
    title: 'Noël 2025',
    subtitle: 'Le retour des fêtes',
    year: 2025,
    coverImage: '/albums/noel-2025.jpeg',
    trackCount: 0,
    type: 'special',
  },
]

// Shared state
const albums = ref<Album[]>(localAlbums)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useAlbums() {
  // Fetch all albums
  const fetchAlbums = async (): Promise<void> => {
    isLoading.value = true
    // TODO: Replace with API call
    // const { get } = useApi()
    // const response = await get<Album[]>('/albums')
    // if (response.success) albums.value = response.data
    albums.value = localAlbums
    isLoading.value = false
  }

  // Get album by ID
  const getAlbumById = (id: string): Album | undefined => {
    return albums.value.find(a => a.id === id)
  }

  // Get albums by type
  const getAlbumsByType = (type: AlbumType): Album[] => {
    return albums.value.filter(a => a.type === type)
  }

  // Get album cover URL
  const getAlbumCover = (album: Album | undefined): string => {
    if (!album) return '/albums/default.jpeg'
    return album.coverImage
  }

  // Type styling helpers
  const getAlbumTypeColor = (type: AlbumType): string => {
    const colors: Record<AlbumType, string> = {
      album: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      ep: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      single: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      special: 'bg-red-500/20 text-red-300 border-red-500/30',
    }
    return colors[type]
  }

  const getAlbumTypeIcon = (type: AlbumType): string => {
    const icons: Record<AlbumType, string> = {
      album: '💿',
      ep: '📀',
      single: '🎵',
      special: '🎄',
    }
    return icons[type]
  }

  return {
    // State
    albums: readonly(albums),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchAlbums,
    getAlbumById,
    getAlbumsByType,
    getAlbumCover,
    getAlbumTypeColor,
    getAlbumTypeIcon,
  }
}
