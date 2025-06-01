import React from "react";
import ConferenceForm from "@/components/ConferenceForm";

const ConferenceEditPage = async ({ params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    return (
        <div>
            <ConferenceForm initialId={id} />
        </div>
    );
};

export default ConferenceEditPage;