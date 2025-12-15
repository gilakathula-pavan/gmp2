/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'grahmind-red': '#EA4335',
        'grahmind-orange': '#FBBC05',
        'grahmind-green': '#34A853',
        'grahmind-teal': '#00A66F',
        'grahmind-blue': '#4285F4',
        'grahmind-sky': '#4EC3F7',
        'grahmind-purple': '#A142F4',
        'grahmind-magenta': '#C53DFF',
        // convenience semantic names
        primary: '#4285F4',
        accent: '#A142F4',
        success: '#34A853',
        warning: '#FBBC05',
        danger: '#EA4335'
      }
    }
  },
  plugins: []
}
