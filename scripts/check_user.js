const db = require('../src/lib/db').default;

async function checkUser() {
    try {
        console.log('Checking for user: sixstar6');
        const user = await db.get('SELECT * FROM users WHERE username = ?', ['sixstar6']);

        if (user) {
            console.log('User found:', {
                id: user.id,
                username: user.username,
                passwordHash: user.password ? 'Present (Hidden)' : 'Missing'
            });
        } else {
            console.log('User NOT found.');
        }
    } catch (error) {
        console.error('Error checking user:', error);
    }
}

checkUser();
