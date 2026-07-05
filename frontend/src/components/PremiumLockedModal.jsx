import { Lock, Sparkles, X } from "lucide-react";

function PremiumLockedModal({ open, title, description, onClose }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="premium-modal-title"
        >
            <div className="w-full max-w-md rounded-[2rem] border border-yellow-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-yellow-100 text-yellow-500">
                        <Lock className="h-7 w-7" />
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl bg-slate-100 p-3 text-slate-500 transition-all hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-yellow-100 dark:bg-slate-800 dark:text-slate-300"
                        aria-label="Close premium dialog"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <h2
                    id="premium-modal-title"
                    className="text-2xl font-black text-slate-900 dark:text-white"
                >
                    {title || "Premium feature"}
                </h2>
                <p className="mt-3 font-semibold leading-relaxed text-slate-500 dark:text-slate-300">
                    {description ||
                        "Upgrade to Premium to unlock advanced learning tools, longer quizzes, and premium lessons."}
                </p>

                <div className="mt-5 rounded-3xl bg-yellow-50 p-4 dark:bg-yellow-950/40">
                    <div className="flex items-center gap-3 font-black text-yellow-600">
                        <Sparkles className="h-5 w-5" />
                        Premium includes
                    </div>
                    <ul className="mt-3 space-y-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <li>Longer quizzes with 10, 20, 30+ questions</li>
                        <li>Premium topics and advanced review tools</li>
                        <li>Ranking insights and vocabulary export access</li>
                    </ul>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="kid-button kid-button-green mt-6 w-full px-6 py-4"
                >
                    Got it
                </button>
            </div>
        </div>
    );
}

export default PremiumLockedModal;
