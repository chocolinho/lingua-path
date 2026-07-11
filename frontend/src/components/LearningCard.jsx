function LearningCard({ icon, title, description, progress, color }) {
    return (
        <div className="ui-card cursor-pointer p-5">
            <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-3xl text-4xl ${color}`}
            >
                {icon}
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {title}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {description}
            </p>

            <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>

                <div
                    className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                    role="progressbar"
                    aria-label={`${title} progress`}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="h-full rounded-full bg-[#0F766E]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default LearningCard;
