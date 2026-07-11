import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    BarChart3,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    RefreshCw,
    Target,
    Trophy,
} from "lucide-react";
import { getMyQuizResults } from "../services/quizService";
import PageSkeleton from "../components/PageSkeleton";

function MyQuizResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchResults = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const data = await getMyQuizResults();
            setResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setErrorMessage("We could not load your quiz history. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // The async loader owns the request lifecycle and related UI state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchResults();
    }, [fetchResults]);

    const summary = useMemo(() => {
        if (!results.length) return { average: 0, best: 0, correct: 0 };
        const scores = results.map((result) => Number(result.score || 0));
        return {
            average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
            best: Math.max(...scores),
            correct: results.reduce((sum, result) => sum + Number(result.correctAnswers || 0), 0),
        };
    }, [results]);

    if (loading) return <PageSkeleton variant="dashboard" />;

    return (
        <div className="app-page space-y-6">
            <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="ui-badge mb-4">
                        <Trophy className="h-4 w-4" aria-hidden="true" />
                        Quiz history
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Quiz results</h1>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
                        Review recent scores and use them to choose your next practice session.
                    </p>
                </div>
                <Link to="/quiz" className="ui-button ui-button-primary shrink-0">
                    <Target className="h-5 w-5" aria-hidden="true" />
                    Start a quiz
                </Link>
            </header>

            {errorMessage && (
                <div className="ui-alert flex flex-col gap-3 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
                    <span>{errorMessage}</span>
                    <button type="button" onClick={fetchResults} className="ui-button shrink-0 border border-red-300 bg-white text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
                        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry
                    </button>
                </div>
            )}

            {results.length > 0 && (
                <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Quiz result summary">
                    <SummaryCard icon={BarChart3} label="Attempts" value={results.length} />
                    <SummaryCard icon={Target} label="Average" value={`${formatScore(summary.average)}%`} />
                    <SummaryCard icon={Trophy} label="Best score" value={`${formatScore(summary.best)}%`} />
                    <SummaryCard icon={CheckCircle2} label="Correct answers" value={summary.correct} />
                </section>
            )}

            {(!errorMessage || results.length > 0) && <section aria-labelledby="result-list-title">
                <div className="mb-4">
                    <p className="text-sm font-semibold text-[var(--color-primary)]">Session history</p>
                    <h2 id="result-list-title" className="text-2xl font-bold">Recent attempts</h2>
                </div>

                {results.length === 0 ? (
                    <div className="ui-panel px-5 py-10 text-center">
                        <Target className="mx-auto h-10 w-10 text-[var(--color-text-muted)]" aria-hidden="true" />
                        <h3 className="mt-4 text-xl font-bold">No quiz results yet</h3>
                        <p className="mx-auto mt-2 max-w-md text-[var(--color-text-muted)]">Complete a quiz and your score history will appear here.</p>
                        <Link to="/quiz" className="ui-button ui-button-primary mt-5">Take your first quiz <ChevronRight className="h-4 w-4" aria-hidden="true" /></Link>
                    </div>
                ) : (
                    <ol className="grid gap-4 lg:grid-cols-2">
                        {results.map((result) => {
                            const score = Number(result.score || 0);
                            const accessibleScore = Math.min(Math.max(Math.round(score), 0), 100);
                            const scoreTone = score >= 80
                                ? "bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-200"
                                : score >= 60
                                  ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                                  : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200";
                            return (
                                <li key={result.id} className="ui-card p-5 sm:p-6">
                                    <article>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-[var(--color-secondary)]">{result.topicName || "Mixed practice"}</p>
                                                <h3 className="mt-1 text-xl font-bold">{result.correctAnswers} of {result.totalQuestions} correct</h3>
                                            </div>
                                            <span className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold tabular-nums ${scoreTone}`}>{formatScore(score)}%</span>
                                        </div>
                                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]" role="progressbar" aria-label={`${result.topicName || "Mixed practice"} score`} aria-valuenow={accessibleScore} aria-valuemin={0} aria-valuemax={100}>
                                            <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }} />
                                        </div>
                                        <p className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                            <CalendarDays className="h-4 w-4" aria-hidden="true" />
                                            {formatDate(result.submittedAt)}
                                        </p>
                                    </article>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </section>}
        </div>
    );
}

function SummaryCard({ icon: Icon, label, value }) {
    return (
        <article className="ui-card p-4 sm:p-5">
            <Icon className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">{value}</p>
        </article>
    );
}

function formatScore(value) {
    const number = Number(value || 0);
    return Number.isInteger(number) ? number.toString() : number.toFixed(1);
}

function formatDate(value) {
    if (!value) return "Date unavailable";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export default MyQuizResults;
