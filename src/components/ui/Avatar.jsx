import React from 'react'

export default function Avatar({src, alt, size = 10, className = ''}){
  const s = `${size}0`; // tailwind size approx
  return (
    <img src={src} alt={alt} className={`rounded-full w-10 h-10 object-cover ${className}`} />
  )
}
