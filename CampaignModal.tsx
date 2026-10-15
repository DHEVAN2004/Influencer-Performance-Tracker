import { useState, useEffect } from 'react'
import type { Campaign } from './campaigns.ts'
import type { Influencer } from './influencers.ts'
import Modal from './Modal.tsx'

interface CampaignModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: Campaign | null
  influencers: Influencer[]
  onSave: (campaign: Campaign) => void
}

const OBJECTIVES = ['Brand Awareness', 'Product Launch', 'Engagement', 'Lead Generation', 'Sales']
const STATUSES = ['running', 'paused', 'completed', 'draft'] as const

export default function CampaignModal({ isOpen, onClose, campaign, influencers, onSave }: CampaignModalProps) {
  const [formData, setFormData] = useState<Campaign>({
    id: '',
    name: '',
    influencers: [],
    status: 'draft',
    startDate: '',
    endDate: '',
    objective: '',
    budget: 0,
    dailyBudget: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0,
    conversionRate: 0,
    roi: 0,
    totalReach: 0,
  })

  useEffect(() => {
    if (campaign) {
      setFormData(campaign)
    } else {
      // Reset form for new campaign
      setFormData({
        id: `c${Date.now()}`,
        name: '',
        influencers: [],
        status: 'draft',
        startDate: '',
        endDate: '',
        objective: '',
        budget: 0,
        dailyBudget: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        conversionRate: 0,
        roi: 0,
        totalReach: 0,
      })
    }
  }, [campaign, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleInfluencerToggle = (influencerName: string) => {
    setFormData(prev => ({
      ...prev,
      influencers: prev.influencers.includes(influencerName)
        ? prev.influencers.filter(name => name !== influencerName)
        : [...prev.influencers, influencerName]
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={campaign ? 'Edit Campaign' : 'Add New Campaign'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Campaign['status'] }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            >
              {STATUSES.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Objective
            </label>
            <select
              value={formData.objective}
              onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              required
            >
              <option value="">Select Objective</option>
              {OBJECTIVES.map(obj => (
                <option key={obj} value={obj}>{obj}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Total Budget ($)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Daily Budget ($)
            </label>
            <input
              type="number"
              value={formData.dailyBudget}
              onChange={(e) => setFormData(prev => ({ ...prev, dailyBudget: Number(e.target.value) }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Assign Influencers ({formData.influencers.length} selected)
          </label>
          <div className="max-h-40 overflow-y-auto border border-slate-300 dark:border-slate-700 rounded-lg p-3 space-y-2">
            {influencers.map(influencer => (
              <label key={influencer.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.influencers.includes(influencer.name)}
                  onChange={() => handleInfluencerToggle(influencer.name)}
                  className="rounded border-slate-300 dark:border-slate-700"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {influencer.name} ({influencer.platform}) - {influencer.followers.toLocaleString()} followers
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700"
          >
            {campaign ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </Modal>
  )
}