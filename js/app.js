// Main Application File - SmartBuddy.AI
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// Import services
import { 
    sendMessageToAI, 
    breakDownTaskWithAI, 
    generateQuizWithAI, 
    generateStudyPlanWithAI 
} from './services/gemini.js';

// Import utilities
import { 
    formatTime, 
    formatTimeDetailed, 
    getPriorityBorderClass, 
    isToday, 
    formatReminderTime, 
    getMinDateTime, 
    generateUUID
} from './utils/helpers.js';

import { 
    saveProfiles, 
    loadProfiles, 
    saveCurrentUser, 
    loadCurrentUser, 
    saveTheme, 
    loadTheme 
} from './utils/storage.js';

// Import all icons
import * as Icons from './icons.js';

// Import configuration
import { GAME_CONFIG, INITIAL_ACHIEVEMENTS, INITIAL_BORDERS } from '../config.js';

console.log('🚀 SmartBuddy.AI Loading...');

// ============================================================================
// HELPER FUNCTION: Create New Profile
// ============================================================================
const createNewProfile = (id, name, college) => {
    return {
        user: {
            id,
            name,
            college,
            xp: 0,
            level: 1,
            dayStreak: 0,
            gems: 50,
            activeBorderId: 'border-blue',
            mysteryBoxes: 0,
        },
        tasks: [],
        achievements: [...INITIAL_ACHIEVEMENTS],
        profileBorders: [...INITIAL_BORDERS],
    };
};

// ============================================================================
// COMPONENT: Achievement Notification
// ============================================================================
const AchievementNotification = ({ achievement }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 3800);
        return () => clearTimeout(timer);
    }, [achievement]);

    if (!achievement) return null;

    return React.createElement("div", { 
        className: `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-secondary)] border-2 border-yellow-500/50 p-6 rounded-2xl text-center z-[60] transition-all duration-500 ease-in-out shadow-2xl shadow-yellow-500/20 w-80 ${visible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}` 
    },
        React.createElement("div", { className: "text-5xl mb-3 text-yellow-400 flex justify-center" },
            React.createElement(Icons.StarIcon, { className: "w-16 h-16" })
        ),
        React.createElement("h2", { className: "text-xl font-bold text-[var(--text-primary)]" }, "Achievement Unlocked!"),
        React.createElement("p", { className: "text-yellow-300 font-semibold mb-3" }, achievement.title),
        React.createElement("div", { className: "flex justify-center gap-4 text-sm font-semibold" },
            React.createElement("span", { className: "flex items-center gap-1 bg-[var(--bg-tertiary)] px-3 py-1 rounded-full text-blue-300" },
                React.createElement(Icons.XPIcon, { className: "w-4 h-4" }),
                `+${achievement.xpReward} XP`
            ),
            React.createElement("span", { className: "flex items-center gap-1 bg-[var(--bg-tertiary)] px-3 py-1 rounded-full text-cyan-300" },
                React.createElement(Icons.GemIcon, { className: "w-4 h-4" }),
                `+${achievement.gemReward} Gems`
            )
        )
    );
};

// ============================================================================
// COMPONENT: Level Up Notification
// ============================================================================
const LevelUpNotification = ({ level }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, [level]);

    return React.createElement("div", { 
        className: `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-secondary)] text-[var(--text-primary)] p-8 rounded-2xl text-center z-50 transition-all duration-500 ease-in-out border-2 border-[var(--accent-primary)]/50 shadow-2xl shadow-[var(--shadow-color)] ${visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}` 
    },
        React.createElement("div", { className: "text-5xl mb-4" }, "⭐"),
        React.createElement("h2", { className: "text-2xl font-bold mb-2" }, "Level Up!"),
        React.createElement("p", null, "You've reached ", React.createElement("span", { className: "font-bold" }, `Level ${level}`), "!"),
        React.createElement("p", null, "Keep up the amazing work!")
    );
};

// ============================================================================
// COMPONENT: Login Screen
// ============================================================================
const LoginScreen = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1500);
    };

    return React.createElement("div", { className: "flex flex-col justify-center items-center min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center relative overflow-hidden" },
        // Cyber grid background
        React.createElement("div", { className: "absolute inset-0 cyber-grid opacity-30" }),
        
        // Animated gradient mesh
        React.createElement("div", { className: "absolute inset-0 gradient-mesh opacity-20" }),
        
        // Aurora effects
        React.createElement("div", { className: "aurora", style: { top: '10%', left: '10%' } }),
        React.createElement("div", { className: "aurora", style: { bottom: '10%', right: '10%' } }),
        
        // Morphing blobs - responsive sizes
        React.createElement("div", { className: "absolute top-10 sm:top-20 -left-10 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-[var(--accent-primary)]/20 morphing-blob liquid-blob" }),
        React.createElement("div", { className: "absolute bottom-10 sm:bottom-20 -right-10 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-[var(--accent-tertiary)]/20 morphing-blob liquid-blob", style: { animationDelay: '3s' } }),
        
        // Floating particles
        ...Array.from({ length: 10 }, (_, i) => 
            React.createElement("div", { key: `particle-${i}`, className: "particle", style: { bottom: '0' } })
        ),
        
        // Scan line effect
        React.createElement("div", { className: "scan-line" }),
        
        // 3D Prism (simplified CSS version)
        React.createElement("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 prism-3d opacity-20 hidden lg:block" },
            ...Array.from({ length: 6 }, (_, i) => 
                React.createElement("div", { key: `prism-${i}`, className: "prism-face" })
            )
        ),
        
        React.createElement("div", { className: "animate-slide-up-fade relative z-10 w-full max-w-md", style: { animationDelay: '100ms' } },
            React.createElement("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6" },
                React.createElement("div", { className: "relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[var(--gradient-accent-from)] to-[var(--gradient-accent-to)] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[var(--shadow-color)] animate-pulse-glow tilt-card" },
                    React.createElement(Icons.BrainIcon, { className: "w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12" }),
                    // Sparkles around logo
                    React.createElement("div", { className: "sparkle", style: { top: '0', right: '0', animationDelay: '0s' } }),
                    React.createElement("div", { className: "sparkle", style: { bottom: '0', left: '0', animationDelay: '0.5s' } }),
                    React.createElement("div", { className: "sparkle", style: { top: '50%', right: '-10px', animationDelay: '1s' } })
                ),
                React.createElement("h1", { className: "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold holographic neon-text" }, "SmartBuddy.AI")
            ),
            React.createElement("p", { className: "text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] mb-6 sm:mb-8 lg:mb-10 font-medium px-4 animate-float" }, "✨ Level Up Your Learning!")
        ),
        React.createElement("form", { className: "w-full max-w-sm animate-slide-up-fade relative z-10 glass-card tilt-card p-6 sm:p-8 rounded-3xl shadow-large", style: { animationDelay: '300ms' }, onSubmit: handleSubmit },
            React.createElement("div", { className: "mb-5 text-left" },
                React.createElement("label", { htmlFor: "email", className: "block mb-2 font-medium text-[var(--text-primary)]" }, "Email"),
                React.createElement("input", {
                    type: "email",
                    id: "email",
                    placeholder: "Enter your email",
                    required: true,
                    className: "w-full px-4 py-4 border-2 border-[var(--border-primary)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:bg-[var(--bg-tertiary)] focus:ring-2 focus:ring-[var(--accent-primary-ring)] transition-all"
                })
            ),
            React.createElement("div", { className: "mb-5 text-left" },
                React.createElement("label", { htmlFor: "password", className: "block mb-2 font-medium text-[var(--text-primary)]" }, "Password"),
                React.createElement("input", {
                    type: "password",
                    id: "password",
                    placeholder: "Enter your password",
                    required: true,
                    className: "w-full px-4 py-4 border-2 border-[var(--border-primary)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:bg-[var(--bg-tertiary)] focus:ring-2 focus:ring-[var(--accent-primary-ring)] transition-all"
                })
            ),
            React.createElement("button", {
                type: "submit",
                className: "w-full h-16 bg-gradient-to-r from-[var(--gradient-accent-from)] via-[var(--gradient-accent-via)] to-[var(--gradient-accent-to)] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-2xl shadow-[var(--shadow-color)] hover:shadow-[var(--shadow-color-hover)] transition-all hover:scale-[1.05] active:scale-[0.95] disabled:opacity-70 disabled:scale-100 glow-on-hover btn-press relative overflow-hidden",
                disabled: isLoading
            },
                React.createElement("span", { className: "relative z-10" },
                    isLoading ? React.createElement("div", { className: "w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin-smooth" }) : '🚀 Sign In'
                )
            )
        )
    );
};

// I'll continue with more components in the next part...
console.log('📦 Components loading...');

// ============================================================================
// COMPONENT: Bottom Navigation
// ============================================================================
const BottomNav = ({ currentScreen, onNavigate }) => {
    const navItems = [
        { screen: 'dashboard', label: 'Home', icon: React.createElement(Icons.HomeIcon, null) },
        { screen: 'chat', label: 'AI Mentor', icon: React.createElement(Icons.ChatIcon, null) },
        { screen: 'leaderboard', label: 'Ranks', icon: React.createElement(Icons.TrophyIcon, null) },
        { screen: 'rewards', label: 'Rewards', icon: React.createElement(Icons.GiftIcon, null) },
        { screen: 'profile', label: 'Profile', icon: React.createElement(Icons.UserIcon, null) },
    ];
    const activeIndex = navItems.findIndex(item => item.screen === currentScreen);

    return React.createElement("nav", { className: "fixed bottom-0 left-0 right-0 z-50 md:absolute" },
        React.createElement("div", { className: "max-w-md mx-auto p-2" },
            React.createElement("div", { className: "relative flex justify-around bg-[var(--bg-secondary-translucent)] backdrop-blur-lg border border-[var(--border-primary)] rounded-2xl p-2" },
                React.createElement("span", {
                    className: "absolute top-2 left-0 h-[calc(100%-1rem)] w-[20%] bg-[var(--accent-primary)] rounded-xl transition-transform duration-300 ease-in-out",
                    style: { transform: `translateX(${activeIndex * 100}%)` },
                    "aria-hidden": "true"
                }),
                navItems.map((item) => (
                    React.createElement("button", {
                        key: item.screen,
                        onClick: () => onNavigate(item.screen),
                        className: `relative z-10 flex flex-col items-center justify-center gap-1 p-2 w-[20%] h-14 flex-1 transition-colors duration-300 ${currentScreen === item.screen ? 'text-white' : 'text-[var(--text-secondary)] hover:text-white'}`,
                        "aria-current": currentScreen === item.screen
                    },
                        React.createElement("div", { className: "w-6 h-6" }, item.icon),
                        React.createElement("span", { className: "text-xs font-semibold" }, item.label)
                    )
                ))
            )
        )
    );
};

// ============================================================================
// COMPONENT: Simple Dashboard (Placeholder for now)
// ============================================================================
const DashboardScreen = ({ user }) => {
    return React.createElement("div", { className: "py-8" },
        React.createElement("div", { className: "text-center mb-10 animate-slide-up-fade" },
            React.createElement("h2", { className: "text-4xl font-bold mb-3 gradient-text" }, `Welcome Back, ${user.name}! 👋`),
            React.createElement("p", { className: "text-lg text-[var(--text-secondary)]" }, "Ready to level up your learning today?")
        ),
        React.createElement("div", { className: "grid grid-cols-3 gap-4 mb-8" },
            React.createElement("div", { className: "bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border-primary)] card-hover shadow-soft stagger-item" },
                React.createElement("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-3 mx-auto" },
                    React.createElement(Icons.XPIcon, { className: "w-6 h-6 text-blue-400" })
                ),
                React.createElement("div", { className: "text-4xl font-bold text-[var(--text-primary)] mb-1" }, user.xp),
                React.createElement("div", { className: "text-sm text-[var(--text-secondary)] font-medium" }, "Total XP")
            ),
            React.createElement("div", { className: "bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border-primary)] card-hover shadow-soft stagger-item" },
                React.createElement("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl mb-3 mx-auto" },
                    React.createElement(Icons.LevelIcon, { className: "w-6 h-6 text-purple-400" })
                ),
                React.createElement("div", { className: "text-4xl font-bold text-[var(--text-primary)] mb-1" }, user.level),
                React.createElement("div", { className: "text-sm text-[var(--text-secondary)] font-medium" }, "Level")
            ),
            React.createElement("div", { className: "bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border-primary)] card-hover shadow-soft stagger-item" },
                React.createElement("div", { className: "flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-xl mb-3 mx-auto" },
                    React.createElement(Icons.GemIcon, { className: "w-6 h-6 text-cyan-400" })
                ),
                React.createElement("div", { className: "text-4xl font-bold text-[var(--text-primary)] mb-1" }, user.gems),
                React.createElement("div", { className: "text-sm text-[var(--text-secondary)] font-medium" }, "Gems")
            )
        ),
        React.createElement("div", { className: "bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-tertiary)]/10 p-8 rounded-3xl border border-[var(--accent-primary)]/20 text-center animate-slide-up-fade", style: { animationDelay: '200ms' } },
            React.createElement("div", { className: "text-6xl mb-4 animate-float" }, "🚀"),
            React.createElement("h3", { className: "text-2xl font-bold mb-2 text-[var(--text-primary)]" }, "Your Journey Starts Here"),
            React.createElement("p", { className: "text-[var(--text-secondary)] mb-4" }, "Complete tasks, earn XP, and unlock achievements!"),
            React.createElement("div", { className: "flex gap-3 justify-center flex-wrap" },
                React.createElement("span", { className: "px-4 py-2 bg-[var(--bg-secondary)] rounded-full text-sm font-semibold border border-[var(--border-primary)]" }, "📚 Study Tasks"),
                React.createElement("span", { className: "px-4 py-2 bg-[var(--bg-secondary)] rounded-full text-sm font-semibold border border-[var(--border-primary)]" }, "🤖 AI Mentor"),
                React.createElement("span", { className: "px-4 py-2 bg-[var(--bg-secondary)] rounded-full text-sm font-semibold border border-[var(--border-primary)]" }, "🏆 Leaderboard")
            )
        )
    );
};

// ============================================================================
// COMPONENT: Chat Screen (Placeholder)
// ============================================================================
const ChatScreen = () => {
    return React.createElement("div", { className: "text-center py-20" },
        React.createElement(Icons.ChatIcon, { className: "w-16 h-16 mx-auto mb-4 text-[var(--accent-primary)]" }),
        React.createElement("h2", { className: "text-2xl font-bold mb-2" }, "AI Mentor Chat"),
        React.createElement("p", { className: "text-[var(--text-secondary)]" }, "Chat functionality coming soon...")
    );
};

// ============================================================================
// COMPONENT: Leaderboard Screen (Placeholder)
// ============================================================================
const LeaderboardScreen = ({ leaderboard }) => {
    return React.createElement("div", null,
        React.createElement("h3", { className: "text-center text-2xl font-bold mb-6 text-[var(--text-primary)]" }, "Weekly Leaderboard 🏆"),
        React.createElement("div", null,
            leaderboard.map(entry => (
                React.createElement("div", {
                    key: entry.rank,
                    className: `flex items-center gap-4 p-4 rounded-xl mb-3 border transition-all duration-300 ${entry.isCurrentUser ? 'bg-[var(--accent-secondary)]/20 border-[var(--accent-secondary)]' : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'}`
                },
                    React.createElement("div", { className: "w-8 h-8 rounded-full flex items-center justify-center font-bold bg-[var(--bg-quaternary)] text-[var(--text-primary)]" },
                        entry.rank
                    ),
                    React.createElement("div", { className: "w-10 h-10 bg-gradient-to-br from-[var(--gradient-accent-from)] to-[var(--gradient-accent-to)] rounded-full flex items-center justify-center font-bold text-white" },
                        entry.name.charAt(0).toUpperCase()
                    ),
                    React.createElement("div", { className: "flex-1" },
                        React.createElement("p", { className: "font-semibold text-[var(--text-primary)]" }, entry.isCurrentUser ? `${entry.name} (You)` : entry.name),
                        React.createElement("p", { className: "text-sm text-[var(--text-secondary)]" }, entry.college)
                    ),
                    React.createElement("div", { className: "font-bold text-[var(--text-primary)]" },
                        `${entry.xp.toLocaleString()} XP`
                    )
                )
            ))
        )
    );
};

// ============================================================================
// COMPONENT: Rewards Screen (Placeholder)
// ============================================================================
const RewardsScreen = ({ user }) => {
    return React.createElement("div", { className: "text-center py-20" },
        React.createElement(Icons.GiftIcon, { className: "w-16 h-16 mx-auto mb-4 text-[var(--accent-primary)]" }),
        React.createElement("h2", { className: "text-2xl font-bold mb-2" }, "Rewards Store"),
        React.createElement("p", { className: "text-[var(--text-secondary)] mb-4" }, "Coming soon..."),
        React.createElement("div", { className: "text-4xl font-bold text-cyan-400" },
            React.createElement(Icons.GemIcon, { className: "w-8 h-8 inline mr-2" }),
            user.gems, " Gems"
        )
    );
};

// ============================================================================
// COMPONENT: Profile Screen (Placeholder)
// ============================================================================
const ProfileScreen = ({ user, currentTheme, setTheme }) => {
    const themes = [
        { id: 'dark', name: 'Dark' },
        { id: 'light', name: 'Light' },
        { id: 'synthwave', name: 'Synthwave' }
    ];

    return React.createElement("div", null,
        React.createElement("div", { className: "text-center mb-8" },
            React.createElement("div", { className: "w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[var(--gradient-accent-from)] to-[var(--gradient-accent-to)] rounded-full flex items-center justify-center text-white text-4xl font-bold" },
                user.name.charAt(0).toUpperCase()
            ),
            React.createElement("h2", { className: "text-2xl font-bold text-[var(--text-primary)]" }, user.name),
            React.createElement("p", { className: "text-[var(--text-secondary)]" }, user.college)
        ),
        React.createElement("div", { className: "mb-6" },
            React.createElement("h3", { className: "text-xl font-bold mb-4 text-[var(--text-primary)]" }, "Appearance"),
            React.createElement("div", { className: "grid grid-cols-3 gap-4" },
                themes.map(t => (
                    React.createElement("button", {
                        key: t.id,
                        onClick: () => setTheme(t.id),
                        className: `p-4 rounded-lg border-2 transition-all ${currentTheme === t.id ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'border-[var(--border-secondary)]'}`
                    },
                        React.createElement("p", { className: "font-medium" }, t.name)
                    )
                ))
            )
        )
    );
};

// ============================================================================
// COMPONENT: Main App
// ============================================================================
const MainApp = ({ 
    user, 
    currentScreen, 
    setCurrentScreen, 
    leaderboard,
    theme,
    setTheme
}) => {
    const renderScreen = () => {
        switch (currentScreen) {
            case 'dashboard':
                return React.createElement(DashboardScreen, { user });
            case 'chat':
                return React.createElement(ChatScreen);
            case 'leaderboard':
                return React.createElement(LeaderboardScreen, { leaderboard });
            case 'rewards':
                return React.createElement(RewardsScreen, { user });
            case 'profile':
                return React.createElement(ProfileScreen, { user, currentTheme: theme, setTheme });
            default:
                return React.createElement(DashboardScreen, { user });
        }
    };

    return React.createElement("div", { className: "app-container w-full min-h-screen max-w-full mx-auto flex flex-col relative md:max-w-md md:border-x-2 md:border-[var(--border-primary)]" },
        React.createElement("header", { className: "sticky top-0 z-30 bg-[var(--bg-header)] backdrop-blur-lg p-5 flex items-center justify-between gap-4 border-b border-[var(--border-primary)]" },
            React.createElement("div", { className: "flex items-center gap-4" },
                React.createElement("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-[var(--gradient-accent-from)] to-[var(--gradient-accent-to)] flex items-center justify-center text-white text-xl font-bold" },
                    user.name.charAt(0).toUpperCase()
                ),
                React.createElement("div", null,
                    React.createElement("p", { className: "text-lg font-bold text-[var(--text-primary)]" }, `Welcome, ${user.name}!`),
                    React.createElement("p", { className: "text-sm text-[var(--text-secondary)] font-medium" }, user.college)
                )
            ),
            React.createElement("div", { className: "flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-3 py-1.5 rounded-full" },
                React.createElement(Icons.GemIcon, { className: "w-5 h-5 text-cyan-400" }),
                React.createElement("span", { className: "font-bold text-[var(--text-primary)]" }, user.gems)
            )
        ),
        React.createElement("main", { className: "flex-1 pb-32 overflow-y-auto" },
            React.createElement("div", { className: "p-5" },
                renderScreen()
            )
        ),
        React.createElement(BottomNav, { currentScreen, onNavigate: setCurrentScreen })
    );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
const App = () => {
    // Initial clean profile - starts fresh
    const defaultUserId = 'user-default';
    const initialProfiles = {
        [defaultUserId]: createNewProfile(defaultUserId, 'Student', 'My University')
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profiles, setProfiles] = useState(initialProfiles);
    const [currentUserId, setCurrentUserId] = useState(defaultUserId);
    const [currentScreen, setCurrentScreen] = useState('dashboard');
    const [theme, setThemeState] = useState('dark');
    const [levelUpInfo, setLevelUpInfo] = useState(null);
    const [unlockedAchievement, setUnlockedAchievement] = useState(null);

    const currentProfile = profiles[currentUserId];
    const { user } = currentProfile;

    // Theme management
    const setTheme = (selectedTheme) => {
        document.documentElement.setAttribute('data-theme', selectedTheme);
        setThemeState(selectedTheme);
        saveTheme(selectedTheme);
    };

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = loadTheme();
        setTheme(savedTheme);
    }, []);

    // Clear old data and start fresh (one-time cleanup)
    useEffect(() => {
        // Clear any old demo data from previous version
        const hasCleared = localStorage.getItem('smartbuddy_data_cleared_v2');
        if (!hasCleared) {
            localStorage.clear();
            localStorage.setItem('smartbuddy_data_cleared_v2', 'true');
            console.log('🗑️ Old data cleared - starting fresh!');
        }
        
        // Load saved data if exists
        const savedProfiles = loadProfiles();
        const savedUserId = loadCurrentUser();
        
        if (savedProfiles && Object.keys(savedProfiles).length > 0) {
            setProfiles(savedProfiles);
            if (savedUserId && savedProfiles[savedUserId]) {
                setCurrentUserId(savedUserId);
            }
        }
    }, []);

    // Save data when profiles change
    useEffect(() => {
        saveProfiles(profiles);
        saveCurrentUser(currentUserId);
    }, [profiles, currentUserId]);

    // Create leaderboard
    const leaderboard = Object.values(profiles)
        .map(p => p.user)
        .sort((a, b) => b.xp - a.xp)
        .map((u, index) => ({
            rank: index + 1,
            name: u.name,
            college: u.college,
            xp: u.xp,
            isCurrentUser: u.id === currentUserId,
        }));

    if (!isLoggedIn) {
        return React.createElement(LoginScreen, { onLogin: () => setIsLoggedIn(true) });
    }

    if (!currentProfile) {
        return React.createElement("div", { className: "flex items-center justify-center min-h-screen" }, 
            "Loading Profile..."
        );
    }

    return React.createElement(React.Fragment, null,
        React.createElement(MainApp, { 
            user,
            currentScreen,
            setCurrentScreen,
            leaderboard,
            theme,
            setTheme
        }),
        levelUpInfo && React.createElement(LevelUpNotification, { level: levelUpInfo.level }),
        unlockedAchievement && React.createElement(AchievementNotification, { achievement: unlockedAchievement })
    );
};

// ============================================================================
// RENDER APP
// ============================================================================
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    React.createElement(React.StrictMode, null, React.createElement(App, null))
);

console.log('✅ SmartBuddy.AI Loaded Successfully!');
console.log('💡 Tip: Update your API key in config.js to enable AI features');
