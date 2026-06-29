import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    BarChart3,
    BookOpen,
    Brain,
    CheckCircle2,
    ClipboardCheck,
    Crown,
    CreditCard,
    FileText,
    Lock,
    Receipt,
    ShieldCheck,
    Sparkles,
    Trophy,
    Users,
} from "lucide-react";
import PageSkeleton from "../../components/PageSkeleton";
import { getAdminStats } from "../../services/adminService";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setErrorMessage("");
                setStats(await getAdminStats());
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to load admin statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const conversionRate = useMemo(() => {
        const totalUsers = stats?.totalUsers ?? 0;
        if (totalUsers === 0) return 0;
        return Math.round(((stats?.premiumUsers ?? 0) / totalUsers) * 100);
    }, [stats]);

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    const primaryCards = [
        {
            label: "Total Users",
            value: stats?.totalUsers ?? 0,
            helper: `${stats?.adminUsers ?? 0} admins`,
            icon: Users,
            color: "bg-sky-100 text-[#1CB0F6]",
        },
        {
            label: "Premium Users",
            value: stats?.premiumUsers ?? 0,
            helper: `${conversionRate}% conversion`,
            icon: Crown,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            label: "Topics",
            value: stats?.totalTopics ?? 0,
            helper: `${stats?.pendingTopics ?? 0} pending review`,
            icon: BookOpen,
            color: "bg-green-100 text-[#58CC02]",
        },
        {
            label: "Quiz Attempts",
            value: stats?.quizAttempts ?? stats?.totalQuizAttempts ?? 0,
            helper: "all saved attempts",
            icon: ClipboardCheck,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    const detailCards = [
        { label: "Free Users", value: stats?.freeUsers ?? 0, icon: Lock },
        { label: "Free Topics", value: stats?.freeTopics ?? 0, icon: BookOpen },
        { label: "Premium Topics", value: stats?.premiumTopics ?? 0, icon: Crown },
        { label: "Public Topics", value: stats?.publicTopics ?? 0, icon: Sparkles },
        { label: "Vocabularies", value: stats?.totalVocabularies ?? 0, icon: Brain },
        { label: "Payments", value: stats?.totalPayments ?? 0, icon: Receipt },
        { label: "Successful Payments", value: stats?.successfulPayments ?? 0, icon: CheckCircle2 },
        { label: "Yearly Plans", value: stats?.yearlySubscriptions ?? 0, icon: CreditCard },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-[2rem] bg-gradient-to-br from-[#1CB0F6] via-[#58CC02] to-[#CE82FF] p-6 text-white shadow-xl shadow-sky-100 md:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black">
                            <BarChart3 className="h-4 w-4" />
                            Admin analytics
                        </div>
                        <h1 className="text-3xl font-black md:text-5xl">
                            Platform Control Center
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold text-white/90">
                            Monitor learners, content access, premium activity, and content quality from one dashboard.
                        </p>
                    </div>

                    <div className="rounded-[1.75rem] bg-white/20 p-5 backdrop-blur lg:min-w-72">
                        <p className="text-sm font-black text-white/75">
                            Premium Conversion
                        </p>
                        <p className="mt-1 text-5xl font-black">
                            {conversionRate}%
                        </p>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/25">
                            <div
                                className="h-full rounded-full bg-white transition-all duration-700"
                                style={{ width: `${conversionRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    {errorMessage}
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {primaryCards.map((card) => (
                    <MetricCard key={card.label} {...card} />
                ))}
            </section>

            <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {detailCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <article
                            key={card.label}
                            className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
                        >
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="text-2xl font-black text-slate-900">
                                {card.value}
                            </p>
                            <p className="text-xs font-black text-slate-400">
                                {card.label}
                            </p>
                        </article>
                    );
                })}
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <Panel
                    title="Action Required"
                    description="Content and payment signals that deserve admin attention."
                    icon={<ShieldCheck className="h-6 w-6" />}
                >
                    <div className="grid gap-3 sm:grid-cols-3">
                        <AlertCard
                            label="Pending Topics"
                            value={stats?.pendingTopics ?? 0}
                            tone="bg-yellow-50 text-yellow-700"
                        />
                        <AlertCard
                            label="Monthly Plans"
                            value={stats?.monthlySubscriptions ?? 0}
                            tone="bg-sky-50 text-[#1CB0F6]"
                        />
                        <AlertCard
                            label="Premium Topics"
                            value={stats?.premiumTopics ?? 0}
                            tone="bg-purple-50 text-purple-600"
                        />
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <QuickAction to="/admin/topics" icon={<BookOpen className="h-5 w-5" />}>
                            Manage Topics
                        </QuickAction>
                        <QuickAction to="/payments" icon={<Receipt className="h-5 w-5" />}>
                            User Payments
                        </QuickAction>
                        <QuickAction to="/dashboard" icon={<FileText className="h-5 w-5" />}>
                            User App
                        </QuickAction>
                    </div>
                </Panel>

                <Panel
                    title="Topic Overview"
                    description="Public, premium, and review queue balance."
                    icon={<BookOpen className="h-6 w-6" />}
                >
                    <ProgressRow
                        label="Public Topics"
                        value={stats?.publicTopics ?? 0}
                        total={stats?.totalTopics ?? 0}
                        color="bg-[#58CC02]"
                    />
                    <ProgressRow
                        label="Premium Topics"
                        value={stats?.premiumTopics ?? 0}
                        total={stats?.totalTopics ?? 0}
                        color="bg-yellow-400"
                    />
                    <ProgressRow
                        label="Pending Topics"
                        value={stats?.pendingTopics ?? 0}
                        total={stats?.totalTopics ?? 0}
                        color="bg-[#CE82FF]"
                    />
                </Panel>
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
                <Panel
                    title="Top Learners"
                    description="Highest XP users without exposing passwords."
                    icon={<Trophy className="h-6 w-6" />}
                >
                    <div className="space-y-3">
                        {(stats?.topUsersByXp ?? []).length === 0 ? (
                            <EmptyState text="No learners yet." />
                        ) : (
                            stats.topUsersByXp.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-4"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white font-black text-[#1CB0F6]">
                                            #{index + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-black text-slate-900">
                                                {user.username || user.email}
                                            </p>
                                            <p className="truncate text-sm font-bold text-slate-400">
                                                Level {user.level} - {user.subscriptionType}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="shrink-0 text-xl font-black text-[#58CC02]">
                                        {user.xp ?? 0} XP
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </Panel>

                <Panel
                    title="Top Topics"
                    description="Topics with the largest vocabulary sets."
                    icon={<Brain className="h-6 w-6" />}
                >
                    <div className="space-y-3">
                        {(stats?.topTopicsByVocabularyCount ?? []).length === 0 ? (
                            <EmptyState text="No topics yet." />
                        ) : (
                            stats.topTopicsByVocabularyCount.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="rounded-3xl bg-slate-50 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-black text-slate-900">
                                                {topic.name}
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-slate-400">
                                                {topic.visibility} - {topic.accessType} - {topic.approvalStatus}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#1CB0F6]">
                                            {topic.vocabularyCount} words
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Panel>
            </section>

            <Panel
                title="Recent Payments"
                description="Latest mock Premium subscription transactions."
                icon={<Receipt className="h-6 w-6" />}
            >
                <RecentPayments payments={stats?.recentPayments ?? []} />
            </Panel>
        </div>
    );
}

function MetricCard({ label, value, helper, icon: Icon, color }) {
    return (
        <article className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-7 w-7" />
            </div>
            <p className="text-sm font-black text-slate-400">{label}</p>
            <p className="mt-1 text-4xl font-black text-slate-900">{value}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">{helper}</p>
        </article>
    );
}

function Panel({ title, description, icon, children }) {
    return (
        <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[#1CB0F6]">
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">{title}</h2>
                    <p className="mt-1 font-semibold text-slate-500">{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

function AlertCard({ label, value, tone }) {
    return (
        <div className={`rounded-3xl p-4 ${tone}`}>
            <p className="text-3xl font-black">{value}</p>
            <p className="text-sm font-black opacity-80">{label}</p>
        </div>
    );
}

function QuickAction({ to, icon, children }) {
    return (
        <Link
            to={to}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition-all hover:-translate-y-1 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-100"
        >
            {icon}
            {children}
        </Link>
    );
}

function ProgressRow({ label, value, total, color }) {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div className="mb-4 last:mb-0">
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-black text-slate-700">{label}</p>
                <p className="text-sm font-black text-slate-400">
                    {value} / {total}
                </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

function RecentPayments({ payments }) {
    if (payments.length === 0) {
        return <EmptyState text="No payment transactions yet." />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
                <thead className="bg-slate-50">
                    <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Plan</TableHeader>
                        <TableHeader>Amount</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Provider</TableHeader>
                        <TableHeader>Paid At</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id} className="border-t border-slate-100">
                            <td className="p-4 font-black text-slate-500">
                                #{payment.id}
                            </td>
                            <td className="p-4 font-black text-slate-900">
                                {payment.planType}
                            </td>
                            <td className="p-4 font-black text-slate-700">
                                ${payment.amount}
                            </td>
                            <td className="p-4">
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-[#58CC02]">
                                    {payment.status}
                                </span>
                            </td>
                            <td className="p-4 font-bold text-slate-500">
                                {payment.provider}
                            </td>
                            <td className="p-4 font-bold text-slate-500">
                                {formatDateTime(payment.paidAt || payment.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TableHeader({ children }) {
    return (
        <th className="p-4 text-left text-sm font-black text-slate-500">
            {children}
        </th>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded-3xl bg-slate-50 p-6 text-center font-black text-slate-400">
            {text}
        </div>
    );
}

function formatDateTime(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString();
}

export default AdminDashboard;
