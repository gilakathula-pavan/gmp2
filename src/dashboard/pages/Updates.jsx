import React, { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import Modal from '../../components/ui/Modal'
import { AuthContext } from '../../contexts/AuthContext'
import backend from '../../services/mockBackend'

const entries = [
  { id: 'u1', date: 'Dec 8', did: 'Built dashboard shell and stat cards', challenges: 'Choosing chart lib', learnings: 'Chart.js hooks' },
  { id: 'u2', date: 'Dec 7', did: 'Refined project cards and CTA', challenges: 'Copywriting', learnings: 'Shorter CTAs work' },
]

export default function Updates(){
  const { user, updateProfile, pushToProfileArray } = useContext(AuthContext)
  const initial = user?.profile?.updates || [
    { id: 'u1', date: 'Dec 8', did: 'Built dashboard shell and stat cards', challenges: 'Choosing chart lib', learnings: 'Chart.js hooks' },
    { id: 'u2', date: 'Dec 7', did: 'Refined project cards and CTA', challenges: 'Copywriting', learnings: 'Shorter CTAs work' },
  ]
  const [entries, setEntries] = useState(initial)
  useEffect(() => {
    setEntries(user?.profile?.updates || initial)
  }, [user?.profile?.updates])
  const [showLogModal, setShowLogModal] = useState(false)
  const [updateForm, setUpdateForm] = useState({ did: '', challenges: '', learnings: '' })

  const handleQuickLog = () => {
    const newEntry = {
      id: `u${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...updateForm,
    }
    ;(async () => {
      try {
        const updated = await backend.addUpdate(newEntry)
        setEntries(updated)
        updateProfile({ updates: updated })
        setShowLogModal(false)
        setUpdateForm({ did: '', challenges: '', learnings: '' })
        alert('Update logged successfully!')
      } catch (err) {
        console.error(err)
        alert('Failed to log update')
      }
    })()
  }

  const handleDeleteEntry = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      ;(async () => {
        try {
          const updated = entries.filter(e => e.id !== id)
          await backend.updateUpdates(updated)
          setEntries(updated)
          updateProfile({ updates: updated })
          alert('Entry deleted successfully!')
        } catch (err) {
          console.error(err)
          alert('Failed to delete entry')
        }
      })()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Daily / Weekly Updates</h1>
          <p className="text-sm text-slate-500">Journal entries with auto-save drafts and reminders.</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogModal(true)}
            className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
          >
            Quick Log
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { updateProfile({ attachmentsEnabled: true }); alert('Attachment feature toggled in profile (placeholder)') }}
            className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all font-medium"
          >
            Add Attachment
          </motion.button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {entries.map(e => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="font-medium">{e.date}</span>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600">Linked to Project</span>
                  <button
                    onClick={() => handleDeleteEntry(e.id)}
                    className="text-red-600 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-sm text-slate-800"><strong className="text-slate-900">Did:</strong> {e.did}</div>
              <div className="text-sm text-slate-700"><strong className="text-slate-900">Challenges:</strong> {e.challenges}</div>
              <div className="text-sm text-slate-700"><strong className="text-slate-900">Learnings:</strong> {e.learnings}</div>
            </motion.div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Reminder</div>
            <p className="text-xs text-slate-500 mt-1">No update logged in 3+ days. Keep your streak alive.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogModal(true)}
              className="mt-3 text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 w-full font-medium shadow-sm"
            >
              Log now
            </motion.button>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Weekly Summary</div>
            <p className="text-xs text-slate-500 mt-1">4 updates · 12 hours logged</p>
            <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-indigo-600 w-4/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Log Modal */}
      <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title="Quick Log Update" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">What I Did Today</label>
            <textarea
              value={updateForm.did}
              onChange={(e) => setUpdateForm({ ...updateForm, did: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Describe what you accomplished..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Challenges Faced</label>
            <textarea
              value={updateForm.challenges}
              onChange={(e) => setUpdateForm({ ...updateForm, challenges: e.target.value })}
              rows="2"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Any obstacles or difficulties..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Learnings</label>
            <textarea
              value={updateForm.learnings}
              onChange={(e) => setUpdateForm({ ...updateForm, learnings: e.target.value })}
              rows="2"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="What did you learn today?"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowLogModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleQuickLog}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Save Update
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

