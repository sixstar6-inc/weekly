import { Edit2, History, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function TaskTable({ tasks, onEdit, onHistory, onDelete }) {
    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3">System</th>
                                <th className="px-4 py-3">Dept</th>
                                <th className="px-4 py-3">ITSM #</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-center">Confirmed</th>
                                <th className="px-4 py-3 w-1/3">Description</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Remarks</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                        No tasks found.
                                    </td>
                                </tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900">{task.system}</td>
                                        <td className="px-4 py-3 text-gray-600">{task.department}</td>
                                        <td className="px-4 py-3 text-gray-600">{task.itsm_number}</td>
                                        <td className="px-4 py-3 text-gray-600">{task.deployment_date}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={clsx(
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    task.is_confirmed
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                )}
                                            >
                                                {task.is_confirmed ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td
                                            className="px-4 py-3 text-gray-900 cursor-pointer hover:text-blue-600"
                                            onClick={() => onEdit(task)}
                                        >
                                            {task.description}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={clsx(
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    task.status === 'Done'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : task.status === 'In Progress'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                )}
                                            >
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{task.remarks}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(task)}
                                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onHistory(task)}
                                                    className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                                    title="History"
                                                >
                                                    <History size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(task)}
                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
                    <div className="bg-white p-8 text-center text-gray-500 rounded-xl border border-gray-100">
                        No tasks found.
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-2 items-center">
                                    <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">
                                        {task.system}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                        {task.department}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(task)}
                                        className="p-1 text-gray-400 hover:text-blue-600"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onHistory(task)}
                                        className="p-1 text-gray-400 hover:text-purple-600"
                                    >
                                        <History size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(task)}
                                        className="p-1 text-gray-400 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div
                                onClick={() => onEdit(task)}
                                className="cursor-pointer hover:text-blue-600 transition-colors"
                            >
                                <p className="text-gray-900 font-medium line-clamp-2">{task.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-400">ITSM:</span>
                                    <span>{task.itsm_number}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-400">Date:</span>
                                    <span>{task.deployment_date}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                                <span
                                    className={clsx(
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        task.status === 'Done'
                                            ? 'bg-blue-100 text-blue-700'
                                            : task.status === 'In Progress'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-gray-100 text-gray-600'
                                    )}
                                >
                                    {task.status}
                                </span>
                                <span
                                    className={clsx(
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        task.is_confirmed
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                    )}
                                >
                                    {task.is_confirmed ? 'Confirmed' : 'Not Confirmed'}
                                </span>
                            </div>
                            {task.remarks && (
                                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                    {task.remarks}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
