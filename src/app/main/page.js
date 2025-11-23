'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Search, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };
        fetchUser();
    }, []);

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
        setIsSaving(true);
        const method = selectedTask ? 'PUT' : 'POST';
        const url = selectedTask ? `/api/tasks/${selectedTask.id}` : '/api/tasks';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Failed to save task:', errorData);
                // Optionally, show an error message to the user
                return;
            }

            setIsTaskModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            // Optionally, show an error message to the user
        } finally {
            setIsSaving(false);
        }
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

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Weekly Task Manager</h1>
                    <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                        {user && (
                            <span className="text-gray-700 font-medium mr-2">
                                {user.username}
                            </span>
                        )}
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Plus size={20} />
                            New
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Download size={20} />
                            Excel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
                    <div className="space-y-1 w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-gray-900"
                        />
                    </div>
                    <div className="space-y-1 w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-gray-900"
                        />
                    </div>
                    <div className="space-y-1 w-full md:flex-1">
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
                        isLoading={isSaving}
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
