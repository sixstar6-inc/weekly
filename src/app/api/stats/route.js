import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        // Base query conditions
        let whereConditions = '1=1';
        const params = [];

        if (startDate) {
            whereConditions += ' AND deployment_date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            whereConditions += ' AND deployment_date <= ?';
            params.push(endDate);
        }

        // Status Distribution
        const statusStats = await db.all(
            `SELECT status, COUNT(*) as count 
             FROM tasks 
             WHERE ${whereConditions} 
             GROUP BY status`,
            params
        );

        // Department Breakdown
        const departmentStats = await db.all(
            `SELECT department, COUNT(*) as count 
             FROM tasks 
             WHERE ${whereConditions} AND department IS NOT NULL AND department != ''
             GROUP BY department 
             ORDER BY count DESC`,
            params
        );

        // System Usage
        const systemStats = await db.all(
            `SELECT system, COUNT(*) as count 
             FROM tasks 
             WHERE ${whereConditions} AND system IS NOT NULL AND system != ''
             GROUP BY system 
             ORDER BY count DESC`,
            params
        );

        // Monthly Timeline (Deployment Date)
        const timelineStats = await db.all(
            `SELECT 
                strftime('%Y-%m', deployment_date) as month,
                COUNT(*) as count
             FROM tasks 
             WHERE ${whereConditions} AND deployment_date IS NOT NULL
             GROUP BY month 
             ORDER BY month DESC 
             LIMIT 12`,
            params
        );

        // Overall Statistics
        const totalTasks = await db.get(
            `SELECT COUNT(*) as count FROM tasks WHERE ${whereConditions}`,
            params
        );

        const confirmedTasks = await db.get(
            `SELECT COUNT(*) as count FROM tasks WHERE ${whereConditions} AND is_confirmed = 1`,
            params
        );

        // Recent Activity (last 7 days)
        const recentTasks = await db.get(
            `SELECT COUNT(*) as count 
             FROM tasks 
             WHERE ${whereConditions} 
             AND created_at >= datetime('now', '-7 days')`,
            params
        );

        // Last 30 days activity
        const monthlyTasks = await db.get(
            `SELECT COUNT(*) as count 
             FROM tasks 
             WHERE ${whereConditions} 
             AND created_at >= datetime('now', '-30 days')`,
            params
        );

        return NextResponse.json({
            statusDistribution: statusStats,
            departmentBreakdown: departmentStats,
            systemUsage: systemStats,
            timeline: timelineStats,
            summary: {
                total: totalTasks.count,
                confirmed: confirmedTasks.count,
                confirmationRate: totalTasks.count > 0
                    ? ((confirmedTasks.count / totalTasks.count) * 100).toFixed(1)
                    : 0,
                recentWeek: recentTasks.count,
                recentMonth: monthlyTasks.count
            }
        });
    } catch (error) {
        console.error('Statistics error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
