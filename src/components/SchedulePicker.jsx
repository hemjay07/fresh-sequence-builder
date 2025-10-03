"use client";

import { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { STEPS } from "@/utils/constants";
import {
  addMinutes,
  addHours,
  addDays,
  setHours,
  setMinutes,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
} from "@/utils/dateUtils";
import { validateSchedule } from "@/utils/validation";

// Custom Date Picker Component
function CustomDatePicker({ value, minDate, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value));
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(value);
  selectedDate.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleDateClick = (day) => {
    if (!day) return;
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const minDateTime = new Date(minDate);
    minDateTime.setHours(0, 0, 0, 0);

    if (newDate >= minDateTime) {
      onChange(newDate);
      setIsOpen(false);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const isDateDisabled = (day) => {
    if (!day) return true;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const minDateTime = new Date(minDate);
    minDateTime.setHours(0, 0, 0, 0);
    return date < minDateTime;
  };

  const isSelected = (day) => {
    if (!day) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.getTime() === selectedDate.getTime();
  };

  const isToday = (day) => {
    if (!day) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.getTime() === today.getTime();
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base font-medium hover:border-gray-400 bg-white text-left"
      >
        {new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(value)}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h3 className="font-bold text-gray-900">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(currentMonth)}
            </h3>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={isDateDisabled(day)}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                  ${!day ? "invisible" : ""}
                  ${
                    isDateDisabled(day)
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-blue-50 cursor-pointer"
                  }
                  ${
                    isSelected(day)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : ""
                  }
                  ${
                    isToday(day) && !isSelected(day)
                      ? "bg-blue-100 text-blue-600 font-bold"
                      : ""
                  }
                  ${
                    !isSelected(day) && !isToday(day) && !isDateDisabled(day)
                      ? "text-gray-700"
                      : ""
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                onChange(new Date());
                setIsOpen(false);
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-600 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Time Picker Component
function CustomTimePicker({ value, onChange, onKeyDown }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const hours = value.getHours();
  const minutes = value.getMinutes();
  const displayHours = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHourClick = (hour) => {
    const newDate = new Date(value);
    let newHour = hour;
    if (period === "PM" && hour !== 12) newHour += 12;
    if (period === "AM" && hour === 12) newHour = 0;
    newDate.setHours(newHour);
    onChange(newDate);
  };

  const handleMinuteClick = (minute) => {
    const newDate = new Date(value);
    newDate.setMinutes(minute);
    onChange(newDate);
  };

  const togglePeriod = () => {
    const newDate = new Date(value);
    const currentHours = newDate.getHours();
    newDate.setHours(
      currentHours >= 12 ? currentHours - 12 : currentHours + 12
    );
    onChange(newDate);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={onKeyDown}
        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base font-medium hover:border-gray-400 bg-white text-left"
      >
        {displayHours}:{minutes.toString().padStart(2, "0")} {period}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4 w-80">
          <div className="flex gap-4">
            {/* Hours */}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                Hour
              </h4>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleHourClick(hour)}
                    className={`
                      py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        displayHours === hour
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-blue-50"
                      }
                    `}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                Minute
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {[0, 15, 30, 45].map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleMinuteClick(minute)}
                    className={`
                      py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        minutes === minute
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-blue-50"
                      }
                    `}
                  >
                    {minute.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                Period
              </h4>
              <button
                type="button"
                onClick={togglePeriod}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    period === "AM"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-blue-50"
                  }
                `}
              >
                AM
              </button>
              <button
                type="button"
                onClick={togglePeriod}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    period === "PM"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-blue-50"
                  }
                `}
              >
                PM
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SchedulePicker() {
  const { state, dispatch } = useApp();
  const [schedules, setSchedules] = useState(state.data.schedule);
  const [currentTime] = useState(new Date());

  useEffect(
    () => {
      const validated = validateSchedule(schedules, currentTime);
      setSchedules(validated);
      dispatch({ type: "SET_SCHEDULE", payload: validated });
      dispatch({
        type: "SET_CAN_PROGRESS",
        payload: validated.every((s) => s.status !== "invalid"),
      });
    },
    [schedules.map((s) => s.scheduledTime.getTime()).join(",")],
    currentTime,
    dispatch,
    schedules
  );

  const updateTime = (emailId, newTime) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.emailId === emailId ? { ...s, scheduledTime: newTime } : s
      )
    );
  };

  const adjustTime = (emailId, minutes) => {
    const schedule = schedules.find((s) => s.emailId === emailId);
    if (!schedule) return;

    let newTime = addMinutes(schedule.scheduledTime, minutes);

    if (schedule.stepNumber === 1) {
      const minTime = addMinutes(currentTime, 5);
      if (newTime < minTime) newTime = minTime;
    }

    updateTime(emailId, newTime);
  };

  const handleKeyDown = (emailId, e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      adjustTime(emailId, e.shiftKey ? 60 : 15);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      adjustTime(emailId, e.shiftKey ? -60 : -15);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.target.blur();
    }
  };

  const presets = [
    {
      label: "Tomorrow 9am",
      icon: "🌅",
      getValue: () => setMinutes(setHours(addDays(currentTime, 1), 9), 0),
    },
    {
      label: "In 2 hours",
      icon: "⏱️",
      getValue: () => addHours(currentTime, 2),
    },
    {
      label: "Next Week",
      icon: "📅",
      getValue: () => setMinutes(setHours(addDays(currentTime, 7), 9), 0),
    },
  ];

  const handleContinue = () => {
    dispatch({ type: "SET_STEP", payload: STEPS.REVIEW });
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: STEPS.EMAILS });
  };

  const getEmailLabel = (stepNumber) => {
    const labels = {
      1: "Initial Introduction",
      2: "Follow-up",
      3: "Final Nudge",
    };
    return labels[stepNumber] || `Email ${stepNumber}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Schedule Your Sequence
        </h2>
        <p className="text-lg text-gray-600">
          Set when each email should be sent
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
          <span className="text-sm text-gray-500">Current time:</span>
          <span className="text-sm font-medium text-gray-900">
            {formatDateTime(currentTime)}
          </span>
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">⌨️</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  ↑ ↓
                </kbd>
                <span className="text-gray-700">Adjust by 15 min</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  Shift + ↑↓
                </kbd>
                <span className="text-gray-700">Adjust by 1 hour</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  Esc
                </kbd>
                <span className="text-gray-700">Cancel editing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Schedule Cards */}
      <div className="space-y-5 mb-10">
        {schedules.map((schedule, index) => {
          const hasErrors = schedule.errors?.length > 0;
          const hasWarnings = schedule.warnings?.length > 0;

          return (
            <div
              key={schedule.emailId}
              className={`rounded-xl border transition-all ${
                hasErrors
                  ? "border-red-300 bg-red-50 shadow-md"
                  : hasWarnings
                  ? "border-yellow-300 bg-yellow-50 shadow-md"
                  : "border-gray-200 bg-white shadow-sm hover:shadow-md"
              }`}
            >
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                        hasErrors
                          ? "bg-red-500"
                          : hasWarnings
                          ? "bg-yellow-500"
                          : "bg-gradient-to-br from-blue-600 to-indigo-600"
                      }`}
                    >
                      {schedule.stepNumber}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Email {schedule.stepNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getEmailLabel(schedule.stepNumber)}
                      </p>
                    </div>
                  </div>
                  {schedule.status === "valid" && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-sm font-semibold text-green-700">
                        Ready
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-5">
                {/* Date & Time Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>📅</span>
                      Date
                    </label>
                    <CustomDatePicker
                      value={schedule.scheduledTime}
                      minDate={currentTime}
                      onChange={(newDate) => {
                        newDate.setHours(schedule.scheduledTime.getHours());
                        newDate.setMinutes(schedule.scheduledTime.getMinutes());
                        updateTime(schedule.emailId, newDate);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>🕐</span>
                      Time
                    </label>
                    <CustomTimePicker
                      value={schedule.scheduledTime}
                      onChange={(newTime) =>
                        updateTime(schedule.emailId, newTime)
                      }
                      onKeyDown={(e) => handleKeyDown(schedule.emailId, e)}
                    />
                  </div>
                </div>

                {/* Quick Presets (First Email Only) */}
                {index === 0 && (
                  <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Quick presets:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() =>
                            updateTime(schedule.emailId, preset.getValue())
                          }
                          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-2"
                        >
                          <span>{preset.icon}</span>
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scheduled Time Display */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📧</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Scheduled for:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatDateTime(schedule.scheduledTime)}
                      </p>
                      <p className="text-sm font-bold text-blue-600 mt-1">
                        {formatRelativeTime(schedule.scheduledTime)}
                      </p>
                      {index > 0 && (
                        <p className="text-xs text-gray-600 mt-2">
                          {Math.floor(
                            (schedule.scheduledTime -
                              schedules[index - 1].scheduledTime) /
                              86400000
                          )}{" "}
                          days after Email {schedule.stepNumber - 1}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Errors */}
                {hasErrors && (
                  <div className="space-y-2 mb-4">
                    {schedule.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-red-100 border border-red-300 rounded-lg"
                      >
                        <span className="text-xl flex-shrink-0">❌</span>
                        <p className="text-sm font-medium text-red-800">
                          {error.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {hasWarnings && !hasErrors && (
                  <div className="space-y-2 mb-4">
                    {schedule.warnings.map((warning, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg"
                      >
                        <span className="text-xl flex-shrink-0">⚠️</span>
                        <p className="text-sm font-medium text-yellow-800">
                          {warning.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Success Indicator */}
                {!hasErrors && index > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      Correctly scheduled after Email {schedule.stepNumber - 1}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>📊</span>
          Sequence Timeline
        </h3>
        <div className="relative py-8">
          <div className="relative flex justify-between items-center">
            {/* Timeline Line */}
            <div
              className="absolute top-7 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 rounded-full"
              style={{
                left:
                  schedules.length > 1
                    ? `${100 / schedules.length / 2}%`
                    : "50%",
                right:
                  schedules.length > 1
                    ? `${100 / schedules.length / 2}%`
                    : "50%",
              }}
            />

            {/* Timeline Points */}
            {schedules.map((schedule, idx) => (
              <div
                key={schedule.emailId}
                className="flex flex-col items-center relative z-10 flex-1"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg transition-all ${
                    schedule.status === "invalid"
                      ? "bg-red-500"
                      : schedule.status === "warning"
                      ? "bg-yellow-500"
                      : "bg-gradient-to-br from-blue-600 to-indigo-600"
                  }`}
                >
                  {schedule.stepNumber}
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                  }).format(schedule.scheduledTime)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(schedule.scheduledTime)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Summary Banner */}
      {schedules.some((s) => s.status === "invalid") && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 mb-8 shadow-md">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-red-900 mb-2">
                {schedules.filter((s) => s.status === "invalid").length}{" "}
                issue(s) need attention
              </h4>
              <ul className="space-y-1.5">
                {schedules
                  .filter((s) => s.status === "invalid")
                  .map((schedule) =>
                    schedule.errors.map((error, idx) => (
                      <li
                        key={`${schedule.emailId}-${idx}`}
                        className="text-sm text-red-700 flex items-start gap-2"
                      >
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Email {schedule.stepNumber}:</strong>{" "}
                          {error.message}
                        </span>
                      </li>
                    ))
                  )}
              </ul>
            </div>
          </div>
        </div>
      )}

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
          onClick={handleContinue}
          disabled={!state.canProgress}
          className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            state.canProgress
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span>Continue to Review</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
