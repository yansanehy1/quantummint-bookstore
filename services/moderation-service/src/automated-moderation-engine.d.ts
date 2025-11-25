interface ModerationFeedback {
    content: any;
    correct: boolean;
}
export declare class AutomatedModerationEngine {
    private languageClient;
    private visionClient;
    private esClient;
    private db;
    private serviceRegistry;
    private readonly THRESHOLDS;
    constructor();
    moderateContent(content: {
        type: 'book' | 'review' | 'user_profile' | 'message';
        content: string;
        images?: string[];
        metadata?: any;
        authorId?: string;
    }): Promise<ModerationResult>;
    private moderateText;
    private detectToxicity;
    private getContentRules;
    private applyContentRules;
    private moderateImage;
    private isBase64;
    private evaluateImageSafety;
    private checkPlagiarism;
    private detectSpam;
    private extractSpamFeatures;
    private countSpamKeywords;
    private calculateSpamScore;
    private analyzeUserBehavior;
    private calculateTrustScore;
    private calculatePostingFrequency;
    private identifyBehaviorPatterns;
    private aggregateResults;
    private executeModerationAction;
    private rejectContent;
    private flagForReview;
    private approveContent;
    private calculateReviewPriority;
    trainModerationModel(feedbackData: ModerationFeedback[]): Promise<void>;
    private extractFeatures;
}
export {};
