"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/RegistrationForm";

function ContactsPage() {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <main className='text--colors_default bg--default'>
            <Navbar />
            {showLogin ? (
                <LoginForm onSwitch={() => setShowLogin(false)} />
            ) : (
                <RegistrationForm onSwitch={() => setShowLogin(true)} />
            )}
        </main>
    );
}

export default ContactsPage;