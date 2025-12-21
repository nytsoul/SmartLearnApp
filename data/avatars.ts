export const avatars = [
    { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronaut' },
    { id: 'scientist', emoji: '👩‍🔬', name: 'Scientist' },
    { id: 'robot', emoji: '🤖', name: 'Robot' },
    { id: 'wizard', emoji: '🧙', name: 'Wizard' },
    { id: 'ninja', emoji: '🥷', name: 'Ninja' },
    { id: 'superhero', emoji: '🦸', name: 'Superhero' },
    { id: 'alien', emoji: '👽', name: 'Alien' },
    { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
    { id: 'dragon', emoji: '🐉', name: 'Dragon' },
    { id: 'owl', emoji: '🦉', name: 'Wise Owl' },
    { id: 'fox', emoji: '🦊', name: 'Clever Fox' },
    { id: 'lion', emoji: '🦁', name: 'Brave Lion' },
    { id: 'panda', emoji: '🐼', name: 'Panda' },
    { id: 'rocket', emoji: '🚀', name: 'Rocket' },
    { id: 'star', emoji: '⭐', name: 'Star' },
    { id: 'crown', emoji: '👑', name: 'Royal' },
];

export const badges = [
    { id: 'first-quiz', name: 'First Quiz', icon: '🎯', description: 'Complete your first quiz' },
    { id: 'streak-3', name: '3 Day Streak', icon: '🔥', description: 'Maintain a 3-day streak' },
    { id: 'streak-7', name: 'Week Warrior', icon: '⚡', description: 'Maintain a 7-day streak' },
    { id: 'streak-30', name: 'Monthly Master', icon: '🏆', description: 'Maintain a 30-day streak' },
    { id: 'perfect-score', name: 'Perfect Score', icon: '💯', description: 'Get 100% on a quiz' },
    { id: 'speed-demon', name: 'Speed Demon', icon: '⚡', description: 'Complete a timed quiz in record time' },
    { id: 'all-subjects', name: 'All-Rounder', icon: '🌟', description: 'Study all subjects in one day' },
    { id: 'coin-collector', name: 'Coin Collector', icon: '💰', description: 'Earn 1000 coins' },
    { id: 'xp-master', name: 'XP Master', icon: '✨', description: 'Earn 5000 XP' },
    { id: 'flashcard-pro', name: 'Flashcard Pro', icon: '📚', description: 'Review 100 flashcards' },
    { id: 'quiz-champion', name: 'Quiz Champion', icon: '🏅', description: 'Complete 50 quizzes' },
    { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Study before 7 AM' },
];

export const getAvatarById = (id: string) => avatars.find(a => a.id === id);
export const getBadgeById = (id: string) => badges.find(b => b.id === id);
