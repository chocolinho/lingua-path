function BadgeCard({ icon, title, description, color }) {
    return (
        <div className="flex items-center gap-4 bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${color}`}
            >
                {icon}
            </div>

            <div>
                <h4 className="font-bold text-slate-800">
                    {title}
                </h4>

                <p className="text-sm text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default BadgeCard;