import AdvancedTable from '@/components/AdvancedTable';

const AuditoriumsPage = () => {
    const columns = [
        { key: 'id', title: 'ID', type: 'id' },
        { key: 'capacity', title: 'Вместимость' },
        {
            key: 'section.name',
            title: 'Секция',
        },
        {
            key: 'section.conference.name',
            title: 'Конференция',
        },
    ];

    const addLink = '/dashboard/auditoriums/create';

    return (
        <AdvancedTable
            endpoint="/api/auditoriums"
            columns={columns}
            addLink={addLink}
            idKey="id"
        />
    );
};

export default AuditoriumsPage;