export const addMinutes = (date, mins) => new Date(date.getTime() + mins * 60000);
export const addHours = (date, hours) => new Date(date.getTime() + hours * 3600000);
export const addDays = (date, days) => new Date(date.getTime() + days * 86400000);
export const setHours = (date, hours) => { const d = new Date(date); d.setHours(hours); return d; };
export const setMinutes = (date, mins) => { const d = new Date(date); d.setMinutes(mins); return d; };

export const formatDate = (date) => date.toISOString().split('T')[0];
export const formatTime = (date) => date.toTimeString().slice(0, 5);

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

export const formatRelativeTime = (date, from = new Date()) => {
  const diff = Math.floor((date - from) / 60000);
  if (diff < 60) return `In ${diff} min`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `In ${hours}h`;
  const days = Math.floor(hours / 24);
  return `In ${days}d`;
};