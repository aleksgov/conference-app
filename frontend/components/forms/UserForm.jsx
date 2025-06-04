"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select } from 'flowbite-react';

const UserForm = ({ initialId }) => {
    const router = useRouter();
    const userId = initialId;

    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        dateOfBirth: '',
        gender: 'UNSPECIFIED',
        role: 'USER',
        phone: '',
        participantId: ''
    });

    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Статические списки для ролей и гендеров
    const roles = [
        { value: 'ADMIN', label: 'Администратор' },
        { value: 'USER', label: 'Пользователь' }
    ];

    const genders = [
        { value: 'MALE', label: 'Мужской' },
        { value: 'FEMALE', label: 'Женский' },
        { value: 'OTHER', label: 'Другой' },
        { value: 'UNSPECIFIED', label: 'Не указано' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Загрузка участников
                const participantsRes = await fetch('/api/participants');
                if (!participantsRes.ok) throw new Error('Ошибка загрузки участников');
                const participantsData = await participantsRes.json();
                setParticipants(participantsData);

                if (userId) {
                    const userRes = await fetch(`/api/auth/users/${userId}`);
                    if (!userRes.ok) throw new Error('Ошибка загрузки данных пользователя');
                    const existing = await userRes.json();

                    setFormData({
                        email: existing.email || '',
                        fullName: existing.fullName || '',
                        dateOfBirth: existing.dateOfBirth?.slice(0, 10) || '',
                        gender: existing.gender || 'UNSPECIFIED',
                        role: existing.role || 'USER',
                        phone: existing.phone || '',
                        participantId: existing.participant?.id || ''
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Валидация
        if (!formData.email || !formData.fullName || !formData.dateOfBirth) {
            setError('Пожалуйста, заполните обязательные поля');
            setIsSubmitting(false);
            return;
        }

        try {
            const url = userId
                ? `/api/users/${userId}`
                : '/api/users';

            const method = userId ? 'PUT' : 'POST';

            // Формируем данные для отправки
            const payload = {
                ...formData,
                participant: formData.participantId ? { id: formData.participantId } : null
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || (userId
                    ? 'Ошибка обновления пользователя'
                    : 'Ошибка создания пользователя'));
            }

            router.push('/dashboard/users');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-12">
            <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {userId ? 'Редактировать пользователя' : 'Создать нового пользователя'}
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                        placeholder="user@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Полное имя *
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                        placeholder="Иванов Иван Иванович"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Дата рождения *
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Пол
                        </label>
                        <Select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            {genders.map(gender => (
                                <option key={gender.value} value={gender.value}>
                                    {gender.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Роль *
                        </label>
                        <Select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            {roles.map(role => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Телефон
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="+7 (XXX) XXX-XX-XX"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="participantId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Участник конференции
                    </label>
                    <Select
                        id="participantId"
                        name="participantId"
                        value={formData.participantId}
                        onChange={handleChange}
                        disabled={isLoading}
                    >
                        <option value="">Не привязан</option>
                        {participants.map(participant => (
                            <option key={participant.id} value={participant.id}>
                                {participant.organization}
                            </option>
                        ))}
                    </Select>
                    {isLoading && (
                        <p className="mt-1 text-sm text-gray-500">Загрузка участников...</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        color="light"
                        onClick={() => router.push('/dashboard/users')}
                        disabled={isSubmitting}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {userId ? 'Сохранение...' : 'Создание...'}
                            </span>
                        ) : userId ? 'Сохранить изменения' : 'Создать пользователя'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;