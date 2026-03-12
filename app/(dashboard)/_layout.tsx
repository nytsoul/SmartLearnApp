import { Stack } from 'expo-router';

export default function DashboardLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="student-dashboard" />
            <Stack.Screen name="teacher-dashboard" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="subject" />
        </Stack>
    );
}
