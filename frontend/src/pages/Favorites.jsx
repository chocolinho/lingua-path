import { useEffect, useState } from "react";
import { Heart, Trash2, Volume2 } from "lucide-react";
import { getMyFavorites, removeFavoriteVocabulary } from "../services/favoriteService";
import PageSkeleton from "../components/PageSkeleton";

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            setFavorites(await getMyFavorites());
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load favorites.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchFavorites();
    }, []);

    const handleRemove = async (vocabularyId) => {
        await removeFavoriteVocabulary(vocabularyId);
        setFavorites((current) =>
            current.filter((favorite) => favorite.vocabulary.id !== vocabularyId)
        );
    };

    const speak = (word) => {
        if (!word || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="kid-panel-soft p-6 md:p-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100 px-3 py-1.5 text-sm font-black text-purple-800 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-200">
                    <Heart className="h-4 w-4" />
                    Quick review
                </div>
                <h1 className="text-3xl font-black text-slate-950 dark:text-white md:text-5xl">Favorite Words</h1>
                <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600 dark:text-slate-300">
                    Keep useful vocabulary close for pronunciation and quick review.
                </p>
            </section>

            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            {favorites.length === 0 ? (
                <div className="rounded-[1.5rem] border border-purple-100 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <Heart className="mx-auto mb-4 h-12 w-12 text-pink-400" />
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">No favorites yet</h2>
                    <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">
                        Add favorites from flashcards or vocabulary review.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {favorites.map((favorite) => (
                        <article
                            key={favorite.id}
                            className="kid-card p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-[#1CB0F6]">
                                        {favorite.vocabulary.topicName}
                                    </p>
                                    <h2 className="mt-1 break-words text-3xl font-bold text-slate-950 dark:text-white">
                                        {favorite.vocabulary.word}
                                    </h2>
                                    <p className="mt-2 font-semibold text-[#58CC02]">
                                        {favorite.vocabulary.meaning}
                                    </p>
                                    <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {favorite.vocabulary.exampleSentence || "No example sentence."}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => speak(favorite.vocabulary.word)}
                                        className="rounded-2xl bg-sky-50 p-3 text-[#1CB0F6] transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-100 dark:bg-sky-950"
                                        aria-label="Pronounce word"
                                    >
                                        <Volume2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(favorite.vocabulary.id)}
                                        className="rounded-2xl bg-red-50 p-3 text-red-500 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-red-100 dark:bg-red-950/40"
                                        aria-label="Remove favorite"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;
