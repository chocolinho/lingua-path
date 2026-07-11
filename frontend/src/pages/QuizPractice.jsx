import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Crown,
    History,
    LoaderCircle,
    Lock,
    RefreshCw,
    RotateCcw,
    Sparkles,
    Star,
    Target,
    Trophy,
    XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getVocabularies } from "../services/vocabularyService";
import { getTopics } from "../services/topicService";
import { getQuizQuestionsByTopic, submitQuizResult } from "../services/quizService";
import { useAuth } from "../context/AuthContext";
import PageSkeleton from "../components/PageSkeleton";
import PremiumLockedModal from "../components/PremiumLockedModal";

const QUIZ_LENGTH_OPTIONS = [5, 10, 20, 30];
const OPTION_LABELS = ["A", "B", "C", "D"];

function shuffleArray(items) {
    const next = [...items];
    for (let index = next.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
    }
    return next;
}

function uniqueVocabulariesByMeaning(vocabularies) {
    const unique = new Map();
    vocabularies.forEach((item) => {
        if (!item.word || !item.meaning) return;
        const meaning = item.meaning.trim().toLowerCase();
        if (!unique.has(meaning)) unique.set(meaning, item);
    });
    return Array.from(unique.values());
}

function generateOptions(correctVocabulary, allVocabularies) {
    const wrongOptions = shuffleArray(
        allVocabularies.filter(
            (item) =>
                item.id !== correctVocabulary.id &&
                item.meaning?.trim().toLowerCase() !== correctVocabulary.meaning?.trim().toLowerCase()
        )
    )
        .slice(0, 3)
        .map((item) => ({ id: `wrong-${item.id}`, text: item.meaning, isCorrect: false }));

    return shuffleArray([
        { id: `correct-${correctVocabulary.id}`, text: correctVocabulary.meaning, isCorrect: true },
        ...wrongOptions,
    ]);
}

function QuizPractice() {
    const { fetchCurrentUser, isPremium } = useAuth();
    const questionHeadingRef = useRef(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState("");
    const [questionLimit, setQuestionLimit] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);

    const loadTopics = useCallback(async () => {
        try {
            setLoadingTopics(true);
            setErrorMessage("");
            const data = await getTopics();
            setTopics(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setErrorMessage("We could not load quiz topics. Check your connection and try again.");
        } finally {
            setLoadingTopics(false);
        }
    }, []);

    useEffect(() => {
        // The async loader owns the request lifecycle and related UI state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadTopics();
    }, [loadTopics]);

    const selectedTopic = useMemo(
        () => topics.find((topic) => String(topic.id) === String(selectedTopicId)),
        [selectedTopicId, topics]
    );
    const currentQuestion = questions[currentIndex];
    const progress = questions.length
        ? Math.round(((currentIndex + 1) / questions.length) * 100)
        : 0;

    const resetQuizState = () => {
        setQuestions([]);
        setCurrentIndex(0);
        setSelectedOption(null);
        setAnswers([]);
        setResult(null);
        setErrorMessage("");
    };

    const startQuiz = async () => {
        try {
            setLoadingQuestions(true);
            setErrorMessage("");
            setQuestions([]);
            setAnswers([]);
            setSelectedOption(null);
            setResult(null);
            setCurrentIndex(0);

            const effectiveLimit = isPremium ? Number(questionLimit) : 5;
            const vocabularyData = selectedTopicId
                ? await getQuizQuestionsByTopic(selectedTopicId, effectiveLimit)
                : await getVocabularies();
            const cleanVocabularies = uniqueVocabulariesByMeaning(
                Array.isArray(vocabularyData) ? vocabularyData : []
            );

            if (cleanVocabularies.length < 4) {
                setErrorMessage("This selection needs at least four vocabulary words with different meanings before a quiz can start.");
                return;
            }

            const selectedVocabularies = shuffleArray(cleanVocabularies).slice(
                0,
                Math.min(effectiveLimit, cleanVocabularies.length)
            );
            setQuestions(
                selectedVocabularies.map((vocabulary) => ({
                    id: vocabulary.id,
                    word: vocabulary.word,
                    correctAnswer: vocabulary.meaning,
                    options: generateOptions(vocabulary, cleanVocabularies),
                }))
            );
            window.requestAnimationFrame(() => questionHeadingRef.current?.focus());
        } catch (error) {
            console.error(error);
            if (error.response?.status === 403) setPremiumModalOpen(true);
            setErrorMessage(error.response?.data?.message || "We could not prepare this quiz. Try another topic or try again.");
        } finally {
            setLoadingQuestions(false);
        }
    };

    const submitAnswers = async (finalAnswers) => {
        const totalQuestions = questions.length;
        const correctAnswers = finalAnswers.filter((answer) => answer.isCorrect).length;
        const fallbackScore = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

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
                setErrorMessage(error.response?.data?.message || "This quiz length requires Premium.");
                setPremiumModalOpen(true);
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
            setErrorMessage("Your quiz is complete, but the result could not be saved. Check your connection before leaving this page.");
        } finally {
            setSubmitting(false);
        }
    };

    const chooseAnswer = (option) => {
        if (selectedOption || submitting || result) return;
        setSelectedOption(option);
        setAnswers((current) => [
            ...current,
            {
                questionId: currentQuestion.id,
                word: currentQuestion.word,
                selectedAnswer: option.text,
                correctAnswer: currentQuestion.correctAnswer,
                isCorrect: option.isCorrect,
            },
        ]);
    };

    const continueQuiz = () => {
        if (currentIndex === questions.length - 1) {
            submitAnswers(answers);
            return;
        }
        setCurrentIndex((current) => current + 1);
        setSelectedOption(null);
        window.requestAnimationFrame(() => questionHeadingRef.current?.focus());
    };

    const exitQuiz = () => {
        if (answers.length > 0 && !window.confirm("End this quiz? Your current answers will not be saved.")) return;
        resetQuizState();
    };

    if (loadingTopics) return <PageSkeleton variant="dashboard" />;

    return (
        <div className="app-page">
            <PremiumLockedModal
                open={premiumModalOpen}
                title="Longer quizzes are Premium"
                description="Free learners can practice five questions per quiz. Premium unlocks longer quizzes and premium topics."
                onClose={() => setPremiumModalOpen(false)}
            />

            {!currentQuestion && !result && (
                <QuizSetup
                    topics={topics}
                    selectedTopicId={selectedTopicId}
                    onTopicChange={setSelectedTopicId}
                    questionLimit={questionLimit}
                    onQuestionLimitChange={(value) => {
                        if (!isPremium && value > 5) {
                            setPremiumModalOpen(true);
                            return;
                        }
                        setQuestionLimit(value);
                    }}
                    isPremium={isPremium}
                    loading={loadingQuestions}
                    errorMessage={errorMessage}
                    onStart={startQuiz}
                    onRetryTopics={loadTopics}
                    onOpenPremium={() => setPremiumModalOpen(true)}
                />
            )}

            {currentQuestion && !result && (
                <QuizQuestion
                    question={currentQuestion}
                    questionIndex={currentIndex}
                    questionCount={questions.length}
                    progress={progress}
                    selectedOption={selectedOption}
                    submitting={submitting}
                    topicName={selectedTopic?.name || "All topics"}
                    questionHeadingRef={questionHeadingRef}
                    onChoose={chooseAnswer}
                    onContinue={continueQuiz}
                    onExit={exitQuiz}
                />
            )}

            {result && (
                <QuizResult
                    result={result}
                    answers={answers}
                    errorMessage={errorMessage}
                    topicName={selectedTopic?.name || "All topics"}
                    onRetry={startQuiz}
                    onChangeSettings={resetQuizState}
                    loading={loadingQuestions}
                />
            )}
        </div>
    );
}

function QuizSetup({ topics, selectedTopicId, onTopicChange, questionLimit, onQuestionLimitChange, isPremium, loading, errorMessage, onStart, onRetryTopics, onOpenPremium }) {
    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <header className="text-center">
                <div className="ui-badge mx-auto">
                    <Target className="h-4 w-4" aria-hidden="true" />
                    Focused practice
                </div>
                <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Quiz practice</h1>
                <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
                    Choose a topic and session length, then work through one meaning at a time.
                </p>
            </header>

            {errorMessage && (
                <div className="ui-alert flex flex-col gap-3 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
                    <span>{errorMessage}</span>
                    {topics.length === 0 && (
                        <button type="button" onClick={onRetryTopics} className="ui-button shrink-0 border border-red-300 bg-white text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
                            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry
                        </button>
                    )}
                </div>
            )}

            {!errorMessage && topics.length === 0 && (
                <div className="ui-alert flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" role="status">
                    <span>No quiz topics are available yet. Add vocabulary before starting a practice session.</span>
                    <Link to="/vocabularies" className="ui-button ui-button-outline shrink-0">
                        Open vocabulary
                    </Link>
                </div>
            )}

            <section className="ui-panel overflow-hidden" aria-labelledby="quiz-settings-title">
                <div className="border-b border-[var(--color-border)] p-5 sm:p-6">
                    <h2 id="quiz-settings-title" className="text-2xl font-bold">Set up your session</h2>
                    <p className="mt-1 text-[var(--color-text-muted)]">Topics need at least four available words with different meanings.</p>
                </div>
                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
                    <div>
                        <label htmlFor="quiz-topic" className="mb-2 block text-sm font-bold">Topic</label>
                        <select id="quiz-topic" value={selectedTopicId} onChange={(event) => onTopicChange(event.target.value)} className="ui-input px-4">
                            <option value="">All available topics</option>
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.id} disabled={(topic.vocabularyCount ?? 0) < 4 || topic.locked}>
                                    {topic.name} ({topic.vocabularyCount ?? 0} words){topic.locked ? " — Premium" : ""}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">Locked or undersized topics remain unavailable.</p>
                    </div>

                    <fieldset>
                        <legend className="mb-2 text-sm font-bold">Number of questions</legend>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                            {QUIZ_LENGTH_OPTIONS.map((option) => {
                                const locked = !isPremium && option > 5;
                                const selected = questionLimit === option;
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => onQuestionLimitChange(option)}
                                        className={`relative min-h-14 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${selected ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]"}`}
                                        aria-pressed={selected}
                                    >
                                        {option}
                                        <span className="block text-xs font-semibold text-[var(--color-text-muted)]">questions</span>
                                        {locked && <Lock className="absolute right-2 top-2 h-3.5 w-3.5 text-[var(--color-warning)]" aria-label="Premium" />}
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>
                </div>

                <div className="flex flex-col gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-center gap-3">
                        {isPremium ? <Crown className="h-5 w-5 text-[var(--color-warning)]" aria-hidden="true" /> : <Lock className="h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />}
                        <p className="text-sm"><span className="font-bold">{isPremium ? "Premium access" : "Free session"}</span><span className="text-[var(--color-text-muted)]"> · {isPremium ? "Choose any available length" : "Five questions per quiz"}</span></p>
                    </div>
                    <button type="button" onClick={onStart} disabled={loading || topics.length === 0} className="ui-button ui-button-primary min-w-40">
                        {loading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Target className="h-5 w-5" aria-hidden="true" />}
                        {loading ? "Preparing" : "Start quiz"}
                    </button>
                </div>
            </section>

            {!isPremium && (
                <button type="button" onClick={onOpenPremium} className="mx-auto flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-[var(--color-warning)] hover:bg-amber-50 dark:hover:bg-amber-950/30">
                    <Crown className="h-4 w-4" aria-hidden="true" /> Explore longer practice sessions
                </button>
            )}
        </div>
    );
}

function QuizQuestion({ question, questionIndex, questionCount, progress, selectedOption, submitting, topicName, questionHeadingRef, onChoose, onContinue, onExit }) {
    const answered = Boolean(selectedOption);

    return (
        <div className="mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-between gap-4">
                <button type="button" onClick={onExit} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Exit quiz
                </button>
                <span className="ui-badge">{topicName}</span>
            </div>

            <section aria-label="Quiz progress">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold">
                    <span>Question {questionIndex + 1} of {questionCount}</span>
                    <span className="tabular-nums text-[var(--color-primary)]">{progress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]" role="progressbar" aria-label="Quiz progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${progress}%` }} />
                </div>
            </section>

            <section className="ui-panel p-5 sm:p-8" aria-labelledby="quiz-question-title">
                <p className="text-sm font-bold text-[var(--color-text-muted)]">Choose the correct meaning</p>
                <h1 id="quiz-question-title" ref={questionHeadingRef} tabIndex={-1} className="mt-3 break-words text-4xl font-bold tracking-tight sm:text-5xl">{question.word}</h1>

                <div className="mt-7 grid gap-3" role="group" aria-label={`Answer options for ${question.word}`}>
                    {question.options.map((option, index) => {
                        const selected = selectedOption?.id === option.id;
                        const correct = answered && option.isCorrect;
                        const wrong = selected && !option.isCorrect;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => onChoose(option)}
                                disabled={answered || submitting}
                                aria-pressed={selected}
                                className={`flex min-h-16 items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors ${correct ? "border-green-700 bg-green-50 text-green-900 dark:border-green-400 dark:bg-green-950/30 dark:text-green-100" : wrong ? "border-red-700 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/30 dark:text-red-100" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary-soft)]"}`}
                            >
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${correct ? "border-green-700 bg-green-700 text-white dark:border-green-300 dark:bg-green-300 dark:text-green-950" : wrong ? "border-red-700 bg-red-700 text-white dark:border-red-300 dark:bg-red-300 dark:text-red-950" : "border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)]"}`}>{OPTION_LABELS[index]}</span>
                                <span className="min-w-0 flex-1 break-words font-semibold">{option.text}</span>
                                {correct && <CheckCircle2 className="h-5 w-5 shrink-0" aria-label="Correct answer" />}
                                {wrong && <XCircle className="h-5 w-5 shrink-0" aria-label="Your answer is incorrect" />}
                            </button>
                        );
                    })}
                </div>

                {answered && (
                    <div className={`mt-5 flex items-start gap-3 rounded-xl p-4 ${selectedOption.isCorrect ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100" : "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100"}`} role="status" aria-live="polite">
                        {selectedOption.isCorrect ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
                        <p className="font-semibold">{selectedOption.isCorrect ? "Correct. Keep going." : `Not quite. The correct answer is ${question.correctAnswer}.`}</p>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button type="button" onClick={onContinue} disabled={!answered || submitting} className="ui-button ui-button-primary w-full sm:w-auto sm:min-w-44">
                        {submitting && <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />}
                        {submitting ? "Saving result" : questionIndex === questionCount - 1 ? "Finish quiz" : "Continue"}
                        {!submitting && <ChevronRight className="h-5 w-5" aria-hidden="true" />}
                    </button>
                </div>
            </section>
        </div>
    );
}

function QuizResult({ result, answers, errorMessage, topicName, onRetry, onChangeSettings, loading }) {
    const score = Math.round(Number(result.score || 0));
    const levelProgress = Math.min(Math.max(Number(result.levelProgress || 0), 0), 100);
    const currentLevelXp = result.currentLevelXp ?? result.totalXp ?? 0;
    const nextLevelXp = result.nextLevelXp ?? 100;
    const scoreMessage = score >= 80 ? "Strong result" : score >= 60 ? "Good progress" : "Keep practising";

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {errorMessage && <div className="ui-alert border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100" role="alert">{errorMessage}</div>}

            <section className="ui-panel-accent p-6 text-center sm:p-8" aria-labelledby="quiz-result-title">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm">
                    <Trophy className="h-8 w-8" aria-hidden="true" />
                </span>
                <p className="mt-5 text-sm font-bold text-[var(--color-primary)]">{topicName}</p>
                <h1 id="quiz-result-title" className="mt-1 text-3xl font-bold sm:text-4xl">{scoreMessage}</h1>
                <p className="mt-2 text-[var(--color-text-muted)]">You answered {result.correctAnswers} of {result.totalQuestions} questions correctly.</p>
                <p className="mt-5 text-6xl font-bold tabular-nums text-[var(--color-primary)] sm:text-7xl">{score}%</p>

                <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
                    <ResultMetric icon={Star} label="XP earned" value={`+${result.earnedXp || 0}`} />
                    <ResultMetric icon={Sparkles} label="Total XP" value={result.totalXp || 0} />
                    <ResultMetric icon={Trophy} label="Level" value={result.level || 1} />
                </div>

                <div className="mx-auto mt-6 max-w-2xl rounded-xl bg-[var(--color-surface)] p-4 text-left">
                    <div className="flex items-center justify-between gap-3 text-sm font-bold"><span>Level progress</span><span className="tabular-nums text-[var(--color-primary)]">{levelProgress}%</span></div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]" role="progressbar" aria-label="Level progress" aria-valuenow={levelProgress} aria-valuemin={0} aria-valuemax={100}>
                        <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${levelProgress}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">{currentLevelXp} / {nextLevelXp} XP</p>
                </div>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button type="button" onClick={onRetry} disabled={loading} className="ui-button ui-button-primary">
                        {loading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <RotateCcw className="h-5 w-5" aria-hidden="true" />}
                        {loading ? "Preparing" : "Practice again"}
                    </button>
                    <button type="button" onClick={onChangeSettings} className="ui-button ui-button-outline">Change settings</button>
                    <Link to="/quiz-results" className="ui-button ui-button-outline"><History className="h-5 w-5" aria-hidden="true" /> Quiz history</Link>
                </div>
            </section>

            <section className="ui-panel p-5 sm:p-6" aria-labelledby="answer-review-title">
                <div className="mb-5">
                    <p className="text-sm font-semibold text-[var(--color-primary)]">Answer review</p>
                    <h2 id="answer-review-title" className="text-2xl font-bold">Review this session</h2>
                </div>
                <ol className="space-y-3">
                    {answers.map((answer) => (
                        <li key={answer.questionId} className={`rounded-xl border p-4 ${answer.isCorrect ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30" : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"}`}>
                            <div className="flex items-start gap-3">
                                {answer.isCorrect ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700 dark:text-green-300" aria-hidden="true" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700 dark:text-red-300" aria-hidden="true" />}
                                <div className="min-w-0">
                                    <h3 className="break-words font-bold">{answer.word}</h3>
                                    <p className="mt-1 break-words text-sm"><span className="text-[var(--color-text-muted)]">Your answer:</span> <span className="font-semibold">{answer.selectedAnswer}</span></p>
                                    {!answer.isCorrect && <p className="mt-1 break-words text-sm"><span className="text-[var(--color-text-muted)]">Correct answer:</span> <span className="font-semibold">{answer.correctAnswer}</span></p>}
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}

function ResultMetric({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl bg-[var(--color-surface)] p-4">
            <Icon className="mx-auto h-5 w-5 text-[var(--color-secondary)]" aria-hidden="true" />
            <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">{label}</p>
        </div>
    );
}

export default QuizPractice;
