import { influencers as initialInfluencers, type Influencer } from './influencers.ts'
import { campaigns as initialCampaigns, type Campaign } from './campaigns.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined
const USE_BACKEND = {
  influencers: false,
  campaigns: false,
  verifyProfile: false,
}

export type NewInfluencer = Omit<Influencer, 'id'>

const STORAGE_KEYS = {
  influencers: 'influencer_app_influencers',
  campaigns: 'influencer_app_campaigns',
}

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key)
    const parsed = stored ? JSON.parse(stored) : null
    return (parsed && parsed.length > 0) ? parsed : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

let influencerStore = loadFromStorage(STORAGE_KEYS.influencers, initialInfluencers)
let campaignStore = loadFromStorage(STORAGE_KEYS.campaigns, initialCampaigns)

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token')
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  })

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export async function fetchInfluencers(): Promise<Influencer[]> {
  if (BASE_URL && USE_BACKEND.influencers) return apiFetch<Influencer[]>('/influencers')
  await wait(300)
  return [...influencerStore]
}

export async function addInfluencer(influencer: NewInfluencer): Promise<Influencer> {
  if (BASE_URL && USE_BACKEND.influencers) return apiFetch<Influencer>('/influencers', { method: 'POST', body: JSON.stringify(influencer) })
  await wait(300)
  const created: Influencer = { id: Date.now(), ...influencer }
  influencerStore = [created, ...influencerStore]
  saveToStorage(STORAGE_KEYS.influencers, influencerStore)
  return created
}

export async function deleteInfluencer(id: string): Promise<void> {
  if (BASE_URL) {
    await apiFetch<void>(`/influencers/${id}`, { method: 'DELETE' })
    return
  }
  await wait(150)
  influencerStore = influencerStore.filter((inf) => String(inf.id) !== id)
  saveToStorage(STORAGE_KEYS.influencers, influencerStore)
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  if (BASE_URL && USE_BACKEND.campaigns) return apiFetch<Campaign[]>('/campaigns')
  await wait(300)
  return [...campaignStore]
}

export async function addCampaign(campaign: Campaign): Promise<Campaign> {
  if (BASE_URL && USE_BACKEND.campaigns) return apiFetch<Campaign>('/campaigns', { method: 'POST', body: JSON.stringify(campaign) })
  await wait(300)
  campaignStore = [campaign, ...campaignStore]
  saveToStorage(STORAGE_KEYS.campaigns, campaignStore)
  return campaign
}

export async function updateCampaign(id: string, campaign: Campaign): Promise<Campaign> {
  if (BASE_URL && USE_BACKEND.campaigns) return apiFetch<Campaign>(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(campaign) })
  await wait(300)
  campaignStore = campaignStore.map((c) => c.id === id ? { ...campaign, id } : c)
  saveToStorage(STORAGE_KEYS.campaigns, campaignStore)
  return { ...campaign, id }
}

export async function verifyProfile(profileUrl: string, platform: string): Promise<{ verified: boolean; followers: number; engagementRate: number; bio: string }> {
  if (BASE_URL && USE_BACKEND.verifyProfile) {
    return apiFetch<{ verified: boolean; followers: number; engagementRate: number; bio: string }>('/influencers/verify-profile', {
      method: 'POST',
      body: JSON.stringify({ profileUrl, platform }),
    })
  }
  await wait(500)
  // Mock verification - generate random realistic data
  const followers = Math.floor(Math.random() * 500000) + 10000
  const engagementRate = (Math.random() * 8 + 1).toFixed(2)
  const bios = [
    'Content creator & influencer',
    'Digital marketer and content expert',
    'Creative storyteller & brand collaborator',
    'Social media specialist',
    'Brand ambassador',
  ]
  return {
    verified: true,
    followers,
    engagementRate: Number(engagementRate),
    bio: bios[Math.floor(Math.random() * bios.length)],
  }
}