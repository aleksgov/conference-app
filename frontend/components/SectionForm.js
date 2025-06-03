"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select } from 'flowbite-react';

const SectionForm = ({ initialId }) => {
    const router = useRouter();
    const sectionId = initialId;

    const [formData, setFormData] = useState({
        name: '',
        startTime: '',
        endTime: '',
        conferenceId: ''
    });

    const [conferences, setConferences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const confRes = await fetch('/api/conferences');
                if (!confRes.ok) throw new Error('Ошибка загрузки конференций');
                const confData = await confRes.json();
                setConferences(confData);

                // загрузка при редактировании
                if (sectionId) {
                    const secRes = await fetch(`/api/sections/${sectionId}`);
                    if (!secRes.ok) throw new Error('Ошибка загрузки данных секции');
                    const existing = await secRes.json();

                    setFormData({
                        name: existing.name || '',
                        startTime: existing.startTime?.substring(0, 5) || '',
                        endTime: existing.endTime?.substring(0, 5) || '',
                        conferenceId: existing.conference?.id || ''
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [sectionId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // валидация времени
        if (formData.startTime >= formData.endTime) {
            setError('Время начала должно быть раньше времени окончания');
            setIsSubmitting(false);
            return;
        }

        try {
            const url = sectionId
                ? `/api/sections/${sectionId}`
                : '/api/sections';

            const method = sectionId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    conference: { id: formData.conferenceId }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || (sectionId
                    ? 'Ошибка обновления секции'
                    : 'Ошибка создания секции'));
            }

            router.push('/dashboard/sections');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-12">
            <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {sectionId ? 'Редактировать секцию' : 'Создать новую секцию'}
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Название секции *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                        placeholder="Введите название"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Время начала *
                        </label>
                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="endTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Время окончания *
                        </label>
                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="conferenceId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Конференция *
                    </label>
                    <Select
                        id="conferenceId"
                        name="conferenceId"
                        value={formData.conferenceId}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    >
                        <option value="">Выберите конференцию</option>
                        {conferences.map(conf => (
                            <option key={conf.id} value={conf.id}>
                                {conf.name}
                            </option>
                        ))}
                    </Select>
                    {isLoading && (
                        <p className="mt-1 text-sm text-gray-500">Загрузка данных...</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        color="light"
                        onClick={() => router.push('/dashboard/sections')}
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
                                {sectionId ? 'Сохранение...' : 'Создание...'}
                            </span>
                        ) : sectionId ? 'Сохранить изменения' : 'Создать секцию'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SectionForm;