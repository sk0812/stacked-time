import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Timer from '@/models/Timer';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/timers - Get all timers for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const timers = await Timer.find({ userId: session.user.id }).sort({ createdAt: -1 });
    
    return NextResponse.json(timers);
  } catch (error) {
    console.error('Error fetching timers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timers' },
      { status: 500 }
    );
  }
}

// POST /api/timers - Create a new timer
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectName, description, categoryId } = await req.json();

    if (!projectName || !description) {
      return NextResponse.json(
        { error: 'Project name and description are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const timer = await Timer.create({
      userId: session.user.id,
      projectName,
      description,
      categoryId,
      status: 'paused',
      time: 0,
      startedAt: new Date(),
    });

    return NextResponse.json(timer);
  } catch (error) {
    console.error('Error creating timer:', error);
    return NextResponse.json(
      { error: 'Failed to create timer' },
      { status: 500 }
    );
  }
} 