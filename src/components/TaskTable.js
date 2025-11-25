import { Edit2, History, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function TaskTable({ tasks, onEdit, onHistory, onDelete }) {
    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">System</th>
                                <th className="px-6 py-4">Dept</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-center">Confirmed</th>
                                <th className="px-6 py-4 w-1/3">Description</th>
                                <th className="px-2 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        No tasks found.
                                    </td>
                                </tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{task.system}</td>
                                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{task.department}</td>
                                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{task.deployment_date}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={clsx(
                                                    'px-2.5 py-1 rounded-full text-xs font-medium border',
                                                    task.is_confirmed
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-slate-50 text-slate-600 border-slate-200'
                                                )}
                                            >
                                                {task.is_confirmed ? 'Confirmed' : 'Not Confirmed'}
                                            </span>
                                        </td>

                                        <td
                                            className="px-6 py-4 text-slate-900 cursor-pointer hover:text-blue-600 font-medium"
                                            onClick={() => onEdit(task)}
                                            title={task.description}
                                        >
                                            {task.description.length > 30
                                                ? `${task.description.substring(0, 30)}...`
                                                : task.description}
                                        </td>
                                        <td className="px-2 py-4">
                                            <span
                                                className={clsx(
                                                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                                                    task.status === 'Done'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                        : task.status === 'In Progress'
                                                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                            : 'bg-slate-50 text-slate-600 border-slate-100'
                                                )}
                                            >
                                                <span className={clsx("w-1.5 h-1.5 rounded-full",
                                                    task.status === 'Done' ? 'bg-blue-500' :
                                                        task.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-400'
                                                )}></span>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEdit(task)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onHistory(task)}
                                                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-all"
                                                    title="History"
                                                >
                                                    <History size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(task)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {tasks.length === 0 ? (
                    <div className="bg-white p-8 text-center text-slate-500 rounded-xl border border-slate-200 shadow-sm">
                        No tasks found.
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-2 items-center">
                                    <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs border border-slate-200">
                                        {task.system}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {task.department}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onEdit(task)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onHistory(task)}
                                        className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                                    >
                                        <History size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(task)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div
                                onClick={() => onEdit(task)}
                                className="cursor-pointer hover:text-blue-600 transition-colors"
                            >
                                <p className="text-slate-900 font-semibold text-lg leading-snug line-clamp-2">{task.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Date</span>
                                    <span className="text-slate-700">{task.deployment_date}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Work Duration</span>
                                    <span className="text-slate-700">{task.work_duration}</span>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-between items-center">
                                <span
                                    className={clsx(
                                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                                        task.status === 'Done'
                                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                                            : task.status === 'In Progress'
                                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                : 'bg-slate-50 text-slate-600 border-slate-100'
                                    )}
                                >
                                    <span className={clsx("w-1.5 h-1.5 rounded-full",
                                        task.status === 'Done' ? 'bg-blue-500' :
                                            task.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-400'
                                    )}></span>
                                    {task.status}
                                </span>
                                <span
                                    className={clsx(
                                        'px-2.5 py-1 rounded-full text-xs font-medium border',
                                        task.is_confirmed
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-slate-50 text-slate-600 border-slate-100'
                                    )}
                                >
                                    {task.is_confirmed ? 'Confirmed' : 'Not Confirmed'}
                                </span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1">Work Duration</div>
                                    <div className="text-sm text-slate-700">{task.work_duration || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1">Status</div>
                                    <span
                                        className={clsx(
                                            'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                                            task.status === 'Done'
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'bg-slate-100 text-slate-600'
                                        )}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
