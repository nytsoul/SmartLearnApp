import { Modal, View, Text, Pressable } from 'react-native';
import { Badge } from '@/types';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';

interface BadgeUnlockModalProps {
    badge: Badge | null;
    onClose: () => void;
}

export function BadgeUnlockModal({ badge, onClose }: BadgeUnlockModalProps) {
    if (!badge) return null;

    return (
        <Modal
            visible={!!badge}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable 
                className="flex-1 bg-black/50 items-center justify-center p-4"
                onPress={onClose}
            >
                <Pressable 
                    className="bg-white rounded-3xl p-8 w-full max-w-sm"
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Badge Icon */}
                    <View className="items-center mb-6">
                        <View className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-purple-100 rounded-full items-center justify-center mb-4">
                            <Text className="text-7xl">{badge.icon}</Text>
                        </View>
                        
                        {/* Decorative stars */}
                        <View className="absolute top-0 right-8">
                            <Text className="text-2xl">✨</Text>
                        </View>
                        <View className="absolute top-8 right-0">
                            <Text className="text-xl">⭐</Text>
                        </View>
                        <View className="absolute bottom-8 right-4">
                            <Text className="text-lg">🌟</Text>
                        </View>
                    </View>
                    
                    {/* Title */}
                    <Text className="text-2xl font-bold text-purple-600 text-center mb-2">
                        Badge Unlocked!
                    </Text>
                    
                    {/* Badge Name */}
                    <Text className="text-xl font-bold text-center mb-2">
                        {badge.name}
                    </Text>
                    
                    {/* Description */}
                    <Text className="text-gray-600 text-center mb-6">
                        {badge.description}
                    </Text>
                    
                    {/* Close Button */}
                    <Button 
                        onPress={onClose}
                        className="bg-purple-600 py-4"
                    >
                        <Text className="text-white text-lg font-bold text-center">
                            Awesome! 🎉
                        </Text>
                    </Button>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
