'use client';

import { useState } from 'react';
import { RefreshCw, LayoutDashboard, Code2 } from 'lucide-react';
import { StorySelector } from '@/components/StorySelector';
import Link from 'next/link';

interface Story {
  key: string;
  title: string;
  status: 'backlog' | 'in-progress' | 'in-review' | 'completed';
}

interface SprintStatus {
  epics: Array<{
    name: string;
    status: 'not-started' | 'in-progress' | 'completed';
    stories: Story[];
  }>;
}

export default function HomePage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Force reload to refresh sprint status
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Story Dev Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  BMAD Zoniq Development
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <a
                href="/story"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                <Code2 className="w-4 h-4" />
                <span>All Stories</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Story Selector - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sprint Status
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select a story to view details and manage development
                </p>
              </div>
              <div className="p-6">
                <StorySelector />
              </div>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/api/sprint-status"
                  target="_blank"
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    View Sprint Status JSON
                  </span>
                  <Code2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </Link>
                <Link
                  href="/story"
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Browse All Stories
                  </span>
                  <LayoutDashboard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Dashboard Info */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl shadow-sm border border-orange-200 dark:border-orange-700">
              <div className="px-6 py-4">
                <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-200 mb-2">
                  About This Dashboard
                </h3>
                <p className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">
                  This dashboard helps manage story development through the atomized workflow.
                  Track progress, view dev sessions, and trigger workflow actions without terminal
                  commands.
                </p>
                <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-700">
                  <p className="text-xs text-orange-700 dark:text-orange-400">
                    <strong>Port:</strong> 3456
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-400">
                    <strong>Status:</strong> Development
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>
              BMAD Zoniq Story Dev Dashboard
            </p>
            <p>
              Running on port 3456
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
