import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShoppingBag, Sparkles, Crown, Star } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';

interface AvatarAccessory {
    id: string;
    type: 'hat' | 'glasses' | 'background' | 'frame';
    name: string;
    icon: string;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const avatarAccessories: AvatarAccessory[] = [
    // Hats
    { id: 'hat-1', type: 'hat', name: 'Party Hat', icon: '🎉', price: 50, rarity: 'common' },
    { id: 'hat-2', type: 'hat', name: 'Crown', icon: '👑', price: 150, rarity: 'epic' },
    { id: 'hat-3', type: 'hat', name: 'Wizard Hat', icon: '🧙', price: 100, rarity: 'rare' },
    { id: 'hat-4', type: 'hat', name: 'Graduation Cap', icon: '🎓', price: 200, rarity: 'legendary' },

    // Glasses
    { id: 'glasses-1', type: 'glasses', name: 'Cool Shades', icon: '😎', price: 40, rarity: 'common' },
    { id: 'glasses-2', type: 'glasses', name: 'Nerd Glasses', icon: '🤓', price: 60, rarity: 'rare' },

    // Backgrounds
    { id: 'bg-1', type: 'background', name: 'Rainbow', icon: '🌈', price: 80, rarity: 'rare' },
    { id: 'bg-2', type: 'background', name: 'Stars', icon: '⭐', price: 120, rarity: 'epic' },
    { id: 'bg-3', type: 'background', name: 'Fire', icon: '🔥', price: 100, rarity: 'rare' },

    // Frames
    { id: 'frame-1', type: 'frame', name: 'Gold Frame', icon: '🟨', price: 150, rarity: 'epic' },
    { id: 'frame-2', type: 'frame', name: 'Diamond Frame', icon: '💎', price: 300, rarity: 'legendary' },
];

const rarityColors = {
    common: { bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-300' },
    rare: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-300' },
    epic: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-300' },
    legendary: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-300' },
};

export default function AvatarShop() {
    const router = useRouter();
    const { currentStudent, updateStudent } = useApp();
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'hat' | 'glasses' | 'background' | 'frame'>('all');
    const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

    if (!currentStudent) {
        router.replace('/(auth)/student-login');
        return null;
    }

    const filteredAccessories = selectedCategory === 'all'
        ? avatarAccessories
        : avatarAccessories.filter(item => item.type === selectedCategory);

    const handlePurchase = (item: AvatarAccessory) => {
        if (purchasedItems.includes(item.id)) {
            Alert.alert('Already Owned', 'You already own this item!');
            return;
        }

        if (currentStudent.coins < item.price) {
            Alert.alert(
                'Not Enough Coins',
                `You need ${item.price - currentStudent.coins} more coins to buy this item. Keep taking quizzes to earn more!`
            );
            return;
        }

        Alert.alert(
            'Confirm Purchase',
            `Buy ${item.name} for ${item.price} coins?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Buy',
                    onPress: () => {
                        updateStudent({
                            ...currentStudent,
                            coins: currentStudent.coins - item.price,
                        });
                        setPurchasedItems([...purchasedItems, item.id]);
                        Alert.alert('Success!', `You purchased ${item.name}! 🎉`);
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 border-b border-white/10">
                <View className="flex-row items-center justify-between mb-4">
                    <Pressable onPress={() => router.canGoBack() ? router.back() : router.push('/(dashboard)/student-dashboard')} className="bg-white/5 p-2 rounded-full border border-white/10">
                        <ArrowLeft size={20} color="white" />
                    </Pressable>
                    <View className="flex-row items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/30">
                        <Text className="text-xl">🪙</Text>
                        <Text className="font-bold text-orange-400 text-lg">{currentStudent.coins}</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-3">
                    <View className="bg-purple-500/20 rounded-full w-14 h-14 items-center justify-center border border-purple-500/30">
                        <ShoppingBag size={28} color="#a855f7" />
                    </View>
                    <View>
                        <Text className="text-2xl font-bold text-white text-glow">Avatar Shop</Text>
                        <Text className="text-gray-400">Customize your profile</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-5 py-6">
                    {/* Category Filter */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                        <View className="flex-row gap-3">
                            {['all', 'hat', 'glasses', 'background', 'frame'].map((category) => (
                                <Pressable
                                    key={category}
                                    onPress={() => setSelectedCategory(category as any)}
                                    className={cn(
                                        'px-5 py-2.5 rounded-xl border transition-all active:scale-95',
                                        selectedCategory === category
                                            ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/30'
                                            : 'bg-white/5 border-white/10'
                                    )}
                                >
                                    <Text
                                        className={cn(
                                            'font-semibold capitalize text-base tracking-wide',
                                            selectedCategory === category ? 'text-white' : 'text-gray-400'
                                        )}
                                    >
                                        {category === 'all' ? '✨ All' : category}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Items Grid */}
                    <View className="flex-row flex-wrap gap-3 mb-8">
                        {filteredAccessories.map((item) => {
                            const colors = rarityColors[item.rarity];
                            const isPurchased = purchasedItems.includes(item.id);

                            return (
                                <Pressable
                                    key={item.id}
                                    onPress={() => handlePurchase(item)}
                                    disabled={isPurchased}
                                    className={cn(
                                        'w-[48%] rounded-2xl border p-4 backdrop-blur-sm relative overflow-hidden',
                                        colors.bg,
                                        colors.border,
                                        isPurchased && 'opacity-60 grayscale-[0.5]'
                                    )}
                                >
                                    {/* Rarity Badge */}
                                    <View className={cn('self-start px-2 py-0.5 rounded-md mb-3 border bg-black/20', colors.border)}>
                                        <Text className={cn('text-[10px] font-bold uppercase tracking-wider', colors.text)}>
                                            {item.rarity}
                                        </Text>
                                    </View>

                                    {/* Icon */}
                                    <View className="items-center mb-4">
                                        <Text className="text-6xl filter drop-shadow-lg">{item.icon}</Text>
                                        {isPurchased && (
                                            <View className="absolute -top-1 -right-1 bg-green-500/90 rounded-full p-1.5 shadow-lg border border-white/20">
                                                <Text className="text-[10px] text-white font-bold px-1">✓</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Name */}
                                    <Text className="font-bold text-center text-white mb-2 text-sm" numberOfLines={1}>
                                        {item.name}
                                    </Text>

                                    {/* Price */}
                                    <View className="flex-row items-center justify-center gap-1.5 bg-black/20 py-1.5 rounded-lg border border-white/5">
                                        <Text className="text-base">🪙</Text>
                                        <Text className={cn('font-bold text-sm', colors.text)}>
                                            {isPurchased ? 'OWNED' : item.price}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* How to Earn Coins */}
                    <View className="relative bg-white/5 rounded-2xl p-1 mb-6 border border-white/10 overflow-hidden shadow-2xl">
                        <LinearGradient
                            colors={['rgba(168, 85, 247, 0.4)', 'rgba(236, 72, 153, 0.4)']}
                            className="absolute inset-0"
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <View className="p-5 backdrop-blur-md bg-black/20 rounded-xl">
                            <View className="flex-row items-center gap-3 mb-4 border-b border-white/10 pb-3">
                                <Sparkles size={24} color="#e879f9" />
                                <Text className="text-xl font-bold text-white text-glow">How to Earn Coins?</Text>
                            </View>
                            <View className="gap-3">
                                <View className="flex-row items-start gap-3">
                                    <View className="bg-white/10 rounded-full p-1 mt-0.5"><Text className="text-[10px] text-white">💰</Text></View>
                                    <Text className="text-gray-200 flex-1 text-sm leading-5 font-medium">Complete Quiz Mode: <Text className="text-yellow-400 font-bold">2 coins</Text> per correct answer</Text>
                                </View>
                                <View className="flex-row items-start gap-3">
                                    <View className="bg-white/10 rounded-full p-1 mt-0.5"><Text className="text-[10px] text-white">⚡</Text></View>
                                    <Text className="text-gray-200 flex-1 text-sm leading-5 font-medium">Complete Timed Quiz: <Text className="text-yellow-400 font-bold">3 coins</Text> per correct answer</Text>
                                </View>
                                <View className="flex-row items-start gap-3">
                                    <View className="bg-white/10 rounded-full p-1 mt-0.5"><Text className="text-[10px] text-white">🏆</Text></View>
                                    <Text className="text-gray-200 flex-1 text-sm leading-5 font-medium">Daily Challenge: <Text className="text-purple-300 font-bold">Bonus coins!</Text></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
