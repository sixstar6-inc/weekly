
const db = require('../src/lib/db').default;

async function checkUser() {
  try {
    const username = 'sixstar6';
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (user) {
      console.log(`User found:`, user);
      if (user.password.startsWith('$2b$')) {
        console.log('Password appears to be hashed.');
      } else {
        console.log('Password does NOT appear to be hashed. This is likely the cause of the login issue.');
      }
    } else {
      console.log(`User '${username}' not found.`);
    }
  } catch (error) {
    console.error('Error checking user:', error);
  }
}

checkUser();
    