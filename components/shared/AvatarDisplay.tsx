import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';
import { getAvatarById } from '@/data/avatars';

interface AvatarDisplayProps {
    avatarId: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showRing?: boolean;
}

const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
};

const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
};

export function AvatarDisplay({ avatarId, size = 'md', className, showRing = false }: AvatarDisplayProps) {
    const avatar = getAvatarById(avatarId);

    return (
        <View
            className={cn(
                'rounded-full bg-blue-100 flex items-center justify-center', // simplified gradient for now
                sizeClasses[size],
                showRing && 'border-4 border-primary/30',
                className
            )}
        >
            <Text className={cn(textSizeClasses[size])}>{avatar?.emoji || '👤'}</Text>
        </View>
    );
}
