'use client';

import { useApp } from '@/context/AppContext';
import { formatDateTime } from '@/utils/dateUtils';

export default function SuccessScreen() {
  const { state, dispatch } = useApp();
  const { recipient, schedule, emails } = state.data;
  const sequenceId = `SEQ-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const handleCreateAnother = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✓</span>
        </div>
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Sequence Started!</h2>
        <p className="text-gray-600">
          Your {emails.length}-email sequence to {recipient.company} is scheduled
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="space-y-3 text-left">
          {schedule.map(s => (
            <div key={s.emailId} className="flex items-center gap-3 text-gray-700">
              <span className="text-blue-600">📧</span>
              <span className="font-medium">Email {s.stepNumber}:</span>
              <span className="text-gray-600">{formatDateTime(s.scheduledTime)}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Sequence ID:</strong> {sequenceId}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-medium text-blue-900 mb-3">What happens next?</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Emails will be sent automatically at scheduled times</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>You'll receive confirmation after each email sends</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>You can view or cancel this sequence anytime</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCreateAnother}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Create Another Sequence
        </button>
      </div>
    </div>
  );
}