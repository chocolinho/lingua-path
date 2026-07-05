import { useEffect, useState } from "react";
import { getMyQuizResults } from "../services/quizService";
import PageSkeleton from "../components/PageSkeleton";
import { Trophy } from "lucide-react";

function MyQuizResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getMyQuizResults();
                setResults(data);
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to load quiz results.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="kid-panel-soft p-6 md:p-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-sm font-black text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                    <Trophy className="h-4 w-4" />
                    Quiz history
                </div>
                <h1 className="text-3xl font-black text-slate-950 dark:text-white md:text-5xl">
                    My Quiz Results
                </h1>
                <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600 dark:text-slate-300">
                    Review your quiz history and learning progress.
                </p>
            </section>

            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            <div className="kid-panel overflow-hidden">
                {results.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="font-bold text-slate-500 dark:text-slate-400">
                            No quiz results yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px]">
                        <thead className="bg-green-50 dark:bg-slate-950">
                        <tr>
                            <th className="p-4 text-left text-sm font-bold text-slate-500 dark:text-slate-400">Total</th>
                            <th className="p-4 text-left text-sm font-bold text-slate-500 dark:text-slate-400">Correct</th>
                            <th className="p-4 text-left text-sm font-bold text-slate-500 dark:text-slate-400">Score</th>
                            <th className="p-4 text-left text-sm font-bold text-slate-500 dark:text-slate-400">Submitted At</th>
                        </tr>
                        </thead>

                        <tbody>
                        {results.map((result) => (
                            <tr key={result.id} className="border-t border-slate-100 dark:border-slate-800">
                                <td className="p-4 font-bold text-slate-700 dark:text-slate-200">{result.totalQuestions}</td>
                                <td className="p-4 font-bold text-slate-700 dark:text-slate-200">{result.correctAnswers}</td>
                                <td className="p-4 font-bold text-[#58CC02]">
                                    {Math.round(result.score)}%
                                </td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">
                                    {result.submittedAt
                                        ? new Date(result.submittedAt).toLocaleString()
                                        : "-"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyQuizResults;
