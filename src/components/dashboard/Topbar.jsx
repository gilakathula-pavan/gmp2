import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '../../contexts/AuthContext'

export default function Topbar(){
  const { user, logout } = useContext(AuthContext)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-16 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 shadow-sm sticky top-0 z-40"
    >
      <motion.div
        className="flex items-center gap-3 text-sm"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative hidden sm:flex items-center">
          <span className="absolute left-3 text-slate-400">🔍</span>
          <input
            placeholder="Search courses, projects..."
            className="pl-10 pr-4 py-2.5 w-72 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-grahmind-teal focus:ring-2 focus:ring-grahmind-teal/30 transition-all text-sm text-gray-700 placeholder-gray-500 font-medium"
          />
        </div>
      </motion.div>
      
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <span className="text-gray-600 text-lg">🔔</span>
          <motion.span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-grahmind-red rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.button>
        
        <motion.div
          className="hidden sm:flex flex-col text-right leading-tight cursor-pointer"
          onClick={() => navigate('/dashboard/profile')}
          whileHover={{ x: -2 }}
        >
          <span className="text-sm font-semibold text-gray-900">{user.name}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </motion.div>
        
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-xl object-cover border-2 border-gray-200 cursor-pointer shadow-sm hover:border-grahmind-teal transition-colors"
            onClick={() => navigate('/dashboard/profile')}
          />
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-grahmind-green rounded-full border-2 border-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              logout()
              alert('Logged out successfully!')
              window.location.href = '/'
            }
          }}
          className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:border-rose-200 hover:text-rose-700 hover:bg-rose-50 transition-all font-medium"
        >
          Logout
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-4 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50"
          >
            <div className="text-sm font-semibold text-slate-900 mb-3">Notifications</div>
            <div className="text-sm text-slate-500">No new notifications</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
