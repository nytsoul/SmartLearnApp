import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/Card';
import {
    User,
    Settings,
    Bell,
    Shield,
    LogOut,
    ChevronRight,
    Trophy,
    Star,
    Clock,
    Camera,
    CreditCard,
    Moon
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';

export default function ProfileScreen() {
    const { currentStudent, logout, isDarkMode, toggleTheme } = useApp();
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);

    if (!currentStudent) return null;

    const currentLevel = Math.floor(currentStudent.xp / 500) + 1;
    const progressToNextLevel = ((currentStudent.xp % 500) / 500) * 100;

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/role-selection');
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header / Cover Area */}
                <View className="relative">
                    <LinearGradient
                        colors={['#10b981', '#064e3b']}
                        className="h-48 w-full rounded-b-[40px]"
                    />
                    <View className="absolute top-8 left-6 right-6 flex-row justify-between items-center">
                        <Text className="text-2xl font-bold text-white">Profile</Text>
                        <TouchableOpacity
                            className="bg-white/20 p-2 rounded-full backdrop-blur-md"
                            onPress={() => { }}
                        >
                            <Settings size={22} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Profile Info Overlay */}
                    <View className="items-center -mt-20">
                        <View className="relative">
                            <View className="h-32 w-32 rounded-full border-4 border-background bg-violet-500/20 items-center justify-center overflow-hidden">
                                <Image
                                    source={{ uri: currentStudent.avatar }}
                                    className="h-28 w-28"
                                />
                            </View>
                            <TouchableOpacity className="absolute bottom-1 right-1 bg-emerald-500 p-2 rounded-full border-2 border-background">
                                <Camera size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Text className="mt-4 text-2xl font-bold text-white">{currentStudent.name}</Text>
                        <Text className="text-emerald-400 font-medium">Standard {currentStudent.standard}</Text>
                    </View>
                </View>

                <View className="px-6 mt-8">
                    {/* Stats Summary */}
                    <View className="flex-row gap-4 mb-8">
                        <View className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/10 items-center">
                            <Trophy size={24} color="#fbbf24" className="mb-2" />
                            <Text className="text-white font-bold text-lg">{currentStudent.xp}</Text>
                            <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Total XP</Text>
                        </View>
                        <View className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/10 items-center">
                            <Star size={24} color="#34d399" className="mb-2" />
                            <Text className="text-white font-bold text-lg">{currentStudent.streak}d</Text>
                            <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Streak</Text>
                        </View>
                        <View className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/10 items-center">
                            <CreditCard size={24} color="#60a5fa" className="mb-2" />
                            <Text className="text-white font-bold text-lg">{currentStudent.coins}</Text>
                            <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Coins</Text>
                        </View>
                    </View>

                    {/* Level Progress */}
                    <View className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8 backdrop-blur-md">
                        <View className="flex-row justify-between mb-3">
                            <View className="flex-row items-center gap-2">
                                <View className="h-8 w-8 rounded-lg bg-emerald-500/20 items-center justify-center">
                                    <Trophy size={18} color="#10b981" />
                                </View>
                                <Text className="text-white font-bold text-lg">Level {currentLevel}</Text>
                            </View>
                            <Text className="text-gray-400 text-sm">{currentStudent.xp % 500} / 500 XP</Text>
                        </View>
                        <View className="h-4 bg-black/20 rounded-full overflow-hidden p-[2px]">
                            <LinearGradient
                                colors={['#10b981', '#34d399']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-full rounded-full"
                                style={{ width: `${progressToNextLevel}%` }}
                            />
                        </View>
                        <Text className="text-emerald-400/60 text-[10px] mt-2 font-medium">Keep it up! Just {500 - (currentStudent.xp % 500)} XP until Level {currentLevel + 1}</Text>
                    </View>

                    {/* Menu Options */}
                    <Text className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Settings & Privacy</Text>

                    <Card className="bg-white/5 border-white/10 mb-8 overflow-hidden">
                        <CardContent className="p-0">
                            {/* Notifications */}
                            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                                <View className="flex-row items-center gap-3">
                                    <View className="bg-blue-500/20 p-2 rounded-xl">
                                        <Bell size={20} color="#60a5fa" />
                                    </View>
                                    <Text className="text-white font-medium">Push Notifications</Text>
                                </View>
                                <Switch
                                    value={notifications}
                                    onValueChange={setNotifications}
                                    trackColor={{ false: '#334155', true: '#10b981' }}
                                    thumbColor={notifications ? 'white' : '#94a3b8'}
                                />
                            </View>

                            {/* Dark Mode */}
                            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                                <View className="flex-row items-center gap-3">
                                    <View className="bg-indigo-500/20 p-2 rounded-xl">
                                        <Moon size={20} color="#818cf8" />
                                    </View>
                                    <Text className="text-white font-medium">Dark Mode</Text>
                                </View>
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: '#334155', true: '#818cf8' }}
                                    thumbColor={isDarkMode ? 'white' : '#94a3b8'}
                                />
                            </View>

                            {/* Privacy */}
                            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-white/5">
                                <View className="flex-row items-center gap-3">
                                    <View className="bg-purple-500/20 p-2 rounded-xl">
                                        <Shield size={20} color="#a78bfa" />
                                    </View>
                                    <Text className="text-white font-medium">Privacy Settings</Text>
                                </View>
                                <ChevronRight size={20} color="#64748b" />
                            </TouchableOpacity>

                            {/* Account */}
                            <TouchableOpacity className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-center gap-3">
                                    <View className="bg-amber-500/20 p-2 rounded-xl">
                                        <User size={20} color="#fbbf24" />
                                    </View>
                                    <Text className="text-white font-medium">Account Security</Text>
                                </View>
                                <ChevronRight size={20} color="#64748b" />
                            </TouchableOpacity>
                        </CardContent>
                    </Card>

                    {/* Logout Button */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex-row items-center justify-center gap-3"
                    >
                        <LogOut size={20} color="#fb7185" />
                        <Text className="text-rose-400 font-bold text-lg">Sign Out</Text>
                    </TouchableOpacity>

                    <Text className="text-center text-gray-600 text-xs mt-8">Smart Learn v1.0.0 • Made with ❤️</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
