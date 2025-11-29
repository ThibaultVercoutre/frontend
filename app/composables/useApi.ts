import type { ApiResponse, ApiRequestOptions } from '~/types'

const API_BASE_URL = '/api'

export function useApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const buildUrl = (endpoint: string, params?: Record<string, string | number>): string => {
    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }
    return url.toString()
  }

  const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`
      error.value = errorMessage
      return { data: null as T, success: false, error: errorMessage }
    }
    const data = await response.json()
    return { data, success: true }
  }

  const get = async <T>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null

    try {
      const url = buildUrl(endpoint, options?.params)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })
      return await handleResponse<T>(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      error.value = message
      return { data: null as T, success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  const post = async <T, D = unknown>(
    endpoint: string,
    data: D,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null

    try {
      const url = buildUrl(endpoint, options?.params)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
      })
      return await handleResponse<T>(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      error.value = message
      return { data: null as T, success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  const put = async <T, D = unknown>(
    endpoint: string,
    data: D,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null

    try {
      const url = buildUrl(endpoint, options?.params)
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
      })
      return await handleResponse<T>(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      error.value = message
      return { data: null as T, success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  const del = async <T>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null

    try {
      const url = buildUrl(endpoint, options?.params)
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })
      return await handleResponse<T>(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      error.value = message
      return { data: null as T, success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    get,
    post,
    put,
    del,
  }
}
