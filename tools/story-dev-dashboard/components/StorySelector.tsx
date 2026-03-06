'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, List, Plus, CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react';

interface SprintStatus {
  stories: {
    key: string;
    title: string;
    status: string;
    currentTask?: number;
    totalTasks?: number;
  }[];
}

interface StorySelectorProps {
  onStorySelect?: (key: string) => void;
  selectedKey?: string;
}

export function StorySelector({ onStorySelect, selectedKey }: StorySelectorProps) {
  const router = useRouter();
  const [stories, setStories] = useState<SprintStatus['stories'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleStoryClick = (key: string) => {
    if (onStorySelect) {
      onStorySelect(key);
    } else {
      router.push(`/story/${key}`);
    }
  };

  useEffect(() => {
    // Fetch sprint status
    async function fetchSprintStatus() {
      try {
        const response = await fetch('/api/sprint-status');
        if (!response.ok) {
          throw new Error('Failed to fetch sprint status');
        }
        const data = await response.json();
        const devStatus = data.development_status || {};
        const storiesList = Object.entries(devStatus)
          .filter(([key]) => !key.startsWith('epic-') && !key.endsWith('-retrospective'))
          .map(([key, status]) => ({
            key,
            title: key.replace(/-/g, ' ').replace(/^\d+-\d+-/, ''),
            status: status as string,
          }));
        setStories(storiesList);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stories');
        setLoading(false);
      }
    }

    fetchSprintStatus();
  }, []);

  // Group stories by status
  const backlog = stories.filter(s => s.status === 'backlog');
  const inProgress = stories.filter(s => s.status === 'in-progress');
  const inReview = stories.filter(s => s.status === 'in-review');
  const completed = stories.filter(s => s.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog':
        return 'bg-gray-100 text-gray-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'in-review':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'backlog':
        return <List className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'in-review':
        return <TrendingUp className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  return (
    <div className="story-selector bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Stories
          <span className="text-sm text-gray-400 font-normal">
            ({stories.length} total)
          </span>
        </h2>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 border-t-gray-300" />
          <span className="ml-3 text-gray-600">Loading stories...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <Zap className="w-6 h-6" />
            <span className="font-medium">Error Loading Stories</span>
          </div>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && stories.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gray-100 rounded-full p-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-2">No Stories Found</p>
              <p className="text-sm text-gray-600">
                No stories are in the current sprint. Stories will appear here once added to the sprint status.
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && stories.length > 0 && (
        <>
          {/* Backlog Stories */}
          {backlog.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Backlog</span>
                <span className="text-xs text-gray-400">({backlog.length})</span>
              </div>
              <div className="space-y-2">
                {backlog.map((story) => (
                  <button
                    key={story.key}
                    onClick={() => handleStoryClick(story.key)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      selectedKey === story.key
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(story.status)}
                        <span className={`font-medium ${getStatusColor(story.status)}`}>
                          {story.title}
                        </span>
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(story.status)}`}>
                        {story.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In Progress Stories */}
          {inProgress.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-blue-500 uppercase tracking-wide">In Progress</span>
                <span className="text-xs text-blue-400">({inProgress.length})</span>
              </div>
              <div className="space-y-2">
                {inProgress.map((story) => (
                  <button
                    key={story.key}
                    onClick={() => handleStoryClick(story.key)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      selectedKey === story.key
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(story.status)}
                        <span className={`font-medium ${getStatusColor(story.status)}`}>
                          {story.title}
                        </span>
                      </div>
                      {story.currentTask && story.totalTasks && (
                        <span className={`text-xs font-medium ${getStatusColor(story.status)}`}>
                          {story.currentTask}/{story.totalTasks}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In Review Stories */}
          {inReview.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-yellow-500 uppercase tracking-wide">In Review</span>
                <span className="text-xs text-yellow-400">({inReview.length})</span>
              </div>
              <div className="space-y-2">
                {inReview.map((story) => (
                  <button
                    key={story.key}
                    onClick={() => handleStoryClick(story.key)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      selectedKey === story.key
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(story.status)}
                        <span className={`font-medium ${getStatusColor(story.status)}`}>
                          {story.title}
                        </span>
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(story.status)}`}>
                        {story.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Completed Stories */}
          {completed.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-green-500 uppercase tracking-wide">Completed</span>
                <span className="text-xs text-green-400">({completed.length})</span>
              </div>
              <div className="space-y-2">
                {completed.map((story) => (
                  <button
                    key={story.key}
                    onClick={() => handleStoryClick(story.key)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      selectedKey === story.key
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(story.status)}
                        <span className={`font-medium ${getStatusColor(story.status)}`}>
                          {story.title}
                        </span>
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(story.status)}`}>
                        {story.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
