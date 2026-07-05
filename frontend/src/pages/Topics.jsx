import { useEffect, useState } from "react";
import { Crown, Lock } from "lucide-react";
import {
    createTopic,
    deleteTopic,
    getTopics,
    updateTopic,
} from "../services/topicService";
import { useAuth } from "../context/AuthContext";
import PremiumLockedModal from "../components/PremiumLockedModal";

function Topics() {
    const { isPremium } = useAuth();
    const [topics, setTopics] = useState([]);
    const [name, setName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);

    const fetchTopics = async () => {
        try {
            setLoading(true);
            const data = await getTopics();
            setTopics(data);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load topics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTopics();
    }, []);

    const resetForm = () => {
        setName("");
        setEditingId(null);
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!name.trim()) {
            setErrorMessage("Topic name is required.");
            return;
        }

        try {
            if (editingId) {
                await updateTopic(editingId, {
                    name: name.trim(),
                });
            } else {
                await createTopic({
                    name: name.trim(),
                });
            }

            resetForm();
            fetchTopics();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 403) {
                setErrorMessage(
                    error.response?.data?.message ||
                        "This action requires Premium."
                );
                setPremiumModalOpen(true);
                return;
            }

            setErrorMessage("Failed to save topic.");
        }
    };

    const handleEdit = (topic) => {
        setEditingId(topic.id);
        setName(topic.name);
        setErrorMessage("");
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this topic?")) return;

        try {
            await deleteTopic(id);
            fetchTopics();

            if (editingId === id) {
                resetForm();
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to delete topic.");
        }
    };

    return (
        <div className="app-page">
            <PremiumLockedModal
                open={premiumModalOpen}
                title="Custom topic limit reached"
                description="Free learners can create up to 3 custom topics. Premium removes this limit and unlocks more learning tools."
                onClose={() => setPremiumModalOpen(false)}
            />

            <section className="kid-panel-soft mb-6 p-6 md:p-8">
                <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-sm font-black text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                        <Crown className="h-4 w-4" />
                        Topic workspace
                    </div>
                    <h1 className="text-3xl font-black text-slate-950 dark:text-white md:text-5xl">
                        Manage Topics
                    </h1>
                    <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600 dark:text-slate-300">
                        Create and manage learning topics.
                    </p>
                </div>
            </section>

            <section className="kid-panel mb-6 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                isPremium
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                        >
                            {isPremium ? (
                                <Crown className="h-6 w-6" />
                            ) : (
                                <Lock className="h-6 w-6" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400">
                                Topic Creator
                            </p>
                            <p className="font-bold text-slate-950 dark:text-white">
                                {isPremium
                                    ? "Unlimited custom topics"
                                    : "Free plan: up to 3 custom topics"}
                            </p>
                        </div>
                    </div>

                    {!isPremium && (
                        <button
                            type="button"
                            onClick={() => setPremiumModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-100 px-5 py-3 font-bold text-yellow-700 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-100"
                        >
                            <Crown className="h-5 w-5" />
                            Upgrade
                        </button>
                    )}
                </div>
            </section>

            <form
                onSubmit={handleSubmit}
                className="kid-panel mb-6 p-6"
            >
                <h2 className="mb-4 text-xl font-bold text-slate-950 dark:text-white">
                    {editingId ? "Edit Topic" : "Add New Topic"}
                </h2>

                {errorMessage && (
                    <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500 dark:bg-red-950/40">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Topic name"
                        aria-label="Topic name"
                        className="kid-input flex-1 p-4"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="kid-button kid-button-green px-7 py-4"
                    >
                        {editingId ? "Update Topic" : "Add Topic"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-2xl bg-slate-100 px-7 py-4 font-bold text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:bg-slate-800 dark:text-slate-200"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="kid-panel overflow-hidden">
                <div className="border-b border-slate-100 p-6 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                        Topic List
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500 font-bold">
                        Loading topics...
                    </div>
                ) : topics.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-slate-500 font-bold">
                            No topics found.
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                            Create your first topic to start learning.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                        <thead className="bg-green-50 dark:bg-slate-950">
                        <tr>
                            <th className="text-left p-4 text-slate-500 text-sm">
                                ID
                            </th>
                            <th className="text-left p-4 text-slate-500 text-sm">
                                Name
                            </th>
                            <th className="text-left p-4 text-slate-500 text-sm">
                                Access
                            </th>
                            <th className="text-right p-4 text-slate-500 text-sm">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {topics.map((topic) => (
                            <tr
                                key={topic.id}
                                className="border-t border-slate-100 dark:border-slate-800"
                            >
                                <td className="p-4 text-slate-500">
                                    {topic.id}
                                </td>

                                <td className="p-4 font-bold text-slate-950 dark:text-white">
                                    {topic.name}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-bold ${
                                            topic.accessType === "PREMIUM"
                                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-200"
                                                : "bg-green-50 text-[#58CC02] dark:bg-green-950"
                                        }`}
                                    >
                                        {topic.accessType || "FREE"}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(topic)
                                            }
                                            className="rounded-xl bg-sky-50 px-4 py-2 font-bold text-[#1CB0F6] transition-all hover:bg-sky-100 focus:outline-none focus:ring-4 focus:ring-sky-100 dark:bg-sky-950"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(topic.id)
                                            }
                                            className="rounded-xl bg-red-50 px-4 py-2 font-bold text-red-500 transition-all hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100 dark:bg-red-950/40"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Topics;
