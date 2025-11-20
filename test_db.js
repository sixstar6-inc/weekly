import db from './src/lib/db.js';

async function test() {
    console.log('Testing DB Adapter...');
    try {
        // 1. Create
        console.log('Creating task...');
        const insert = await db.run(`
            INSERT INTO tasks (system, description) VALUES (?, ?)
        `, ['TestSys', 'TestDesc']);
        const id = insert.lastInsertRowid;
        console.log('Created task with ID:', id);

        // 2. Read
        console.log('Reading task...');
        const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        console.log('Read task:', task);

        // 3. Delete
        console.log('Deleting task...');
        const del = await db.run('DELETE FROM tasks WHERE id = ?', [id]);
        console.log('Delete result:', del);

        // 4. Verify Delete
        const check = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        console.log('Check after delete:', check);

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
