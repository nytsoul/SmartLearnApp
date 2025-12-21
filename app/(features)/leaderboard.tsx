import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trophy } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { LeaderboardCard } from '@/components/shared/LeaderboardCard';
import { LeaderboardEntry } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function Leaderboard() {
    const router = useRouter();
    const { currentStudent, students } = useApp();

    const leaderboard = useMemo<LeaderboardEntry[]>(() => {
        // Filter students by same standard and sort by XP
        const classmates = currentStudent
            ? students.filter(s => s.standard === currentStudent.standard)
            : students;

        return classmates
            .sort((a, b) => b.xp - a.xp)
            .map((student, index) => ({
                rank: index + 1,
                studentId: student.id,
                studentName: student.name,
                avatar: student.avatar,
                xp: student.xp,
                streak: student.streak,
            }));
    }, [students, currentStudent]);

    const currentUserRank = leaderboard.find(e => e.studentId === currentStudent?.id)?.rank;

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4 py-4 border-b border-white/10">
                    <Pressable
                        onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')}
                        className="flex-row items-center gap-2 mb-3 bg-white/5 self-start px-3 py-1.5 rounded-full border border-white/10"
                    >
                        <ArrowLeft size={18} color="white" />
                        <Text className="font-semibold text-white">Back</Text>
                    </Pressable>

                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-2xl font-bold text-white text-glow">Leaderboard</Text>
                            <Text className="text-sm text-gray-300 mt-1">
                                {currentStudent ? `Class ${currentStudent.standard} Rankings` : 'All Students'}
                            </Text>
                        </View>
                        <View className="bg-yellow-500/20 rounded-full p-3 border border-yellow-500/30">
                            <Trophy size={32} color="#facc15" />
                        </View>
                    </View>
                </View>

                <View className="px-4 py-4">
                    {/* User's Rank Card */}
                    {currentStudent && currentUserRank && (
                        <View className="rounded-2xl p-5 mb-4 border border-white/10 relative overflow-hidden">
                            <LinearGradient
                                colors={['#4c1d95', '#2e1065']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="absolute inset-0 opacity-80"
                            />
                            <Text className="text-white/60 text-[10px] font-bold mb-2 tracking-widest">YOUR RANK</Text>
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-4">
                                    <View className="bg-white/10 rounded-full px-4 py-2 border border-white/20">
                                        <Text className="text-3xl font-bold text-white">#{currentUserRank}</Text>
                                    </View>
                                    <View>
                                        <Text className="font-bold text-xl text-white">{currentStudent.name}</Text>
                                        <Text className="text-purple-200 font-medium">
                                            {currentStudent.xp.toLocaleString()} XP
                                        </Text>
                                    </View>
                                </View>
                                {currentUserRank <= 3 && (
                                    <Text className="text-5xl">
                                        {currentUserRank === 1 ? '🥇' : currentUserRank === 2 ? '🥈' : '🥉'}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Top 3 Podium */}
                    {leaderboard.length >= 3 && (
                        <View className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10 shadow-lg backdrop-blur-md">
                            <Text className="font-bold text-base mb-6 text-center text-white/90 uppercase tracking-widest">Top 3 Champions</Text>
                            <View className="flex-row items-end justify-center gap-2">
                                {/* 2nd Place */}
                                <View className="items-center flex-1">
                                    <Text className="text-4xl mb-3">🥈</Text>
                                    <View className="bg-white/5 w-full items-center p-3 rounded-t-lg border-t border-x border-white/10 h-28 justify-end">
                                        <Text className="font-bold text-sm text-center text-white w-full" numberOfLines={1}>
                                            {leaderboard[1].studentName}
                                        </Text>
                                        <Text className="text-xs text-gray-400 mt-1">{leaderboard[1].xp} XP</Text>
                                    </View>
                                </View>

                                {/* 1st Place */}
                                <View className="items-center flex-1 z-10">
                                    <Text className="text-6xl mb-3 shadow-lg">🥇</Text>
                                    <View className="bg-yellow-500/20 w-full items-center p-3 rounded-t-lg border-t border-x border-yellow-500/30 h-36 justify-end relative">
                                        <LinearGradient
                                            colors={['rgba(234, 179, 8, 0.2)', 'transparent']}
                                            className="absolute inset-0"
                                        />
                                        <Text className="font-bold text-base text-center text-white w-full" numberOfLines={1}>
                                            {leaderboard[0].studentName}
                                        </Text>
                                        <Text className="text-xs text-yellow-200 mt-1 font-bold">{leaderboard[0].xp} XP</Text>
                                    </View>
                                </View>

                                {/* 3rd Place */}
                                <View className="items-center flex-1">
                                    <Text className="text-4xl mb-3">🥉</Text>
                                    <View className="bg-white/5 w-full items-center p-3 rounded-t-lg border-t border-x border-white/10 h-24 justify-end">
                                        <Text className="font-bold text-sm text-center text-white w-full" numberOfLines={1}>
                                            {leaderboard[2].studentName}
                                        </Text>
                                        <Text className="text-xs text-gray-400 mt-1">{leaderboard[2].xp} XP</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Full Leaderboard */}
                    <View className="gap-3 pb-8">
                        {leaderboard.map((entry) => (
                            <LeaderboardCard
                                key={entry.studentId}
                                entry={entry}
                                isCurrentUser={entry.studentId === currentStudent?.id}
                            />
                        ))}

                        {leaderboard.length === 0 && (
                            <View className="items-center py-12">
                                <Text className="text-6xl mb-4">🏆</Text>
                                <Text className="text-xl font-bold mb-2 text-white">No Rankings Yet</Text>
                                <Text className="text-gray-400 text-center">
                                    Complete quizzes to appear on the leaderboard!
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
