import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, KeyRound, ChevronRight } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/contexts/AppContext';
import { TeacherProfile } from '@/types';
import { cn } from '@/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent } from '@/components/ui/Card';

export default function TeacherLogin() {
    const router = useRouter();
    const { teachers, setCurrentTeacher, addTeacher, setCurrentRole } = useApp();
    const [isCreating, setIsCreating] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
    const [pin, setPin] = useState('');
    const [newName, setNewName] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleLogin = () => {
        if (!selectedTeacher || pin !== selectedTeacher.pin) {
            Alert.alert('Invalid PIN', 'Please enter the correct PIN');
            return;
        }
        setCurrentTeacher(selectedTeacher);
        router.replace('/(dashboard)/teacher-dashboard');
    };

    const handleCreateTeacher = () => {
        if (!newName.trim() || newPin.length !== 4 || newPin !== confirmPin) {
            Alert.alert('Invalid Input', 'Please fill all fields correctly. PIN must be 4 digits.');
            return;
        }

        const newTeacher: TeacherProfile = {
            id: Date.now().toString(),
            name: newName.trim(),
            pin: newPin,
            createdAt: new Date().toISOString(),
        };

        addTeacher(newTeacher);
        setCurrentTeacher(newTeacher);
        router.replace('/(dashboard)/teacher-dashboard');
    };

    const handleBack = () => {
        if (selectedTeacher) {
            setSelectedTeacher(null);
            setPin('');
        } else if (isCreating) {
            setIsCreating(false);
        } else {
            setCurrentRole(null);
            router.canGoBack() ? router.back() : router.push('/(auth)/role-selection');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerClassName="p-6">
                <View className="max-w-md mx-auto w-full">
                    {/* Header */}
                    <View className="mb-8">
                        <Pressable
                            onPress={handleBack}
                            className="bg-white/10 rounded-full p-3 self-start mb-6 border border-white/10"
                        >
                            <ArrowLeft size={24} color="white" />
                        </Pressable>
                        <View className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-6 shadow-xl border border-white/10">
                            <Text className="text-4xl font-bold text-white mb-2 text-glow">
                                {isCreating ? 'Create Account' : selectedTeacher ? 'Enter PIN' : 'Teacher Portal'}
                            </Text>
                            <Text className="text-blue-100 text-base">
                                {isCreating ? 'Set up your teacher account' : selectedTeacher ? `Welcome back, ${selectedTeacher.name}` : 'Select your account to continue'}
                            </Text>
                        </View>
                    </View>

                    {!isCreating && !selectedTeacher && (
                        <View>
                            {/* Existing Teachers */}
                            {teachers.length > 0 && (
                                <View className="mb-8 gap-4">
                                    <Text className="text-lg font-semibold text-gray-200">Select Account</Text>
                                    {teachers.map((teacher) => (
                                        <Card key={teacher.id} className="bg-white/5 border-white/10 overflow-hidden">
                                            <Pressable
                                                onPress={() => setSelectedTeacher(teacher)}
                                                className="w-full flex-row items-center gap-4 p-4 active:bg-white/5"
                                            >
                                                <View className="w-14 h-14 rounded-full bg-indigo-500/20 items-center justify-center border border-indigo-500/30">
                                                    <Text className="text-2xl">👩‍🏫</Text>
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-xl font-bold text-white">{teacher.name}</Text>
                                                    <Text className="text-gray-400 text-sm">Teacher Account</Text>
                                                </View>
                                                <ChevronRight size={24} color="#9ca3af" />
                                            </Pressable>
                                        </Card>
                                    ))}
                                </View>
                            )}

                            {/* Create New Account Button */}
                            <Pressable
                                onPress={() => setIsCreating(true)}
                                className="w-full flex-row items-center justify-center gap-3 p-5 rounded-2xl border border-dashed border-indigo-400/50 bg-indigo-500/10 active:bg-indigo-500/20"
                            >
                                <Plus size={24} color="#818cf8" />
                                <Text className="text-lg font-semibold text-indigo-300">Create Teacher Account</Text>
                            </Pressable>
                        </View>
                    )}

                    {selectedTeacher && !isCreating && (
                        <View className="gap-6">
                            <View className="items-center">
                                <View className="w-20 h-20 rounded-full bg-indigo-500/20 items-center justify-center mb-4 border border-indigo-500/30">
                                    <Text className="text-4xl">👩‍🏫</Text>
                                </View>
                                <Text className="text-2xl font-bold text-white text-glow">{selectedTeacher.name}</Text>
                            </View>

                            <View>
                                <Text className="text-lg font-semibold mb-3 text-gray-200">Enter 4-Digit PIN</Text>
                                <Input
                                    secureTextEntry
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="••••"
                                    placeholderTextColor="#6b7280"
                                    value={pin}
                                    onChangeText={(text: string) => setPin(text.replace(/\D/g, ''))}
                                    className="h-16 text-center text-3xl font-bold tracking-widest bg-white/5 border-white/10 text-white"
                                />
                            </View>

                            <Button
                                onPress={handleLogin}
                                disabled={pin.length !== 4}
                                className={cn("w-full bg-indigo-600 rounded-2xl h-14", pin.length !== 4 && "opacity-50")}
                            >
                                <View className="flex-row items-center gap-2">
                                    <KeyRound size={20} color="white" />
                                    <Text className="text-white font-bold text-lg">Login</Text>
                                </View>
                            </Button>
                        </View>
                    )}

                    {isCreating && (
                        <View className="gap-6">
                            <View>
                                <Text className="text-lg font-semibold mb-3 text-gray-200">Your Name</Text>
                                <Input
                                    placeholder="Enter your name"
                                    placeholderTextColor="#6b7280"
                                    value={newName}
                                    onChangeText={setNewName}
                                    className="h-14 text-lg bg-white/5 border-white/10 text-white"
                                />
                            </View>

                            <View>
                                <Text className="text-lg font-semibold mb-3 text-gray-200">Create 4-Digit PIN</Text>
                                <Input
                                    secureTextEntry
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="••••"
                                    placeholderTextColor="#6b7280"
                                    value={newPin}
                                    onChangeText={(text: string) => setNewPin(text.replace(/\D/g, ''))}
                                    className="h-16 text-center text-3xl font-bold tracking-widest bg-white/5 border-white/10 text-white"
                                />
                            </View>

                            <View>
                                <Text className="text-lg font-semibold mb-3 text-gray-200">Confirm PIN</Text>
                                <Input
                                    secureTextEntry
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="••••"
                                    placeholderTextColor="#6b7280"
                                    value={confirmPin}
                                    onChangeText={(text: string) => setConfirmPin(text.replace(/\D/g, ''))}
                                    className={cn(
                                        'h-16 text-center text-3xl font-bold tracking-widest bg-white/5 border-white/10 text-white',
                                        confirmPin && confirmPin !== newPin && 'border-red-500'
                                    )}
                                />
                                {confirmPin && confirmPin !== newPin && (
                                    <Text className="text-red-400 text-sm mt-2">PINs don't match</Text>
                                )}
                            </View>

                            <Button
                                onPress={handleCreateTeacher}
                                disabled={!newName.trim() || newPin.length !== 4 || newPin !== confirmPin}
                                className={cn("w-full bg-indigo-600 rounded-2xl h-14", (!newName.trim() || newPin.length !== 4 || newPin !== confirmPin) && "opacity-50")}
                            >
                                <Text className="text-white font-bold text-lg">Create Account 🎓</Text>
                            </Button>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
