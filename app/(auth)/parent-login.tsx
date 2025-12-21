import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Eye, TrendingUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/contexts/AppContext';

export default function ParentLogin() {
    const router = useRouter();
    const { students, parents, setCurrentParent, addParent } = useApp();
    const [view, setView] = useState<'select' | 'new'>('select');
    const [childId, setChildId] = useState('');
    const [pin, setPin] = useState('');
    const [newParentName, setNewParentName] = useState('');
    const [newChildId, setNewChildId] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleLogin = () => {
        if (!childId || !pin) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const student = students.find(s => s.id === childId);
        if (!student) {
            Alert.alert('Error', 'Child not found. Please check the Child ID');
            return;
        }

        // Find parent account linked to this child
        const parent = parents.find(p => p.childId === childId && p.pin === pin);
        if (!parent) {
            Alert.alert('Error', 'Invalid PIN or no account found for this child');
            return;
        }

        setCurrentParent(parent);
        router.replace('/(dashboard)/parent-dashboard');
    };

    const handleCreateAccount = () => {
        if (!newParentName || !newChildId || !newPin || !confirmPin) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (newPin.length !== 4) {
            Alert.alert('Error', 'PIN must be 4 digits');
            return;
        }

        if (newPin !== confirmPin) {
            Alert.alert('Error', 'PINs do not match');
            return;
        }

        const student = students.find(s => s.id === newChildId);
        if (!student) {
            Alert.alert('Error', 'Child not found. Please check the Child ID');
            return;
        }

        // Check if parent account already exists for this child
        const existingParent = parents.find(p => p.childId === newChildId);
        if (existingParent) {
            Alert.alert('Error', 'A parent account already exists for this child. Please use Login.');
            return;
        }

        const newParent = {
            id: `parent-${Date.now()}`,
            name: newParentName,
            childId: newChildId,
            pin: newPin,
            createdAt: new Date().toISOString(),
        };

        addParent(newParent);
        setCurrentParent(newParent);

        Alert.alert('Success', 'Parent account created successfully!', [
            { text: 'OK', onPress: () => router.replace('/(dashboard)/parent-dashboard') }
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
                {/* Header */}
                <View className="mb-8">
                    <Pressable onPress={() => router.canGoBack() ? router.back() : router.push('/(auth)/role-selection')} className="mb-6 bg-white/10 self-start p-3 rounded-full border border-white/10">
                        <ArrowLeft size={24} color="white" />
                    </Pressable>
                    <View className="items-center">
                        <View className="bg-pink-500 rounded-full w-20 h-20 items-center justify-center mb-4 shadow-lg shadow-pink-500/50">
                            <Heart size={40} color="white" />
                        </View>
                        <Text className="text-3xl font-bold text-white mb-2 text-glow">Parent Portal</Text>
                        <Text className="text-gray-300 text-center">
                            Monitor your child's learning journey
                        </Text>
                    </View>
                </View>

                {/* View Toggle */}
                <View className="flex-row bg-white/10 rounded-2xl p-1 mb-6 border border-white/10">
                    <Pressable
                        onPress={() => setView('select')}
                        className={`flex-1 py-3 rounded-xl ${view === 'select' ? 'bg-pink-600' : ''}`}
                    >
                        <Text className={`text-center font-semibold ${view === 'select' ? 'text-white' : 'text-gray-400'}`}>
                            Login
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setView('new')}
                        className={`flex-1 py-3 rounded-xl ${view === 'new' ? 'bg-pink-600' : ''}`}
                    >
                        <Text className={`text-center font-semibold ${view === 'new' ? 'text-white' : 'text-gray-400'}`}>
                            Create Account
                        </Text>
                    </Pressable>
                </View>

                {view === 'select' ? (
                    /* Login View */
                    <View className="gap-5">
                        <View>
                            <Text className="text-lg font-semibold mb-3 text-gray-200">Child ID</Text>
                            <Input
                                placeholder="Enter your child's ID"
                                placeholderTextColor="#9ca3af"
                                value={childId}
                                onChangeText={setChildId}
                                className="h-14 text-lg bg-white/5 border-white/10 text-white"
                            />
                            <Text className="text-sm text-gray-500 mt-2">
                                Ask your child for their Student ID
                            </Text>
                        </View>

                        <View>
                            <Text className="text-lg font-semibold mb-3 text-gray-200">PIN (4 digits)</Text>
                            <Input
                                placeholder="Enter your PIN"
                                placeholderTextColor="#9ca3af"
                                value={pin}
                                onChangeText={(text: string) => setPin(text.replace(/\D/g, ''))}
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry
                                className="h-14 text-lg bg-white/5 border-white/10 text-white"
                            />
                        </View>

                        <Button onPress={handleLogin} className="h-14 bg-pink-600 active:bg-pink-700 rounded-2xl">
                            <Text className="text-white font-bold text-lg">Login</Text>
                        </Button>

                        {/* Info Cards */}
                        <View className="mt-6 gap-3">
                            <View className="bg-white/5 p-4 rounded-2xl border border-white/10 flex-row items-center gap-3">
                                <Eye size={24} color="#ec4899" />
                                <View className="flex-1">
                                    <Text className="font-semibold text-white">Track Progress</Text>
                                    <Text className="text-sm text-gray-400">See detailed learning analytics</Text>
                                </View>
                            </View>
                            <View className="bg-white/5 p-4 rounded-2xl border border-white/10 flex-row items-center gap-3">
                                <TrendingUp size={24} color="#ec4899" />
                                <View className="flex-1">
                                    <Text className="font-semibold text-white">Weekly Reports</Text>
                                    <Text className="text-sm text-gray-400">Strengths & areas to improve</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : (
                    /* Create Account View */
                    <View className="gap-5">
                        <View>
                            <Text className="text-lg font-semibold mb-3 text-gray-200">Your Name</Text>
                            <Input
                                placeholder="Enter your name"
                                placeholderTextColor="#9ca3af"
                                value={newParentName}
                                onChangeText={setNewParentName}
                                className="h-14 text-lg bg-white/5 border-white/10 text-white"
                            />
                        </View>

                        <View>
                            <Text className="text-lg font-semibold mb-3 text-gray-200">Child's Student ID</Text>
                            <Input
                                placeholder="Enter child's ID"
                                placeholderTextColor="#9ca3af"
                                value={newChildId}
                                onChangeText={setNewChildId}
                                className="h-14 text-lg bg-white/5 border-white/10 text-white"
                            />
                            <Text className="text-sm text-gray-500 mt-2">
                                Get this from your child's profile
                            </Text>
                        </View>

                        <View>
                            <Text className="text-lg font-semibold mb-3 text-gray-200">Create PIN (4 digits)</Text>
                            <Input
                                placeholder="Create a 4-digit PIN"
                                placeholderTextColor="#9ca3af"
                                value={newPin}
                                onChangeText={(text: string) => setNewPin(text.replace(/\D/g, ''))}
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry
                                className="h-14 text-lg bg-white/5 border-white/10 text-white"
                            />
                        </View>

                        <View>
                            <Text className="text-lg font-semibold mb-3 text-gray-200">Confirm PIN</Text>
                            <Input
                                placeholder="Re-enter your PIN"
                                placeholderTextColor="#9ca3af"
                                value={confirmPin}
                                onChangeText={(text: string) => setConfirmPin(text.replace(/\D/g, ''))}
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry
                                className="h-14 text-lg bg-white/5 border-white/10 text-white"
                            />
                        </View>

                        <Button onPress={handleCreateAccount} className="h-14 bg-pink-600 active:bg-pink-700 rounded-2xl">
                            <Text className="text-white font-bold text-lg">Create Account</Text>
                        </Button>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
