import { Stack } from 'expo-router';

export default function FeaturesLayout() {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="quiz-mode" options={{ title: 'Quiz Mode' }} />
            <Stack.Screen name="study-mode" options={{ title: 'Study Mode' }} />
            <Stack.Screen name="timed-quiz" options={{ title: 'Timed Quiz' }} />
            <Stack.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
            <Stack.Screen name="achievements" options={{ title: 'Achievements' }} />
            <Stack.Screen name="daily-challenge" options={{ title: 'Daily Challenge' }} />
            <Stack.Screen name="lectures" options={{ title: 'Video Lectures' }} />
            <Stack.Screen name="study-plan" options={{ title: 'Study Plan' }} />
            <Stack.Screen name="quiz-results" options={{ title: 'Quiz Results' }} />
        </Stack>
    );
}
