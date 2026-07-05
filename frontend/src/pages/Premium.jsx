import { useState } from "react";
import { Link } from "react-router-dom";
import {
    BarChart3,
    CheckCircle2,
    Crown,
    Download,
    FileText,
    Loader2,
    Lock,
    Sparkles,
    Trophy,
    Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { checkoutPremium } from "../services/paymentService";

const plans = [
    {
        type: "MONTHLY",
        name: "Monthly",
        price: "$9",
        caption: "Flexible learning",
        duration: "1 month access",
    },
    {
        type: "YEARLY",
        name: "Yearly",
        price: "$99",
        caption: "Best value",
        duration: "12 months access",
        highlight: true,
    },
];

const premiumFeatures = [
    { icon: Lock, title: "Premium Topics", text: "Access approved premium lessons." },
    { icon: Zap, title: "Longer Quizzes", text: "Practice with 10, 20, 30+ questions." },
    { icon: Sparkles, title: "Smart Practice", text: "Unlock richer practice modes and progress insights." },
    { icon: BarChart3, title: "Advanced Analytics", text: "Prepared for deeper progress insights." },
    { icon: Download, title: "Vocabulary Export", text: "Premium gate ready for export features." },
    { icon: Trophy, title: "Unlimited Growth", text: "Create more custom topics and vocabulary." },
];

function Premium() {
    const { user, isPremium, fetchCurrentUser } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState("YEARLY");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const premiumUntil = user?.premiumUntil
        ? new Date(user.premiumUntil).toLocaleDateString()
        : null;

    const handleCheckout = async () => {
        try {
            setSubmitting(true);
            setMessage("");
            setErrorMessage("");
            const response = await checkoutPremium(selectedPlan);
            await fetchCurrentUser();
            setMessage(response.message || "Premium subscription activated.");
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.message ||
                    "Could not activate Premium right now."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-page space-y-6">
            <section className="kid-panel-soft overflow-hidden p-6 md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1.5 text-sm font-black text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
                            <Crown className="h-4 w-4" />
                            Premium Upgrade
                        </div>
                        <h1 className="max-w-3xl text-3xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">
                            Unlock the stronger learning mode.
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600 dark:text-slate-300">
                            Premium opens advanced practice, premium topics, longer quizzes,
                            and deeper progress tools for serious English learning.
                        </p>
                    </div>

                    <div className="rounded-[1.5rem] border-2 border-yellow-100 bg-white p-5 lg:min-w-72 dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm font-black text-slate-500 dark:text-slate-400">
                            Current Plan
                        </p>
                        <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                            {isPremium ? "Premium" : "Free"}
                        </p>
                        <p className="mt-2 font-semibold text-slate-600 dark:text-slate-300">
                            {premiumUntil
                                ? `Valid until ${premiumUntil}`
                                : "Upgrade anytime with mock checkout."}
                        </p>
                    </div>
                </div>
            </section>

            {(message || errorMessage) && (
                <div
                    role="status"
                    className={`flex items-center gap-3 rounded-2xl p-4 font-semibold ${
                        message
                            ? "bg-green-50 text-[#58CC02]"
                            : "bg-red-50 text-red-500"
                    }`}
                >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    {message || errorMessage}
                </div>
            )}

            <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
                <div className="grid gap-4 sm:grid-cols-2">
                    {premiumFeatures.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <article
                                key={feature.title}
                                className="kid-card p-5"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                                    {feature.title}
                                </h2>
                                <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">
                                    {feature.text}
                                </p>
                            </article>
                        );
                    })}
                </div>

                <aside className="kid-panel p-5">
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                        Choose Plan
                    </h2>
                    <p className="mt-1 font-medium text-slate-500 dark:text-slate-400">
                        This is a mock payment flow for portfolio testing.
                    </p>

                    <div className="mt-5 space-y-3">
                        {plans.map((plan) => (
                            <button
                                key={plan.type}
                                type="button"
                                onClick={() => setSelectedPlan(plan.type)}
                                className={`w-full rounded-2xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-4 focus:ring-yellow-100 ${
                                    selectedPlan === plan.type
                                        ? "border-yellow-400 bg-yellow-50"
                                        : "border-slate-200 bg-slate-50 hover:border-sky-200 dark:border-slate-800 dark:bg-slate-950"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xl font-bold text-slate-950 dark:text-white">
                                                {plan.name}
                                            </p>
                                            {plan.highlight && (
                                                <span className="rounded-full bg-[#58CC02] px-3 py-1 text-xs font-bold text-white">
                                                    Best
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {plan.caption} - {plan.duration}
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-950 dark:text-white">
                                        {plan.price}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={submitting}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-slate-950 shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Crown className="h-5 w-5" />
                        )}
                        {submitting ? "Activating..." : "Activate Premium"}
                    </button>

                    <Link
                        to="/payments"
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-50 px-6 py-4 font-bold text-[#1CB0F6] transition-all hover:-translate-y-0.5 hover:bg-sky-100 focus:outline-none focus:ring-4 focus:ring-sky-100 dark:bg-sky-950"
                    >
                        <FileText className="h-5 w-5" />
                        View Payment History
                    </Link>
                </aside>
            </section>
        </div>
    );
}

export default Premium;
