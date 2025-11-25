"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningAnalyticsEngine = void 0;
class LearningAnalyticsEngine {
    constructor(db) {
        this.db = db;
    }
    async getUserLearningPatterns(userId, timeframe = '30d') {
        const sessions = await this.db.readingSessions.findByUserId(userId, timeframe);
        const patterns = {
            preferredSubjects: this.analyzePreferredSubjects(sessions),
            readingTimes: this.analyzeReadingTimes(sessions),
            learningProgress: await this.analyzeLearningProgress(userId, sessions),
            comprehensionMetrics: await this.analyzeComprehension(userId),
            costAnalysis: this.analyzeCostPatterns(sessions)
        };
        return patterns;
    }
    async analyzeLearningProgress(userId, sessions) {
        const progress = {
            totalReadingTime: sessions.reduce((sum, s) => sum + s.duration, 0),
            booksCompleted: await this.db.books.getCompletedCount(userId),
            subjectsMastered: await this.getMasteredSubjects(userId),
            readingSpeed: this.calculateReadingSpeed(sessions),
            consistencyScore: this.calculateConsistency(sessions)
        };
        return progress;
    }
    async getMasteredSubjects(userId) {
        const userBooks = await this.db.books.getUserBooks(userId);
        const subjectScores = {};
        for (const book of userBooks) {
            const subject = book.category;
            const quizScores = await this.db.quizzes.getScores(userId, book.id);
            const avgScore = quizScores.length > 0 ? quizScores.reduce((sum, q) => sum + q.score, 0) / quizScores.length : 0;
            subjectScores[subject] = (subjectScores[subject] || 0) + avgScore;
        }
        return Object.entries(subjectScores).filter(([_, score]) => score > 80).map(([subject]) => subject);
    }
    calculateReadingSpeed(sessions) {
        if (!sessions.length)
            return 0;
        const totalWords = sessions.reduce((sum, s) => sum + (s.wordsRead || 0), 0);
        const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
        return totalMinutes > 0 ? Math.round(totalWords / totalMinutes) : 0;
    }
    calculateConsistency(sessions) {
        if (!sessions.length)
            return 0;
        const readingDays = new Set(sessions.map((s) => new Date(s.startTime).toDateString())).size;
        const totalDays = 30;
        return Math.round((readingDays / totalDays) * 100);
    }
    analyzeCostPatterns(sessions) {
        const dailyCosts = {};
        const subjectCosts = {};
        sessions.forEach((s) => {
            const date = new Date(s.startTime).toDateString();
            const subject = s.bookCategory;
            dailyCosts[date] = (dailyCosts[date] || 0) + (s.cost || 0);
            subjectCosts[subject] = (subjectCosts[subject] || 0) + (s.cost || 0);
        });
        const totalSpent = sessions.reduce((sum, s) => sum + (s.cost || 0), 0);
        const averageDailyCost = Object.values(dailyCosts).reduce((sum, c) => sum + c, 0) / Math.max(1, Object.keys(dailyCosts).length);
        return { totalSpent, averageDailyCost, dailyCosts, subjectCosts, costEfficiency: this.calculateCostEfficiency(sessions) };
    }
    calculateCostEfficiency(sessions) {
        const totalCost = sessions.reduce((sum, s) => sum + (s.cost || 0), 0);
        const totalLearningValue = sessions.reduce((sum, s) => sum + (s.quizScore || 50), 0);
        return totalCost > 0 ? Math.round((totalLearningValue / totalCost) * 100) / 100 : 0;
    }
    async generateLearningReport(userId, timeframe = '30d') {
        const patterns = await this.getUserLearningPatterns(userId, timeframe);
        const recommendations = await this.generateRecommendations(patterns);
        return {
            summary: {
                timeframe,
                totalReadingTime: patterns.readingTimes.totalTime,
                booksCompleted: patterns.learningProgress.booksCompleted,
                totalSpent: patterns.costAnalysis.totalSpent,
                consistencyScore: patterns.learningProgress.consistencyScore
            },
            strengths: this.identifyStrengths(patterns),
            areasForImprovement: this.identifyImprovementAreas(patterns),
            recommendations,
            detailedAnalysis: patterns
        };
    }
    identifyStrengths(patterns) {
        const strengths = [];
        if (patterns.learningProgress.consistencyScore > 80)
            strengths.push('Excellent reading consistency');
        if (patterns.learningProgress.readingSpeed > 200)
            strengths.push('Good reading speed');
        if (patterns.comprehensionMetrics.averageScore > 80)
            strengths.push('Strong comprehension skills');
        return strengths;
    }
    identifyImprovementAreas(patterns) {
        const areas = [];
        if (patterns.learningProgress.consistencyScore < 50)
            areas.push('Try to establish a more consistent reading schedule');
        if (patterns.costAnalysis.costEfficiency < 1.0)
            areas.push('Consider focusing on higher-value learning materials');
        return areas;
    }
    async generateRecommendations(patterns) {
        const recommendations = [];
        const weakSubjects = await this.getWeakSubjects(patterns);
        if (weakSubjects.length)
            recommendations.push(`Focus on improving in: ${weakSubjects.join(', ')}`);
        if (patterns.readingTimes.peakHours?.length)
            recommendations.push(`Your most productive reading time is around ${patterns.readingTimes.peakHours[0]}:00`);
        if (patterns.costAnalysis.averageDailyCost > 10)
            recommendations.push('Consider using pay-per-use during off-peak hours for cost savings');
        return recommendations;
    }
    async getWeakSubjects(_patterns) { return []; }
    analyzePreferredSubjects(_sessions) { return []; }
    analyzeReadingTimes(_sessions) { return { peakHours: [], totalTime: 0 }; }
    async analyzeComprehension(_userId) { return { averageScore: 0 }; }
}
exports.LearningAnalyticsEngine = LearningAnalyticsEngine;
