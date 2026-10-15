import { useCallback, useEffect, useState } from 'react'
import type { Influencer, NewInfluencer } from './influencers.ts'
import { fetchInfluencers, addInfluencer as apiAddInfluencer, deleteInfluencer as apiDeleteInfluencer } from './mockApi.ts'

export function useInfluencers(initial: Influencer[] = []) {
  const [data, setData] = useState<Influencer[]>(initial)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchInfluencers()
      setData(result)
    } catch (err) {
      setError((err as Error).message || 'Failed to load influencers')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const addInfluencer = useCallback(async (item: NewInfluencer) => {
    setIsLoading(true)
    setError(null)
    try {
      const saved = await apiAddInfluencer(item)
      setData((prev) => [saved, ...prev])
      return saved
    } catch (err) {
      setError((err as Error).message || 'Failed to add influencer')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteInfluencer = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiDeleteInfluencer(id)
      setData((prev) => prev.filter((inf) => String(inf.id) !== id))
    } catch (err) {
      setError((err as Error).message || 'Failed to delete influencer')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { data, isLoading, error, load, addInfluencer, deleteInfluencer }
}
