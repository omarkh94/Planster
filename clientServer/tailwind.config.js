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
                danger:'#FF4C4C',
                border: '#00221C',
                background: '#A5CFE3',
                text: '#00221C',
                hover: '#005549',
                lightError: '#EA6C61',
                lightSuccess: '#09EB22',
                forgottenPass:"#848484"
            },
            screens: {
                xs: '400px'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            backgroundImage: {
                'heroBg': "url('/assets/homeHero.jpeg')"
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}