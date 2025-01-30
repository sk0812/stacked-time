import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Timer from '@/models/Timer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PATCH /api/timers/[id] - Update timer status and time
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    await connectToDatabase();

    // Find timer and verify ownership
    const timer = await Timer.findOne({ _id: id, userId: session.user.id });
    if (!timer) {
      return NextResponse.json({ error: 'Timer not found' }, { status: 404 });
    }

    // Handle both status updates and general edits
    const updateData = {
      ...(body.status && {
        status: body.status,
        time: body.time,
        ...(body.status === 'running' ? { startedAt: new Date() } : {}),
      }),
      ...(body.projectName && { projectName: body.projectName }),
      ...(body.description && { description: body.description }),
      ...(typeof body.categoryId !== 'undefined' && { categoryId: body.categoryId }),
    };

    // Update timer
    const updatedTimer = await Timer.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedTimer);
  } catch (error) {
    console.error('Error updating timer:', error);
    return NextResponse.json(
      { error: 'Failed to update timer' },
      { status: 500 }
    );
  }
}

// DELETE /api/timers/[id] - Delete a timer
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    // Find timer and verify ownership
    const timer = await Timer.findOne({ _id: id, userId: session.user.id });
    if (!timer) {
      return NextResponse.json({ error: 'Timer not found' }, { status: 404 });
    }

    // Delete timer
    await Timer.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting timer:', error);
    return NextResponse.json(
      { error: 'Failed to delete timer' },
      { status: 500 }
    );
  }
}
