import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';
import * as path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  
  try {
    const projectRoot = path.resolve(process.cwd(), '../..');
    const sessionPath = path.join(projectRoot, '.dev-session', key, 'session.yaml');

    const fileContent = await readFile(sessionPath, 'utf-8');
    const sessionData = yaml.load(fileContent);

    return NextResponse.json(sessionData);
  } catch (error) {
    console.error('Error reading session state:', error);

    if (error instanceof Error && 'code' in error) {
      const errorCode = (error as any).code;
      if (errorCode === 'ENOENT') {
        return NextResponse.json(
          { error: 'Session not found', key },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to read session', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
