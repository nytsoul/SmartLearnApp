import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/Card';
import {
    Play,
    Clock,
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    MoreVertical,
    Download
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getSubjectsForStandard } from '@/data/subjects';
import React from 'react';

export default function LecturesScreen() {
    const { currentStudent } = useApp();
    const router = useRouter();
    const { subjectId } = useLocalSearchParams();

    if (!currentStudent) return null;

    const subjects = getSubjectsForStandard(currentStudent.standard);
    const subject = subjects.find(s => s.id === subjectId) || subjects[0];

    // Dummy lectures data
    const lectures = [
        { id: '1', title: 'Introduction to ' + subject.name, duration: '12:45', completed: true, thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400' },
        { id: '2', title: 'Core Concepts Part 1', duration: '18:20', completed: false, thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400' },
        { id: '3', title: 'Core Concepts Part 2', duration: '15:10', completed: false, thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400' },
        { id: '4', title: 'Advanced Applications', duration: '22:30', completed: false, thumbnail: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=400' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center bg-white/5 rounded-full">
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Video Lectures</Text>
                <TouchableOpacity className="h-10 w-10 items-center justify-center bg-white/5 rounded-full">
                    <MoreVertical size={20} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                {/* Featured / Last Watched */}
                <Text className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Continue Watching</Text>

                <TouchableOpacity className="mb-8 overflow-hidden rounded-[32px] border border-white/10 shadow-xl">
                    <Image
                        source={{ uri: lectures[1].thumbnail }}
                        className="h-56 w-full"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        className="absolute inset-0 justify-end p-6"
                    >
                        <View className="bg-emerald-500 self-start px-3 py-1 rounded-full mb-3">
                            <Text className="text-white text-[10px] font-bold">CHAPTER 2</Text>
                        </View>
                        <Text className="text-white text-2xl font-bold mb-2">{lectures[1].title}</Text>
                        <View className="flex-row items-center gap-4">
                            <View className="flex-row items-center gap-2">
                                <Clock size={16} color="#94a3b8" />
                                <Text className="text-gray-300 text-sm">18 mins remaining</Text>
                            </View>
                            <View className="bg-white/20 h-10 w-10 rounded-full items-center justify-center backdrop-blur-md">
                                <Play size={20} color="white" fill="white" />
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Playlist Section */}
                <View className="flex-row justify-between items-end mb-6">
                    <View>
                        <Text className="text-2xl font-bold text-white">{subject.name} Playlist</Text>
                        <Text className="text-emerald-400 text-sm font-medium">{lectures.length} Total Lessons</Text>
                    </View>
                    <TouchableOpacity className="flex-row items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                        <Download size={16} color="#34d399" />
                        <Text className="text-emerald-400 font-bold text-xs">Save All</Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-4">
                    {lectures.map((lecture, index) => (
                        <TouchableOpacity
                            key={lecture.id}
                            className={`flex-row items-center gap-4 p-4 rounded-3xl border ${lecture.completed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/5 border-white/10'}`}
                        >
                            <View className="relative">
                                <Image source={{ uri: lecture.thumbnail }} className="h-16 w-24 rounded-xl" />
                                <View className="absolute inset-0 bg-black/20 items-center justify-center rounded-xl">
                                    <Play size={16} color="white" />
                                </View>
                            </View>

                            <View className="flex-1">
                                <Text className={`font-bold mb-1 ${lecture.completed ? 'text-emerald-400' : 'text-white'}`}>
                                    {index + 1}. {lecture.title}
                                </Text>
                                <View className="flex-row items-center gap-3">
                                    <Text className="text-gray-500 text-xs">{lecture.duration}</Text>
                                    {lecture.completed && (
                                        <View className="flex-row items-center gap-1">
                                            <CheckCircle2 size={12} color="#10b981" />
                                            <Text className="text-emerald-500 text-[10px] font-bold">COMPLETED</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity className="h-8 w-8 items-center justify-center">
                                <Download size={18} color="#475569" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
