'use client';

import { useEffect, useState, useRef } from 'react';
import { Square, Play, SquareX } from 'lucide-react';

interface StreamEvent {
  type: 'connected' | 'progress' | 'text' | 'error' | 'complete' | 'tool' | 'file' | 'complete';
  timestamp?: number;
  action?: string;
  key?: string;
  data?: {
    phase?: string;
    task?: number;
    tokens?: number;
    duration?: number;
  };
  content?: string;
  tool?: string;
  args?: any[];
  file?: string;
}

interface LiveStreamPanelProps {
  storyKey: string;
  action: string;
  isRunning: boolean;
  onStop: () => void;
}

export function LiveStreamPanel({ storyKey, action, isRunning, onStop }: LiveStreamPanelProps) {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [status, setStatus] = useState({ phase: '', task: 0, tokens: 0, duration: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRunning) return;

    const eventSource = new EventSource(`/api/dev-session/${storyKey}/stream?action=${action}`);

    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as StreamEvent;
        setEvents((prev) => [...prev, { ...event, timestamp: Date.now() }]);

        if (event.type === 'progress') {
          setStatus((prev) => ({ ...prev, ...event.data }));
        }

        if (event.type === 'complete') {
          eventSource.close();
          onStop();
        }
      } catch (error) {
        console.error('Error parsing stream event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      setEvents((prev) => [...prev, {
        type: 'error',
        content: 'Connection error - please refresh',
        timestamp: Date.now(),
      }]);
    };

    return () => {
      eventSource.close();
    };
  }, [isRunning, storyKey, action]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  const handleStop = () => {
    onStop();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const formatTokens = (tokens: number) => {
    return tokens.toLocaleString();
  };

  const renderEventIcon = (event: StreamEvent) => {
    switch (event.type) {
      case 'connected':
        return <div className="text-green-500">● Connected</div>;
      case 'complete':
        return <div className="text-green-500">● Complete</div>;
      case 'error':
        return <div className="text-red-500">● Error</div>;
      case 'tool':
        return <div className="text-blue-500">⚙ Tool</div>;
      case 'file':
        return <div className="text-yellow-500">📄 File</div>;
      default:
        return null;
    }
  };

  const renderEvent = (event: StreamEvent, index: number) => {
    const time = new Date(event.timestamp || Date.now()).toLocaleTimeString();

    if (event.type === 'text' || event.type === 'error') {
      return (
        <div key={index} className="mb-2">
          <span className="text-xs text-gray-400 mr-2">{time}</span>
          <div className={`font-mono text-sm ${event.type === 'error' ? 'text-red-500' : 'text-gray-700'}`}>
            {renderEventIcon(event)}
            <span className="ml-2">{event.content}</span>
          </div>
        </div>
      );
    }

    if (event.type === 'progress') {
      return (
        <div key={index} className="mb-2">
          <span className="text-xs text-gray-400 mr-2">{time}</span>
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              {renderEventIcon(event)}
              <span>
                {event.data?.phase || 'Working'}
                {event.data?.task !== undefined && ` - Task ${event.data.task}`}
              </span>
            </div>
            <div className="ml-4 text-xs text-gray-400">
              {formatTokens(event.data?.tokens || 0)} tokens
              {event.data?.duration && ` • ${formatDuration(event.data.duration)}`}
            </div>
          </div>
        </div>
      );
    }

    if (event.type === 'connected' || event.type === 'complete') {
      return (
        <div key={index} className="mb-2">
          <span className="text-xs text-gray-400 mr-2">{time}</span>
          <div className="font-mono text-sm text-gray-700">
            {renderEventIcon(event)}
            <span className="ml-2">{event.type === 'connected' ? 'Stream connected' : 'Workflow complete'}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white p-4">
      <div className="stream-header flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Square className="text-blue-500 w-4 h-4" />
          <span className="font-semibold text-gray-700">
            🔄 Running: {action}
          </span>
        </div>
        <button
          onClick={handleStop}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
        >
          <SquareX className="w-4 h-4" />
          <span>Stop</span>
        </button>
      </div>

      <div className="stream-header flex items-center justify-between mb-4 text-sm">
        <span>Task: {status.task}</span>
        <span>Tokens: {formatTokens(status.tokens)}</span>
        <span>Duration: {formatDuration(status.duration)}</span>
      </div>

      <div
        ref={containerRef}
        className="stream-output bg-gray-50 rounded p-3 h-64 overflow-y-auto font-mono text-sm"
      >
        {events.map((event, index) => renderEvent(event, index))}
      </div>
    </div>
  );
}
