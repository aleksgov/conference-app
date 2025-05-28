import React from 'react';
import { Button } from 'flowbite-react';

export default function DashboardPage() {
    return (
        <main className="min-h-screen text--colors_default bg--default">
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">Добро пожаловать в Dashboard!</h1>
                <Button>Нажми меня</Button>
            </div>
        </main>
    );
}
