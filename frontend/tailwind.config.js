/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#F0F7FF',
          100: '#D6E9FF',
          200: '#B5D8FA',
          300: '#8FC4F0',
          400: '#4BB4DE',
          500: '#3B8AC4',
          600: '#345DA7',
          700: '#2A4A8A',
          800: '#1F3A6E',
          900: '#150734',
        },
        sand: {
          50: '#FDF8F5',
          100: '#F5EDE5',
          200: '#EFDBCB',
          300: '#E5C9B5',
          400: '#D4B49A',
        },
        sky: {
          300: '#63BCE5',
          400: '#7ED5EA',
        },
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #150734 0%, #0F2557 25%, #345DA7 50%, #3B8AC4 75%, #4BB4DE 100%)',
        'ocean-wave': 'linear-gradient(135deg, #345DA7 0%, #3B8AC4 30%, #4BB4DE 60%, #63BCE5 80%, #7ED5EA 100%)',
        'sandy-shore': 'linear-gradient(135deg, #EFDBCB 0%, #F5EDE5 50%, #FDF8F5 100%)',
        'ocean-card': 'linear-gradient(135deg, rgba(52, 93, 167, 0.15), rgba(59, 138, 196, 0.10), rgba(75, 180, 222, 0.05))',
        'ocean-glow': 'radial-gradient(circle at 50% 50%, rgba(75, 180, 222, 0.3), transparent 70%)',
      },
      boxShadow: {
        'ocean': '0 8px 32px rgba(52, 93, 167, 0.3)',
        'ocean-lg': '0 16px 64px rgba(52, 93, 167, 0.4)',
        'ocean-glow': '0 0 60px rgba(75, 180, 222, 0.2)',
      },
      animation: {
        'wave': 'wave 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'tide': 'tide 4s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(20px)' },
        },
        tide: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.02) rotate(1deg)' },
          '75%': { transform: 'scale(0.98) rotate(-1deg)' },
        },
      },
    },
  },
  plugins: [],
}