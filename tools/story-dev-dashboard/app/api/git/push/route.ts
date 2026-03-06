import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storyKey } = body;

    // Validate request body
    if (typeof storyKey !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'storyKey must be a string' },
        { status: 400 }
      );
    }

    const projectRoot = process.cwd();

    // Check if there are uncommitted changes
    try {
      const { stdout: statusOutput } = await execAsync('git status --porcelain', { cwd: projectRoot });
      const hasUncommittedChanges = statusOutput.trim().length > 0;

      if (hasUncommittedChanges) {
        // Stage and commit before pushing
        const commitMessage = `Update ${storyKey}`;
        try {
          await execAsync('git add .', { cwd: projectRoot });
          await execAsync(`git commit -m "${commitMessage}"`, { cwd: projectRoot });
          console.log('Auto-committed uncommitted changes before push');
        } catch (commitError) {
          console.error('Auto-commit error:', commitError);
          // If auto-commit fails, continue with push attempt
        }
      }
    } catch (statusError) {
      console.error('Git status check error:', statusError);
      // Continue with push attempt
    }

    // Execute git push command
    try {
      const { stdout } = await execAsync('git push', { cwd: projectRoot });
      console.log('Pushed successfully:', storyKey);

      return NextResponse.json({
        success: true,
        storyKey,
        output: stdout.trim(),
      });
    } catch (pushError) {
      console.error('Git push error:', pushError);

      const stderr = pushError instanceof Error && 'stderr' in pushError
        ? (pushError as any).stderr
        : pushError instanceof Error ? pushError.message : 'Unknown error';

      // Check for common push errors
      if (stderr && stderr.includes('no remote')) {
        return NextResponse.json(
          { error: 'No remote configured', message: 'Git remote is not configured for this repository' },
          { status: 500 }
        );
      }

      if (stderr && stderr.includes('non-fast-forward')) {
        return NextResponse.json(
          { error: 'Push rejected', message: 'Remote has changes that are not present locally. Please pull first.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Git push failed', message: stderr || 'Unknown push error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error pushing changes:', error);
    return NextResponse.json(
      { error: 'Failed to push', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
