"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select, Textarea } from 'flowbite-react';

const ArticleForm = ({ initialId }) => {
    const router = useRouter();
    const articleId = initialId;

    const [formData, setFormData] = useState({
        name: '',
        pages: '',
        authors: '',
        sectionId: ''
    });

    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Загрузка списка секций
                const sectionsRes = await fetch('/api/sections');
                if (!sectionsRes.ok) throw new Error('Ошибка загрузки секций');
                const sectionsData = await sectionsRes.json();
                setSections(sectionsData);

                // Загрузка данных статьи при редактировании
                if (articleId) {
                    const articleRes = await fetch(`/api/articles/${articleId}`);
                    if (!articleRes.ok) throw new Error('Ошибка загрузки статьи');
                    const existing = await articleRes.json();

                    setFormData({
                        name: existing.name || '',
                        pages: existing.pages || '',
                        authors: existing.authors || '',
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
    }, [articleId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const url = articleId
                ? `/api/articles/${articleId}`
                : '/api/articles';
            const method = articleId ? 'PUT' : 'POST';

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
                throw new Error(errorData.message || (articleId
                    ? 'Ошибка обновления статьи'
                    : 'Ошибка создания статьи'));
            }

            router.push('/dashboard/articles');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-12">
            <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {articleId ? 'Редактировать статью' : 'Создать новую статью'}
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Название статьи *
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

                <div>
                    <label htmlFor="authors" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Авторы *
                    </label>
                    <Textarea
                        id="authors"
                        name="authors"
                        value={formData.authors}
                        onChange={handleChange}
                        rows="2"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                        placeholder="Перечислите авторов через запятую"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Формат: Фамилия И.О., Фамилия И.О.
                    </p>
                </div>

                <div>
                    <label htmlFor="pages" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Количество страниц *
                    </label>
                    <input
                        type="number"
                        id="pages"
                        name="pages"
                        value={formData.pages}
                        onChange={handleChange}
                        min="1"
                        max="100"
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
                        onClick={() => router.push('/dashboard/articles')}
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
                                {articleId ? 'Сохранение...' : 'Создание...'}
                            </span>
                        ) : articleId ? 'Сохранить изменения' : 'Создать статью'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ArticleForm;