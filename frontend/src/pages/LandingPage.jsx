import { Link } from "react-router-dom";
import {
    BookOpen,
    Brain,
    CheckCircle,
    ChevronRight,
    Flame,
    Gamepad2,
    Headphones,
    PlayCircle,
    Sparkles,
    Star,
    Trophy,
    Volume2,
} from "lucide-react";
import { Card } from "@astryxdesign/core/Card";
import { Grid } from "@astryxdesign/core/Grid";
import { ProgressBar } from "@astryxdesign/core/ProgressBar";
import { HStack, VStack } from "@astryxdesign/core/Stack";

import PreferenceControls from "../components/PreferenceControls";

const featureCards = [
    {
        icon: BookOpen,
        title: "Tiny lessons",
        description: "Short flashcards keep each session light and easy to finish.",
        color: "bg-green-100 text-[#58CC02] dark:bg-green-950 dark:text-green-300",
        border: "border-green-200 dark:border-green-900",
    },
    {
        icon: Gamepad2,
        title: "Quiz games",
        description: "Practice one question at a time with friendly feedback.",
        color: "bg-sky-100 text-[#1CB0F6] dark:bg-sky-950 dark:text-sky-300",
        border: "border-sky-200 dark:border-sky-900",
    },
    {
        icon: Trophy,
        title: "Happy rewards",
        description: "XP, badges, and streaks make progress feel visible.",
        color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-900",
    },
];

const lessonSteps = [
    {
        icon: Headphones,
        label: "Listen",
        color: "bg-[#1CB0F6]",
    },
    {
        icon: BookOpen,
        label: "Learn",
        color: "bg-[#58CC02]",
    },
    {
        icon: Brain,
        label: "Quiz",
        color: "bg-[#CE82FF]",
    },
    {
        icon: Star,
        label: "Reward",
        color: "bg-yellow-400",
    },
];

const topicTiles = [
    {
        name: "Animals",
        icon: Volume2,
        className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-900",
    },
    {
        name: "Food",
        icon: Star,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-900",
    },
    {
        name: "School",
        icon: BookOpen,
        className: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:border-sky-900",
    },
    {
        name: "Family",
        icon: Sparkles,
        className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-200 dark:border-purple-900",
    },
    {
        name: "Travel",
        icon: PlayCircle,
        className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-900",
    },
    {
        name: "Sports",
        icon: Trophy,
        className: "bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-950/50 dark:text-lime-200 dark:border-lime-900",
    },
];

function LandingPage() {
    return (
        <main className="min-h-screen overflow-x-hidden bg-[#F6F8FB] text-slate-900 dark:bg-[#101418] dark:text-slate-50">
            <header className="sticky top-0 z-30 border-b border-green-100 bg-[#FFFDF4]/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
                    <Link
                        to="/"
                        className="flex min-w-0 items-center gap-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900"
                    >
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.35rem] border-2 border-green-200 bg-[#58CC02] text-white shadow-[0_5px_0_#46a302] dark:border-green-900">
                            <BookOpen className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-xl font-black text-slate-900 dark:text-white">
                                LinguaKid
                            </span>
                            <span className="block truncate text-xs font-bold text-slate-500 dark:text-slate-400">
                                English Learning Platform
                            </span>
                        </span>
                    </Link>

                    <HStack gap={2} align="center">
                        <PreferenceControls compact />
                        <Link
                            to="/login"
                            className="hidden rounded-2xl px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white hover:text-[#58CC02] focus:outline-none focus:ring-4 focus:ring-green-100 dark:text-slate-300 dark:hover:bg-slate-900 sm:inline-flex"
                        >
                            Login
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#58CC02] px-4 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#46a302] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-100 active:translate-y-0.5 active:shadow-none dark:focus:ring-green-900 sm:px-5"
                        >
                            Start
                        </Link>
                    </HStack>
                </div>
            </header>

            <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[1fr_0.96fr]">
                    <VStack gap={5}>
                        <Pill
                            icon={Sparkles}
                            label="Friendly English for beginners"
                            className="border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
                        />

                        <VStack gap={3}>
                            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-normal text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                                Learn English in small happy steps
                            </h1>
                            <p className="max-w-xl text-lg font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                                Flashcards, sound practice, quiz games, XP, and badges in
                                a softer classroom-style interface for young learners.
                            </p>
                        </VStack>

                        <HStack gap={3} wrap="wrap">
                            <Link
                                to="/login"
                                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[1.35rem] bg-[#58CC02] px-6 py-4 text-sm font-black text-white shadow-[0_7px_0_#46a302] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-100 active:translate-y-1 active:shadow-none dark:focus:ring-green-900"
                            >
                                <PlayCircle className="h-5 w-5" aria-hidden="true" />
                                Start learning
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex min-h-14 items-center justify-center rounded-[1.35rem] border-2 border-sky-100 bg-white px-6 py-4 text-sm font-black text-slate-700 shadow-[0_5px_0_#dbeafe] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-[#1CB0F6] focus:outline-none focus:ring-4 focus:ring-sky-100 active:translate-y-0.5 active:shadow-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:shadow-none"
                            >
                                I already have an account
                            </Link>
                        </HStack>

                        <Grid columns={{ minWidth: 132, max: 3 }} gap={3}>
                            <MiniStat
                                icon={Flame}
                                value="3+"
                                label="Day streak"
                                color="text-orange-500"
                            />
                            <MiniStat
                                icon={Star}
                                value="120+"
                                label="XP points"
                                color="text-yellow-500"
                            />
                            <MiniStat
                                icon={Trophy}
                                value="8+"
                                label="Badges"
                                color="text-[#CE82FF]"
                            />
                        </Grid>
                    </VStack>

                    <Card padding={0}>
                        <section className="rounded-[2rem] border-2 border-white bg-white p-4 shadow-[0_18px_0_#dbeafe] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
                            <VStack gap={5}>
                                <HStack gap={3} hAlign="between" align="center">
                                    <HStack gap={3} align="center">
                                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.15rem] bg-sky-100 text-[#1CB0F6] dark:bg-sky-950 dark:text-sky-300">
                                            <Headphones className="h-6 w-6" aria-hidden="true" />
                                        </span>
                                        <VStack gap={1}>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                                Today&apos;s Lesson
                                            </h2>
                                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                                Animals Vocabulary
                                            </p>
                                        </VStack>
                                    </HStack>
                                    <Pill
                                        label="+10 XP"
                                        className="border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200"
                                    />
                                </HStack>

                                <section className="rounded-[1.75rem] border-2 border-green-100 bg-[#F2FFE8] p-5 dark:border-green-900 dark:bg-green-950/40">
                                    <VStack gap={4}>
                                        <HStack gap={2} wrap="wrap">
                                            <Pill
                                                label="New word"
                                                className="border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
                                            />
                                            <Pill
                                                label="A1"
                                                className="border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200"
                                            />
                                        </HStack>

                                        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                                            <VStack gap={2}>
                                                <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                                                    Cat
                                                </h3>
                                                <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
                                                    A small animal that says meow.
                                                </p>
                                            </VStack>

                                            <button
                                                type="button"
                                                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1CB0F6] shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-100 dark:bg-slate-900 dark:focus:ring-sky-900"
                                                aria-label="Play pronunciation"
                                            >
                                                <Volume2 className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </VStack>
                                </section>

                                <VStack gap={3}>
                                    <HStack gap={3} hAlign="between" align="center">
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                                            Lesson path
                                        </span>
                                        <span className="text-sm font-black text-[#58CC02]">
                                            60%
                                        </span>
                                    </HStack>
                                    <ProgressBar
                                        label="Lesson progress"
                                        value={60}
                                        isLabelHidden
                                        variant="success"
                                    />
                                    <div className="grid grid-cols-4 gap-2">
                                        {lessonSteps.map((step) => {
                                            const Icon = step.icon;

                                            return (
                                                <div
                                                    key={step.label}
                                                    className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-950"
                                                >
                                                    <span
                                                        className={`mx-auto grid h-10 w-10 place-items-center rounded-2xl text-white ${step.color}`}
                                                    >
                                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                    <span className="mt-2 block text-xs font-black text-slate-600 dark:text-slate-300">
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </VStack>

                                <Link
                                    to="/login"
                                    className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-[1.25rem] bg-[#1CB0F6] px-5 py-4 text-sm font-black text-white shadow-[0_5px_0_#118ac4] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-100 active:translate-y-0.5 active:shadow-none dark:focus:ring-sky-900"
                                >
                                    Continue lesson
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </Link>
                            </VStack>
                        </section>
                    </Card>
                </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
                    <Grid columns={{ minWidth: 230, max: 3 }} gap={4}>
                        {featureCards.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <Card key={feature.title} padding={0}>
                                    <article
                                        className={`h-full rounded-[1.6rem] border-2 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 ${feature.border}`}
                                    >
                                        <VStack gap={3}>
                                            <span
                                                className={`grid h-14 w-14 place-items-center rounded-[1.2rem] ${feature.color}`}
                                            >
                                                <Icon className="h-7 w-7" aria-hidden="true" />
                                            </span>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                                                {feature.description}
                                            </p>
                                        </VStack>
                                    </article>
                                </Card>
                            );
                        })}
                    </Grid>
                </section>

            <section className="mx-auto max-w-7xl px-4 pb-14 pt-4 sm:px-6">
                    <div className="rounded-[2rem] border-2 border-sky-100 bg-[#EAF7FF] p-5 dark:border-sky-900 dark:bg-sky-950/30 sm:p-7">
                        <VStack gap={5}>
                            <HStack gap={4} hAlign="between" align="center" wrap="wrap">
                                <VStack gap={1}>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                                        Pick a playful topic
                                    </h2>
                                    <p className="max-w-2xl text-base font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                                        Start with beginner-friendly lessons before moving to
                                        quizzes and review.
                                    </p>
                                </VStack>
                                <CheckCircle className="h-10 w-10 text-[#58CC02]" aria-hidden="true" />
                            </HStack>

                            <Grid columns={{ minWidth: 150, max: 6 }} gap={3}>
                                {topicTiles.map((topic) => {
                                    const Icon = topic.icon;

                                    return (
                                        <Link
                                            key={topic.name}
                                            to="/login"
                                            className={`group rounded-[1.35rem] border-2 p-4 text-center font-black transition hover:-translate-y-1 hover:bg-[#58CC02] hover:text-white hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900 ${topic.className}`}
                                        >
                                            <Icon
                                                className="mx-auto mb-2 h-6 w-6 transition group-hover:text-white"
                                                aria-hidden="true"
                                            />
                                            {topic.name}
                                        </Link>
                                    );
                                })}
                            </Grid>
                        </VStack>
                    </div>
                </section>
        </main>
    );
}

function MiniStat({ icon: Icon, value, label, color }) {
    return (
        <Card padding={0}>
            <div className="rounded-[1.35rem] border-2 border-white bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <Icon className={`mb-2 h-6 w-6 ${color}`} aria-hidden="true" />
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {value}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    {label}
                </p>
            </div>
        </Card>
    );
}

function Pill({ icon: Icon, label, className = "" }) {
    return (
        <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${className}`}
        >
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
            {label}
        </span>
    );
}

export default LandingPage;
