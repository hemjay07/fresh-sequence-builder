"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { STEPS } from "@/utils/constants";
import { formatDateTime, formatRelativeTime } from "@/utils/dateUtils";

export default function ReviewScreen() {
  const { state, dispatch } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const { template, sender, recipient, partnership, emails, schedule } =
    state.data;

  const handleStart = () => {
    setShowConfirm(true);
  };

  const confirmStart = () => {
    dispatch({ type: "SET_STEP", payload: STEPS.SUCCESS });
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: STEPS.SCHEDULE });
  };

  const editSection = (step) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  const totalDuration = Math.ceil(
    (schedule[schedule.length - 1].scheduledTime - schedule[0].scheduledTime) /
      86400000
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Review & Launch
        </h2>
        <p className="text-lg text-gray-600">
          Everything looks good? Let&apos;s launch your sequence
        </p>
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">✉️</span>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Emails</p>
              <p className="text-2xl font-bold">{emails.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <p className="text-sm opacity-90">Duration</p>
              <p className="text-2xl font-bold">
                {totalDuration} {totalDuration === 1 ? "day" : "days"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <p className="text-sm opacity-90">First Send</p>
              <p className="text-2xl font-bold">
                {formatRelativeTime(schedule[0].scheduledTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipient Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Recipient</h3>
              </div>
              <button
                onClick={() => editSection(STEPS.INPUTS)}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Edit
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {(recipient.name || recipient.role).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900">
                    {recipient.name || recipient.role}
                  </p>
                  <p className="text-gray-700">
                    {recipient.role} at{" "}
                    <span className="font-semibold">{recipient.company}</span>
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                    <span className="text-sm text-gray-600">
                      {recipient.industry}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partnership Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤝</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Partnership</h3>
              </div>
              <button
                onClick={() => editSection(STEPS.INPUTS)}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Edit
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Type
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {partnership.type}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Value Proposition
                </p>
                <p className="text-base text-gray-700">
                  {partnership.valueHypothesis}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Call to Action
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {partnership.cta}
                </p>
              </div>
            </div>
          </div>

          {/* Email Sequence */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Email Sequence
                </h3>
              </div>
              <button
                onClick={() => editSection(STEPS.EMAILS)}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Edit
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {emails.map((email, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline connector */}
                    {idx < emails.length - 1 && (
                      <div className="absolute left-6 top-14 w-0.5 h-full bg-gradient-to-b from-blue-300 to-blue-100" />
                    )}

                    <div className="flex gap-4">
                      <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                        {email.stepNumber}
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">
                              Email {email.stepNumber}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">📅</span>
                              <p className="text-xs text-gray-600 font-medium">
                                {formatDateTime(schedule[idx].scheduledTime)}
                              </p>
                            </div>
                            <p className="text-xs text-blue-600 font-semibold mt-1">
                              {formatRelativeTime(schedule[idx].scheduledTime)}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">
                              Subject:
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {email.subject}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">
                              Preview:
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {email.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Timeline Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Timeline</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">⏱️</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Duration
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {totalDuration} {totalDuration === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🚀</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    First Email
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatRelativeTime(schedule[0].scheduledTime)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatDateTime(schedule[0].scheduledTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🏁</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Last Email
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatRelativeTime(
                      schedule[schedule.length - 1].scheduledTime
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatDateTime(
                      schedule[schedule.length - 1].scheduledTime
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-300 rounded-xl p-5 shadow-sm">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Important</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Once started, individual emails cannot be cancelled. You can
                  only cancel the entire sequence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={handleBack}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all flex items-center gap-2"
        >
          <span>←</span>
          <span>Back</span>
        </button>
        <button
          onClick={handleStart}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-lg"
        >
          <span>🚀</span>
          <span>Launch Sequence</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚀</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Launch Sequence?
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              You're about to schedule{" "}
              <span className="font-bold text-gray-900">
                {emails.length} emails
              </span>{" "}
              to{" "}
              <span className="font-bold text-gray-900">
                {recipient.company}
              </span>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 text-center">
                <span className="font-semibold">First email sends:</span>
                <br />
                {formatRelativeTime(schedule[0].scheduledTime)}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-sm text-yellow-900">
                  You cannot cancel individual emails once the sequence starts.
                  Only the entire sequence can be cancelled.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmStart}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg transition-all"
              >
                Yes, Launch Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
