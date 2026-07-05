import { useEffect, useState } from "react";
import { Crown, Lock } from "lucide-react";

import { getTopics } from "../services/topicService";
import {
    createVocabulary,
    deleteVocabulary,
    getVocabularyPage,
    searchVocabularies,
    updateVocabulary,
} from "../services/vocabularyService";
import { useAuth } from "../context/AuthContext";
import PremiumLockedModal from "../components/PremiumLockedModal";

function Vocabularies() {
    const { isAdmin, isPremium } = useAuth();
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
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);

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
            if (error.response?.status === 403) {
                setErrorMessage(
                    error.response?.data?.message ||
                        "This action requires Premium."
                );
                setPremiumModalOpen(true);
                return;
            }

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
        <div className="app-page">
            <PremiumLockedModal
                open={premiumModalOpen}
                title="Vocabulary limit reached"
                description="Free learners can create up to 30 custom vocabularies. Premium unlocks unlimited custom vocabulary and export access."
                onClose={() => setPremiumModalOpen(false)}
            />

            <section className="kid-panel-soft mb-6 p-6 md:p-8">
                <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-3 py-1.5 text-sm font-black text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
                        <Crown className="h-4 w-4" />
                        Vocabulary workspace
                    </div>
                    <h1 className="text-3xl font-black text-slate-950 dark:text-white md:text-5xl">
                        Manage Vocabulary
                    </h1>

                    <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600 dark:text-slate-300">
                        Create, update, and manage English vocabulary.
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
                                Vocabulary Creator
                            </p>
                            <p className="font-bold text-slate-950 dark:text-white">
                                {isPremium
                                    ? "Unlimited custom vocabularies"
                                    : "Free plan: up to 30 custom vocabularies"}
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
                onSubmit={handleSearch}
                className="kid-panel mb-6 p-5"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search vocabulary by word or meaning..."
                        aria-label="Search vocabulary"
                        className="kid-input flex-1 p-4"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="rounded-2xl bg-[#1CB0F6] px-7 py-4 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-100"
                    >
                        Search
                    </button>

                    {isSearching && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="rounded-2xl bg-slate-100 px-7 py-4 font-bold text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:bg-slate-800 dark:text-slate-200"
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
                className="kid-panel mb-6 p-6"
            >
                <h2 className="mb-4 text-xl font-bold text-slate-950 dark:text-white">
                    {editingId ? "Edit Vocabulary" : "Add New Vocabulary"}
                </h2>

                {errorMessage && (
                    <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500 dark:bg-red-950/40">
                        {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="word"
                        placeholder="Word"
                        aria-label="Word"
                        className="kid-input p-4"
                        value={form.word}
                        onChange={handleChange}
                    />

                    <input
                        name="meaning"
                        placeholder="Meaning"
                        aria-label="Meaning"
                        className="kid-input p-4"
                        value={form.meaning}
                        onChange={handleChange}
                    />

                    <input
                        name="exampleSentence"
                        placeholder="Example sentence"
                        aria-label="Example sentence"
                        className="kid-input p-4"
                        value={form.exampleSentence}
                        onChange={handleChange}
                    />

                    <select
                        name="topicId"
                        aria-label="Topic"
                        className="kid-input p-4"
                        value={form.topicId}
                        onChange={handleChange}
                    >
                        <option value="">Select topic</option>

                        {topics.map((topic) => {
                            const canManageTopic =
                                isAdmin || topic.ownedByCurrentUser;

                            return (
                                <option
                                    key={topic.id}
                                    value={topic.id}
                                    disabled={!canManageTopic}
                                >
                                    {topic.name}
                                    {!canManageTopic ? " - read only" : ""}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-5">
                    <button
                        type="submit"
                        className="kid-button kid-button-green px-7 py-4"
                    >
                        {editingId ? "Update Vocabulary" : "Add Vocabulary"}
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
                                <thead className="bg-sky-50 dark:bg-slate-950">
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
                                {vocabularies.map((vocabulary) => {
                                    const topic = topics.find(
                                        (item) =>
                                            Number(item.id) ===
                                            Number(vocabulary.topicId)
                                    );
                                    const canManageVocabulary =
                                        isAdmin || topic?.ownedByCurrentUser;

                                    return (
                                        <tr
                                            key={vocabulary.id}
                                            className="border-t border-slate-100 dark:border-slate-800"
                                        >
                                        <td className="p-4 font-bold text-slate-950 dark:text-white">
                                            {vocabulary.word}
                                        </td>

                                        <td className="p-4 text-slate-600 dark:text-slate-300">
                                            {vocabulary.meaning}
                                        </td>

                                        <td className="p-4 text-slate-500 dark:text-slate-400">
                                            {vocabulary.exampleSentence || "-"}
                                        </td>

                                        <td className="p-4">
                                                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-[#58CC02] dark:bg-green-950">
                                                    {vocabulary.topicName ||
                                                        "No topic"}
                                                </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            vocabulary
                                                        )
                                                    }
                                                    disabled={!canManageVocabulary}
                                                    className="rounded-xl bg-sky-50 px-4 py-2 font-bold text-[#1CB0F6] transition-all hover:bg-sky-100 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-sky-950"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            vocabulary.id
                                                        )
                                                    }
                                                    disabled={!canManageVocabulary}
                                                    className="rounded-xl bg-red-50 px-4 py-2 font-bold text-red-500 transition-all hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-950/40"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>

                        {!isSearching && totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 p-5 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 0}
                                    className="rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-600 transition-all hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-200"
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
                                    className="rounded-2xl bg-[#58CC02] px-5 py-3 font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40"
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
