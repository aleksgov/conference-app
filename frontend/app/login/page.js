import React from 'react';
import Navbar from '@/components/Navbar';
import LoginForm from "@/components/LoginForm";

function ContactsPage() {
    return (
        <main className='text--colors_default bg--default'>
            <Navbar />
            <LoginForm />
        </main>
    );
}

export default ContactsPage;