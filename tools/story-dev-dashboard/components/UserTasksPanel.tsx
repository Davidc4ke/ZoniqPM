'use client';

import { useEffect, useState } from 'react';
import { FileText, Settings, CheckCircle2, Plus, User, Clock, Info } from 'lucide-react';

interface StoryData {
  key: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  tasks: {
    id: number;
    title: string;
    status: string;
    dependencies?: string[];
  }[];
  devNotes: string;
  userTasks?: {
    configuration: string[];
    manualTesting: string[];
    externalDependencies: string[];
  };
}

interface UserTasksPanelProps {
  storyKey: string;
}

export function UserTasksPanel({ storyKey }: UserTasksPanelProps) {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTab, setEditingTab] = useState<'configuration' | 'manual-testing' | 'external-deps'>(null);
  const [editContent, setEditContent] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch story data
    async function fetchStory() {
      try {
        const response = await fetch(`/api/stories/${storyKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
        const data = await response.json();
        setStoryData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load story');
        setLoading(false);
      }
    }

    fetchStory();
  }, [storyKey]);

  const tabs = [
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'manual-testing', label: 'Manual Testing', icon: CheckCircle2 },
    { id: 'external-deps', label: 'Dependencies', icon: Info },
  ];

  const handleTabChange = (tabId: string) => {
    setEditingTab(tabId as typeof editingTab === 'string' ? tabId : null);
    if (tabId !== editingTab) {
      setEditContent({});
    }
  };

  const handleSave = async () => {
    if (!storyData) return;

    const body = {
      userTasks: {
        configuration: editContent.configuration || storyData.userTasks?.configuration || [],
        manualTesting: editContent.manualTesting || storyData.userTasks?.manualTesting || [],
        externalDependencies: editContent.externalDeps || storyData.userTasks?.externalDependencies || [],
      }
    };

    try {
      const response = await fetch(`/api/stories/${storyKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        alert('Failed to save changes');
        return;
      }

      const result = await response.json();
      setStoryData(result);
      setEditingTab(null);
      setEditContent({});
      alert('Changes saved successfully!');
    } catch (err) {
      console.error('Error saving changes:', err);
      alert('Failed to save changes');
    }
  };

  const renderConfigurationTab = () => {
    if (!storyData) return null;

    const userTasks = storyData.userTasks || {
      configuration: [],
      manualTesting: [],
      externalDependencies: [],
    };

    return (
      <div className="space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Required</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add configuration tasks here (e.g., environment variables, API keys, setup instructions)
            that must be completed before story development can proceed.
          </p>
          {userTasks.configuration.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {userTasks.configuration.map((task, index) => (
                <li key={index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={editingTab === 'configuration'}
                    onChange={(e) => {
                      const newConfig = [...userTasks.configuration];
                      newConfig[index] = e.target.checked;
                      setStoryData(prev => prev ? { ...prev, userTasks: { ...prev.userTasks, configuration: newConfig } } : prev);
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-not-allowed"
                  />
                  <span className="text-sm text-gray-700 ml-2">{task}</span>
                  <button
                    onClick={() => setEditContent({ configuration: task })}
                    disabled={editingTab !== 'configuration'}
                    className="ml-2 text-gray-400 hover:text-gray-900"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No configuration tasks defined yet</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Testing Required</h3>
          <p className="text-sm text-gray-600 mb-4">
            Manual testing steps to verify functionality (e.g., user flows, API responses,
            error cases, accessibility testing). Mark each as complete before
            moving to next story.
          </p>
          {userTasks.manualTesting.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {userTasks.manualTesting.map((task, index) => (
                <li key={index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={editingTab === 'manual-testing'}
                    onChange={(e) => {
                      const newManualTests = [...userTasks.manualTesting];
                      newManualTests[index] = e.target.checked;
                      setStoryData(prev => prev ? { ...prev, userTasks: { ...prev.userTasks, manualTesting: newManualTests } } : prev);
                    }}
                    className="w-4 h-4 text-yellow-600 rounded border-gray-300 cursor-not-allowed"
                  />
                  <span className="text-sm text-gray-700 ml-2">{task}</span>
                  <button
                    onClick={() => setEditContent({ manualTesting: task })}
                    disabled={editingTab !== 'manual-testing'}
                    className="ml-2 text-gray-400 hover:text-gray-900"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No manual testing tasks defined yet</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">External Dependencies</h3>
          <p className="text-sm text-gray-600 mb-4">
            External dependencies required by this story (e.g., services, libraries, APIs).
            Track these separately and ensure they're configured
            before development.
          </p>
          {userTasks.externalDependencies && userTasks.externalDependencies.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {userTasks.externalDependencies.map((dep, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-700">{dep}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No external dependencies defined yet</p>
          )}
        </div>

        {/* Save Button */}
        {editingTab && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-300"></div>
        <span className="ml-3 text-gray-600">Loading user tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-6 h-6 text-red-500" />
          <span className="text-lg font-medium text-red-700">Error Loading Tasks</span>
        </div>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchStory();
          }}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}
