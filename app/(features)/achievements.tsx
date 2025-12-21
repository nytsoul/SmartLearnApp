import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Check, Star } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/contexts/AppContext';
import { useBadges } from '@/hooks/useBadges';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';

export default function Achievements() {
    const router = useRouter();
    const { currentStudent } = useApp();
    const { getAllBadgesWithStatus, earnedBadges } = useBadges();
    const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

    if (!currentStudent) {
        return null;
    }

    const allBadges = getAllBadgesWithStatus();
    const earnedCount = earnedBadges.length;
    const totalCount = allBadges.length;
    const progress = (earnedCount / totalCount) * 100;

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

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
                            <Text className="text-2xl font-bold text-white text-glow">Achievements</Text>
                            <Text className="text-sm text-gray-300 mt-1">
                                {earnedCount} of {totalCount} badges earned
                            </Text>
                        </View>
                        <View className="bg-yellow-500/20 rounded-full p-3 border border-yellow-500/30">
                            <Star size={32} color="#facc15" />
                        </View>
                    </View>
                </View>

                {/* Progress Bar */}
                <View className="mx-4 mt-6 mb-6 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="font-bold text-base text-white">Collection Progress</Text>
                        <Text className="text-sm font-bold text-purple-400">{Math.round(progress)}%</Text>
                    </View>
                    <View className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </View>
                </View>

                {/* Earned Badges Section */}
                {earnedCount > 0 && (
                    <View className="px-4 mb-4">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="bg-green-500/20 rounded-full p-2 border border-green-500/30">
                                <Check size={14} color="#4ade80" />
                            </View>
                            <Text className="text-lg font-bold text-white">Earned Badges</Text>
                            <View className="bg-green-500/20 px-2.5 py-1 rounded-full border border-green-500/30">
                                <Text className="text-green-400 text-xs font-bold">{earnedCount}</Text>
                            </View>
                        </View>

                        <View className="bg-white/5 rounded-2xl p-5 border border-white/10">
                            <View className="flex-row flex-wrap gap-3">
                                {allBadges.filter(b => b.earned).map((badge) => (
                                    <Pressable
                                        key={badge.id}
                                        onPress={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                                        className={cn(
                                            'p-4 rounded-2xl items-center relative overflow-hidden',
                                            'bg-gradient-to-br from-white/10 to-white/5',
                                            'w-[30%]',
                                            selectedBadge === badge.id
                                                ? 'border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                                : 'border border-white/10'
                                        )}
                                    >
                                        <Text className="text-4xl mb-2 filter drop-shadow-md">{badge.icon}</Text>
                                        <Text className="text-[10px] font-bold text-gray-200 text-center uppercase tracking-wide" numberOfLines={1}>
                                            {badge.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Selected Badge Details */}
                        {selectedBadge && allBadges.find(b => b.id === selectedBadge)?.earned && (
                            <View className="mt-4 p-5 bg-white/10 rounded-xl border border-white/20 overflow-hidden relative">
                                <LinearGradient
                                    colors={['rgba(88, 28, 135, 0.5)', 'transparent']}
                                    className="absolute inset-0"
                                />
                                {(() => {
                                    const badge = allBadges.find(b => b.id === selectedBadge)!;
                                    return (
                                        <View className="flex-row gap-5 items-center">
                                            <View className="bg-white/10 p-4 rounded-full border border-white/10 shadow-inner">
                                                <Text className="text-5xl">{badge.icon}</Text>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-xl font-bold mb-1 text-white text-glow">{badge.name}</Text>
                                                <Text className="text-gray-300 mb-3 leading-5">{badge.description}</Text>
                                                <View className="flex-row items-center gap-2">
                                                    <Star size={12} color="#a855f7" />
                                                    <Text className="text-xs text-purple-300 font-bold uppercase tracking-wide">
                                                        Earned on {formatDate(badge.earnedAt)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })()}
                            </View>
                        )}
                    </View>
                )}

                {/* Locked Badges Section */}
                <View className="px-4 pb-8">
                    <View className="flex-row items-center gap-3 mb-4 mt-4">
                        <View className="bg-gray-700/50 rounded-full p-2 border border-white/10">
                            <Lock size={14} color="#9ca3af" />
                        </View>
                        <Text className="text-lg font-bold text-white">Locked Badges</Text>
                        <View className="bg-white/10 px-2.5 py-1 rounded-full">
                            <Text className="text-gray-400 text-xs font-bold">{totalCount - earnedCount}</Text>
                        </View>
                    </View>

                    <View className="bg-black/20 rounded-2xl p-5 border-2 border-dashed border-white/10">
                        <View className="flex-row flex-wrap gap-3">
                            {allBadges.filter(b => !b.earned).map((badge) => (
                                <Pressable
                                    key={badge.id}
                                    onPress={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                                    className={cn(
                                        'p-4 rounded-2xl border items-center',
                                        'bg-white/5',
                                        'w-[30%]',
                                        selectedBadge === badge.id
                                            ? 'border-gray-400 bg-white/10'
                                            : 'border-white/5 border-dashed'
                                    )}
                                >
                                    <View className="relative">
                                        <Text className="text-4xl opacity-20 mb-2 grayscale">{badge.icon}</Text>
                                        <View className="absolute top-1/2 left-1/2 -ml-2 -mt-2 bg-gray-800 rounded-full p-1 border border-white/20">
                                            <Lock size={12} color="#9ca3af" />
                                        </View>
                                    </View>
                                    <Text className="text-[10px] font-medium text-gray-500 text-center" numberOfLines={1}>
                                        {badge.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Selected Locked Badge Details */}
                    {selectedBadge && !allBadges.find(b => b.id === selectedBadge)?.earned && (
                        <View className="mt-4 p-5 bg-black/40 rounded-xl border border-white/10">
                            {(() => {
                                const badge = allBadges.find(b => b.id === selectedBadge)!;
                                return (
                                    <View className="flex-row gap-5 items-center">
                                        <Text className="text-5xl opacity-40 grayscale">{badge.icon}</Text>
                                        <View className="flex-1">
                                            <Text className="text-lg font-bold mb-1 text-gray-300">{badge.name}</Text>
                                            <Text className="text-gray-500 mb-3">{badge.description}</Text>
                                            <Text className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                                                🎯 Unlock: {badge.description}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })()}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
