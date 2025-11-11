import { useState, useEffect, useRef } from 'react';
import Prism from './components/Prism';
import TextType from './components/TextType';
import * as Icons from './icons';
import { GAME_CONFIG, INITIAL_ACHIEVEMENTS, INITIAL_BORDERS } from './config';
import { 
    saveProfiles, 
    loadProfiles, 
    saveCurrentUser, 
    loadCurrentUser, 
    saveTheme, 
    loadTheme 
} from './utils/storage';

console.log('🚀 SmartBuddy.AI Loading with Vite...');

// Helper function to create new profile
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

// Login Screen with Prism Effect
const LoginScreen = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1500);
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center relative overflow-hidden">
            {/* Prism Background Effect */}
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                width: '100%', 
                height: '100%',
                opacity: 0.6,
                zIndex: 0
            }}>
                <Prism
                    animationType="rotate"
                    timeScale={0.5}
                    height={3.5}
                    baseWidth={5.5}
                    scale={3.6}
                    hueShift={0}
                    colorFrequency={1}
                    noise={0.5}
                    glow={1}
                />
            </div>
            
            {/* Content */}
            <div className="animate-slide-up-fade relative z-10 w-full max-w-md" style={{ animationDelay: '100ms' }}>
                <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text">
                        SmartBuddy.AI
                    </h1>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-[var(--text-secondary)] mb-6 sm:mb-8 lg:mb-10 font-medium px-4">
                    <TextType
                        text={["Level Up Your Learning!", "Master New Skills!", "Achieve Your Goals!"]}
                        typingSpeed={75}
                        pauseDuration={1500}
                        showCursor={true}
                        cursorCharacter="|"
                        loop={true}
                    />
                </div>
            </div>

            <div className="w-full max-w-sm animate-slide-up-fade relative z-10 glass-card p-6 sm:p-8 rounded-3xl shadow-large" style={{ animationDelay: '300ms' }}>
                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-[var(--bg-secondary)] p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                            activeTab === 'login'
                                ? 'bg-gradient-to-r from-[var(--gradient-accent-from)] to-[var(--gradient-accent-to)] text-white shadow-lg'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                            activeTab === 'signup'
                                ? 'bg-gradient-to-r from-[var(--gradient-accent-from)] to-[var(--gradient-accent-to)] text-white shadow-lg'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="transition-all duration-500 ease-in-out">
                    {/* Name field - only for signup */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        activeTab === 'signup' ? 'max-h-32 opacity-100 mb-5' : 'max-h-0 opacity-0 mb-0'
                    }`}>
                        <div className="text-left">
                            <label htmlFor="name" className="block mb-2 font-medium text-[var(--text-primary)]">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your name"
                                required={activeTab === 'signup'}
                                className="w-full px-4 py-4 border-2 border-[var(--border-primary)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:bg-[var(--bg-tertiary)] focus:ring-2 focus:ring-[var(--accent-primary-ring)] transition-all"
                            />
                        </div>
                    </div>

                    <div className="mb-5 text-left">
                        <label htmlFor="email" className="block mb-2 font-medium text-[var(--text-primary)]">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-4 border-2 border-[var(--border-primary)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:bg-[var(--bg-tertiary)] focus:ring-2 focus:ring-[var(--accent-primary-ring)] transition-all"
                        />
                    </div>

                    <div className="mb-5 text-left">
                        <label htmlFor="password" className="block mb-2 font-medium text-[var(--text-primary)]">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-4 border-2 border-[var(--border-primary)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:bg-[var(--bg-tertiary)] focus:ring-2 focus:ring-[var(--accent-primary-ring)] transition-all"
                        />
                    </div>

                    {/* Confirm Password - only for signup */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        activeTab === 'signup' ? 'max-h-32 opacity-100 mb-5' : 'max-h-0 opacity-0 mb-0'
                    }`}>
                        <div className="text-left">
                            <label htmlFor="confirmPassword" className="block mb-2 font-medium text-[var(--text-primary)]">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                required={activeTab === 'signup'}
                                className="w-full px-4 py-4 border-2 border-[var(--border-primary)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:bg-[var(--bg-tertiary)] focus:ring-2 focus:ring-[var(--accent-primary-ring)] transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-16 bg-gradient-to-r from-[var(--gradient-accent-from)] via-[var(--gradient-accent-via)] to-[var(--gradient-accent-to)] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-2xl shadow-[var(--shadow-color)] hover:shadow-[var(--shadow-color-hover)] transition-all hover:scale-[1.05] active:scale-[0.95] disabled:opacity-70 disabled:scale-100 glow-on-hover btn-press relative overflow-hidden"
                        disabled={isLoading}
                    >
                        <span className="relative z-10">
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin-smooth" />
                            ) : (
                                activeTab === 'login' ? 'Sign In' : 'Create Account'
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

// Simple Dashboard
const DashboardScreen = ({ user }) => {
    return (
        <div className="py-8">
            <div className="text-center mb-10 animate-slide-up-fade">
                <h2 className="text-4xl font-bold mb-3 gradient-text">
                    Welcome Back, {user.name}! 👋
                </h2>
                <p className="text-lg text-[var(--text-secondary)]">
                    Ready to level up your learning today?
                </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border-primary)] card-hover shadow-soft">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-3 mx-auto">
                        <Icons.XPIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-4xl font-bold text-[var(--text-primary)] mb-1">{user.xp}</div>
                    <div className="text-sm text-[var(--text-secondary)] font-medium">Total XP</div>
                </div>
                <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border-primary)] card-hover shadow-soft">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl mb-3 mx-auto">
                        <Icons.LevelIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-4xl font-bold text-[var(--text-primary)] mb-1">{user.level}</div>
                    <div className="text-sm text-[var(--text-secondary)] font-medium">Level</div>
                </div>
                <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border-primary)] card-hover shadow-soft">
                    <div className="flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-xl mb-3 mx-auto">
                        <Icons.GemIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-4xl font-bold text-[var(--text-primary)] mb-1">{user.gems}</div>
                    <div className="text-sm text-[var(--text-secondary)] font-medium">Gems</div>
                </div>
            </div>
        </div>
    );
};

// Main App
function App() {
    const defaultUserId = 'user-default';
    const initialProfiles = {
        [defaultUserId]: createNewProfile(defaultUserId, 'Student', 'My University')
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profiles, setProfiles] = useState(initialProfiles);
    const [currentUserId, setCurrentUserId] = useState(defaultUserId);
    const [theme, setThemeState] = useState('dark');

    const currentProfile = profiles[currentUserId];
    const { user } = currentProfile;

    const setTheme = (selectedTheme) => {
        document.documentElement.setAttribute('data-theme', selectedTheme);
        setThemeState(selectedTheme);
        saveTheme(selectedTheme);
    };

    useEffect(() => {
        const savedTheme = loadTheme();
        setTheme(savedTheme);
    }, []);

    if (!isLoggedIn) {
        return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <div className="app-container w-full min-h-screen max-w-full mx-auto flex flex-col relative md:max-w-md md:border-x-2 md:border-[var(--border-primary)]">
            <header className="sticky top-0 z-30 bg-[var(--bg-header)] backdrop-blur-lg p-5 flex items-center justify-between gap-4 border-b border-[var(--border-primary)]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--gradient-accent-from)] to-[var(--gradient-accent-to)] flex items-center justify-center text-white text-xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-[var(--text-primary)]">
                            Welcome, {user.name}!
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] font-medium">
                            {user.college}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-3 py-1.5 rounded-full">
                    <Icons.GemIcon className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-[var(--text-primary)]">{user.gems}</span>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <div className="p-5">
                    <DashboardScreen user={user} />
                </div>
            </main>
        </div>
    );
}

export default App;

console.log('✅ SmartBuddy.AI Loaded with Prism Effect!');
