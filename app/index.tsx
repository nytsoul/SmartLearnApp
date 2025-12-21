import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Sparkles } from 'lucide-react-native';

export default function LandingPage() {
    const router = useRouter();

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1620641788421-7a1c3724c07c?q=80&w=2670&auto=format&fit=crop' }}
            className="flex-1"
            resizeMode="cover"
        >
            <LinearGradient
                colors={['rgba(30, 27, 75, 0.85)', 'rgba(15, 23, 42, 0.95)']} // Dark Violet/Slate
                className="flex-1"
            >
                <SafeAreaView className="flex-1 px-6 justify-between py-12">
                    <View className="items-center mt-6">
                        <View className="bg-violet-500/20 p-4 rounded-full mb-6 border border-violet-500/30">
                            <Sparkles size={48} color="#a78bfa" />
                        </View>
                        <Text className="text-4xl font-bold text-white text-center mb-2 text-glow">
                            Smart Learn
                        </Text>
                        <Text className="text-xl text-gray-200 text-center px-4 mb-8 font-medium">
                            Gamified learning for the next generation of scholars.
                        </Text>

                        {/* Features List - Dark Glass */}
                        <View className="w-full gap-4">
                            <View className="flex-row items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                                <View className="bg-blue-500/20 p-2 rounded-full">
                                    <Sparkles size={20} color="#60a5fa" />
                                </View>
                                <View>
                                    <Text className="font-bold text-white text-lg">Gamified Learning</Text>
                                    <Text className="text-gray-200 text-sm">Earn badges & XP as you learn</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/20 shadow-lg backdrop-blur-md">
                                <View className="bg-purple-500/20 p-2 rounded-full">
                                    <Sparkles size={20} color="#c084fc" />
                                </View>
                                <View>
                                    <Text className="font-bold text-white text-lg">Interactive Quizzes</Text>
                                    <Text className="text-gray-200 text-sm">Test your knowledge instantly</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/20 shadow-lg backdrop-blur-md">
                                <View className="bg-pink-500/20 p-2 rounded-full">
                                    <Sparkles size={20} color="#f472b6" />
                                </View>
                                <View>
                                    <Text className="font-bold text-white text-lg">Track Progress</Text>
                                    <Text className="text-gray-200 text-sm">Visualize your daily growth</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="gap-4 w-full">
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/role-selection')}
                            className="bg-violet-600 h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-violet-900 border border-violet-500/50"
                        >
                            <Text className="text-white font-bold text-lg mr-2">Get Started</Text>
                            <ArrowRight size={20} color="white" />
                        </TouchableOpacity>

                        <View className="flex-row justify-center mt-4">
                            <Text className="text-gray-300 font-medium">Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/role-selection')}>
                                <Text className="text-violet-300 font-bold ml-1">Log in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </ImageBackground>
    );
}
