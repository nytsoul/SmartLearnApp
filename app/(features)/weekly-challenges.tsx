import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trophy, Target, Flame, Users, Clock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';

interface Challenge {
    id: string;
    title: string;
    description: string;
    type: 'weekly' | 'monthly' | 'special';
    goal: number;
    current: number;
    reward: { xp: number; coins: number };
    icon: string;
    color: string;
    endDate: string;
}

const challenges: Challenge[] = [
    {
        id: 'weekly-1',
        title: 'Math Week Champion',
        description: 'Complete 10 math quizzes with 80%+ score',
        type: 'weekly',
        goal: 10,
        current: 3,
        reward: { xp: 200, coins: 50 },
        icon: '🔢',
        color: 'blue',
        endDate: '2025-12-22',
    },
    {
        id: 'weekly-2',
        title: 'Science Explorer',
        description: 'Study 20 science flashcards',
        type: 'weekly',
        goal: 20,
        current: 12,
        reward: { xp: 150, coins: 30 },
        icon: '🔬',
        color: 'green',
        endDate: '2025-12-22',
    },
    {
        id: 'weekly-3',
        title: 'Perfect Streak',
        description: 'Maintain 7-day learning streak',
        type: 'weekly',
        goal: 7,
        current: 5,
        reward: { xp: 300, coins: 75 },
        icon: '🔥',
        color: 'orange',
        endDate: '2025-12-22',
    },
    {
        id: 'monthly-1',
        title: 'Quiz Master',
        description: 'Complete 50 quizzes this month',
        type: 'monthly',
        goal: 50,
        current: 18,
        reward: { xp: 500, coins: 150 },
        icon: '📚',
        color: 'purple',
        endDate: '2025-12-31',
    },
    {
        id: 'monthly-2',
        title: 'All-Round Scholar',
        description: 'Score 90%+ in all subjects',
        type: 'monthly',
        goal: 6,
        current: 2,
        reward: { xp: 1000, coins: 300 },
        icon: '🎯',
        color: 'pink',
        endDate: '2025-12-31',
    },
    {
        id: 'special-1',
        title: 'Tamil Nadu Quiz Battle',
        description: 'Be in top 100 on leaderboard',
        type: 'special',
        goal: 1,
        current: 0,
        reward: { xp: 2000, coins: 500 },
        icon: '🏆',
        color: 'yellow',
        endDate: '2025-12-25',
    },
];

const colorClasses = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', progress: 'bg-blue-500' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', progress: 'bg-green-500' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', progress: 'bg-orange-500' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', progress: 'bg-purple-500' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400', progress: 'bg-pink-500' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', progress: 'bg-yellow-500' },
};

export default function WeeklyChallenges() {
    const router = useRouter();
    const { currentStudent } = useApp();
    const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'special'>('weekly');

    if (!currentStudent) {
        router.replace('/(auth)/student-login');
        return null;
    }

    const filteredChallenges = challenges.filter(c => c.type === selectedTab);

    const getDaysLeft = (endDate: string) => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 border-b border-white/10">
                <View className="flex-row items-center mb-6">
                    <Pressable onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')} className="mr-4 bg-white/5 p-2 rounded-full border border-white/10">
                        <ArrowLeft size={20} color="white" />
                    </Pressable>
                    <View className="flex-row items-center gap-3">
                        <View className="bg-yellow-500/20 rounded-full w-12 h-12 items-center justify-center border border-yellow-500/30">
                            <Trophy size={24} color="#facc15" />
                        </View>
                        <View>
                            <Text className="text-2xl font-bold text-white text-glow">Challenges</Text>
                            <Text className="text-gray-400 leading-4">Complete to earn rewards</Text>
                        </View>
                    </View>
                </View>

                {/* Tab Selector */}
                <View className="flex-row bg-white/5 rounded-2xl p-1 border border-white/10">
                    <Pressable
                        onPress={() => setSelectedTab('weekly')}
                        className={`flex-1 py-3 rounded-xl ${selectedTab === 'weekly' ? 'bg-white/10 border border-white/10' : ''}`}
                    >
                        <Text className={`text-center font-semibold ${selectedTab === 'weekly' ? 'text-purple-400 text-glow' : 'text-gray-400'}`}>
                            Weekly
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setSelectedTab('monthly')}
                        className={`flex-1 py-3 rounded-xl ${selectedTab === 'monthly' ? 'bg-white/10 border border-white/10' : ''}`}
                    >
                        <Text className={`text-center font-semibold ${selectedTab === 'monthly' ? 'text-purple-400 text-glow' : 'text-gray-400'}`}>
                            Monthly
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setSelectedTab('special')}
                        className={`flex-1 py-3 rounded-xl ${selectedTab === 'special' ? 'bg-white/10 border border-white/10' : ''}`}
                    >
                        <Text className={`text-center font-semibold ${selectedTab === 'special' ? 'text-purple-400 text-glow' : 'text-gray-400'}`}>
                            Special
                        </Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-5 py-6 gap-4">
                    {filteredChallenges.map((challenge) => {
                        const colors = colorClasses[challenge.color as keyof typeof colorClasses];
                        const progress = (challenge.current / challenge.goal) * 100;
                        const daysLeft = getDaysLeft(challenge.endDate);
                        const isCompleted = challenge.current >= challenge.goal;

                        return (
                            <View
                                key={challenge.id}
                                className={cn(
                                    'rounded-2xl border p-5 backdrop-blur-md',
                                    colors.bg,
                                    colors.border
                                )}
                            >
                                {/* Header */}
                                <View className="flex-row items-start justify-between mb-3">
                                    <View className="flex-1">
                                        <View className="flex-row items-center gap-3 mb-2">
                                            <Text className="text-3xl filter drop-shadow-md">{challenge.icon}</Text>
                                            <Text className="text-lg font-bold text-white flex-1 text-glow" numberOfLines={1}>
                                                {challenge.title}
                                            </Text>
                                        </View>
                                        <Text className="text-gray-300 mb-4 leading-5">{challenge.description}</Text>
                                    </View>
                                </View>

                                {/* Progress */}
                                <View className="mb-4">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className={cn('font-bold', colors.text)}>
                                            {challenge.current} / {challenge.goal}
                                        </Text>
                                        <Text className="text-sm text-gray-400">
                                            {Math.round(progress)}%
                                        </Text>
                                    </View>
                                    <View className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                        <View
                                            className={cn('h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]', colors.progress)}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </View>
                                </View>

                                {/* Footer */}
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-4">
                                        <View className="flex-row items-center gap-1.5 bg-purple-500/20 px-2 py-1 rounded-lg border border-purple-500/30">
                                            <Text className="text-sm">⚡</Text>
                                            <Text className="font-bold text-purple-300 text-xs">+{challenge.reward.xp}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-1.5 bg-orange-500/20 px-2 py-1 rounded-lg border border-orange-500/30">
                                            <Text className="text-sm">🪙</Text>
                                            <Text className="font-bold text-orange-300 text-xs">+{challenge.reward.coins}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                                        <Clock size={14} color="#9ca3af" />
                                        <Text className="text-xs text-gray-400 font-medium">{daysLeft}d left</Text>
                                    </View>
                                </View>

                                {/* Completed Badge */}
                                {isCompleted && (
                                    <View className="mt-4 bg-green-500/80 py-2 rounded-xl backdrop-blur-sm border border-green-400/50 shadow-lg">
                                        <Text className="text-center font-bold text-white tracking-widest text-xs">✓ COMPLETED</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}

                    {/* Info Card */}
                    <View className="relative bg-white/5 rounded-2xl p-1 mt-4 border border-white/10 overflow-hidden">
                        <LinearGradient
                            colors={['rgba(168, 85, 247, 0.4)', 'rgba(236, 72, 153, 0.4)']}
                            className="absolute inset-0"
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <View className="p-5 backdrop-blur-md rounded-xl bg-black/20">
                            <View className="flex-row items-center gap-3 mb-4 border-b border-white/10 pb-3">
                                <Target size={24} color="#f0abfc" />
                                <Text className="text-xl font-bold text-white text-glow">Challenge Tips</Text>
                            </View>
                            <View className="gap-2.5">
                                <Text className="text-gray-200 text-sm font-medium">• New challenges every week!</Text>
                                <Text className="text-gray-200 text-sm font-medium">• Complete all to unlock special badges</Text>
                                <Text className="text-gray-200 text-sm font-medium">• Bigger rewards for harder challenges</Text>
                                <Text className="text-gray-200 text-sm font-medium">• Share with friends to compete together</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
