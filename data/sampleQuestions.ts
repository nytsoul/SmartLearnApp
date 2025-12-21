import { QuizQuestion, Flashcard } from '@/types';

export const sampleQuestions: QuizQuestion[] = [
    // Tamil Questions
    {
        id: "tamil1",
        subjectId: "tamil",
        standard: 1,
        chapter: "எழுத்துக்கள்",
        question: "எத்தனை தமிழ் எழுத்துகள் உள்ளன?",
        options: ["247", "246", "248", "245"],
        correctAnswer: 0,
        explanation: "தமிழில் மொத்தம் 247 எழுத்துகள் உள்ளன."
    },
    {
        id: "tamil2",
        subjectId: "tamil",
        standard: 1,
        chapter: "உயிர் எழுத்துகள்",
        question: "எத்தனை உயிர் எழுத்துகள் உள்ளன?",
        options: ["10", "12", "15", "18"],
        correctAnswer: 1,
        explanation: "தமிழில் 12 உயிர் எழுத்துகள் உள்ளன."
    },
    // Maths Questions
    {
        id: "maths1",
        subjectId: "maths",
        standard: 5,
        chapter: "Arithmetic",
        question: "What is 15 * 5?",
        options: ["65", "75", "85", "55"],
        correctAnswer: 1,
        explanation: "15 * 5 = 75"
    },
    {
        id: "maths2",
        subjectId: "maths",
        standard: 5,
        chapter: "Fractions",
        question: "What is 1/2 + 1/4?",
        options: ["2/6", "3/4", "1/3", "2/4"],
        correctAnswer: 1,
        explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4"
    },
    // Science Questions
    {
        id: "sci1",
        subjectId: "science",
        standard: 5,
        chapter: "Living World",
        question: "Which of the following is NOT a characteristic of living things?",
        options: ["Growth", "Respiration", "Rusting", "Reproduction"],
        correctAnswer: 2,
        explanation: "Rusting is a chemical process that happens to non-living things like iron."
    },
    // English Questions
    {
        id: "eng1",
        subjectId: "english",
        standard: 5,
        chapter: "Grammar",
        question: "What is the plural of 'child'?",
        options: ["childs", "children", "childes", "child"],
        correctAnswer: 1,
        explanation: "The plural of 'child' is 'children'."
    },
    // Social Science Questions
    {
        id: "soc1",
        subjectId: "social",
        standard: 5,
        chapter: "Geography",
        question: "What is the capital of India?",
        options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        correctAnswer: 1,
        explanation: "New Delhi is the capital of India."
    },
];

export const sampleFlashcards: Flashcard[] = [
    // Tamil Flashcards
    {
        id: "ftamil1",
        subjectId: "tamil",
        standard: 1,
        chapter: "எழுத்துக்கள்",
        question: "உயிர் எழுத்துகள் என்றால் என்ன?",
        answer: "உயிர் எழுத்துகள் தனித்து ஒலிக்கக்கூடிய எழுத்துகள். அ, ஆ, இ, ஈ, உ, ஊ, எ, ஏ, ஐ, ஒ, ஓ, ஔ - ஆகிய 12 எழுத்துகள் உயிர் எழுத்துகளாகும்."
    },
    {
        id: "ftamil2",
        subjectId: "tamil",
        standard: 1,
        chapter: "எழுத்துக்கள்",
        question: "மெய் எழுத்துகள் எத்தனை?",
        answer: "மெய் எழுத்துகள் 18. க், ங், ச், ஞ், ட், ண், த், ந், ப், ம், ய், ர், ல், வ், ழ், ள், ற், ன்."
    },
    // Maths Flashcards
    {
        id: "fmaths1",
        subjectId: "maths",
        standard: 5,
        chapter: "Multiplication",
        question: "What is 12 × 12?",
        answer: "12 × 12 = 144. This is part of the multiplication tables."
    },
    {
        id: "fmaths2",
        subjectId: "maths",
        standard: 5,
        chapter: "Division",
        question: "What is 144 ÷ 12?",
        answer: "144 ÷ 12 = 12. Division is the inverse of multiplication."
    },
    // Science Flashcards
    {
        id: "fsci1",
        subjectId: "science",
        standard: 5,
        chapter: "Plants",
        question: "What is photosynthesis?",
        answer: "Photosynthesis is the process by which plants make their own food using sunlight, water, and carbon dioxide."
    },
    // English Flashcards
    {
        id: "feng1",
        subjectId: "english",
        standard: 5,
        chapter: "Vocabulary",
        question: "What is a synonym?",
        answer: "A synonym is a word that has the same or nearly the same meaning as another word. Example: happy and joyful."
    },
];

export const getQuestionsForSubject = (subjectId: string, standard: number): QuizQuestion[] => {
    return sampleQuestions.filter(q => q.subjectId === subjectId && q.standard === standard);
};

export const getFlashcardsForSubject = (subjectId: string, standard: number): Flashcard[] => {
    return sampleFlashcards.filter(f => f.subjectId === subjectId && f.standard === standard);
};

export const getDailyQuestions = (standard: number, count: number = 5): QuizQuestion[] => {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + standard;
    
    const standardQuestions = sampleQuestions.filter(q => q.standard === standard || Math.abs(q.standard - standard) <= 1);
    
    // Shuffle based on date seed
    const shuffled = [...standardQuestions].sort((a, b) => {
        const hashA = (seed + a.id.charCodeAt(0)) % 100;
        const hashB = (seed + b.id.charCodeAt(0)) % 100;
        return hashA - hashB;
    });
    
    return shuffled.slice(0, count);
};
