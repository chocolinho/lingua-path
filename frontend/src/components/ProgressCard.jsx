function ProgressCard({ title, value, target }) {
    const percent = target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0;

    return (
        <div className="ui-card p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {title}
                    </h3>

                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {value} / {target} completed
                    </p>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10">
                    <span className="text-lg font-bold text-[#0F766E]">
                        {percent}%
                    </span>
                </div>
            </div>

            <div
                className="h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                role="progressbar"
                aria-label={`${title} progress`}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className="h-full rounded-full bg-[#0F766E] transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

export default ProgressCard;
