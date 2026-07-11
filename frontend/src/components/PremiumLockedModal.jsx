import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Check, Crown, Lock, X } from "lucide-react";

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
].join(",");

function PremiumLockedModal({ open, title, description, onClose }) {
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) return undefined;

        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) return;

            const focusableElements = Array.from(
                dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
            );

            if (focusableElements.length === 0) {
                event.preventDefault();
                dialogRef.current.focus();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div
            className="ui-modal-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                ref={dialogRef}
                className="ui-modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="premium-modal-title"
                aria-describedby="premium-modal-description"
                tabIndex={-1}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <Lock className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        aria-label="Close premium dialog"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <h2
                    id="premium-modal-title"
                    className="text-2xl font-bold text-slate-950 dark:text-white"
                >
                    {title || "Premium feature"}
                </h2>
                <p
                    id="premium-modal-description"
                    className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300"
                >
                    {description ||
                        "Upgrade to Premium to unlock longer practice sessions and premium learning content."}
                </p>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
                    <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
                        <Crown className="h-5 w-5" aria-hidden="true" />
                        Premium includes
                    </div>
                    <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {[
                            "Longer quiz sessions",
                            "Premium topics and review tools",
                            "Expanded custom topic and vocabulary limits",
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <Check
                                    className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300"
                                    aria-hidden="true"
                                />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="ui-button ui-button-outline"
                    >
                        Maybe later
                    </button>
                    <Link
                        to="/premium"
                        onClick={onClose}
                        className="ui-button ui-button-primary"
                    >
                        <Crown className="h-5 w-5" aria-hidden="true" />
                        View Premium
                    </Link>
                </div>
            </section>
        </div>,
        document.body
    );
}

export default PremiumLockedModal;
