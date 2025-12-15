import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthContext } from '../../contexts/AuthContext'
import gmpLogo from '../../assets/images/gmlogo-removebg-preview.png'

const items = [
  { to: '/dashboard', label: 'Overview', icon: '🏠' },
  { to: '/dashboard/courses', label: 'Courses', icon: '📚' },
  { to: '/dashboard/projects', label: 'Projects', icon: '🗂️' },
  { to: '/dashboard/updates', label: 'Updates Log', icon: '📝' },
  { to: '/dashboard/attendance', label: 'Attendance', icon: '📅' },
  { to: '/dashboard/applications', label: 'Applications', icon: '💼' },
  { to: '/dashboard/team', label: 'Team', icon: '🤝' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
  { to: '/dashboard/resources', label: 'Resources', icon: '🧭' },
  { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
}

export default function Sidebar(){
  const { pathname } = useLocation()
  const { user } = useContext(AuthContext)
  
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:flex w-64 bg-white border-r border-gray-100 min-h-screen shadow-sm"
    >
      <div className="flex flex-col w-full">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 border-b border-gray-100 bg-white"
        >
          <div className="flex items-center gap-2">
            <img src={gmpLogo} alt="Grahmind" className="w-9 h-9 object-contain rounded-sm flex-shrink-0" />
            <div className="flex flex-col items-start justify-center gap-y-0.5">
              <div className="text-xl font-extrabold text-grahmind-teal leading-none">Grahmind</div>
              <div className="text-sm text-gray-500 font-medium tracking-wide leading-none">InternStudio</div>
            </div>
          </div>
        </motion.div>
        
        <nav className="flex-1 px-3 py-4 space-y-1">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-1"
          >
            {items.map((i, idx) => {
              const active = pathname === i.to
              return (
                <motion.div key={i.to} variants={itemVariants}>
                  <Link
                    to={i.to}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group"
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-grahmind-teal/10 to-grahmind-green/10 rounded-xl border border-grahmind-teal/20"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <motion.span
                      className="text-lg relative z-10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      {i.icon}
                    </motion.span>
                    <span
                      className={`relative z-10 font-medium transition-colors ${
                        active
                          ? 'text-grahmind-teal'
                          : 'text-gray-600 group-hover:text-gray-900'
                      }`}
                    >
                      {i.label}
                    </span>
                    {active && (
                      <motion.div
                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-grahmind-teal"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </nav>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 border-t border-gray-100 text-xs text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-grahmind-green animate-pulse" />
            Student Dashboard · v1.0
          </div>
        </motion.div>
      </div>
    </motion.aside>
  )
}
