'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import LoginIcon from '../icons/login.svg';
import ContactIcon from '../icons/contact.svg';
import AboutIcon from '../icons/about.svg';
import Logo from '../icons/logo.svg';
import AdminIcon from '../icons/admin.svg';

const DynamicThemeSwitcher = dynamic(() => import('./ThemeSwitcher'), {
    ssr: false,
});

export default function Navbar() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // проверка данных пользователя на статус в системе
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setIsAdmin(user.role === 'ADMIN');
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        setIsLoading(false);
    }, []);

    return (
        <nav className='navbar w-full px-20 py-3 shadow-lg bg-white dark:bg-slate-900 text-gray-800 dark:text-white z-50'>
            <div className='flex items-center'>
                <section className='nav-left font-bold mr-auto text-xl flex items-center gap-2 text-gray-800 dark:text-white'>
                    <Logo className='w-8 h-8 text-gray-800 dark:text-white flex-shrink-0' />
                    Conferva
                </section>
                <ul className='nav-links flex gap-10 items-center'>
                    <li>
                        <Link href='/'>
                            <span className='flex items-center gap-2 text-gray-800 dark:text-white'>Главная</span>
                        </Link>
                    </li>
                    <li>
                        <Link href='/about'>
                            <span className="flex items-center gap-2 text-gray-800 dark:text-white">
                                <AboutIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                                О нас
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href='/contacts'>
                            <span className="flex items-center gap-2 text-gray-800 dark:text-white">
                                <ContactIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                                Контакты
                            </span>
                        </Link>
                    </li>

                    {/* Добавляем вкладку для администратора */}
                    {!isLoading && isAdmin && (
                        <li>
                            <Link href='/dashboard'>
                                <span className="flex items-center gap-2 text-gray-800 dark:text-white">
                                    <AdminIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                                    Панель администрирования
                                </span>
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link href="/login">
                            <span className="flex items-center gap-2 text-gray-800 dark:text-white">
                                <LoginIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                                Войти
                            </span>
                        </Link>
                    </li>
                </ul>
                <DynamicThemeSwitcher />
            </div>
        </nav>
    );
}