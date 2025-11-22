const db = require('../src/lib/db').default;


async function verify() {
    console.log('Verifying Turso connection...');
    try {
        const type = await db.init();
        console.log(`Database initialized. Type: ${type}`);

        if (type !== 'turso') {
            console.error('Error: Database is not using Turso. Check environment variables.');
            process.exit(1);
        }

        console.log('Creating a test task...');
        const result = await db.run(
            'INSERT INTO tasks (system, department, description, status, remarks) VALUES (?, ?, ?, ?, ?)',
            ['Test System', 'IT', 'Test Task from Script', 'Pending', 'Test Remark']
        );
        console.log(`Task created with ID: ${result.lastInsertRowid}`);

        console.log('Fetching tasks...');
        const tasks = await db.all('SELECT * FROM tasks WHERE id = ?', [result.lastInsertRowid]);
        console.log('Fetched task:', tasks[0]);

        if (tasks.length > 0 && tasks[0].description === 'Test Task from Script' && tasks[0].remarks === 'Test Remark') {
            console.log('SUCCESS: Turso connection and operations verified.');
        } else {
            console.error('FAILURE: Could not verify task creation.');
            process.exit(1);
        }

    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verify();
