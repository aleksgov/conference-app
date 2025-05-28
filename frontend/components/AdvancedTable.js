"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dropdown } from 'flowbite-react';

const AdvancedTable = ({ endpoint, columns, addLink }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Загрузка данных с сервера
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(endpoint);
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    // Обработка сортировки
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Фильтрация и сортировка данных
    const processedData = React.useMemo(() => {
        let filteredData = data;

        // Фильтрация
        if (searchTerm) {
            filteredData = data.filter(item =>
                Object.values(item).some(
                    value =>
                        value &&
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Сортировка
        if (sortConfig.key) {
            filteredData = [...filteredData].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredData;
    }, [data, searchTerm, sortConfig]);

    // Пагинация
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(processedData.length / itemsPerPage);

    // Рендер иконки сортировки
    const renderSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

    // Условный рендер содержимого ячейки, исходя из поля `type`
    const renderCellContent = (column, item) => {
        switch (column.type) {
            case 'id':
                return <span className="font-medium">{item[column.key]}</span>;
            case 'name':
                return <span className="font-semibold">{item[column.key]}</span>;
            case 'date':
                try {
                    const dt = new Date(item[column.key]);
                    return <span>{dt.toLocaleDateString('ru-RU')}</span>;
                } catch {
                    return <span>{item[column.key]}</span>;
                }
            default:
                return <span>{item[column.key]}</span>;
        }
    };

    if (isLoading) {
        return <div className="text-center py-10">Загрузка данных...</div>;
    }
    if (error) {
        return <div className="text-red-500 text-center py-10">Ошибка: {error}</div>;
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    {/* Панель управления */}
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        {/* Поиск */}
                        <div className="w-full md:w-1/2">
                            <div className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">
                                    Поиск
                                </label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="simple-search"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Поиск..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Кнопка «Добавить» (Link на страницу создания) */}
                        {addLink && (
                            <div className="w-full md:w-auto flex justify-end">
                                <Link
                                    href={addLink}
                                    className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                >
                                    <svg
                                        className="h-3.5 w-3.5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        />
                                    </svg>
                                    Добавить
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Таблица */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className="px-4 py-3 cursor-pointer"
                                        onClick={() => handleSort(column.key)}
                                    >
                                        <div className="flex items-center">
                                            {column.title}
                                            <span className="ml-1">{renderSortIcon(column.key)}</span>
                                        </div>
                                    </th>
                                ))}
                                <th scope="col" className="px-4 py-3">
                                    Действия
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.conferenceId} className="border-b dark:border-gray-700">
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-4 py-3">
                                                {renderCellContent(column, item)}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3">
                                            <Dropdown
                                                label={
                                                    <button className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100">
                                                        <svg
                                                            className="w-5 h-5"
                                                            aria-hidden="true"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                    </button>
                                                }
                                                inline
                                                placement="left"
                                            >
                                                <Dropdown.Item>Просмотр</Dropdown.Item>
                                                <Dropdown.Item>Редактировать</Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item>Удалить</Dropdown.Item>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-4 py-3 text-center">
                                        Данные не найдены
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Пагинация */}
                    {totalPages > 1 && (
                        <nav
                            className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                            aria-label="Table navigation"
                        >
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Показано{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                  {Math.min(indexOfFirstItem + 1, processedData.length)}-
                      {Math.min(indexOfLastItem, processedData.length)}
                </span>{' '}
                  из{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                  {processedData.length}
                </span>
              </span>
                            <ul className="inline-flex items-stretch -space-x-px">
                                <li>
                                    <button
                                        className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    >
                                        <span className="sr-only">Предыдущая</span>
                                        <svg
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </li>

                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNumber = i + 1;
                                    return (
                                        <li key={pageNumber}>
                                            <button
                                                className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                                                    currentPage === pageNumber
                                                        ? 'text-primary-600 bg-primary-50 border-primary-300 dark:bg-gray-700 dark:text-white'
                                                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                                } border`}
                                                onClick={() => setCurrentPage(pageNumber)}
                                            >
                                                {pageNumber}
                                            </button>
                                        </li>
                                    );
                                })}

                                {totalPages > 5 && (
                                    <li>
                    <span className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      ...
                    </span>
                                    </li>
                                )}

                                <li>
                                    <button
                                        className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    >
                                        <span className="sr-only">Следующая</span>
                                        <svg
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdvancedTable;
