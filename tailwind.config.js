/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f5f4ef',
        surface: '#ffffff',
        'surface-elevated': '#faf9f5',
        'surface-hover': '#f0eee5',
        border: '#e8e6dc',
        'border-subtle': '#f0eee5',
        'text-primary': '#2b2b2b',
        'text-secondary': '#6b6b6b',
        'text-tertiary': '#9a9a9a',
        accent: '#d97757',
        'accent-hover': '#c4623d',
        'accent-light': '#faf0eb',
        success: '#5a9a3e',
        'success-light': '#f0f7ec',
        warning: '#c08a3e',
        'warning-light': '#faf5ec',
        danger: '#c4503e',
        'danger-light': '#faf0ee',
        info: '#5a8aa8',
        'info-light': '#eef4f8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        'card': '0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
        'elevated': '0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
