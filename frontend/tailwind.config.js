/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector',
    content: [
        './index.html',
        './src/*.vue',
        './src/**/*.vue'
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    lightest: '#fAE9DA',
                    light: '#eeb183',
                    DEFAULT: '#e1672e',
                    dark: '#AE3D20',
                    darkest: '#712C1D'
                },
                secondary: {
                    lightest: '#F7EFDD',
                    light: '#E3C48E',
                    DEFAULT: '#CE8D41',
                    dark: '#A05E2E',
                    darkest: '#683F26'
                },
                accent: {
                    lightest: '#f9eaf2',
                    light: '#eeb3ce',
                    DEFAULT: '#d64d8f',
                    dark: '#a82e57',
                    darkest: '#752640'
                },
                neutral: {
                    light: '#fff',
                    dark: '#000',
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#0A0F1A'
                },
                danger: {
                    lightest: '#FEE2E2',
                    light: '#FCA5A5',
                    DEFAULT: '#DC2626',
                    darkest: '#7F1D1D'
                },
                warning: {
                    lightest: '#FEF3C7',
                    light: '#FCD34D',
                    DEFAULT: '#D97705',
                    darkest: '#78350F'
                },
                success: {
                    lightest: '#DCFCE7',
                    light: '#86EFAC',
                    DEFAULT: '#16A34A',
                    darkest: '#14532D'
                }
            },
        },
    },
    plugins: [],
}

