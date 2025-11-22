const db = require('../src/lib/db').default;
const bcrypt = require('bcrypt');

async function resetPassword() {
    try {
        const username = 'sixstar6';
        const password = 'sixstar6';
        const saltRounds = 10;

        console.log(`Resetting password for user: ${username}`);

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update the password
        await db.run('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);

        console.log('Password updated successfully.');

        // Verify
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            console.log('Verification SUCCESS: Password matches.');
        } else {
            console.error('Verification FAILED: Password does not match.');
        }

    } catch (error) {
        console.error('Error resetting password:', error);
    }
}

resetPassword();
