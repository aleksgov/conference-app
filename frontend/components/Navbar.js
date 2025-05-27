'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import LoginIcon from '../icons/login.svg';
import ContactIcon from '../icons/contact.svg';
import AboutIcon from '../icons/about.svg';
import Logo from '../icons/Logo.svg';

const DynamicThemeSwitcher = dynamic(() => import('./ThemeSwitcher'), {
    ssr: false,
});

export default function Navbar() {
    return (
        <nav className='navbar w-full px-20 py-3 shadow-lg bg-white dark:bg-slate-900 z-50'>
            <div className='flex items-center'>
                <section className='nav-left font-bold mr-auto text-xl flex items-center gap-2'>
                    <Logo className='w-8 h-8 text-gray-800 dark:text-white flex-shrink-0' />
                    Conferva
                </section>
                <ul className='nav-links flex gap-10 items-center'>
                    <li>
                        <Link href='/'>
                            <span className='flex items-center gap-2'>Главная</span>
                        </Link>
                    </li>
                    <li>
                        <Link href='/about'>
                            <span className="flex items-center gap-2">
                                <AboutIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                                О нас
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href='/contacts'>
                            <span className="flex items-center gap-2">
                                <ContactIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                                Контакты
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/login">
                            <span className="flex items-center gap-2">
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
