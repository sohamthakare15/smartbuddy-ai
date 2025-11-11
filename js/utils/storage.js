// LocalStorage utility functions

const STORAGE_KEYS = {
    PROFILES: 'smartbuddy_profiles',
    CURRENT_USER: 'smartbuddy_current_user',
    THEME: 'smartbuddy_theme'
};

export const saveProfiles = (profiles) => {
    try {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
        return true;
    } catch (error) {
        console.error('Error saving profiles:', error);
        return false;
    }
};

export const loadProfiles = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading profiles:', error);
        return null;
    }
};

export const saveCurrentUser = (userId) => {
    try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
        return true;
    } catch (error) {
        console.error('Error saving current user:', error);
        return false;
    }
};

export const loadCurrentUser = () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
        console.error('Error loading current user:', error);
        return null;
    }
};

export const saveTheme = (theme) => {
    try {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        return true;
    } catch (error) {
        console.error('Error saving theme:', error);
        return false;
    }
};

export const loadTheme = () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    } catch (error) {
        console.error('Error loading theme:', error);
        return 'dark';
    }
};

export const clearAllData = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
};
