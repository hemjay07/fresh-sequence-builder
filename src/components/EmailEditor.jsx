'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { STEPS } from '@/utils/constants';
import { addDays, setHours, setMinutes } from '@/utils/dateUtils';

export default function EmailEditor() {
  const { state, dispatch } = useApp();
  const template = state.data.template;
  
  const [emails, setEmails] = useState(
    state.data.emails.length > 0
      ? state.data.emails
      : template.steps.map(step => ({
          stepNumber: step.stepNumber,
          subject: '',
          body: '',
          aiEnabled: false,
          generatedBy: 'manual',
          status: 'empty'
        }))
  );
  const [currentEmail, setCurrentEmail] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const canContinue = emails.every(e => e.subject.trim() && e.body.trim());

  const handleGenerateAI = async (index) => {
    setIsGenerating(true);
    
    // Simulate AI generation (replace with real API call in Deliverable 2)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updated = [...emails];
    updated[index] = {
      ...updated[index],
      subject: `Partnership opportunity for ${state.data.recipient.company}`,
      body: `Hi ${state.data.recipient.name || 'there'},\n\nI noticed ${state.data.recipient.signalDescription}. \n\nAt ${state.data.sender.company}, ${state.data.sender.oneLiner}. Given your focus on ${state.data.recipient.industry}, I think there's a strong fit for ${state.data.partnership.type}.\n\n${state.data.sender.benefits[0]}. ${state.data.sender.socialProof}.\n\nWould you be open to ${state.data.partnership.cta}?`,
      generatedBy: 'ai',
      aiRationale: 'This email references the recent signal, ties your product to their industry, includes social proof, and has a clear CTA.'
    };
    setEmails(updated);
    setIsGenerating(false);
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_EMAILS', payload: emails });
    
    const now = new Date();
    const tomorrow9am = setMinutes(setHours(addDays(now, 1), 9), 0);
    const schedule = emails.map((email, idx) => ({
      emailId: `email-${idx + 1}`,
      stepNumber: email.stepNumber,
      scheduledTime: addDays(tomorrow9am, template.defaultSpacing[idx]),
      status: 'valid',
      errors: [],
      warnings: []
    }));
    
    dispatch({ type: 'SET_SCHEDULE', payload: schedule });
    dispatch({ type: 'SET_STEP', payload: STEPS.SCHEDULE });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: STEPS.INPUTS });
  };

  const updateEmail = (field, value) => {
    const updated = [...emails];
    updated[currentEmail] = { 
      ...updated[currentEmail], 
      [field]: value,
      generatedBy: field === 'aiEnabled' ? updated[currentEmail].generatedBy : 'manual'
    };
    setEmails(updated);
  };

  const placeholders = [
    '{{company}}',
    '{{recipient_name}}', 
    '{{recipient_company}}',
    '{{value_prop}}',
    '{{benefits}}',
    '{{social_proof}}',
    '{{cta}}'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Email Content</h2>
        <p className="text-gray-600">Write or generate your email sequence with AI</p>
      </div>

      {/* Email Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {emails.map((email, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentEmail(idx)}
            className={`px-4 py-2 font-medium transition-colors ${
              currentEmail === idx
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email {email.stepNumber}
            {email.subject && email.body && <span className="ml-2 text-green-600">✓</span>}
          </button>
        ))}
      </div>

      {/* Email Editor */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Email {emails[currentEmail].stepNumber}: {template.steps[currentEmail].label}
          </h3>
          <p className="text-sm text-gray-600">{template.steps[currentEmail].description}</p>
        </div>

        {/* AI Control Toggle */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emails[currentEmail].aiEnabled || false}
                  onChange={(e) => updateEmail('aiEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Use AI to generate this email</span>
                  <p className="text-xs text-gray-600 mt-1">
                    AI will personalize content based on your inputs and the recipient's signal
                  </p>
                </div>
              </label>
            </div>
            
            {emails[currentEmail].aiEnabled && (
              <button
                onClick={() => handleGenerateAI(currentEmail)}
                disabled={isGenerating}
                className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isGenerating 
                    ? 'bg-gray-300 text-gray-500 cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isGenerating ? '⏳ Generating...' : '⚡ Generate Email'}
              </button>
            )}
          </div>
        </div>

        {/* Show AI Rationale if Generated */}
        {emails[currentEmail].generatedBy === 'ai' && emails[currentEmail].aiRationale && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-1">✓ AI Generated</p>
            <p className="text-xs text-green-700">
              <strong>Why this works:</strong> {emails[currentEmail].aiRationale}
            </p>
          </div>
        )}

        {/* Template Placeholders */}
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">📋 Available placeholders:</p>
          <div className="flex flex-wrap gap-2">
            {placeholders.map(ph => (
              <code key={ph} className="text-xs bg-white px-2 py-1 rounded border border-gray-300 text-blue-600">
                {ph}
              </code>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            These will be automatically replaced when the email is sent
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Line * <span className="text-gray-500">({emails[currentEmail].subject.length}/60)</span>
            </label>
            <input
              type="text"
              maxLength={60}
              value={emails[currentEmail].subject}
              onChange={(e) => updateEmail('subject', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter subject line"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Body * <span className="text-gray-500">({emails[currentEmail].body.split(' ').filter(w => w).length} words)</span>
            </label>
            <textarea
              value={emails[currentEmail].body}
              onChange={(e) => updateEmail('body', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              rows={12}
              placeholder="Write your email here or use AI to generate..."
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Keep it under 150 words for best response rates. You can edit AI-generated content.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          {currentEmail < emails.length - 1 && (
            <button
              onClick={() => setCurrentEmail(currentEmail + 1)}
              className="px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 font-medium"
            >
              Next Email →
            </button>
          )}
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`px-6 py-3 rounded-lg font-medium ${
              canContinue
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Schedule →
          </button>
        </div>
      </div>
    </div>
  );
}
