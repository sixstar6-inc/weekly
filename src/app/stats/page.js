'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, TrendingUp, Users, Layers, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import BarChart from '@/components/BarChart';

export default function StatsPage() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: ''
    });

    const fetchStats = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        try {
            const res = await fetch(`/api/stats?${params}`, { cache: 'no-store' });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [filters]);

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/main')}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Task Statistics</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Date Filter */}
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
                    <button
                        onClick={() => setFilters({ startDate: '', endDate: '' })}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                    </div>
                ) : stats ? (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={Layers}
                                label="Total Tasks"
                                value={stats.summary.total}
                                color="blue"
                            />
                            <StatCard
                                icon={CheckCircle}
                                label="Confirmed Tasks"
                                value={stats.summary.confirmed}
                                subtitle={`${stats.summary.confirmationRate}% confirmation rate`}
                                color="green"
                            />
                            <StatCard
                                icon={Clock}
                                label="Last 7 Days"
                                value={stats.summary.recentWeek}
                                subtitle="Recently created"
                                color="purple"
                            />
                            <StatCard
                                icon={TrendingUp}
                                label="Last 30 Days"
                                value={stats.summary.recentMonth}
                                subtitle="Monthly activity"
                                color="orange"
                            />
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <BarChart
                                data={stats.statusDistribution}
                                title="Status Distribution"
                                colorClass="bg-gradient-to-r from-blue-500 to-blue-600"
                            />
                            <BarChart
                                data={stats.departmentBreakdown}
                                title="Department Breakdown"
                                colorClass="bg-gradient-to-r from-green-500 to-emerald-600"
                            />
                            <BarChart
                                data={stats.systemUsage}
                                title="System Usage"
                                colorClass="bg-gradient-to-r from-purple-500 to-purple-600"
                            />
                            <BarChart
                                data={stats.timeline}
                                title="Monthly Timeline"
                                colorClass="bg-gradient-to-r from-orange-500 to-orange-600"
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        Failed to load statistics
                    </div>
                )}
            </div>
        </main>
    );
}
