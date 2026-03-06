'use client';

import { useEffect, useState } from 'react';
import { FileText, Play, Square, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface SessionData {
  key: string;
  currentTask: number;
  totalTasks: number;
  status: string;
  progress: number;
  planVersion?: number;
  lastUpdated?: string;
}

interface DevSessionPanelProps {
  storyKey: string;
}

export function DevSessionPanel({ storyKey }: DevSessionPanelProps) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/dev-session/${storyKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setSessionData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session');
        setLoading(false);
      }
    }

    fetchSession();
  }, [storyKey]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog':
        return 'bg-gray-100 text-gray-700';
      case 'analyzed':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'verifying':
        return 'bg-yellow-100 text-yellow-700';
      case 'ready-for-dev':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'backlog':
        return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">Ready to Start</span>;
      case 'analyzed':
        return <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs rounded-full">Analyzed</span>;
      case 'in-progress':
        return <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs rounded-full">In Progress</span>;
      case 'verifying':
        return <span className="px-2 py-1 bg-yellow-200 text-yellow-700 text-xs rounded-full">Verifying</span>;
      case 'ready-for-dev':
        return <span className="px-2 py-1 bg-green-200 text-green-700 text-xs rounded-full">Ready</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-200 text-green-700 text-xs rounded-full">Done</span>;
      default:
        return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">Unknown</span>;
    }
  };

  const getProgressBarWidth = (progress: number, total: number) => {
    return total > 0 ? `${(progress / total) * 100}%` : '0%';
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Not updated';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const formatTasks = (current: number, total: number) => {
    const completed = current;
    const remaining = total - current;
    return `${completed} / ${total} tasks (${remaining} remaining)`;
  };

  if (loading) {
    return (
      <div className="dev-session-panel bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dev-session-panel bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="dev-session-panel bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>Dev Session</span>
        </h2>
        <div className="text-sm text-gray-600">
          {sessionData?.lastUpdated && (
            <span>Last updated: {formatTime(sessionData.lastUpdated)}</span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Status Card */}
        <div className={`bg-blue-50 border border-blue-200 rounded-lg p-6 ${getStatusColor(sessionData?.status || '')}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              {getStatusBadge(sessionData?.status || 'backlog')}
            </div>
            {sessionData?.planVersion && sessionData.planVersion > 1 && (
              <div className="text-xs text-blue-600">
                Plan Version v{sessionData.planVersion}
              </div>
            )}

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {sessionData?.totalTasks && sessionData.totalTasks > 0 && (
                    <>
                      <span className="text-2xl font-bold text-gray-900">
                        {sessionData.currentTask || 0}
                      </span>
                      <span className="text-gray-600"> / </span>
                      <span className="text-lg text-gray-900">
                        {sessionData.totalTasks}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-sm text-gray-500">Tasks</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 bg-blue-500 rounded-t-lg transition-all duration-300"
                  style={{ width: getProgressBarWidth(sessionData?.progress || 0, sessionData?.totalTasks || 1) }}
                >
                </div>
              </div>
              <div className="text-center text-sm text-gray-600 mb-2">
                {formatTasks(sessionData?.currentTask || 0, sessionData?.totalTasks || 1)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => window.location.href = `/story/${storyKey}`}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-300"
            >
              <FileText className="w-5 h-5 text-gray-700" />
              <span>View Story</span>
            </button>
            <button
              onClick={() => alert('Analyze functionality coming soon')}
              className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              disabled
            >
              <Play className="w-5 h-5 text-white" />
              <span>Analyze</span>
            </button>
            <button
              onClick={() => alert('Task functionality coming soon')}
              className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              disabled
            >
              <TrendingUp className="w-5 h-5 text-white" />
              <span>Implement Task</span>
            </button>
            <button
              onClick={() => alert('Verify functionality coming soon')}
              className="flex items-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              disabled
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Verify</span>
            </button>
            <button
              onClick={() => alert('Complete functionality coming soon')}
              className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              disabled
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Complete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
