export default function Home() {
    return (
        <main>
            <section>
                <div
                    className="gap-16 items-start py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                    <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mt-8">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                            Добро пожаловать в Центр Научных Инициатив!
                        </h2>
                        <p className="mb-4">
                            Мы объединили лучшие умы со всего мира для:
                       </p>
                        <ol className="list-decimal list-inside space-y-3 my-4 marker:text-blue-500 marker:text-lg ">
                            <li>Обмена идеями и опытом в формате научных конференций;</li>
                            <li>Поиска единомышленников и расширения профессиональных связей;</li>
                            <li>Просмотра актуальных расписаний, докладов и публикаций участников.</li>
                        </ol>
                        <p>
                            На нашем портале вы сможете создать личный кабинет, записаться на интересующие мероприятия и получать уведомления о важных изменениях в программах.
                        </p>
                        <h2>Присоединяйтесь к дискуссии – откройте новые горизонты вместе с коллегами!</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-16">
                        <img className="w-full rounded-lg"
                             src="/science_collage/science1.png"
                             alt="science content 1"/>
                        <img className="mt-4 w-full lg:mt-10 rounded-lg"
                             src="/science_collage/science2.jpg"
                             alt="science content 2"/>
                        <img className="-mt-12 w-full rounded-lg"
                             src="/science_collage/science3.jpg"
                             alt="science content 2"/>
                        <img className="mt-4 w-full rounded-lg"
                             src="/science_collage/science4.jpg"
                             alt="science content 2"/>
                    </div>
                </div>
            </section>
        </main>
    );
}
