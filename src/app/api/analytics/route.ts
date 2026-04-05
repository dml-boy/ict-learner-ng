import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import UserProgress from '@/models/UserProgress';
import Module from '@/models/Module';
import '@/models/User';

export async function GET() {
  try {
    const session = await auth();
    const teacherId = session?.user?.id;

    if (!teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Authenticated session required.' }, { status: 401 });
    }

    await dbConnect();

    // 1. Fetch modules created by this teacher
    const teacherModules = await Module.find({ createdBy: teacherId }, '_id').lean();
    const moduleIds = teacherModules.map(m => m._id);

    // 2. Fetch recent activity (e.g., last 10 completed or in-progress updates) for these modules
    const recentActivity = await UserProgress.find({ 
        moduleId: { $in: moduleIds }
      })
      .populate('userId', 'name')
      .populate('moduleId', 'title')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    const formattedActivity = recentActivity.map(activity => {
      const isCompleted = activity.status === 'completed';
      const eventName = isCompleted ? 'Module Completed' : 'Progress Updated';
      
      return {
        _id: activity._id,
        event: eventName,
        user: (activity.userId as { name?: string })?.name || 'Anonymous Learner',
        moduleTitle: (activity.moduleId as { title?: string })?.title || 'Unknown Module',
        time: activity.updatedAt 
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        recentActivity: formattedActivity,
        totalModules: moduleIds.length
      } 
    });

  } catch (error) {
    console.error('[API] Analytics Fetch Failure:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics.' }, { status: 500 });
  }
}
