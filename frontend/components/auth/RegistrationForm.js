import React, { useState } from 'react';
import { Label, TextInput, Select, Datepicker } from 'flowbite-react';

const RegistrationForm = (props) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
    const [gender, setGender] = useState('MALE');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    phone,
                    birthdate: "2025-03-06",
                    gender,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Ошибка регистрации');
            }

            // Если регистрация успешна, можно вызвать функцию переключения на форму входа
            props.onSwitch();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="dark:bg-gray-900 w-full flex items-center justify-center p-6 h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="w-full bg-white rounded-lg shadow-xl dark:border dark:bg-gray-800 dark:border-gray-700 p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-6">
                        Создайте аккаунт
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="fullName" value="ФИО" className="dark:text-white" />
                            <TextInput
                                id="fullName"
                                name="fullName"
                                required
                                placeholder="Иванов Иван Иванович"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone" value="Телефон" className="dark:text-white" />
                            <TextInput
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                placeholder="+7 900 000 0000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="birthdate" value="Дата рождения" className="dark:text-white" />
                            <Datepicker
                                id="birthdate"
                                name="birthdate"
                                required
                                value={birthdate ?? new Date()}
                                onChange={(date) => {
                                    setBirthdate(date);
                                    console.log('Выбранная дата:', date); // Вывод в консоль
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender" value="Пол" className="dark:text-white" />
                            <Select
                                id="gender"
                                name="gender"
                                required
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="MALE">Мужской</option>
                                <option value="FEMALE">Женский</option>
                                <option value="OTHER">Другой</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="email" value="Ваша почта" className="dark:text-white" />
                            <TextInput
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" value="Пароль" className="dark:text-white" />
                            <TextInput
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirm-password" value="Повторите пароль" className="dark:text-white" />
                            <TextInput
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    aria-describedby="terms"
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                                    Я принимаю{' '}
                                    <a
                                        style={{ color: '#3b82f6' }}
                                        className="font-medium hover:underline"
                                        href="#"
                                    >
                                        Условия использования
                                    </a>
                                </label>
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
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