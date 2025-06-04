"use client";

import AdvancedTable from '@/components/AdvancedTable';
import { Button } from 'flowbite-react';
import { useState } from 'react';

const ApplicationsPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [error, setError] = useState('');

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`/api/applications/${id}/approve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setRefreshKey(prev => prev + 1);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Ошибка при одобрении заявки');
            }
        } catch (err) {
            setError('Ошибка сети: ' + err.message);
        }
    };

    const handleReject = async (id) => {
        const comment = prompt('Введите причину отказа:');
        if (comment === null) return;

        try {
            const response = await fetch(`/api/applications/${id}/reject`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comment)
            });

            if (response.ok) {
                setRefreshKey(prev => prev + 1);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Ошибка при отклонении заявки');
            }
        } catch (err) {
            setError('Ошибка сети: ' + err.message);
        }
    };

    const columns = [
        { key: 'id', title: 'ID', type: 'id' },
        {
            key: 'user.fullName',
            title: 'Пользователь',
            render: (item) => item.user?.fullName || 'Неизвестно'
        },
        {
            key: 'conference.name',
            title: 'Конференция',
            render: (item) => item.conference?.name || 'Неизвестно'
        },
        {
            key: 'section.name',
            title: 'Секция',
            render: (item) => item.section?.name || 'Неизвестно'
        },
        {
            key: 'articleTitle',
            title: 'Доклад'
        },
        {
            key: 'status',
            title: 'Статус',
            render: (item) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        item.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                }`}>
                    {item.status === 'APPROVED' ? 'Одобрено' :
                        item.status === 'REJECTED' ? 'Отклонено' : 'На рассмотрении'}
                </span>
            )
        },
        {
            key: 'submittedAt',
            title: 'Дата подачи',
            type: 'datetime'
        },
        {
            key: 'actions',
            title: 'Действия',
            render: (item) => (
                <div className="flex space-x-2">
                    {item.status === 'PENDING' && (
                        <>
                            <Button
                                size="xs"
                                onClick={() => handleApprove(item.id)}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Одобрить
                            </Button>
                            <Button
                                size="xs"
                                color="failure"
                                onClick={() => handleReject(item.id)}
                            >
                                Отклонить
                            </Button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mt-8 -mb-6" style={{ marginLeft: "232px" }}>
                Управление заявками на конференции
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <AdvancedTable
                key={refreshKey}
                endpoint="/api/applications"
                columns={columns}
                idKey="id"
                searchable={true}
                filters={[
                    { key: 'status', title: 'Статус' },
                    { key: 'conference.name', title: 'Конференция' }
                ]}
            />
        </div>
    );
};

export default ApplicationsPage;