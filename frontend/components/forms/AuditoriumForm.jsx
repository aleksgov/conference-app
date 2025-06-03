"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select } from 'flowbite-react';

const AuditoriumForm = ({ initialId }) => {
    const router = useRouter();
    const auditoriumId = initialId;

    const [formData, setFormData] = useState({
        capacity: '',
        sectionId: ''
    });
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sectionsRes = await fetch('/api/sections');
                if (!sectionsRes.ok) throw new Error('Ошибка загрузки секций');
                const sectionsData = await sectionsRes.json();
                setSections(sectionsData);

                if (auditoriumId) {
                    const auditoriumRes = await fetch(`/api/auditoriums/${auditoriumId}`);
                    if (!auditoriumRes.ok) throw new Error('Ошибка загрузки аудитории');
                    const existing = await auditoriumRes.json();

                    setFormData({
                        capacity: existing.capacity || '',
                        sectionId: existing.section?.id || ''
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [auditoriumId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const url = auditoriumId
                ? `/api/auditoriums/${auditoriumId}`
                : '/api/auditoriums';
            const method = auditoriumId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    section: { id: formData.sectionId }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || (auditoriumId
                    ? 'Ошибка обновления аудитории'
                    : 'Ошибка создания аудитории'));
            }

            router.push('/dashboard/auditoriums');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-12">
            <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {auditoriumId ? 'Редактировать аудиторию' : 'Создать новую аудиторию'}
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="capacity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Вместимость (человек) *
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        min="1"
                        max="1000"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                        placeholder="Введите число"
                    />
                </div>

                <div>
                    <label htmlFor="sectionId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Секция *
                    </label>
                    <Select
                        id="sectionId"
                        name="sectionId"
                        value={formData.sectionId}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    >
                        <option value="">Выберите секцию</option>
                        {sections.map(section => (
                            <option key={section.id} value={section.id}>
                                {section.name} ({section.conference?.name})
                            </option>
                        ))}
                    </Select>
                    {isLoading && (
                        <p className="mt-1 text-sm text-gray-500">Загрузка секций...</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        color="light"
                        onClick={() => router.push('/dashboard/auditoriums')}
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
                                {auditoriumId ? 'Сохранение...' : 'Создание...'}
                            </span>
                        ) : auditoriumId ? 'Сохранить изменения' : 'Создать аудиторию'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AuditoriumForm;