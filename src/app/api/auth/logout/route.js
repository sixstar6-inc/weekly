
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        (await cookies()).delete('token');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
