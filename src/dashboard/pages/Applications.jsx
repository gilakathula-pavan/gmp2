import React, { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import Modal from '../../components/ui/Modal'
import { AuthContext } from '../../contexts/AuthContext'
import backend from '../../services/mockBackend'

const applications = [
  { id: 'a1', company: 'Acme Labs', role: 'Frontend Intern', stage: 'Interviewing', notes: 'Round 2 scheduled' },
  { id: 'a2', company: 'Beta Tech', role: 'Product Design Intern', stage: 'Applied', notes: 'Sent portfolio PDF' },
]

export default function Applications(){
  const { user, updateProfile } = useContext(AuthContext)
  const initial = user?.profile?.applications || [
    { id: 'a1', company: 'Acme Labs', role: 'Frontend Intern', stage: 'Interviewing', notes: 'Round 2 scheduled' },
    { id: 'a2', company: 'Beta Tech', role: 'Product Design Intern', stage: 'Applied', notes: 'Sent portfolio PDF' },
  ]
  const [applications, setApplications] = useState(initial)
  useEffect(() => {
    setApplications(user?.profile?.applications || initial)
  }, [user?.profile?.applications])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [appForm, setAppForm] = useState({ company: '', role: '', stage: 'Applied', notes: '' })

  const handleAddApplication = () => {
    const newApp = {
      id: `a${Date.now()}`,
      ...appForm,
    }
    ;(async () => {
      try {
        const updated = await backend.addApplication(newApp)
        setApplications(updated)
        updateProfile({ applications: updated })
        setShowAddModal(false)
        setAppForm({ company: '', role: '', stage: 'Applied', notes: '' })
        alert('Application added successfully!')
      } catch (err) {
        console.error(err)
        alert('Failed to add application')
      }
    })()
  }

  const handleEditApplication = (app) => {
    setEditingApp(app)
    setAppForm({
      company: app.company,
      role: app.role,
      stage: app.stage,
      notes: app.notes,
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    ;(async () => {
      try {
        const updated = applications.map(a => a.id === editingApp.id ? { ...a, ...appForm } : a)
        setApplications(updated)
        await backend.updateApplications(updated)
        updateProfile({ applications: updated })
        setShowEditModal(false)
        setEditingApp(null)
        alert('Application updated successfully!')
      } catch (err) {
        console.error(err)
        alert('Failed to update application')
      }
    })()
  }

  const handleDeleteApplication = (id) => {
    if (confirm('Are you sure you want to delete this application?')) {
      ;(async () => {
        try {
          const updated = applications.filter(a => a.id !== id)
          setApplications(updated)
          await backend.updateApplications(updated)
          updateProfile({ applications: updated })
          alert('Application deleted successfully!')
        } catch (err) {
          console.error(err)
          alert('Failed to delete application')
        }
      })()
    }
  }

  const handleUploadResume = () => {
    alert('File upload feature - would open file picker for resume/cover letter')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500">Track internships and roles with templates ready.</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
          >
            Add Application
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUploadResume}
            className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all font-medium"
          >
            Upload Resume/Cover
          </motion.button>
        </div>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2">Company</th>
              <th className="py-2">Role</th>
              <th className="py-2">Stage</th>
              <th className="py-2">Notes</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {applications.map(app => (
              <motion.tr
                key={app.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: 'rgba(148, 163, 184, 0.05)' }}
                className="text-slate-800 cursor-pointer"
                onClick={() => handleEditApplication(app)}
              >
                <td className="py-3 font-medium">{app.company}</td>
                <td className="py-3">{app.role}</td>
                <td className="py-3">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 font-medium">{app.stage}</span>
                </td>
                <td className="py-3 text-slate-600">{app.notes}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditApplication(app) }}
                      className="text-xs px-2 py-1 rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteApplication(app.id) }}
                      className="text-xs px-2 py-1 rounded-lg border border-red-200 hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Application Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Application" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              value={appForm.company}
              onChange={(e) => setAppForm({ ...appForm, company: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g., Acme Labs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role/Position</label>
            <input
              type="text"
              value={appForm.role}
              onChange={(e) => setAppForm({ ...appForm, role: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g., Frontend Developer Intern"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application Stage</label>
            <select
              value={appForm.stage}
              onChange={(e) => setAppForm({ ...appForm, stage: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={appForm.notes}
              onChange={(e) => setAppForm({ ...appForm, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Any notes about this application..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddApplication}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Add Application
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Application Modal */}
      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingApp(null) }} title="Edit Application" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              value={appForm.company}
              onChange={(e) => setAppForm({ ...appForm, company: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role/Position</label>
            <input
              type="text"
              value={appForm.role}
              onChange={(e) => setAppForm({ ...appForm, role: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application Stage</label>
            <select
              value={appForm.stage}
              onChange={(e) => setAppForm({ ...appForm, stage: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={appForm.notes}
              onChange={(e) => setAppForm({ ...appForm, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => { setShowEditModal(false); setEditingApp(null) }}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

