import React from "react";
import SectionForm from "@/components/SectionForm";

const SectionEditPage = async ({ params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    return (
    <div>
        <SectionForm initialId={id} />
    </div>
    );
};

export default SectionEditPage;