const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'weekly_tasks.db');
const db = new Database(dbPath);

try {
    console.log('Attempting to add work_duration column...');
    db.prepare('ALTER TABLE tasks ADD COLUMN work_duration TEXT').run();
    console.log('Successfully added work_duration column.');
} catch (error) {
    if (error.message.includes('duplicate column name')) {
        console.log('Column work_duration already exists.');
    } else {
        console.error('Error adding column:', error);
    }
}
