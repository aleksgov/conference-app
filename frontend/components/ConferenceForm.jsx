"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";

const ConferenceForm = ({ initialId }) => {
    const router = useRouter();
    const conferenceId = initialId;

    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!conferenceId) return;

        const fetchConference = async () => {
            try {
                const res = await fetch(`/api/conferences/${conferenceId}`);
                if (!res.ok) throw new Error("Не удалось загрузить конференцию");
                const existing = await res.json();
                setFormData({
                    name: existing.name || "",
                    startDate: existing.startDate?.slice(0, 10) || "",
                    endDate: existing.endDate?.slice(0, 10) || "",
                });
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchConference();
    }, [conferenceId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const url = conferenceId
                ? `/api/conferences/${conferenceId}`
                : "/api/conferences";
            const method = conferenceId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(
                    conferenceId
                        ? "Ошибка при обновлении конференции"
                        : "Ошибка при создании конференции"
                );
            }

            router.push("/dashboard/conferences");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-12">
            <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {conferenceId ? "Редактировать конференцию" : "Создать новую конференцию"}
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Название
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="startDate"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Дата начала
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="endDate"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Дата окончания
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/conferences")}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
                    >
                        Отмена
                    </button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="flex items-center">
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                  <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                  ></circle>
                  <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {conferenceId ? "Сохранение..." : "Создание..."}
              </span>
                        ) : conferenceId ? (
                            "Сохранить изменения"
                        ) : (
                            "Создать конференцию"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ConferenceForm;
