
const db = require('../src/lib/db').default;
const bcrypt = require('bcrypt');

async function addUser() {
  try {
    const username = 'sixstar6';
    const password = 'sixstar6';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists first
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser) {
        // If user exists, update the password
        await db.run('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);
        console.log(`Password for user '${username}' has been updated successfully.`);
    } else {
        // If user does not exist, insert a new user
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        console.log(`User '${username}' created successfully.`);
    }

  } catch (error) {
    console.error('Error managing user:', error);
  }
}

addUser();
    