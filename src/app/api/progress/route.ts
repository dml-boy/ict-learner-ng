import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import UserProgress from '@/models/UserProgress';
import Module from '@/models/Module';

// GET student progress
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    const progress = await UserProgress.find({ userId }).populate('moduleId');
    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// UPDATE student progress (Complete a module and unlock next)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { moduleId, status, score, selectedContext, currentStep, reflection } = body;

    const userId = session.user.id;

    if (!moduleId) {
      return NextResponse.json({ success: false, error: 'ModuleId is required' }, { status: 400 });
    }

    // Update current module progress
    interface UpdateData {
      status: string;
      score: number;
      completedAt?: Date;
      selectedContext?: string;
      currentStep?: number;
      reflection?: string;
      personalizedContent?: Record<string, string>;
    }
    const updateData: UpdateData = { 
      status: status || 'in-progress',
      score: score || 0,
    };
    if (status === 'completed') updateData.completedAt = new Date();
    if (selectedContext) updateData.selectedContext = selectedContext;
    if (typeof currentStep === 'number') updateData.currentStep = currentStep;
    if (typeof reflection === 'string') updateData.reflection = reflection;
    if (body.personalizedContent) updateData.personalizedContent = body.personalizedContent;

    const updatedProgress = await UserProgress.findOneAndUpdate(
      { userId, moduleId },
      { $set: updateData },
      { upsert: true, new: true }
    );

    // If completed, unlock the next module if it exists
    if (status === 'completed') {
      const currentModule = await Module.findById(moduleId);
      if (currentModule && currentModule.nextModuleId) {
        await UserProgress.findOneAndUpdate(
          { userId, moduleId: currentModule.nextModuleId },
          { status: 'in-progress' },
          { upsert: true }
        );
      }
    }

    return NextResponse.json({ success: true, data: updatedProgress });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
