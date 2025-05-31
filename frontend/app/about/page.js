import React from 'react';
import Navbar from '@/components/Navbar';

import {Button, Dropdown} from 'flowbite-react';

function AboutPage() {
    return (
        <main>
            <Dropdown label="Меню">
                <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Профиль</span>
                <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Настройки</span>
            </Dropdown>
        </main>
    );
}

export default AboutPage;
