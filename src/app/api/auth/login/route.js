
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // It's important to use an environment variable for the secret

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Environment variable authentication
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (username === adminUsername && password === adminPassword) {
            const token = jwt.sign({ userId: 1, username: 'admin' }, JWT_SECRET, {
                expiresIn: '1h',
            });

            (await cookies()).set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                path: '/',
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
