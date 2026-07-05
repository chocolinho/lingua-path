import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    ChevronRight,
    Crown,
    Lock,
    RotateCcw,
    Sparkles,
    Star,
    Target,
    Trophy,
    XCircle,
} from "lucide-react";
import { getVocabularies } from "../services/vocabularyService";
import { getTopics } from "../services/topicService";
import { getQuizQuestionsByTopic, submitQuizResult } from "../services/quizService";
import { useAuth } from "../context/AuthContext";
import PageSkeleton from "../components/PageSkeleton";
import PremiumLockedModal from "../components/PremiumLockedModal";

function QuizPractice() {
    const { fetchCurrentUser, isPremium } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [questionLimit, setQuestionLimit] = useState(5);
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);

    const quizLengthOptions = [5, 10, 20, 30];

    const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

    const getUniqueVocabulariesByMeaning = (vocabularies) => {
        const map = new Map();

        vocabularies.forEach((item) => {
            if (!item.word || !item.meaning) return;

            const meaningKey = item.meaning.trim().toLowerCase();

            if (!map.has(meaningKey)) {
                map.set(meaningKey, item);
            }
        });

        return Array.from(map.values());
    };

    const generateOptions = (correctVocabulary, allVocabularies) => {
        const wrongOptions = shuffleArray(
            allVocabularies.filter(
                (item) =>
                    item.id !== correctVocabulary.id &&
                    item.meaning?.trim().toLowerCase() !==
                        correctVocabulary.meaning?.trim().toLowerCase()
            )
        )
            .slice(0, 3)
            .map((item, index) => ({
                id: `wrong-${item.id}-${index}`,
                text: item.meaning,
                isCorrect: false,
            }));

        return shuffleArray([
            {
                id: `correct-${correctVocabulary.id}`,
                text: correctVocabulary.meaning,
                isCorrect: true,
            },
            ...wrongOptions,
        ]);
    };

    const loadQuestions = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            setResult(null);
            setAnswers([]);
            setSelectedOption(null);
            setCurrentIndex(0);

            const effectiveQuestionLimit = isPremium
                ? Number(questionLimit)
                : 5;

            const [topicData, vocabularyData] = await Promise.all([
                getTopics(),
                selectedTopicId
                    ? getQuizQuestionsByTopic(
                        selectedTopicId,
                        effectiveQuestionLimit
                    )
                    : getVocabularies(),
            ]);

            setTopics(topicData);
            const vocabularies = vocabularyData;
            const cleanVocabularies =
                getUniqueVocabulariesByMeaning(vocabularies);

            if (cleanVocabularies.length < 4) {
                setQuestions([]);
                setErrorMessage(
                    "You need at least 4 vocabulary words with different meanings to start a quiz."
                );
                return;
            }

            const selectedVocabularies = shuffleArray(cleanVocabularies).slice(
                0,
                Math.min(effectiveQuestionLimit, cleanVocabularies.length)
            );

            setQuestions(
                selectedVocabularies.map((vocabulary) => ({
                    id: vocabulary.id,
                    word: vocabulary.word,
                    correctAnswer: vocabulary.meaning,
                    options: generateOptions(vocabulary, cleanVocabularies),
                }))
            );
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.message || "Failed to load quiz questions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentQuestion = questions[currentIndex];

    const progress = useMemo(
        () =>
            questions.length > 0
                ? Math.round(((currentIndex + 1) / questions.length) * 100)
                : 0,
        [currentIndex, questions.length]
    );

    const submitAnswers = async (finalAnswers) => {
        const totalQuestions = questions.length;
        const correctAnswers = finalAnswers.filter(
            (answer) => answer.isCorrect
        ).length;
        const fallbackScore =
            totalQuestions === 0
                ? 0
                : Math.round((correctAnswers / totalQuestions) * 100);

        try {
            setSubmitting(true);
            setErrorMessage("");

            const response = await submitQuizResult({
                topicId: selectedTopicId ? Number(selectedTopicId) : null,
                answers: finalAnswers.map((answer) => ({
                    vocabularyId: answer.questionId,
                    answer: answer.selectedAnswer,
                })),
            });

            setResult(response);
            await fetchCurrentUser();
        } catch (error) {
            console.error("Submit quiz failed:", error);
            if (error.response?.status === 403) {
                setErrorMessage(
                    error.response?.data?.message ||
                        "This quiz length requires Premium."
                );
                return;
            }

            setResult({
                totalQuestions,
                correctAnswers,
                score: fallbackScore,
                earnedXp: 0,
                totalXp: 0,
                level: 1,
                currentLevelXp: 0,
                nextLevelXp: 100,
                levelProgress: 0,
            });
            setErrorMessage(
                "Quiz completed, but the result could not be saved to backend."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleChooseAnswer = (option) => {
        if (selectedOption || submitting || result) return;

        const answerData = {
            questionId: currentQuestion.id,
            word: currentQuestion.word,
            selectedAnswer: option.text,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: option.isCorrect,
        };

        setSelectedOption(option);
        setAnswers((previous) => [...previous, answerData]);
    };

    const handleContinue = () => {
        const isLastQuestion = currentIndex === questions.length - 1;
        const finalAnswers = answers;

        if (isLastQuestion) {
            submitAnswers(finalAnswers);
            return;
        }

        setCurrentIndex((previous) => previous + 1);
        setSelectedOption(null);
    };

    if (loading) {
        return <PageSkeleton />;
    }

    const renderTopicSelector = () => (
        <div className="mb-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto] lg:items-end">
                <div>
                    <label
                        htmlFor="quiz-topic"
                        className="mb-2 block text-sm font-bold text-slate-500 dark:text-slate-400"
                    >
                        Quiz Topic
                    </label>
                    <select
                        id="quiz-topic"
                        value={selectedTopicId}
                        onChange={(event) =>
                            setSelectedTopicId(event.target.value)
                        }
                        className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-semibold outline-none transition-all focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    >
                        <option value="">All topics</option>
                        {topics.map((topic) => (
                            <option
                                key={topic.id}
                                value={topic.id}
                                disabled={
                                    (topic.vocabularyCount ?? 0) < 4 ||
                                    topic.locked
                                }
                            >
                                {topic.name} ({topic.vocabularyCount ?? 0} words)
                                {topic.locked ? " - Premium" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="quiz-length"
                        className="mb-2 block text-sm font-bold text-slate-500 dark:text-slate-400"
                    >
                        Quiz Length
                    </label>
                    <select
                        id="quiz-length"
                        value={questionLimit}
                        onChange={(event) => {
                            const nextValue = Number(event.target.value);

                            if (!isPremium && nextValue > 5) {
                                setPremiumModalOpen(true);
                                return;
                            }

                            setQuestionLimit(nextValue);
                        }}
                        className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-semibold outline-none transition-all focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    >
                        {quizLengthOptions.map((option) => (
                            <option
                                key={option}
                                value={option}
                                disabled={!isPremium && option > 5}
                            >
                                {option} questions
                                {!isPremium && option > 5 ? " - Premium" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={loadQuestions}
                    className="rounded-2xl bg-[#1CB0F6] px-5 py-3 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-100"
                >
                    Load Quiz
                </button>
            </div>

            {!isPremium && (
                <button
                    type="button"
                    onClick={() => setPremiumModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-yellow-100 px-4 py-3 text-sm font-bold text-yellow-700 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-100"
                >
                    <Lock className="h-4 w-4" />
                    Unlock 10, 20, 30-question quizzes
                </button>
            )}
        </div>
    );

    if (!currentQuestion) {
        return (
            <div className="mx-auto max-w-3xl">
                <PremiumLockedModal
                    open={premiumModalOpen}
                    title="Longer quizzes are Premium"
                    description="Free learners can practice 5 questions per quiz. Premium unlocks longer quizzes and advanced learning tools."
                    onClose={() => setPremiumModalOpen(false)}
                />
                {renderTopicSelector()}
                <div className="rounded-[2rem] border border-yellow-100 bg-yellow-50 p-8 text-center dark:border-yellow-900 dark:bg-yellow-950/40">
                    <Target className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                        Quiz is not ready yet
                    </h1>
                    <p className="mt-3 font-semibold text-slate-500 dark:text-slate-300">
                        {errorMessage ||
                            "Choose a topic with at least 4 words to start."}
                    </p>
                </div>
            </div>
        );
    }

    if (result) {
        const levelProgress = Math.min(result.levelProgress || 0, 100);
        const currentLevelXp = result.currentLevelXp ?? result.totalXp ?? 0;
        const nextLevelXp = result.nextLevelXp ?? 100;

        return (
            <div className="mx-auto max-w-4xl">
                {errorMessage && (
                    <div className="mb-5 rounded-2xl bg-yellow-50 p-4 font-semibold text-yellow-600 dark:bg-yellow-950/40">
                        {errorMessage}
                    </div>
                )}

                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="bg-slate-50 p-7 text-center dark:bg-slate-950 md:p-10">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white text-[#58CC02] shadow-sm dark:bg-slate-900">
                            <Trophy size={42} />
                        </div>

                        <h1 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
                            Quiz Complete
                        </h1>
                        <p className="mt-3 font-medium text-slate-500 dark:text-slate-400">
                            {result.correctAnswers} of {result.totalQuestions}{" "}
                            answers correct
                        </p>

                        <p className="mt-6 text-6xl font-bold text-[#58CC02] md:text-7xl">
                            {Math.round(result.score || 0)}%
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                                <Star className="mx-auto h-6 w-6 text-yellow-500" />
                                <p className="mt-2 text-2xl font-bold text-yellow-500">
                                    +{result.earnedXp || 0}
                                </p>
                                <p className="text-xs font-bold text-slate-400">
                                    earned XP
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                                <Sparkles className="mx-auto h-6 w-6 text-[#1CB0F6]" />
                                <p className="mt-2 text-2xl font-bold text-[#1CB0F6]">
                                    {result.totalXp || 0}
                                </p>
                                <p className="text-xs font-bold text-slate-400">
                                    total XP
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                                <Trophy className="mx-auto h-6 w-6 text-[#CE82FF]" />
                                <p className="mt-2 text-2xl font-bold text-[#CE82FF]">
                                    {result.level || 1}
                                </p>
                                <p className="text-xs font-bold text-slate-400">
                                    current level
                                </p>
                            </div>
                        </div>

                        <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-white p-5 text-left dark:bg-slate-900">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="font-bold text-slate-700 dark:text-slate-200">
                                    Level Progress
                                </p>
                                <p className="font-bold text-[#58CC02]">
                                    {levelProgress}%
                                </p>
                            </div>
                            <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                    className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                                    style={{ width: `${levelProgress}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm font-semibold text-slate-400">
                                {currentLevelXp} / {nextLevelXp} XP
                            </p>
                        </div>
                    </div>

                    <div className="p-5 md:p-7">
                        <div className="space-y-3">
                            {answers.map((answer, index) => (
                                <div
                                    key={`${answer.questionId}-${index}`}
                                    className={`rounded-2xl border p-4 ${
                                        answer.isCorrect
                                            ? "border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-950/40"
                                            : "border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-950/40"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {answer.isCorrect ? (
                                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#58CC02]" />
                                        ) : (
                                            <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                                        )}
                                        <div>
                                            <p className="font-bold text-slate-950 dark:text-white">
                                                {index + 1}. {answer.word}
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
                                                Your answer:{" "}
                                                <span
                                                    className={
                                                        answer.isCorrect
                                                            ? "font-bold text-[#58CC02]"
                                                            : "font-bold text-red-500"
                                                    }
                                                >
                                                    {answer.selectedAnswer}
                                                </span>
                                            </p>
                                            {!answer.isCorrect && (
                                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                                                    Correct answer:{" "}
                                                    <span className="font-bold text-[#58CC02]">
                                                        {answer.correctAnswer}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={loadQuestions}
                            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1CB0F6] px-8 py-4 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-100 sm:w-auto"
                        >
                            <RotateCcw size={20} />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isAnswered = Boolean(selectedOption);

    return (
        <div className="mx-auto max-w-3xl">
            <PremiumLockedModal
                open={premiumModalOpen}
                title="Longer quizzes are Premium"
                description="Free learners can practice 5 questions per quiz. Premium unlocks longer quizzes and advanced learning tools."
                onClose={() => setPremiumModalOpen(false)}
            />

            {renderTopicSelector()}

            <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                    <p className="font-bold text-slate-500 dark:text-slate-400">
                        Question {currentIndex + 1} of {questions.length}
                    </p>
                    <p className="font-bold text-[#58CC02]">{progress}%</p>
                </div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                    {isPremium ? (
                        <Crown className="h-4 w-4 text-yellow-500" />
                    ) : (
                        <Lock className="h-4 w-4 text-slate-400" />
                    )}
                    {isPremium ? "Premium quiz length" : "Free quiz: 5 questions"}
                </div>

                <div
                    className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                    role="progressbar"
                    aria-label="Quiz progress"
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

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-slate-400">
                            Choose the correct meaning
                        </p>
                        <h1 className="mt-2 break-words text-4xl font-bold text-slate-950 dark:text-white md:text-6xl">
                            {currentQuestion.word}
                        </h1>
                    </div>
                    <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-[#58CC02] sm:flex">
                        <Target className="h-8 w-8" />
                    </div>
                </div>

                <div className="grid gap-3">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedOption?.id === option.id;
                        const showCorrect = isAnswered && option.isCorrect;
                        const showWrong = isSelected && !option.isCorrect;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleChooseAnswer(option)}
                                disabled={isAnswered || submitting}
                                aria-pressed={isSelected}
                                className={`flex items-center justify-between gap-3 rounded-2xl border-2 p-5 text-left font-bold transition-all focus:outline-none focus:ring-4 focus:ring-sky-100 ${
                                    showCorrect
                                        ? "border-[#58CC02] bg-green-50 text-[#58CC02] dark:bg-green-950/40"
                                        : showWrong
                                          ? "border-red-400 bg-red-50 text-red-500 dark:bg-red-950/40"
                                          : "border-slate-200 bg-slate-50 text-slate-700 hover:-translate-y-0.5 hover:border-[#1CB0F6] hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                }`}
                            >
                                <span>{option.text}</span>
                                {showCorrect && (
                                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                                )}
                                {showWrong && (
                                    <XCircle className="h-5 w-5 shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div
                        role="status"
                        aria-live="polite"
                        className={`mt-5 rounded-2xl p-4 font-semibold ${
                            selectedOption.isCorrect
                                ? "bg-green-50 text-[#58CC02] dark:bg-green-950/40"
                                : "bg-red-50 text-red-500 dark:bg-red-950/40"
                        }`}
                    >
                        {selectedOption.isCorrect
                            ? "Correct. Nice work."
                            : `Not quite. The correct answer is ${currentQuestion.correctAnswer}.`}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!isAnswered || submitting}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-8 py-4 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                    {submitting
                        ? "Saving result..."
                        : currentIndex === questions.length - 1
                          ? "Finish Quiz"
                          : "Continue"}
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export default QuizPractice;
