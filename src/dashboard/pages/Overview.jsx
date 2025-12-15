import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import PremiumCard from '../../components/ui/PremiumCard'
import Modal from '../../components/ui/Modal'
import { AuthContext } from '../../contexts/AuthContext'
import backend from '../../services/mockBackend'

const stats = [
  { label: 'Projects Active', value: '3', hint: '+1 this week', color: 'grahmind-teal' },
  { label: 'Attendance Rate', value: '92%', hint: 'Streak: 7 days', color: 'grahmind-green' },
  { label: 'Skill Updates', value: 'Last week', hint: 'UI/UX, Docker', color: 'grahmind-purple' },
]

const courses = [
  { title: 'React Foundations', progress: 76 },
  { title: 'API Design & Postman', progress: 54 },
  { title: 'Data Viz with D3', progress: 32 },
]

const activities = [
  { title: 'Added auth to portfolio app', date: 'Dec 8' },
  { title: 'Logged daily update', date: 'Dec 7' },
  { title: 'Completed API module quiz', date: 'Dec 6' },
  { title: 'Attended web dev workshop', date: 'Dec 6' },
  { title: 'Updated resume headline', date: 'Dec 5' },
]

const projects = [
  { title: 'Portfolio Revamp', stack: ['Next.js', 'Tailwind'], status: 'In Progress', progress: 70 },
  { title: 'ML Internship Prep', stack: ['Python', 'Pandas'], status: 'Completed', progress: 100 },
  { title: 'UI Case Study', stack: ['Figma'], status: 'In Progress', progress: 45 },
]

const updates = [
  { date: 'Dec 8', did: 'Built dashboard shell', learnings: 'Chart.js hooks' },
  { date: 'Dec 7', did: 'Refined project cards', learnings: 'Better empty states' },
]

const attendance = [
  { date: 'Dec 8', session: 'Web Dev Training', duration: '2h', status: 'Present' },
  { date: 'Dec 7', session: 'Team Standup', duration: '1h', status: 'Present' },
  { date: 'Dec 6', session: 'Workshop', duration: '3h', status: 'Late' },
]

const applications = [
  { company: 'Acme Labs', role: 'Frontend Intern', stage: 'Interviewing' },
  { company: 'Beta Tech', role: 'Product Design Intern', stage: 'Applied' },
]

const skills = ['React', 'TypeScript', 'UI/UX', 'Node.js']

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export default function Overview(){
  const { user, pushToProfileArray, updateProfile } = useContext(AuthContext)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [projectForm, setProjectForm] = useState({ title: '', description: '', stack: '', status: 'In Progress' })
  const [updateForm, setUpdateForm] = useState({ did: '', challenges: '', learnings: '' })
  const [attendanceForm, setAttendanceForm] = useState({ date: '', session: '', duration: '', status: 'Present' })
  const [applicationForm, setApplicationForm] = useState({ company: '', role: '', stage: 'Applied' })

  // Live profile-derived data so edits in Profile reflect immediately here
  const liveProjects = user?.profile?.projects || projects
  const liveUpdates = user?.profile?.updates || updates
  const liveAttendance = user?.profile?.attendance || attendance
  const liveApplications = user?.profile?.applications || applications
  const liveSkills = (user?.profile?.skills && Object.keys(user.profile.skills).length)
    ? [ ...(user.profile.skills.technical || []).map(s => s.name), ...(user.profile.skills.soft || []).map(s => s.name) ]
    : skills

  const handleAddProject = () => {
    const newProject = {
      id: `p${Date.now()}`,
      ...projectForm,
      stack: projectForm.stack.split(',').map(s => s.trim()).filter(Boolean),
      updates: []
    }
    ;(async () => {
      try {
        const updated = await backend.addProject(newProject)
        pushToProfileArray && pushToProfileArray('projects', newProject)
        updateProfile({ projects: updated })
        alert('Project added successfully!')
        setShowProjectModal(false)
        setProjectForm({ title: '', description: '', stack: '', status: 'In Progress' })
      } catch (err) {
        console.error(err)
        alert('Failed to add project')
      }
    })()
  }

  const handleQuickLog = () => {
    const newEntry = {
      id: `u${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...updateForm,
    }
    ;(async () => {
      try {
        const updated = await backend.addUpdate(newEntry)
        pushToProfileArray && pushToProfileArray('updates', newEntry)
        updateProfile({ updates: updated })
        alert('Update logged successfully!')
        setShowUpdateModal(false)
        setUpdateForm({ did: '', challenges: '', learnings: '' })
      } catch (err) {
        console.error(err)
        alert('Failed to log update')
      }
    })()
  }

  const handleMarkAttendance = () => {
    const newEntry = { id: `a${Date.now()}`, ...attendanceForm }
    ;(async () => {
      try {
        const updated = await backend.addAttendance(newEntry)
        pushToProfileArray && pushToProfileArray('attendance', newEntry)
        updateProfile({ attendance: updated })
        alert('Attendance marked successfully!')
        setShowAttendanceModal(false)
        setAttendanceForm({ date: '', session: '', duration: '', status: 'Present' })
      } catch (err) {
        console.error(err)
        alert('Failed to mark attendance')
      }
    })()
  }

  const handleAddApplication = () => {
    const newApp = { id: `app${Date.now()}`, ...applicationForm }
    ;(async () => {
      try {
        const updated = await backend.addApplication(newApp)
        pushToProfileArray && pushToProfileArray('applications', newApp)
        updateProfile({ applications: updated })
        alert('Application added successfully!')
        setShowApplicationModal(false)
        setApplicationForm({ company: '', role: '', stage: 'Applied' })
      } catch (err) {
        console.error(err)
        alert('Failed to add application')
      }
    })()
  }

  const handleGeneratePDF = () => {
    alert('Generating portfolio PDF... This would typically download a PDF file.')
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3"
      >
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-grahmind-teal via-grahmind-blue to-grahmind-green bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">Welcome back! Track your learning progress and achievements</p>
        </div>
      </motion.header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">{s.label}</div>
              <motion.div
                className={`w-3 h-3 rounded-full bg-gradient-to-r from-grahmind-teal to-grahmind-green`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            <motion.div
              className="text-4xl font-black text-gray-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
            >
              {s.value}
            </motion.div>
            <div className={`text-sm font-semibold text-grahmind-teal mt-2 flex items-center gap-1`}>
              <span>↗</span>
              <span>{s.hint}</span>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <PremiumCard delay={0.2}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Profile Snapshot</h2>
                <p className="text-sm text-slate-500">Keep your profile recruiter-ready</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/dashboard/profile'}
                className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
              >
                Edit Profile
              </motion.button>
            </div>
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ x: 2 }}
              >
                  <motion.img
                    src={user?.avatarUrl || 'https://i.pravatar.cc/120?img=5'}
                    alt={user?.name || 'avatar'}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 shadow-sm"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{user?.name || 'Your Name'}</div>
                    <div className="text-sm text-slate-500">{user?.email || 'you@example.com'}</div>
                    <div className="text-xs text-indigo-600 flex items-center gap-2 mt-1">
                      <a href="#" className="hover:underline">LinkedIn</a>
                      <span>·</span>
                      <a href="#" className="hover:underline">GitHub</a>
                    </div>
                  </div>
              </motion.div>
              <div className="flex-1 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <motion.div
                  className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-xs text-slate-500 mb-1">Graduation</div>
                  <div className="font-semibold text-slate-900">2025 · CS · CGPA 3.8</div>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-indigo-50/50 to-white rounded-xl p-4 border border-slate-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-xs text-slate-500 mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {liveSkills.map((skill, idx) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                        className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium cursor-pointer"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard delay={0.3}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Projects & Portfolio</h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProjectModal(true)}
                  className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
                >
                  Add Project
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGeneratePDF}
                  className="text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all font-medium"
                >
                  Generate PDF
                </motion.button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {liveProjects.map((p, idx) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="border border-slate-100 rounded-xl p-4 space-y-3 bg-gradient-to-br from-white to-slate-50/50 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{p.title}</h3>
                    </div>
                    <motion.span
                      className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 font-medium"
                      whileHover={{ scale: 1.1 }}
                    >
                      {p.status}
                    </motion.span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {p.stack.map(s => (
                      <motion.span
                        key={s}
                        whileHover={{ scale: 1.1 }}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full font-medium"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress}%` }}
                        transition={{ delay: idx * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{p.progress}% complete</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard delay={0.4}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Daily / Weekly Updates</h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUpdateModal(true)}
                  className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
                >
                  Quick Log
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { pushToProfileArray && pushToProfileArray('settings', { autosave: true }); alert('Auto-save enabled! Drafts will be saved automatically.') }}
                  className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all font-medium"
                >
                  Auto-save
                </motion.button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {liveUpdates.map((u, idx) => (
                <motion.div
                  key={u.date}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="border border-slate-100 rounded-xl p-4 space-y-2 bg-gradient-to-br from-white to-slate-50/30 hover:shadow-md transition-all"
                >
                  <div className="text-xs text-slate-500 font-medium">{u.date}</div>
                  <div className="text-sm text-slate-800"><strong className="text-slate-900">Did:</strong> {u.did}</div>
                  <div className="text-sm text-slate-700"><strong className="text-slate-900">Learnings:</strong> {u.learnings}</div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="border-2 border-dashed border-indigo-200 rounded-xl p-4 text-sm text-slate-600 flex items-center justify-between bg-indigo-50/30"
              >
                <div>
                  <div className="text-slate-900 font-semibold">Reminder</div>
                  <p className="text-xs text-slate-500">No update in 3+ days. Keep the streak!</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUpdateModal(true)}
                  className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-medium shadow-sm"
                >
                  Log now
                </motion.button>
              </motion.div>
            </div>
          </PremiumCard>
        </div>

        <div className="space-y-6">
          <PremiumCard delay={0.25}>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Course Progress</h2>
            <div className="space-y-4">
              {courses.map((c, idx) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="flex justify-between text-sm text-slate-700 mb-2">
                    <span className="font-medium">{c.title}</span>
                    <span className="text-slate-500 font-semibold">{c.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${c.progress}%` }}
                      transition={{ delay: idx * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard delay={0.3}>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {activities.map((a, idx) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 group cursor-pointer"
                >
                  <motion.span
                    className="mt-0.5 text-indigo-500 text-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
                  >
                    ●
                  </motion.span>
                  <div className="flex-1">
                    <div className="text-sm text-slate-800 group-hover:text-indigo-700 transition-colors font-medium">{a.title}</div>
                    <div className="text-xs text-slate-500">{a.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard delay={0.35}>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Attendance</h2>
            <div className="space-y-3">
              {liveAttendance.map((a, idx) => (
                <motion.div
                  key={a.date}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="flex items-center justify-between text-sm border border-slate-100 rounded-xl p-3 bg-gradient-to-r from-white to-slate-50/50 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="text-slate-900 font-medium">{a.session}</div>
                    <div className="text-xs text-slate-500">{a.date} · {a.duration}</div>
                  </div>
                  <motion.span
                    className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 font-medium"
                    whileHover={{ scale: 1.1 }}
                  >
                    {a.status}
                  </motion.span>
                </motion.div>
              ))}
              <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                Streak: 7 days · Attendance: 92%
              </div>
            </div>
          </PremiumCard>

          <PremiumCard delay={0.4}>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Applications</h2>
            <div className="space-y-3">
              {liveApplications.map((app, idx) => (
                <motion.div
                  key={app.company}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="flex items-center justify-between text-sm border border-slate-100 rounded-xl p-3 bg-gradient-to-r from-white to-indigo-50/30 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="text-slate-900 font-medium">{app.company}</div>
                    <div className="text-xs text-slate-500">{app.role}</div>
                  </div>
                  <motion.span
                    className="px-2.5 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium"
                    whileHover={{ scale: 1.1 }}
                  >
                    {app.stage}
                  </motion.span>
                </motion.div>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowApplicationModal(true)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
              >
                + Add application
              </motion.button>
            </div>
          </PremiumCard>
        </div>
      </section>

      {/* Add Project Modal */}
      <Modal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} title="Add New Project" size="lg">
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
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowProjectModal(false)}
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

      {/* Quick Log Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Quick Log Update" size="lg">
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
              onClick={() => setShowUpdateModal(false)}
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

      {/* Add Application Modal */}
      <Modal isOpen={showApplicationModal} onClose={() => setShowApplicationModal(false)} title="Add Application" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              value={applicationForm.company}
              onChange={(e) => setApplicationForm({ ...applicationForm, company: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g., Acme Labs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role/Position</label>
            <input
              type="text"
              value={applicationForm.role}
              onChange={(e) => setApplicationForm({ ...applicationForm, role: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g., Frontend Developer Intern"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application Stage</label>
            <select
              value={applicationForm.stage}
              onChange={(e) => setApplicationForm({ ...applicationForm, stage: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowApplicationModal(false)}
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
    </motion.div>
  )
}
