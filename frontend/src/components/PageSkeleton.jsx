function PageSkeleton({ variant = "default" }) {
    const cardCount = variant === "dashboard" ? 8 : 4;

    return (
        <div
            className="app-page space-y-6"
            aria-label="Loading content"
            aria-live="polite"
        >
            <div className="ui-panel animate-pulse p-6">
                <div className="h-5 w-36 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="mt-5 h-9 w-3/4 rounded-2xl bg-slate-100 dark:bg-slate-800 md:w-1/2" />
                <div className="mt-4 h-4 w-full max-w-xl rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="mt-2 h-4 w-2/3 max-w-md rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: cardCount }).map((_, index) => (
                    <div
                        key={index}
                        className="ui-card animate-pulse p-5"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800" />
                        <div className="mt-5 h-4 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
                        <div className="mt-3 h-8 w-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PageSkeleton;
