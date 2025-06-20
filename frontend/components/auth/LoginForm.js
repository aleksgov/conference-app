"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка входа');
            }

            const userData = await response.json();
            // авторизация на 1 день
            document.cookie = `token=${userData.token}; Path=/; Max-Age=${60 * 60 * 24};`;
            // сохраняем информацию о пользователе
            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData.user));
            router.push('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="dark:bg-gray-900 w-full flex items-center justify-center p-6 h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">

                <div className="w-full bg-white rounded-lg shadow-xl dark:border dark:bg-gray-800 dark:border-gray-700 p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-6">
                        Войдите в свой аккаунт
                    </h1>

                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Ваш email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                                block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                dark:text-white dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                                block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                dark:text-white dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="remember"
                                        aria-describedby="remember"
                                        type="checkbox"
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="remember"
                                        className="text-gray-500 dark:text-gray-300"
                                    >
                                        Запомнить меня
                                    </label>
                                </div>
                            </div>
                            <a href="#" style={{ color: '#3b82f6' }} className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Забыли пароль?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Войти
                        </button>

                        <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                            Нет аккаунта?{' '}
                            <a
                                href="#"
                                style={{ color: '#3b82f6' }}
                                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.onSwitch();
                                }}
                            >
                                Зарегистрироваться
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;