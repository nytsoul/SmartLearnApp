import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// Use 10.0.2.2 for Android Emulator to access localhost, or storage for physical device
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

// Get auth token from AsyncStorage
const getAuthToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('auth-token');
    } catch (e) {
        console.error("Failed to get token", e);
        return null;
    }
};

// Set auth token
export const setAuthToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('auth-token', token);
    } catch (e) {
        console.error("Failed to set token", e);
    }
};

// Remove auth token
export const removeAuthToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('auth-token');
    } catch (e) {
        console.error("Failed to remove token", e);
    }
};

// API request helper
const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<any> => {
    const token = await getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`; // Typescript casting for HeaderInit
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

// Authentication API
export const authAPI = {
    registerStudent: (data: {
        name: string;
        password: string;
        standard: number;
        avatar: string;
    }) => apiRequest('/auth/student/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    loginStudent: (data: { name: string; password: string }) =>
        apiRequest('/auth/student/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    registerTeacher: (data: {
        name: string;
        email: string;
        password: string;
        pin: string;
    }) => apiRequest('/auth/teacher/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    loginTeacher: (data: { name: string; pin: string }) =>
        apiRequest('/auth/teacher/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// Students API
export const studentsAPI = {
    getAll: (standard?: number) => {
        const query = standard ? `?standard=${standard}` : '';
        return apiRequest(`/students${query}`);
    },

    getById: (id: string) => apiRequest(`/students/${id}`),

    update: (id: string, data: any) =>
        apiRequest(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// Quizzes API
export const quizzesAPI = {
    create: (data: any) =>
        apiRequest('/quizzes', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    uploadPDF: async (formData: FormData) => {
        const token = await getAuthToken();
        const headers: any = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/quizzes/upload-pdf`, {
            method: 'POST',
            headers,
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }
        return data;
    },

    getByTeacher: (teacherId: string, standard?: number, subjectId?: string) => {
        let query = '';
        if (standard || subjectId) {
            const params = new URLSearchParams();
            if (standard) params.append('standard', standard.toString());
            if (subjectId) params.append('subjectId', subjectId);
            query = `?${params.toString()}`;
        }
        return apiRequest(`/quizzes/teacher/${teacherId}${query}`);
    },

    getBySubjectAndStandard: (subjectId: string, standard: number) =>
        apiRequest(`/quizzes/subject/${subjectId}/standard/${standard}`),

    getById: (id: string) => apiRequest(`/quizzes/${id}`),

    update: (id: string, data: any) =>
        apiRequest(`/quizzes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiRequest(`/quizzes/${id}`, {
            method: 'DELETE',
        }),

    toggleActive: (id: string) =>
        apiRequest(`/quizzes/${id}/toggle-active`, {
            method: 'PATCH',
        }),
};

// Results API
export const resultsAPI = {
    create: (data: any) =>
        apiRequest('/results', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getByStudent: (studentId: string, subjectId?: string, standard?: number) => {
        let query = '';
        if (subjectId || standard) {
            const params = new URLSearchParams();
            if (subjectId) params.append('subjectId', subjectId);
            if (standard) params.append('standard', standard.toString());
            query = `?${params.toString()}`;
        }
        return apiRequest(`/results/student/${studentId}${query}`);
    },

    getByQuiz: (quizId: string) => apiRequest(`/results/quiz/${quizId}`),
};

// Leaderboard API
export const leaderboardAPI = {
    global: (limit?: number) => {
        const query = limit ? `?limit=${limit}` : '';
        return apiRequest(`/leaderboard/global${query}`);
    },

    byStandard: (standard: number, limit?: number) => {
        const query = limit ? `?limit=${limit}` : '';
        return apiRequest(`/leaderboard/standard/${standard}${query}`);
    },
};

// Teachers API
export const teachersAPI = {
    getAll: () => apiRequest('/teachers'),

    getDashboard: (standard: number) =>
        apiRequest(`/teachers/dashboard/${standard}`),
};
