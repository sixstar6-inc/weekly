import db from '@/lib/db';
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

    query += ' ORDER BY deployment_date DESC, created_at DESC';

    try {
        const tasks = await db.all(query, params);
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            system,
            department,
            itsm_number,
            deployment_date,
            is_confirmed,
            description,
            status,
            remarks,
        } = body;

        const query = `
      INSERT INTO tasks (
        system, department, itsm_number, deployment_date, is_confirmed,
        description, status, remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const info = await db.run(query, [
            system,
            department,
            itsm_number,
            deployment_date,
            is_confirmed ? 1 : 0,
            description,
            status,
            remarks
        ]);

        return NextResponse.json({ id: info.lastInsertRowid, ...body });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
