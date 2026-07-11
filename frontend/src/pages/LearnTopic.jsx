import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Heart,
    Lock,
    RotateCcw,
    Sparkles,
    Volume2,
} from "lucide-react";
import {
    getVocabulariesByTopic,
    getVocabularyProgress,
    updateVocabularyProgress,
} from "../services/vocabularyService";
import { addFavoriteVocabulary } from "../services/favoriteService";
import PremiumLockedModal from "../components/PremiumLockedModal";
import PageSkeleton from "../components/PageSkeleton";

function LearnTopic() {
    const { topicId } = useParams();
    const [vocabularies, setVocabularies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [premiumLocked, setPremiumLocked] = useState(false);
    const [favoriteMessage, setFavoriteMessage] = useState("");
    const [progressByVocabularyId, setProgressByVocabularyId] = useState({});

    useEffect(() => {
        const fetchVocabularies = async () => {
            try {
                setLoading(true);
                setErrorMessage("");
                setPremiumLocked(false);

                const [data, progressData] = await Promise.all([
                    getVocabulariesByTopic(topicId),
                    getVocabularyProgress(),
                ]);
                setVocabularies(data);
                setProgressByVocabularyId(
                    Object.fromEntries(
                        progressData.map((item) => [
                            Number(item.vocabulary.id),
                            item,
                        ])
                    )
                );
                setCurrentIndex(0);
                setIsFlipped(false);
                setCompleted(false);
            } catch (error) {
                console.error("Failed to load vocabularies by topic", error);
                if (error.response?.status === 403) {
                    setPremiumLocked(true);
                    setErrorMessage(
                        error.response?.data?.message ||
                            "This topic requires Premium access."
                    );
                    return;
                }

                setErrorMessage("Could not load this lesson right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchVocabularies();
    }, [topicId]);

    const currentVocabulary = vocabularies[currentIndex];
    const currentProgress = currentVocabulary
        ? progressByVocabularyId[Number(currentVocabulary.id)]
        : null;

    const progress = useMemo(
        () =>
            vocabularies.length > 0
                ? Math.round(((currentIndex + 1) / vocabularies.length) * 100)
                : 0,
        [currentIndex, vocabularies.length]
    );

    const handleNext = () => {
        if (currentVocabulary?.id) {
            updateVocabularyProgress(currentVocabulary.id, "LEARNING")
                .then((progress) =>
                    setProgressByVocabularyId((current) => ({
                        ...current,
                        [Number(currentVocabulary.id)]: progress,
                    }))
                )
                .catch((error) =>
                    console.error("Failed to update vocabulary progress", error)
                );
        }

        if (currentIndex === vocabularies.length - 1) {
            setCompleted(true);
            return;
        }

        setCurrentIndex((previous) => previous + 1);
        setIsFlipped(false);
    };

    const handlePrevious = () => {
        if (currentIndex === 0) return;

        setCurrentIndex((previous) => previous - 1);
        setIsFlipped(false);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setCompleted(false);
    };

    const handleSpeak = () => {
        if (!currentVocabulary?.word || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentVocabulary.word);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleFlipKeyDown = (event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        setIsFlipped((previous) => !previous);
    };

    const handleAddFavorite = async () => {
        if (!currentVocabulary?.id) return;

        try {
            await addFavoriteVocabulary(currentVocabulary.id);
            setFavoriteMessage("Saved to favorites.");
            setTimeout(() => setFavoriteMessage(""), 1800);
        } catch (error) {
            console.error(error);
            setFavoriteMessage("Could not save favorite.");
        }
    };

    if (loading) {
        return <PageSkeleton />;
    }

    if (errorMessage) {
        return (
            <div
                className={`mx-auto max-w-2xl rounded-2xl border p-8 text-center ${
                    premiumLocked
                        ? "border-yellow-100 bg-yellow-50"
                        : "border-red-100 bg-red-50"
                }`}
            >
                <PremiumLockedModal
                    open={premiumLocked}
                    title="Premium lesson locked"
                    description="Upgrade to Premium to open this lesson and continue practicing advanced topics."
                    onClose={() => setPremiumLocked(false)}
                />
                {premiumLocked ? (
                    <Lock className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
                ) : (
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-red-400" />
                )}
                <h1 className="text-2xl font-bold text-slate-950">
                    {premiumLocked ? "Premium lesson" : "Lesson unavailable"}
                </h1>
                <p
                    className={`mt-3 font-semibold ${
                        premiumLocked ? "text-yellow-700" : "text-red-500"
                    }`}
                >
                    {errorMessage}
                </p>
                <Link
                    to="/learn"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-yellow-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Learn
                </Link>
            </div>
        );
    }

    if (vocabularies.length === 0) {
        return (
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
                    No vocabulary found
                </h1>
                <p className="mt-3 font-medium text-slate-500 dark:text-slate-400">
                    Add words to this topic before starting flashcards.
                </p>
                <Link
                    to="/learn"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-6 py-3 font-bold text-white focus:outline-none focus:ring-4 focus:ring-green-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Learn
                </Link>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="bg-slate-50 p-8 dark:bg-slate-950 md:p-10">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-[#0F766E] shadow-sm dark:bg-slate-900">
                        <CheckCircle2 className="h-11 w-11" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
                        Lesson Complete
                    </h1>
                    <p className="mt-3 font-medium text-slate-500 dark:text-slate-400">
                        You reviewed {vocabularies.length} vocabulary words.
                    </p>
                </div>

                <div className="grid gap-3 p-6 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={handleRestart}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-4 font-bold text-slate-700 transition-all  focus:outline-none focus:ring-4 focus:ring-slate-100 dark:bg-slate-800 dark:text-slate-200"
                    >
                        <RotateCcw className="h-5 w-5" />
                        Review Again
                    </button>
                    <Link
                        to="/quiz"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-5 py-4 font-bold text-white shadow-sm transition-all  focus:outline-none focus:ring-4 focus:ring-green-100"
                    >
                        <Sparkles className="h-5 w-5" />
                        Practice Quiz
                    </Link>
                    <Link
                        to="/learn"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4338CA] px-5 py-4 font-bold text-white shadow-sm transition-all  focus:outline-none focus:ring-4 focus:ring-sky-100"
                    >
                        <BookOpen className="h-5 w-5" />
                        More Topics
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-col gap-4">
                <Link
                    to="/learn"
                    className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition-all  focus:outline-none focus:ring-4 focus:ring-green-100 dark:bg-slate-900 dark:text-slate-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Learn
                </Link>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <p className="font-bold text-slate-500 dark:text-slate-400">
                            Word {currentIndex + 1} of {vocabularies.length}
                        </p>
                        <p className="font-bold text-[#0F766E]">
                            {progress}%
                        </p>
                    </div>
                    <div
                        className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                        role="progressbar"
                        aria-label="Flashcard progress"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div
                            className="h-full rounded-full bg-[#0F766E] transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="relative h-[390px] cursor-pointer rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-green-100 sm:h-[440px]"
                onClick={() => setIsFlipped((previous) => !previous)}
                onKeyDown={handleFlipKeyDown}
                role="button"
                tabIndex={0}
                aria-label={
                    isFlipped
                        ? "Flip card to show the word"
                        : "Flip card to show the meaning"
                }
                aria-pressed={isFlipped}
                style={{ perspective: "1200px" }}
            >
                <div
                    key={currentVocabulary.id}
                    className="relative h-full w-full transition-transform duration-700 ease-out"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                    }}
                >
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-[#0F766E] dark:bg-green-950">
                            <Sparkles className="h-4 w-4" />
                            {currentProgress?.status || "NEW"} - Tap to flip
                        </div>

                        <h1 className="max-w-full break-words text-4xl font-bold text-slate-950 dark:text-white sm:text-5xl md:text-7xl">
                            {currentVocabulary.word}
                        </h1>

                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleSpeak();
                            }}
                            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-5 py-3 font-bold text-[#4338CA] transition-all  focus:outline-none focus:ring-4 focus:ring-sky-100 dark:bg-sky-950"
                        >
                            <Volume2 className="h-5 w-5" />
                            Pronounce
                        </button>

                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleAddFavorite();
                            }}
                            className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-pink-50 px-5 py-3 font-bold text-pink-500 transition-all  focus:outline-none focus:ring-4 focus:ring-pink-100 dark:bg-pink-950/40"
                        >
                            <Heart className="h-5 w-5" />
                            Favorite
                        </button>

                        {favoriteMessage && (
                            <p className="mt-3 text-sm font-bold text-slate-400" role="status">
                                {favoriteMessage}
                            </p>
                        )}
                    </div>

                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-green-100 bg-green-50 p-6 text-center shadow-sm dark:border-green-900 dark:bg-green-950/30 md:p-10"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <p className="mb-4 text-sm font-bold uppercase tracking-wide text-green-500">
                            Meaning
                        </p>

                        <h2 className="max-w-full break-words text-3xl font-bold text-[#0F766E] sm:text-4xl md:text-6xl">
                            {currentVocabulary.meaning}
                        </h2>

                        <p className="mt-7 max-w-2xl text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
                            {currentVocabulary.exampleSentence ||
                                "No example sentence yet."}
                        </p>

                        <p className="mt-7 text-xs font-bold text-slate-400">
                            Tap again to see the word
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-between">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-bold text-slate-600 shadow-sm transition-all  focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-900 dark:text-slate-300"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-5 py-4 font-bold text-white shadow-sm transition-all  focus:outline-none focus:ring-4 focus:ring-green-100"
                >
                    {currentIndex === vocabularies.length - 1
                        ? "Finish"
                        : "Next"}
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export default LearnTopic;
