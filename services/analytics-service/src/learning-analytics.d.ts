export declare class LearningAnalyticsEngine {
    private readonly db;
    constructor(db: any);
    getUserLearningPatterns(userId: string, timeframe?: string): Promise<{
        preferredSubjects: string[];
        readingTimes: any;
        learningProgress: {
            totalReadingTime: any;
            booksCompleted: any;
            subjectsMastered: string[];
            readingSpeed: number;
            consistencyScore: number;
        };
        comprehensionMetrics: any;
        costAnalysis: any;
    }>;
    analyzeLearningProgress(userId: string, sessions: any[]): Promise<{
        totalReadingTime: any;
        booksCompleted: any;
        subjectsMastered: string[];
        readingSpeed: number;
        consistencyScore: number;
    }>;
    getMasteredSubjects(userId: string): Promise<string[]>;
    calculateReadingSpeed(sessions: any[]): number;
    calculateConsistency(sessions: any[]): number;
    analyzeCostPatterns(sessions: any[]): any;
    calculateCostEfficiency(sessions: any[]): number;
    generateLearningReport(userId: string, timeframe?: string): Promise<{
        summary: {
            timeframe: string;
            totalReadingTime: any;
            booksCompleted: any;
            totalSpent: any;
            consistencyScore: number;
        };
        strengths: string[];
        areasForImprovement: string[];
        recommendations: string[];
        detailedAnalysis: {
            preferredSubjects: string[];
            readingTimes: any;
            learningProgress: {
                totalReadingTime: any;
                booksCompleted: any;
                subjectsMastered: string[];
                readingSpeed: number;
                consistencyScore: number;
            };
            comprehensionMetrics: any;
            costAnalysis: any;
        };
    }>;
    private identifyStrengths;
    private identifyImprovementAreas;
    private generateRecommendations;
    private getWeakSubjects;
    private analyzePreferredSubjects;
    private analyzeReadingTimes;
    private analyzeComprehension;
}
