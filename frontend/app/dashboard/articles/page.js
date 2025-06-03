import AdvancedTable from '@/components/AdvancedTable';

const ArticlesPage = () => {
    const columns = [
        { key: 'id', title: 'ID', type: 'id' },
        { key: 'name', title: 'Название статьи', type: 'name' },
        { key: 'pages', title: 'Страницы' },
        { key: 'authors', title: 'Авторы' },
        {
            key: 'section.name',
            title: 'Секция',
        },
        {
            key: 'section.conference.name',
            title: 'Конференция',
        },
    ];

    const filters = [
        { key: 'section.conference.name', title: 'Конференция' },
        { key: 'section.name', title: 'Секция' },
    ];

    const addLink = '/dashboard/articles/create';

    return (
        <AdvancedTable
            endpoint="/api/articles"
            columns={columns}
            addLink={addLink}
            idKey="id"
            filters={filters}
        />
    );
};

export default ArticlesPage;