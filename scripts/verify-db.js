const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'weekly_tasks.db');
const db = new Database(dbPath);

console.log('--- Starting Verification ---');

// 1. Create Task
console.log('1. Creating Task...');
const insert = db.prepare(`
  INSERT INTO tasks (
    system, department, itsm_number, deployment_date, is_confirmed,
    description, status, note
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
const info = insert.run(
    'Test System', 'IT Dept', 'ITSM-001', '2023-11-20', 0,
    'Initial Description', 'Pending', 'Test Note'
);
const taskId = info.lastInsertRowid;
console.log(`   Task created with ID: ${taskId}`);

// 2. Update Task
console.log('2. Updating Task...');
const update = db.prepare(`
  UPDATE tasks SET description = ?, is_confirmed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
`);
update.run('Updated Description', 1, taskId);

// Log History (Simulating API logic)
const insertHistory = db.prepare(`
  INSERT INTO history (task_id, change_description) VALUES (?, ?)
`);
insertHistory.run(taskId, 'description: Initial Description -> Updated Description, is_confirmed: 0 -> 1');
console.log('   Task updated and history logged.');

// 3. Verify History
console.log('3. Verifying History...');
const history = db.prepare('SELECT * FROM history WHERE task_id = ?').all(taskId);
if (history.length > 0) {
    console.log('   History found:', history[0].change_description);
} else {
    console.error('   No history found!');
}

// 4. Verify Data
const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
console.log('4. Verifying Task Data...');
console.log(`   Description: ${task.description}`);
console.log(`   Confirmed: ${task.is_confirmed}`);

console.log('--- Verification Complete ---');
