import React from "react";
import ArticleForm from "@/components/forms/ArticleForm.jsx";

const ArticleEditPage = async ({ params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    return (
        <div>
            <ArticleForm initialId={id} />
        </div>
    );
};

export default ArticleEditPage;