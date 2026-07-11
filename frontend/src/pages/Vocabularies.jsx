import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CircleDot,
    Crown,
    Heart,
    LoaderCircle,
    Lock,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    Volume2,
    X,
} from "lucide-react";

import { getTopics } from "../services/topicService";
import {
    createVocabulary,
    deleteVocabulary,
    getVocabularyPage,
    getVocabularyProgress,
    searchVocabularies,
    updateVocabulary,
    updateVocabularyProgress,
} from "../services/vocabularyService";
import {
    addFavoriteVocabulary,
    getMyFavorites,
    removeFavoriteVocabulary,
} from "../services/favoriteService";
import { useAuth } from "../context/AuthContext";
import PremiumLockedModal from "../components/PremiumLockedModal";

const PAGE_SIZE = 8;
const EMPTY_FORM = {
    word: "",
    meaning: "",
    exampleSentence: "",
    topicId: "",
};

const progressOptions = [
    { value: "NEW", label: "New" },
    { value: "LEARNING", label: "Learning" },
    { value: "MASTERED", label: "Mastered" },
];

function Vocabularies() {
    const { isAdmin, isPremium } = useAuth();
    const editorHeadingRef = useRef(null);
    const [vocabularies, setVocabularies] = useState([]);
    const [topics, setTopics] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [progressByVocabulary, setProgressByVocabulary] = useState(new Map());
    const [form, setForm] = useState(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = useState({});
    const [searchKeyword, setSearchKeyword] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [busyVocabularyId, setBusyVocabularyId] = useState(null);
    const [dataError, setDataError] = useState("");
    const [supportWarning, setSupportWarning] = useState("");
    const [favoritesAvailable, setFavoritesAvailable] = useState(true);
    const [progressAvailable, setProgressAvailable] = useState(true);
    const [formError, setFormError] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);

    const loadWorkspace = useCallback(async (page = 0) => {
        try {
            setLoading(true);
            setDataError("");
            setSupportWarning("");

            const [pageData, topicData] = await Promise.all([
                getVocabularyPage(page, PAGE_SIZE),
                getTopics(),
            ]);
            const [favoriteResult, progressResult] = await Promise.allSettled([
                getMyFavorites(),
                getVocabularyProgress(),
            ]);
            const favoriteData = favoriteResult.status === "fulfilled" ? favoriteResult.value : [];
            const progressData = progressResult.status === "fulfilled" ? progressResult.value : [];
            const canUseFavorites = favoriteResult.status === "fulfilled";
            const canUseProgress = progressResult.status === "fulfilled";

            setVocabularies(Array.isArray(pageData?.content) ? pageData.content : []);
            setCurrentPage(Number(pageData?.number || 0));
            setTotalPages(Number(pageData?.totalPages || 0));
            setTopics(Array.isArray(topicData) ? topicData : []);
            setFavoritesAvailable(canUseFavorites);
            setProgressAvailable(canUseProgress);
            setFavoriteIds(
                new Set(
                    (Array.isArray(favoriteData) ? favoriteData : [])
                        .map((favorite) => favorite.vocabulary?.id)
                        .filter(Boolean)
                )
            );
            setProgressByVocabulary(
                new Map(
                    (Array.isArray(progressData) ? progressData : [])
                        .filter((entry) => entry.vocabulary?.id)
                        .map((entry) => [entry.vocabulary.id, entry])
                )
            );
            setActiveSearch("");
            if (!canUseFavorites || !canUseProgress) {
                setSupportWarning("Vocabulary loaded, but favorites or learning status are temporarily unavailable. Retry before changing those items.");
            }
        } catch (error) {
            console.error(error);
            setDataError("We could not load your vocabulary workspace. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // The async loader owns the request lifecycle and related UI state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadWorkspace();
    }, [loadWorkspace]);

    const topicsById = useMemo(
        () => new Map(topics.map((topic) => [Number(topic.id), topic])),
        [topics]
    );
    const manageableTopics = useMemo(
        () => topics.filter((topic) => isAdmin || topic.ownedByCurrentUser),
        [isAdmin, topics]
    );

    const handleSearch = async (event) => {
        event.preventDefault();
        const keyword = searchKeyword.trim();

        if (!keyword) {
            await loadWorkspace(0);
            return;
        }

        try {
            setSearching(true);
            setDataError("");
            const data = await searchVocabularies(keyword);
            setVocabularies(Array.isArray(data) ? data : []);
            setActiveSearch(keyword);
        } catch (error) {
            console.error(error);
            setDataError("We could not complete that search. Try again or clear the search.");
        } finally {
            setSearching(false);
        }
    };

    const clearSearch = async () => {
        setSearchKeyword("");
        setActiveSearch("");
        await loadWorkspace(0);
    };

    const openCreateEditor = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setFieldErrors({});
        setFormError("");
        setEditorOpen(true);
        window.requestAnimationFrame(() => editorHeadingRef.current?.focus());
    };

    const openEditEditor = (vocabulary) => {
        setEditingId(vocabulary.id);
        setForm({
            word: vocabulary.word || "",
            meaning: vocabulary.meaning || "",
            exampleSentence: vocabulary.exampleSentence || "",
            topicId: vocabulary.topicId ? String(vocabulary.topicId) : "",
        });
        setFieldErrors({});
        setFormError("");
        setEditorOpen(true);
        window.requestAnimationFrame(() => editorHeadingRef.current?.focus());
    };

    const closeEditor = () => {
        setEditorOpen(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        setFieldErrors({});
        setFormError("");
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((current) => ({ ...current, [name]: "" }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!form.word.trim()) errors.word = "Enter the English word.";
        if (!form.meaning.trim()) errors.meaning = "Enter a meaning.";
        if (!form.topicId) errors.topicId = "Choose a topic you can manage.";
        setFieldErrors(errors);
        const firstError = Object.keys(errors)[0];
        if (firstError) {
            const fieldId = firstError === "topicId" ? "vocabulary-topic" : `vocabulary-${firstError}`;
            window.requestAnimationFrame(() => document.getElementById(fieldId)?.focus());
        }
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");
        setAnnouncement("");
        if (!validateForm()) return;

        const payload = {
            word: form.word.trim(),
            meaning: form.meaning.trim(),
            exampleSentence: form.exampleSentence.trim(),
            topicId: Number(form.topicId),
        };

        try {
            setSaving(true);
            if (editingId) {
                await updateVocabulary(editingId, payload);
            } else {
                await createVocabulary(payload);
            }
            setAnnouncement(editingId ? "Vocabulary updated." : "Vocabulary added.");
            closeEditor();
            setSearchKeyword("");
            await loadWorkspace(0);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 403) {
                setFormError(error.response?.data?.message || "This action requires Premium.");
                setPremiumModalOpen(true);
            } else {
                setFormError("We could not save this vocabulary. Review the fields and try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (vocabulary) => {
        if (!window.confirm(`Delete “${vocabulary.word}”? This cannot be undone.`)) return;

        try {
            setBusyVocabularyId(vocabulary.id);
            setDataError("");
            setAnnouncement("");
            await deleteVocabulary(vocabulary.id);
            setAnnouncement(`${vocabulary.word} deleted.`);
            await loadWorkspace(currentPage);
        } catch (error) {
            console.error(error);
            setDataError("We could not delete that vocabulary. Try again.");
        } finally {
            setBusyVocabularyId(null);
        }
    };

    const toggleFavorite = async (vocabulary) => {
        const isFavorite = favoriteIds.has(vocabulary.id);
        try {
            setBusyVocabularyId(vocabulary.id);
            setDataError("");
            setAnnouncement("");
            if (isFavorite) {
                await removeFavoriteVocabulary(vocabulary.id);
            } else {
                await addFavoriteVocabulary(vocabulary.id);
            }
            setFavoriteIds((current) => {
                const next = new Set(current);
                if (isFavorite) next.delete(vocabulary.id);
                else next.add(vocabulary.id);
                return next;
            });
            setAnnouncement(isFavorite ? `${vocabulary.word} removed from favorites.` : `${vocabulary.word} added to favorites.`);
        } catch (error) {
            console.error(error);
            setDataError("We could not update that favorite. Try again.");
        } finally {
            setBusyVocabularyId(null);
        }
    };

    const changeProgress = async (vocabulary, status) => {
        try {
            setBusyVocabularyId(vocabulary.id);
            setDataError("");
            setAnnouncement("");
            const updated = await updateVocabularyProgress(vocabulary.id, status);
            setProgressByVocabulary((current) => {
                const next = new Map(current);
                next.set(vocabulary.id, updated);
                return next;
            });
            setAnnouncement(`${vocabulary.word} marked ${status.toLowerCase()}.`);
        } catch (error) {
            console.error(error);
            setDataError("We could not update that learning status. Try again.");
        } finally {
            setBusyVocabularyId(null);
        }
    };

    const speak = (word) => {
        if (!word || !window.speechSynthesis) {
            setDataError("Pronunciation is not available in this browser.");
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="app-page space-y-6">
            <PremiumLockedModal
                open={premiumModalOpen}
                title="Vocabulary limit reached"
                description="Free learners can create up to 30 custom vocabularies. Premium unlocks unlimited custom vocabulary and export access."
                onClose={() => setPremiumModalOpen(false)}
            />
            {announcement && (
                <div className="ui-alert flex items-center gap-3 border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/30 dark:text-green-100" role="status" aria-live="polite">
                    <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{announcement}</span>
                    <button type="button" onClick={() => setAnnouncement("")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-green-100 dark:hover:bg-green-950" aria-label="Dismiss message">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            )}

            <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="ui-badge mb-4">
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        Vocabulary workspace
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Vocabulary</h1>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
                        Search meanings, hear pronunciation, track learning status, and manage words in topics you own.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openCreateEditor}
                    disabled={manageableTopics.length === 0}
                    className="ui-button ui-button-primary shrink-0"
                    title={manageableTopics.length ? undefined : "Create or own a topic before adding vocabulary"}
                >
                    <Plus className="h-5 w-5" aria-hidden="true" />
                    Add vocabulary
                </button>
            </header>

            <section className="ui-panel p-5" aria-labelledby="vocabulary-search-title">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                    <form onSubmit={handleSearch} className="min-w-0">
                        <label id="vocabulary-search-title" htmlFor="vocabulary-search" className="mb-2 block text-sm font-bold">
                            Search vocabulary
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative min-w-0 flex-1">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true" />
                                <input
                                    id="vocabulary-search"
                                    type="search"
                                    value={searchKeyword}
                                    onChange={(event) => setSearchKeyword(event.target.value)}
                                    className="ui-input py-3 pl-12 pr-4"
                                    placeholder="Search by word or meaning"
                                />
                            </div>
                            <button type="submit" disabled={searching} className="ui-button ui-button-secondary sm:min-w-32">
                                {searching ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
                                {searching ? "Searching" : "Search"}
                            </button>
                            {activeSearch && (
                                <button type="button" onClick={clearSearch} className="ui-button ui-button-outline">
                                    <X className="h-5 w-5" aria-hidden="true" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="flex items-center gap-3 rounded-xl bg-[var(--color-surface-subtle)] px-4 py-3">
                        {isPremium ? <Crown className="h-5 w-5 text-[var(--color-warning)]" aria-hidden="true" /> : <Lock className="h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />}
                        <div>
                            <p className="text-xs font-semibold text-[var(--color-text-muted)]">Creator access</p>
                            <p className="text-sm font-bold">{isPremium ? "Unlimited custom words" : "Up to 30 custom words"}</p>
                        </div>
                    </div>
                </div>
                {activeSearch && (
                    <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                        Results for <span className="font-bold text-[var(--color-secondary)]">“{activeSearch}”</span>
                    </p>
                )}
            </section>

            {editorOpen && (
                <section className="ui-panel-accent p-5 sm:p-6" aria-labelledby="vocabulary-editor-title">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 id="vocabulary-editor-title" ref={editorHeadingRef} tabIndex={-1} className="text-2xl font-bold">
                                {editingId ? "Edit vocabulary" : "Add vocabulary"}
                            </h2>
                            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Add clear meaning and context to support future practice.</p>
                        </div>
                        <button type="button" onClick={closeEditor} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-text-muted)]" aria-label="Close vocabulary editor">
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    {formError && <div className="ui-alert mb-5 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100" role="alert">{formError}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField label="English word" name="word" value={form.word} onChange={handleChange} error={fieldErrors.word} autoComplete="off" />
                            <FormField label="Meaning" name="meaning" value={form.meaning} onChange={handleChange} error={fieldErrors.meaning} autoComplete="off" />
                            <div className="md:col-span-2">
                                <FormField label="Example sentence" name="exampleSentence" value={form.exampleSentence} onChange={handleChange} helper="Optional. Use a natural sentence that makes the meaning clear." autoComplete="off" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="vocabulary-topic" className="mb-2 block text-sm font-bold">Topic</label>
                                <select id="vocabulary-topic" name="topicId" value={form.topicId} onChange={handleChange} className="ui-input px-4" aria-invalid={Boolean(fieldErrors.topicId)} aria-describedby={fieldErrors.topicId ? "vocabulary-topic-error" : undefined}>
                                    <option value="">Choose a topic</option>
                                    {manageableTopics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                                </select>
                                {fieldErrors.topicId && <p id="vocabulary-topic-error" className="mt-2 text-sm font-semibold text-[var(--color-danger)]">{fieldErrors.topicId}</p>}
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button type="submit" disabled={saving} className="ui-button ui-button-primary">
                                {saving && <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />}
                                {saving ? "Saving" : editingId ? "Save changes" : "Add vocabulary"}
                            </button>
                            <button type="button" onClick={closeEditor} className="ui-button ui-button-outline">Cancel</button>
                        </div>
                    </form>
                </section>
            )}

            {dataError && (
                <div className="ui-alert flex flex-col gap-3 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
                    <span>{dataError}</span>
                    <button type="button" onClick={() => loadWorkspace(currentPage)} className="ui-button shrink-0 border border-red-300 bg-white text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
                        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry
                    </button>
                </div>
            )}

            {supportWarning && (
                <div className="ui-alert flex flex-col gap-3 border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between" role="status">
                    <span>{supportWarning}</span>
                    <button type="button" onClick={() => loadWorkspace(currentPage)} className="ui-button shrink-0 border border-amber-400 bg-white text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
                        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry tools
                    </button>
                </div>
            )}

            <section aria-labelledby="vocabulary-list-title">
                <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-[var(--color-primary)]">Word library</p>
                        <h2 id="vocabulary-list-title" className="text-2xl font-bold">{activeSearch ? "Search results" : "Vocabulary list"}</h2>
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-text-muted)]">{vocabularies.length} shown</p>
                </div>

                {loading ? (
                    <VocabularySkeleton />
                ) : dataError && vocabularies.length === 0 ? null : vocabularies.length === 0 ? (
                    <div className="ui-panel px-5 py-10 text-center">
                        <BookOpen className="mx-auto h-10 w-10 text-[var(--color-text-muted)]" aria-hidden="true" />
                        <h3 className="mt-4 text-xl font-bold">{activeSearch ? "No matching vocabulary" : "No vocabulary yet"}</h3>
                        <p className="mx-auto mt-2 max-w-md text-[var(--color-text-muted)]">
                            {activeSearch ? `No words or meanings matched “${activeSearch}”. Try another search or clear it.` : "Add vocabulary to a topic you own, or return after your topic library has words."}
                        </p>
                        {activeSearch && <button type="button" onClick={clearSearch} className="ui-button ui-button-outline mt-5">Clear search</button>}
                    </div>
                ) : (
                    <div className="grid gap-4 xl:grid-cols-2">
                        {vocabularies.map((vocabulary) => {
                            const topic = topicsById.get(Number(vocabulary.topicId));
                            const canManage = isAdmin || topic?.ownedByCurrentUser;
                            const isFavorite = favoriteIds.has(vocabulary.id);
                            const progressEntry = progressByVocabulary.get(vocabulary.id);
                            const progressStatus = progressEntry?.status || "NEW";
                            const busy = busyVocabularyId === vocabulary.id;

                            return (
                                <VocabularyCard
                                    key={vocabulary.id}
                                    vocabulary={vocabulary}
                                    canManage={canManage}
                                    isFavorite={isFavorite}
                                    progressStatus={progressStatus}
                                    busy={busy}
                                    favoritesAvailable={favoritesAvailable}
                                    progressAvailable={progressAvailable}
                                    onSpeak={speak}
                                    onToggleFavorite={toggleFavorite}
                                    onProgressChange={changeProgress}
                                    onEdit={openEditEditor}
                                    onDelete={handleDelete}
                                />
                            );
                        })}
                    </div>
                )}

                {!loading && !activeSearch && totalPages > 1 && (
                    <nav className="mt-6 flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Vocabulary pagination">
                        <button type="button" onClick={() => loadWorkspace(currentPage - 1)} disabled={currentPage === 0 || loading} className="ui-button ui-button-outline">
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Previous
                        </button>
                        <p className="text-center text-sm font-bold tabular-nums text-[var(--color-text-muted)]">Page {currentPage + 1} of {totalPages}</p>
                        <button type="button" onClick={() => loadWorkspace(currentPage + 1)} disabled={currentPage >= totalPages - 1 || loading} className="ui-button ui-button-primary">
                            Next <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                )}
            </section>
        </div>
    );
}

function FormField({ label, name, value, onChange, error, helper, autoComplete }) {
    const inputId = `vocabulary-${name}`;
    const descriptionId = error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined;

    return (
        <div>
            <label htmlFor={inputId} className="mb-2 block text-sm font-bold">{label}</label>
            <input id={inputId} name={name} value={value} onChange={onChange} autoComplete={autoComplete} className="ui-input px-4" aria-invalid={Boolean(error)} aria-describedby={descriptionId} />
            {error && <p id={`${inputId}-error`} className="mt-2 text-sm font-semibold text-[var(--color-danger)]">{error}</p>}
            {!error && helper && <p id={`${inputId}-helper`} className="mt-2 text-sm text-[var(--color-text-muted)]">{helper}</p>}
        </div>
    );
}

function VocabularyCard({ vocabulary, canManage, isFavorite, progressStatus, busy, favoritesAvailable, progressAvailable, onSpeak, onToggleFavorite, onProgressChange, onEdit, onDelete }) {
    return (
        <article className="ui-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <span className="ui-badge">{vocabulary.topicName || "No topic"}</span>
                    <h3 className="mt-3 break-words text-2xl font-bold sm:text-3xl">{vocabulary.word}</h3>
                    <p className="mt-2 break-words text-lg font-semibold text-[var(--color-primary-hover)]">{vocabulary.meaning}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => onSpeak(vocabulary.word)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary-soft)]" aria-label={`Pronounce ${vocabulary.word}`}>
                        <Volume2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => onToggleFavorite(vocabulary)} disabled={busy || !favoritesAvailable} className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${isFavorite ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"}`} aria-label={favoritesAvailable ? (isFavorite ? `Remove ${vocabulary.word} from favorites` : `Add ${vocabulary.word} to favorites`) : "Favorites temporarily unavailable"} aria-pressed={isFavorite}>
                        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="mt-5 rounded-xl bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Example</p>
                <p className="mt-2 break-words leading-7">{vocabulary.exampleSentence || "No example sentence has been added."}</p>
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="sm:max-w-52">
                    <label htmlFor={`progress-${vocabulary.id}`} className="mb-2 block text-sm font-bold">Learning status</label>
                    <div className="relative">
                        {progressStatus === "MASTERED" ? <CheckCircle2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-success)]" aria-hidden="true" /> : <CircleDot className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-primary)]" aria-hidden="true" />}
                        <select id={`progress-${vocabulary.id}`} value={progressStatus} onChange={(event) => onProgressChange(vocabulary, event.target.value)} disabled={busy || !progressAvailable} className="ui-input py-2 pl-11 pr-8 text-sm" aria-label={progressAvailable ? undefined : `Learning status for ${vocabulary.word} is temporarily unavailable`}>
                            {progressOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                    </div>
                </div>

                {canManage && (
                    <div className="flex gap-2">
                        <button type="button" onClick={() => onEdit(vocabulary)} disabled={busy} className="ui-button ui-button-outline px-4">
                            <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
                        </button>
                        <button type="button" onClick={() => onDelete(vocabulary)} disabled={busy} className="ui-button border border-red-200 bg-red-50 px-4 text-[var(--color-danger)] dark:border-red-900 dark:bg-red-950/30">
                            <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}

function VocabularySkeleton() {
    return (
        <div className="grid gap-4 xl:grid-cols-2" aria-label="Loading vocabulary">
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="ui-card animate-pulse p-6">
                    <div className="h-7 w-24 rounded-full bg-[var(--color-surface-subtle)]" />
                    <div className="mt-4 h-8 w-2/5 rounded-lg bg-[var(--color-surface-subtle)]" />
                    <div className="mt-3 h-6 w-3/5 rounded-lg bg-[var(--color-surface-subtle)]" />
                    <div className="mt-5 h-24 rounded-xl bg-[var(--color-surface-subtle)]" />
                </div>
            ))}
        </div>
    );
}

export default Vocabularies;
