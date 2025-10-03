'use client';

import { useApp } from '@/context/AppContext';
import { STEPS } from '@/utils/constants';
import ProgressIndicator from './ProgressIndicator';
import TemplatePicker from './TemplatePicker';
import DynamicInputs from './DynamicInputs';
import EmailEditor from './EmailEditor';
import SchedulePicker from './SchedulePicker';
import ReviewScreen from './ReviewScreen';
import SuccessScreen from './SuccessScreen';

export default function MainApp() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Improved Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Fresh Sequence Builder
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Create personalized email sequences for partnership outreach
              </p>
            </div>
            
            {/* Optional: Add action button or help link */}
            {state.currentStep !== STEPS.SUCCESS && (
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Need help?
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {state.currentStep !== STEPS.SUCCESS && <ProgressIndicator />}
        
        <div className="mt-8">
          {state.currentStep === STEPS.TEMPLATE && <TemplatePicker />}
          {state.currentStep === STEPS.INPUTS && <DynamicInputs />}
          {state.currentStep === STEPS.EMAILS && <EmailEditor />}
          {state.currentStep === STEPS.SCHEDULE && <SchedulePicker />}
          {state.currentStep === STEPS.REVIEW && <ReviewScreen />}
          {state.currentStep === STEPS.SUCCESS && <SuccessScreen />}
        </div>
      </main>
    </div>
  );
}
