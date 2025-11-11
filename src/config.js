// Configuration file for SmartBuddy.AI

// API Configuration
export const API_CONFIG = {
    // TODO: Replace with your actual Gemini API key
    // Get your key from: https://aistudio.google.com/app/apikey
    GEMINI_API_KEY: 'AIzaSyDChMiwEP8NryUbplwAKHrQzeqlOljxq1g',
    MODEL_NAME: 'gemini-2.5-flash'
};

// Game Configuration
export const GAME_CONFIG = {
    XP_PER_LEVEL: 200,
    MYSTERY_BOX_CHANCE: 0.1, // 10% chance
    REMINDER_CHECK_INTERVAL: 10000 // 10 seconds
};

// Initial Data
export const INITIAL_ACHIEVEMENTS = [
    { 
        id: 'tasks1', 
        title: 'Task Novice', 
        description: 'Complete 10 tasks', 
        xpReward: 50, 
        gemReward: 10, 
        goal: 10, 
        unlocked: false, 
        getProgress: (_, tasks) => tasks.filter(t => t.completed).length 
    },
    { 
        id: 'tasks2', 
        title: 'Task Apprentice', 
        description: 'Complete 25 tasks', 
        xpReward: 100, 
        gemReward: 25, 
        goal: 25, 
        unlocked: false, 
        getProgress: (_, tasks) => tasks.filter(t => t.completed).length 
    },
    { 
        id: 'streak1', 
        title: 'Streak Starter', 
        description: 'Reach a 3-day streak', 
        xpReward: 50, 
        gemReward: 15, 
        goal: 3, 
        unlocked: false, 
        getProgress: (user) => user.dayStreak 
    },
    { 
        id: 'streak2', 
        title: 'Consistent Learner', 
        description: 'Reach a 7-day streak', 
        xpReward: 150, 
        gemReward: 50, 
        goal: 7, 
        unlocked: false, 
        getProgress: (user) => user.dayStreak 
    },
    { 
        id: 'level1', 
        title: 'Level 5 Reached', 
        description: 'Reach level 5', 
        xpReward: 100, 
        gemReward: 25, 
        goal: 5, 
        unlocked: false, 
        getProgress: (user) => user.level 
    },
];

export const INITIAL_BORDERS = [
    { 
        id: 'border-blue', 
        name: 'Default Blue', 
        description: 'The classic, reliable blue.', 
        cost: 0, 
        isOwned: true, 
        className: 'ring-blue-500' 
    },
    { 
        id: 'border-gold', 
        name: 'Golden Scholar', 
        description: 'For the high achievers.', 
        cost: 200, 
        isOwned: false, 
        className: 'ring-yellow-400' 
    },
    { 
        id: 'border-neon', 
        name: 'Neon Focus', 
        description: 'Light up your profile with vibrant energy.', 
        cost: 350, 
        isOwned: false, 
        className: 'ring-fuchsia-500' 
    },
    { 
        id: 'border-forest', 
        name: 'Forest Wisdom', 
        description: 'A calm, natural look for deep study.', 
        cost: 350, 
        isOwned: false, 
        className: 'ring-green-500' 
    },
];
