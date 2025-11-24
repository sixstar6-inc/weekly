import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function HistoryModal({ task, onClose }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (task) {
            fetch(`/api/tasks/${task.id}/history`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch history');
                    }
                    return res.json();
                })
                .then((data) => {
                    setHistory(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error loading history:', err);
                    setLoading(false);
                    setHistory([]); // Clear history on error
                });
        }
    }, [task]);

    const parseChanges = (changeDescription) => {
        if (!changeDescription) return [];

        // Split by comma, but be careful if values contain commas (simple split for now based on current format)
        // The format is "field: old -> new, field2: old2 -> new2"
        // A more robust regex might be needed if values contain " -> " or ", "

        const changes = [];
        const parts = changeDescription.split(', ');

        parts.forEach(part => {
            const [fieldPart, valuesPart] = part.split(': ');
            if (fieldPart && valuesPart) {
                const [oldVal, newVal] = valuesPart.split(' -> ');
                changes.push({
                    field: fieldPart.charAt(0).toUpperCase() + fieldPart.slice(1).replace('_', ' '),
                    oldVal: oldVal || '(empty)',
                    newVal: newVal || '(empty)'
                });
            }
        });

        return changes;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Modification History</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">No history found.</div>
                    ) : (
                        <div className="space-y-8">
                            {history.map((item) => (
                                <div key={item.id} className="relative pl-8 border-l-2 border-slate-200 last:border-l-0 pb-8 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                                    <div className="mb-4">
                                        <span className="text-sm font-semibold text-slate-500">
                                            {new Date(item.changed_at).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {parseChanges(item.change_description).map((change, idx) => (
                                            <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                    {change.field}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-red-500 font-medium">Before</div>
                                                        <div className="bg-white p-2 rounded border border-red-100 text-slate-600 text-sm break-words">
                                                            {change.oldVal}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-green-600 font-medium">After</div>
                                                        <div className="bg-white p-2 rounded border border-green-100 text-slate-900 text-sm font-medium break-words">
                                                            {change.newVal}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
