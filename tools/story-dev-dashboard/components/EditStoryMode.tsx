'use client';

import { useState } from 'react';
import { CheckSquare2, Plus, Trash2, Save, X } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  status: string;
  dependencies?: string[];
}

interface StoryData {
  key: string;
  acceptanceCriteria: string[];
  tasks: Task[];
  devNotes: string;
}

interface EditStoryModeProps {
  storyData: StoryData;
  onSave: (data: Partial<StoryData>) => Promise<void>;
  onCancel: () => void;
}

export function EditStoryMode({ storyData, onSave, onCancel }: EditStoryModeProps) {
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(storyData.acceptanceCriteria || []);
  const [tasks, setTasks] = useState<Task[]>(storyData.tasks || []);
  const [devNotes, setDevNotes] = useState(storyData.devNotes || '');
  const [saving, setSaving] = useState(false);

  // Acceptance Criteria Management
  const addCriterion = () => {
    setAcceptanceCriteria([...acceptanceCriteria, '']);
  };

  const addCriterionItem = (index: number, value: string) => {
    const newCriteria = [...acceptanceCriteria];
    newCriteria[index] = value;
    setAcceptanceCriteria(newCriteria);
  };

  const removeCriterion = (index: number) => {
    setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== index));
  };

  // Task Management
  const addTask = () => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    setTasks([...tasks, { id: newId, title: '', status: 'pending' }]);
  };

  const updateTaskTitle = (id: number, title: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, title } : task)));
  };

  const updateTaskStatus = (id: number, status: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, status } : task)));
  };

  const updateTaskDependencies = (id: number, dependencies: string[]) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, dependencies } : task)));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Save Handler
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        acceptanceCriteria,
        tasks,
        devNotes,
      });
    } catch (err) {
      console.error('Error saving changes:', err);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">Pending</span>;
      case 'in-progress':
        return <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs rounded">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-200 text-green-700 text-xs rounded">Completed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">{status}</span>;
    }
  };

  return (
    <div className="edit-story-mode bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Edit Story: {storyData.key}</h2>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Acceptance Criteria Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Acceptance Criteria</h3>
          <button
            onClick={addCriterion}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Criterion</span>
          </button>
        </div>

        {acceptanceCriteria.length > 0 ? (
          <div className="space-y-3">
            {acceptanceCriteria.map((criterion, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1">
                  <textarea
                    value={criterion}
                    onChange={(e) => addCriterionItem(index, e.target.value)}
                    className="w-full min-h-[60px] px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder={`Criterion ${index + 1}`}
                    rows={2}
                  />
                </div>
                <button
                  onClick={() => removeCriterion(index)}
                  className="mt-1 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove criterion"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No acceptance criteria defined</p>
            <button
              onClick={addCriterion}
              className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Criterion</span>
            </button>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
          <button
            onClick={addTask}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="space-y-3">
                  {/* Task Title */}
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task title"
                      />
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="mt-6 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Task Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Task Dependencies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dependencies (comma-separated task IDs)
                    </label>
                    <input
                      type="text"
                      value={task.dependencies?.join(', ') || ''}
                      onChange={(e) => {
                        const deps = e.target.value
                          .split(',')
                          .map(d => d.trim())
                          .filter(d => d.length > 0);
                        updateTaskDependencies(task.id, deps);
                      }}
                      className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1, 3, 5"
                    />
                  </div>

                  {/* Current Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Current:</span>
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No tasks defined</p>
            <button
              onClick={addTask}
              className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Dev Notes Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Notes</h3>
        <textarea
          value={devNotes}
          onChange={(e) => setDevNotes(e.target.value)}
          className="w-full min-h-[200px] px-4 py-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Add development notes, implementation details, or technical considerations..."
          rows={10}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}
