import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const searchParams = new URL(request.url).searchParams;
  const action = searchParams.get('action');

  // Set up SSE response
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Send SSE headers
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // TODO: Spawn Claude Code subprocess based on action
  // This will be implemented when workflow integration is ready
  // For now, simulate streaming output

  // Send initial connection event
  await writer.write(encoder.encode(`data: ${JSON.stringify({
    type: 'connected',
    key,
    action: action || 'unknown',
    timestamp: Date.now(),
  })}\n\n`));

  // Simulate streaming events (will be replaced with real subprocess output)
  const simulationInterval = setInterval(async () => {
    const event = {
      type: 'progress',
      key,
      action: action || 'unknown',
      timestamp: Date.now(),
      data: {
        phase: 'streaming',
        task: 0,
        tokens: Math.floor(Math.random() * 100),
        duration: Date.now(),
      },
    };
    await writer.write(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
  }, 2000);

  // Handle client disconnect
  request.signal.addEventListener('abort', () => {
    clearInterval(simulationInterval);
    writer.write(encoder.encode(`data: ${JSON.stringify({
      type: 'complete',
      key,
      action: action || 'unknown',
      timestamp: Date.now(),
    })}\n\n`));
    writer.close();
  });

  return new Response(stream.readable, { headers });
}
