import { Subject } from '@/types';

export const subjects: Subject[] = [
    // Primary Classes (1-5)
    {
        id: 'tamil',
        name: 'Tamil',
        icon: '📚',
        color: 'hsl(0, 72%, 50%)',
        standards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
        id: 'english',
        name: 'English',
        icon: '📖',
        color: 'hsl(217, 91%, 60%)',
        standards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
        id: 'maths',
        name: 'Mathematics',
        icon: '🔢',
        color: 'hsl(262, 83%, 58%)',
        standards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
        id: 'science',
        name: 'Science',
        icon: '🔬',
        color: 'hsl(142, 76%, 45%)',
        standards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
        id: 'social',
        name: 'Social Science',
        icon: '🌍',
        color: 'hsl(38, 92%, 50%)',
        standards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
        id: 'evs',
        name: 'EVS',
        icon: '🌱',
        color: 'hsl(120, 60%, 45%)',
        standards: [1, 2, 3, 4, 5],
    },
    // Higher Secondary (11-12)
    {
        id: 'physics',
        name: 'Physics',
        icon: '⚛️',
        color: 'hsl(200, 80%, 50%)',
        standards: [11, 12],
    },
    {
        id: 'chemistry',
        name: 'Chemistry',
        icon: '🧪',
        color: 'hsl(280, 70%, 50%)',
        standards: [11, 12],
    },
    {
        id: 'biology',
        name: 'Biology',
        icon: '🧬',
        color: 'hsl(150, 70%, 40%)',
        standards: [11, 12],
    },
    {
        id: 'computer-science',
        name: 'Computer Science',
        icon: '💻',
        color: 'hsl(210, 90%, 55%)',
        standards: [11, 12],
    },
    {
        id: 'accountancy',
        name: 'Accountancy',
        icon: '📊',
        color: 'hsl(45, 85%, 50%)',
        standards: [11, 12],
    },
    {
        id: 'economics',
        name: 'Economics',
        icon: '📈',
        color: 'hsl(340, 70%, 50%)',
        standards: [11, 12],
    },
    {
        id: 'commerce',
        name: 'Commerce',
        icon: '🏪',
        color: 'hsl(25, 80%, 50%)',
        standards: [11, 12],
    },
];

export const getSubjectsForStandard = (standard: number): Subject[] => {
    return subjects.filter(subject => subject.standards.includes(standard));
};

export const getSubjectById = (id: string): Subject | undefined => {
    return subjects.find(subject => subject.id === id);
};
