import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import {
    Calendar,
    ChevronLeft,
    CheckCircle2,
    Circle,
    BookOpen,
    Clock,
    Flame,
    Target
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

export default function StudyPlanScreen() {
    const { currentStudent } = useApp();
    const router = useRouter();

    if (!currentStudent) return null;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIndex = 2; // Wednesday for demo

    const planItems = [
        { id: '1', time: '09:00 AM', subject: 'Mathematics', topic: 'Algebraic Expressions', type: 'Lecture', completed: true },
        { id: '2', time: '11:30 AM', subject: 'Science', topic: 'The Living World', type: 'Quiz', completed: true },
        { id: '3', time: '02:00 PM', subject: 'English', topic: 'Grammar: Tenses', type: 'Practice', completed: false },
        { id: '4', time: '04:30 PM', subject: 'History', topic: 'Ancient Civilizations', type: 'Review', completed: false },
    ];

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center bg-white/5 rounded-full mr-4">
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Interactive Study Plan</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                {/* Weekly Calendar Strip */}
                <View className="flex-row justify-between mb-8 bg-white/5 p-4 rounded-3xl border border-white/10">
                    {days.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`items-center p-2 rounded-2xl w-10 ${index === currentDayIndex ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : ''}`}
                        >
                            <Text className={`text-[10px] font-bold mb-1 ${index === currentDayIndex ? 'text-white' : 'text-gray-500'}`}>{day}</Text>
                            <Text className={`text-sm font-bold ${index === currentDayIndex ? 'text-white' : 'text-gray-300'}`}>{14 + index}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Daily Goal Card */}
                <LinearGradient
                    colors={['#10b981', '#064e3b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-6 rounded-[32px] mb-8 border border-white/20 shadow-xl"
                >
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center gap-2">
                            <Target size={20} color="white" />
                            <Text className="text-white font-bold">Daily Progress</Text>
                        </View>
                        <Text className="text-white/80 text-xs font-medium">50% Completed</Text>
                    </View>
                    <View className="h-3 bg-black/20 rounded-full overflow-hidden p-[2px] mb-4">
                        <View className="h-full bg-white rounded-full" style={{ width: '50%' }} />
                    </View>
                    <Text className="text-white/90 text-sm leading-relaxed">
                        You're doing great! Complete 2 more tasks to maintain your {currentStudent.streak} day streak. 🚀
                    </Text>
                </LinearGradient>

                {/* Timeline */}
                <Text className="text-gray-400 font-bold mb-6 uppercase tracking-widest text-xs">Today's Schedule</Text>

                <View className="pl-4">
                    {planItems.map((item, index) => (
                        <View key={item.id} className="flex-row mb-8 relative">
                            {/* Connector Line */}
                            {index !== planItems.length - 1 && (
                                <View className="absolute left-[11px] top-8 bottom-[-32px] w-[2px] bg-white/5" />
                            )}

                            {/* Dot */}
                            <View className={`h-6 w-6 rounded-full border-4 border-background z-10 bg-background items-center justify-center -ml-[1px]`}>
                                {item.completed ? (
                                    <CheckCircle2 size={18} color="#10b981" />
                                ) : (
                                    <Circle size={18} color="#475569" />
                                )}
                            </View>

                            <TouchableOpacity className={`flex-1 ml-6 p-5 rounded-3xl border ${item.completed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/5 border-white/10'}`}>
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-row items-center gap-2">
                                        <Clock size={14} color="#64748b" />
                                        <Text className="text-gray-500 text-xs font-bold">{item.time}</Text>
                                    </View>
                                    <View className={`px-2 py-1 rounded-lg ${item.type === 'Lecture' ? 'bg-blue-500/20' : item.type === 'Quiz' ? 'bg-purple-500/20' : 'bg-amber-500/20'}`}>
                                        <Text className={`text-[10px] font-bold ${item.type === 'Lecture' ? 'text-blue-400' : item.type === 'Quiz' ? 'text-purple-400' : 'text-amber-400'}`}>
                                            {item.type.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                                <Text className={`text-lg font-bold mb-1 ${item.completed ? 'text-emerald-400' : 'text-white'}`}>{item.subject}</Text>
                                <Text className="text-gray-400 text-sm">{item.topic}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Bottom Stats or Motivation */}
                <View className="bg-white/5 rounded-3xl p-6 border border-white/10 flex-row items-center gap-4">
                    <View className="h-12 w-12 bg-amber-500/20 rounded-2xl items-center justify-center">
                        <Flame size={24} color="#fbbf24" fill="#fbbf24" />
                    </View>
                    <View>
                        <Text className="text-white font-bold">Upcoming: Exam Prep</Text>
                        <Text className="text-gray-500 text-xs">Starts in 2 days • Final Term</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
