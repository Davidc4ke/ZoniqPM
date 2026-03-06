'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Edit2, Save } from 'lucide-react';
import { StoryDetail } from '@/components/StoryDetail';
import { EditStoryMode } from '@/components/EditStoryMode';
import Link from 'next/link';

interface StoryData {
  key: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  tasks: Array<{
    id: number;
    title: string;
    status: string;
    dependencies?: string[];
  }>;
  devNotes: string;
  userTasks?: {
    configuration?: Array<{ id: number; text: string; done: boolean }>;
    manualTesting?: Array<{ id: number; text: string; done: boolean }>;
    externalDependencies?: string[];
  };
}

export default function StoryDetailPage() {
  const params = useParams();
  const storyKey = params.key as string;
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch story data
  const fetchStoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stories/${storyKey}`);
      if (!response.ok) {
        throw new Error(`Failed to load story: ${response.statusText}`);
      }
      const data = await response.json();
      setStoryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading story');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoryData();
  }, [storyKey]);

  // Handle save from EditStoryMode
  const handleSave = async (updatedData: Partial<StoryData>) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/stories/${storyKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save story: ${response.statusText}`);
      }

      // Refresh data
      await fetchStoryData();
      setEditMode(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Story
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchStoryData}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg transition-colors"
            >
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!storyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Story Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Story key "{storyKey}" does not exist
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Back button & Title */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {storyData.key}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                  {storyData.title}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Story</span>
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <span>Cancel Edit</span>
                </button>
              )}
              <button
                onClick={fetchStoryData}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {editMode ? (
          <EditStoryMode
            storyData={storyData}
            onSave={handleSave}
            onCancel={() => setEditMode(false)}
          />
        ) : (
          <StoryDetail storyKey={storyKey} />
        )}
      </main>
    </div>
  );
}
