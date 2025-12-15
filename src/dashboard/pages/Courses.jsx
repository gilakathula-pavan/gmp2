import React from 'react'
import Card from '../../components/ui/Card'
import reactLogo from '../../assets/react-logo.svg'
import cssLogo from '../../assets/css-logo.svg'

export default function Courses(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <img src={reactLogo} alt="React" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            <div>
              <div className="font-medium">React Basics</div>
              <div className="text-sm text-gray-500">Instructor: Jane Doe</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <img src={cssLogo} alt="Advanced CSS" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            <div>
              <div className="font-medium">Advanced CSS</div>
              <div className="text-sm text-gray-500">Instructor: John Smith</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
