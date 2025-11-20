import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const {
            system,
            department,
            itsm_number,
            deployment_date,
            is_confirmed,
            description,
            status,
            note,
        } = body;

        // Get current task state
        const currentTask = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);

        if (!currentTask) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Compare and log changes
        const changes = [];
        const fields = [
            'system',
            'department',
            'itsm_number',
            'deployment_date',
            'is_confirmed',
            'description',
            'status',
            'note',
        ];

        fields.forEach((field) => {
            let newValue = body[field];
            let oldValue = currentTask[field];

            // Handle boolean/integer comparison for is_confirmed
            if (field === 'is_confirmed') {
                newValue = newValue ? 1 : 0;
            }

            if (newValue != oldValue) {
                changes.push(`${field}: ${oldValue} -> ${newValue}`);
            }
        });

        const updateSql = `
      UPDATE tasks SET
        system = ?, department = ?, itsm_number = ?, deployment_date = ?,
        is_confirmed = ?, description = ?, status = ?, note = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

        await db.transaction(async () => {
            await db.run(updateSql, [
                system,
                department,
                itsm_number,
                deployment_date,
                is_confirmed ? 1 : 0,
                description,
                status,
                note,
                id
            ]);

            if (changes.length > 0) {
                const insertHistorySql = `
          INSERT INTO history (task_id, change_description)
          VALUES (?, ?)
        `;
                await db.run(insertHistorySql, [id, changes.join(', ')]);
            }
        });

        return NextResponse.json({ success: true, changes });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await db.transaction(async () => {
            await db.run('DELETE FROM history WHERE task_id = ?', [id]);
            await db.run('DELETE FROM tasks WHERE id = ?', [id]);
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
