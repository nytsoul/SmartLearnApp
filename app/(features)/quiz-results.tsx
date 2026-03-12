import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import {
    Trophy,
    Star,
    Clock,
    ArrowRight,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Brain,
    Sparkles,
    Flame
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';

export default function QuizResultsScreen() {
    const { currentStudent } = useApp();
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse params or use dummy data
    const score = parseInt(params.score as string) || 8;
    const total = parseInt(params.total as string) || 10;
    const xpEarned = parseInt(params.xpEarned as string) || 150;
    const coinsEarned = parseInt(params.coinsEarned as string) || 45;
    const timeSpent = params.timeSpent as string || '4:20';
    const accuracy = Math.round((score / total) * 100);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true })
        ]).start();
    }, []);

    if (!currentStudent) return null;

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                {/* Score Header */}
                <Animated.View
                    style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
                    className="items-center mb-10"
                >
                    <View className="relative mb-6">
                        <View className="h-44 w-44 rounded-full border-8 border-emerald-500/20 items-center justify-center bg-emerald-500/10">
                            <Text className="text-6xl font-black text-emerald-400">{accuracy}%</Text>
                        </View>
                        <View className="absolute -top-4 -right-4 bg-amber-500 h-14 w-14 rounded-full items-center justify-center border-4 border-background shadow-lg">
                            <Trophy size={28} color="white" />
                        </View>
                    </View>

                    <Text className="text-3xl font-black text-white text-center mb-2">Excellent Work!</Text>
                    <Text className="text-emerald-400 font-bold text-lg text-glow">You earned +{xpEarned} XP</Text>
                </Animated.View>

                {/* Stats Breakdown Grid */}
                <View className="flex-row flex-wrap gap-4 mb-8">
                    <View className="w-[47%] bg-white/5 p-4 rounded-3xl border border-white/10">
                        <View className="flex-row items-center gap-2 mb-2">
                            <CheckCircle2 size={16} color="#10b981" />
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Correct</Text>
                        </View>
                        <Text className="text-2xl font-bold text-white">{score} / {total}</Text>
                    </View>

                    <View className="w-[47%] bg-white/5 p-4 rounded-3xl border border-white/10">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Clock size={16} color="#60a5fa" />
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Time</Text>
                        </View>
                        <Text className="text-2xl font-bold text-white">{timeSpent}</Text>
                    </View>

                    <View className="w-[47%] bg-amber-500/10 p-4 rounded-3xl border border-amber-500/20">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Sparkles size={16} color="#fbbf24" />
                            <Text className="text-amber-400/60 text-xs font-bold uppercase tracking-wider">Coins</Text>
                        </View>
                        <Text className="text-2xl font-bold text-amber-400">+{coinsEarned}</Text>
                    </View>

                    <View className="w-[47%] bg-rose-500/10 p-4 rounded-3xl border border-rose-500/20">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Flame size={16} color="#fb7185" />
                            <Text className="text-rose-400/60 text-xs font-bold uppercase tracking-wider">Streak</Text>
                        </View>
                        <Text className="text-2xl font-bold text-rose-400">Maintained!</Text>
                    </View>
                </View>

                {/* Suggested Review Section */}
                <View className="bg-white/5 p-6 rounded-[32px] border border-white/10 mb-8 overflow-hidden">
                    <LinearGradient
                        colors={['rgba(52, 211, 153, 0.1)', 'transparent']}
                        className="absolute inset-0"
                    />
                    <View className="flex-row items-center gap-3 mb-4">
                        <Brain size={24} color="#34d399" />
                        <View>
                            <Text className="text-white font-bold text-lg">AI Insights</Text>
                            <Text className="text-gray-500 text-xs">Based on your performance</Text>
                        </View>
                    </View>

                    <View className="gap-3">
                        <View className="flex-row items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                            <Star size={14} color="#fbbf24" fill="#fbbf24" />
                            <Text className="text-gray-300 text-sm flex-1">You're doing great in <Text className="text-white font-bold">Algebraic Equations</Text>!</Text>
                        </View>
                        <View className="flex-row items-center gap-3 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
                            <XCircle size={14} color="#fb7185" />
                            <Text className="text-gray-300 text-sm flex-1">Consider reviewing <Text className="text-rose-400 font-bold">Linear Geometry</Text>.</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="gap-4">
                    <TouchableOpacity
                        onPress={() => router.push('/(dashboard)/student-dashboard')}
                        className="bg-emerald-500 p-5 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg shadow-emerald-500/30"
                    >
                        <Text className="text-white font-black text-lg">Back to Dashboard</Text>
                        <ArrowRight size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-white/5 border border-white/10 p-5 rounded-2xl flex-row items-center justify-center gap-3"
                    >
                        <RotateCcw size={20} color="#94a3b8" />
                        <Text className="text-gray-400 font-bold text-lg">Try Again</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
