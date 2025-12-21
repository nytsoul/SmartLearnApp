import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from '@/types';
import { AvatarDisplay } from './AvatarDisplay';
import { Trophy, Medal, Award } from 'lucide-react-native';

interface LeaderboardCardProps {
    entry: LeaderboardEntry;
    isCurrentUser?: boolean;
}

export function LeaderboardCard({ entry, isCurrentUser }: LeaderboardCardProps) {
    const isTopThree = entry.rank <= 3;

    const getRankIcon = () => {
        switch (entry.rank) {
            case 1:
                return <Trophy size={24} color="#EAB308" />;
            case 2:
                return <Medal size={24} color="#9CA3AF" />;
            case 3:
                return <Award size={24} color="#D97706" />;
            default:
                return null;
        }
    };

    const getRankStyle = () => {
        switch (entry.rank) {
            case 1:
                return 'bg-yellow-100 border-yellow-400';
            case 2:
                return 'bg-gray-100 border-gray-400';
            case 3:
                return 'bg-orange-100 border-orange-400';
            default:
                return 'bg-white border-gray-200';
        }
    };

    return (
        <View
            className={cn(
                'flex-row items-center gap-4 p-4 rounded-xl border-2',
                getRankStyle(),
                isCurrentUser && 'ring-2 ring-purple-500'
            )}
        >
            {/* Rank */}
            <View className="w-10 h-10 items-center justify-center">
                {isTopThree ? (
                    getRankIcon()
                ) : (
                    <Text className="text-xl font-bold text-gray-500">
                        #{entry.rank}
                    </Text>
                )}
            </View>

            {/* Avatar */}
            <AvatarDisplay avatarId={entry.avatar} size="sm" />

            {/* Name & Stats */}
            <View className="flex-1">
                <Text className={cn(
                    'font-semibold text-base',
                    isCurrentUser && 'text-purple-600'
                )}>
                    {entry.studentName}
                    {isCurrentUser && <Text className="text-xs text-gray-500"> (You)</Text>}
                </Text>
                <View className="flex-row items-center gap-3 mt-1">
                    <View className="flex-row items-center gap-1">
                        <Text className="text-purple-600">✨</Text>
                        <Text className="text-sm text-gray-600">
                            {entry.xp.toLocaleString()} XP
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="text-orange-500">🔥</Text>
                        <Text className="text-sm text-gray-600">
                            {entry.streak} days
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
