export interface Campaign {
  id: string
  name: string
  influencers: string[]
  status: 'running' | 'paused' | 'completed' | 'draft'
  startDate: string
  endDate: string
  objective: string
  budget: number
  dailyBudget: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  conversionRate: number
  roi: number
  totalReach: number
}

export const campaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Summer Beauty Launch',
    influencers: ['Ava Santiago', 'Noah Patel'],
    status: 'running',
    startDate: '2025-11-01',
    endDate: '2025-12-30',
    objective: 'Brand Awareness',
    budget: 18000,
    dailyBudget: 600,
    impressions: 2250000,
    clicks: 67500,
    ctr: 3.0,
    conversions: 5120,
    conversionRate: 4.1,
    roi: 5.2,
    totalReach: 1250000,
  },
  {
    id: 'c2',
    name: 'Smartphone Release',
    influencers: ['Leo Johnson'],
    status: 'paused',
    startDate: '2025-10-15',
    endDate: '2025-12-15',
    objective: 'Product Launch',
    budget: 27000,
    dailyBudget: 900,
    impressions: 1900000,
    clicks: 105000,
    ctr: 5.5,
    conversions: 5950,
    conversionRate: 5.6,
    roi: 6.8,
    totalReach: 900000,
  },
  {
    id: 'c3',
    name: 'Holiday Dance Challenge',
    influencers: ['Maya Ellis'],
    status: 'completed',
    startDate: '2025-09-01',
    endDate: '2025-10-30',
    objective: 'Engagement',
    budget: 14000,
    dailyBudget: 450,
    impressions: 2720000,
    clicks: 202000,
    ctr: 7.4,
    conversions: 9060,
    conversionRate: 6.4,
    roi: 8.2,
    totalReach: 1420000,
  },
]