import { useEffect, useState } from "react";

import { getTopics } from "../services/topicService";
import {
    createVocabulary,
    deleteVocabulary,
    getVocabularyPage,
    searchVocabularies,
    updateVocabulary,
} from "../services/vocabularyService";

function Vocabularies() {
    const [vocabularies, setVocabularies] = useState([]);
    const [topics, setTopics] = useState([]);

    const [form, setForm] = useState({
        word: "",
        meaning: "",
        exampleSentence: "",
        topicId: "",
    });

    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchData = async (page = 0) => {
        try {
            setLoading(true);
            setErrorMessage("");

            const [pageData, topicData] = await Promise.all([
                getVocabularyPage(page, pageSize),
                getTopics(),
            ]);


            setVocabularies(pageData.content || []);
            setCurrentPage(pageData.number || 0);
            setTotalPages(pageData.totalPages || 0);
            setTopics(topicData);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load vocabulary data.");
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchKeyword("");
        setIsSearching(false);
        fetchData(0);
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            fetchData(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            fetchData(currentPage + 1);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        const keyword = searchKeyword.trim();

        if (!keyword) {
            handleClearSearch();
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            setIsSearching(true);

            const data = await searchVocabularies(keyword);
            setVocabularies(data);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to search vocabularies.");
            setIsSearching(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetForm = () => {
        setForm({
            word: "",
            meaning: "",
            exampleSentence: "",
            topicId: "",
        });

        setEditingId(null);
        setErrorMessage("");
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!form.word.trim()) {
            setErrorMessage("Word is required.");
            return;
        }

        if (!form.meaning.trim()) {
            setErrorMessage("Meaning is required.");
            return;
        }

        if (!form.topicId) {
            setErrorMessage("Please select a topic.");
            return;
        }

        const payload = {
            word: form.word.trim(),
            meaning: form.meaning.trim(),
            exampleSentence: form.exampleSentence.trim(),
            topicId: Number(form.topicId),
        };

        try {
            if (editingId) {
                await updateVocabulary(editingId, payload);
            } else {
                await createVocabulary(payload);
            }

            resetForm();

            if (isSearching) {
                handleClearSearch();
            } else {
                fetchData(currentPage);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to save vocabulary.");
        }
    };

    const handleEdit = (vocabulary) => {
        setEditingId(vocabulary.id);

        setForm({
            word: vocabulary.word || "",
            meaning: vocabulary.meaning || "",
            exampleSentence: vocabulary.exampleSentence || "",
            topicId: vocabulary.topicId ? String(vocabulary.topicId) : "",
        });

        setErrorMessage("");
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this vocabulary?")) return;

        try {
            await deleteVocabulary(id);

            if (editingId === id) {
                resetForm();
            }

            if (isSearching) {
                handleClearSearch();
            } else {
                fetchData(currentPage);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to delete vocabulary.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">
                        Manage Vocabulary
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Create, update, and manage English vocabulary.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSearch}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search vocabulary by word or meaning..."
                        className="border border-slate-200 bg-slate-50 rounded-2xl p-4 flex-1 outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="bg-[#1CB0F6] text-white px-7 py-4 rounded-2xl font-black shadow-md hover:scale-[1.02] transition-all"
                    >
                        Search
                    </button>

                    {isSearching && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="bg-slate-100 text-slate-600 px-7 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {isSearching && (
                    <p className="text-sm text-slate-500 font-bold mt-3">
                        Showing search results for:{" "}
                        <span className="text-[#1CB0F6]">
                            {searchKeyword}
                        </span>
                    </p>
                )}
            </form>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6"
            >
                <h2 className="text-xl font-black text-slate-800 mb-4">
                    {editingId ? "Edit Vocabulary" : "Add New Vocabulary"}
                </h2>

                {errorMessage && (
                    <div className="mb-4 bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-sm font-bold">
                        {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="word"
                        placeholder="Word"
                        className="border border-slate-200 bg-slate-50 rounded-2xl p-4 outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                        value={form.word}
                        onChange={handleChange}
                    />

                    <input
                        name="meaning"
                        placeholder="Meaning"
                        className="border border-slate-200 bg-slate-50 rounded-2xl p-4 outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                        value={form.meaning}
                        onChange={handleChange}
                    />

                    <input
                        name="exampleSentence"
                        placeholder="Example sentence"
                        className="border border-slate-200 bg-slate-50 rounded-2xl p-4 outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                        value={form.exampleSentence}
                        onChange={handleChange}
                    />

                    <select
                        name="topicId"
                        className="border border-slate-200 bg-slate-50 rounded-2xl p-4 outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                        value={form.topicId}
                        onChange={handleChange}
                    >
                        <option value="">Select topic</option>

                        {topics.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-5">
                    <button
                        type="submit"
                        className="bg-[#58CC02] text-white px-7 py-4 rounded-2xl font-black shadow-md hover:scale-[1.02] transition-all"
                    >
                        {editingId ? "Update Vocabulary" : "Add Vocabulary"}
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
                        Vocabulary List
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500 font-bold">
                        Loading vocabularies...
                    </div>
                ) : vocabularies.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-slate-500 font-bold">
                            No vocabularies found.
                        </p>

                        <p className="text-slate-400 text-sm mt-1">
                            Create your first vocabulary word.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left p-4 text-slate-500 text-sm">
                                        Word
                                    </th>

                                    <th className="text-left p-4 text-slate-500 text-sm">
                                        Meaning
                                    </th>

                                    <th className="text-left p-4 text-slate-500 text-sm">
                                        Example
                                    </th>

                                    <th className="text-left p-4 text-slate-500 text-sm">
                                        Topic
                                    </th>

                                    <th className="text-right p-4 text-slate-500 text-sm">
                                        Actions
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {vocabularies.map((vocabulary) => (
                                    <tr
                                        key={vocabulary.id}
                                        className="border-t border-slate-100"
                                    >
                                        <td className="p-4 font-black text-slate-800">
                                            {vocabulary.word}
                                        </td>

                                        <td className="p-4 text-slate-600">
                                            {vocabulary.meaning}
                                        </td>

                                        <td className="p-4 text-slate-500">
                                            {vocabulary.exampleSentence || "-"}
                                        </td>

                                        <td className="p-4">
                                                <span className="bg-green-50 text-[#58CC02] px-3 py-1 rounded-full text-sm font-black">
                                                    {vocabulary.topicName ||
                                                        "No topic"}
                                                </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            vocabulary
                                                        )
                                                    }
                                                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-500 font-black hover:bg-blue-100 transition-all"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            vocabulary.id
                                                        )
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
                        </div>

                        {!isSearching && totalPages > 1 && (
                            <div className="flex items-center justify-between p-5 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 0}
                                    className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-600 font-black disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <p className="font-bold text-slate-500">
                                    Page {currentPage + 1} of {totalPages}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-5 py-3 rounded-2xl bg-[#58CC02] text-white font-black disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Vocabularies;
