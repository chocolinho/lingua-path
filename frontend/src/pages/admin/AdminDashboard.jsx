import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    Brain,
    CheckCircle2,
    ChevronRight,
    ClipboardCheck,
    FileWarning,
    RefreshCw,
    ShieldCheck,
    Users,
} from "lucide-react";
import PageSkeleton from "../../components/PageSkeleton";
import { getAdminStats } from "../../services/adminService";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            setStats(await getAdminStats());
        } catch (error) {
            console.error(error);
            setErrorMessage("We could not load the administration overview. Check the connection and try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // The async loader owns the request lifecycle and related UI state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStats();
    }, [fetchStats]);

    if (loading) return <PageSkeleton variant="dashboard" />;

    const metrics = [
        { label: "Users", value: stats?.totalUsers ?? 0, helper: "Registered accounts", icon: Users, tone: "secondary" },
        { label: "Topics", value: stats?.totalTopics ?? 0, helper: "Learning topics", icon: BookOpen, tone: "primary" },
        { label: "Vocabulary", value: stats?.totalVocabularies ?? 0, helper: "Available words", icon: Brain, tone: "info" },
        { label: "Quiz attempts", value: stats?.quizAttempts ?? 0, helper: "Saved quiz sessions", icon: ClipboardCheck, tone: "success" },
        { label: "Pending topics", value: stats?.pendingTopics ?? 0, helper: "Need review", icon: FileWarning, tone: "warning" },
    ];

    return (
        <div className="app-page space-y-6">
            <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="ui-badge mb-4">
                        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                        Administration
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">System overview</h1>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
                        Monitor learning content and handle items that need administrator attention.
                    </p>
                </div>
                <button type="button" onClick={fetchStats} className="ui-button ui-button-outline shrink-0">
                    <RefreshCw className="h-5 w-5" aria-hidden="true" />
                    Refresh
                </button>
            </header>

            {errorMessage && (
                <div className="ui-alert flex flex-col gap-3 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
                    <span>{errorMessage}</span>
                    <button type="button" onClick={fetchStats} className="ui-button shrink-0 border border-red-300 bg-white text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
                        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
                    </button>
                </div>
            )}

            {stats && (
                <>
                    <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5" aria-label="Administration metrics">
                        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
                    </section>

                    <section className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                        <div className="space-y-5">
                            <section className="ui-panel-accent p-5 sm:p-6" aria-labelledby="review-title">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[var(--color-warning)] dark:bg-amber-950/40">
                                    <FileWarning className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <p className="mt-5 text-sm font-semibold text-[var(--color-text-muted)]">Action required</p>
                                <h2 id="review-title" className="mt-1 text-3xl font-bold tabular-nums">{stats.pendingTopics ?? 0} pending topics</h2>
                                <p className="mt-2 leading-6 text-[var(--color-text-muted)]">Review submitted topics before they become available to learners.</p>
                                <Link to="/admin/topics" className="ui-button ui-button-primary mt-5 w-full sm:w-auto">
                                    Review topics <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </Link>
                            </section>

                            <section className="ui-panel p-5 sm:p-6" aria-labelledby="coverage-title">
                                <h2 id="coverage-title" className="text-xl font-bold">Content coverage</h2>
                                <p className="mt-1 text-sm text-[var(--color-text-muted)]">Counts reported by the existing administration API.</p>
                                <dl className="mt-5 grid grid-cols-2 gap-3">
                                    <MiniStat label="Public topics" value={stats.publicTopics ?? 0} />
                                    <MiniStat label="Free topics" value={stats.freeTopics ?? 0} />
                                    <MiniStat label="Topics not pending" value={(stats.totalTopics ?? 0) - (stats.pendingTopics ?? 0)} />
                                    <MiniStat label="Admin accounts" value={stats.adminUsers ?? 0} />
                                </dl>
                            </section>
                        </div>

                        <section className="ui-panel p-5 sm:p-6" aria-labelledby="top-topics-title">
                            <div className="flex items-start gap-3">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h2 id="top-topics-title" className="text-xl font-bold">Largest topic collections</h2>
                                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Topics with the most vocabulary.</p>
                                </div>
                            </div>

                            {(stats.topTopicsByVocabularyCount ?? []).length === 0 ? (
                                <EmptyState />
                            ) : (
                                <ol className="mt-5 divide-y divide-[var(--color-border)]">
                                    {stats.topTopicsByVocabularyCount.map((topic, index) => (
                                        <li key={topic.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-subtle)] font-bold text-[var(--color-secondary)]">{index + 1}</span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-bold">{topic.name}</p>
                                                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{topic.visibility} · {topic.accessType} · {topic.approvalStatus}</p>
                                            </div>
                                            <span className="shrink-0 text-sm font-bold tabular-nums text-[var(--color-primary)]">{topic.vocabularyCount ?? 0} words</span>
                                        </li>
                                    ))}
                                </ol>
                            )}

                            <Link to="/admin/vocabularies" className="ui-button ui-button-outline mt-6 w-full">
                                Manage vocabulary <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        </section>
                    </section>
                </>
            )}
        </div>
    );
}

const metricTones = {
    primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    secondary: "bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]",
    info: "bg-sky-50 text-[var(--color-info)] dark:bg-sky-950/40",
    success: "bg-green-50 text-[var(--color-success)] dark:bg-green-950/40",
    warning: "bg-amber-50 text-[var(--color-warning)] dark:bg-amber-950/40",
};

function MetricCard({ label, value, helper, icon: Icon, tone }) {
    return (
        <article className="ui-card p-4 sm:p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metricTones[tone]}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">{value}</p>
            <p className="mt-1 hidden text-xs text-[var(--color-text-muted)] sm:block">{helper}</p>
        </article>
    );
}

function MiniStat({ label, value }) {
    return (
        <div className="rounded-xl bg-[var(--color-surface-subtle)] p-4">
            <dt className="text-sm font-semibold text-[var(--color-text-muted)]">{label}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums">{Math.max(Number(value || 0), 0)}</dd>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="mt-5 rounded-xl bg-[var(--color-surface-subtle)] p-7 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--color-success)]" aria-hidden="true" />
            <p className="mt-3 font-bold">No topic data yet</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Topic collections will appear after content is created.</p>
        </div>
    );
}

export default AdminDashboard;
