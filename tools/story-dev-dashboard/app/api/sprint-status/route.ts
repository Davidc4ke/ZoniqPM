import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';
import * as path from 'path';

export async function GET() {
  try {
    // Read sprint-status.yaml from project root (dashboard is in tools/story-dev-dashboard)
    const projectRoot = path.resolve(process.cwd(), '..', '..');
    const sprintStatusPath = path.join(projectRoot, '_bmad-output', 'implementation-artifacts', 'sprint-status.yaml');

    const fileContent = await readFile(sprintStatusPath, 'utf-8');
    const sprintData = yaml.load(fileContent);

    return NextResponse.json(sprintData);
  } catch (error) {
    console.error('Error reading sprint-status.yaml:', error);
    return NextResponse.json(
      { error: 'Failed to read sprint status', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
