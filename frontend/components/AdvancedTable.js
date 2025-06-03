"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Dropdown } from 'flowbite-react';
import DeleteModal from "@/components/DeleteModal";

const AdvancedTable = ({ endpoint, columns, addLink, idKey = 'conferenceId', filters = [] }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState(null);
    const [toDeleteName, setToDeleteName] = useState("");

    const [filterOptions, setFilterOptions] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});

    const itemsPerPage = 10;

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => {
            return acc && acc[part];
        }, obj);
    };

    // удаление записи на сервере
    const handleDelete = async (id) => {
        if (!window.confirm('Вы действительно хотите удалить эту запись?')) {
            return;
        }

        try {
            const response = await fetch(`${endpoint}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Ошибка при удалении (status: ${response.status})`);
            }
            setData(prevData => prevData.filter(item => item[idKey] !== id));
        } catch (err) {
            console.error('Не удалось удалить запись:', err);
            alert('Не удалось удалить запись. Пожалуйста, попробуйте ещё раз.');
        }
    };

    // загрузка данных с сервера
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

    useEffect(() => {
        const newFilterOptions = {};

        filters.forEach(f => {
            const keyPath = f.key;
            const valuesSet = new Set();
            data.forEach(item => {
                const val = getNestedValue(item, keyPath);
                if (val !== undefined && val !== null) {
                    valuesSet.add(val);
                }
            });
            newFilterOptions[keyPath] = Array.from(valuesSet).sort((a, b) =>
                a.toString().localeCompare(b.toString(), 'ru', { sensitivity: 'base' })
            );
        });

        const newSelected = {};
        filters.forEach(f => {
            newSelected[f.key] = selectedFilters[f.key] || [];
        });

        setFilterOptions(newFilterOptions);
        setSelectedFilters(newSelected);
    }, [data, filters]);

    // фильтрация и сортировка данных
    const processedData = React.useMemo(() => {
        let filteredData = data;

        // фильтрация
        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                Object.values(item).some(value =>
                    value &&
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        Object.entries(selectedFilters).forEach(([keyPath, selectedArr]) => {
            if (Array.isArray(selectedArr) && selectedArr.length > 0) {
                filteredData = filteredData.filter(item => {
                    const val = getNestedValue(item, keyPath);
                    return val !== undefined && selectedArr.includes(val);
                });
            }
        });

        // сортировка
        if (sortConfig.key) {
            filteredData = [...filteredData].sort((a, b) => {
                const aVal = getNestedValue(a, sortConfig.key);
                const bVal = getNestedValue(b, sortConfig.key);

                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return filteredData;
    }, [data, searchTerm, sortConfig, selectedFilters]);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(processedData.length / itemsPerPage);

    const renderSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

    const renderCellContent = (column, item) => {
        let value = getNestedValue(item, column.key);

        if (value === undefined || value === null) {
            return <span className="text-gray-400">Не указано</span>;
        }

        switch (column.type) {
            case 'id':
                return <span className="font-medium">{value}</span>;
            case 'name':
                return <span className="font-semibold">{value}</span>;
            case 'date':
                try {
                    const dt = new Date(value);
                    return <span>{dt.toLocaleDateString('ru-RU')}</span>;
                } catch {
                    return <span>{value}</span>;
                }
            case 'time':
                try {
                    return <span>{value.substring(0, 5)}</span>;
                } catch {
                    return <span>{value}</span>;
                }
            default:
                return <span>{value}</span>;
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const askDelete = (id, name) => {
        setToDeleteId(id);
        setToDeleteName(name || "");
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${endpoint}/${toDeleteId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`Ошибка при удалении (status: ${response.status})`);
            }
            setData((prev) => prev.filter((item) => item[idKey] !== toDeleteId));
        } catch (err) {
            console.error("Не удалось удалить запись:", err);
            alert("Не удалось удалить запись. Попробуйте ещё раз.");
        } finally {
            setModalOpen(false);
            setToDeleteId(null);
            setToDeleteName("");
        }
    };

    const cancelDelete = () => {
        setModalOpen(false);
        setToDeleteId(null);
        setToDeleteName("");
    };

    if (isLoading) {
        return <div className="text-center py-10">Загрузка данных...</div>;
    }
    if (error) {
        return <div className="text-red-500 text-center py-10">Ошибка: {error}</div>;
    }

    const entityType = endpoint.split('/').pop();

    return (
        <section className="mt-6 bg-gray-100 dark:bg-gray-900 p-3 sm:p-5">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between p-4">
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
                        <div className="flex items-center space-x-2 w-full md:w-auto">
                            {addLink && (
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
                            )}

                            <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown"
                                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                    type="button">
                                <svg className="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                                </svg>
                                Действия
                            </button>

                            <div id="actionsDropdown"
                                 className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="actionsDropdownButton">
                                    <li>
                                        <a href="#"
                                           className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mass
                                            Edit</a>
                                    </li>
                                </ul>
                                <div className="py-1">
                                    <a href="#"
                                       className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete
                                        all</a>
                                </div>
                            </div>

                            {filters.map(filter => {
                                const keyPath = filter.key;
                                const title = filter.title;
                                const options = filterOptions[keyPath] || [];
                                const selectedArr = selectedFilters[keyPath] || [];

                                return (
                                    <Dropdown
                                        key={keyPath}
                                        inline
                                        arrowIcon={false}
                                        label={
                                            <span className="flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white
                                                rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700
                                                dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white
                                                dark:hover:bg-gray-700"
                                            >
                                                Фильтр
                                                <svg className="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        clipRule="evenodd"
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414
                                                        0L10 10.586l3.293-3.293a1
                                                        1 0 111.414 1.414l-4 4a1
                                                        1 0 01-1.414 0l-4-4a1
                                                        1 0 010-1.414z"
                                                    />
                                                </svg>
                                            </span>
                                        }
                                        className="mr-2"
                                    >
                                        <div className="p-3 bg-white dark:bg-gray-700">
                                            <h6 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                { title }
                                            </h6>
                                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                                                {options.map(option => {
                                                    const isChecked = selectedArr.includes(option);
                                                    return (
                                                        <li key={option} className="flex items-center">
                                                            <input
                                                                id={`${keyPath}-${option}`}
                                                                type="checkbox"
                                                                className="w-4 h-4 appearance-none bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                checked={isChecked}
                                                                onChange={() => {
                                                                    const newSelected = { ...selectedFilters };
                                                                    if (isChecked) {
                                                                        newSelected[keyPath] = newSelected[keyPath].filter(v => v !== option);
                                                                    } else {
                                                                        newSelected[keyPath] = [...newSelected[keyPath], option];
                                                                    }
                                                                    setSelectedFilters(newSelected);
                                                                    setCurrentPage(1);
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`${keyPath}-${option}`}
                                                                className="ml-2 text-sm font-medium cursor-pointer"
                                                            >
                                                                {option}
                                                            </label>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                            <button
                                                className="mt-2 text-xs text-primary-600 hover:underline"
                                                onClick={() => {
                                                    const newSelected = { ...selectedFilters };
                                                    newSelected[keyPath] = [];
                                                    setSelectedFilters(newSelected);
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                Сбросить фильтр
                                            </button>
                                        </div>
                                    </Dropdown>
                                );
                            })}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table
                            className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse">
                            <thead
                                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {columns.map((column, columnIndex) => (
                                    <th
                                        key={column.key || `column-${columnIndex}`}
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
                                <th scope="col" className="px-1 py-3">
                                    Действия
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, itemIndex) => (
                                    <tr key={item[idKey] || `item-${itemIndex}`}
                                        className="border-b dark:border-gray-700">
                                        {columns.map((column, columnIndex) => (
                                            <td key={`${item[idKey] || itemIndex}-${column.key || columnIndex}`}
                                                className="px-4 py-3">
                                                {renderCellContent(column, item)}
                                            </td>
                                        ))}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end">
                                                    <Dropdown
                                                        inline
                                                        arrowIcon={false}
                                                        className="mr-10"
                                                        label={
                                                            <svg
                                                                className="w-5 h-5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                            </svg>
                                                        }
                                                    >
                                                        <span
                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                            onClick={(e) => e.preventDefault()}
                                                        >
                                                            Просмотр
                                                        </span>
                                                            <Link href={`/dashboard/${entityType}/edit/${item[idKey]}`}>
                                                        <span
                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                                                            Редактировать
                                                        </span>
                                                            </Link>
                                                            <hr className="my-1 border-gray-200 dark:border-gray-600"/>
                                                            <span
                                                                className="block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                                                                onClick={() => askDelete(item[idKey], item.name || "")}
                                                            >
                                                            Удалить
                                                        </span>
                                                    </Dropdown>
                                                </div>
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

                                    {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                                        const pageNumber = i + 1;
                                        return (
                                            <li key={`page-${pageNumber}`}>
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
                                        <li key="pagination-ellipsis">
                                        <span
                                            className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
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
                <DeleteModal
                    show={modalOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                itemName={toDeleteName}
            />
        </section>
    );
};

export default AdvancedTable;
