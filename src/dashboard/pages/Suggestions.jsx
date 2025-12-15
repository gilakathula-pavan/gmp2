import React from 'react'
import Card from '../../components/ui/Card'

export default function Suggestions(){
  const items = [
    { id: 1, title: 'Advanced React', reason: 'Based on your progress in React Basics' },
    { id: 2, title: 'Design Systems', reason: 'Improve UI skills' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Suggestions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(i => (
          <Card key={i.id}>
            <div className="font-medium">{i.title}</div>
            <div className="text-sm text-gray-500">{i.reason}</div>
            <div className="mt-3">
              <a className="text-blue-600">View course</a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
