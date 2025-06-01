import AdvancedTable from '@/components/AdvancedTable';

const ConferencesPage = () => {

    const columns = [
        { key: 'id', title: 'ID', type: 'id' },
        { key: 'name', title: 'Название', type: 'name' },
        { key: 'startDate', title: 'Дата начала', type: 'date' },
        { key: 'endDate', title: 'Дата окончания', type: 'date' },
    ];

    const addLink = '/dashboard/conferences/create';

    return (
        <AdvancedTable
            endpoint="/api/conferences"
            columns={columns}
            addLink={addLink}
            idKey="id"
        />
    );
};

export default ConferencesPage;
