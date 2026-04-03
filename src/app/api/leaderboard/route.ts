import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserProgress from '@/models/UserProgress';
import '@/models/User';

// GET leaderboard - students ranked by most progress
export async function GET() {
  try {
    await dbConnect();

    const leaderboard = await UserProgress.aggregate([
      {
        $group: {
          _id: '$userId',
          totalCompleted: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalScore: { $sum: '$score' },
          totalModules: { $sum: 1 },
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          avatar: '$user.avatar',
          totalCompleted: 1,
          totalScore: 1,
          totalModules: 1,
          completionRate: {
            $cond: [
              { $gt: ['$totalModules', 0] },
              { $multiply: [{ $divide: ['$totalCompleted', '$totalModules'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { totalCompleted: -1, totalScore: -1 } },
      { $limit: 10 }
    ]);

    return NextResponse.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error('[API] Leaderboard Fetch Failure:', error);
    return NextResponse.json({ success: false, error: 'Leaderboard unavailable.' }, { status: 500 });
  }
}
