// app/about/page.jsx
import React from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { FaGraduationCap, FaUsers, FaCalendarAlt, FaBook } from 'react-icons/fa';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                        Conferva - Ваш научный компас
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                        Инновационная платформа для организации научных мероприятий, объединяющая исследователей со всего мира
                    </p>
                    <div className="relative bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 md:h-96 overflow-hidden">
                        <Image
                            src="/science-tittle.jpg"
                            alt="Баннер конференции"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Наши возможности
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <div className="text-primary-600 dark:text-primary-500 text-4xl mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Наша команда
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="text-center">
                                <div className="mx-auto mb-4">
                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {member.name}
                                </h3>
                                <p className="text-primary-600 dark:text-primary-500">
                                    {member.position}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    {member.bio}
                                </p>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-20">
                    <div className="bg-gray-800 dark:bg-gray-700 rounded-2xl p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {stats.map((stat, index) => (
                                <div key={index}>
                                    <p className="text-4xl font-extrabold text-white mb-2">
                                        {stat.value}
                                    </p>
                                    <p className="text-gray-300">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

const features = [
    {
        icon: <FaGraduationCap />,
        title: "Управление конференциями",
        description: "Полный цикл организации мероприятий от планирования до публикации материалов"
    },
    {
        icon: <FaUsers />,
        title: "Сетевые возможности",
        description: "Поиск коллег и единомышленников по научным интересам"
    },
    {
        icon: <FaCalendarAlt />,
        title: "Календарь событий",
        description: "Персональные уведомления о важных датах и мероприятиях"
    },
    {
        icon: <FaBook />,
        title: "Публикации",
        description: "Архив научных статей и материалов конференций"
    }
];

const teamMembers = [
    {
        name: "Говоруха Александр",
        position: "Основатель проекта",
        bio: "Доктор технических наук, профессор с 15-летним опытом в организации научных мероприятий"
    },
    {
        name: "Мария Иванова",
        position: "Технический директор",
        bio: "Специалист по разработке масштабируемых веб-платформ, архитектор системы"
    },
    {
        name: "Максим Иванов",
        position: "Научный консультант",
        bio: "Эксперт в области международных научных коммуникаций и академического сотрудничества"
    }
];

const stats = [
    { value: "50+", label: "Конференций" },
    { value: "1200+", label: "Участников" },
    { value: "850+", label: "Научных статей" },
    { value: "15+", label: "Стран" }
];