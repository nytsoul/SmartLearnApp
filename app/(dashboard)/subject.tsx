import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, Target, Clock, Brain } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/contexts/AppContext';
import { getSubjectById } from '@/data/subjects';
import { getQuestionsForSubject, getFlashcardsForSubject } from '@/data/sampleQuestions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';

export default function SubjectPage() {
    const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
    const router = useRouter();
    const { currentStudent } = useApp();

    const subject = subjectId ? getSubjectById(subjectId) : null;
    const questions = currentStudent && subjectId ? getQuestionsForSubject(subjectId, currentStudent.standard) : [];
    const flashcards = currentStudent && subjectId ? getFlashcardsForSubject(subjectId, currentStudent.standard) : [];

    if (!currentStudent || !subjectId || !subject) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center">
                <Text className="text-white">Loading...</Text>
            </SafeAreaView>
        );
    }

    const learningModes = [
        {
            id: 'study',
            icon: <BookOpen size={32} color="#60a5fa" />,
            name: 'Study Mode',
            description: 'Learn with flashcards',
            count: `${flashcards.length} cards`,
            color: 'bg-blue-500/10 border-blue-500/20',
            textColor: 'text-blue-400',
            path: '/(features)/study-mode',
        },
        {
            id: 'quiz',
            icon: <Target size={32} color="#a855f7" />,
            name: 'Quiz Mode',
            description: 'Test your knowledge',
            count: `${questions.length} questions`,
            color: 'bg-purple-500/10 border-purple-500/20',
            textColor: 'text-purple-400',
            path: '/(features)/quiz-mode',
        },
        {
            id: 'timed',
            icon: <Clock size={32} color="#fb923c" />,
            name: 'Timed Quiz',
            description: 'Beat the clock',
            count: '60 seconds',
            color: 'bg-orange-500/10 border-orange-500/20',
            textColor: 'text-orange-400',
            path: '/(features)/timed-quiz',
        },
        {
            id: 'ai',
            icon: <Brain size={32} color="#f472b6" />,
            name: 'AI Micro Learn',
            description: 'Learn in 2 minutes',
            count: 'AI-powered',
            color: 'bg-pink-500/10 border-pink-500/20',
            textColor: 'text-pink-400',
            disabled: true,
            path: '',
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4 py-4 border-b border-white/5">
                    <Pressable
                        onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')}
                        className="bg-white/5 self-start px-3 py-1.5 rounded-full border border-white/10 mb-4 flex-row items-center gap-2"
                    >
                        <ArrowLeft size={18} color="white" />
                        <Text className="font-semibold text-white/90">Back</Text>
                    </Pressable>

                    <View className="flex-row items-center gap-5">
                        <View className="w-20 h-20 rounded-2xl items-center justify-center border border-white/10 bg-white/5 shadow-lg relative overflow-hidden">
                            <LinearGradient
                                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                                className="absolute inset-0"
                            />
                            <Text className="text-5xl filter drop-shadow-lg">{subject.icon}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-3xl font-bold text-white text-glow mb-1">{subject.name}</Text>
                            <View className="bg-white/10 self-start px-2 py-0.5 rounded border border-white/10">
                                <Text className="text-gray-300 text-xs font-medium">Class {currentStudent.standard}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Stats */}
                <View className="px-4 py-6 flex-row gap-4">
                    <View className="flex-1 bg-blue-500/10 rounded-2xl p-5 border border-blue-500/20 backdrop-blur-sm">
                        <View className="bg-blue-500/20 w-10 h-10 rounded-full items-center justify-center mb-3 border border-blue-500/30 shadow-[0_0_10px_#3b82f6]">
                            <Text className="text-lg">📚</Text>
                        </View>
                        <Text className="text-[10px] text-blue-300 font-bold mb-1 tracking-wider">FLASHCARDS</Text>
                        <Text className="text-3xl font-bold text-white">{flashcards.length}</Text>
                    </View>
                    <View className="flex-1 bg-purple-500/10 rounded-2xl p-5 border border-purple-500/20 backdrop-blur-sm">
                        <View className="bg-purple-500/20 w-10 h-10 rounded-full items-center justify-center mb-3 border border-purple-500/30 shadow-[0_0_10px_#a855f7]">
                            <Text className="text-lg">❓</Text>
                        </View>
                        <Text className="text-[10px] text-purple-300 font-bold mb-1 tracking-wider">QUESTIONS</Text>
                        <Text className="text-3xl font-bold text-white">{questions.length}</Text>
                    </View>
                </View>

                {/* Learning Modes */}
                <View className="px-4 pb-8">
                    <Text className="text-xl font-bold text-white mb-5 flex-row items-center gap-2">
                        <Text>Choose Learning Mode</Text>
                    </Text>

                    <View className="gap-4">
                        {learningModes.map((mode) => (
                            <Pressable
                                key={mode.id}
                                onPress={() => {
                                    if (!mode.disabled) {
                                        router.push({
                                            pathname: mode.path as any,
                                            params: { subjectId },
                                        });
                                    }
                                }}
                                disabled={mode.disabled}
                                className={cn(
                                    'rounded-2xl border overflow-hidden backdrop-blur-md transition-all active:scale-[0.98]',
                                    mode.disabled
                                        ? 'bg-white/5 border-white/5 opacity-50'
                                        : 'bg-white/5 border-white/10 active:bg-white/10 active:border-white/20'
                                )}
                            >
                                <View className="p-5">
                                    <View className="flex-row items-center gap-5">
                                        <View className={cn(
                                            'w-16 h-16 rounded-2xl items-center justify-center border bg-opacity-20 shadow-lg',
                                            mode.disabled ? 'bg-gray-500/10 border-gray-500/20' : mode.color
                                        )}>
                                            {mode.icon}
                                        </View>

                                        <View className="flex-1">
                                            <Text className={cn("text-lg font-bold mb-1", mode.disabled ? "text-gray-500" : "text-white")}>{mode.name}</Text>
                                            <Text className="text-sm text-gray-400">{mode.description}</Text>
                                        </View>

                                        <View className={cn(
                                            'px-3.5 py-1.5 rounded-lg border',
                                            mode.disabled ? 'bg-white/5 border-white/5' : mode.color
                                        )}>
                                            <Text className={cn(
                                                'text-xs font-bold uppercase tracking-wide',
                                                mode.disabled ? 'text-gray-500' : mode.textColor
                                            )}>
                                                {mode.disabled ? 'Soon' : mode.count}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* No Content Warning */}
                {flashcards.length === 0 && questions.length === 0 && (
                    <View className="mx-4 mt-4 p-8 rounded-3xl bg-white/5 border border-dashed border-white/20 items-center">
                        <Text className="text-5xl mb-4 opacity-50 grayscale">📚</Text>
                        <Text className="text-xl font-bold mb-2 text-white">Content Coming Soon</Text>
                        <Text className="text-center text-gray-400 leading-6 px-4">
                            We're adding questions and flashcards for <Text className="text-white font-bold">{subject.name}</Text> Class {currentStudent.standard}.
                            Check back soon!
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
