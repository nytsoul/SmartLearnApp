import { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Heart, Award, Clock, TrendingUp, BookOpen, Zap, Target, Bell, Activity, CheckCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { getAvatarById } from '@/data/avatars';
import { getSubjectsForStandard } from '@/data/subjects';
import { cn } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';

export default function ParentDashboard() {
    const router = useRouter();
    const { currentParent, students, quizResults, activityLogs, logout, isDarkMode } = useApp();
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

    // Redirect if no parent logged in
    useEffect(() => {
        if (!currentParent) {
            router.replace('/(auth)/parent-login');
        }
    }, [currentParent, router]);

    const child = useMemo(() =>
        students.find(s => s.id === currentParent?.childId),
        [students, currentParent]
    );

    const childResults = useMemo(() =>
        quizResults.filter(r => r.studentId === currentParent?.childId),
        [quizResults, currentParent]
    );

    const stats = useMemo(() => {
        if (!child) return null;

        const totalQuizzes = childResults.length;
        const avgScore = totalQuizzes > 0
            ? Math.round(childResults.reduce((acc, r) => acc + r.score, 0) / totalQuizzes)
            : 0;
        const totalTimeMinutes = totalQuizzes * 5; // Estimate 5 min per quiz
        const subjectsAttempted = new Set(childResults.map(r => r.subjectId)).size;

        // Subject performance
        const subjects = getSubjectsForStandard(child.standard);
        const subjectPerformance = subjects.map(subject => {
            const subjectResults = childResults.filter(r => r.subjectId === subject.id);
            const avgScore = subjectResults.length > 0
                ? Math.round(subjectResults.reduce((a, r) => a + r.score, 0) / subjectResults.length)
                : null;
            return {
                ...subject,
                avgScore,
                attempts: subjectResults.length,
            };
        }).filter(s => s.avgScore !== null);

        // Strengths & weaknesses
        const sortedSubjects = [...subjectPerformance].sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0));
        const strengths = sortedSubjects.slice(0, 2);
        const weaknesses = sortedSubjects.slice(-2).reverse();

        return {
            totalQuizzes,
            avgScore,
            totalTimeMinutes,
            subjectsAttempted,
            subjectPerformance,
            strengths,
            weaknesses,
        };
    }, [child, childResults]);

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/role-selection');
    };

    if (!currentParent || !child) {
        return null;
    }

    const avatar = getAvatarById(child.avatar);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 border-b border-border/50">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4">
                        <View className="bg-pink-500/20 rounded-full w-14 h-14 items-center justify-center border border-pink-500/30">
                            <Heart size={28} color="#ec4899" />
                        </View>
                        <View>
                            <Text className="font-bold text-xl text-foreground text-glow">{currentParent.name}</Text>
                            <Text className="text-sm text-muted-foreground">Parent Dashboard</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <Pressable
                            onPress={() => router.push('/(features)/parent-notifications')}
                            className="p-2.5 bg-pink-500/10 rounded-full border border-pink-500/20"
                        >
                            <Bell size={22} color="#ec4899" />
                        </Pressable>
                        <Pressable onPress={handleLogout} className="p-2.5 bg-card rounded-full border border-border items-center justify-center active:bg-muted">
                            <LogOut size={22} color={isDarkMode ? "#cbd5e1" : "#475569"} />
                        </Pressable>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-5 py-6 gap-6">
                    {/* Child Info Card */}
                    <View className="relative rounded-3xl overflow-hidden border border-white/10 shadow-lg">
                        <LinearGradient
                            colors={['#db2777', '#9333ea']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="absolute inset-0 opacity-90"
                        />
                        <View className="p-6 flex-row items-center gap-5">
                            <View className="bg-white/90 rounded-full p-3 shadow-xl">
                                <Text className="text-5xl">{avatar?.emoji || '👤'}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-2xl font-bold text-glow">{child.name}</Text>
                                <Text className="text-pink-100 mb-3 font-medium">Class {child.standard} Student</Text>
                                <View className="flex-row gap-3">
                                    <View className="bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                        <Text className="text-white font-bold text-xs">{child.xp} XP</Text>
                                    </View>
                                    <View className="bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                        <Text className="text-white font-bold text-xs">{child.streak}🔥 Streak</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Period Selector */}
                    <View className="flex-row bg-card rounded-2xl p-1 border border-border">
                        <Pressable
                            onPress={() => setSelectedPeriod('week')}
                            className={`flex-1 py-3 rounded-xl transition-all ${selectedPeriod === 'week' ? 'bg-muted border border-border/50 shadow-sm' : ''}`}
                        >
                            <Text className={`text-center font-semibold ${selectedPeriod === 'week' ? 'text-pink-500 text-glow' : 'text-muted-foreground'}`}>
                                This Week
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setSelectedPeriod('month')}
                            className={`flex-1 py-3 rounded-xl transition-all ${selectedPeriod === 'month' ? 'bg-muted border border-border/50 shadow-sm' : ''}`}
                        >
                            <Text className={`text-center font-semibold ${selectedPeriod === 'month' ? 'text-pink-500 text-glow' : 'text-muted-foreground'}`}>
                                This Month
                            </Text>
                        </Pressable>
                    </View>

                    {/* Stats Overview */}
                    <View className="flex-row flex-wrap gap-3">
                        <View className="flex-1 min-w-[47%] bg-card p-5 rounded-2xl border border-border backdrop-blur-sm">
                            <BookOpen size={28} color="#a855f7" strokeWidth={2} />
                            <Text className="text-3xl font-bold text-foreground mt-3 text-glow">{stats?.totalQuizzes || 0}</Text>
                            <Text className="text-sm text-muted-foreground mt-1 uppercase tracking-wide font-bold text-[10px]">Quizzes Taken</Text>
                        </View>
                        <View className="flex-1 min-w-[47%] bg-card p-5 rounded-2xl border border-border backdrop-blur-sm">
                            <Award size={28} color="#10b981" strokeWidth={2} />
                            <Text className="text-3xl font-bold text-foreground mt-3 text-glow">{stats?.avgScore || 0}%</Text>
                            <Text className="text-sm text-muted-foreground mt-1 uppercase tracking-wide font-bold text-[10px]">Avg. Score</Text>
                        </View>
                        <View className="flex-1 min-w-[47%] bg-card p-5 rounded-2xl border border-border backdrop-blur-sm">
                            <Clock size={28} color="#facc15" strokeWidth={2} />
                            <Text className="text-3xl font-bold text-foreground mt-3 text-glow">{stats?.totalTimeMinutes || 0}</Text>
                            <Text className="text-sm text-muted-foreground mt-1 uppercase tracking-wide font-bold text-[10px]">Minutes Studied</Text>
                        </View>
                        <View className="flex-1 min-w-[47%] bg-card p-5 rounded-2xl border border-border backdrop-blur-sm">
                            <Zap size={28} color="#ec4899" strokeWidth={2} />
                            <Text className="text-3xl font-bold text-foreground mt-3 text-glow">{stats?.subjectsAttempted || 0}</Text>
                            <Text className="text-sm text-muted-foreground mt-1 uppercase tracking-wide font-bold text-[10px]">Subjects</Text>
                        </View>
                    </Vie                    {/* Strengths */}
                    {stats && stats.strengths.length > 0 && (
                        <View>
                            <Text className="text-lg font-bold text-foreground mb-4 flex-row items-center gap-2">
                                <Text>💪 Strengths</Text>
                            </Text>
                            <View className="gap-3">
                                {stats.strengths.map((subject) => (
                                    <View key={subject.id} className="bg-green-500/10 p-5 rounded-2xl border border-green-500/20 backdrop-blur-sm">
                                        <View className="flex-row items-center gap-4">
                                            <Text className="text-4xl filter drop-shadow-md">{subject.icon}</Text>
                                            <View className="flex-1">
                                                <Text className="font-bold text-foreground text-lg mb-2">{subject.name}</Text>
                                                <View className="flex-row items-center gap-3">
                                                    <View className="flex-1 h-2.5 bg-green-500/20 rounded-full overflow-hidden border border-green-500/10">
                                                        <View
                                                            className="h-full bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"
                                                            style={{ width: `${subject.avgScore}%` as any }}
                                                        />
                                                    </View>
                                                    <Text className="font-bold text-green-500 text-sm">{subject.avgScore}%</Text>
                                                </View>
                                                <Text className="text-xs text-muted-foreground mt-2 font-medium bg-muted self-start px-2 py-0.5 rounded-md border border-border">{subject.attempts} quizzes</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                      {/* Needs Improvement */}
                    {stats && stats.weaknesses.length > 0 && (
                        <View>
                            <Text className="text-lg font-bold text-foreground mb-4">📚 Needs Improvement</Text>
                            <View className="gap-3">
                                {stats.weaknesses.map((subject) => (
                                    <View key={subject.id} className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20 backdrop-blur-sm">
                                        <View className="flex-row items-center gap-4">
                                            <Text className="text-4xl filter drop-shadow-md">{subject.icon}</Text>
                                            <View className="flex-1">
                                                <Text className="font-bold text-foreground text-lg mb-2">{subject.name}</Text>
                                                <View className="flex-row items-center gap-3">
                                                    <View className="flex-1 h-2.5 bg-orange-500/20 rounded-full overflow-hidden border border-orange-500/10">
                                                        <View
                                                            className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]"
                                                            style={{ width: `${subject.avgScore}%` as any }}
                                                        />
                                                    </View>
                                                    <Text className="font-bold text-orange-500 text-sm">{subject.avgScore}%</Text>
                                                </View>
                                                <Text className="text-xs text-muted-foreground mt-2 font-medium bg-muted self-start px-2 py-0.5 rounded-md border border-border">{subject.attempts} quizzes</Text>
                                            </View>
                                        </View>
                            </View>
                        </View>
                    )}

                    {/* Recommendations */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-foreground mb-4">💡 Recommendations</Text>
                        <View className="bg-card rounded-2xl border border-border overflow-hidden backdrop-blur-md">
                            <View className="p-5 border-b border-border flex-row items-center gap-4">
                                <View className="bg-purple-500/20 p-2.5 rounded-full border border-purple-500/30"><Target size={24} color="#a855f7" /></View>
                                <View className="flex-1">
                                    <Text className="font-bold text-foreground mb-0.5">Keep up the streak!</Text>
                                    <Text className="text-sm text-muted-foreground leading-4">Encourage daily practice to maintain {child.streak}-day streak</Text>
                                </View>
                            </View>
                            <View className="p-5 border-b border-border flex-row items-center gap-4">
                                <View className="bg-green-500/20 p-2.5 rounded-full border border-green-500/30"><TrendingUp size={24} color="#4ade80" /></View>
                                <View className="flex-1">
                                    <Text className="font-bold text-foreground mb-0.5">Focus on weak subjects</Text>
                                    <Text className="text-sm text-muted-foreground leading-4">Spend extra time on subjects with lower scores</Text>
                                </View>
                            </View>
                            <View className="p-5 flex-row items-center gap-4">
                                <View className="bg-yellow-500/20 p-2.5 rounded-full border border-yellow-500/30"><Award size={24} color="#facc15" /></View>
                                <View className="flex-1">
                                    <Text className="font-bold text-foreground mb-0.5">Celebrate achievements</Text>
                                    <Text className="text-sm text-muted-foreground leading-4">Motivate with rewards for badges earned</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Recent Activity */}
                    <View>
                        <Text className="text-lg font-bold text-foreground mb-4">📊 Recent Activity</Text>
                        <View className="bg-card rounded-2xl border border-border overflow-hidden backdrop-blur-md">
                            {activityLogs
                                .filter(log => log.studentId === child.id)
                                .slice(0, 5)
                                .map((log, index) => {
                                    const isLast = index === Math.min(4, activityLogs.filter(l => l.studentId === child.id).length - 1);
                                    const date = new Date(log.completedAt);
                                    const timeAgo = getTimeAgo(date);

                                    return (
                                        <View
                                            key={log.id}
                                            className={`p-5 flex-row items-center gap-4 ${!isLast ? 'border-b border-border' : ''}`}
                                        >
                                            <View className={`w-12 h-12 rounded-full items-center justify-center border bg-opacity-20 ${log.type === 'quiz' ? 'bg-purple-500/20 border-purple-500/30' :
                                                    log.type === 'study' ? 'bg-blue-500/20 border-blue-500/30' :
                                                        log.type === 'achievement' ? 'bg-yellow-500/20 border-yellow-500/30' :
                                                            'bg-pink-500/20 border-pink-500/30'
                                                }`}>
                                                {log.type === 'quiz' && <BookOpen size={20} color="#a855f7" />}
                                                {log.type === 'study' && <Activity size={20} color="#3b82f6" />}
                                                {log.type === 'achievement' && <Award size={20} color="#facc15" />}
                                                {log.type === 'daily-challenge' && <Zap size={20} color="#ec4899" />}
                                            </View>
                                            <View className="flex-1">
                                                <Text className="font-bold text-foreground text-base">
                                                    {log.type === 'quiz' && `Completed ${log.subjectName} Quiz`}
                                                    {log.type === 'study' && `Studied ${log.subjectName}`}
                                                    {log.type === 'achievement' && 'Unlocked Achievement'}
                                                    {log.type === 'daily-challenge' && 'Completed Daily Challenge'}
                                                </Text>
                                                <View className="flex-row items-center gap-2 mt-1">
                                                    {log.score !== undefined && (
                                                        <Text className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">Score: {log.score}%</Text>
                                                    )}
                                                    <Text className="text-xs text-muted-foreground">• {timeAgo}</Text>
                                                </View>
                                                <View className="flex-row items-center gap-3 mt-1.5">
                                                    <Text className="text-xs text-primary font-bold">+{log.xpEarned} XP</Text>
                                                    <Text className="text-xs text-yellow-500 font-bold">+{log.coinsEarned} Coins</Text>
                                                </View>
                                            </View>
                                            <CheckCircle size={20} color="#4ade80" />
                                        </View>
                                    );
                                })}
                            {activityLogs.filter(log => log.studentId === child.id).length === 0 && (
                                <View className="p-10 items-center opacity-50">
                                    <Activity size={48} color={isDarkMode ? "#94a3b8" : "#64748b"} />
                                    <Text className="text-muted-foreground mt-4 text-center font-medium text-lg">No activity yet</Text>
                                    <Text className="text-sm text-muted-foreground text-center mt-1">Activity will appear here once your child starts learning</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}
