import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    ChevronRight,
    RotateCcw,
    Target,
    Volume2,
    XCircle,
} from "lucide-react";
import {
    getWrongAnswerPracticeItems,
    submitWrongAnswerPractice,
} from "../services/wrongAnswerService";
import PageSkeleton from "../components/PageSkeleton";

function ReviewWrongAnswers() {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const currentItem = items[currentIndex];
    const progress = useMemo(
        () =>
            items.length > 0
                ? Math.round(((currentIndex + 1) / items.length) * 100)
                : 0,
        [currentIndex, items.length]
    );

    const fetchPracticeItems = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const data = await getWrongAnswerPracticeItems();
            setItems(data);
            setCurrentIndex(0);
            setAnswer("");
            setFeedback(null);
            setCompleted(false);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load review practice.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPracticeItems();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!answer.trim() || !currentItem) return;

        try {
            setSubmitting(true);
            setErrorMessage("");

            const response = await submitWrongAnswerPractice({
                wrongAnswerId: currentItem.id,
                answer: answer.trim(),
            });

            setFeedback(response);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not submit your answer.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        const isLast = currentIndex === items.length - 1;

        if (isLast) {
            setCompleted(true);
            return;
        }

        setCurrentIndex((previous) => previous + 1);
        setAnswer("");
        setFeedback(null);
    };

    const speak = () => {
        if (!currentItem?.vocabulary?.word || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentItem.vocabulary.word);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    if (loading) {
        return <PageSkeleton />;
    }

    if (completed) {
        return (
            <div className="kid-panel mx-auto max-w-3xl p-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-green-50 text-[#58CC02] dark:bg-green-950">
                    <CheckCircle2 className="h-11 w-11" />
                </div>
                <h1 className="text-4xl font-bold text-slate-950 dark:text-white">
                    Review Complete
                </h1>
                <p className="mt-3 font-medium text-slate-500 dark:text-slate-400">
                    You practiced {items.length} mistake words.
                </p>
                <button
                    type="button"
                    onClick={fetchPracticeItems}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-6 py-4 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-100"
                >
                    <RotateCcw className="h-5 w-5" />
                    Practice Again
                </button>
            </div>
        );
    }

    if (!currentItem) {
        return (
            <div className="mx-auto max-w-3xl space-y-6">
                <section className="kid-panel-soft p-6 md:p-8">
                    <h1 className="text-3xl font-black text-slate-950 dark:text-white md:text-5xl">
                        Review Practice
                    </h1>
                    <p className="mt-3 font-semibold text-slate-600 dark:text-slate-300">
                        Practice words you answered incorrectly.
                    </p>
                </section>
                <div className="kid-panel p-8 text-center">
                    <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#58CC02]" />
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                        All clear
                    </h2>
                    <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">
                        No unresolved wrong answers yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <section className="kid-panel-soft p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 dark:text-white md:text-5xl">
                            Review Practice
                        </h1>
                        <p className="mt-3 font-semibold text-slate-600 dark:text-slate-300">
                            Fix mistakes by answering again.
                        </p>
                    </div>
                    <div className="rounded-2xl border-2 border-green-100 bg-white px-5 py-4 font-black text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                        {currentIndex + 1} / {items.length}
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            <div>
                <div className="mb-3 flex items-center justify-between">
                    <p className="font-bold text-slate-500 dark:text-slate-400">Progress</p>
                    <p className="font-bold text-[#58CC02]">{progress}%</p>
                </div>
                <div
                    className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                    role="progressbar"
                    aria-label="Review practice progress"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="kid-panel p-6 md:p-8"
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-slate-400">
                            Type the correct meaning
                        </p>
                        <h2 className="mt-2 break-words text-5xl font-bold text-slate-950 dark:text-white">
                            {currentItem.vocabulary.word}
                        </h2>
                        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                            Last answer: {currentItem.lastSubmittedAnswer || "N/A"} · Mistakes:{" "}
                            {currentItem.mistakeCount}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={speak}
                        className="rounded-2xl bg-sky-50 p-3 text-[#1CB0F6] transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-100 dark:bg-sky-950"
                        aria-label="Pronounce word"
                    >
                        <Volume2 className="h-5 w-5" />
                    </button>
                </div>

                <label
                    htmlFor="review-answer"
                    className="block text-sm font-bold text-slate-600 dark:text-slate-300"
                >
                    Your answer
                </label>
                <input
                    id="review-answer"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    disabled={Boolean(feedback)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold outline-none transition-all focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 disabled:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    placeholder="Enter meaning"
                    autoComplete="off"
                />

                {feedback && (
                    <div
                        role="status"
                        aria-live="polite"
                        className={`mt-5 rounded-2xl p-4 font-semibold ${
                            feedback.correct
                                ? "bg-green-50 text-[#58CC02]"
                                : "bg-red-50 text-red-500"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {feedback.correct ? (
                                <CheckCircle2 className="h-5 w-5" />
                            ) : (
                                <XCircle className="h-5 w-5" />
                            )}
                            {feedback.correct
                                ? "Correct. This word is resolved."
                                : `Not yet. Correct answer: ${feedback.correctAnswer}`}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {!feedback ? (
                        <button
                            type="submit"
                            disabled={!answer.trim() || submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-6 py-4 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Target className="h-5 w-5" />
                            {submitting ? "Checking..." : "Check Answer"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1CB0F6] px-6 py-4 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-100"
                        >
                            {currentIndex === items.length - 1 ? "Finish" : "Next"}
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default ReviewWrongAnswers;
