'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConferencePage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [conferences, setConferences] = useState([]);
    const [selectedConference, setSelectedConference] = useState('');
    const [paperTitle, setPaperTitle] = useState('');
    const [paperAbstract, setPaperAbstract] = useState('');
    const [paperFile, setPaperFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const router = useRouter();
    
    useEffect(() => {
        const userData = localStorage.getItem('user');

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Ошибка парсинга данных пользователя:', error);
                router.push('/login');
            }
        } else {
            router.push('/login');
        }

        // временная заглушка
        const mockConferences = [
            { id: '1', name: 'Международная конференция по искусственному интеллекту', date: '15-17 июля 2023', location: 'Москва' },
            { id: '2', name: 'Научный форум по веб-технологиям', date: '22-24 августа 2023', location: 'Санкт-Петербург' },
            { id: '3', name: 'Симпозиум по квантовым вычислениям', date: '5-7 сентября 2023', location: 'Новосибирск' },
        ];

        setConferences(mockConferences);
        setIsLoading(false);
    }, [router]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPaperFile(file);
        } else {
            alert('Пожалуйста, загрузите файл в формате PDF');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // разработка
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSelectedConference('');
            setPaperTitle('');
            setPaperAbstract('');
            setPaperFile(null);
            setSubmitSuccess(true);

            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            setSubmitError('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Подача заявки на участие в конференции</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Активные конференции</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conferences.map(conf => (
                        <div
                            key={conf.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                            onClick={() => setSelectedConference(conf.id)}
                        >
                            <h3 className="font-medium text-lg mb-2">{conf.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-1">
                                <span className="font-medium">Дата:</span> {conf.date}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Место:</span> {conf.location}
                            </p>
                            {selectedConference === conf.id && (
                                <div className="mt-3 text-green-600 font-medium flex items-center">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    Выбрано
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Форма подачи заявки</h2>

                {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                        Ваша заявка успешно отправлена! Она будет рассмотрена организаторами.
                    </div>
                )}

                {submitError && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                        {submitError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                            Выберите конференцию *
                        </label>
                        <select
                            value={selectedConference}
                            onChange={(e) => setSelectedConference(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        >
                            <option value="">-- Выберите конференцию --</option>
                            {conferences.map(conf => (
                                <option key={conf.id} value={conf.id}>
                                    {conf.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                            Ваша почта
                        </label>
                        <input
                            type="text"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Название доклада *
                    </label>
                    <input
                        type="text"
                        value={paperTitle}
                        onChange={(e) => setPaperTitle(e.target.value)}
                        placeholder="Введите название вашего доклада"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Аннотация доклада *
                    </label>
                    <textarea
                        value={paperAbstract}
                        onChange={(e) => setPaperAbstract(e.target.value)}
                        placeholder="Краткое описание вашего доклада (200-300 слов)"
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    ></textarea>
                </div>

                <div className="mb-8">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Загрузите тезисы доклада (PDF) *
                    </label>
                    <div className="flex items-center">
                        <label className="flex flex-col items-center justify-center w-64 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {paperFile ? paperFile.name : 'Нажмите для загрузки файла'}
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept="application/pdf"
                                required={!paperFile}
                            />
                        </label>
                        {paperFile && (
                            <button
                                type="button"
                                onClick={() => setPaperFile(null)}
                                className="ml-4 text-red-600 hover:text-red-800"
                            >
                                Удалить
                            </button>
                        )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Максимальный размер файла: 5MB. Допустимый формат: PDF
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Отправка...
              </span>
                        ) : 'Отправить заявку'}
                    </button>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Поля, помеченные *, обязательны для заполнения
                    </div>
                </div>
            </form>

            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Мои заявки</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                У вас пока нет отправленных заявок. После подачи заявки она появится в этом разделе.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}