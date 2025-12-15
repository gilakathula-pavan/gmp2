import React, { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import Modal from '../../components/ui/Modal'
import { AuthContext } from '../../contexts/AuthContext'
import backend from '../../services/mockBackend'

const projects = [
  {
    id: 'p1',
    title: 'Portfolio Revamp',
    description: 'Modern UI for personal site with case studies.',
    stack: ['Next.js', 'Tailwind', 'Vercel'],
    status: 'In Progress',
    progress: 70,
    updates: ['Deployed preview', 'Added blog section', 'Hooked analytics'],
  },
  {
    id: 'p2',
    title: 'ML Internship Prep',
    description: 'Study plan and notebooks for internship screening.',
    stack: ['Python', 'Pandas', 'Sklearn'],
    status: 'Completed',
    progress: 100,
    updates: ['Finished EDA module', 'Model performance baseline'],
  },
]

export default function Projects() {
  const { user, updateProfile, pushToProfileArray } = useContext(AuthContext)
  const initial = user?.profile?.projects || [
    {
      id: 'p1',
      title: 'Portfolio Revamp',
      description: 'Modern UI for personal site with case studies.',
      stack: ['Next.js', 'Tailwind', 'Vercel'],
      status: 'In Progress',
      progress: 70,
      updates: ['Deployed preview', 'Added blog section', 'Hooked analytics'],
    },
    {
      id: 'p2',
      title: 'ML Internship Prep',
      description: 'Study plan and notebooks for internship screening.',
      stack: ['Python', 'Pandas', 'Sklearn'],
      status: 'Completed',
      progress: 100,
      updates: ['Finished EDA module', 'Model performance baseline'],
    },
  ]
  const [projects, setProjects] = useState(initial)
  useEffect(() => {
    setProjects(user?.profile?.projects || initial)
  }, [user?.profile?.projects])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectForm, setProjectForm] = useState({ title: '', description: '', stack: '', status: 'In Progress', progress: 0 })

  const handleAddProject = () => {
    const newProject = {
      id: `p${Date.now()}`,
      ...projectForm,
      stack: projectForm.stack.split(',').map(s => s.trim()).filter(Boolean),
      updates: [],
    }
    ;(async () => {
      try {
        const updated = await backend.addProject(newProject)
        setProjects(updated)
        updateProfile({ projects: updated })
        setShowAddModal(false)
        setProjectForm({ title: '', description: '', stack: '', status: 'In Progress', progress: 0 })
        alert('Project added successfully!')
      } catch (err) {
        console.error(err)
        alert('Failed to add project')
      }
    })()
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      description: project.description,
      stack: project.stack.join(', '),
      status: project.status,
      progress: project.progress,
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    ;(async () => {
      try {
        const updated = projects.map(p => 
          p.id === editingProject.id 
            ? { ...p, ...projectForm, stack: projectForm.stack.split(',').map(s => s.trim()).filter(Boolean) }
            : p
        )
        await backend.updateProjects(updated)
        setProjects(updated)
        updateProfile({ projects: updated })
        setShowEditModal(false)
        setEditingProject(null)
        alert('Project updated successfully!')
      } catch (err) {
        console.error(err)
        alert('Failed to update project')
      }
    })()
  }

  const handleDeleteProject = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      ;(async () => {
        try {
          const updated = projects.filter(p => p.id !== id)
          await backend.updateProjects(updated)
          setProjects(updated)
          updateProfile({ projects: updated })
          alert('Project deleted successfully!')
        } catch (err) {
          console.error(err)
          alert('Failed to delete project')
        }
      })()
    }
  }

  const handleGeneratePDF = () => {
    alert('Generating portfolio PDF... This would typically download a PDF file.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects & Portfolio</h1>
          <p className="text-sm text-slate-500">Track builds, status, and export portfolio.</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
          >
            Add Project
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGeneratePDF}
            className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all font-medium"
          >
            Generate PDF
          </motion.button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
                <p className="text-sm text-slate-600">{p.description}</p>
              </div>
              <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 font-medium">{p.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditProject(p)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
              >
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteProject(p.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-all font-medium"
              >
                Delete
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              {p.stack.map(s => (
                <span key={s} className="px-2 py-1 bg-slate-100 rounded-full">{s}</span>
              ))}
            </div>
            <div className="space-y-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: `${p.progress}%` }} />
              </div>
              <div className="text-xs text-slate-500">{p.progress}% complete</div>
            </div>
            <div className="text-sm text-slate-700 space-y-1">
              <div className="font-medium text-slate-900">Recent updates</div>
              <ul className="list-disc list-inside space-y-1">
                {p.updates.map((u, i) => <li key={i}>{u}</li>)}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Project Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Project" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g., Portfolio Revamp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Describe your project..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack (comma-separated)</label>
            <input
              type="text"
              value={projectForm.stack}
              onChange={(e) => setProjectForm({ ...projectForm, stack: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="React, TypeScript, Tailwind"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={projectForm.progress}
                onChange={(e) => setProjectForm({ ...projectForm, progress: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProject}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Add Project
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingProject(null) }} title="Edit Project" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack (comma-separated)</label>
            <input
              type="text"
              value={projectForm.stack}
              onChange={(e) => setProjectForm({ ...projectForm, stack: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={projectForm.progress}
                onChange={(e) => setProjectForm({ ...projectForm, progress: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => { setShowEditModal(false); setEditingProject(null) }}
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

