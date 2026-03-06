import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;

    // Validate key parameter
    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'key parameter is required' },
        { status: 400 }
      );
    }

    // TODO: Trigger dev-story-analyze workflow
    // This will spawn Claude Code subprocess to execute:
    // /bmad-bmm-dev-story-analyze --story-key=${key}
    // The subprocess output will be streamed via SSE endpoint

    // For now, return a job ID that can be used to track progress
    const jobId = `analyze-${key}-${Date.now()}`;

    return NextResponse.json({
      success: true,
      key,
      action: 'analyze',
      jobId,
      message: 'Analyze workflow triggered',
      // Stream endpoint for real-time updates
      streamUrl: `/api/dev-session/${key}/stream?action=analyze`,
    });
  } catch (error) {
    console.error('Error triggering analyze workflow:', error);
    return NextResponse.json(
      { error: 'Failed to trigger workflow', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
