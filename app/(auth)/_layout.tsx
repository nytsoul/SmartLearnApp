import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="role-selection" />
            <Stack.Screen name="student-login" />
            <Stack.Screen name="teacher-login" />
        </Stack>
    );
}
