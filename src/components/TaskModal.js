import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TaskModal({ task, onClose, onSave }) {
    const [formData, setFormData] = useState({
        system: '',
        department: '',
        itsm_number: '',
        deployment_date: '',
        is_confirmed: false,
        description: '',
        status: 'Pending',
        remarks: '',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                system: task.system || '',
                department: task.department || '',
                itsm_number: task.itsm_number || '',
                deployment_date: task.deployment_date || '',
                is_confirmed: !!task.is_confirmed,
                description: task.description || '',
                status: task.status || 'Pending',
                remarks: task.remarks || '',
            });
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {task ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">System</label>
                            <input
                                type="text"
                                required
                                value={formData.system}
                                onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input
                                type="text"
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ITSM #</label>
                            <input
                                type="text"
                                value={formData.itsm_number}
                                onChange={(e) => setFormData({ ...formData, itsm_number: e.target.value })}
                                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deployment Date</label>
                            <input
                                type="date"
                                required
                                value={formData.deployment_date}
                                onChange={(e) => setFormData({ ...formData, deployment_date: e.target.value })}
                                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_confirmed}
                                    onChange={(e) => setFormData({ ...formData, is_confirmed: e.target.checked })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Confirmed</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                                <option value="Hold">Hold</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                            <input
                                type="text"
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
