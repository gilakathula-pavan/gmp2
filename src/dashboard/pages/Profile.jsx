import React, { useState } from 'react'
import { useContext } from 'react'
import { motion } from 'framer-motion'
import { AuthContext } from '../../contexts/AuthContext'
import PremiumCard from '../../components/ui/PremiumCard'
import Modal from '../../components/ui/Modal'
import backend from '../../services/mockBackend'

const profileData = {
  phone: '999999999',
  location: 'Hyderabad, India',
  emergencyContact: '999999999',
  dob: '2003-04-14',
  role: 'Frontend Developer Intern',
  department: 'Product Engineering',
  traineeId: 'INT-2045',
  joined: '2025-09-01',
  status: 'Active',
  summary: 'Building accessible web apps; focused on UI systems and performance.',
  currentProject: {
    name: 'Portfolio Revamp',
    title: 'Candidate Experience Portal',
    role: 'Frontend Intern',
    responsibilities: ['Build UI components', 'Integrate auth flows', 'Add analytics events'],
    progress: 72,
  },
  previous: [
    { title: 'API Docs Refresh', status: 'Completed' },
    { title: 'Design System Tokens', status: 'Completed' },
    { title: 'Accessibility Sweep', status: 'In Review' },
  ],
  skills: {
    technical: [
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 80 },
      { name: 'Tailwind', level: 85 },
      { name: 'Node.js', level: 65 },
    ],
    soft: [
      { name: 'Communication', level: 85 },
      { name: 'Collaboration', level: 90 },
      { name: 'Time Management', level: 80 },
      { name: 'Problem Solving', level: 82 },
    ],
  },
  activity: {
    daysActive: 76,
    attendanceRate: '92%',
    streak: '7 days',
    lastUpdate: 'Dec 8, 2025 · 5:45 PM',
    weeklyHours: '11.5 hrs',
  },
  links: {
    linkedin: 'https://linkedin.com/in/ashak',
    github: 'https://github.com/ashak',
    portfolio: 'https://asha.dev',
    resume: '#',
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Profile(){
  const { user, setUser, updateProfile } = useContext(AuthContext)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)
  const [showLinksModal, setShowLinksModal] = useState(false)
  // merge default profileData constants with user.profile from context
  const mergedProfile = { ...profileData, ...(user.profile || {}) }

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: mergedProfile.phone,
    location: mergedProfile.location,
    emergencyContact: mergedProfile.emergencyContact,
    dob: mergedProfile.dob,
    cgpa: mergedProfile.cgpa,
  })
  const [skills, setSkills] = useState(profileData.skills)
  const [links, setLinks] = useState(profileData.links)

  const handleSaveProfile = () => {
    ;(async () => {
      try {
        const updatedProfile = await backend.saveProfile({
          phone: formData.phone,
          location: formData.location,
          emergencyContact: formData.emergencyContact,
          dob: formData.dob,
          cgpa: formData.cgpa,
        })
        setUser(prev => ({ ...prev, name: formData.name, email: formData.email, profile: updatedProfile }))
        alert('Profile updated successfully!')
        setShowEditModal(false)
      } catch (err) {
        console.error(err)
        alert('Failed to save profile')
      }
    })()
  }

  const handleSaveSkills = () => {
    ;(async () => {
      try {
        const updated = await backend.saveProfile({ skills })
        setUser(prev => ({ ...prev, profile: updated }))
        updateProfile({ skills: updated.skills })
        alert('Skills updated successfully!')
        setShowSkillsModal(false)
      } catch (err) {
        console.error(err)
        alert('Failed to save skills')
      }
    })()
  }

  const handleSaveLinks = () => {
    ;(async () => {
      try {
        const updated = await backend.saveProfile({ links })
        setUser(prev => ({ ...prev, profile: updated }))
        updateProfile({ links: updated.links })
        alert('Links updated successfully!')
        setShowLinksModal(false)
      } catch (err) {
        console.error(err)
        alert('Failed to save links')
      }
    })()
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.header variants={fadeUp} className="flex flex-col gap-2">
        <p className="text-sm text-slate-500 font-medium">Recruiter-ready profile</p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>
      </motion.header>

      {/* Personal & Contact Information */}
      <PremiumCard delay={0.1}>
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex items-center gap-3">
            <motion.img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditModal(true)}
              className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
            >
              Edit Profile
            </motion.button>
          </div>

          {/* Graduation / CGPA box */}
          <div className="hidden md:block md:w-56">
            <div className="rounded-xl p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500">Graduation</div>
              <div className="text-lg font-semibold mt-2">2025 · CS · CGPA {mergedProfile.cgpa || '—'}</div>
            </div>
          </div>

          <div className="flex-1 grid gap-3 md:grid-cols-2 text-sm text-slate-700">
            <div>
                <div className="text-xs text-slate-500">Full Name</div>
                <div className="font-semibold text-slate-900">{user.name}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Email</div>
              <div className="font-semibold text-slate-900">{user.email}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Phone</div>
              <div>{mergedProfile.phone}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Location</div>
              <div>{mergedProfile.location}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Emergency Contact</div>
              <div>{mergedProfile.emergencyContact}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Date of Birth</div>
              <div>{mergedProfile.dob}</div>
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* Professional Identity */}
      <PremiumCard delay={0.15}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Professional Identity</h2>
          <motion.span
            className="px-3 py-1.5 text-xs rounded-full bg-emerald-50 text-emerald-700 font-medium shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            {profileData.status}
          </motion.span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-700">
          <Info label="Role / Position" value={profileData.role} />
          <Info label="Department / Team" value={profileData.department} />
          <Info label="Trainee ID" value={profileData.traineeId} />
          <Info label="Joined Date" value={profileData.joined} />
          <Info label="Current Status" value={profileData.status} />
          <Info label="Summary" value={profileData.summary} full />
        </div>
      </PremiumCard>

      {/* Work & Training Details */}
      <PremiumCard delay={0.2} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Work & Training</h2>
          <span className="text-xs text-slate-500">Live project assignment</span>
        </div>
        <div className="border border-slate-100 rounded-xl p-4">
          <div className="text-sm text-slate-500">Current Project Assigned</div>
          <div className="text-base font-semibold text-slate-900">{profileData.currentProject.name}</div>
          <div className="mt-2 grid gap-2 md:grid-cols-2 text-sm text-slate-700">
            <Info label="Project Title" value={profileData.currentProject.title} />
            <Info label="Your Role" value={profileData.currentProject.role} />
          </div>
          <div className="mt-3">
            <div className="text-xs text-slate-500 mb-1">Responsibilities</div>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              {profileData.currentProject.responsibilities.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Progress</span>
              <span>{profileData.currentProject.progress}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${profileData.currentProject.progress}%` }}
                transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900 mb-2">Previous Projects / Training Tasks</div>
          <div className="grid gap-2 md:grid-cols-3">
            {profileData.previous.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="border border-slate-100 rounded-xl p-3 text-sm text-slate-700 flex items-center justify-between bg-gradient-to-br from-white to-slate-50/50 hover:shadow-md transition-all cursor-pointer"
              >
                <span className="font-medium">{p.title}</span>
                <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-700 font-medium">{p.status}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </PremiumCard>

      {/* Skills Breakdown */}
      <PremiumCard delay={0.25} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSkillsModal(true)}
            className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
          >
            Add / Update Skills
          </motion.button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SkillGroup title="Technical Skills" skills={profileData.skills.technical} />
          <SkillGroup title="Soft Skills" skills={profileData.skills.soft} />
        </div>
      </PremiumCard>

      {/* Real-Time Activity & Updates */}
      <PremiumCard delay={0.3}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Real-Time Activity & Updates</h2>
          <motion.span
            className="text-xs text-slate-500 flex items-center gap-1"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Auto-refresh
          </motion.span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Days Active', value: profileData.activity.daysActive },
            { label: 'Attendance Rate', value: profileData.activity.attendanceRate, accent: true },
            { label: 'Current Streak', value: profileData.activity.streak },
            { label: 'Last Update Logged', value: profileData.activity.lastUpdate },
            { label: 'Weekly Activity', value: profileData.activity.weeklyHours },
          ].map((stat, idx) => (
            <Stat key={stat.label} label={stat.label} value={stat.value} accent={stat.accent} delay={idx * 0.05} />
          ))}
        </div>
      </PremiumCard>

      {/* Social & Professional Links */}
      <PremiumCard delay={0.35}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Social & Professional Links</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLinksModal(true)}
            className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
          >
            Manage Links
          </motion.button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-slate-700">
          <LinkRow label="LinkedIn" value={profileData.links.linkedin} />
          <LinkRow label="GitHub" value={profileData.links.github} />
          <LinkRow label="Portfolio" value={profileData.links.portfolio} />
          <LinkRow label="Resume" value={profileData.links.resume} action="Download / Upload" />
        </div>
      </PremiumCard>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact</label>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Skills Modal */}
      <Modal isOpen={showSkillsModal} onClose={() => setShowSkillsModal(false)} title="Update Skills" size="lg">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Technical Skills</h3>
            <div className="space-y-3">
              {skills.technical.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const newSkills = { ...skills }
                      newSkills.technical[idx].name = e.target.value
                      setSkills(newSkills)
                    }}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) => {
                      const newSkills = { ...skills }
                      newSkills.technical[idx].level = parseInt(e.target.value) || 0
                      setSkills(newSkills)
                    }}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <span className="text-sm text-slate-500">%</span>
                  <button
                    onClick={() => {
                      const newSkills = { ...skills }
                      newSkills.technical = newSkills.technical.filter((_, i) => i !== idx)
                      setSkills(newSkills)
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newSkills = { ...skills }
                  newSkills.technical.push({ name: '', level: 0 })
                  setSkills(newSkills)
                }}
                className="w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-400 hover:text-indigo-700 transition text-sm font-medium"
              >
                + Add Technical Skill
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Soft Skills</h3>
            <div className="space-y-3">
              {skills.soft.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const newSkills = { ...skills }
                      newSkills.soft[idx].name = e.target.value
                      setSkills(newSkills)
                    }}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) => {
                      const newSkills = { ...skills }
                      newSkills.soft[idx].level = parseInt(e.target.value) || 0
                      setSkills(newSkills)
                    }}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <span className="text-sm text-slate-500">%</span>
                  <button
                    onClick={() => {
                      const newSkills = { ...skills }
                      newSkills.soft = newSkills.soft.filter((_, i) => i !== idx)
                      setSkills(newSkills)
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newSkills = { ...skills }
                  newSkills.soft.push({ name: '', level: 0 })
                  setSkills(newSkills)
                }}
                className="w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-400 hover:text-indigo-700 transition text-sm font-medium"
              >
                + Add Soft Skill
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowSkillsModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSkills}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Save Skills
            </button>
          </div>
        </div>
      </Modal>

      {/* Links Modal */}
      <Modal isOpen={showLinksModal} onClose={() => setShowLinksModal(false)} title="Manage Links" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
            <input
              type="url"
              value={links.linkedin}
              onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">GitHub</label>
            <input
              type="url"
              value={links.github}
              onChange={(e) => setLinks({ ...links, github: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio Website</label>
            <input
              type="url"
              value={links.portfolio}
              onChange={(e) => setLinks({ ...links, portfolio: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="https://yourportfolio.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resume</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={links.resume}
                onChange={(e) => setLinks({ ...links, resume: e.target.value })}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Resume URL or file path"
              />
              <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm">
                Upload
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowLinksModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveLinks}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Save Links
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}

function Info({ label, value, full = false }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm text-slate-800">{value}</div>
    </div>
  )
}

function SkillGroup({ title, skills }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-slate-100 rounded-xl p-4 space-y-3 bg-gradient-to-br from-white to-slate-50/30"
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="space-y-3">
        {skills.map((skill, idx) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span className="font-medium">{skill.name}</span>
              <span className="font-semibold">{skill.level}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ delay: idx * 0.05 + 0.2, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function Stat({ label, value, accent = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, y: -2 }}
      className={`border border-slate-100 rounded-xl p-4 shadow-sm cursor-pointer transition-all ${
        accent ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : 'bg-white'
      }`}
    >
      <div className="text-xs text-slate-500 font-medium mb-1">{label}</div>
      <div className={`text-xl font-bold ${accent ? 'text-indigo-700' : 'text-slate-900'}`}>
        {value}
      </div>
    </motion.div>
  )
}

function LinkRow({ label, value, action }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 2 }}
      className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
    >
      <div>
        <div className="text-xs text-slate-500 font-medium mb-1">{label}</div>
        <a href={value} className="text-sm text-indigo-700 hover:text-indigo-800 font-medium truncate block">
          {value}
        </a>
      </div>
      {action && (
        <motion.span
          whileHover={{ scale: 1.1 }}
          className="text-xs text-slate-500 font-medium"
        >
          {action}
        </motion.span>
      )}
    </motion.div>
  )
}
