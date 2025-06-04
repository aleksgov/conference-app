"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Label, TextInput, Select, Datepicker, Spinner, Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';

const ProfilePage = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        birthdate: null,
        gender: 'UNSPECIFIED',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Загрузка данных пользователя
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        router.push('/login');
                    }
                    throw new Error('Ошибка загрузки данных профиля');
                }

                const data = await response.json();
                setUserData({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    birthdate: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                    gender: data.gender || 'UNSPECIFIED'
                });
                setIsLoading(false);
            } catch (error) {
                setErrorMessage(error.message);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setUserData(prev => ({ ...prev, birthdate: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: userData.fullName,
                    phone: userData.phone,
                    dateOfBirth: userData.birthdate?.toISOString().split('T')[0],
                    gender: userData.gender
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при сохранении профиля');
            }

            const updatedUser = {
                ...JSON.parse(localStorage.getItem('user')),
                fullName: userData.fullName,
                phone: userData.phone
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSuccessMessage('Профиль успешно обновлен!');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="xl" aria-label="Загрузка профиля..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Ваш профиль
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Управляйте вашими личными данными и настройками
                    </p>
                </div>

                <Card className="rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        {errorMessage && (
                            <Alert color="failure" icon={HiInformationCircle} className="mb-6">
                                <span className="font-medium">Ошибка!</span> {errorMessage}
                            </Alert>
                        )}

                        {successMessage && (
                            <Alert color="success" icon={HiInformationCircle} className="mb-6">
                                {successMessage}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="fullName" value="ФИО" className="dark:text-gray-300" />
                                    <TextInput
                                        id="fullName"
                                        name="fullName"
                                        value={userData.fullName}
                                        onChange={handleChange}
                                        placeholder="Иванов Иван Иванович"
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" value="Email" className="dark:text-gray-300" />
                                    <TextInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={userData.email}
                                        readOnly
                                        className="mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                <div className="z-20">
                                    <Label htmlFor="birthdate" value="Дата рождения" className="dark:text-gray-300" />
                                    <div className="relative z-20">
                                        <Datepicker
                                            id="birthdate"
                                            value={userData.birthdate}
                                            onChange={handleDateChange}
                                            className="mt-1 w-full z-50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="phone" value="Телефон" className="dark:text-gray-300" />
                                    <TextInput
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={userData.phone}
                                        onChange={handleChange}
                                        placeholder="+7 900 000 0000"
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="gender" value="Пол" className="dark:text-gray-300" />
                                    <Select
                                        id="gender"
                                        name="gender"
                                        value={userData.gender}
                                        onChange={handleChange}
                                        className="mt-1"
                                    >
                                        <option value="MALE">Мужской</option>
                                        <option value="FEMALE">Женский</option>
                                        <option value="OTHER">Другой</option>
                                        <option value="UNSPECIFIED">Не указан</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex gap-3">
                                    <Button color="light" onClick={() => router.push('/')} disabled={isSaving}>
                                        На главную
                                    </Button>
                                    <Button color="failure" onClick={handleLogout} disabled={isSaving}>
                                        Выйти
                                    </Button>
                                </div>

                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? (
                                        <span className="flex items-center">
                                            <Spinner size="sm" className="mr-2" />
                                            Сохранение...
                                        </span>
                                    ) : (
                                        'Сохранить изменения'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="text-center">
                            <div className="mx-auto bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Приватность</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Управляйте видимостью вашего профиля и данных
                            </p>
                            <Button color="light" className="mt-4 mx-auto">
                                Настройки приватности
                            </Button>
                        </div>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="text-center">
                            <div className="mx-auto bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Безопасность</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Обновите пароль и настройки безопасности
                            </p>
                            <Button color="light" className="mt-4 mx-auto">
                                Изменить пароль
                            </Button>
                        </div>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="text-center">
                            <div className="mx-auto bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ваши мероприятия</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Просмотр и управление вашими конференциями
                            </p>
                            <Button color="light" className="mt-4 mx-auto">
                                Мои конференции
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;