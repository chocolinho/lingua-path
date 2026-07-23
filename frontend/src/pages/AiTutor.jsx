import { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    Bot,
    GraduationCap,
    LoaderCircle,
    Send,
    Sparkles,
    UserRound,
} from "lucide-react";
import { askAiTutor } from "../services/aiTutorService";
import { getTopics } from "../services/topicService";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const MAX_MESSAGE_LENGTH = 500;

const QUICK_PROMPTS = [
    "Explain this word: apple",
    "Check my sentence: I has a dog.",
    "Practice conversation about school.",
    "Give me 3 examples with the word happy.",
];

const WELCOME_MESSAGE = {
    id: "welcome",
    role: "assistant",
    content:
        "Hi, I am your AI English Tutor. Ask me about words, grammar, examples, or simple conversation practice.",
};

function AiTutor() {
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [message, setMessage] = useState("");
    const [level, setLevel] = useState("A1");
    const [topic, setTopic] = useState("");
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fieldError, setFieldError] = useState("");
    const [requestError, setRequestError] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        let active = true;

        getTopics()
            .then((data) => {
                if (active) setTopics(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Failed to load AI Tutor topics", error);
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, loading]);

    const remainingCharacters = MAX_MESSAGE_LENGTH - message.length;

    const selectedTopicName = useMemo(() => {
        if (!topic) return "";
        return topics.find((item) => String(item.id) === String(topic))?.name || "";
    }, [topic, topics]);

    const submitMessage = async (event) => {
        event?.preventDefault();
        const trimmedMessage = message.trim();
        setFieldError("");
        setRequestError("");

        if (!trimmedMessage) {
            setFieldError("Please type a question first.");
            inputRef.current?.focus();
            return;
        }

        if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
            setFieldError("Please keep your question under 500 characters.");
            inputRef.current?.focus();
            return;
        }

        const userMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: trimmedMessage,
        };

        setMessages((currentMessages) => [...currentMessages, userMessage]);
        setMessage("");
        setLoading(true);

        try {
            const data = await askAiTutor({
                message: trimmedMessage,
                level,
                topic: selectedTopicName,
            });

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    content: data?.reply || "I could not make an answer this time. Please try again.",
                },
            ]);
        } catch (error) {
            console.error("Failed to ask AI tutor", error);
            setRequestError(
                error.response?.data?.message ||
                    "The tutor could not answer right now. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const applyQuickPrompt = (prompt) => {
        setMessage(prompt);
        setFieldError("");
        inputRef.current?.focus();
    };

    return (
        <div className="app-page space-y-6">
            <section className="ui-panel-accent p-6 sm:p-8">
                <div className="max-w-3xl">
                    <div className="ui-badge">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        Guided English practice
                    </div>
                    <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                        AI English Tutor
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
                        Ask short questions, practise simple conversations, and get friendly help in English and Vietnamese.
                    </p>
                </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="ui-panel flex min-h-[36rem] flex-col overflow-hidden">
                    <div className="border-b border-[var(--color-border)] p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]">
                                <Bot className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-lg font-bold">Tutor chat</h2>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    Level {level}{selectedTopicName ? ` · ${selectedTopicName}` : ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto bg-[var(--color-surface-subtle)] p-4 sm:p-5">
                        {messages.map((item) => (
                            <ChatMessage key={item.id} message={item} />
                        ))}

                        {loading && (
                            <div className="flex items-start gap-3">
                                <MessageAvatar role="assistant" />
                                <div className="max-w-[84%] rounded-2xl rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-text-muted)]">
                                    <span className="inline-flex items-center gap-2">
                                        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                                        Thinking...
                                    </span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={submitMessage} className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
                        {requestError && (
                            <div className="ui-alert mb-4 flex items-start gap-3 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100" role="alert">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                                <p className="text-sm font-semibold">{requestError}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="ai-tutor-message" className="text-sm font-bold">
                                Your question
                            </label>
                            <textarea
                                ref={inputRef}
                                id="ai-tutor-message"
                                className="ui-input mt-2 min-h-28 resize-none p-4"
                                value={message}
                                maxLength={MAX_MESSAGE_LENGTH}
                                onChange={(event) => {
                                    setMessage(event.target.value);
                                    setFieldError("");
                                }}
                                placeholder="Ask about a word, sentence, or grammar rule."
                                disabled={loading}
                                aria-invalid={fieldError ? "true" : "false"}
                                aria-describedby="ai-tutor-message-help"
                            />
                            <div id="ai-tutor-message-help" className="mt-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <p className={fieldError ? "font-semibold text-[var(--color-danger)]" : "text-[var(--color-text-muted)]"}>
                                    {fieldError || "Keep it short so the tutor can answer clearly."}
                                </p>
                                <p className="font-semibold text-[var(--color-text-muted)]">
                                    {remainingCharacters} characters left
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
                                <label className="min-w-0">
                                    <span className="text-sm font-bold">Level</span>
                                    <select
                                        className="ui-input mt-2 min-w-28 px-3"
                                        value={level}
                                        onChange={(event) => setLevel(event.target.value)}
                                        disabled={loading}
                                    >
                                        {LEVELS.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="min-w-0 sm:min-w-44">
                                    <span className="text-sm font-bold">Topic</span>
                                    <select
                                        className="ui-input mt-2 px-3"
                                        value={topic}
                                        onChange={(event) => setTopic(event.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="">Any topic</option>
                                        {topics.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <button type="submit" className="ui-button ui-button-primary w-full sm:w-auto" disabled={loading}>
                                {loading ? (
                                    <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                                ) : (
                                    <Send className="h-5 w-5" aria-hidden="true" />
                                )}
                                Send
                            </button>
                        </div>
                    </form>
                </div>

                <aside className="space-y-5">
                    <section className="ui-panel p-5">
                        <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]">
                                <GraduationCap className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="font-bold">Quick prompts</h2>
                                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                                    Tap one, then change the words if you want.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2">
                            {QUICK_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => applyQuickPrompt(prompt)}
                                    className="min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left text-sm font-semibold transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-accent)]"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="ui-panel p-5">
                        <h2 className="font-bold">Tutor rules</h2>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-muted)]">
                            <li>Answers stay short and friendly.</li>
                            <li>Grammar fixes include one better sentence.</li>
                            <li>Unsafe or unrelated topics are not supported.</li>
                        </ul>
                    </section>
                </aside>
            </section>
        </div>
    );
}

function ChatMessage({ message }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex items-start gap-3 ${isUser ? "justify-end" : ""}`}>
            {!isUser && <MessageAvatar role="assistant" />}
            <div
                className={`max-w-[84%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 sm:text-base ${
                    isUser
                        ? "rounded-tr-sm bg-[var(--color-primary)] font-semibold text-[var(--color-on-primary)]"
                        : "rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface)]"
                }`}
            >
                {message.content}
            </div>
            {isUser && <MessageAvatar role="user" />}
        </div>
    );
}

function MessageAvatar({ role }) {
    const isUser = role === "user";
    const Icon = isUser ? UserRound : Bot;

    return (
        <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                isUser
                    ? "bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]"
                    : "bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]"
            }`}
        >
            <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
    );
}

export default AiTutor;
