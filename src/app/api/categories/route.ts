import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/categories - Get all categories for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const categories = await Category.find({ userId: session.user.id }).sort({ name: 1 });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, color } = await req.json();

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Name and color are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      userId: session.user.id,
      name: { $regex: new RegExp(`^${name}$`, 'i') }, // Case-insensitive match
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
      );
    }

    const category = await Category.create({
      userId: session.user.id,
      name,
      color,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 