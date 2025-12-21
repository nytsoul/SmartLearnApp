import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Coins, Sparkles } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getSubjectById } from '@/data/subjects';
import { getQuestionsForSubject } from '@/data/sampleQuestions';
import { cn } from '@/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBadges } from '@/hooks/useBadges';
import { Badge, ActivityLog } from '@/types';
import { BadgeUnlockModal } from '@/components/shared/BadgeUnlockModal';

export default function QuizMode() {
    const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
    const router = useRouter();
    const { currentStudent, updateStudent, addQuizResult, addActivityLog } = useApp();
    const { checkAndAwardBadges } = useBadges();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime] = useState(Date.now());
    const [showResults, setShowResults] = useState(false);
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

    const subject = subjectId ? getSubjectById(subjectId) : null;
    const questions = useMemo(() =>
        currentStudent && subjectId
            ? getQuestionsForSubject(subjectId, currentStudent.standard)
            : [],
        [currentStudent, subjectId]
    );

    useEffect(() => {
        if (!currentStudent || !subjectId) {
            router.replace('/(auth)/student-login');
        }
    }, [currentStudent, subjectId, router]);

    useEffect(() => {
        if (currentStudent && subjectId && (!subject || questions.length === 0)) {
            router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard');
        }
    }, [subject, questions.length, router, subjectId, currentStudent]);

    if (!currentStudent || !subjectId || !subject || questions.length === 0) {
        return null;
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswerSelect = (answerIndex: number) => {
        if (isAnswered) return;

        setSelectedAnswer(answerIndex);
        setIsAnswered(true);

        if (answerIndex === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            completeQuiz();
        }
    };

    const completeQuiz = () => {
        const percentage = (score / questions.length) * 100;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const xpGained = score * 10;
        const coinsGained = score * 2;

        const newBadges = checkAndAwardBadges({
            quizCompleted: true,
            perfectScore: percentage === 100,
        });

        if (newBadges.length > 0) {
            setUnlockedBadge(newBadges[0]);
        }

        updateStudent({
            ...currentStudent,
            xp: currentStudent.xp + xpGained,
            coins: currentStudent.coins + coinsGained,
            quizzesTaken: (currentStudent.quizzesTaken || 0) + 1,
        });

        addQuizResult({
            id: Date.now().toString(),
            studentId: currentStudent.id,
            subjectId: subject.id,
            score: percentage,
            totalQuestions: questions.length,
            correctAnswers: score,
            timeSpent,
            completedAt: new Date().toISOString(),
            coinsEarned: coinsGained,
            xpEarned: xpGained,
            standard: currentStudent.standard,
        });

        // Log activity for parents
        const activityLog: ActivityLog = {
            id: `quiz-${Date.now()}`,
            studentId: currentStudent.id,
            type: 'quiz',
            subjectId: subject.id,
            subjectName: subject.name,
            score: Math.round(percentage),
            xpEarned: xpGained,
            coinsEarned: coinsGained,
            completedAt: new Date().toISOString(),
            timeSpent,
        };
        addActivityLog(activityLog);

        setShowResults(true);
    };

    if (showResults) {
        const percentage = (score / questions.length) * 100;
        const xpGained = score * 10;
        const coinsGained = score * 2;

        return (
            <SafeAreaView className="flex-1 bg-background" edges={['top']}>
                <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
                    <View className="items-center mb-8">
                        <View className="bg-yellow-500/20 rounded-full p-6 mb-4 border border-yellow-500/30">
                            <Trophy size={64} color="#facc15" />
                        </View>
                        <Text className="text-3xl font-bold mb-2 text-white text-glow">Quiz Complete!</Text>
                        <Text className="text-gray-300">Great job finishing the quiz</Text>
                    </View>

                    {/* Score Card */}
                    <View className="bg-white/5 rounded-2xl p-8 mb-6 border border-white/10 relative overflow-hidden">
                        <Text className="text-center text-6xl font-bold text-blue-400 mb-2 text-glow">
                            {Math.round(percentage)}%
                        </Text>
                        <Text className="text-center text-gray-300 mb-6 text-lg">
                            {score} out of {questions.length} correct
                        </Text>
                        <View className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <View className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: `${percentage}%` }} />
                        </View>
                    </View>

                    {/* Rewards */}
                    <View className="flex-row gap-3 mb-8">
                        <View className="flex-1 bg-purple-500/10 rounded-2xl p-5 border border-purple-500/20 backdrop-blur-md">
                            <Sparkles size={24} color="#a855f7" />
                            <Text className="text-[10px] text-purple-400 font-bold mt-2 tracking-wider">XP EARNED</Text>
                            <Text className="text-3xl font-bold text-white">+{xpGained}</Text>
                        </View>
                        <View className="flex-1 bg-yellow-500/10 rounded-2xl p-5 border border-yellow-500/20 backdrop-blur-md">
                            <Coins size={24} color="#facc15" />
                            <Text className="text-[10px] text-yellow-400 font-bold mt-2 tracking-wider">COINS EARNED</Text>
                            <Text className="text-3xl font-bold text-white">+{coinsGained}</Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View className="gap-4">
                        <Pressable
                            onPress={() => router.push('/(dashboard)/student-dashboard')}
                            className="bg-blue-600 rounded-xl py-4 items-center border border-blue-400/30 shadow-lg shadow-blue-500/20"
                        >
                            <Text className="text-white font-bold text-lg">Back to Dashboard</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')}
                            className="bg-white/5 rounded-xl py-4 items-center border border-white/10 active:bg-white/10"
                        >
                            <Text className="text-gray-200 font-bold text-lg">Try Another Subject</Text>
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

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-4 border-b border-white/10">
                <Pressable onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')} className="flex-row items-center gap-2 mb-3 bg-white/5 self-start px-3 py-1.5 rounded-full border border-white/10">
                    <ArrowLeft size={18} color="white" />
                    <Text className="font-semibold text-white/90">Back</Text>
                </Pressable>
                <View>
                    <Text className="text-2xl font-bold text-white text-glow">{subject.name}</Text>
                    <Text className="text-sm text-gray-300">Quiz Mode</Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
                {/* Progress */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-semibold text-gray-300">
                            Question {currentIndex + 1} of {questions.length}
                        </Text>
                        <Text className="text-sm text-gray-400">{Math.round(progress)}%</Text>
                    </View>
                    <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <View className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progress}%` }} />
                    </View>
                </View>

                {/* Question */}
                <View className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 shadow-lg">
                    <Text className="text-xl font-bold mb-2 text-white leading-8">{currentQuestion.question}</Text>
                </View>

                {/* Answers */}
                <View className="gap-4 mb-6">
                    {currentQuestion.options.map((answer, index) => {
                        const isCorrect = index === currentQuestion.correctAnswer;
                        const isSelected = selectedAnswer === index;

                        return (
                            <Pressable
                                key={index}
                                onPress={() => handleAnswerSelect(index)}
                                disabled={isAnswered}
                                className={cn(
                                    'p-4 rounded-xl border flex-row items-center gap-4 active:bg-white/5',
                                    !isAnswered && 'bg-white/5 border-white/10',
                                    isAnswered && isSelected && isCorrect && 'bg-green-500/20 border-green-500',
                                    isAnswered && isSelected && !isCorrect && 'bg-red-500/20 border-red-500',
                                    isAnswered && !isSelected && isCorrect && 'bg-green-500/20 border-green-500',
                                    isAnswered && !isSelected && !isCorrect && 'bg-white/5 border-white/10 opacity-50'
                                )}
                            >
                                <View className={cn(
                                    'w-8 h-8 rounded-full items-center justify-center border',
                                    !isAnswered && 'bg-white/10 border-white/20',
                                    isAnswered && isSelected && isCorrect && 'bg-green-500 border-green-400',
                                    isAnswered && isSelected && !isCorrect && 'bg-red-500 border-red-400',
                                    isAnswered && !isSelected && isCorrect && 'bg-green-500 border-green-400',
                                    isAnswered && !isSelected && !isCorrect && 'bg-white/10 border-white/10'
                                )}>
                                    {isAnswered && ((isSelected && isCorrect) || (!isSelected && isCorrect)) && (
                                        <CheckCircle2 size={20} color="white" />
                                    )}
                                    {isAnswered && isSelected && !isCorrect && (
                                        <XCircle size={20} color="white" />
                                    )}
                                    {!isAnswered && (
                                        <Text className="text-sm font-bold text-white">{String.fromCharCode(65 + index)}</Text>
                                    )}
                                </View>
                                <Text className={cn(
                                    'flex-1 text-base',
                                    isAnswered && isSelected && isCorrect && 'font-bold text-green-400',
                                    isAnswered && isSelected && !isCorrect && 'font-bold text-red-400',
                                    isAnswered && !isSelected && isCorrect && 'font-bold text-green-400',
                                    !isAnswered && 'text-gray-200'
                                )}>
                                    {answer}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Next Button */}
                {isAnswered && (
                    <Pressable
                        onPress={handleNext}
                        className="bg-blue-600 rounded-xl py-4 items-center shadow-lg shadow-blue-600/20"
                    >
                        <Text className="text-white font-bold text-lg">
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                        </Text>
                    </Pressable>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
