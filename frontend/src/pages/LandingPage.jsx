import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    Brain,
    Check,
    Flame,
    Headphones,
    PlayCircle,
    Sparkles,
    Target,
    Trophy,
    Volume2,
} from "lucide-react";

import PreferenceControls from "../components/PreferenceControls";

const featureCards = [
    {
        icon: BookOpen,
        title: "Focused lessons",
        description:
            "Review practical vocabulary in short sessions that fit a consistent learning routine.",
        tone: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
    },
    {
        icon: Target,
        title: "Active recall",
        description:
            "Strengthen memory with topic quizzes and immediate, easy-to-understand feedback.",
        tone: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
    },
    {
        icon: Trophy,
        title: "Visible progress",
        description:
            "Track XP, quiz performance, achievements, and review activity from one workspace.",
        tone: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    },
];

const topicTiles = ["Everyday English", "Travel", "Work", "Food", "Culture", "Study"];

function LandingPage() {
    return (
        <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-text)]">
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>

            <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur-lg">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        className="flex min-w-0 items-center gap-3 rounded-xl"
                        aria-label="LinguaPath home"
                    >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm">
                            <BookOpen className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                                LinguaPath
                            </span>
                            <span className="block truncate text-xs font-bold text-slate-600 dark:text-slate-300">
                                English Learning Platform
                            </span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <PreferenceControls compact />
                        <Link
                            to="/login"
                            className="hidden min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-teal-800 sm:inline-flex dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-200"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="ui-button ui-button-primary min-h-11 px-4 py-2.5 text-sm sm:px-5"
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            </header>

            <main id="main-content" tabIndex={-1}>
                <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
                    <div>
                        <div className="ui-badge mb-5">
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            Clear practice for every learning stage
                        </div>

                        <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                            Build confident English, one clear step at a time.
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                            Practice vocabulary, pronunciation, quizzes, and review in
                            focused sessions designed to grow with your goals.
                        </p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <Link
                                to="/register"
                                className="ui-button ui-button-primary px-6 py-4"
                            >
                                <PlayCircle className="h-5 w-5" aria-hidden="true" />
                                Start learning
                            </Link>
                            <Link
                                to="/login"
                                className="ui-button ui-button-outline px-6 py-4"
                            >
                                I already have an account
                            </Link>
                        </div>

                        <dl className="mt-8 grid grid-cols-3 gap-3" aria-label="Learning highlights">
                            <Metric icon={Flame} value="Daily" label="practice rhythm" />
                            <Metric icon={Brain} value="Active" label="recall training" />
                            <Metric icon={Trophy} value="Visible" label="progress" />
                        </dl>
                    </div>

                    <section className="ui-panel overflow-hidden p-5 sm:p-6" aria-labelledby="lesson-preview-title">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
                                    <Headphones className="h-6 w-6" aria-hidden="true" />
                                </span>
                                <div className="min-w-0">
                                    <h2 id="lesson-preview-title" className="text-xl font-bold text-slate-950 dark:text-white">
                                        Lesson preview
                                    </h2>
                                    <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                                        Everyday vocabulary
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                                +10 XP
                            </span>
                        </div>

                        <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/40">
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-800 dark:bg-slate-900 dark:text-teal-200">
                                    New word
                                </span>
                                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
                                    A1 example
                                </span>
                            </div>
                            <div className="mt-5 flex items-end justify-between gap-4">
                                <div>
                                    <h3 className="text-4xl font-bold text-slate-950 dark:text-white">
                                        Journey
                                    </h3>
                                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                                        The act of travelling from one place to another.
                                    </p>
                                </div>
                                <span
                                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-white text-indigo-800 dark:border-indigo-900 dark:bg-slate-900 dark:text-indigo-200"
                                    title="Pronunciation is available inside lessons"
                                >
                                    <Volume2 className="h-5 w-5" aria-hidden="true" />
                                    <span className="sr-only">
                                        Pronunciation is available inside lessons
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200">
                                <span>Lesson progress</span>
                                <span>60%</span>
                            </div>
                            <div
                                className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                                role="progressbar"
                                aria-label="Lesson preview progress"
                                aria-valuenow={60}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div className="h-full w-3/5 rounded-full bg-[var(--color-primary)]" />
                            </div>
                        </div>

                        <Link
                            to="/register"
                            className="ui-button ui-button-secondary mt-6 w-full px-5 py-4"
                        >
                            Explore the learning path
                            <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    </section>
                </section>

                <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
                    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
                        {featureCards.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <article key={feature.title} className="ui-card p-5 sm:p-6">
                                    <span className={`grid h-12 w-12 place-items-center rounded-xl ${feature.tone}`}>
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </span>
                                    <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                                        {feature.title}
                                    </h2>
                                    <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                                        {feature.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="ui-panel-accent p-6 sm:p-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-200">
                                    Topic-based learning
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                                    Choose a practical topic to begin.
                                </h2>
                                <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
                                    Learn vocabulary in context, reinforce it with quizzes,
                                    and return to difficult words through review practice.
                                </p>
                            </div>
                            <Check className="hidden h-10 w-10 text-teal-800 md:block dark:text-teal-200" aria-hidden="true" />
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                            {topicTiles.map((topic) => (
                                <Link
                                    key={topic}
                                    to="/register"
                                    className="flex min-h-14 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-bold text-slate-800 transition-colors hover:border-teal-700 hover:bg-teal-50 hover:text-teal-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-teal-300 dark:hover:bg-slate-800 dark:hover:text-teal-200"
                                >
                                    {topic}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-300">
                    <p className="font-bold text-slate-800 dark:text-slate-100">LinguaPath</p>
                    <p>Focused English practice with measurable progress.</p>
                </div>
            </footer>
        </div>
    );
}

function Metric({ icon: Icon, value, label }) {
    return (
        <div className="ui-card p-3 sm:p-4">
            <dt className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
                <Icon className="h-4 w-4 text-teal-800 dark:text-teal-200" aria-hidden="true" />
                {value}
            </dt>
            <dd className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                {label}
            </dd>
        </div>
    );
}

export default LandingPage;
