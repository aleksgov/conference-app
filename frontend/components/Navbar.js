'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation";

import LoginIcon from '@/icons/login.svg';
import ConferenceIcon from '@/icons/contact.svg';
import AboutIcon from '@/icons/about.svg';
import LogoPng from "@/icons/logo.png";
import AdminIcon from '@/icons/admin.svg';
import ProfileAvatar from './ProfileAvatar';
import { DarkThemeToggle } from "flowbite-react";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const adminDropdownRef = useRef(null);

    const pathname = usePathname();

    useEffect(() => {
        // проверка данных пользователя на статус в системе
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsed = JSON.parse(userData);
                setUser(parsed);
            } catch (e) {
                console.error('Error parsing user data:', e);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setIsLoading(false);
    }, [pathname]);

    const isLoggedIn = !!user;
    const isAdmin = user?.role === 'ADMIN';

    // закрытие панели
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target)
            ) {
                setIsProfileDropdownOpen(false);
            }
            if (
                adminDropdownRef.current &&
                !adminDropdownRef.current.contains(event.target)
            ) {
                setIsAdminDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // очистка данных вход/выход
    function handleSignOut() {
        localStorage.removeItem('user');
        setUser(null);
        setIsProfileDropdownOpen(false);
        setIsAdminDropdownOpen(false);
    }

    return (
        <nav className="navbar w-full px-20 py-3 shadow-lg bg-white dark:bg-slate-900 text-gray-800 dark:text-white z-50">
            <div className="flex items-center">
                <section className="nav-left font-bold mr-auto text-xl flex items-center gap-2 text-gray-800 dark:text-white">
                    <Image
                        src={LogoPng}
                        alt="Logo"
                        width={40}
                        height={40}
                        className="flex-shrink-0"
                    />
                    Conferva
                </section>

                <ul className="nav-links flex gap-10 items-center">
                    <li>
                        <Link href='/'>
                            <span className="flex items-center gap-2 text-gray-800 dark:text-white">
                                Главная
                            </span>
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
                        <Link href='/conferences'>
                            <span className="flex items-center gap-2 text-gray-800 dark:text-white">
                                <ConferenceIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                                Конференции
                            </span>
                        </Link>
                    </li>

                    {!isLoading && isAdmin && (
                        <li className="relative" ref={adminDropdownRef}>
                            <button
                                type="button"
                                className="flex items-center gap-2 text-gray-800 dark:text-white focus:outline-none"
                                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                            >
                                <AdminIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                                Панель администрирования
                            </button>

                            {isAdminDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow-sm z-50">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li>
                                            <Link
                                                href='/dashboard/conferences'
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Конференции
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href='/dashboard/sections'
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Секции
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href='/dashboard/auditoriums'
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Аудитории
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href='/dashboard/articles'
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Статьи
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href='/dashboard/participants'
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Участники
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href='/dashboard/presentations'
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Презентации
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                    )}


                    {!isLoading && (
                        <>
                            {isLoggedIn ? (
                                <li className="relative" ref={profileDropdownRef}>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 text-gray-800 dark:text-white focus:outline-none"
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    >
                                        <ProfileAvatar />
                                        <span className="truncate max-w-[80px]">
                                            {user.name || 'Профиль'}
                                        </span>
                                    </button>

                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow-sm z-50">
                                            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                <div>{user.name}</div>
                                                {user.email && (
                                                    <div className="font-medium truncate">
                                                        {user.email}
                                                    </div>
                                                )}
                                            </div>

                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                <li>
                                                    <Link
                                                        href='/profile'
                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Профиль
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        href='/settings'
                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Настройки
                                                    </Link>
                                                </li>
                                            </ul>


                                            <div className="py-1">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                                >
                                                    Выйти
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ) : (
                                <li>
                                    <Link href='/login'>
                                        <span className="flex items-center gap-2 text-gray-800 dark:text-white">
                                            <LoginIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                                            Войти
                                        </span>
                                    </Link>
                                </li>
                            )}
                        </>
                    )}
                </ul>
                <DarkThemeToggle className="ml-8" />
            </div>
        </nav>
    );
}



