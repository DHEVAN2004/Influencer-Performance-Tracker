import { useState } from 'react'
import Card from './Card.tsx'
import Modal from './Modal.tsx'
import { FiPlus, FiMail, FiTrendingUp, FiDollarSign, FiCalendar, FiStar } from 'react-icons/fi'

interface Brand {
  id: string
  name: string
  logo: string
  industry: string
  status: 'active' | 'pending' | 'completed'
  budget: number
  startDate: string
  endDate: string
  assignedInfluencers: string[]
  description: string
}

const mockBrands: Brand[] = [
  {
    id: 'b1',
    name: 'TechCorp',
    logo: 'https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=TC',
    industry: 'Technology',
    status: 'active',
    budget: 25000,
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    assignedInfluencers: ['Ava Santiago', 'Noah Patel'],
    description: 'Product launch campaign for new smartphone'
  },
  {
    id: 'b2',
    name: 'FashionHub',
    logo: 'https://via.placeholder.com/40x40/EC4899/FFFFFF?text=FH',
    industry: 'Fashion',
    status: 'pending',
    budget: 15000,
    startDate: '2025-02-01',
    endDate: '2025-04-01',
    assignedInfluencers: ['Maya Ellis'],
    description: 'Spring collection promotion'
  },
  {
    id: 'b3',
    name: 'HealthLife',
    logo: 'https://via.placeholder.com/40x40/10B981/FFFFFF?text=HL',
    industry: 'Health & Wellness',
    status: 'completed',
    budget: 30000,
    startDate: '2024-11-01',
    endDate: '2025-01-01',
    assignedInfluencers: ['Leo Johnson'],
    description: 'Fitness app marketing campaign'
  }
]

export default function BrandsPage() {
  const [brands] = useState<Brand[]>(mockBrands)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isNewPartnershipOpen, setIsNewPartnershipOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'completed': return 'bg-slate-100 text-slate-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const handleOpenNewPartnership = () => setIsNewPartnershipOpen(true)
  const handleViewDetails = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsDetailsModalOpen(true)
  }

  const handleContact = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsContactModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedBrand(null)
    setIsDetailsModalOpen(false)
    setIsContactModalOpen(false)
    setIsNewPartnershipOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Brand Partnerships</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage brand collaborations and campaigns</p>
        </div>
        <button
          onClick={handleOpenNewPartnership}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium"
        >
          <FiPlus className="w-4 h-4" />
          New Partnership
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Campaigns</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {brands.filter(b => b.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FiDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Budget</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                ${brands.reduce((sum, b) => sum + b.budget, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FiStar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {brands.filter(b => b.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <FiCalendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {brands.filter(b => b.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Brands List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Card key={brand.id} title={brand.name}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src={brand.logo} alt={brand.name} className="w-10 h-10 rounded-lg" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{brand.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{brand.industry}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(brand.status)}`}>
                  {brand.status.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  ${brand.budget.toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">{brand.description}</p>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                <p>{brand.startDate} - {brand.endDate}</p>
                <p>{brand.assignedInfluencers.length} influencer{brand.assignedInfluencers.length !== 1 ? 's' : ''} assigned</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleContact(brand)}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-sky-500 text-white hover:bg-sky-600 flex items-center justify-center gap-1"
                >
                  <FiMail className="w-3 h-3" />
                  Contact
                </button>
                <button
                  onClick={() => handleViewDetails(brand)}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  View Details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <FiTrendingUp className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-medium mb-2">No brand partnerships yet</p>
          <p className="text-sm">Start building relationships with brands to grow your network.</p>
        </div>
      )}

      <Modal isOpen={isNewPartnershipOpen} onClose={handleCloseModal} title="New Partnership">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Create a new brand collaboration. This placeholder form can be extended with real inputs and save logic.
          </p>
          <div className="grid gap-4">
            <input className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-slate-50 text-slate-900" placeholder="Brand name" />
            <input className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-slate-50 text-slate-900" placeholder="Industry" />
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
            >
              Save Partnership
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDetailsModalOpen} onClose={handleCloseModal} title={`Brand Details: ${selectedBrand?.name ?? ''}`}>
        {selectedBrand && (
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
            <p><span className="font-semibold">Industry:</span> {selectedBrand.industry}</p>
            <p><span className="font-semibold">Status:</span> {selectedBrand.status}</p>
            <p><span className="font-semibold">Budget:</span> ${selectedBrand.budget.toLocaleString()}</p>
            <p><span className="font-semibold">Period:</span> {selectedBrand.startDate} - {selectedBrand.endDate}</p>
            <p><span className="font-semibold">Assigned Influencers:</span> {selectedBrand.assignedInfluencers.join(', ')}</p>
            <p>{selectedBrand.description}</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={isContactModalOpen} onClose={handleCloseModal} title={`Contact ${selectedBrand?.name ?? 'Brand'}`}>
        {selectedBrand && (
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
            <p>Use the button below to open your default mail app and send a message to the brand.</p>
            <button
              type="button"
              onClick={() => window.open(`mailto:contact@${selectedBrand.name.replace(/\s+/g, '').toLowerCase()}.com?subject=Partnership%20Inquiry%20for%20${encodeURIComponent(selectedBrand.name)}`)}
              className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
            >
              Send Email to {selectedBrand.name}
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
