export default function BarChart({ data, title, colorClass = 'bg-slate-600' }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
                <p className="text-sm text-slate-400 text-center py-8">No data available</p>
            </div>
        );
    }

    const maxCount = Math.max(...data.map(item => item.count));

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
            <div className="space-y-4">
                {data.map((item, index) => {
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    const label = item.status || item.department || item.system || item.month || 'Unknown';

                    return (
                        <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-slate-700 truncate flex-1 mr-4">
                                    {label}
                                </span>
                                <span className="font-semibold text-slate-900 min-w-[40px] text-right">
                                    {item.count}
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
