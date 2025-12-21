import "../global.css";
import { Stack, useRouter, Slot } from "expo-router";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { useEffect } from "react";
import { View, Text } from "react-native";

function AuthCheck() {
    const { currentRole, currentStudent, currentTeacher, isLoading } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!currentRole) {
            router.replace("/(auth)/role-selection");
        } else if (currentRole === 'student' && currentStudent) {
            router.replace("/(dashboard)/student-dashboard");
        } else if (currentRole === 'teacher' && currentTeacher) {
            router.replace("/(dashboard)/teacher-dashboard");
        } else {
            // Role is set but no specific profile selected? Go to role selection or login
            if (currentRole === 'student') router.replace("/(auth)/student-login");
            else if (currentRole === 'teacher') router.replace("/(auth)/teacher-login");
        }
    }, [currentRole, currentStudent, currentTeacher, isLoading]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text>Loading...</Text>
            </View>
        );
    }

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AppProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
            </Stack>
        </AppProvider>
    );
}
