import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Trophy, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getSubjectById } from '@/data/subjects';
import { getQuestionsForSubject } from '@/data/sampleQuestions';
import { cn } from '@/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizQuestion, Badge, ActivityLog, StudentProfile } from '@/types';
import { useBadges } from '@/hooks/useBadges';
import { BadgeUnlockModal } from '@/components/shared/BadgeUnlockModal';

export default function TimedQuiz() {
    const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
    const router = useRouter();
    const { currentStudent, updateStudent, addActivityLog } = useApp();
    const { checkAndAwardBadges } = useBadges();

    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [totalTime, setTotalTime] = useState(0);
    const [questionTime, setQuestionTime] = useState(20);
    const [isComplete, setIsComplete] = useState(false);
    const [subject, setSubject] = useState<ReturnType<typeof getSubjectById>>(undefined);
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

    useEffect(() => {
        if (!currentStudent || !subjectId) {
            router.replace('/(auth)/student-login');
            return;
        }

        const subj = getSubjectById(subjectId);
        setSubject(subj);

        const subjectQuestions = getQuestionsForSubject(subjectId, currentStudent.standard);
        const shuffled = [...subjectQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, 10));
    }, [currentStudent, subjectId, router]);

    useEffect(() => {
        if (isComplete || questions.length === 0) return;

        const timer = setInterval(() => {
            setTotalTime((prev) => prev + 1);
            setQuestionTime((prev) => {
                if (prev <= 1) {
                    handleTimeout();
                    return 20;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isComplete, questions.length, currentIndex]);

    const handleTimeout = () => {
        setAnswers([...answers, -1]);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setQuestionTime(20);
        } else {
            completeQuiz([...answers, -1]);
        }
    };

    const handleAnswer = (answerIndex: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(answerIndex);
        const newAnswers = [...answers, answerIndex];
        setAnswers(newAnswers);

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSelectedAnswer(null);
                setQuestionTime(20);
            } else {
                completeQuiz(newAnswers);
            }
        }, 1000);
    };

    const completeQuiz = (finalAnswers: number[]) => {
        if (!currentStudent || !subject) return;

        const correctCount = finalAnswers.filter((ans, idx) =>
            ans === questions[idx].correctAnswer
        ).length;

        const percentage = (correctCount / questions.length) * 100;
        const xpGained = Math.floor(correctCount * 15);
        const coinsGained = Math.floor(correctCount * 3);

        const newBadges = checkAndAwardBadges({
            timedQuizTime: totalTime,
            perfectScore: percentage === 100,
            quizCompleted: true,
        });

        if (newBadges.length > 0) {
            setUnlockedBadge(newBadges[0]);
        }

        updateStudent({
            ...currentStudent,
            xp: currentStudent.xp + xpGained,
            coins: currentStudent.coins + coinsGained,
            timedQuizzesTaken: (currentStudent.timedQuizzesTaken || 0) + 1,
        } as StudentProfile);

        // Log activity for parents
        const activityLog: ActivityLog = {
            id: `timed-quiz-${Date.now()}`,
            studentId: currentStudent.id,
            type: 'quiz',
            subjectId: subject.id,
            subjectName: subject.name,
            score: Math.round(percentage),
            xpEarned: xpGained,
            coinsEarned: coinsGained,
            completedAt: new Date().toISOString(),
            timeSpent: totalTime,
        };
        addActivityLog(activityLog);

        setIsComplete(true);
    };

    if (!currentStudent || !subject || questions.length === 0) {
        return null;
    }

    if (isComplete) {
        const correctCount = answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
        const percentage = (correctCount / questions.length) * 100;
        const xpGained = Math.floor(correctCount * 15);
        const coinsGained = Math.floor(correctCount * 3);

        return (
            <SafeAreaView className="flex-1 bg-background" edges={['top']}>
                <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
                    <View className="items-center mb-8">
                        <View className="bg-orange-500/20 rounded-full p-6 mb-4 border border-orange-500/30">
                            <Zap size={64} color="#fb923c" />
                        </View>
                        <Text className="text-3xl font-bold mb-2 text-white text-glow">Time's Up!</Text>
                        <Text className="text-gray-300">Quiz completed in {totalTime}s</Text>
                    </View>

                    {/* Score Card */}
                    <View className="bg-white/5 rounded-2xl p-8 mb-6 border border-white/10 relative overflow-hidden">
                        <Text className="text-center text-6xl font-bold text-orange-500 mb-2 text-glow">
                            {Math.round(percentage)}%
                        </Text>
                        <Text className="text-center text-gray-300 mb-6 text-lg">
                            {correctCount} out of {questions.length} correct
                        </Text>
                        <View className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <View className="h-full bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]" style={{ width: `${percentage}%` }} />
                        </View>
                    </View>

                    {/* Time Stats */}
                    <View className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <Clock size={22} color="#9ca3af" />
                                <Text className="text-gray-300 font-semibold text-base">Total Time</Text>
                            </View>
                            <Text className="text-2xl font-bold text-white tracking-widest">{totalTime}s</Text>
                        </View>
                    </View>

                    {/* Rewards */}
                    <View className="flex-row gap-3 mb-8">
                        <View className="flex-1 bg-purple-500/10 rounded-2xl p-5 border border-purple-500/20 backdrop-blur-md">
                            <Text className="text-[10px] text-purple-400 font-bold mb-2 tracking-wider">XP EARNED</Text>
                            <Text className="text-3xl font-bold text-white">+{xpGained}</Text>
                        </View>
                        <View className="flex-1 bg-yellow-500/10 rounded-2xl p-5 border border-yellow-500/20 backdrop-blur-md">
                            <Text className="text-[10px] text-yellow-400 font-bold mb-2 tracking-wider">COINS</Text>
                            <Text className="text-3xl font-bold text-white">+{coinsGained}</Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View className="gap-4">
                        <Pressable
                            onPress={() => router.push('/(dashboard)/student-dashboard')}
                            className="bg-orange-600 rounded-xl py-4 items-center border border-orange-400/30 shadow-lg shadow-orange-500/20"
                        >
                            <Text className="text-white font-bold text-lg">Back to Dashboard</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')}
                            className="bg-white/5 rounded-xl py-4 items-center border border-white/10 active:bg-white/10"
                        >
                            <Text className="text-gray-200 font-bold text-lg">Try Again</Text>
                        </Pressable>
                    </View>
                </ScrollView>

                <BadgeUnlockModal
                    badge={unlockedBadge}
                    onClose={() => setUnlockedBadge(null)}
                />
            </SafeAreaView>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-4 border-b border-white/10">
                <Pressable onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')} className="flex-row items-center gap-2 mb-3 bg-white/5 self-start px-3 py-1.5 rounded-full border border-white/10">
                    <ArrowLeft size={18} color="white" />
                    <Text className="font-semibold text-white/90">Back</Text>
                </Pressable>
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-2xl font-bold text-white text-glow">{subject.name}</Text>
                        <Text className="text-sm text-gray-300">Timed Quiz</Text>
                    </View>
                    <View className={cn(
                        'px-4 py-2 rounded-full flex-row items-center gap-2 border',
                        questionTime <= 5
                            ? 'bg-red-500/20 border-red-500/50'
                            : 'bg-orange-500/20 border-orange-500/50'
                    )}>
                        <Clock size={16} color={questionTime <= 5 ? '#ef4444' : '#f97316'} />
                        <Text className={cn(
                            'text-xl font-bold',
                            questionTime <= 5 ? 'text-red-400' : 'text-orange-400'
                        )}>
                            {questionTime}s
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
                {/* Progress */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-semibold text-gray-300">
                            Question {currentIndex + 1} of {questions.length}
                        </Text>
                        <Text className="text-sm text-gray-400">
                            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                        </Text>
                    </View>
                    <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        />
                    </View>
                </View>

                {questionTime <= 5 && (
                    <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 flex-row items-center gap-3 animate-pulse">
                        <AlertTriangle size={24} color="#ef4444" />
                        <Text className="flex-1 text-red-400 font-bold tracking-wide">Time running out!</Text>
                    </View>
                )}

                {/* Question */}
                <View className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 shadow-lg">
                    <Text className="text-xl font-bold text-white leading-8">{currentQuestion.question}</Text>
                </View>

                {/* Answers */}
                <View className="gap-3">
                    {currentQuestion.options.map((answer, index) => {
                        const isCorrect = index === currentQuestion.correctAnswer;
                        const isSelected = selectedAnswer === index;

                        return (
                            <Pressable
                                key={index}
                                onPress={() => handleAnswer(index)}
                                disabled={selectedAnswer !== null}
                                className={cn(
                                    'p-4 rounded-xl border flex-row items-center gap-4 active:bg-white/5',
                                    selectedAnswer === null && 'bg-white/5 border-white/10',
                                    isSelected && isCorrect && 'bg-green-500/20 border-green-500',
                                    isSelected && !isCorrect && 'bg-red-500/20 border-red-500'
                                )}
                            >
                                <View className={cn(
                                    'w-8 h-8 rounded-full items-center justify-center border',
                                    selectedAnswer === null && 'bg-white/10 border-white/20',
                                    isSelected && isCorrect && 'bg-green-500 border-green-400',
                                    isSelected && !isCorrect && 'bg-red-500 border-red-400'
                                )}>
                                    {selectedAnswer !== null && isSelected && isCorrect && (
                                        <CheckCircle size={20} color="white" />
                                    )}
                                    {selectedAnswer !== null && isSelected && !isCorrect && (
                                        <XCircle size={20} color="white" />
                                    )}
                                    {selectedAnswer === null && (
                                        <Text className="text-sm font-bold text-white">
                                            {String.fromCharCode(65 + index)}
                                        </Text>
                                    )}
                                </View>
                                <Text className={cn(
                                    'flex-1 text-base',
                                    isSelected && isCorrect && 'font-bold text-green-400',
                                    isSelected && !isCorrect && 'font-bold text-red-400',
                                    selectedAnswer === null && 'text-gray-200'
                                )}>
                                    {answer}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
