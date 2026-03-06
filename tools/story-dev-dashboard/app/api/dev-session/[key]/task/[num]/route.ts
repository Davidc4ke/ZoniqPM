import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ key: string; num: string }> }
) {
  try {
    const { key, num } = await params;

    // Validate parameters
    if (!key || !num) {
      return NextResponse.json(
        { error: 'Invalid request', message: 'key and num parameters are required' },
        { status: 400 }
      );
    }

    const taskNum = parseInt(num, 10);
    if (isNaN(taskNum) || taskNum < 1) {
      return NextResponse.json(
        { error: 'Invalid request', message: 'num must be a positive integer' },
        { status: 400 }
      );
    }

    // TODO: Trigger dev-story-task workflow
    // This will spawn Claude Code subprocess to execute:
    // /bmad-bmm-dev-story-task --story-key=${key} --task=${taskNum}
    // The subprocess output will be streamed via SSE endpoint

    // For now, return a job ID that can be used to track progress
    const jobId = `task-${key}-${taskNum}-${Date.now()}`;

    return NextResponse.json({
      success: true,
      key,
      taskNumber: taskNum,
      action: 'task',
      jobId,
      message: `Task ${taskNum} workflow triggered`,
      // Stream endpoint for real-time updates
      streamUrl: `/api/dev-session/${key}/stream?action=task-${taskNum}`,
    });
  } catch (error) {
    console.error('Error triggering task workflow:', error);
    return NextResponse.json(
      { error: 'Failed to trigger workflow', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
