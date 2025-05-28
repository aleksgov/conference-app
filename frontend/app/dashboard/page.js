import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from 'flowbite-react';

export default function DashboardPage() {
    return (
        <main className="min-h-screen text--colors_default bg--default">
            <Navbar />
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">Добро пожаловать в Dashboard!</h1>
                <Button>Нажми меня</Button>
            </div>
        </main>
    );
}
