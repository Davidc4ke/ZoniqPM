'use client';

import { useEffect, useState } from 'react';
import { FileText, List, BookOpen, Settings, CheckCircle2, User, Clock } from 'lucide-react';

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
  status: string;
  userTasks?: {
    configuration: string[];
    manualTesting: string[];
    externalDependencies: string[];
  };
  content?: string;
}

interface StoryDetailProps {
  storyKey: string;
  onBack?: () => void;
  onEditStory?: () => void;
}

type TabType = 'story' | 'ac' | 'tasks' | 'dev-notes' | 'user-tasks';

export function StoryDetail({ storyKey, onBack, onEditStory }: StoryDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('story');
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [sessionData, setSessionData] = useState<{ key: string; currentTask: number; totalTasks: number; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${storyKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
        const data = await response.json();
        setStoryData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching story:', err);
        setError(err instanceof Error ? err.message : 'Failed to load story');
      } finally {
        setLoading(false);
      }
    };

    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/dev-session/${storyKey}`);
        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      }
    };

    fetchStory();
    fetchSession();
  }, [storyKey]);

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'story', label: 'Story', icon: <FileText className="w-4 h-4" /> },
    { id: 'ac', label: 'Acceptance Criteria', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <List className="w-4 h-4" /> },
    { id: 'dev-notes', label: 'Dev Notes', icon: <Settings className="w-4 h-4" /> },
    { id: 'user-tasks', label: 'User Tasks', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog':
        return 'text-gray-600';
      case 'analyzed':
      case 'ready-for-dev':
        return 'text-blue-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'verifying':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'backlog':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Backlog</span>;
      case 'analyzed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Analyzed</span>;
      case 'in-progress':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">In Progress</span>;
      case 'verifying':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Verifying</span>;
      case 'ready-for-dev':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Ready</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Done</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Unknown</span>;
    }
  };

  const renderStoryTab = () => {
    if (!storyData) return null;

    return (
      <div className="space-y-4">
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{storyData.title}</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{storyData.description}</p>
        </div>
      </div>
    );
  };

  const renderACTab = () => {
    if (!storyData) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceptance Criteria</h3>
        <ol className="list-decimal list-inside space-y-2">
          {storyData.acceptanceCriteria.map((ac, index) => (
            <li key={index} className="text-gray-700 text-sm mb-2">{ac}</li>
          ))}
        </ol>
      </div>
    );
  };

  const renderTasksTab = () => {
    if (!storyData) return null;

    const taskStatusMap: Record<number, { status: string; completed_at?: string }> = {};
    const taskStatus = sessionData?.task_status || {};

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h3>
        <div className="space-y-2">
          {storyData.tasks.map((task) => {
            const sessionTask = taskStatus[task.id];
            const taskStatusValue = sessionTask?.status || task.status;
            
            return (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      taskStatusValue === 'completed' ? 'bg-green-500 text-white' : 
                      taskStatusValue === 'in-progress' ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {task.id}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                      {task.dependencies && task.dependencies.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">Depends on: Task {task.dependencies.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(taskStatusValue)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDevNotesTab = () => {
    if (!storyData) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dev Notes</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="whitespace-pre-wrap text-gray-700 text-sm">
            {storyData.devNotes || 'No dev notes yet'}
          </div>
        </div>
      </div>
    );
  };

  const renderUserTasksTab = () => {
    if (!storyData) return null;

    const userTasks = storyData.userTasks || {
      configuration: [],
      manualTesting: [],
      externalDependencies: [],
    };

    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Configuration Required</h4>
          {userTasks.configuration.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {userTasks.configuration.map((task, index) => (
                <li key={index} className="text-sm text-gray-700">{task}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No configuration tasks</p>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Manual Testing Required</h4>
          {userTasks.manualTesting.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {userTasks.manualTesting.map((task, index) => (
                <li key={index} className="text-sm text-gray-700">{task}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No manual testing tasks</p>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">External Dependencies</h4>
          {userTasks.externalDependencies.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {userTasks.externalDependencies.map((dep, index) => (
                <li key={index} className="text-sm text-gray-700">{dep}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No external dependencies</p>
          )}
        </div>
      </div>
    );
  };

  const renderSessionInfo = () => {
    if (!sessionData) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Dev Session</p>
            <p className="text-sm text-blue-600">
              Status: <span className={`font-semibold ${getStatusColor(sessionData.status)}`}>{sessionData.status}</span>
              {' | '}
              Progress: {sessionData.currentTask}/{sessionData.totalTasks} tasks
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'story':
        return renderStoryTab();
      case 'ac':
        return renderACTab();
      case 'tasks':
        return renderTasksTab();
      case 'dev-notes':
        return renderDevNotesTab();
      case 'user-tasks':
        return renderUserTasksTab();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 border-t-orange-500"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg"
          >
            <FileText className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            {storyData && (
              <>
                <div className="flex items-center gap-2">
                  {getStatusBadge(storyData.status)}
                  <h2 className="text-xl font-bold text-gray-900">{storyData.title}</h2>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {sessionData && renderSessionInfo()}

      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-orange-500 text-orange-600 bg-white'
                  : 'border-b-2 border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {storyData && renderTabContent()}
      </div>
    </div>
  );
}
