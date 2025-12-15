import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import Overview from '../dashboard/pages/Overview'
import Courses from '../dashboard/pages/Courses'
import Profile from '../dashboard/pages/Profile'
import Attendance from '../dashboard/pages/Attendance'
import Projects from '../dashboard/pages/Projects'
import Updates from '../dashboard/pages/Updates'
import Applications from '../dashboard/pages/Applications'
import Team from '../dashboard/pages/Team'
import Analytics from '../dashboard/pages/Analytics'
import Resources from '../dashboard/pages/Resources'
import ProtectedRoute from './ProtectedRoute'

function Landing(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-3xl font-bold">Grahmind InternStudio</h1>
        <p className="text-gray-600">Marketing landing placeholder. <a href="#/dashboard" className="text-blue-600">Open dashboard</a></p>
      </div>
    </div>
  )
}

export default function AppRoutes(){
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}>
          <Route index element={<Overview/>} />
          <Route path="courses" element={<Courses/>} />
          <Route path="projects" element={<Projects/>} />
          <Route path="updates" element={<Updates/>} />
          <Route path="attendance" element={<Attendance/>} />
          <Route path="applications" element={<Applications/>} />
          <Route path="team" element={<Team/>} />
          <Route path="analytics" element={<Analytics/>} />
          <Route path="resources" element={<Resources/>} />
          <Route path="profile" element={<Profile/>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

