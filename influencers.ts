export type Platform = 'Instagram' | 'YouTube' | 'TikTok' | 'Twitter' | 'LinkedIn'

export interface Influencer {
  id: number
  name: string
  platform: Platform
  followers: number
  engagementRate: number
  bio: string
  profileImage: string
  country: string
  category: string
  avgPostsPerWeek: number
  contactEmail: string
  profileUrl?: string
  verified: boolean
  isActive: boolean
  growthData: { date: string; followers: number }[]
}

export type NewInfluencer = Omit<Influencer, 'id'>

export const influencers: Influencer[] = [
  {
    id: 1,
    name: 'Ava Santiago',
    platform: 'Instagram',
    followers: 245000,
    engagementRate: 6.8,
    bio: 'Travel & lifestyle influencer | Adventure seeker | Content creator',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    country: 'USA',
    category: 'Travel',
    avgPostsPerWeek: 4,
    contactEmail: 'ava.santiago@example.com',
    profileUrl: 'https://instagram.com/avasantiago',
    verified: true,
    isActive: true,
    growthData: [
      { date: '2025-10', followers: 220000 },
      { date: '2025-11', followers: 232000 },
      { date: '2025-12', followers: 245000 },
    ],
  },
  {
    id: 2,
    name: 'Noah Patel',
    platform: 'YouTube',
    followers: 385000,
    engagementRate: 7.2,
    bio: 'Tech reviewer & gadget enthusiast | Weekly uploads',
    profileImage: 'https://i.pravatar.cc/150?img=2',
    country: 'USA',
    category: 'Technology',
    avgPostsPerWeek: 2,
    contactEmail: 'noah.patel@example.com',
    profileUrl: 'https://youtube.com/noahpatel',
    verified: true,
    isActive: true,
    growthData: [
      { date: '2025-10', followers: 355000 },
      { date: '2025-11', followers: 370000 },
      { date: '2025-12', followers: 385000 },
    ],
  },
  {
    id: 3,
    name: 'Leo Johnson',
    platform: 'YouTube',
    followers: 512000,
    engagementRate: 8.1,
    bio: 'Product reviewer & unboxing videos | Tech enthusiast',
    profileImage: 'https://i.pravatar.cc/150?img=3',
    country: 'USA',
    category: 'Technology',
    avgPostsPerWeek: 3,
    contactEmail: 'leo.johnson@example.com',
    profileUrl: 'https://youtube.com/leojohnson',
    verified: true,
    isActive: true,
    growthData: [
      { date: '2025-10', followers: 480000 },
      { date: '2025-11', followers: 495000 },
      { date: '2025-12', followers: 512000 },
    ],
  },
  {
    id: 4,
    name: 'Maya Ellis',
    platform: 'TikTok',
    followers: 650000,
    engagementRate: 9.5,
    bio: 'Dance creator & entertainment | Viral content specialist',
    profileImage: 'https://i.pravatar.cc/150?img=4',
    country: 'USA',
    category: 'Entertainment',
    avgPostsPerWeek: 6,
    contactEmail: 'maya.ellis@example.com',
    profileUrl: 'https://tiktok.com/@mayaellis',
    verified: true,
    isActive: true,
    growthData: [
      { date: '2025-10', followers: 600000 },
      { date: '2025-11', followers: 625000 },
      { date: '2025-12', followers: 650000 },
    ],
  },
]
