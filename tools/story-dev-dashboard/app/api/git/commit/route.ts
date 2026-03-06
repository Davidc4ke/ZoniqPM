import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storyKey, message } = body;

    // Validate request body
    if (typeof storyKey !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'storyKey must be a string' },
        { status: 400 }
      );
    }

    const projectRoot = process.cwd();

    // Stage all changes
    try {
      await execAsync('git add .', { cwd: projectRoot });
      console.log('Staged all changes');
    } catch (stageError) {
      console.error('Git stage error:', stageError);
      return NextResponse.json(
        { error: 'Failed to stage changes', message: stageError instanceof Error ? stageError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Generate commit message from story key + provided message or default
    const commitMessage = message || `Update ${storyKey}`;

    // Execute git commit command
    try {
      const { stdout } = await execAsync(`git commit -m "${commitMessage}"`, { cwd: projectRoot });
      console.log('Committed successfully:', commitMessage);

      return NextResponse.json({
        success: true,
        commitMessage,
        output: stdout.trim(),
      });
    } catch (commitError) {
      console.error('Git commit error:', commitError);

      // Handle case where there's nothing to commit
      const stderr = commitError instanceof Error && 'stderr' in commitError
        ? (commitError as any).stderr
        : commitError instanceof Error ? commitError.message : 'Unknown error';

      if (stderr && stderr.includes('nothing to commit')) {
        return NextResponse.json(
          { error: 'No changes to commit', message: 'No changes were staged for commit' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Git commit failed', message: stderr },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error committing changes:', error);
    return NextResponse.json(
      { error: 'Failed to commit', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
