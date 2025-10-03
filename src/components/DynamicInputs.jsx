'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { STEPS } from '@/utils/constants';
import { validateInputs } from '@/utils/validation';

export default function DynamicInputs() {
  const { state, dispatch } = useApp();
  const [sender, setSender] = useState(state.data.sender);
  const [recipient, setRecipient] = useState(state.data.recipient);
  const [partnership, setPartnership] = useState(state.data.partnership);
  const [errors, setErrors] = useState({});
  const [showSaved, setShowSaved] = useState(false);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('draft_sender', JSON.stringify(sender));
      localStorage.setItem('draft_recipient', JSON.stringify(recipient));
      localStorage.setItem('draft_partnership', JSON.stringify(partnership));
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [sender, recipient, partnership]);

  // Load saved draft on mount
  useEffect(() => {
    const savedSender = localStorage.getItem('draft_sender');
    const savedRecipient = localStorage.getItem('draft_recipient');
    const savedPartnership = localStorage.getItem('draft_partnership');
    
    if (savedSender) setSender(JSON.parse(savedSender));
    if (savedRecipient) setRecipient(JSON.parse(savedRecipient));
    if (savedPartnership) setPartnership(JSON.parse(savedPartnership));
  }, []);

  const handleContinue = () => {
    const validation = validateInputs(sender, recipient, partnership);
    
    if (validation.isValid) {
      dispatch({ type: 'SET_INPUTS', payload: { sender, recipient, partnership } });
      dispatch({ type: 'SET_STEP', payload: STEPS.EMAILS });
    } else {
      setErrors(validation.errors);
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: STEPS.TEMPLATE });
  };

  const clearDraft = () => {
    localStorage.removeItem('draft_sender');
    localStorage.removeItem('draft_recipient');
    localStorage.removeItem('draft_partnership');
    setSender(state.data.sender);
    setRecipient(state.data.recipient);
    setPartnership(state.data.partnership);
  };

  return (
    <div className="max-w-5xl mx-auto page-transition">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Provide Details</h2>
        <p className="text-lg text-gray-600">Tell us about your company and the prospect</p>
      </div>

      {/* Draft Auto-Save Indicator */}
      <div className="mb-6 flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${showSaved ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-sm font-medium text-gray-700">
            {showSaved ? '✓ Draft saved' : 'Auto-saving...'}
          </span>
        </div>
        <button
          onClick={clearDraft}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Clear saved draft
        </button>
      </div>

      <div className="space-y-6">
        {/* About You Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">About You</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sender.company}
                onChange={(e) => setSender({...sender, company: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Acme Corp"
              />
              {errors.company && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.company}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={sender.website}
                onChange={(e) => setSender({...sender, website: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://acme.com"
              />
              {errors.website && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.website}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                One-liner <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({sender.oneLiner.length}/60)
                </span>
              </label>
              <input
                type="text"
                maxLength={60}
                value={sender.oneLiner}
                onChange={(e) => setSender({...sender, oneLiner: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="We help SaaS companies automate customer onboarding"
              />
              {errors.oneLiner && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.oneLiner}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Key Benefits (3) <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">{i + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={sender.benefits[i]}
                      onChange={(e) => {
                        const newBenefits = [...sender.benefits];
                        newBenefits[i] = e.target.value;
                        setSender({...sender, benefits: newBenefits});
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={`Benefit ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
              {errors.benefits && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.benefits}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Social Proof <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({sender.socialProof.length}/100)
                </span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={sender.socialProof}
                onChange={(e) => setSender({...sender, socialProof: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Used by 500+ companies including Notion, Figma"
              />
              {errors.socialProof && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.socialProof}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* About Them Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">About Them</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Name <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={recipient.name}
                onChange={(e) => setRecipient({...recipient, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Sarah Chen"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role/Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={recipient.role}
                onChange={(e) => setRecipient({...recipient, role: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Head of Partnerships"
              />
              {errors.role && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.role}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={recipient.company}
                onChange={(e) => setRecipient({...recipient, company: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="TechFlow"
              />
              {errors.recipientCompany && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.recipientCompany}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                value={recipient.industry}
                onChange={(e) => setRecipient({...recipient, industry: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select industry</option>
                <option value="SaaS">SaaS</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Fintech">Fintech</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
              {errors.industry && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.industry}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recent Public Signal (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={recipient.signalUrl}
                onChange={(e) => setRecipient({...recipient, signalUrl: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="https://linkedin.com/posts/..."
              />
              {errors.signalUrl && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.signalUrl}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What happened? <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({recipient.signalDescription.length}/100)
                </span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={recipient.signalDescription}
                onChange={(e) => setRecipient({...recipient, signalDescription: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Just raised $20M Series B"
              />
              {errors.signalDescription && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.signalDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Partnership Details Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Partnership Details</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Partnership Type <span className="text-red-500">*</span>
              </label>
              <select
                value={partnership.type}
                onChange={(e) => setPartnership({...partnership, type: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Select type</option>
                <option value="integration">Integration</option>
                <option value="comarketing">Co-Marketing</option>
                <option value="reseller">Reseller</option>
                <option value="affiliate">Affiliate</option>
              </select>
              {errors.partnershipType && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.partnershipType}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Value Hypothesis <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({partnership.valueHypothesis.length}/120)
                </span>
              </label>
              <textarea
                maxLength={120}
                value={partnership.valueHypothesis}
                onChange={(e) => setPartnership({...partnership, valueHypothesis: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                rows={3}
                placeholder="Our AI onboarding could help your enterprise customers activate faster"
              />
              {errors.valueHypothesis && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.valueHypothesis}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Call-to-Action <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={partnership.cta}
                onChange={(e) => setPartnership({...partnership, cta: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="15-minute intro call next week"
              />
              {errors.cta && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.cta}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-10">
        <button
          onClick={handleBack}
          className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all hover:scale-105"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg transition-all hover:scale-105"
        >
          Continue to Emails →
        </button>
      </div>
    </div>
  );
}
