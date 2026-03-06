'use client';

import { FileText, CheckSquare, AlertTriangle, Terminal, FileCode } from 'lucide-react';

interface StreamLineProps {
  event: {
    type: 'connected' | 'progress' | 'text' | 'error' | 'complete' | 'tool' | 'file' | 'complete';
    timestamp?: number;
    action?: string;
    key?: string;
    content?: string;
    data?: {
      phase?: string;
      task?: number;
      tokens?: number;
      duration?: number;
    };
    tool?: string;
    file?: string;
  };
}

export function StreamLine({ event }: StreamLineProps) {
  const time = new Date(event.timestamp || Date.now()).toLocaleTimeString();

  if (event.type === 'text' || event.type === 'error') {
    return (
      <div className="flex items-start gap-2 text-sm text-gray-700 mb-2">
        <span className="text-xs text-gray-400 font-mono">{time}</span>
        <div className={`flex items-start gap-2 flex-1 ${event.type === 'error' ? 'text-red-500' : 'text-gray-700'}`}>
          {event.type === 'text' && <Terminal className="w-4 h-4 text-blue-500" />}
          {event.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
          <span className="break-all">{event.content}</span>
        </div>
      </div>
    );
  }

  if (event.type === 'tool') {
    return (
      <div className="flex items-start gap-2 text-sm text-gray-700 mb-2">
        <span className="text-xs text-gray-400 font-mono">{time}</span>
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
          <CheckSquare className="w-3 h-3 text-blue-500" />
          <span className="font-semibold">⚙ {event.tool}</span>
          {event.args && (
            <span className="ml-2 text-xs font-mono text-gray-600">
              [{event.args.join(', ')}]
            </span>
          )}
        </div>
      </div>
    );
  }

  if (event.type === 'file') {
    return (
      <div className="flex items-start gap-2 text-sm text-gray-700 mb-2">
        <span className="text-xs text-gray-400 font-mono">{time}</span>
        <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
          <FileText className="w-3 h-3 text-yellow-500" />
          <span className="font-semibold">{event.file}</span>
          {event.content && (
            <span className="ml-2 text-xs font-mono text-gray-600">
              {event.content}
            </span>
          )}
        </div>
      </div>
    );
  }

  return null;
}
