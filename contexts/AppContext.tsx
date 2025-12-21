import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';
import { StudentProfile, TeacherProfile, ParentProfile, QuizResult, UserRole, UploadedPDF, GeneratedQuiz, ActivityLog, Notification } from '@/types';

interface AppContextType {
    // User state
    currentRole: UserRole | null;
    setCurrentRole: (role: UserRole | null) => void;

    // Student state
    students: StudentProfile[];
    currentStudent: StudentProfile | null;
    setCurrentStudent: (student: StudentProfile | null) => void;
    addStudent: (student: StudentProfile) => void;
    updateStudent: (student: StudentProfile) => void;

    // Teacher state
    teachers: TeacherProfile[];
    currentTeacher: TeacherProfile | null;
    setCurrentTeacher: (teacher: TeacherProfile | null) => void;
    addTeacher: (teacher: TeacherProfile) => void;

    // Parent state
    parents: ParentProfile[];
    currentParent: ParentProfile | null;
    setCurrentParent: (parent: ParentProfile | null) => void;
    addParent: (parent: ParentProfile) => void;
    updateParent: (parent: ParentProfile) => void;

    // Activity logs
    activityLogs: ActivityLog[];
    addActivityLog: (log: ActivityLog) => void;

    // Quiz results
    quizResults: QuizResult[];
    addQuizResult: (result: QuizResult) => void;

    // PDF and Generated Quizzes
    uploadedPDFs: UploadedPDF[];
    generatedQuizzes: GeneratedQuiz[];
    addUploadedPDF: (pdf: UploadedPDF) => void;
    addGeneratedQuiz: (quiz: GeneratedQuiz) => void;
    deleteGeneratedQuiz: (quizId: string) => void;
    toggleQuizActive: (quizId: string) => void;

    // Offline status
    isOnline: boolean;

    // Utility functions
    logout: () => void;
    isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    // Simplified online status - assume online for now
    const isOnline = true;

    const [currentRole, setCurrentRole, loadingRole] = useAsyncStorage<UserRole | null>('stemquest-role', null);
    const [students, setStudents, loadingStudents] = useAsyncStorage<StudentProfile[]>('stemquest-students', []);
    const [currentStudentId, setCurrentStudentId, loadingStudentId] = useAsyncStorage<string | null>('stemquest-current-student', null);
    const [teachers, setTeachers, loadingTeachers] = useAsyncStorage<TeacherProfile[]>('stemquest-teachers', []);
    const [currentTeacherId, setCurrentTeacherId, loadingTeacherId] = useAsyncStorage<string | null>('stemquest-current-teacher', null);
    const [parents, setParents, loadingParents] = useAsyncStorage<ParentProfile[]>('stemquest-parents', []);
    const [currentParentId, setCurrentParentId, loadingParentId] = useAsyncStorage<string | null>('stemquest-current-parent', null);
    const [activityLogs, setActivityLogs, loadingActivity] = useAsyncStorage<ActivityLog[]>('stemquest-activity-logs', []);
    const [quizResults, setQuizResults, loadingResults] = useAsyncStorage<QuizResult[]>('stemquest-quiz-results', []);
    const [uploadedPDFs, setUploadedPDFs] = useAsyncStorage<UploadedPDF[]>('stemquest-uploaded-pdfs', []);
    const [generatedQuizzes, setGeneratedQuizzes, loadingQuizzes] = useAsyncStorage<GeneratedQuiz[]>('stemquest-generated-quizzes', []);

    const isLoading = loadingRole || loadingStudents || loadingStudentId || loadingTeachers || loadingTeacherId || loadingParents || loadingParentId || loadingActivity || loadingResults || loadingQuizzes;

    const currentStudent = students.find(s => s.id === currentStudentId) || null;
    const currentTeacher = teachers.find(t => t.id === currentTeacherId) || null;
    const currentParent = parents.find(p => p.id === currentParentId) || null;

    const updateStudent = useCallback((student: StudentProfile) => {
        setStudents((prev) => prev.map(s => s.id === student.id ? student : s));
    }, [setStudents]);

    const setCurrentStudent = useCallback((student: StudentProfile | null) => {
        setCurrentStudentId(student?.id || null);
    }, [setCurrentStudentId]);

    const setCurrentTeacher = useCallback((teacher: TeacherProfile | null) => {
        setCurrentTeacherId(teacher?.id || null);
    }, [setCurrentTeacherId]);

    const setCurrentParent = useCallback((parent: ParentProfile | null) => {
        setCurrentParentId(parent?.id || null);
    }, [setCurrentParentId]);

    const addStudent = useCallback((student: StudentProfile) => {
        setStudents((prev) => [...prev, student]);
    }, [setStudents]);

    const addTeacher = useCallback((teacher: TeacherProfile) => {
        setTeachers((prev) => [...prev, teacher]);
    }, [setTeachers]);

    const addParent = useCallback((parent: ParentProfile) => {
        setParents((prev) => [...prev, parent]);
    }, [setParents]);

    const updateParent = useCallback((parent: ParentProfile) => {
        setParents((prev) => prev.map(p => p.id === parent.id ? parent : p));
    }, [setParents]);

    const addActivityLog = useCallback((log: ActivityLog) => {
        setActivityLogs((prev) => [...prev, log]);
    }, [setActivityLogs]);

    const addQuizResult = useCallback((result: QuizResult) => {
        setQuizResults((prev) => [...prev, result]);
    }, [setQuizResults]);

    const addUploadedPDF = useCallback((pdf: UploadedPDF) => {
        setUploadedPDFs((prev) => [...prev, pdf]);
    }, [setUploadedPDFs]);

    const addGeneratedQuiz = useCallback((quiz: GeneratedQuiz) => {
        setGeneratedQuizzes((prev) => [...prev, quiz]);
    }, [setGeneratedQuizzes]);

    const deleteGeneratedQuiz = useCallback((quizId: string) => {
        setGeneratedQuizzes((prev) => prev.filter(q => q.id !== quizId));
    }, [setGeneratedQuizzes]);

    const toggleQuizActive = useCallback((quizId: string) => {
        setGeneratedQuizzes((prev) => prev.map(q =>
            q.id === quizId ? { ...q, isActive: !q.isActive } : q
        ));
    }, [setGeneratedQuizzes]);

    const logout = useCallback(() => {
        setCurrentRole(null);
        setCurrentStudentId(null);
        setCurrentTeacherId(null);
        setCurrentParentId(null);
    }, [setCurrentRole, setCurrentStudentId, setCurrentTeacherId, setCurrentParentId]);

    return (
        <AppContext.Provider value={{
            currentRole,
            setCurrentRole,
            students,
            currentStudent,
            setCurrentStudent,
            addStudent,
            updateStudent,
            teachers,
            currentTeacher,
            setCurrentTeacher,
            addTeacher,
            parents,
            currentParent,
            setCurrentParent,
            addParent,
            updateParent,
            activityLogs,
            addActivityLog,
            quizResults,
            addQuizResult,
            uploadedPDFs,
            generatedQuizzes,
            addUploadedPDF,
            addGeneratedQuiz,
            deleteGeneratedQuiz,
            toggleQuizActive,
            isOnline,
            logout,
            isLoading
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
