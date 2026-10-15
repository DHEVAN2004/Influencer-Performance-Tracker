import { useState } from 'react'
import { FiMail, FiSend, FiInbox, FiStar, FiTrash2, FiSearch, FiPlus, FiX } from 'react-icons/fi'
import { useInfluencers } from './useInfluencers.ts'

interface Message {
  id: string
  from: string
  subject: string
  content: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  type: 'inbox' | 'sent' | 'draft'
  avatar?: string
}

const mockMessages: Message[] = [
  {
    id: 'm1',
    from: 'TechCorp Marketing',
    subject: 'Campaign Proposal for Q1 2025',
    content: 'We\'d like to discuss a partnership opportunity for our new product launch...',
    timestamp: '2025-01-15T10:30:00Z',
    isRead: false,
    isStarred: true,
    type: 'inbox',
    avatar: 'https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=TC'
  },
  {
    id: 'm2',
    from: 'Maya Ellis',
    subject: 'Re: Collaboration Opportunity',
    content: 'Thanks for reaching out! I\'m interested in the fashion campaign...',
    timestamp: '2025-01-14T15:45:00Z',
    isRead: true,
    isStarred: false,
    type: 'inbox',
    avatar: 'https://via.placeholder.com/32x32/EC4899/FFFFFF?text=ME'
  },
  {
    id: 'm3',
    from: 'FashionHub Team',
    subject: 'Spring Collection Partnership',
    content: 'We loved your recent posts! Here\'s our proposal for collaboration...',
    timestamp: '2025-01-13T09:15:00Z',
    isRead: true,
    isStarred: false,
    type: 'inbox',
    avatar: 'https://via.placeholder.com/32x32/EC4899/FFFFFF?text=FH'
  },
  {
    id: 'm4',
    from: 'You',
    subject: 'Proposal for HealthLife Campaign',
    content: 'Hi team, I\'m excited about the opportunity to work with HealthLife...',
    timestamp: '2025-01-12T14:20:00Z',
    isRead: true,
    isStarred: false,
    type: 'sent',
    avatar: 'https://via.placeholder.com/32x32/10B981/FFFFFF?text=Y'
  }
]

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'starred'>('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [newMessageData, setNewMessageData] = useState({ recipientId: '', recipientName: '', recipientEmail: '', subject: '', content: '' })
  const [replyData, setReplyData] = useState({ content: '' })
  const { data: influencerList } = useInfluencers()

  const filteredMessages = messages.filter(message => {
    const matchesTab =
      activeTab === 'inbox' ? message.type === 'inbox' :
      activeTab === 'sent' ? message.type === 'sent' :
      message.isStarred

    const matchesSearch = searchQuery === '' ||
      message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  const toggleStar = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ))
  }

  const markAsRead = (message: Message) => {
    if (!message.isRead) {
      setMessages(prev => prev.map(msg =>
        msg.id === message.id ? { ...msg, isRead: true } : msg
      ))
    }
    setSelectedMessage(message)
  }

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null)
    }
  }

  const handleSendNewMessage = () => {
    const { recipientId, recipientEmail, subject, content } = newMessageData

    if (!recipientId || !recipientEmail.trim() || !subject.trim() || !content.trim()) {
      alert('Please select an influencer and fill in subject and message content.')
      return
    }

    const mailtoLink = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`
    window.open(mailtoLink, '_blank')

    const newMessage: Message = {
      id: `m${Date.now()}`,
      from: 'You',
      subject,
      content,
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      type: 'sent',
      avatar: 'https://via.placeholder.com/32x32/10B981/FFFFFF?text=Y'
    }

    setMessages(prev => [newMessage, ...prev])
    setNewMessageData({ recipientId: '', recipientName: '', recipientEmail: '', subject: '', content: '' })
    setShowNewMessageModal(false)
    alert('Message opened in your email client and recorded as sent.')
  }

  const handleReply = async () => {
    if (!replyData.content.trim()) {
      alert('Please enter a message')
      return
    }

    try {
      // Mock reply flow: backend route is not currently available in this project
      await new Promise((resolve) => setTimeout(resolve, 200))

      const replyMessage: Message = {
        id: `m${Date.now()}`,
        from: 'You',
        subject: `Re: ${selectedMessage?.subject}`,
        content: replyData.content,
        timestamp: new Date().toISOString(),
        isRead: true,
        isStarred: false,
        type: 'sent',
        avatar: 'https://via.placeholder.com/32x32/10B981/FFFFFF?text=Y'
      }

      setMessages(prev => [replyMessage, ...prev])
      setReplyData({ content: '' })
      setShowReplyModal(false)
      alert('Reply sent successfully!')
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Failed to send reply. Please try again.')
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-6">
      {/* Messages List */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm"
            >
              <FiPlus className="w-4 h-4" />
              New Message
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'inbox'
                  ? 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FiInbox className="w-4 h-4 inline mr-2" />
              Inbox ({messages.filter(m => m.type === 'inbox').length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'sent'
                  ? 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FiSend className="w-4 h-4 inline mr-2" />
              Sent ({messages.filter(m => m.type === 'sent').length})
            </button>
            <button
              onClick={() => setActiveTab('starred')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'starred'
                  ? 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FiStar className="w-4 h-4 inline mr-2" />
              Starred ({messages.filter(m => m.isStarred).length})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <FiMail className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-medium mb-2">No messages found</p>
              <p className="text-sm">Try adjusting your search or check a different folder.</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => markAsRead(message)}
                className={`p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  !message.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                } ${selectedMessage?.id === message.id ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {message.avatar && (
                    <img src={message.avatar} alt={message.from} className="w-8 h-8 rounded-full" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium truncate ${!message.isRead ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                        {message.from}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{formatTime(message.timestamp)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleStar(message.id)
                          }}
                          className={`p-1 rounded ${message.isStarred ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
                        >
                          <FiStar className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteMessage(message.id)
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-500"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm truncate mt-1 ${!message.isRead ? 'font-medium' : ''}`}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        {selectedMessage ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                {selectedMessage.avatar && (
                  <img src={selectedMessage.avatar} alt={selectedMessage.from} className="w-8 h-8 rounded-full" />
                )}
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{selectedMessage.from}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatTime(selectedMessage.timestamp)}</p>
                </div>
              </div>
              <h3 className="font-medium text-slate-800 dark:text-slate-100">{selectedMessage.subject}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{selectedMessage.content}</p>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowReplyModal(true)}
                className="w-full py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium"
              >
                Reply
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <FiMail className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-medium mb-2">Select a message</p>
              <p className="text-sm">Choose a message from the list to view its contents.</p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send New Message</h3>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  To (Influencer)
                </label>
                <select
                  value={newMessageData.recipientId}
                  onChange={(e) => {
                    const selected = influencerList.find((inf) => String(inf.id) === e.target.value)
                    setNewMessageData({
                      ...newMessageData,
                      recipientId: e.target.value,
                      recipientName: selected?.name || '',
                      recipientEmail: selected?.contactEmail || '',
                    })
                  }}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="">Select influencer</option>
                  {influencerList.map((influencer) => (
                    <option key={influencer.id} value={String(influencer.id)}>
                      {influencer.name} — {influencer.contactEmail}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  This will send a message using the influencer's saved contact email.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={newMessageData.subject}
                  onChange={(e) => setNewMessageData({ ...newMessageData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  placeholder="Type your message..."
                  value={newMessageData.content}
                  onChange={(e) => setNewMessageData({ ...newMessageData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm h-32 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNewMessage}
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FiSend className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reply to {selectedMessage.from}</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Original:</p>
                <p className="text-slate-600 dark:text-slate-400">{selectedMessage.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Your Reply
                </label>
                <textarea
                  placeholder="Type your reply..."
                  value={replyData.content}
                  onChange={(e) => setReplyData({ content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm h-32 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FiSend className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
