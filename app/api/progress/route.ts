import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import UserProgress, { IUserProgress } from '@/models/UserProgress';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Token không tồn tại!' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };

    // Get all progress for this user
    const progressData = await UserProgress.find({ userId: decoded.userId });

    // Convert to a format that's easy to use in frontend
    const progressMap: { [key: number]: IUserProgress } = {};
    progressData.forEach(progress => {
      progressMap[progress.lessonId] = progress;
    });

    return NextResponse.json({
      message: 'Success',
      progress: progressMap,
    });

  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra!' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Token không tồn tại!' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };

    const { lessonId, completed, timeSpent } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { message: 'Lesson ID is required!' },
        { status: 400 }
      );
    }

    // Update or create progress
    const updateData: any = {
      userId: decoded.userId,
      lessonId: parseInt(lessonId),
      completed: completed || false,
    };

    if (completed) {
      updateData.completedAt = new Date();
    }

    if (timeSpent !== undefined) {
      updateData.timeSpent = timeSpent;
    }

    const progress = await UserProgress.findOneAndUpdate(
      { userId: decoded.userId, lessonId: parseInt(lessonId) },
      updateData,
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: 'Cập nhật tiến độ thành công!',
      progress,
    });

  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra!' },
      { status: 500 }
    );
  }
}