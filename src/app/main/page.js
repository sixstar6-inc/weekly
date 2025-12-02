'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Search, LogOut, BarChart2 } from 'lucide-react';
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
        endDate: (() => {
            const d = new Date();
            d.setMonth(d.getMonth() + 6);
            return d.toLocaleDateString('en-CA');
        })(),
        search: '',
        status: ''
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
        if (filters.status) params.append('status', filters.status);

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
        if (filters.status) params.append('status', filters.status);
        window.location.href = `/api/tasks/export?${params}`;
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Weekly Task Manager</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium text-slate-700">
                                    {user.username}
                                </span>
                            </div>
                        )}
                        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all shadow-sm hover:shadow text-sm font-medium"
                            >
                                <Plus size={18} />
                                New
                            </button>
                            <button
                                onClick={() => router.push('/stats')}
                                className="hidden md:flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all shadow-sm hover:shadow text-sm font-medium"
                            >
                                <BarChart2 size={18} />
                                Stats
                            </button>
                            <button
                                onClick={handleExport}
                                className="hidden md:flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all shadow-sm hover:shadow text-sm font-medium"
                            >
                                <Download size={18} />
                                Excel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Filters */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-5 items-end">
                    <div className="space-y-1.5 w-full md:w-auto">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 px-3 py-2 border text-slate-900 text-sm"
                        />
                    </div>
                    <div className="space-y-1.5 w-full md:w-auto">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 px-3 py-2 border text-slate-900 text-sm"
                        />
                    </div>
                    <div className="space-y-1.5 w-full md:w-auto">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 px-3 py-2 border text-slate-900 text-sm"
                        >
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                            <option value="Hold">Hold</option>
                        </select>
                    </div>
                    <div className="space-y-1.5 w-full md:flex-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by description..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="block w-full pl-10 rounded-lg border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 px-3 py-2 border text-slate-900 text-sm"
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
