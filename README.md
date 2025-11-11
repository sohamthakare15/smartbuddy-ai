# SmartBuddy.AI 🧠✨

A gamified AI-powered study companion for university students. Level up your learning with task management, AI mentorship, and engaging rewards!

## 🚀 Project Structure

```
smartbuddy-ai/
├── index.html              # Main HTML entry point
├── styles.css              # All CSS styles and animations
├── config.js               # Configuration and constants
├── README.md               # This file
│
└── js/
    ├── icons.js            # All SVG icon components
    ├── app.js              # Main application (components + logic)
    │
    ├── services/
    │   └── gemini.js       # Google Gemini AI integration
    │
    └── utils/
        ├── storage.js      # LocalStorage helpers
        └── helpers.js      # Utility functions
```

## 🛠️ Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 2. Configure the App

Open `config.js` and replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
export const API_CONFIG = {
    GEMINI_API_KEY: 'your-actual-api-key-here',
    MODEL_NAME: 'gemini-2.5-flash'
};
```

### 3. Run the App

Since this uses ES modules, you need to serve it through a local server:

**Option 1: Using Python**
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

**Option 2: Using Node.js**
```bash
npx serve
# Then open the URL shown
```

**Option 3: Using VS Code**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## ✨ Features

- **Task Management**: Create, track, and complete study tasks with XP rewards
- **AI Mentor**: Chat with AI in 3 personalities (Mentor, Funny, Strict)
- **Gamification**: XP, levels, achievements, gems, and mystery boxes
- **Multi-Profile**: Switch between different user profiles
- **Study Tools**: Built-in timer, AI-generated quizzes, study plans
- **Themes**: Dark, Light, and Synthwave modes
- **Leaderboard**: Compete with other profiles

## 🐛 Known Issues (To Be Fixed)

1. **API Key**: Currently client-side (needs backend proxy for security)
2. **Data Persistence**: Uses localStorage (needs database integration)
3. **Parent Task Logic**: Subtask completion doesn't auto-complete parent
4. **Day Streak**: Not automatically incrementing
5. **Achievement Stacking**: Multiple achievements show only last one

## 📝 Development Roadmap

### Phase 1: Bug Fixes (Current)
- [ ] Fix API key security
- [ ] Add proper data persistence
- [ ] Fix parent/subtask logic
- [ ] Implement day streak tracking
- [ ] Fix achievement notifications

### Phase 2: Core Features
- [ ] User authentication
- [ ] Database integration (Firebase/Supabase)
- [ ] Real-time leaderboard
- [ ] Push notifications for reminders

### Phase 3: Enhanced Features
- [ ] Study analytics dashboard
- [ ] Pomodoro timer
- [ ] Flashcard system
- [ ] Social features (friends, groups)

### Phase 4: Polish
- [ ] Mobile app (React Native/PWA)
- [ ] Accessibility improvements
- [ ] Multi-language support
- [ ] Performance optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 🙏 Acknowledgments

- Built with React 19
- Powered by Google Gemini AI
- Styled with Tailwind CSS

---

**Note**: This is a refactored version. The original single-file version is preserved as `index.html`.
