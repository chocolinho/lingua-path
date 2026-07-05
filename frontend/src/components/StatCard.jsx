function StatCard({ icon, title, value, subtitle, color }) {
    return (
        <div className="kid-card p-5">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${color}`}
                >
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <h3 className="mt-1 truncate text-3xl font-black text-slate-900 dark:text-white">
                        {value}
                    </h3>

                    <p className="mt-1 text-xs font-semibold text-slate-400">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default StatCard;
