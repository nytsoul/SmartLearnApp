// Student Profile
export interface StudentProfile {
    id: string;
    name: string;
    standard: number;
    avatar: string;
    coins: number;
    xp: number;
    streak: number;
    badges: Badge[];
    createdAt: string;
    lastActive: string;
    dailyChallengeCompleted?: boolean;
    quizzesTaken?: number;
    timedQuizzesTaken?: number;
    flashcardsReviewed?: number;
    perfectScore?: boolean;
}

// Teacher Profile
export interface TeacherProfile {
    id: string;
    name: string;
    pin: string;
    createdAt: string;
}

// Parent Profile
export interface ParentProfile {
    id: string;
    name: string;
    childId: string;
    pin: string;
    createdAt?: string;
    notifications?: Notification[];
}

// Notification for parents
export interface Notification {
    id: string;
    type: 'daily-summary' | 'achievement' | 'low-performance' | 'streak' | 'quiz-completed';
    title: string;
    message: string;
    date: string;
    read: boolean;
}

// Activity Log
export interface ActivityLog {
    id: string;
    studentId: string;
    type: 'quiz' | 'study' | 'daily-challenge' | 'achievement';
    subjectId?: string;
    subjectName?: string;
    score?: number;
    xpEarned: number;
    coinsEarned: number;
    completedAt: string;
    timeSpent?: number;
}

// Badge
export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt?: string;
}

// Subject
export interface Subject {
    id: string;
    name: string;
    icon: string;
    color: string;
    standards: number[];
}

// Flashcard
export interface Flashcard {
    id: string;
    subjectId: string;
    standard: number;
    chapter: string;
    question: string;
    answer: string;
    front?: string;
    back?: string;
}

// Quiz Question
export interface QuizQuestion {
    id: string;
    subjectId: string;
    standard: number;
    chapter: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

// Quiz Result
export interface QuizResult {
    id: string;
    studentId: string;
    subjectId: string;
    standard: number;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    completedAt: string;
    coinsEarned: number;
    xpEarned: number;
}

// Leaderboard Entry
export interface LeaderboardEntry {
    rank: number;
    studentId: string;
    studentName: string;
    avatar: string;
    xp: number;
    streak: number;
}

// Learning Mode
export type LearningMode = 'study' | 'quiz' | 'timed-quiz' | 'ai-micro';

// User Role
export type UserRole = 'student' | 'teacher' | 'parent';

// Uploaded PDF
export interface UploadedPDF {
    id: string;
    teacherId: string;
    fileName: string;
    subjectId: string;
    standard: number;
    uploadedAt: string;
    fileContent: string; // Base64 or text content
}

// Generated Quiz from PDF
export interface GeneratedQuiz {
    id: string;
    pdfId: string;
    teacherId: string;
    subjectId: string;
    standard: number;
    title: string;
    questions: QuizQuestion[];
    createdAt: string;
    isActive: boolean;
}

// App State
export interface AppState {
    currentRole: UserRole | null;
    currentStudent: StudentProfile | null;
    currentTeacher: TeacherProfile | null;
    isOffline: boolean;
}
