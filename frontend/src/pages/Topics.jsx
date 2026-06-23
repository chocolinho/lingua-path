import { useEffect, useState } from "react";
import {
    createTopic,
    deleteTopic,
    getTopics,
    updateTopic,
} from "../services/topicService";

function Topics() {
    const [topics, setTopics] = useState([]);
    const [name, setName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">
                        Manage Topics
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Create and manage learning topics.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6"
            >
                <h2 className="text-xl font-black text-slate-800 mb-4">
                    {editingId ? "Edit Topic" : "Add New Topic"}
                </h2>

                {errorMessage && (
                    <div className="mb-4 bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-sm font-bold">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Topic name"
                        className="border border-slate-200 bg-slate-50 rounded-2xl p-4 flex-1 outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="bg-[#58CC02] text-white px-7 py-4 rounded-2xl font-black shadow-md hover:scale-[1.02] transition-all"
                    >
                        {editingId ? "Update Topic" : "Add Topic"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-slate-100 text-slate-600 px-7 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-800">
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
                    <table className="w-full">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left p-4 text-slate-500 text-sm">
                                ID
                            </th>
                            <th className="text-left p-4 text-slate-500 text-sm">
                                Name
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
                                className="border-t border-slate-100"
                            >
                                <td className="p-4 text-slate-500">
                                    {topic.id}
                                </td>

                                <td className="p-4 font-bold text-slate-800">
                                    {topic.name}
                                </td>

                                <td className="p-4">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() =>
                                                handleEdit(topic)
                                            }
                                            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-500 font-black hover:bg-blue-100 transition-all"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(topic.id)
                                            }
                                            className="px-4 py-2 rounded-xl bg-red-50 text-red-500 font-black hover:bg-red-100 transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Topics;