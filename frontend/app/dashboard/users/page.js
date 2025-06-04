import AdvancedTable from '@/components/AdvancedTable';

const UsersPage = () => {
    const columns = [
        { key: 'id', title: 'ID', type: 'id' },
        { key: 'email', title: 'Email' },
        { key: 'fullName', title: 'ФИО', type: 'name' },
        {
            key: 'dateOfBirth',
            title: 'Дата рождения',
            type: 'date'
        },
        {
            key: 'gender',
            title: 'Пол',
            type: 'gender'
        },
        {
            key: 'role',
            title: 'Роль',
            type: 'role'
        }
    ];

    const filters = [
        { key: 'role', title: 'Роль' },
        { key: 'gender', title: 'Пол' }
    ];

    const addLink = '/dashboard/users/create';

    return (
        <AdvancedTable
            endpoint="/api/users"
            columns={columns}
            addLink={addLink}
            idKey="id"
            filters={filters}
        />
    );
};

export default UsersPage;