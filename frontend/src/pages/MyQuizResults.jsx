import { useEffect, useState } from "react";
import { getMyQuizResults } from "../services/quizService";

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
        return <p className="font-bold text-slate-500">Loading results...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">
                My Quiz Results
            </h1>

            <p className="text-slate-500 mb-6">
                Review your quiz history and learning progress.
            </p>

            {errorMessage && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl font-bold mb-5">
                    {errorMessage}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {results.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="font-bold text-slate-500">
                            No quiz results yet.
                        </p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left p-4 text-sm text-slate-500">Total</th>
                            <th className="text-left p-4 text-sm text-slate-500">Correct</th>
                            <th className="text-left p-4 text-sm text-slate-500">Score</th>
                            <th className="text-left p-4 text-sm text-slate-500">Submitted At</th>
                        </tr>
                        </thead>

                        <tbody>
                        {results.map((result) => (
                            <tr key={result.id} className="border-t border-slate-100">
                                <td className="p-4 font-bold">{result.totalQuestions}</td>
                                <td className="p-4 font-bold">{result.correctAnswers}</td>
                                <td className="p-4 font-black text-[#58CC02]">
                                    {Math.round(result.score)}%
                                </td>
                                <td className="p-4 text-slate-500">
                                    {result.submittedAt
                                        ? new Date(result.submittedAt).toLocaleString()
                                        : "-"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default MyQuizResults;