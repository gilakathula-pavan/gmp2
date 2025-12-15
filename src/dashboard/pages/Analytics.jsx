import React from 'react'

export default function Analytics(){
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">Progress over time, attendance, and skill growth.</p>
        </div>
        <button className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Export CSV</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-64 flex items-center justify-center text-slate-500">
          Line chart placeholder (Chart.js) — updates vs time
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-64 flex items-center justify-center text-slate-500">
          Donut chart placeholder — attendance
        </div>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Suggested Skills</h2>
        <div className="flex flex-wrap gap-2">
          {['Docker', 'System Design basics', 'Testing', 'Storybook'].map(skill => (
            <span key={skill} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

