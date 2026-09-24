import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = (searchParams.get('username') || '').trim().toLowerCase();

    if (!username) {
      return NextResponse.json(
        { success: false, available: false, message: 'Username parameter is required.' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        {
          success: false,
          available: false,
          message: 'Username must be between 3 and 20 characters.',
        },
        { status: 400 }
      );
    }

    const validPattern = /^[a-z0-9_.-]+$/;
    if (!validPattern.test(username)) {
      return NextResponse.json(
        {
          success: false,
          available: false,
          message: 'Username can only contain lowercase letters, numbers, underscores, dots, or hyphens.',
        },
        { status: 400 }
      );
    }

    // Reserved system handles
    const reservedUsernames = ['admin', 'root', 'support', 'selbar', 'official', 'api', 'help', 'system'];
    if (reservedUsernames.includes(username)) {
      return NextResponse.json(
        {
          success: true,
          available: false,
          message: 'This username is reserved and cannot be registered.',
        },
        { status: 200 }
      );
    }

    await connectToDatabase();

    const query: Record<string, any> = {
      $or: [{ 'username.normalized': username }, { username }],
    };
    const existingUser = await User.findOne(query).select('_id').lean();

    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          available: false,
          message: 'Username is already taken.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        available: true,
        message: 'Username is available!',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, available: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
