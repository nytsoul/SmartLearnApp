import { useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Badge, StudentProfile } from '@/types';
import { badges } from '@/data/avatars';

export interface BadgeCheckResult {
    newBadges: Badge[];
    alreadyHad: boolean;
}

export function useBadges() {
    const { currentStudent, updateStudent, quizResults } = useApp();

    const hasBadge = useCallback((badgeId: string): boolean => {
        return currentStudent?.badges.some(b => b.id === badgeId) ?? false;
    }, [currentStudent]);

    const awardBadge = useCallback((badgeId: string): Badge | null => {
        if (!currentStudent || hasBadge(badgeId)) return null;

        const badgeTemplate = badges.find(b => b.id === badgeId);
        if (!badgeTemplate) return null;

        const newBadge: Badge = {
            ...badgeTemplate,
            earnedAt: new Date().toISOString(),
        };

        const updatedStudent: StudentProfile = {
            ...currentStudent,
            badges: [...currentStudent.badges, newBadge],
        };

        updateStudent(updatedStudent);
        return newBadge;
    }, [currentStudent, hasBadge, updateStudent]);

    const checkAndAwardBadges = useCallback((context: {
        quizCompleted?: boolean;
        perfectScore?: boolean;
        timedQuizTime?: number;
        flashcardsReviewed?: number;
    }): Badge[] => {
        if (!currentStudent) return [];

        const newlyAwarded: Badge[] = [];

        // First Quiz badge
        if (context.quizCompleted) {
            const studentQuizzes = quizResults.filter(r => r.studentId === currentStudent.id);
            if (studentQuizzes.length === 0 || !hasBadge('first-quiz')) {
                const badge = awardBadge('first-quiz');
                if (badge) newlyAwarded.push(badge);
            }
        }

        // Perfect Score badge
        if (context.perfectScore && !hasBadge('perfect-score')) {
            const badge = awardBadge('perfect-score');
            if (badge) newlyAwarded.push(badge);
        }

        // Speed Demon badge
        if (context.timedQuizTime && context.timedQuizTime < 60 && !hasBadge('speed-demon')) {
            const badge = awardBadge('speed-demon');
            if (badge) newlyAwarded.push(badge);
        }

        // Streak badges
        if (currentStudent.streak >= 3 && !hasBadge('streak-3')) {
            const badge = awardBadge('streak-3');
            if (badge) newlyAwarded.push(badge);
        }
        if (currentStudent.streak >= 7 && !hasBadge('streak-7')) {
            const badge = awardBadge('streak-7');
            if (badge) newlyAwarded.push(badge);
        }
        if (currentStudent.streak >= 30 && !hasBadge('streak-30')) {
            const badge = awardBadge('streak-30');
            if (badge) newlyAwarded.push(badge);
        }

        // Coin Collector badge
        if (currentStudent.coins >= 1000 && !hasBadge('coin-collector')) {
            const badge = awardBadge('coin-collector');
            if (badge) newlyAwarded.push(badge);
        }

        // XP Master badge
        if (currentStudent.xp >= 5000 && !hasBadge('xp-master')) {
            const badge = awardBadge('xp-master');
            if (badge) newlyAwarded.push(badge);
        }

        // Flashcard Pro badge
        if (context.flashcardsReviewed && context.flashcardsReviewed >= 100 && !hasBadge('flashcard-pro')) {
            const badge = awardBadge('flashcard-pro');
            if (badge) newlyAwarded.push(badge);
        }

        // Quiz Champion badge
        const totalQuizzes = quizResults.filter(r => r.studentId === currentStudent.id).length;
        if (totalQuizzes >= 50 && !hasBadge('quiz-champion')) {
            const badge = awardBadge('quiz-champion');
            if (badge) newlyAwarded.push(badge);
        }

        // Early Bird badge
        const currentHour = new Date().getHours();
        if (currentHour < 7 && !hasBadge('early-bird')) {
            const badge = awardBadge('early-bird');
            if (badge) newlyAwarded.push(badge);
        }

        return newlyAwarded;
    }, [currentStudent, quizResults, hasBadge, awardBadge]);

    const getAllBadgesWithStatus = useCallback(() => {
        return badges.map(badge => ({
            ...badge,
            earned: hasBadge(badge.id),
            earnedAt: currentStudent?.badges.find(b => b.id === badge.id)?.earnedAt,
        }));
    }, [currentStudent, hasBadge]);

    return {
        hasBadge,
        awardBadge,
        checkAndAwardBadges,
        getAllBadgesWithStatus,
        earnedBadges: currentStudent?.badges ?? [],
    };
}
