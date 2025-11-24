import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, props) {
    try {
        const params = await props.params;
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        const history = await db.all('SELECT * FROM history WHERE task_id = ? ORDER BY changed_at DESC', [id]);

        return NextResponse.json(history || []);
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
