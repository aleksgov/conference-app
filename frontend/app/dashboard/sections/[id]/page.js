'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function SectionDetailPage() {
    const { id: sectionId } = useParams();
    const router = useRouter();

    const [section, setSection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { key: 'id', title: 'ID', type: 'id' },
        { key: 'name', title: 'Название секции', type: 'name' },
        { key: 'startTime', title: 'Время начала', type: 'time' },
        { key: 'endTime', title: 'Время окончания', type: 'time' },
        {
            key: 'conference.name',
            title: 'Конференция',
            linkTo: '/dashboard/conferences',
            linkIdPath: 'conference.id',
        },
    ];

    useEffect(() => {
        const fetchSection = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/sections/${sectionId}`);
                if (!res.ok) throw new Error(`Ошибка ${res.status}`);
                const data = await res.json();
                setSection(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (sectionId) {
            fetchSection();
        }
    }, [sectionId]);

    if (isLoading) {
        return <div className="text-center py-10">Загрузка данных секции...</div>;
    }
    if (error) {
        return <div className="text-red-500 text-center py-10">Ошибка: {error}</div>;
    }
    if (!section) {
        return <div className="text-center py-10">Секция не найдена</div>;
    }

    const singleItemArray = [section];

    return (
        <section className="mt-6 bg-gray-100 dark:bg-gray-900 p-3 sm:p-5">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg">
                    <div className="flex items-center justify-between p-4">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Данные секции №{sectionId}
                        </h1>
                        <button
                            onClick={() => router.push('/dashboard/sections')}
                            className="text-sm text-primary-700 hover:underline"
                        >
                            ← К списку секций
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} className="px-4 py-3">
                                        {col.title}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {singleItemArray.map((item) => (
                                <tr key={item.id} className="border-b dark:border-gray-700">
                                    {columns.map((col) => {
                                        const getNested = (obj, path) =>
                                            path.split('.').reduce((acc, key) => (acc ? acc[key] : null), obj);

                                        let rawValue = getNested(item, col.key);
                                        let cellContent;

                                        if (rawValue === undefined || rawValue === null) {
                                            cellContent = <span className="text-gray-400">Не указано</span>;
                                        } else {
                                            switch (col.type) {
                                                case 'time':
                                                    cellContent = <span>{String(rawValue).substring(0, 5)}</span>;
                                                    break;
                                                case 'date':
                                                    try {
                                                        const dt = new Date(rawValue);
                                                        cellContent = <span>{dt.toLocaleDateString('ru-RU')}</span>;
                                                    } catch {
                                                        cellContent = <span>{rawValue}</span>;
                                                    }
                                                    break;
                                                case 'id':
                                                    cellContent = <span className="font-medium">{rawValue}</span>;
                                                    break;
                                                case 'name':
                                                    cellContent = <span className="font-semibold">{rawValue}</span>;
                                                    break;
                                                default:
                                                    cellContent = <span>{rawValue}</span>;
                                            }
                                        }

                                        if (col.linkTo) {
                                            const linkId = getNested(item, col.linkIdPath);
                                            if (linkId) {
                                                const linkText = getNested(item, col.key);
                                                cellContent = (
                                                    <Link
                                                        href={`${col.linkTo}/${linkId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer"
                                                    >
                                                        {linkText}
                                                    </Link>
                                                );
                                            }
                                        }

                                        return (
                                            <td key={`${item.id}-${col.key}`} className="px-4 py-3">
                                                {cellContent}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
