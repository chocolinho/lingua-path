import { useEffect, useState } from "react";
import { getQuizResults } from "../services/quizService";

function QuizResults() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const data = await getQuizResults();
            setResults(data);
        };

        fetchResults();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-100">
                    <tr>
                        <th className="text-left p-4">ID</th>
                        <th className="text-left p-4">Total Questions</th>
                        <th className="text-left p-4">Correct Answers</th>
                        <th className="text-left p-4">Score</th>
                        <th className="text-left p-4">Submitted At</th>
                    </tr>
                    </thead>

                    <tbody>
                    {results.map((result) => (
                        <tr key={result.id} className="border-t">
                            <td className="p-4">{result.id}</td>
                            <td className="p-4">{result.totalQuestions}</td>
                            <td className="p-4">{result.correctAnswers}</td>
                            <td className="p-4 font-bold">{result.score}</td>
                            <td className="p-4">{result.submittedAt}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuizResults;