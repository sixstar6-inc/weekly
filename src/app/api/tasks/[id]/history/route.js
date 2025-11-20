import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const history = db
            .prepare('SELECT * FROM history WHERE task_id = ? ORDER BY changed_at DESC')
            .all(id);

        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
