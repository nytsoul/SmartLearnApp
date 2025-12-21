import { useState } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, Copy } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function StudentLogin() {
    const router = useRouter();
    const { students, setCurrentStudent, addStudent } = useApp();
    const [view, setView] = useState<'login' | 'register' | 'success'>('register'); // Added 'success' state

    // Login State
    const [loginId, setLoginId] = useState('');

    // Register State
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [createdStudentId, setCreatedStudentId] = useState<string>('');

    const avatars = [
        '👨‍🚀', '👩‍🔬', '🤖', '🧙‍♂️', '🥷', '🦸‍♂️', '👽', '🦄',
        '🐉', '🦉', '🦊', '🦁', '🐼', '🚀', '⭐', '👑'
    ];

    const classes = Array.from({ length: 12 }, (_, i) => i + 1);

    const handleLogin = () => {
        if (!loginId) {
            Alert.alert('Whoops!', 'Please enter your Student ID.');
            return;
        }

        const student = students.find(s => s.id === loginId);
        if (student) {
            setCurrentStudent(student);
            router.replace('/(dashboard)/student-dashboard');
        } else {
            Alert.alert('Not Found', 'We couldn\'t find a student with that ID. Try creating a new account!');
        }
    };

    const handleRegister = () => {
        if (!name) {
            Alert.alert('Missing Info', 'Please enter your name!');
            return;
        }
        if (!selectedAvatar) {
            Alert.alert('Missing Info', 'Please choose an avatar!');
            return;
        }
        if (!selectedClass) {
            Alert.alert('Missing Info', 'Please select your class!');
            return;
        }

        const newId = `student-${Date.now().toString().slice(-4)}`;

        const newStudent = {
            id: newId,
            name,
            standard: selectedClass,
            avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${selectedAvatar}`,
            coins: 0,
            xp: 0,
            streak: 0,
            badges: [],
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
        };

        addStudent(newStudent);
        setCurrentStudent(newStudent);
        setCreatedStudentId(newId);
        setView('success'); // Switch to success view instead of Alert
    };

    const copyIdToClipboard = () => {
        // In a real app we'd use Clipboard API, but for now just visual feedback
        Alert.alert('Copied!', 'Student ID copied to clipboard');
    };

    const proceedToDashboard = () => {
        router.replace('/(dashboard)/student-dashboard');
    };

    if (view === 'success') {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
                <View className="bg-white/5 p-8 rounded-3xl border border-white/10 w-full max-w-sm items-center">
                    <View className="bg-green-500/20 p-4 rounded-full mb-6 border border-green-500/30">
                        <Check size={48} color="#4ade80" />
                    </View>

                    <Text className="text-3xl font-bold text-white mb-2 text-center text-glow">You're In!</Text>
                    <Text className="text-gray-300 text-center mb-8">
                        Welcome to Smart Learn, {name}!
                    </Text>

                    <Text className="text-sm text-gray-400 mb-2 font-medium uppercase tracking-wider">Your Student ID</Text>
                    <TouchableOpacity
                        onPress={copyIdToClipboard}
                        className="bg-black/30 w-full p-4 rounded-xl border border-white/10 flex-row items-center justify-between mb-8"
                    >
                        <Text className="text-2xl font-mono text-white font-bold tracking-widest">{createdStudentId}</Text>
                        <Copy size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <Button
                        onPress={proceedToDashboard}
                        className="w-full h-14 bg-violet-600 rounded-xl shadow-lg shadow-violet-500/30"
                    >
                        <Text className="text-white font-bold text-lg">Go to Dashboard 🚀</Text>
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-white/5 p-2 rounded-full border border-white/10">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-white text-glow">
                        {view === 'register' ? 'Create Profile' : 'Student Login'}
                    </Text>
                </View>

                {/* View Toggle */}
                <View className="flex-row bg-white/5 p-1 rounded-2xl mb-8 border border-white/10">
                    <TouchableOpacity
                        className={`flex-1 py-3 rounded-xl items-center transition-all ${view === 'register' ? 'bg-violet-600 shadow-md' : 'bg-transparent'}`}
                        onPress={() => setView('register')}
                    >
                        <Text className={`font-bold ${view === 'register' ? 'text-white' : 'text-gray-400'}`}>New Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-3 rounded-xl items-center transition-all ${view === 'login' ? 'bg-violet-600 shadow-md' : 'bg-transparent'}`}
                        onPress={() => setView('login')}
                    >
                        <Text className={`font-bold ${view === 'login' ? 'text-white' : 'text-gray-400'}`}>Login</Text>
                    </TouchableOpacity>
                </View>

                {view === 'register' ? (
                    <View className="gap-8">
                        {/* Avatar Section */}
                        <View>
                            <Text className="text-lg text-white font-semibold mb-4 pl-1">Choose Your Avatar</Text>
                            <View className="flex-row flex-wrap gap-3 justify-center bg-white/5 p-4 rounded-3xl border border-white/10">
                                {avatars.map((avatar, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedAvatar(avatar)}
                                        className={`w-14 h-14 rounded-2xl items-center justify-center border-2 transition-all ${selectedAvatar === avatar ? 'border-violet-500 bg-violet-500/20 scale-110' : 'border-transparent bg-white/5'}`}
                                    >
                                        <Text className="text-3xl">{avatar}</Text>
                                        {selectedAvatar === avatar && (
                                            <View className="absolute -top-1 -right-1 bg-violet-500 rounded-full p-1 border border-white/20">
                                                <Check size={8} color="white" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Name Section */}
                        <View>
                            <Text className="text-lg text-white font-semibold mb-3 pl-1">Your Name</Text>
                            <Input
                                placeholder="Enter your name"
                                placeholderTextColor="#94a3b8"
                                value={name}
                                onChangeText={setName}
                                className="bg-white/5 border-white/10 text-white text-lg h-16 rounded-2xl px-6"
                            />
                        </View>

                        {/* Class Section */}
                        <View>
                            <Text className="text-lg text-white font-semibold mb-3 pl-1">Select Your Class</Text>
                            <View className="flex-row flex-wrap gap-3 justify-center bg-white/5 p-4 rounded-3xl border border-white/10">
                                {classes.map((cls) => (
                                    <TouchableOpacity
                                        key={cls}
                                        onPress={() => setSelectedClass(cls)}
                                        className={`w-16 h-12 rounded-xl items-center justify-center border transition-all ${selectedClass === cls ? 'bg-violet-600 border-violet-400 shadow-lg shadow-violet-500/20' : 'bg-white/5 border-white/10'}`}
                                    >
                                        <Text className={`text-lg font-bold ${selectedClass === cls ? 'text-white' : 'text-gray-400'}`}>
                                            {cls}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Submit Button */}
                        <Button
                            onPress={handleRegister}
                            className="h-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-lg shadow-violet-500/20 mt-4 active:bg-violet-700 border-t border-white/20"
                        >
                            <Text className="text-xl font-bold text-white">Start Learning! 🚀</Text>
                        </Button>
                    </View>
                ) : (
                    <View className="gap-6 mt-4">
                        <View className="bg-white/5 p-6 rounded-3xl border border-white/10">
                            <Text className="text-lg text-white font-semibold mb-4 text-center">Welcome Back!</Text>
                            <Text className="text-gray-400 text-center mb-6">Enter your Student ID to continue your journey.</Text>

                            <Input
                                placeholder="e.g. student-1234"
                                placeholderTextColor="#94a3b8"
                                value={loginId}
                                onChangeText={setLoginId}
                                className="bg-black/20 border-white/10 text-white text-lg h-16 rounded-2xl px-6 mb-2 text-center font-mono"
                            />
                        </View>

                        <Button
                            onPress={handleLogin}
                            className="h-16 bg-violet-600 rounded-2xl shadow-lg shadow-violet-500/20 mt-2 active:bg-violet-700 border-t border-white/20"
                        >
                            <Text className="text-xl font-bold text-white">Resume Learning ▶️</Text>
                        </Button>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
