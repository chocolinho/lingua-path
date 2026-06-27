import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    ChevronRight,
    RotateCcw,
    Sparkles,
    Star,
    Target,
    Trophy,
    XCircle,
} from "lucide-react";
import { getVocabularies } from "../services/vocabularyService";
import { submitQuizResult } from "../services/quizService";
import { useAuth } from "../context/AuthContext";

function QuizPractice() {
    const { fetchCurrentUser } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

            const vocabularies = await getVocabularies();
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
                Math.min(5, cleanVocabularies.length)
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
            setErrorMessage("Failed to load quiz questions.");
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
                answers: finalAnswers.map((answer) => ({
                    vocabularyId: answer.questionId,
                    answer: answer.selectedAnswer,
                })),
            });

            setResult(response);
            await fetchCurrentUser();
        } catch (error) {
            console.error("Submit quiz failed:", error);
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
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 flex justify-center animate-bounce">
                        <Trophy size={56} className="text-[#58CC02]" />
                    </div>
                    <p className="font-black text-slate-500">
                        Building your quiz...
                    </p>
                </div>
            </div>
        );
    }

    if (errorMessage && questions.length === 0) {
        return (
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-yellow-100 bg-yellow-50 p-8 text-center">
                <Target className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
                <h1 className="text-2xl font-black text-slate-900">
                    Quiz is not ready yet
                </h1>
                <p className="mt-3 font-semibold text-slate-500">
                    {errorMessage}
                </p>
            </div>
        );
    }

    if (result) {
        const levelProgress = Math.min(result.levelProgress || 0, 100);

        return (
            <div className="mx-auto max-w-4xl">
                {errorMessage && (
                    <div className="mb-5 rounded-3xl bg-yellow-50 p-4 font-bold text-yellow-600">
                        {errorMessage}
                    </div>
                )}

                <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                    <div className="bg-gradient-to-br from-green-50 via-sky-50 to-yellow-50 p-7 text-center md:p-10">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white text-[#58CC02] shadow-lg">
                            <Trophy size={42} />
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 md:text-5xl">
                            Quiz Complete
                        </h1>
                        <p className="mt-3 font-semibold text-slate-500">
                            {result.correctAnswers} of {result.totalQuestions}{" "}
                            answers correct
                        </p>

                        <p className="mt-6 text-7xl font-black text-[#58CC02]">
                            {Math.round(result.score || 0)}%
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-3xl bg-white p-4">
                                <Star className="mx-auto h-6 w-6 text-yellow-500" />
                                <p className="mt-2 text-2xl font-black text-yellow-500">
                                    +{result.earnedXp || 0}
                                </p>
                                <p className="text-xs font-black text-slate-400">
                                    earned XP
                                </p>
                            </div>
                            <div className="rounded-3xl bg-white p-4">
                                <Sparkles className="mx-auto h-6 w-6 text-[#1CB0F6]" />
                                <p className="mt-2 text-2xl font-black text-[#1CB0F6]">
                                    {result.totalXp || 0}
                                </p>
                                <p className="text-xs font-black text-slate-400">
                                    total XP
                                </p>
                            </div>
                            <div className="rounded-3xl bg-white p-4">
                                <Trophy className="mx-auto h-6 w-6 text-[#CE82FF]" />
                                <p className="mt-2 text-2xl font-black text-[#CE82FF]">
                                    {result.level || 1}
                                </p>
                                <p className="text-xs font-black text-slate-400">
                                    current level
                                </p>
                            </div>
                        </div>

                        <div className="mx-auto mt-6 max-w-xl rounded-3xl bg-white p-5 text-left">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="font-black text-slate-700">
                                    Level Progress
                                </p>
                                <p className="font-black text-[#58CC02]">
                                    {levelProgress}%
                                </p>
                            </div>
                            <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                                    style={{ width: `${levelProgress}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm font-bold text-slate-400">
                                {result.totalXp || 0} /{" "}
                                {result.nextLevelXp || 100} XP
                            </p>
                        </div>
                    </div>

                    <div className="p-5 md:p-7">
                        <div className="space-y-3">
                            {answers.map((answer, index) => (
                                <div
                                    key={`${answer.questionId}-${index}`}
                                    className={`rounded-3xl border p-4 ${
                                        answer.isCorrect
                                            ? "border-green-100 bg-green-50"
                                            : "border-red-100 bg-red-50"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {answer.isCorrect ? (
                                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#58CC02]" />
                                        ) : (
                                            <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                                        )}
                                        <div>
                                            <p className="font-black text-slate-900">
                                                {index + 1}. {answer.word}
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-slate-500">
                                                Your answer:{" "}
                                                <span
                                                    className={
                                                        answer.isCorrect
                                                            ? "font-black text-[#58CC02]"
                                                            : "font-black text-red-500"
                                                    }
                                                >
                                                    {answer.selectedAnswer}
                                                </span>
                                            </p>
                                            {!answer.isCorrect && (
                                                <p className="text-sm font-semibold text-slate-500">
                                                    Correct answer:{" "}
                                                    <span className="font-black text-[#58CC02]">
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
                            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1CB0F6] px-8 py-4 font-black text-white shadow-lg shadow-sky-100 transition-all hover:-translate-y-1 sm:w-auto"
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
            <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                    <p className="font-black text-slate-500">
                        Question {currentIndex + 1} of {questions.length}
                    </p>
                    <p className="font-black text-[#58CC02]">{progress}%</p>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-black text-slate-400">
                            Choose the correct meaning
                        </p>
                        <h1 className="mt-2 break-words text-4xl font-black text-slate-900 md:text-6xl">
                            {currentQuestion.word}
                        </h1>
                    </div>
                    <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-green-100 text-[#58CC02] sm:flex">
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
                                className={`flex items-center justify-between gap-3 rounded-3xl border-2 p-5 text-left font-black transition-all ${
                                    showCorrect
                                        ? "border-[#58CC02] bg-green-50 text-[#58CC02]"
                                        : showWrong
                                          ? "border-red-400 bg-red-50 text-red-500"
                                          : "border-slate-100 bg-slate-50 text-slate-700 hover:-translate-y-1 hover:border-[#1CB0F6] hover:bg-blue-50"
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
                        className={`mt-5 rounded-3xl p-4 font-bold ${
                            selectedOption.isCorrect
                                ? "bg-green-50 text-[#58CC02]"
                                : "bg-red-50 text-red-500"
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
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-8 py-4 font-black text-white shadow-lg shadow-green-100 transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
