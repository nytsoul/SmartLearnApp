import { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Users, BarChart3, BookOpen, TrendingUp, Upload, Brain, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getSubjectsForStandard } from '@/data/subjects';
import { cn } from '@/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAvatarById } from '@/data/avatars';
import { Card, CardContent } from '@/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeacherDashboard() {
    const router = useRouter();
    const { currentTeacher, students, quizResults, logout } = useApp();
    const [selectedStandard, setSelectedStandard] = useState<number>(5);

    // Redirect if no teacher logged in
    useEffect(() => {
        if (!currentTeacher) {
            router.replace('/(auth)/teacher-login');
        }
    }, [currentTeacher, router]);

    const classStudents = useMemo(() =>
        students.filter(s => s.standard === selectedStandard),
        [students, selectedStandard]
    );

    const classResults = useMemo(() =>
        quizResults.filter(r => r.standard === selectedStandard),
        [quizResults, selectedStandard]
    );

    const stats = useMemo(() => {
        const totalQuizzes = classResults.length;
        const avgScore = totalQuizzes > 0
            ? Math.round(classResults.reduce((acc, r) => acc + r.score, 0) / totalQuizzes)
            : 0;
        const activeStudents = new Set(classResults.map(r => r.studentId)).size;
        const topStudent = classStudents.sort((a, b) => b.xp - a.xp)[0];

        return { totalQuizzes, avgScore, activeStudents, topStudent };
    }, [classResults, classStudents]);

    const subjects = getSubjectsForStandard(selectedStandard);

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/role-selection');
    };

    const handleUploadPDF = () => {
        Alert.alert(
            'Upload PDF',
            'PDF upload and quiz generation feature coming soon!',
            [{ text: 'OK' }]
        );
    };

    // Don't render if no teacher
    if (!currentTeacher) {
        return null;
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 border-b border-white/10">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <View className="bg-purple-500/20 rounded-full w-14 h-14 items-center justify-center border border-purple-500/30">
                            <Text className="text-2xl">👩‍🏫</Text>
                        </View>
                        <View>
                            <Text className="font-bold text-xl text-white text-glow">{currentTeacher.name}</Text>
                            <Text className="text-sm text-gray-300">Teacher Dashboard</Text>
                        </View>
                    </View>
                    <Pressable onPress={handleLogout} className="p-2 bg-white/5 rounded-full border border-white/10 active:bg-white/10">
                        <LogOut size={20} color="#cbd5e1" />
                    </Pressable>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-5 py-6 gap-8">
                    {/* Class Selector */}
                    <View>
                        <Text className="text-xl font-bold text-white mb-4 pl-1">Select Class</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row gap-2">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((std) => (
                                    <Pressable
                                        key={std}
                                        onPress={() => setSelectedStandard(std)}
                                        className={cn(
                                            'px-6 py-3 rounded-xl min-w-[90px] items-center border',
                                            selectedStandard === std
                                                ? 'bg-purple-600 border-purple-400'
                                                : 'bg-white/5 border-white/10'
                                        )}
                                    >
                                        <Text className={cn(
                                            'font-semibold text-base',
                                            selectedStandard === std ? 'text-white' : 'text-gray-400'
                                        )}>
                                            Class {std}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Stats Overview */}
                    <View className="flex-row flex-wrap gap-3">
                        <Card className="flex-1 min-w-[47%] bg-blue-500/10 border-blue-500/20 backdrop-blur-md">
                            <CardContent className="p-5">
                                <Users size={28} color="#60a5fa" strokeWidth={2} />
                                <Text className="text-3xl font-bold text-white mt-3">{classStudents.length}</Text>
                                <Text className="text-sm text-blue-200 mt-1">Students</Text>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 min-w-[47%] bg-emerald-500/10 border-emerald-500/20 backdrop-blur-md">
                            <CardContent className="p-5">
                                <BarChart3 size={28} color="#34d399" strokeWidth={2} />
                                <Text className="text-3xl font-bold text-white mt-3">{stats.avgScore}%</Text>
                                <Text className="text-sm text-emerald-200 mt-1">Avg. Score</Text>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 min-w-[47%] bg-violet-500/10 border-violet-500/20 backdrop-blur-md">
                            <CardContent className="p-5">
                                <BookOpen size={28} color="#a78bfa" strokeWidth={2} />
                                <Text className="text-3xl font-bold text-white mt-3">{stats.totalQuizzes}</Text>
                                <Text className="text-sm text-violet-200 mt-1">Quizzes Taken</Text>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 min-w-[47%] bg-orange-500/10 border-orange-500/20 backdrop-blur-md">
                            <CardContent className="p-5">
                                <TrendingUp size={28} color="#fb923c" strokeWidth={2} />
                                <Text className="text-3xl font-bold text-white mt-3">{stats.activeStudents}</Text>
                                <Text className="text-sm text-orange-200 mt-1">Active Students</Text>
                            </CardContent>
                        </Card>
                    </View>

                    {/* Subject Overview */}
                    <View>
                        <Text className="text-xl font-bold text-white mb-4 pl-1">Subject Overview</Text>
                        <View className="flex-row flex-wrap gap-3">
                            {subjects.map((subject) => {
                                const subjectResults = classResults.filter(r => r.subjectId === subject.id);
                                const subjectAvg = subjectResults.length > 0
                                    ? Math.round(subjectResults.reduce((a, r) => a + r.score, 0) / subjectResults.length)
                                    : null;

                                return (
                                    <View
                                        key={subject.id}
                                        className="w-[48%] bg-white/5 p-4 rounded-2xl border border-white/10"
                                    >
                                        <Text className="text-4xl mb-3">{subject.icon}</Text>
                                        <Text className="font-bold text-base text-white mb-2" numberOfLines={1}>
                                            {subject.name}
                                        </Text>
                                        {subjectAvg !== null ? (
                                            <>
                                                <View className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                                                    <View
                                                        className={cn(
                                                            'h-full rounded-full',
                                                            subjectAvg >= 70 ? 'bg-green-500' :
                                                                subjectAvg >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                        )}
                                                        style={{ width: `${subjectAvg}%` }}
                                                    />
                                                </View>
                                                <Text className="text-sm text-gray-300">
                                                    Avg: {subjectAvg}% ({subjectResults.length})
                                                </Text>
                                            </>
                                        ) : (
                                            <Text className="text-sm text-gray-500">No data yet</Text>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Top Performer */}
                    {stats.topStudent && (
                        <Card className="bg-yellow-500/10 border-yellow-500/20 overflow-hidden">
                            <LinearGradient
                                colors={['rgba(234, 179, 8, 0.1)', 'transparent']}
                                className="absolute inset-0"
                            />
                            <CardContent className="p-5 flex-row items-center gap-4">
                                <View className="bg-yellow-500/20 w-16 h-16 rounded-full items-center justify-center border border-yellow-500/30">
                                    <Text className="text-3xl">🏆</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm text-yellow-200 font-medium">Top Performer - Class {selectedStandard}</Text>
                                    <Text className="text-2xl font-bold text-white mb-1 text-glow">{stats.topStudent.name}</Text>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-purple-300 font-semibold">{stats.topStudent.xp} XP</Text>
                                        <Text className="text-white/20">•</Text>
                                        <Text className="text-orange-300 font-semibold">{stats.topStudent.streak} day streak</Text>
                                    </View>
                                </View>
                            </CardContent>
                        </Card>
                    )}

                    {/* Student List */}
                    <View>
                        <Text className="text-xl font-bold text-white mb-4 pl-1">Students</Text>
                        {classStudents.length > 0 ? (
                            <View className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                {/* Header */}
                                <View className="flex-row bg-white/5 px-4 py-3 border-b border-white/10">
                                    <Text className="flex-1 font-semibold text-gray-300">Student</Text>
                                    <Text className="w-16 font-semibold text-gray-300 text-center">XP</Text>
                                    <Text className="w-16 font-semibold text-gray-300 text-center">Streak</Text>
                                </View>
                                {/* Students */}
                                {classStudents.sort((a, b) => b.xp - a.xp).map((student, i) => {
                                    const avatarData = getAvatarById(student.avatar);
                                    return (
                                        <View
                                            key={student.id}
                                            className={cn(
                                                'flex-row px-4 py-3 items-center',
                                                i !== classStudents.length - 1 && 'border-b border-white/5'
                                            )}
                                        >
                                            <View className="flex-1 flex-row items-center gap-3">
                                                <Text className="text-xl">{avatarData?.emoji || '👤'}</Text>
                                                <View className="flex-1">
                                                    <View className="flex-row items-center gap-2">
                                                        <Text className="font-semibold text-white" numberOfLines={1}>
                                                            {student.name}
                                                        </Text>
                                                        {i < 3 && (
                                                            <Text className="text-xs">
                                                                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                            <Text className="w-16 text-purple-400 font-bold text-center">{student.xp}</Text>
                                            <Text className="w-16 text-orange-400 font-bold text-center">{student.streak}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <View className="bg-white/5 rounded-2xl border border-white/10 p-8 items-center">
                                <View className="bg-white/10 rounded-full p-4 mb-3">
                                    <Users size={32} color="#94a3b8" />
                                </View>
                                <Text className="text-lg font-bold text-white mb-1">No Students Yet</Text>
                                <Text className="text-gray-400 text-center">
                                    Students in Class {selectedStandard} will appear here once they create profiles.
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Quiz Management */}
                    <View className="mb-6 mt-2">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xl font-bold text-white pl-1">Quiz Management</Text>
                            <Pressable
                                onPress={handleUploadPDF}
                                className="bg-blue-600 px-4 py-2.5 rounded-xl flex-row items-center gap-2 active:bg-blue-700 border border-blue-500/50 shadow-lg shadow-blue-500/20"
                            >
                                <Upload size={18} color="white" />
                                <Text className="text-white font-semibold text-sm">Upload PDF</Text>
                            </Pressable>
                        </View>

                        {/* Empty State */}
                        <View className="bg-white/5 rounded-2xl border border-white/10 p-8 items-center">
                            <View className="bg-white/10 rounded-full p-4 mb-3">
                                <Brain size={32} color="#94a3b8" />
                            </View>
                            <Text className="text-lg font-bold text-white mb-2">No Quizzes Generated Yet</Text>
                            <Text className="text-gray-400 text-center mb-6">
                                Upload a PDF to automatically generate quiz questions for Class {selectedStandard}
                            </Text>
                            <Pressable
                                onPress={handleUploadPDF}
                                className="bg-blue-600 px-6 py-3 rounded-xl flex-row items-center gap-2 active:bg-blue-700 border border-blue-500/50 shadow-lg shadow-blue-500/20"
                            >
                                <Upload size={18} color="white" />
                                <Text className="text-white font-semibold">Generate Your First Quiz</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
