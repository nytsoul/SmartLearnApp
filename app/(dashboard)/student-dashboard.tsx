import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Sparkles, Trophy, BookOpen, Clock, Flame, Brain, Target, ArrowRight, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getSubjectsForStandard } from '@/data/subjects';

export default function StudentDashboard() {
    const { currentStudent, isDarkMode } = useApp();
    const router = useRouter();

    if (!currentStudent) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-background">
                <Text className="text-gray-400">Loading Profile...</Text>
            </SafeAreaView>
        );
    }

    const currentLevel = Math.floor(currentStudent.xp / 500) + 1;
    const nextLevelXp = currentLevel * 500;
    const progressToNextLevel = ((currentStudent.xp % 500) / 500) * 100;

    // Get subjects for the student's class
    const subjects = getSubjectsForStandard(currentStudent.standard);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View className="px-6 pt-6 pb-4">
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity
                            onPress={() => router.push('/(features)/avatar-shop')}
                            className="flex-row items-center gap-4"
                        >
                            <View className="h-14 w-14 rounded-full bg-primary/20 items-center justify-center border-2 border-primary/50 shadow-lg shadow-primary/20 relative">
                                <Image
                                    source={{ uri: currentStudent.avatar }}
                                    className="h-12 w-12"
                                />
                                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full w-6 h-6 items-center justify-center border border-white/20">
                                    <Text className="text-[10px] font-bold text-white">{currentLevel}</Text>
                                </View>
                            </View>
                            <View>
                                <Text className="text-sm text-muted-foreground font-medium">Welcome back,</Text>
                                <Text className="text-2xl font-bold text-foreground text-glow">{currentStudent.name}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/(features)/parent-notifications')} // Using notifications as a proxy for "messages" icon
                            className="bg-card p-2.5 rounded-full shadow-sm border border-border backdrop-blur-md"
                        >
                            <Sparkles size={24} color="#fbbf24" />
                        </TouchableOpacity>
                    </View>

                    {/* Stats Grid */}
                    <View className="flex-row gap-3 mb-6">
                        <Card className="flex-1 bg-blue-500/10 border-blue-500/20 shadow-lg backdrop-blur-md">
                            <CardContent className="p-3 py-4 items-center">
                                <Trophy size={20} color="#60a5fa" className="mb-2" />
                                <Text className="text-xl font-bold text-blue-400">{currentStudent.xp}</Text>
                                <Text className="text-[10px] text-blue-300 font-bold tracking-wider uppercase">XP</Text>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 bg-amber-500/10 border-amber-500/20 shadow-lg backdrop-blur-md">
                            <CardContent className="p-3 py-4 items-center">
                                <Sparkles size={20} color="#fbbf24" className="mb-2" />
                                <Text className="text-xl font-bold text-amber-400">{currentStudent.coins}</Text>
                                <Text className="text-[10px] text-amber-300 font-bold tracking-wider uppercase">Coins</Text>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 bg-rose-500/10 border-rose-500/20 shadow-lg backdrop-blur-md">
                            <CardContent className="p-3 py-4 items-center">
                                <Flame size={20} color="#fb7185" className="mb-2" />
                                <Text className="text-xl font-bold text-rose-400">{currentStudent.streak} 🔥</Text>
                                <Text className="text-[10px] text-rose-300 font-bold tracking-wider uppercase">Streak</Text>
                            </CardContent>
                        </Card>
                    </View>

                    {/* Level Progress */}
                    <View className="bg-card p-4 rounded-2xl border border-border mb-8 backdrop-blur-md">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-foreground font-bold">Level {currentLevel}</Text>
                            <Text className="text-muted-foreground text-xs">{currentStudent.xp} / {nextLevelXp} XP</Text>
                        </View>
                        <View className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                            <LinearGradient
                                colors={['#8b5cf6', '#d946ef']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-full rounded-full"
                                style={{ width: `${progressToNextLevel}%` }}
                            />
                        </View>
                        <Text className="text-muted-foreground text-xs mt-2 text-center">
                            {500 - (currentStudent.xp % 500)} XP to reach Level {currentLevel + 1} 🚀
                        </Text>
                    </View>

                    {/* Feature Cards Row */}
                    <View className="flex-row gap-4 mb-8">
                        {/* Daily Challenge */}
                        <TouchableOpacity
                            onPress={() => router.push('/(features)/daily-challenge')}
                            className="flex-1"
                        >
                            <LinearGradient
                                colors={['#4f46e5', '#7c3aed']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="p-4 rounded-3xl h-36 justify-between border border-white/20 shadow-lg shadow-indigo-500/30"
                            >
                                <View className="bg-white/20 self-start p-2 rounded-xl">
                                    <Target size={24} color="white" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-lg mb-1">Daily Challenge</Text>
                                    <Text className="text-indigo-100 text-xs">+50 Bonus Coins!</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Leaderboard */}
                        <TouchableOpacity
                            onPress={() => router.push('/(features)/leaderboard')}
                            className="flex-1 bg-card border border-border rounded-3xl h-36 justify-between p-4"
                        >
                            <View className="flex-row justify-between items-start">
                                <View className="bg-yellow-500/20 p-2 rounded-xl border border-yellow-500/30">
                                    <Trophy size={24} color="#facc15" />
                                </View>
                                <View className="bg-green-500/20 px-2 py-1 rounded text-center border border-green-500/30">
                                    <Text className="text-green-500 font-bold text-xs top-[1px]">#1</Text>
                                </View>
                            </View>
                            <View>
                                <Text className="text-foreground font-bold text-lg mb-1">Leaderboard</Text>
                                <Text className="text-muted-foreground text-xs">See your rank</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Subjects Grid */}
                    <View className="mb-8">
                        <View className="flex-row justify-between items-end mb-4 px-1">
                            <Text className="text-xl font-bold text-foreground">Your Subjects</Text>
                            <Text className="text-muted-foreground text-xs">{subjects.length} subjects</Text>
                        </View>
 
                        <View className="flex-row flex-wrap gap-3">
                            {subjects.map((subject) => (
                                <TouchableOpacity
                                    key={subject.id}
                                    onPress={() => router.push({ pathname: '/(dashboard)/subject', params: { subjectId: subject.id } })}
                                    className="w-[48%] bg-card border border-border rounded-2xl p-4 items-center gap-3 backdrop-blur-sm active:bg-muted"
                                >
                                    <View className="w-12 h-12 items-center justify-center bg-muted rounded-full border border-border">
                                        <Text className="text-3xl filter drop-shadow-md">{subject.icon}</Text>
                                    </View>
                                    <Text className="text-foreground font-bold text-center">{subject.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Learning Modes Scroll */}
                    <View className="mb-6">
                        <Text className="text-xl font-bold text-foreground mb-4 px-1">Learning Modes</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-4">
                            <TouchableOpacity
                                onPress={() => router.push('/(features)/timed-quiz')}
                                className="w-40 h-48 bg-card border border-border rounded-3xl p-4 justify-between mr-4"
                            >
                                <View className="bg-orange-500/20 self-start p-3 rounded-2xl border border-orange-500/30">
                                    <Clock size={28} color="#fb923c" />
                                </View>
                                <View>
                                    <Text className="text-foreground font-bold text-lg mb-1">Timed Quiz</Text>
                                    <Text className="text-muted-foreground text-xs">Beat the clock</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/(features)/study-mode')} // Assuming generic study mode entrance
                                className="w-40 h-48 bg-card border border-border rounded-3xl p-4 justify-between mr-4"
                            >
                                <View className="bg-blue-500/20 self-start p-3 rounded-2xl border border-blue-500/30">
                                    <BookOpen size={28} color="#60a5fa" />
                                </View>
                                <View>
                                    <Text className="text-foreground font-bold text-lg mb-1">Study Mode</Text>
                                    <Text className="text-muted-foreground text-xs">Flashcards</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="w-40 h-48 bg-card border border-border rounded-3xl p-4 justify-between opacity-50"
                                onPress={() => { }}
                            >
                                <View className="bg-pink-500/20 self-start p-3 rounded-2xl border border-pink-500/30">
                                    <Brain size={28} color="#f472b6" />
                                </View>
                                <View>
                                    <Text className="text-foreground font-bold text-lg mb-1">AI Learning</Text>
                                    <Text className="text-muted-foreground text-xs">Coming Soon</Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    {/* AI Learning Tools Section */}
                    <View className="mb-8">
                        <View className="flex-row items-center gap-2 mb-4">
                            <View className="bg-primary/20 p-2 rounded-lg">
                                <Brain size={20} color="#a78bfa" />
                            </View>
                            <Text className="text-xl font-bold text-foreground">AI Learning Tools</Text>
                        </View>
                        <LinearGradient
                            colors={['#7c3aed', '#4f46e5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-5 rounded-3xl border border-white/20 shadow-lg shadow-indigo-500/30"
                        >
                            <View className="flex-row flex-wrap gap-3">
                                <TouchableOpacity className="w-[48%] bg-white/10 p-3 rounded-xl border border-white/10 mb-1 active:bg-white/20">
                                    <Sparkles size={20} color="#e879f9" className="mb-2" />
                                    <Text className="text-white font-bold text-sm mb-1">2-Min Learn</Text>
                                    <Text className="text-indigo-200 text-[10px] leading-tight">Quick AI explanations</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="w-[48%] bg-white/10 p-3 rounded-xl border border-white/10 mb-1 active:bg-white/20">
                                    <BookOpen size={20} color="#60a5fa" className="mb-2" />
                                    <Text className="text-white font-bold text-sm mb-1">Notes Gen</Text>
                                    <Text className="text-indigo-200 text-[10px] leading-tight">AI summaries</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="w-[48%] bg-white/10 p-3 rounded-xl border border-white/10 active:bg-white/20">
                                    <Target size={20} color="#fb7185" className="mb-2" />
                                    <Text className="text-white font-bold text-sm mb-1">Weak Areas</Text>
                                    <Text className="text-indigo-200 text-[10px] leading-tight">Targeted practice</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="w-[48%] bg-white/10 p-3 rounded-xl border border-white/10 active:bg-white/20">
                                    <Brain size={20} color="#cbd5e1" className="mb-2" />
                                    <Text className="text-white font-bold text-sm mb-1">Summarizer</Text>
                                    <Text className="text-indigo-200 text-[10px] leading-tight">Simplify topics</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Multiplayer & Rewards Row */}
                    <View className="flex-row gap-4 mb-8">
                        {/* Multiplayer Battles */}
                        <TouchableOpacity className="flex-1 bg-orange-600 rounded-3xl p-4 justify-between border border-white/10 shadow-lg shadow-orange-500/20 active:opacity-90">
                            <View className="bg-white/20 self-start p-2 rounded-xl mb-2">
                                <Target size={24} color="white" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-lg leading-tight mb-1">Multiplayer Battles</Text>
                                <Text className="text-orange-50/80 text-xs">Compete live!</Text>
                            </View>
                        </TouchableOpacity>

                        {/* My Rewards */}
                        <View className="flex-1 bg-amber-500 rounded-3xl p-4 justify-between border border-white/10 shadow-lg shadow-amber-500/20">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="bg-white/20 p-2 rounded-xl">
                                    <Trophy size={24} color="white" />
                                </View>
                            </View>
                            <View>
                                <Text className="text-white font-bold text-lg mb-1">My Rewards</Text>
                                <View className="flex-row items-center gap-1">
                                    <Sparkles size={12} color="white" />
                                    <Text className="text-amber-50/80 text-xs font-bold">{currentStudent.coins} Coins</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Streak Calendar */}
                    <View className="bg-card border border-border rounded-3xl p-5 mb-8 backdrop-blur-md">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-2">
                                <View className="bg-blue-500/20 p-2 rounded-lg">
                                    <Clock size={18} color="#60a5fa" />
                                </View>
                                <Text className="text-foreground font-bold text-lg">Weekly Streak</Text>
                            </View>
                            <View className="flex-row items-center gap-1 bg-rose-500/20 px-2 py-1 rounded-full border border-rose-500/30">
                                <Flame size={12} color="#fb7185" fill="#fb7185" />
                                <Text className="text-rose-500 font-bold text-xs">{currentStudent.streak} Days</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                <View key={index} className="items-center gap-2">
                                    <Text className="text-muted-foreground text-xs font-medium">{day}</Text>
                                    <View className={`w-8 h-8 rounded-full items-center justify-center border ${index === 2 ? 'bg-green-500 border-green-400 shadow-md shadow-green-500/30' : 'bg-muted border-border'}`}>
                                        {index === 2 && <Sparkles size={14} color="white" />}
                                    </View>
                                </View>
                            ))}
                        </View>
                        <Text className="text-muted-foreground text-xs text-center">
                            Keep learning for 5 more days to win a scratch card! 🎁
                        </Text>
                    </View>

                    {/* Recent Activity (Empty State) */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-foreground mb-4 px-1">Recent Activity</Text>
                        <View className="bg-card border border-border rounded-3xl p-8 items-center justify-center border-dashed border-2 border-border/50">
                            <View className="bg-muted p-4 rounded-full mb-4">
                                <BookOpen size={32} color={isDarkMode ? "#94a3b8" : "#64748b"} />
                            </View>
                            <Text className="text-foreground font-bold text-lg mb-1">No quizzes yet!</Text>
                            <Text className="text-muted-foreground text-sm mb-6 text-center">Start learning to see your progress here.</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(features)/subjects')}
                                className="bg-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/30 flex-row items-center gap-2"
                            >
                                <Text className="text-white font-bold">Take Your First Quiz 🚀</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
