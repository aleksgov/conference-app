import React from "react";
import UserForm from "@/components/forms/UserForm.jsx";

const UserEditPage = async ({ params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    return (
    <div>
        <UserForm initialId={id} />;
    </div>
    );
};

export default UserEditPage;