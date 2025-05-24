import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(prev => !prev)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
        >
            {darkMode ? 'Светлая тема' : 'Тёмная тема'}
        </button>
    );
};

export default ThemeToggle;
