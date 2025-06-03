import React from "react";
import AuditoriumForm from "@/components/forms/AuditoriumForm.jsx";

const AuditoriumEditPage = async ({ params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    return (
        <div>
            <AuditoriumForm initialId={id} />
        </div>
    );
};

export default AuditoriumEditPage;