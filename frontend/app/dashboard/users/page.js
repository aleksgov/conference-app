"use client";

import AdvancedTable from '@/components/AdvancedTable';

const UsersPage = () => {
    const columns = [
        { key: 'id', title: 'ID', type: 'id' },
        { key: 'email', title: 'Email', type: 'email' },
        { key: 'fullName', title: 'Полное имя' },
        {
            key: 'role',
            title: 'Роль',
            render: (value) => {
                const roleMap = {
                    'ADMIN': 'Администратор',
                    'USER': 'Пользователь'
                };
                return roleMap[value] || value;
            }
        },
        {
            key: 'participant.organization',
            title: 'Организация',
            linkTo: '/dashboard/participants',
            linkIdPath: 'participant.id'
        },
    ];

    const filters = [
        { key: 'role', title: 'Роль' },
        { key: 'participant.organization', title: 'Организация' },
    ];

    const addLink = '/dashboard/users/create';

    return (
        <AdvancedTable
            endpoint="/api/auth/users"
            columns={columns}
            addLink={addLink}
            idKey="id"
            filters={filters}
        />
    );
};

export default UsersPage;