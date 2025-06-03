"use client";

import React, { useState } from 'react';
import LoginForm from "@/components/auth/LoginForm";
import RegistrationForm from "@/components/auth/RegistrationForm";

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