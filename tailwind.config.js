/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // MathStudio Vibe Design Language
                'vibe-mint': '#ECFDF5',
                'vibe-mint-dark': '#D1FAE5',
                'vibe-sky': '#E0F2FE',
                'vibe-sky-dark': '#BAE6FD',
                'vibe-orange': '#FFF7ED',
                'vibe-orange-dark': '#FFEDD5',

                // Accent colors for UI elements
                'vibe-accent': '#10B981',       // Emerald for success/approve
                'vibe-primary': '#3B82F6',      // Blue for primary actions
                'vibe-secondary': '#F97316',    // Orange for highlights
                'vibe-purple': '#8B5CF6',       // Purple for special elements

                // Neutral palette
                'vibe-bg': '#F8FAFC',
                'vibe-card': 'rgba(255, 255, 255, 0.85)',
                'vibe-text': '#1E293B',
                'vibe-muted': '#64748B',
            },
            borderRadius: {
                '3xl': '24px',
                '4xl': '32px',
            },
            boxShadow: {
                'vibe': '0 8px 32px rgba(0, 0, 0, 0.06)',
                'vibe-lg': '0 16px 48px rgba(0, 0, 0, 0.08)',
                'vibe-glow': '0 0 40px rgba(59, 130, 246, 0.15)',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'slide-in': 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'bounce-subtle': 'bounceSubtle 0.6s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                bounceSubtle: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '50%': { transform: 'scale(1.02)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
