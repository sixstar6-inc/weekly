import { Edit2, History, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function TaskTable({ tasks, onEdit, onHistory, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                            <th className="px-4 py-3">Note</th>
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
                                    <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{task.note}</td>
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
    );
}
