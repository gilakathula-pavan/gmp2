import React from 'react'
import raviAvatar from '../../assets/ravi-teja.svg'
import pranayAvatar from '../../assets/pranay.svg'

const members = [
  { id: 't1', name: 'Asha Kumar', role: 'Frontend Intern', email: 'asha@example.com', skills: ['React', 'UI/UX'], availability: 'Today · 2-6 PM', avatar: 'https://i.pravatar.cc/80?img=5' },
  { id: 't2', name: 'Ravi Teja', role: 'Backend Intern', email: 'raviteja@example.com', skills: ['Node.js', 'MongoDB'], availability: 'Today · 4-8 PM', avatar: raviAvatar },
  { id: 't3', name: 'Meera Shah', role: 'Data/ML Intern', email: 'meera@example.com', skills: ['Python', 'Pandas'], availability: 'Tomorrow · 10-2 PM', avatar: 'https://i.pravatar.cc/80?img=15' },
  { id: 't4', name: 'Pranay', role: 'Product Designer', email: 'pranay@example.com', skills: ['Figma', 'Design Systems'], availability: 'Tomorrow · 1-5 PM', avatar: pranayAvatar },
]

  const squads = [
  { name: 'Portfolio Revamp', members: ['Asha', 'Meera', 'Pranay'], status: 'In Progress' },
  { name: 'ML Internship Prep', members: ['Meera', 'Ravi Teja'], status: 'Active' },
]

export default function Team(){
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Team</h1>
          <p className="text-sm text-slate-500">View batch members, roles, and availability.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              const newMember = { id: `m${Date.now()}`, name: 'New Member', role: 'TBD', email: 'new@example.com', skills: [], availability: 'TBD', avatar: '' }
              try {
                await (await import('../../services/mockBackend')).default.inviteMember(newMember)
                alert('Invitation sent (mock)')
              } catch (err) {
                console.error(err)
                alert('Failed to invite member')
              }
            }}
            className="text-sm px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-200 hover:text-indigo-700"
          >
            Invite Member
          </button>
          <button
            onClick={async () => {
              // create a simple squad and store in backend settings
              try {
                const db = await (await import('../../services/mockBackend')).default.initFromProfile({})
                alert('Squad created (mock)')
              } catch (err) {
                console.error(err)
                alert('Failed to create squad')
              }
            }}
            className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Create Squad
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Squads / Projects</h2>
          <button className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 hover:text-indigo-700">Manage</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {squads.map(s => (
            <div key={s.name} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-500">Members: {s.members.join(', ')}</div>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map(m => (
          <div key={m.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
              <div>
                <div className="font-semibold text-slate-900">{m.name}</div>
                <div className="text-sm text-slate-500">{m.role}</div>
                <div className="text-xs text-indigo-600">{m.email}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              {m.skills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-slate-100 rounded-full">{skill}</span>
              ))}
            </div>
            <div className="text-xs text-emerald-600">Availability: {m.availability}</div>
            <div className="flex gap-2">
              <button className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-200 hover:text-indigo-700">Message</button>
              <button className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Assign</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

