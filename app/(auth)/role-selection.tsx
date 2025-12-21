import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GraduationCap, Users, BookOpen, Trophy, Zap, Download, Wifi } from 'lucide-react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { useApp } from '@/contexts/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoleSelection() {
    const router = useRouter();
    const { setCurrentRole } = useApp();

    const handleSelectRole = (role: 'student' | 'teacher' | 'parent') => {
        setCurrentRole(role);
        if (role === 'student') router.push('/(auth)/student-login');
        else if (role === 'teacher') router.push('/(auth)/teacher-login');
        else if (role === 'parent') router.push('/(auth)/parent-login');
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
                {/* Header */}
                <View className="items-center mb-8 pt-4">
                    <View className="bg-blue-600 rounded-xl p-3 mb-4 shadow-lg shadow-blue-500/50">
                        <BookOpen size={32} color="white" />
                    </View>
                    <View className="flex-row items-center gap-2 mb-2">
                        <Text className="text-3xl font-bold text-white text-center text-glow">
                            Smart Learn Quest
                        </Text>
                        <Trophy size={24} color="#fbbf24" />
                    </View>
                    <Text className="text-gray-200 text-center font-medium">
                        Learn, Play, and Master Science & Math with Fun!
                    </Text>

                    {/* Feature Badges */}
                    <View className="flex-row gap-3 mt-6 flex-wrap justify-center">
                        <View className="bg-white/10 px-4 py-2 rounded-full flex-row items-center gap-2 border border-white/5">
                            <Zap size={14} color="#f59e0b" />
                            <Text className="text-white text-xs font-semibold">AI-Powered</Text>
                        </View>
                        <View className="bg-white/10 px-4 py-2 rounded-full flex-row items-center gap-2 border border-white/5">
                            <Trophy size={14} color="#f59e0b" />
                            <Text className="text-white text-xs font-semibold">Gamified</Text>
                        </View>
                        <View className="bg-white/10 px-4 py-2 rounded-full flex-row items-center gap-2 border border-white/5">
                            <Wifi size={14} color="#f59e0b" />
                            <Text className="text-white text-xs font-semibold">Offline-First</Text>
                        </View>
                    </View>
                </View>

                {/* Role Cards */}
                <View className="gap-5">
                    {/* Student Card */}
                    <TouchableOpacity onPress={() => handleSelectRole('student')} activeOpacity={0.9}>
                        <Card className="bg-white/5 border-white/10 overflow-hidden relative">
                            <LinearGradient
                                colors={['rgba(255,255,255,0.05)', 'transparent']}
                                className="absolute inset-0"
                            />
                            <CardContent className="p-6">
                                <View className="flex-row justify-between items-start mb-4">
                                    <View>
                                        <Text className="text-2xl font-bold text-white mb-1">I'm a Student</Text>
                                        <Text className="text-gray-200 text-sm max-w-[200px]">
                                            Learn with quizzes, flashcards, and earn rewards!
                                        </Text>
                                    </View>
                                    <View className="bg-blue-100 p-3 rounded-xl">
                                        <GraduationCap size={28} color="#2563eb" />
                                    </View>
                                </View>

                                <View className="flex-row gap-2 flex-wrap">
                                    <View className="bg-blue-500/20 px-3 py-1 rounded-md">
                                        <Text className="text-blue-300 text-xs font-bold">📚 Study Mode</Text>
                                    </View>
                                    <View className="bg-red-500/20 px-3 py-1 rounded-md">
                                        <Text className="text-red-300 text-xs font-bold">🎯 Quizzes</Text>
                                    </View>
                                    <View className="bg-yellow-500/20 px-3 py-1 rounded-md">
                                        <Text className="text-yellow-300 text-xs font-bold">🏆 Leaderboard</Text>
                                    </View>
                                </View>
                            </CardContent>
                        </Card>
                    </TouchableOpacity>

                    {/* Teacher Card */}
                    <TouchableOpacity onPress={() => handleSelectRole('teacher')} activeOpacity={0.9}>
                        <Card className="bg-white/5 border-white/10 overflow-hidden relative">
                            <LinearGradient
                                colors={['rgba(255,255,255,0.05)', 'transparent']}
                                className="absolute inset-0"
                            />
                            <CardContent className="p-6">
                                <View className="flex-row justify-between items-start mb-4">
                                    <View>
                                        <Text className="text-2xl font-bold text-white mb-1">I'm a Teacher</Text>
                                        <Text className="text-gray-200 text-sm max-w-[200px]">
                                            Track progress, create assignments, and more!
                                        </Text>
                                    </View>
                                    <View className="bg-purple-100 p-3 rounded-xl">
                                        <Users size={28} color="#9333ea" />
                                    </View>
                                </View>

                                <View className="flex-row gap-2 flex-wrap">
                                    <View className="bg-purple-500/20 px-3 py-1 rounded-md">
                                        <Text className="text-purple-300 text-xs font-bold">📊 Analytics</Text>
                                    </View>
                                    <View className="bg-pink-500/20 px-3 py-1 rounded-md">
                                        <Text className="text-pink-300 text-xs font-bold">📝 Homework</Text>
                                    </View>
                                    <View className="bg-indigo-500/20 px-3 py-1 rounded-md">
                                        <Text className="text-indigo-300 text-xs font-bold">🤖 AI Tools</Text>
                                    </View>
                                </View>
                            </CardContent>
                        </Card>
                    </TouchableOpacity>

                    {/* Parent Card - Keeping it consistent */}
                    <TouchableOpacity onPress={() => handleSelectRole('parent')} activeOpacity={0.9}>
                        <Card className="bg-white/5 border-white/10 overflow-hidden relative">
                            <LinearGradient
                                colors={['rgba(255,255,255,0.05)', 'transparent']}
                                className="absolute inset-0"
                            />
                            <CardContent className="p-6">
                                <View className="flex-row justify-between items-start mb-4">
                                    <View>
                                        <Text className="text-2xl font-bold text-white mb-1">I'm a Parent</Text>
                                        <Text className="text-gray-200 text-sm max-w-[200px]">
                                            Monitor progress and celebrate achievements!
                                        </Text>
                                    </View>
                                    <View className="bg-emerald-100 p-3 rounded-xl">
                                        <Users size={28} color="#059669" />
                                    </View>
                                </View>

                                <View className="flex-row gap-2 flex-wrap">
                                    <View className="bg-emerald-500/20 px-3 py-1 rounded-md">
                                        <Text className="text-emerald-300 text-xs font-bold">📈 Reports</Text>
                                    </View>
                                    <View className="bg-teal-500/20 px-3 py-1 rounded-md">
                                        <Text className="text-teal-300 text-xs font-bold">👀 Monitoring</Text>
                                    </View>
                                </View>
                            </CardContent>
                        </Card>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="mt-12 items-center gap-3">
                    <Text className="text-gray-300 text-xs text-center font-medium">
                        Supporting Classes 1-12 • Tamil Nadu State Board Curriculum
                    </Text>
                    <View className="bg-green-500/20 px-3 py-1 rounded-full flex-row items-center gap-2 border border-green-500/20">
                        <View className="w-2 h-2 rounded-full bg-green-500" />
                        <Text className="text-green-500 text-xs font-bold uppercase">Online</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
