import React from 'react'

export default function Button({children, className = '', ...props}){
  return (
    <button
      className={"inline-flex items-center px-4 py-2 brand-bg text-white rounded-md hover:opacity-90 focus:outline-none " + className}
      {...props}
    >
      {children}
    </button>
  )
}
