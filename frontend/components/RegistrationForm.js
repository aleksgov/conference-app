import React from 'react';

const RegistrationForm = (props) => {
    return (
        <section className="dark:bg-gray-900 w-full flex items-center justify-center p-6 h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="w-full bg-white rounded-lg shadow-xl dark:border dark:bg-gray-800 dark:border-gray-700 p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-6">
                        Создайте аккаунт
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label htmlFor="email"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Ваша почта
                            </label>
                            <input type="email" name="email" id="email"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                   focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                                   block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                   dark:text-white dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="name@company.com" required=""/>
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Пароль
                            </label>
                            <input type="password" name="password" id="password" placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                   focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                                   block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                   dark:text-white dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required=""/>
                        </div>
                        <div>
                            <label htmlFor="confirm-password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Повторите пароль
                            </label>
                            <input type="password" name="confirm-password" id="confirm-password"
                                   placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                   focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                                   block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                   dark:text-white dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required=""/>
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="terms" aria-describedby="terms" type="checkbox"
                                       className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                       required=""/>
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                                    Я принимаю <a
                                    style={{ color: '#3b82f6' }}
                                    className="font-medium hover:underline"
                                    href="#">
                                    Условия использования
                                </a>
                                </label>
                            </div>
                        </div>
                        <button type="submit"
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Создать аккаунт
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                            Уже есть аккаунт?{' '}
                            <a
                                href="#"
                                style={{ color: '#3b82f6' }}
                                className="font-medium hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.onSwitch();
                                }}
                            >
                                Войти
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegistrationForm;