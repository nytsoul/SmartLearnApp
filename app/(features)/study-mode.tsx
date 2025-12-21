import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Check, X } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getSubjectById } from '@/data/subjects';
import { getFlashcardsForSubject } from '@/data/sampleQuestions';
import { cn } from '@/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityLog } from '@/types';

export default function StudyMode() {
    const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
    const router = useRouter();
    const { currentStudent, updateStudent, addActivityLog } = useApp();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownCards, setKnownCards] = useState<string[]>([]);
    const [reviewCards, setReviewCards] = useState<string[]>([]);

    const subject = subjectId ? getSubjectById(subjectId) : null;
    const flashcards = useMemo(() =>
        currentStudent && subjectId
            ? getFlashcardsForSubject(subjectId, currentStudent.standard)
            : [],
        [currentStudent, subjectId]
    );

    useEffect(() => {
        if (!currentStudent || !subjectId) {
            router.replace('/(auth)/student-login');
        }
    }, [currentStudent, subjectId, router]);

    useEffect(() => {
        if (currentStudent && subjectId && (!subject || flashcards.length === 0)) {
            router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard');
        }
    }, [subject, flashcards.length, router, subjectId, currentStudent]);

    if (!currentStudent || !subjectId || !subject || flashcards.length === 0) {
        return null;
    }

    const currentCard = flashcards[currentIndex];
    const progress = ((currentIndex + 1) / flashcards.length) * 100;

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleKnown = () => {
        if (!knownCards.includes(currentCard.id)) {
            setKnownCards([...knownCards, currentCard.id]);
            const xpGained = 5;
            updateStudent({
                ...currentStudent,
                xp: currentStudent.xp + xpGained,
            });

            // Log activity for parents
            const activityLog: ActivityLog = {
                id: `study-${Date.now()}-${currentCard.id}`,
                studentId: currentStudent.id,
                type: 'study',
                subjectId: subject!.id,
                subjectName: subject!.name,
                xpEarned: xpGained,
                coinsEarned: 0,
                completedAt: new Date().toISOString(),
            };
            addActivityLog(activityLog);
        }
        handleNext();
    };

    const handleReview = () => {
        if (!reviewCards.includes(currentCard.id)) {
            setReviewCards([...reviewCards, currentCard.id]);
        }
        handleNext();
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownCards([]);
        setReviewCards([]);
    };

    const isCompleted = currentIndex === flashcards.length - 1 && (knownCards.includes(currentCard.id) || reviewCards.includes(currentCard.id));

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
                        <Text className="text-sm text-gray-300">Study Mode</Text>
                    </View>
                    <Pressable onPress={handleReset} className="p-2 bg-white/5 rounded-full border border-white/10 active:bg-white/10">
                        <RotateCcw size={20} color="#a5b4fc" />
                    </Pressable>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
                {/* Progress */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-semibold text-gray-300">
                            Card {currentIndex + 1} of {flashcards.length}
                        </Text>
                        <Text className="text-sm text-gray-400">{Math.round(progress)}%</Text>
                    </View>
                    <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <View className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progress}%` }} />
                    </View>
                </View>

                {/* Stats */}
                <View className="flex-row gap-3 mb-6">
                    <View className="flex-1 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 backdrop-blur-md">
                        <Text className="text-[10px] text-emerald-400 font-bold mb-1 tracking-wider">KNOWN</Text>
                        <Text className="text-xl font-bold text-white">{knownCards.length}</Text>
                    </View>
                    <View className="flex-1 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 backdrop-blur-md">
                        <Text className="text-[10px] text-orange-400 font-bold mb-1 tracking-wider">REVIEW</Text>
                        <Text className="text-xl font-bold text-white">{reviewCards.length}</Text>
                    </View>
                    <View className="flex-1 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                        <Text className="text-[10px] text-gray-400 font-bold mb-1 tracking-wider">REMAINING</Text>
                        <Text className="text-xl font-bold text-white">
                            {flashcards.length - knownCards.length - reviewCards.length}
                        </Text>
                    </View>
                </View>

                {/* Flashcard */}
                <Pressable onPress={handleFlip} className="mb-6" style={{ minHeight: 320 }}>
                    {!isFlipped ? (
                        <View className="bg-white/5 rounded-2xl border border-white/10 p-8 items-center justify-center h-full shadow-lg" style={{ minHeight: 320 }}>
                            <Text className="text-xs text-blue-300 font-bold mb-6 tracking-widest bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">QUESTION</Text>
                            <Text className="text-2xl font-bold text-center text-white leading-8">{currentCard.front}</Text>
                            <Text className="text-sm text-gray-400 mt-8 font-medium">Tap to flip</Text>
                        </View>
                    ) : (
                        <View className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 items-center justify-center h-full shadow-lg border border-white/20" style={{ minHeight: 320 }}>
                            <Text className="text-xs text-white/90 font-bold mb-6 tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/30">ANSWER</Text>
                            <Text className="text-2xl font-bold text-white text-center leading-8">{currentCard.back}</Text>
                            <Text className="text-sm text-white/60 mt-8 font-medium">Tap to flip back</Text>
                        </View>
                    )}
                </Pressable>

                {/* Navigation */}
                <View className="flex-row gap-3 mb-6">
                    <Pressable
                        onPress={handlePrevious}
                        disabled={currentIndex === 0}
                        className={cn(
                            'flex-1 bg-white/5 rounded-xl py-4 items-center border border-white/10 active:bg-white/10',
                            currentIndex === 0 && 'opacity-30'
                        )}
                    >
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                    <Pressable
                        onPress={handleNext}
                        disabled={currentIndex === flashcards.length - 1}
                        className={cn(
                            'flex-1 bg-white/5 rounded-xl py-4 items-center border border-white/10 active:bg-white/10',
                            currentIndex === flashcards.length - 1 && 'opacity-30'
                        )}
                    >
                        <ChevronRight size={24} color="white" />
                    </Pressable>
                </View>

                {/* Action Buttons */}
                {isFlipped && (
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={handleReview}
                            className="flex-1 bg-orange-600 rounded-xl py-4 flex-row items-center justify-center gap-2 border-b-4 border-orange-800 active:border-b-0 active:translate-y-1"
                        >
                            <X size={20} color="white" />
                            <Text className="text-white font-bold">Need Review</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleKnown}
                            className="flex-1 bg-emerald-600 rounded-xl py-4 flex-row items-center justify-center gap-2 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1"
                        >
                            <Check size={20} color="white" />
                            <Text className="text-white font-bold">I Know This</Text>
                        </Pressable>
                    </View>
                )}

                {/* Completion Message */}
                {isCompleted && (
                    <View className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/30 items-center mt-6 backdrop-blur-md">
                        <Text className="text-5xl mb-3">🎉</Text>
                        <Text className="text-xl font-bold text-emerald-400 mb-2">Great Job!</Text>
                        <Text className="text-gray-300 text-center mb-4">
                            You've completed all flashcards
                        </Text>
                        <Pressable onPress={handleReset} className="bg-emerald-600 px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30">
                            <Text className="text-white font-bold">Study Again</Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
