// Utility helper functions

export const formatTime = (totalSeconds = 0) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatTimeDetailed = (totalSeconds = 0) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim() || '0m';
};

export const getPriorityBorderClass = (priority) => {
    switch (priority) {
        case 'high': return 'border-l-4 border-l-red-500/80';
        case 'medium': return 'border-l-4 border-l-orange-400/80';
        case 'low': return 'border-l-4 border-l-blue-400/80';
        default: return 'border-l-4 border-l-[var(--border-secondary)]';
    }
};

export const isToday = (isoString) => {
    if (!isoString) return false;
    const date = new Date(isoString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
};

export const formatReminderTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Today at ${time}`;
    if (isTomorrow) return `Tomorrow at ${time}`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ` at ${time}`;
};

export const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16);
};

export const generateUUID = () => {
    return crypto.randomUUID();
};

export const calculateLevel = (xp, xpPerLevel = 200) => {
    return Math.floor(xp / xpPerLevel) + 1;
};

export const calculateLevelProgress = (xp, xpPerLevel = 200) => {
    const currentLevelXp = xp % xpPerLevel;
    return (currentLevelXp / xpPerLevel) * 100;
};
