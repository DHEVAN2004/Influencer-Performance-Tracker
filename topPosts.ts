export interface TopPost {
  id: string
  influencer: string
  title: string
  platform: string
  likes: number
  comments: number
  shares: number
  saves: number
  engagementRate: number
  publishedDate: string
}

export const topPosts: TopPost[] = [
  {
    id: 'p1',
    influencer: 'Maya Ellis',
    title: 'Dance challenge that hit 1M views!',
    platform: 'TikTok',
    likes: 102000,
    comments: 8200,
    shares: 5400,
    saves: 1000,
    engagementRate: 9.5,
    publishedDate: '2025-12-14',
  },
  {
    id: 'p2',
    influencer: 'Ava Santiago',
    title: 'Best travel outfits for summer',
    platform: 'Instagram',
    likes: 80000,
    comments: 6400,
    shares: 2900,
    saves: 3000,
    engagementRate: 8.2,
    publishedDate: '2025-12-12',
  },
  {
    id: 'p3',
    influencer: 'Leo Johnson',
    title: 'Must-have accessories for new phones',
    platform: 'YouTube',
    likes: 47000,
    comments: 5200,
    shares: 1200,
    saves: 800,
    engagementRate: 7.9,
    publishedDate: '2025-12-10',
  },
]
