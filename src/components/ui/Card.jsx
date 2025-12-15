import React from 'react'

export default function Card({children, className = '', variant = 'default'}){
  const variants = {
    default: 'bg-white border border-gray-100',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100',
    colored: 'bg-gradient-to-br from-grahmind-teal/5 to-grahmind-green/5 border border-grahmind-teal/20'
  }
  return (
    <div className={`rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${variants[variant]} ` + className}>
      {children}
    </div>
  )
}
