'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { STEPS, TEMPLATES } from '@/utils/constants';

export default function TemplatePicker() {
  const { state, dispatch } = useApp();
  const [selected, setSelected] = useState(state.data.template?.id || null);

  const handleSelect = (template) => {
    setSelected(template.id);
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_STEP', payload: STEPS.INPUTS });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Template</h2>
        <p className="text-gray-600">Select the type of partnership outreach you want to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template)}
            className={`text-left p-6 rounded-lg border-2 transition-all ${
              selected === template.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
              {selected === template.id && (
                <span className="text-blue-600 text-xl">✓</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <span>📧</span>
                <span>{template.emailCount} emails</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span>⏱️</span>
                <span>Over {template.defaultSpacing[template.defaultSpacing.length - 1]} days</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">{template.useCase}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}