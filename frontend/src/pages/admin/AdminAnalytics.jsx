import { useEffect, useState } from "react";
import {
    BarChart3,
    BookOpen,
    Brain,
    Crown,
    Receipt,
    Target,
    Trophy,
    Users,
} from "lucide-react";
import PageSkeleton from "../../components/PageSkeleton";
import { getAdminAnalytics } from "../../services/adminService";

function AdminAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setErrorMessage("");
                setAnalytics(await getAdminAnalytics());
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to load platform analytics.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    const cards = [
        {
            label: "Total Users",
            value: analytics?.totalUsers ?? 0,
            helper: `${analytics?.activeUsers ?? 0} active this week`,
            icon: Users,
            color: "bg-sky-100 text-[#4338CA]",
        },
        {
            label: "Premium Users",
            value: analytics?.premiumUsers ?? 0,
            helper: `${analytics?.premiumConversionRate ?? 0}% conversion`,
            icon: Crown,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            label: "Quiz Attempts",
            value: analytics?.quizAttempts ?? 0,
            helper: `${analytics?.averagePlatformScore ?? 0}% average score`,
            icon: Target,
            color: "bg-purple-100 text-purple-600",
        },
        {
            label: "Topics",
            value: analytics?.totalTopics ?? 0,
            helper: `${analytics?.pendingTopics ?? 0} pending`,
            icon: BookOpen,
            color: "bg-green-100 text-[#0F766E]",
        },
    ];

    return (
        <div className="app-page space-y-6">
            <section className="ui-panel-accent p-6 md:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
                            <BarChart3 className="h-4 w-4" />
                            Platform analytics
                        </div>
                        <h1 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
                            Learning platform health.
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600 dark:text-slate-300">
                            Monitor user growth, premium adoption, quiz performance, and content coverage.
                        </p>
                    </div>

                    <div className="rounded-2xl border-2 border-sky-100 bg-white p-5 lg:min-w-72 dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            Premium Conversion
                        </p>
                        <p className="mt-1 text-5xl font-bold text-slate-950 dark:text-white">
                            {analytics?.premiumConversionRate ?? 0}%
                        </p>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className="h-full rounded-full bg-[#0F766E] transition-all duration-700"
                                style={{ width: `${analytics?.premiumConversionRate ?? 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <MetricCard key={card.label} {...card} />
                ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
                <Panel
                    title="Top Learners"
                    description="Highest XP accounts across the platform."
                    icon={<Trophy className="h-6 w-6" />}
                >
                    <div className="space-y-3">
                        {(analytics?.topLearners ?? []).length === 0 ? (
                            <EmptyState text="No learners yet." />
                        ) : (
                            analytics.topLearners.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl bg-green-50/70 p-4 dark:bg-green-950/20"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-slate-950 dark:text-white">
                                            #{index + 1} {user.username || user.email}
                                        </p>
                                        <p className="text-sm font-medium text-slate-400">
                                            Level {user.level} - {user.subscriptionType}
                                        </p>
                                    </div>
                                    <p className="shrink-0 text-xl font-bold text-[#0F766E]">
                                        {user.xp ?? 0} XP
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </Panel>

                <Panel
                    title="Content Coverage"
                    description="Vocabulary and topic health signals."
                    icon={<Brain className="h-6 w-6" />}
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <MiniStat label="Vocabularies" value={analytics?.totalVocabularies ?? 0} />
                        <MiniStat label="Public Topics" value={analytics?.publicTopics ?? 0} />
                        <MiniStat label="Premium Topics" value={analytics?.premiumTopics ?? 0} />
                        <MiniStat label="Free Users" value={analytics?.freeUsers ?? 0} />
                    </div>
                </Panel>
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
                <Panel
                    title="Top Topics"
                    description="Topics with the largest vocabulary collections."
                    icon={<BookOpen className="h-6 w-6" />}
                >
                    <div className="space-y-3">
                        {(analytics?.topTopics ?? []).length === 0 ? (
                            <EmptyState text="No topics yet." />
                        ) : (
                            analytics.topTopics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl bg-sky-50/70 p-4 dark:bg-sky-950/20"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-slate-950 dark:text-white">
                                            {topic.name}
                                        </p>
                                        <p className="text-sm font-bold text-slate-400">
                                            {topic.accessType} - {topic.approvalStatus}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#4338CA] dark:bg-slate-900">
                                        {topic.vocabularyCount} words
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Panel>

                <Panel
                    title="Recent Payments"
                    description="Latest Premium transactions."
                    icon={<Receipt className="h-6 w-6" />}
                >
                    <div className="space-y-3">
                        {(analytics?.recentPayments ?? []).length === 0 ? (
                            <EmptyState text="No payments yet." />
                        ) : (
                            analytics.recentPayments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl bg-yellow-50/70 p-4 dark:bg-yellow-950/20"
                                >
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-950 dark:text-white">
                                            {payment.planType} - ${payment.amount}
                                        </p>
                                        <p className="truncate text-sm font-bold text-slate-400">
                                            {payment.providerTransactionId}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-[#0F766E] dark:bg-green-950">
                                        {payment.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Panel>
            </section>
        </div>
    );
}

function MetricCard({ label, value, helper, icon: Icon, color }) {
    return (
        <article className="ui-card p-5">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-slate-400">{label}</p>
            <p className="mt-1 text-4xl font-bold text-slate-950 dark:text-white">{value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{helper}</p>
        </article>
    );
}

function Panel({ title, description, icon, children }) {
    return (
        <section className="ui-panel p-5">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[#4338CA] dark:bg-sky-950">
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
                    <p className="mt-1 font-medium text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

function MiniStat({ label, value }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
            <p className="text-sm font-semibold text-slate-400">{label}</p>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-6 text-center font-bold text-slate-400 dark:bg-slate-950">
            {text}
        </div>
    );
}

export default AdminAnalytics;
