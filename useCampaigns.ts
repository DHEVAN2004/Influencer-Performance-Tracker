import { useCallback, useEffect, useState } from 'react'
import type { Campaign } from './campaigns.ts'
import { fetchCampaigns, addCampaign as apiAddCampaign, updateCampaign as apiUpdateCampaign } from './mockApi.ts'

export function useCampaigns(initial: Campaign[] = []) {
  const [data, setData] = useState<Campaign[]>(initial)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchCampaigns()
      setData(result)
    } catch (err) {
      setError((err as Error).message || 'Failed to load campaigns')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const addCampaign = useCallback(async (item: Campaign) => {
    setIsLoading(true)
    setError(null)
    try {
      const saved = await apiAddCampaign(item)
      setData((prev) => [saved, ...prev])
      return saved
    } catch (err) {
      setError((err as Error).message || 'Failed to add campaign')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateCampaign = useCallback(async (id: string, item: Campaign) => {
    setIsLoading(true)
    setError(null)
    try {
      const saved = await apiUpdateCampaign(id, item)
      setData((prev) => prev.map((camp) => camp.id === id ? saved : camp))
      return saved
    } catch (err) {
      setError((err as Error).message || 'Failed to update campaign')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { data, isLoading, error, load, addCampaign, updateCampaign }
}
