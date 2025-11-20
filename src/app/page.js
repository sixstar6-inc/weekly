'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Search } from 'lucide-react';
import TaskTable from '@/components/TaskTable';
import TaskModal from '@/components/TaskModal';
import HistoryModal from '@/components/HistoryModal';
import DeleteModal from '@/components/DeleteModal';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({
        startDate: (() => {
            const d = new Date();
            d.setMonth(d.getMonth() - 1);
            return d.toLocaleDateString('en-CA');
        })(),
        endDate: new Date().toLocaleDateString('en-CA'),
        search: ''
    });
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [historyTask, setHistoryTask] = useState(null);
    const [deleteTask, setDeleteTask] = useState(null);

    const fetchTasks = async () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.search) params.append('search', filters.search);

        const res = await fetch(`/api/tasks?${params}`, { cache: 'no-store' });
        const data = await res.json();
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const handleCreate = () => {
        setSelectedTask(null);
        setIsTaskModalOpen(true);
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleHistory = (task) => {
        setHistoryTask(task);
        setIsHistoryModalOpen(true);
    };

    const handleSave = async (taskData) => {
        const method = selectedTask ? 'PUT' : 'POST';
        const url = selectedTask ? `/api/tasks/${selectedTask.id}` : '/api/tasks';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });

        setIsTaskModalOpen(false);
        fetchTasks();
    };

    const handleDeleteClick = (task) => {
        setDeleteTask(task);
    };

    const handleDeleteConfirm = async (task) => {
        await fetch(`/api/tasks/${task.id}`, {
            method: 'DELETE',
        });
        setDeleteTask(null);
        fetchTasks();
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.search) params.append('search', filters.search);
        window.location.href = `/api/tasks/export?${params}`;
    };

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Weekly Task Manager</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                            New Task
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download size={20} />
                            Export Excel
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-gray-900"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-gray-900"
                        />
                    </div>
                    <div className="space-y-1 flex-1">
                        <label className="text-sm font-medium text-gray-700">Search Description</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                <TaskTable
                    tasks={tasks}
                    onEdit={handleEdit}
                    onHistory={handleHistory}
                    onDelete={handleDeleteClick}
                />

                {isTaskModalOpen && (
                    <TaskModal
                        task={selectedTask}
                        onClose={() => setIsTaskModalOpen(false)}
                        onSave={handleSave}
                    />
                )}

                {isHistoryModalOpen && (
                    <HistoryModal
                        task={historyTask}
                        onClose={() => setIsHistoryModalOpen(false)}
                    />
                )}

                {deleteTask && (
                    <DeleteModal
                        task={deleteTask}
                        onClose={() => setDeleteTask(null)}
                        onDelete={handleDeleteConfirm}
                    />
                )}
            </div>
        </main>
    );
}
