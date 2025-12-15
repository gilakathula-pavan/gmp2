import React from 'react'

const resources = [
  { title: 'React Docs', category: 'Frontend', link: 'https://react.dev' },
  { title: 'freeCodeCamp', category: 'Practice', link: 'https://freecodecamp.org' },
  { title: 'Figma Community', category: 'Design', link: 'https://www.figma.com/community' },
]

export default function Resources(){
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Resources Hub</h1>
          <p className="text-sm text-slate-500">Curated links and learning materials.</p>
        </div>
        <button className="text-sm px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-200 hover:text-indigo-700">
          Add Bookmark
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {resources.map(res => (
          <a
            key={res.title}
            href={res.link}
            className="block bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:border-indigo-200 hover:shadow"
          >
            <div className="text-xs text-indigo-600 font-medium">{res.category}</div>
            <div className="text-lg font-semibold text-slate-900 mt-1">{res.title}</div>
            <div className="text-sm text-slate-500 mt-2">Bookmark • Open</div>
          </a>
        ))}
      </div>
    </div>
  )
}

