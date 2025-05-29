"use client";

import React, { useState } from 'react';
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/RegistrationForm";

function LoginPage() {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <main>
            {showLogin ? (
                <LoginForm onSwitch={() => setShowLogin(false)} />
            ) : (
                <RegistrationForm onSwitch={() => setShowLogin(true)} />
            )}
        </main>
    );
}

export default LoginPage;