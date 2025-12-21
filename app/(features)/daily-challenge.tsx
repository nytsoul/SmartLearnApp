import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { getDailyQuestions } from '@/data/sampleQuestions';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Clock, Trophy, Gift, CheckCircle, XCircle, Star, Zap } from 'lucide-react-native';
import { QuizQuestion, Badge } from '@/types';
import { useBadges } from '@/hooks/useBadges';
import { BadgeUnlockModal } from '@/components/shared/BadgeUnlockModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';

const DailyChallenge = () => {
    const router = useRouter();
    const { currentStudent, updateStudent } = useApp();
    const { checkAndAwardBadges } = useBadges();
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [hasPlayedToday, setHasPlayedToday] = useState(false);
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

    useEffect(() => {
        if (!currentStudent) {
            router.replace('/(auth)/student-login');
            return;
        }

        // Check if already played today
        const today = new Date().toDateString();
        if (currentStudent.lastActive === today && currentStudent.dailyChallengeCompleted) {
            setHasPlayedToday(true);
        }

        const dailyQuestions = getDailyQuestions(currentStudent.standard, 5);
        setQuestions(dailyQuestions);
    }, [currentStudent, router]);

    useEffect(() => {
        if (isComplete || showResult || hasPlayedToday) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleAnswer(-1); // Time's up
                    return 15;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, isComplete, showResult, hasPlayedToday]);

    const handleAnswer = (answerIndex: number) => {
        if (showResult) return;

        setSelectedAnswer(answerIndex);
        setShowResult(true);

        const isCorrect = answerIndex === questions[currentIndex]?.correctAnswer;
        if (isCorrect) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setTimeLeft(15);
        } else {
            completeChallenge();
        }
    };

    const completeChallenge = () => {
        setIsComplete(true);

        if (currentStudent) {
            const bonusCoins = score * 10;
            const bonusXp = score * 25;
            const today = new Date().toDateString();
            const isPerfect = score === questions.length;

            // Check streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const wasActiveYesterday = currentStudent.lastActive === yesterday.toDateString();
            const newStreak = wasActiveYesterday ? currentStudent.streak + 1 : 1;
            const streakBonus = newStreak >= 7 ? 50 : newStreak >= 3 ? 20 : 0;

            updateStudent({
                ...currentStudent,
                coins: currentStudent.coins + bonusCoins + streakBonus,
                xp: currentStudent.xp + bonusXp,
                streak: newStreak,
                lastActive: today,
                dailyChallengeCompleted: true,
            });

            // Check and award badges after a small delay
            setTimeout(() => {
                const newBadges = checkAndAwardBadges({
                    quizCompleted: true,
                    perfectScore: isPerfect,
                });
                if (newBadges.length > 0) {
                    setUnlockedBadge(newBadges[0]);
                }
            }, 500);
        }
    };

    if (!currentStudent) return null;

    if (hasPlayedToday) {
        return (
            <SafeAreaView className="flex-1 bg-background" edges={['top']}>
                <View className="p-4 pt-10">
                    <Pressable onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')} className="flex-row items-center gap-2 mb-8 bg-white/5 self-start px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft size={20} color="white" />
                        <Text className="text-white font-medium">Back</Text>
                    </Pressable>

                    <View className="p-8 bg-white/5 rounded-3xl border border-white/10 items-center backdrop-blur-md">
                        <View className="w-24 h-24 bg-purple-500/20 rounded-full items-center justify-center mb-6 border border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                            <CheckCircle size={48} color="#a855f7" />
                        </View>
                        <Text className="text-3xl font-bold text-center mb-3 text-white text-glow">Challenge Completed!</Text>
                        <Text className="text-gray-300 text-center mb-8 leading-6 text-lg">
                            You've already completed today's daily challenge. Come back tomorrow for a new one!
                        </Text>
                        <View className="flex-row items-center gap-3 mb-8 bg-orange-500/10 px-6 py-3 rounded-2xl border border-orange-500/20">
                            <Zap size={24} color="#fb923c" />
                            <Text className="text-xl font-bold text-orange-400">{currentStudent.streak} Day Streak</Text>
                        </View>
                        <Button onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')} className="bg-purple-600 py-4 px-8 w-full rounded-xl shadow-lg shadow-purple-600/30" variant="default">
                            <Text className="text-white font-bold text-center text-lg">Back to Dashboard</Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (isComplete) {
        const bonusCoins = score * 10;
        const bonusXp = score * 25;
        const isPerfect = score === questions.length;

        return (
            <SafeAreaView className="flex-1 bg-background" edges={['top']}>
                <ScrollView className="p-4">
                    <View className="bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden mt-8">
                        <LinearGradient
                            colors={['rgba(88, 28, 135, 0.4)', 'rgba(30, 27, 75, 0)']}
                            className="absolute inset-0"
                        />
                        <View className={cn(
                            'w-32 h-32 rounded-full items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 border-white/10',
                            isPerfect
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                : 'bg-gradient-to-br from-purple-500 to-blue-500'
                        )}>
                            {isPerfect ? (
                                <Star size={64} color="white" />
                            ) : (
                                <Trophy size={64} color="white" />
                            )}
                        </View>

                        <Text className="text-4xl font-bold text-center mb-3 text-white text-glow">
                            {isPerfect ? 'Perfect Score!' : 'Challenge Complete!'}
                        </Text>
                        <Text className="text-xl text-gray-300 text-center mb-10">
                            You got {score} out of {questions.length} correct
                        </Text>

                        <View className="flex-row gap-4 mb-10">
                            <View className="flex-1 p-5 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30 backdrop-blur-md">
                                <View className="items-center">
                                    <View className="bg-white/20 rounded-full p-3 mb-3 border border-white/10">
                                        <Gift size={32} color="#facc15" />
                                    </View>
                                    <Text className="text-3xl font-bold text-white">+{bonusCoins}</Text>
                                    <Text className="text-sm text-yellow-200 font-bold uppercase tracking-wide mt-1">Coins Earned</Text>
                                </View>
                            </View>
                            <View className="flex-1 p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 backdrop-blur-md">
                                <View className="items-center">
                                    <View className="bg-white/20 rounded-full p-3 mb-3 border border-white/10">
                                        <Zap size={32} color="#e879f9" />
                                    </View>
                                    <Text className="text-3xl font-bold text-white">+{bonusXp}</Text>
                                    <Text className="text-sm text-purple-200 font-bold uppercase tracking-wide mt-1">XP Earned</Text>
                                </View>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 py-5 rounded-2xl shadow-lg shadow-purple-600/30 active:scale-95 border border-white/20"
                        >
                            <Text className="text-white font-bold text-center text-lg tracking-wide">
                                Back to Dashboard
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
                <BadgeUnlockModal badge={unlockedBadge} onClose={() => setUnlockedBadge(null)} />
            </SafeAreaView>
        );
    }

    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return null;

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView className="flex-1 p-4">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-8">
                    <Pressable onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')} className="flex-row items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft size={20} color="white" />
                        <Text className="text-white font-medium">Exit</Text>
                    </Pressable>
                    <View className="flex-row items-center gap-4">
                        <View className={cn(
                            'flex-row items-center gap-2 px-4 py-2 rounded-full border',
                            timeLeft <= 5
                                ? 'bg-red-500/20 border-red-500/50'
                                : 'bg-purple-500/20 border-purple-500/50'
                        )}>
                            <Clock size={16} color={timeLeft <= 5 ? '#ef4444' : '#a855f7'} />
                            <Text className={cn(
                                'font-bold text-lg',
                                timeLeft <= 5 ? 'text-red-400' : 'text-purple-400'
                            )}>{timeLeft}s</Text>
                        </View>
                        <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                            <Trophy size={16} color="#facc15" />
                            <Text className="font-bold text-yellow-500 text-lg">{score}/{questions.length}</Text>
                        </View>
                    </View>
                </View>

                {/* Progress */}
                <View className="mb-8">
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-sm font-medium text-gray-400">Question {currentIndex + 1} of {questions.length}</Text>
                        <Text className="text-sm text-purple-400 font-bold uppercase tracking-wider">Daily Challenge</Text>
                    </View>
                    <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        />
                    </View>
                </View>

                {/* Question Card */}
                <View className="p-6 bg-white/5 rounded-3xl border border-white/10 mb-8 shadow-xl">
                    <Text className="text-xs text-blue-300 font-bold mb-4 bg-blue-500/20 self-start px-3 py-1 rounded-full border border-blue-500/30 ml-[-4px]">{currentQuestion.chapter}</Text>
                    <Text className="text-xl font-bold mb-8 text-white leading-8">{currentQuestion.question}</Text>

                    <View className="gap-4">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQuestion.correctAnswer;

                            return (
                                <Pressable
                                    key={index}
                                    onPress={() => handleAnswer(index)}
                                    disabled={showResult}
                                    className={cn(
                                        'p-4 rounded-xl border flex-row items-center transition-all',
                                        showResult && isCorrect && 'bg-green-500/20 border-green-500',
                                        showResult && isSelected && !isCorrect && 'bg-red-500/20 border-red-500',
                                        !showResult && 'bg-white/5 border-white/10 active:bg-white/10'
                                    )}
                                >
                                    <View className={cn(
                                        "w-8 h-8 rounded-full items-center justify-center mr-4 border",
                                        showResult && isCorrect ? 'bg-green-500 border-green-400' :
                                            showResult && isSelected && !isCorrect ? 'bg-red-500 border-red-400' :
                                                'bg-white/10 border-white/20'
                                    )}>
                                        <Text className="text-sm font-bold text-white">
                                            {String.fromCharCode(65 + index)}
                                        </Text>
                                    </View>
                                    <Text className={cn(
                                        "flex-1 text-base font-medium",
                                        showResult && isCorrect ? 'text-green-300' :
                                            showResult && isSelected && !isCorrect ? 'text-red-300' :
                                                'text-gray-200'
                                    )}>{option}</Text>
                                    {showResult && isCorrect && <CheckCircle size={20} color="#4ade80" />}
                                    {showResult && isSelected && !isCorrect && <XCircle size={20} color="#f87171" />}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Explanation & Next */}
                {showResult && (
                    <>
                        <View className="p-5 bg-blue-900/40 rounded-2xl mb-6 border border-blue-500/30">
                            <Text className="text-sm leading-6 text-gray-200">
                                <Text className="font-bold text-blue-300 uppercase tracking-wide">Explanation: </Text> {currentQuestion.explanation}
                            </Text>
                        </View>

                        <Button
                            onPress={handleNext}
                            className="bg-purple-600 py-4 rounded-xl shadow-lg shadow-purple-600/30"
                            variant="default"
                        >
                            <Text className="text-white font-bold text-center text-lg">
                                {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                            </Text>
                        </Button>
                    </>
                )}
            </ScrollView>
            <BadgeUnlockModal badge={unlockedBadge} onClose={() => setUnlockedBadge(null)} />
        </SafeAreaView>
    );
};

export default DailyChallenge;
