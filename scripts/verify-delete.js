const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'weekly_tasks.db');
const db = new Database(dbPath);

console.log('--- Starting Delete Verification ---');

// 1. Create a task to delete
console.log('1. Creating Task to delete...');
const insert = db.prepare(`
  INSERT INTO tasks (
    system, department, itsm_number, deployment_date, is_confirmed,
    description, status, note
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
const info = insert.run(
    'Delete Me', 'Test Dept', 'DEL-001', '2023-11-20', 0,
    'To be deleted', 'Pending', 'Note'
);
const taskId = info.lastInsertRowid;
console.log(`   Task created with ID: ${taskId}`);

// 2. Verify it exists
let task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
if (task) {
    console.log('   Task exists in DB.');
} else {
    console.error('   Task failed to create!');
    process.exit(1);
}

// 3. Delete the task (Simulating API logic)
console.log('2. Deleting Task...');
db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);

// 4. Verify it is gone
task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
if (!task) {
    console.log('   Task successfully deleted.');
} else {
    console.error('   Task still exists!');
}

console.log('--- Delete Verification Complete ---');
