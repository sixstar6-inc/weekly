import db from '@/lib/db';
import ExcelJS from 'exceljs';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (startDate) {
        query += ' AND deployment_date >= ?';
        params.push(startDate);
    }

    if (endDate) {
        query += ' AND deployment_date <= ?';
        params.push(endDate);
    }

    if (search) {
        query += ' AND description LIKE ?';
        params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    try {
        const tasks = await db.all(query, params);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Weekly Tasks');

        worksheet.columns = [
            { header: 'System', key: 'system', width: 15 },
            { header: 'Department', key: 'department', width: 15 },
            { header: 'ITSM #', key: 'itsm_number', width: 15 },
            { header: 'Deployment Date', key: 'deployment_date', width: 15 },
            { header: 'Confirmed', key: 'is_confirmed', width: 10 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Note', key: 'note', width: 20 },
        ];

        tasks.forEach((task) => {
            worksheet.addRow({
                ...task,
                is_confirmed: task.is_confirmed ? 'Yes' : 'No',
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="weekly_tasks.xlsx"',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
