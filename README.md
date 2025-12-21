# Educational Quiz Mobile App

A gamified learning platform built with React Native and Expo, featuring student, teacher, and parent portals with comprehensive quiz, study features, and AI-powered learning.

## 🚀 Features

### 🎓 Student Features

#### Authentication & Profile
- **Student Login**: Avatar selection and profile creation
- **Profile Customization**: Choose from 8 unique avatars
- **Class Selection**: Select your class (1-12)
- **Persistent Login**: Stay logged in across sessions
- **Unique Student ID**: Automatically generated ID for parent linking

#### Learning Dashboard
- **Personal Stats Display**:
  - Total XP (Experience Points)
  - Coins earned
  - Current streak (consecutive days)
- **Subject Navigation**: Quick access to all subjects based on class
- **Daily Challenge**: Featured challenge with gradient button
- **Badge Preview**: View earned and locked badges
- **Quick Actions**: Access to leaderboard, achievements, and challenges

#### Learning Modes

##### 📚 Study Mode (Flashcard Learning)
- Interactive flashcard system
- Card flip animation for answers
- Progress tracking (Known, Review, Remaining cards)
- Mark cards as "Known" or "Needs Review"
- XP rewards: **5 XP per card**
- Reset functionality
- Completion celebration with confetti

##### 📝 Quiz Mode (Practice Quiz)
- Multiple choice questions (4 options)
- Instant answer feedback:
  - ✅ Green highlight for correct answers
  - ❌ Red highlight for wrong answers
- Progress tracking bar
- Score calculation and display
- Rewards:
  - **10 XP per correct answer**
  - **2 Coins per correct answer**
- Badge unlock system
- Results screen with performance summary

##### ⏱️ Timed Quiz (Challenge Mode)
- 20-second countdown per question
- Auto-advance on timeout
- Visual timer with color warnings:
  - Green: >10 seconds
  - Yellow: 5-10 seconds
  - Red: <5 seconds
- Shuffled questions (max 10 questions)
- Enhanced rewards:
  - **15 XP per correct answer**
  - **3 Coins per correct answer**
- Total time tracking
- Performance-based results

#### Gamification

##### 🏆 Achievements & Badges
- Badge collection system
- Progress tracking for locked badges
- Badge categories:
  - Quick Learner (Fast quiz completion)
  - Perfect Score (100% accuracy)
  - Study Streak (Consecutive days)
  - Quiz Master (Multiple quizzes completed)
- Colored progress bars
- Badge unlock modal with celebration

##### 📊 Leaderboard
- Global ranking system
- Top 3 podium display with medals (🥇🥈🥉)
- Student rankings with:
  - Avatar display
  - XP points
  - Current streak
  - Rank position
- Personal rank highlighting

#### Subject Pages
- Subject-specific learning
- Subject statistics:
  - Questions completed
  - Best score
  - Study time
- Access to all three learning modes per subject
- Clean, modern UI with subject icons

#### 🛍️ Avatar Shop (NEW)
- **Customization Store**: Buy accessories with earned coins
- **Categories**:
  - Hats (Party Hat, Crown, Wizard Hat, Graduation Cap)
  - Glasses (Cool Shades, Nerd Glasses)
  - Backgrounds (Rainbow, Stars, Fire)
  - Frames (Gold Frame, Diamond Frame)
- **Rarity System**: Common, Rare, Epic, Legendary items
- **Pricing**: 40-300 coins based on rarity
- **Purchase History**: Track owned items
- **Earn Coins Guide**: Tips on earning more coins

#### 🏆 Weekly & Monthly Challenges (NEW)
- **Challenge Types**:
  - Weekly Challenges (7-day duration)
  - Monthly Challenges (30-day duration)
  - Special Events (limited time)
- **Sample Challenges**:
  - Math Week Champion (10 quizzes with 80%+)
  - Science Explorer (20 flashcards)
  - Perfect Streak (7-day streak)
  - Quiz Master (50 quizzes monthly)
  - All-Round Scholar (90%+ in all subjects)
- **Rewards System**:
  - XP rewards: 150-2000 XP
  - Coin rewards: 30-500 coins
- **Progress Tracking**: Visual progress bars
- **Countdown Timer**: Days remaining display
- **Completion Badges**: Special markers for completed challenges

### 👩‍🏫 Teacher Features

#### Authentication
- **Teacher Login**: PIN-based authentication (4 digits)
- **Create Account**: New teacher registration
- **Teacher Selection**: Choose from existing teachers
- **Secure PIN**: Numeric PIN validation

#### Teacher Dashboard

##### Class Management
- **Class Selector**: Switch between classes 1-12
- **Interactive Tabs**: Visual selection of active class

##### Analytics & Statistics
- **Student Count**: Total students in selected class
- **Average Score**: Class performance metric
- **Quizzes Taken**: Total quiz attempts
- **Active Students**: Students who have taken quizzes

##### Student Insights
- **Top Performer Display**: Best student showcase with:
  - Trophy icon
  - Student name
  - Total XP
  - Current streak
- **Student List**: Complete class roster with:
  - Avatar display
  - Student names
  - XP points
  - Streak days
  - Top 3 medals (🥇🥈🥉)
  - Sorted by XP (highest to lowest)

##### Subject Performance
- **Subject Overview Grid**: All subjects for selected class
- **Performance Metrics**:
  - Average score per subject
  - Total attempts
  - Color-coded progress bars:
    - Green: ≥70%
    - Yellow: 50-69%
    - Red: <50%
  - "No data yet" for subjects without attempts

##### Quiz Management
- **PDF Upload Section**: Upload and generate quizzes (Coming Soon)
- **Quiz List**: View generated quizzes
- **Empty States**: User-friendly messaging when no data

### 👨‍👩‍👧 Parent Features (NEW)

#### Authentication
- **Parent Login**: PIN-based authentication linked to child
- **Create Account**: Register as parent with child's Student ID
- **Secure Access**: 4-digit PIN protection
- **Child Linking**: Connect to student profile using unique ID

#### Parent Dashboard

##### Child Overview
- **Profile Display**: Child's avatar, name, and class
- **Quick Stats Card**:
  - Total XP earned
  - Current streak
  - Beautiful gradient card design

##### Analytics & Insights
- **Performance Metrics**:
  - Quizzes Taken
  - Average Score (%)
  - Minutes Studied
  - Subjects Practiced
- **Period Selection**: View weekly or monthly data

##### Strengths & Weaknesses
- **Top Subjects**: Display child's strongest subjects
  - Subject icons
  - Average score with green progress bar
  - Number of attempts
- **Needs Improvement**: Highlight weak areas
  - Orange-themed cards
  - Performance metrics
  - Quiz attempt count

##### Recommendations
- **Smart Suggestions**:
  - Keep up the streak
  - Focus on weak subjects
  - Celebrate achievements
- **Action-oriented tips**: Help parents support learning

##### Recent Activity Monitoring (NEW)
- **Real-time Activity Feed**: View all child activities
  - Quiz completions with scores
  - Study sessions
  - Achievements unlocked
  - Daily challenges completed
- **Activity Details**:
  - Subject-specific performance
  - XP and coins earned per activity
  - Time spent on each activity
  - Time ago indicators
- **Activity Types**: Quiz, Study, Achievement, Daily Challenge
- **Empty State**: Helpful messages when no activity

#### Notifications System (NEW)
- **Daily Summary Notifications**: Automatic updates on child's daily progress
- **Achievement Alerts**: Instant notifications when child earns badges
- **Low Performance Warnings**: Alerts when scores drop below 50%
- **Streak Milestones**: Celebrate consecutive learning days (7+ days)
- **Quiz Completion Updates**: Notifications for each quiz completed
- **Notification Management**:
  - Mark individual notifications as read
  - Mark all as read
  - Filter by all/unread
  - Visual unread indicators
- **Smart Notification Types**:
  - 📊 Daily Summary
  - 🏆 Achievement
  - 📉 Low Performance
  - 🔥 Streak Milestone
  - ✅ Quiz Completed

### 🎨 UI/UX Features

#### Design System
- **Clean Modern Design**: Consistent with web app
- **White Card Layouts**: Clean backgrounds with subtle borders
- **Color Coding**:
  - Purple: XP and primary actions
  - Orange: Streaks and secondary actions
  - Green: Success states
  - Blue: Information
  - Red: Errors and warnings
- **Rounded Corners**: Modern 2xl rounded corners
- **Icon System**: Lucide React Native icons
- **Responsive Layout**: Optimized for mobile screens

#### Navigation
- **File-based Routing**: Expo Router for seamless navigation
- **Tab Navigation**: Easy switching between features
- **Safe Areas**: Edge-safe layouts for all devices
- **Back Navigation**: Consistent back button behavior

#### User Experience
- **Loading States**: Smooth transitions
- **Empty States**: Helpful messages when no data
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Smooth Animations**: Card flips, progress bars, celebrations

### 🔧 Technical Features

#### State Management
- **Context API**: Global app state (AppContext)
- **Custom Hooks**:
  - `useBadges`: Badge management and unlocking
  - `useApp`: Access to app state
  - `useAsyncStorage`: Persistent storage

#### Data Layer
- **Sample Questions**: Pre-loaded quiz questions
- **Subjects Database**: All subjects for classes 1-12
- **Avatars**: 8 unique avatar options
- **Badge System**: Comprehensive achievement tracking

#### Performance
- **useMemo Optimization**: Efficient data filtering
- **Lazy Loading**: Load data as needed
- **Efficient Re-renders**: Optimized component updates

#### Components
- **Reusable UI Components**:
  - Button
  - Input (with backspace fix)
  - Card
  - StatCard (with colored variants)
  - SubjectCard
  - AvatarDisplay
  - BadgeUnlockModal
- **Shared Components**: Consistent across app

## 📱 Supported Features

### Student Portal
✅ Student Login & Registration  
✅ Avatar Selection  
✅ Class Selection (1-12)  
✅ Student Dashboard with Stats  
✅ Study Mode (Flashcards)  
✅ Quiz Mode (MCQ Practice)  
✅ Timed Quiz (Challenge)  
✅ Achievements & Badges  
✅ Leaderboard  
✅ Subject-specific Learning  
✅ XP & Coins System  
✅ Streak Tracking  
✅ Daily Challenge  
✅ **Avatar Shop** (NEW)  
✅ **Weekly & Monthly Challenges** (NEW)  

### Teacher Portal
✅ Teacher Login & Registration  
✅ PIN Authentication  
✅ Teacher Dashboard  
✅ Class Selection (1-12)  
✅ Student Management  
✅ Class Analytics  
✅ Subject Performance Tracking  
✅ Top Performer Display  
✅ Student Rankings  
⏳ Quiz Management (Coming Soon)  
⏳ PDF Upload & Quiz Generation (Coming Soon)  
⏳ **AI-Powered Quiz Generator** (Planned)  
⏳ **Assignment & Homework Module** (Planned)  
⏳ **Export Reports (PDF/Excel)** (Planned)  

### Parent Portal (NEW)
✅ Parent Login & Registration  
✅ PIN-based Secure Access  
✅ Child Profile Linking with Student ID  
✅ Performance Dashboard  
✅ Strengths & Weaknesses Analysis  
✅ Weekly/Monthly Progress View  
✅ Smart Recommendations  
✅ **Real-time Activity Monitoring** (NEW)  
✅ **Notification System** (NEW)  
✅ **Daily Progress Updates** (NEW)  
✅ **Achievement Alerts** (NEW)  
✅ **Low Performance Warnings** (NEW)  
⏳ **Weekly Progress Reports (Email/SMS)** (Planned)  
⏳ **Parent-Teacher Messaging** (Planned)  

## 🎯 Gamification Elements

### Rewards System
- **XP (Experience Points)**:
  - Study Mode: 5 XP per card
  - Quiz Mode: 10 XP per correct answer
  - Timed Quiz: 15 XP per correct answer

- **Coins**:
  - Quiz Mode: 2 coins per correct answer
  - Timed Quiz: 3 coins per correct answer

- **Streaks**: Track consecutive learning days

### Badges & Achievements
- Quick Learner
- Perfect Score
- Study Streak
- Quiz Master
- More badges unlock as you progress

### Leaderboard
- Global XP-based ranking
- Visual podium for top 3
- Personal rank highlighting
- Streak display

### Avatar Customization (NEW)
- **Shop System**: Spend coins on cosmetics
- **Rarity Tiers**: Common → Rare → Epic → Legendary
- **Item Categories**: Hats, Glasses, Backgrounds, Frames
- **Visual Feedback**: Owned items marked with checkmark
- **Coin Economy**: Earn through quizzes, spend in shop

### Challenges System (NEW)
- **Weekly Challenges**: Reset every 7 days
- **Monthly Challenges**: Long-term goals
- **Special Events**: Limited-time competitions
- **Progressive Rewards**: Higher rewards for difficult challenges
- **Visual Progress**: Colored progress bars
- **Competitive Elements**: Class vs Class (planned)

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **Language**: TypeScript
- **Icons**: Lucide React Native
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **UI Components**: Custom component library

## 📦 Project Structure

```
mobile/
├── app/                          # Expo Router pages
│   ├── (auth)/                  # Authentication screens
│   │   ├── role-selection.tsx   # Choose Student/Teacher/Parent
│   │   ├── student-login.tsx    # Student login & signup
│   │   ├── teacher-login.tsx    # Teacher login & signup
│   │   └── parent-login.tsx     # Parent login & signup (NEW)
│   ├── (dashboard)/             # Dashboard screens
│   │   ├── student-dashboard.tsx
│   │   ├── teacher-dashboard.tsx
│   │   ├── parent-dashboard.tsx  # (NEW)
│   │   └── subject.tsx
│   └── (features)/              # Feature screens
│       ├── achievements.tsx
│       ├── leaderboard.tsx
│       ├── study-mode.tsx
│       ├── quiz-mode.tsx
│       ├── timed-quiz.tsx
│       ├── daily-challenge.tsx
│       ├── avatar-shop.tsx       # (NEW)
│       ├── weekly-challenges.tsx  # (NEW)
│       └── parent-notifications.tsx # (NEW)
├── components/
│   ├── shared/                  # Shared components
│   │   ├── StatCard.tsx
│   │   ├── SubjectCard.tsx
│   │   └── AvatarDisplay.tsx
│   └── ui/                      # Base UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── Label.tsx
├── contexts/
│   └── AppContext.tsx           # Global state (updated with Parent support)
├── data/
│   ├── avatars.ts              # Avatar data
│   ├── subjects.ts             # Subject definitions
│   └── sampleQuestions.ts      # Quiz questions
├── hooks/
│   ├── useBadges.ts            # Badge logic
│   └── useAsyncStorage.ts      # Storage hook
├── lib/
│   ├── utils.ts                # Helper functions
│   └── api.ts                  # API calls
└── types/
    └── index.ts                # TypeScript types (ParentProfile, ActivityLog, Notification added)
```

## 🎨 Design Philosophy

- **Clean & Modern**: Minimalist design with focus on usability
- **Consistent**: Matching web app design language
- **Intuitive**: Easy navigation and clear CTAs
- **Engaging**: Gamification elements keep users motivated
- **Accessible**: Clear typography and color contrast
- **Mobile-First**: Optimized for touch and small screens

## 🔄 Recent Updates

- ✅ **Parent Monitoring System**: Real-time activity tracking and notifications
- ✅ **Student ID System**: Unique IDs for parent-child linking
- ✅ **Activity Logging**: All student activities tracked for parent viewing
- ✅ **Smart Notifications**: Daily summaries, achievements, and performance alerts
- ✅ **Parent Portal Added**: Complete parent dashboard with child tracking
- ✅ **Avatar Shop**: Customization store with coin-based purchases
- ✅ **Weekly & Monthly Challenges**: Competitive challenges with rewards
- ✅ Complete UI redesign matching web app
- ✅ Fixed backspace input issue
- ✅ Added Teacher Dashboard features
- ✅ Implemented all three learning modes
- ✅ Added Quiz Management section
- ✅ Fixed React hooks errors
- ✅ Enhanced badge unlock system
- ✅ Improved leaderboard design
- ✅ Fixed navigation safety (canGoBack pattern)

## 🚀 Planned Features (Roadmap)

### Phase 1: Smart Learning (Current Focus)
- 🔄 **AI-Powered Quiz Generator**: Upload PDFs → Auto-generate MCQs and flashcards
- 🔄 **Adaptive Learning Engine**: Track weak topics and adjust difficulty
- 🔄 **Offline Mode**: Download quizzes and sync progress later
- ⏳ **Voice-Based Learning**: Text-to-speech and speech-to-text support

### Phase 2: Advanced Features
- ⏳ **Live Quiz Battles**: Real-time multiplayer quizzes (like Kahoot)
- ⏳ **Doubt Solver**: AI chatbot + teacher messaging hybrid
- ⏳ **Skill Tree System**: Visual progression tree for each subject
- ⏳ **Assignment Module**: Teachers assign homework with deadlines
- ⏳ **Export Reports**: PDF/Excel reports for parent-teacher meetings

### Phase 3: Scale & Innovation
- ⏳ **Cloud Sync**: Firebase/Supabase for multi-device access
- ⏳ **Multilingual Support**: Tamil, Hindi, English
- ⏳ **Anti-Cheat System**: Randomized questions, time anomaly detection
- ⏳ **AR Learning**: 3D visualizations for science concepts
- ⏳ **Emotional AI**: Detect frustration and adapt difficulty

### Feature Highlights by Impact

#### 🔥 MUST-ADD (High Impact)
1. **AI Quiz Generator**: Game-changing feature for teachers
2. **Adaptive Learning**: Personalizes difficulty based on performance
3. **Parent Dashboard**: ✅ **COMPLETED** - Differentiates from competitors
4. **Offline Mode**: Critical for rural India

#### 🚀 ADVANCED (Medium Impact)
5. **Voice Learning**: Accessibility + younger students
6. **Live Battles**: Social learning engagement
7. **Doubt Solver**: 24/7 AI support
8. **Skill Tree**: Gamification 2.0

#### 🧠 SMART UPGRADES
9. **Custom Avatars**: ✅ **COMPLETED** - Coin economy value
10. **Weekly Challenges**: ✅ **COMPLETED** - Competition & motivation

## 📝 Notes

- All student and teacher data is stored locally using AsyncStorage
- Quiz questions are pre-loaded from sample data
- Subjects automatically adjust based on selected class (1-12)
- Badge unlocking is event-driven based on achievements
- XP and coins accumulate across all activities

---

**Made with ❤️ for education**
