import AdvancedTable from '@/components/AdvancedTable';

const AuditoriumsPage = () => {
    const columns = [
        { key: 'id', title: 'ID', type: 'id' },
        { key: 'capacity', title: 'Вместимость' },
        {
            key: 'section.name',
            title: 'Секция',
            linkTo: '/dashboard/sections',
            linkIdPath: 'section.id'
        },
        {
            key: 'section.conference.name',
            title: 'Конференция',
            linkTo: '/dashboard/conferences',
            linkIdPath: 'section.conference.id'
        },
    ];

    const addLink = '/dashboard/auditoriums/create';

    const filters = [
        { key: 'section.conference.name', title: 'Конференция' },
        { key: 'section.name', title: 'Секция' },
    ];

    return (
        <AdvancedTable
            endpoint="/api/auditoriums"
            columns={columns}
            addLink={addLink}
            idKey="id"
            filters={filters}
        />
    );
};

export default AuditoriumsPage;