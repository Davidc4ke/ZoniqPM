'use client';

import { Play, FileText, Settings, CheckCircle2, FileCheck, CheckSquare2, Save } from 'lucide-react';

interface ActionsBarProps {
  storyKey: string;
}

export function ActionsBar({ storyKey }: ActionsBarProps) {
  return (
    <div className="actions-bar bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Actions</h2>
      </div>

      <div className="grid grid-cols-5 gap-3">
        <button
          onClick={() => alert('Analyze functionality coming soon')}
          className="flex flex-col items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 border border-blue-300"
          disabled
        >
          <Play className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Analyze</span>
        </button>

        <button
          onClick={() => alert('Task functionality coming soon')}
          className="flex flex-col items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 border border-green-300"
          disabled
        >
          <CheckSquare2 className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Implement Task</span>
        </button>

        <button
          onClick={() => alert('Verify functionality coming soon')}
          className="flex flex-col items-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-200 border border-yellow-300"
          disabled
        >
          <FileCheck className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Verify</span>
        </button>

        <button
          onClick={() => alert('Complete functionality coming soon')}
          className="flex flex-col items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 border-green-300"
          disabled
        >
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Complete</span>
        </button>

        <button
          onClick={() => alert('Review functionality coming soon')}
          className="flex flex-col items-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 border border-purple-300"
          disabled
        >
          <FileText className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Review</span>
        </button>

        <button
          onClick={() => alert('Save functionality coming soon')}
          className="flex flex-col items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 border-gray-300"
          disabled
        >
          <Save className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Save</span>
        </button>

        <button
          onClick={() => alert('Settings functionality coming soon')}
          className="flex flex-col items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 border-gray-300"
          disabled
        >
          <Settings className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Settings</span>
        </button>
      </div>
    </div>
  );
}
