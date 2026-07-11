import { useEffect, useMemo, useState } from "react";
import {
    BookOpen,
    CheckCircle2,
    Crown,
    Filter,
    Lock,
    RefreshCcw,
    ShieldCheck,
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

function AdminTopics() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingTopicId, setSavingTopicId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchTopics = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            setTopics(await getAdminTopics());
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load admin topics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTopics();
    }, []);

    const filteredTopics = useMemo(() => {
        if (statusFilter === "ALL") return topics;

        return topics.filter((topic) => topic.approvalStatus === statusFilter);
    }, [statusFilter, topics]);

    const counts = useMemo(
        () => ({
            total: topics.length,
            pending: topics.filter((topic) => topic.approvalStatus === "PENDING").length,
            premium: topics.filter((topic) => topic.accessType === "PREMIUM").length,
            free: topics.filter((topic) => topic.accessType !== "PREMIUM").length,
        }),
        [topics]
    );

    const updateTopicInState = (updatedTopic) => {
        setTopics((current) =>
            current.map((topic) =>
                topic.id === updatedTopic.id ? updatedTopic : topic
            )
        );
    };

    const runTopicAction = async (topicId, action, successText) => {
        try {
            setSavingTopicId(topicId);
            setErrorMessage("");
            setSuccessMessage("");
            const updatedTopic = await action();
            updateTopicInState(updatedTopic);
            setSuccessMessage(successText);
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.message || "Failed to update topic."
            );
        } finally {
            setSavingTopicId(null);
        }
    };

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    return (
        <div className="app-page space-y-6">
            <section className="ui-panel-accent p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
                            <ShieldCheck className="h-4 w-4" />
                            Content control
                        </div>
                        <h1 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
                            Topic Management
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600 dark:text-slate-300">
                            Review public topics and control free or premium access.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchTopics}
                        className="ui-button ui-button-secondary"
                    >
                        <RefreshCcw className="h-5 w-5" />
                        Refresh
                    </button>
                </div>
            </section>

            {(errorMessage || successMessage) && (
                <div
                    role="status"
                    className={`rounded-2xl p-4 font-semibold ${
                        errorMessage
                            ? "bg-red-50 text-red-500 dark:bg-red-950/40"
                            : "bg-green-50 text-[#0F766E] dark:bg-green-950/40"
                    }`}
                >
                    {errorMessage || successMessage}
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminTopicStat
                    icon={<BookOpen className="h-7 w-7" />}
                    label="Total Topics"
                    value={counts.total}
                    color="bg-sky-100 text-[#4338CA]"
                />
                <AdminTopicStat
                    icon={<Filter className="h-7 w-7" />}
                    label="Pending Review"
                    value={counts.pending}
                    color="bg-yellow-100 text-yellow-600"
                />
                <AdminTopicStat
                    icon={<Lock className="h-7 w-7" />}
                    label="Free Topics"
                    value={counts.free}
                    color="bg-green-100 text-[#0F766E]"
                />
                <AdminTopicStat
                    icon={<Crown className="h-7 w-7" />}
                    label="Premium Topics"
                    value={counts.premium}
                    color="bg-purple-100 text-purple-500"
                />
            </section>

            <section className="ui-panel p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                            Topic Queue
                        </h2>
                        <p className="mt-1 font-medium text-slate-500 dark:text-slate-400">
                            Approve, reject, or switch topics between Free and Premium.
                        </p>
                    </div>

                    <label className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                        Status
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-semibold text-slate-700 outline-none transition-all focus:border-[#4338CA] focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {filteredTopics.length === 0 ? (
                    <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center dark:bg-slate-950">
                        <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                        <p className="font-bold text-slate-500 dark:text-slate-400">
                            No topics match this filter.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[980px]">
                            <thead className="bg-sky-50 dark:bg-slate-950">
                                <tr>
                                    <TableHeader>Topic</TableHeader>
                                    <TableHeader>Owner</TableHeader>
                                    <TableHeader>Words</TableHeader>
                                    <TableHeader>Visibility</TableHeader>
                                    <TableHeader>Access</TableHeader>
                                    <TableHeader>Status</TableHeader>
                                    <TableHeader align="right">Actions</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTopics.map((topic) => {
                                    const isSaving = savingTopicId === topic.id;
                                    const isPremium = topic.accessType === "PREMIUM";

                                    return (
                                        <tr
                                            key={topic.id}
                                            className="border-t border-slate-100 dark:border-slate-800"
                                        >
                                            <td className="p-4">
                                                <p className="font-bold text-slate-950 dark:text-white">
                                                    {topic.name}
                                                </p>
                                                <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    {topic.description || "No description"}
                                                </p>
                                            </td>
                                            <td className="p-4 font-bold text-slate-600 dark:text-slate-300">
                                                {topic.ownerUsername || "Platform"}
                                            </td>
                                            <td className="p-4 font-bold text-slate-700 dark:text-slate-200">
                                                {topic.vocabularyCount ?? 0}
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    label={topic.visibility || "PUBLIC"}
                                                    tone={
                                                        topic.visibility === "PRIVATE"
                                                            ? "slate"
                                                            : "sky"
                                                    }
                                                />
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    label={topic.accessType || "FREE"}
                                                    tone={isPremium ? "yellow" : "green"}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    label={topic.approvalStatus || "APPROVED"}
                                                    tone={getStatusTone(topic.approvalStatus)}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={isSaving || !isPremium}
                                                        onClick={() =>
                                                            runTopicAction(
                                                                topic.id,
                                                                () =>
                                                                    updateAdminTopicAccessType(
                                                                        topic.id,
                                                                        "FREE"
                                                                    ),
                                                                "Topic is now Free."
                                                            )
                                                        }
                                                        className="rounded-xl bg-green-50 px-3 py-2 text-sm font-bold text-[#0F766E] transition-all hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-green-950"
                                                    >
                                                        Free
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isSaving || isPremium}
                                                        onClick={() =>
                                                            runTopicAction(
                                                                topic.id,
                                                                () =>
                                                                    updateAdminTopicAccessType(
                                                                        topic.id,
                                                                        "PREMIUM"
                                                                    ),
                                                                "Topic is now Premium."
                                                            )
                                                        }
                                                        className="rounded-xl bg-yellow-100 px-3 py-2 text-sm font-bold text-yellow-700 transition-all hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        Premium
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isSaving ||
                                                            topic.approvalStatus === "APPROVED"
                                                        }
                                                        onClick={() =>
                                                            runTopicAction(
                                                                topic.id,
                                                                () => approveAdminTopic(topic.id),
                                                                "Topic approved."
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-xl bg-sky-50 px-3 py-2 text-sm font-bold text-[#4338CA] transition-all hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-sky-950"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isSaving ||
                                                            topic.approvalStatus === "REJECTED"
                                                        }
                                                        onClick={() =>
                                                            runTopicAction(
                                                                topic.id,
                                                                () => rejectAdminTopic(topic.id),
                                                                "Topic rejected."
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-950/40"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function AdminTopicStat({ icon, label, value, color }) {
    return (
        <article className="ui-card p-5">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                {icon}
            </div>
            <p className="text-sm font-semibold text-slate-400">{label}</p>
            <p className="mt-1 text-4xl font-bold text-slate-950 dark:text-white">{value}</p>
        </article>
    );
}

function TableHeader({ children, align = "left" }) {
    return (
        <th
            className={`p-4 text-sm font-bold text-slate-500 dark:text-slate-400 ${
                align === "right" ? "text-right" : "text-left"
            }`}
        >
            {children}
        </th>
    );
}

function Badge({ label, tone }) {
    const classes = {
        green: "bg-green-50 text-[#0F766E] dark:bg-green-950/40",
        yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-200",
        red: "bg-red-50 text-red-500 dark:bg-red-950/40",
        sky: "bg-sky-50 text-[#4338CA] dark:bg-sky-950/40",
        slate: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
    };

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${classes[tone] || classes.slate}`}>
            {label}
        </span>
    );
}

function getStatusTone(status) {
    if (status === "APPROVED") return "green";
    if (status === "REJECTED") return "red";
    if (status === "PENDING") return "yellow";
    return "slate";
}

export default AdminTopics;
