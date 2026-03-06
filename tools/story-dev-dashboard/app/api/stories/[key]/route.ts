import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

function parseStoryMarkdown(content: string, key: string) {
  const lines = content.split('\n');
  
  const titleMatch = content.match(/^# Story [\d.]+:\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1] : key;
  
  const statusMatch = content.match(/^Status:\s*(.+)$/m);
  const status = statusMatch ? statusMatch[1].trim() : 'backlog';
  
  const storyMatch = content.match(/## Story\s*\n\n([\s\S]*?)(?=\n##|$)/);
  const description = storyMatch ? storyMatch[1].trim() : '';
  
  const acMatch = content.match(/## Acceptance Criteria\s*\n\n([\s\S]*?)(?=\n##|$)/);
  const acceptanceCriteria: string[] = [];
  if (acMatch) {
    const acText = acMatch[1];
    const acItems = acText.match(/^\d+\.\s*\*\*Given\*\*[\s\S]*?(?=^\d+\.|$)/gm);
    if (acItems) {
      acItems.forEach(item => {
        const cleaned = item.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();
        acceptanceCriteria.push(cleaned);
      });
    }
  }
  
  const tasksMatch = content.match(/## Tasks \/ Subtasks\s*\n([\s\S]*?)(?=\n##|$)/);
  const tasks: Array<{ id: number; title: string; status: string; dependencies?: number[] }> = [];
  if (tasksMatch) {
    const taskLines = tasksMatch[1].split('\n');
    let currentTaskId = 0;
    taskLines.forEach(line => {
      const taskMatch = line.match(/^- \[ \] Task (\d+):\s*(.+)$/);
      if (taskMatch) {
        currentTaskId = parseInt(taskMatch[1]);
        tasks.push({
          id: currentTaskId,
          title: taskMatch[2].trim(),
          status: 'pending',
        });
      }
    });
  }
  
  const devNotesMatch = content.match(/## Dev Notes\s*\n([\s\S]*?)(?=\n##|$)/);
  const devNotes = devNotesMatch ? devNotesMatch[1].trim() : '';
  
  return {
    key,
    title,
    status,
    description,
    acceptanceCriteria,
    tasks,
    devNotes,
    content,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  
  try {
    const projectRoot = path.resolve(process.cwd(), '../..');
    const storyPath = path.join(projectRoot, '_bmad-output', 'implementation-artifacts', `${key}.md`);

    const fileContent = await readFile(storyPath, 'utf-8');
    const storyData = parseStoryMarkdown(fileContent, key);

    return NextResponse.json(storyData);
  } catch (error) {
    console.error('Error reading story file:', error);

    if (error instanceof Error && 'code' in error) {
      const errorCode = (error as any).code;
      if (errorCode === 'ENOENT') {
        return NextResponse.json(
          { error: 'Story not found', key },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to read story', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  
  try {
    const body = await request.json();
    const { content } = body;

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'content must be a string' },
        { status: 400 }
      );
    }

    const projectRoot = path.resolve(process.cwd(), '../..');
    const storyPath = path.join(projectRoot, '_bmad-output', 'implementation-artifacts', `${key}.md`);

    await writeFile(storyPath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      key,
      message: 'Story updated successfully',
      path: storyPath,
    });
  } catch (error) {
    console.error('Error updating story file:', error);

    return NextResponse.json(
      { error: 'Failed to update story', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
