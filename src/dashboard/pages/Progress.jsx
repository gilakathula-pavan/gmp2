import React from 'react'
import Card from '../../components/ui/Card'

export default function Progress(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Progress</h1>
      <Card>
        <div className="text-sm text-gray-500">Overall completion</div>
        <div className="mt-2 h-4 bg-gray-200 rounded">
          <div className="h-4 bg-green-500 rounded" style={{width: '72%'}}></div>
        </div>
      </Card>
    </div>
  )
}
