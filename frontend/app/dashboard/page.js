import React from 'react';
import { Button } from 'flowbite-react';
import Link from "next/link";

export default function DashboardPage() {
    return (
        <main className="h-[calc(100vh-4rem)]">
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">
                    Добро пожаловать в Dashboard!
                </h1>
                <Link href={'/dashboard/conferences'}>
                    <Button>Нажми меня</Button>
                </Link>
            </div>
        </main>
    );
}
