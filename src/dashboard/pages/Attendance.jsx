import React, { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import Modal from '../../components/ui/Modal'
import { AuthContext } from '../../contexts/AuthContext'
import backend from '../../services/mockBackend'

const rows = [
  { date: '2025-12-08', session: 'Web Dev Training', duration: '2h', status: 'Present' },
  { date: '2025-12-07', session: 'Team Standup', duration: '1h', status: 'Present' },
  { date: '2025-12-06', session: 'Workshop', duration: '3h', status: 'Late' },
]

const statusColor = {
  Present: 'bg-emerald-50 text-emerald-700',
  Absent: 'bg-rose-50 text-rose-700',
  Late: 'bg-amber-50 text-amber-700',
}

export default function Attendance(){
  const { user, updateProfile, pushToProfileArray } = useContext(AuthContext)
  const initial = user?.profile?.attendance || [
    { id: 'a1', date: '2025-12-08', session: 'Web Dev Training', duration: '2h', status: 'Present' },
    { id: 'a2', date: '2025-12-07', session: 'Team Standup', duration: '1h', status: 'Present' },
    { id: 'a3', date: '2025-12-06', session: 'Workshop', duration: '3h', status: 'Late' },
  ]
  const [rows, setRows] = useState(initial)
  useEffect(() => {
    setRows(user?.profile?.attendance || initial)
  }, [user?.profile?.attendance])
  const [showMarkModal, setShowMarkModal] = useState(false)
  const [attendanceForm, setAttendanceForm] = useState({ date: '', session: '', duration: '', status: 'Present' })

  const handleMarkAttendance = () => {
    const newEntry = {
      id: `a${Date.now()}`,
      ...attendanceForm,
    }
    ;(async () => {
      try {
        const updated = await backend.addAttendance(newEntry)
        setRows(updated)
        updateProfile({ attendance: updated })
        setShowMarkModal(false)
        setAttendanceForm({ date: '', session: '', duration: '', status: 'Present' })
        alert('Attendance marked successfully!')
      } catch (err) {
        console.error(err)
        alert('Failed to mark attendance')
      }
    })()
  }

  const handleSetReminder = () => {
    ;(async () => {
      try {
        await backend.setSetting('remindersSet', true)
        updateProfile({ remindersSet: true })
        alert('Reminder set! You will be notified before upcoming sessions.')
      } catch (err) {
        console.error(err)
        alert('Failed to set reminder')
      }
    })()
  }

  const handleDeleteEntry = (id) => {
    if (confirm('Are you sure you want to delete this attendance entry?')) {
      ;(async () => {
        try {
          const updated = rows.filter(r => r.id !== id)
          await backend.updateAttendance(updated)
          setRows(updated)
          updateProfile({ attendance: updated })
          alert('Entry deleted successfully!')
        } catch (err) {
          console.error(err)
          alert('Failed to delete attendance entry')
        }
      })()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attendance & Training</h1>
          <p className="text-sm text-slate-500">Calendar view, streaks, and session log.</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMarkModal(true)}
            className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all font-medium"
          >
            Mark Attendance
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSetReminder}
            className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all font-medium"
          >
            Set Reminder
          </motion.button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-500">Current Streak</div>
              <div className="text-3xl font-semibold text-slate-900">7 days</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Attendance Rate</div>
              <div className="text-3xl font-semibold text-emerald-600">92%</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Date</th>
                  <th className="py-2">Session</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map(r => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(148, 163, 184, 0.05)' }}
                    className="text-slate-700"
                  >
                    <td className="py-3">{r.date}</td>
                    <td className="py-3 font-medium">{r.session}</td>
                    <td className="py-3">{r.duration}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[r.status]}`}>
                          {r.status}
                        </span>
                        <button
                          onClick={() => handleDeleteEntry(r.id)}
                          className="text-red-600 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition"
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
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="text-lg font-semibold text-slate-900">Calendar</div>
          <p className="text-sm text-slate-500">Integrate FullCalendar or heatmap here.</p>
          <div className="grid grid-cols-7 gap-2 text-xs text-center text-slate-600">
            {Array.from({ length: 28 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-10 rounded-lg flex items-center justify-center ${
                  idx % 5 === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500">Color-coded days for presence/absence.</div>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      <Modal isOpen={showMarkModal} onClose={() => setShowMarkModal(false)} title="Mark Attendance" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={attendanceForm.date}
              onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Session Type</label>
            <input
              type="text"
              value={attendanceForm.session}
              onChange={(e) => setAttendanceForm({ ...attendanceForm, session: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g., Web Dev Training"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={attendanceForm.duration}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, duration: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="e.g., 2h"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={attendanceForm.status}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowMarkModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleMarkAttendance}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Mark Attendance
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
