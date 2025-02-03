/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                glory: [
                    'Glory',
                    'sans-serif'
                ],
                caveat: [
                    'Caveat',
                    'sans-serif'
                ]
            },
            colors: {
                primary: '#008080',
                secondary: '#E7F6FC',
                border: '#00221C',
                background: '#A5CFE3',
                text: '#00221C',
                hover: '#005549',
                lightError: '#EA6C61',
                lightSuccess: '#09EB22'
            },
            screens: {
                xs: '400px'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}