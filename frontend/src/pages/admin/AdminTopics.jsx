import { useCallback, useEffect, useMemo, useState } from "react";
import {
    BookOpen,
    CheckCircle2,
    Eye,
    Filter,
    LoaderCircle,
    RefreshCw,
    Search,
    ShieldCheck,
    UserRound,
    X,
    XCircle,
} from "lucide-react";
import PageSkeleton from "../../components/PageSkeleton";
import {
    approveAdminTopic,
    getAdminTopics,
    rejectAdminTopic,
    updateAdminTopicAccessType,
} from "../../services/adminService";

const statusOptions = ["ALL", "PENDING", "APPROVED", "REJECTED"];
const accessOptions = ["ALL", "FREE", "PREMIUM"];

function AdminTopics() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingTopicId, setSavingTopicId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [accessFilter, setAccessFilter] = useState("ALL");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchTopics = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const data = await getAdminTopics();
            setTopics(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setErrorMessage("We could not load the topic queue. Check the connection and try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // The async loader owns the request lifecycle and related UI state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTopics();
    }, [fetchTopics]);

    const filteredTopics = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        return topics.filter((topic) => {
            const matchesSearch = !normalizedQuery ||
                topic.name?.toLowerCase().includes(normalizedQuery) ||
                topic.ownerUsername?.toLowerCase().includes(normalizedQuery);
            const matchesStatus = statusFilter === "ALL" || topic.approvalStatus === statusFilter;
            const matchesAccess = accessFilter === "ALL" || topic.accessType === accessFilter;
            return matchesSearch && matchesStatus && matchesAccess;
        });
    }, [accessFilter, searchQuery, statusFilter, topics]);

    const counts = useMemo(() => ({
        total: topics.length,
        pending: topics.filter((topic) => topic.approvalStatus === "PENDING").length,
        approved: topics.filter((topic) => topic.approvalStatus === "APPROVED").length,
        rejected: topics.filter((topic) => topic.approvalStatus === "REJECTED").length,
    }), [topics]);

    const updateTopicInState = (updatedTopic) => {
        setTopics((current) => current.map((topic) => topic.id === updatedTopic.id ? updatedTopic : topic));
    };

    const runTopicAction = async (topic, action, successText, needsConfirmation = false) => {
        if (needsConfirmation && !window.confirm(`Reject “${topic.name}”? The topic will not be available to learners.`)) return;

        try {
            setSavingTopicId(topic.id);
            setErrorMessage("");
            setSuccessMessage("");
            const updatedTopic = await action();
            updateTopicInState(updatedTopic);
            setSuccessMessage(successText);
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.message || "We could not update this topic. Try again.");
        } finally {
            setSavingTopicId(null);
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("ALL");
        setAccessFilter("ALL");
    };

    if (loading) return <PageSkeleton variant="dashboard" />;

    const filtersActive = Boolean(searchQuery.trim()) || statusFilter !== "ALL" || accessFilter !== "ALL";

    return (
        <div className="app-page space-y-6">
            <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="ui-badge mb-4">
                        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                        Content review
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Topic management</h1>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
                        Review topic details, control access, and decide what can appear in the learner application.
                    </p>
                </div>
                <button type="button" onClick={fetchTopics} className="ui-button ui-button-outline shrink-0">
                    <RefreshCw className="h-5 w-5" aria-hidden="true" /> Refresh
                </button>
            </header>

            {errorMessage && (
                <div className="ui-alert flex flex-col gap-3 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
                    <span>{errorMessage}</span>
                    <button type="button" onClick={fetchTopics} className="ui-button shrink-0 border border-red-300 bg-white text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
                        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
                    </button>
                </div>
            )}

            {successMessage && (
                <div className="ui-alert flex items-center gap-3 border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/30 dark:text-green-100" role="status" aria-live="polite">
                    <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{successMessage}</span>
                    <button type="button" onClick={() => setSuccessMessage("")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-green-100 dark:hover:bg-green-950" aria-label="Dismiss message">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            )}

            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Topic review summary">
                <SummaryCard label="Total" value={counts.total} icon={BookOpen} />
                <SummaryCard label="Pending" value={counts.pending} icon={Filter} tone="warning" />
                <SummaryCard label="Approved" value={counts.approved} icon={CheckCircle2} tone="success" />
                <SummaryCard label="Rejected" value={counts.rejected} icon={XCircle} tone="danger" />
            </section>

            <section className="ui-panel p-5" aria-labelledby="topic-filters-title">
                <div className="mb-4">
                    <h2 id="topic-filters-title" className="text-xl font-bold">Find topics</h2>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Search and filters apply to the loaded topic list.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_12rem_12rem_auto] xl:items-end">
                    <div>
                        <label htmlFor="admin-topic-search" className="mb-2 block text-sm font-bold">Topic or owner</label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true" />
                            <input id="admin-topic-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="ui-input py-3 pl-12 pr-4" placeholder="Search topics or owners" />
                        </div>
                    </div>
                    <FilterSelect id="admin-topic-status" label="Approval status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
                    <FilterSelect id="admin-topic-access" label="Access type" value={accessFilter} onChange={setAccessFilter} options={accessOptions} />
                    <button type="button" onClick={clearFilters} disabled={!filtersActive} className="ui-button ui-button-outline">
                        <X className="h-4 w-4" aria-hidden="true" /> Clear
                    </button>
                </div>
            </section>

            <section aria-labelledby="topic-results-title">
                <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-[var(--color-primary)]">Review queue</p>
                        <h2 id="topic-results-title" className="text-2xl font-bold">Topics</h2>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-[var(--color-text-muted)]">{filteredTopics.length} shown</p>
                </div>

                {filteredTopics.length === 0 ? (
                    <div className="ui-panel px-5 py-10 text-center">
                        <BookOpen className="mx-auto h-10 w-10 text-[var(--color-text-muted)]" aria-hidden="true" />
                        <h3 className="mt-4 text-xl font-bold">No matching topics</h3>
                        <p className="mx-auto mt-2 max-w-md text-[var(--color-text-muted)]">Change the search or filters to see more topics.</p>
                        {filtersActive && <button type="button" onClick={clearFilters} className="ui-button ui-button-outline mt-5">Clear filters</button>}
                    </div>
                ) : (
                    <div className="grid gap-4 xl:grid-cols-2">
                        {filteredTopics.map((topic) => (
                            <TopicCard key={topic.id} topic={topic} saving={savingTopicId === topic.id} onAction={runTopicAction} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function TopicCard({ topic, saving, onAction }) {
    return (
        <article className="ui-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                        <StatusBadge label={topic.approvalStatus || "APPROVED"} />
                        <span className="ui-badge">{topic.accessType || "FREE"}</span>
                    </div>
                    <h3 className="mt-4 break-words text-xl font-bold">{topic.name}</h3>
                    <p className="mt-2 break-words leading-6 text-[var(--color-text-muted)]">{topic.description || "No description provided."}</p>
                </div>
                {saving && <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-[var(--color-secondary)]" aria-label="Saving topic" />}
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[var(--color-surface-subtle)] p-4 sm:grid-cols-3">
                <Detail icon={UserRound} label="Owner" value={topic.ownerUsername || "Platform"} />
                <Detail icon={BookOpen} label="Vocabulary" value={`${topic.vocabularyCount ?? 0} words`} />
                <Detail icon={Eye} label="Visibility" value={topic.visibility || "PUBLIC"} />
            </dl>

            <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                <label htmlFor={`topic-access-${topic.id}`} className="mb-2 block text-sm font-bold">Access type</label>
                <select
                    id={`topic-access-${topic.id}`}
                    value={topic.accessType || "FREE"}
                    disabled={saving}
                    onChange={(event) => onAction(topic, () => updateAdminTopicAccessType(topic.id, event.target.value), `“${topic.name}” access updated.`)}
                    className="ui-input px-4"
                >
                    <option value="FREE">Free</option>
                    <option value="PREMIUM">Premium</option>
                </select>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    disabled={saving || topic.approvalStatus === "APPROVED"}
                    onClick={() => onAction(topic, () => approveAdminTopic(topic.id), `“${topic.name}” approved.`)}
                    className="ui-button border border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-100"
                >
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Approve
                </button>
                <button
                    type="button"
                    disabled={saving || topic.approvalStatus === "REJECTED"}
                    onClick={() => onAction(topic, () => rejectAdminTopic(topic.id), `“${topic.name}” rejected.`, true)}
                    className="ui-button border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100"
                >
                    <XCircle className="h-5 w-5" aria-hidden="true" /> Reject
                </button>
            </div>
        </article>
    );
}

function FilterSelect({ id, label, value, onChange, options }) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-bold">{label}</label>
            <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="ui-input px-4">
                {options.map((option) => <option key={option} value={option}>{option === "ALL" ? "All" : option}</option>)}
            </select>
        </div>
    );
}

const summaryTones = {
    default: "bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]",
    warning: "bg-amber-50 text-[var(--color-warning)] dark:bg-amber-950/40",
    success: "bg-green-50 text-[var(--color-success)] dark:bg-green-950/40",
    danger: "bg-red-50 text-[var(--color-danger)] dark:bg-red-950/40",
};

function SummaryCard({ label, value, icon: Icon, tone = "default" }) {
    return (
        <article className="ui-card p-4 sm:p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${summaryTones[tone]}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
            <p className="mt-4 text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">{value}</p>
        </article>
    );
}

function Detail({ icon: Icon, label, value }) {
    return (
        <div className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]"><Icon className="h-3.5 w-3.5" aria-hidden="true" />{label}</dt>
            <dd className="mt-1 truncate text-sm font-bold" title={String(value)}>{value}</dd>
        </div>
    );
}

function StatusBadge({ label }) {
    const tones = {
        APPROVED: "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-100",
        PENDING: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100",
        REJECTED: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100",
    };
    return <span className={`inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-bold ${tones[label] || tones.PENDING}`}>{label}</span>;
}

export default AdminTopics;
