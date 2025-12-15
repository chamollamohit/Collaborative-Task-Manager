/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Option C: Energetic Teal
                primary: {
                    DEFAULT: '#0d9488', // teal-600
                    hover: '#0f766e',   // teal-700
                    light: '#f0fdfa',   // teal-50 (for subtle backgrounds)
                },
                // Neutral Backgrounds (Slate)
                background: '#f8fafc', // slate-50
                surface: '#ffffff',    // white

                // Text Colors
                main: '#0f172a',      // slate-900 (High contrast)
                muted: '#64748b',     // slate-500 (Subtitles)

                // Borders
                border: '#e2e8f0',    // slate-200

                // Status Colors (Hardcoded for Tasks)
                status: {
                    todo: '#64748b',       // slate-500
                    inprogress: '#f59e0b', // amber-500
                    review: '#8b5cf6',     // violet-500
                    completed: '#10b981',  // emerald-500
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'], // Clean modern font
            }
        },
    },
    plugins: [],
}