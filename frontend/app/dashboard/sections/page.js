import AdvancedTable from '@/components/AdvancedTable';

const SectionsPage = () => {

    const columns = [
        { key: 'id', title: 'ID', type: 'id' },
        { key: 'name', title: 'Название секции', type: 'name' },
        { key: 'startTime', title: 'Время начала', type: 'time' },
        { key: 'endTime', title: 'Время окончания', type: 'time' },
        {
            key: 'conference.name',
            title: 'Конференция',
            linkTo: '/dashboard/conferences',
            linkIdPath: 'conference.id'
        },
    ];

    const filters = [
        { key: 'conference.name', title: 'Конференция' },
    ];

    const addLink = '/dashboard/sections/create';

    return (
        <AdvancedTable
            endpoint="/api/sections"
            columns={columns}
            addLink={addLink}
            idKey="id"
            filters={filters}
        />
    );
};

export default SectionsPage;