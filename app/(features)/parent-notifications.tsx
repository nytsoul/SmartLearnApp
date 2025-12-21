import { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Award, TrendingDown, TrendingUp, Zap, CheckCircle, BookOpen } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

export default function ParentNotifications() {
    const router = useRouter();
    const { currentParent, students, activityLogs, updateParent } = useApp();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const child = useMemo(() =>
        students.find(s => s.id === currentParent?.childId),
        [students, currentParent]
    );

    // Generate notifications from activity logs
    const notifications = useMemo<Notification[]>(() => {
        if (!child || !currentParent) return [];

        const logs = activityLogs.filter(log => log.studentId === child.id);
        const parentNotifications: Notification[] = currentParent.notifications || [];

        // Generate daily summary notifications
        const today = new Date().toDateString();
        const todayLogs = logs.filter(log => new Date(log.completedAt).toDateString() === today);

        if (todayLogs.length > 0) {
            const totalXP = todayLogs.reduce((sum, log) => sum + log.xpEarned, 0);
            const totalCoins = todayLogs.reduce((sum, log) => sum + log.coinsEarned, 0);
            const quizCount = todayLogs.filter(log => log.type === 'quiz').length;

            parentNotifications.push({
                id: `daily-${today}`,
                type: 'daily-summary',
                title: '📊 Today\'s Activity',
                message: `${child.name} completed ${quizCount} quiz${quizCount !== 1 ? 'zes' : ''} today, earning ${totalXP} XP and ${totalCoins} coins!`,
                date: new Date().toISOString(),
                read: false,
            });
        }

        // Generate achievement notifications
        const recentAchievements = logs.filter(log =>
            log.type === 'achievement' &&
            new Date(log.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );

        recentAchievements.forEach(log => {
            parentNotifications.push({
                id: `achievement-${log.id}`,
                type: 'achievement',
                title: '🏆 New Achievement Unlocked!',
                message: `${child.name} earned a new badge! Congratulate them on this milestone.`,
                date: log.completedAt,
                read: false,
            });
        });

        // Generate low performance alerts
        const recentQuizzes = logs.filter(log =>
            log.type === 'quiz' &&
            new Date(log.completedAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        );

        const lowScoreQuizzes = recentQuizzes.filter(log => (log.score || 0) < 50);
        if (lowScoreQuizzes.length > 0) {
            const subject = lowScoreQuizzes[lowScoreQuizzes.length - 1].subjectName;
            parentNotifications.push({
                id: `low-performance-${subject}`,
                type: 'low-performance',
                title: '📉 Needs Attention',
                message: `${child.name} scored below 50% in ${subject}. Consider extra practice in this subject.`,
                date: lowScoreQuizzes[lowScoreQuizzes.length - 1].completedAt,
                read: false,
            });
        }

        // Streak notifications
        if (child.streak >= 7) {
            parentNotifications.push({
                id: `streak-${child.streak}`,
                type: 'streak',
                title: '🔥 Amazing Streak!',
                message: `${child.name} has maintained a ${child.streak}-day learning streak! Keep up the great work!`,
                date: new Date().toISOString(),
                read: false,
            });
        }

        // Sort by date (newest first)
        return parentNotifications.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [child, currentParent, activityLogs]);

    const filteredNotifications = useMemo(() => {
        if (filter === 'unread') {
            return notifications.filter(n => !n.read);
        }
        return notifications;
    }, [notifications, filter]);

    const markAllAsRead = () => {
        if (!currentParent) return;

        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
        const updatedParent = {
            ...currentParent,
            notifications: updatedNotifications,
        };
        updateParent(updatedParent);
    };

    const markAsRead = (notificationId: string) => {
        if (!currentParent) return;

        const updatedNotifications = notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        );
        const updatedParent = {
            ...currentParent,
            notifications: updatedNotifications,
        };
        updateParent(updatedParent);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'daily-summary':
                return <BookOpen size={20} color="#a855f7" />;
            case 'achievement':
                return <Award size={20} color="#facc15" />;
            case 'low-performance':
                return <TrendingDown size={20} color="#ef4444" />;
            case 'streak':
                return <Zap size={20} color="#ec4899" />;
            case 'quiz-completed':
                return <CheckCircle size={20} color="#4ade80" />;
            default:
                return <Bell size={20} color="#9ca3af" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'daily-summary':
                return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
            case 'achievement':
                return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
            case 'low-performance':
                return 'bg-red-500/20 border-red-500/30 text-red-400';
            case 'streak':
                return 'bg-pink-500/20 border-pink-500/30 text-pink-400';
            case 'quiz-completed':
                return 'bg-green-500/20 border-green-500/30 text-green-400';
            default:
                return 'bg-white/10 border-white/20 text-gray-400';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-4 border-b border-white/10">
                <View className="flex-row items-center justify-between mb-4">
                    <Pressable
                        onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/parent-dashboard')}
                        className="flex-row items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                    >
                        <ArrowLeft size={18} color="white" />
                        <Text className="font-semibold text-white/90">Back</Text>
                    </Pressable>
                    <Pressable onPress={markAllAsRead}>
                        <Text className="text-pink-400 font-semibold text-glow">Mark all read</Text>
                    </Pressable>
                </View>
                <View className="flex-row items-center gap-3">
                    <View className="bg-pink-500/20 rounded-full w-12 h-12 items-center justify-center border border-pink-500/30">
                        <Bell size={24} color="#ec4899" />
                    </View>
                    <View>
                        <Text className="text-2xl font-bold text-white text-glow">Notifications</Text>
                        <Text className="text-sm text-gray-400">
                            {notifications.filter(n => !n.read).length} unread
                        </Text>
                    </View>
                </View>
            </View>

            {/* Filter Tabs */}
            <View className="px-4 py-4 border-b border-white/5">
                <View className="flex-row bg-white/5 rounded-xl p-1 border border-white/10">
                    <Pressable
                        onPress={() => setFilter('all')}
                        className={`flex-1 py-2.5 rounded-lg ${filter === 'all' ? 'bg-white/10 border border-white/10' : ''}`}
                    >
                        <Text className={`text-center font-semibold text-sm ${filter === 'all' ? 'text-pink-400 text-glow' : 'text-gray-400'}`}>
                            All ({notifications.length})
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setFilter('unread')}
                        className={`flex-1 py-2.5 rounded-lg ${filter === 'unread' ? 'bg-white/10 border border-white/10' : ''}`}
                    >
                        <Text className={`text-center font-semibold text-sm ${filter === 'unread' ? 'text-pink-400 text-glow' : 'text-gray-400'}`}>
                            Unread ({notifications.filter(n => !n.read).length})
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Notifications List */}
            <ScrollView className="flex-1 px-4 py-4" contentContainerClassName="pb-6">
                {filteredNotifications.length > 0 ? (
                    <View className="gap-3">
                        {filteredNotifications.map((notification) => {
                            const date = new Date(notification.date);
                            const timeAgo = getTimeAgo(date);
                            const styles = getNotificationColor(notification.type);

                            return (
                                <Pressable
                                    key={notification.id}
                                    onPress={() => markAsRead(notification.id)}
                                    className={`rounded-2xl p-4 border transition-all active:bg-white/5 ${notification.read
                                            ? 'bg-transparent border-white/10'
                                            : 'bg-white/5 border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]'
                                        }`}
                                >
                                    <View className="flex-row items-start gap-3">
                                        <View className={cn('w-10 h-10 rounded-full items-center justify-center border', styles)}>
                                            {getNotificationIcon(notification.type)}
                                        </View>
                                        <View className="flex-1">
                                            <View className="flex-row items-center justify-between mb-1">
                                                <Text className="font-bold text-white flex-1 text-base">
                                                    {notification.title}
                                                </Text>
                                                {!notification.read && (
                                                    <View className="w-2 h-2 bg-pink-500 rounded-full ml-2 shadow-[0_0_5px_#ec4899]" />
                                                )}
                                            </View>
                                            <Text className="text-sm text-gray-300 mb-2 leading-5">
                                                {notification.message}
                                            </Text>
                                            <Text className="text-xs text-gray-500 font-medium">{timeAgo}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                ) : (
                    <View className="items-center justify-center py-20 opacity-50">
                        <Bell size={64} color="#ffffff" strokeWidth={1} style={{ opacity: 0.2 }} />
                        <Text className="text-gray-400 text-lg mt-6 font-medium">No notifications</Text>
                        <Text className="text-gray-500 text-center mt-2 px-10 leading-5">
                            {filter === 'unread'
                                ? 'All caught up! No unread notifications.'
                                : 'Notifications will appear here when your child is active.'}
                        </Text>
                    </View>
                )}
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
